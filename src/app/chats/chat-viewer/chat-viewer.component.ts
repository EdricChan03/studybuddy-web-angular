import { ChangeDetectionStrategy, Component, OnDestroy, SecurityContext, TemplateRef, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { firestore } from 'firebase';
import { from, Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { ActionItem, ActionItemType } from '../../components/toolbar/models/action-item';
import { ChatInfoDialogComponent } from '../../dialogs';
import { EditChatDialogComponent } from '../../dialogs/edit-chat-dialog/edit-chat-dialog.component';
import { Chat, ChatMessage } from '../../interfaces';
import { SharedService } from '../../shared.service';
import { ToolbarService } from '../../toolbar.service';
import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { DialogsService } from 'src/app/core/dialogs/dialogs.service';

@Component({
  selector: 'app-chat-viewer',
  templateUrl: './chat-viewer.component.html',
  styleUrls: ['./chat-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatViewerComponent implements OnDestroy {

  chat: Chat;
  chat$: Observable<Chat>;
  chatDocument: AngularFirestoreDocument<Chat>;
  messages$: Observable<(ChatMessage & { authorData: Observable<firebase.User> })[]> = null;
  messagesCollection: AngularFirestoreCollection<ChatMessage> = null;
  newMessageForm: FormGroup;
  chatId: string;

  @ViewChild('toolbar', { static: true }) toolbar: ToolbarComponent;
  @ViewChild('inviteDialog', { static: true }) inviteDialog: TemplateRef<any>;

  toolbarActionItems: ActionItem[] = [
    {
      title: 'Show chat info',
      icon: 'info',
      type: ActionItemType.ICON_BUTTON,
      overflowOnly: false,
      onItemClickListener: (ev) => {
        this.showChatInfo();
      }
    },
    {
      title: 'Invite members',
      icon: 'person_add',
      type: ActionItemType.BUTTON,
      overflowOnly: true,
      // disabled: true,
      onItemClickListener: (ev) => {
        this.dialog.open(this.inviteDialog, {
          data: ''
        });
      }
    }
  ];
  nonAdminToolbarActionItems: ActionItem[] = [
    {
      title: 'Leave chat',
      icon: 'exit_to_app',
      type: ActionItemType.BUTTON,
      overflowOnly: true,
      onItemClickListener: (ev) => {
        this.leaveChat(ev);
      }
    }
  ];
  adminToolbarActionItems: ActionItem[] = [
    {
      title: 'Administrator actions',
      svgIcon: 'mdi:shield-lock',
      type: ActionItemType.MENU_ICON_BUTTON,
      overflowOnly: false,
      children: [
        {
          title: 'Edit chat details',
          icon: 'edit',
          type: ActionItemType.BUTTON,
          onItemClickListener: (ev) => {
            this.editChatDetails();
          }
        }, {
          title: 'Delete chat',
          icon: 'delete',
          type: ActionItemType.BUTTON,
          onItemClickListener: (ev) => {
            this.deleteChat(ev);
          }
        }, {
          title: 'Archive chat',
          icon: 'archive',
          type: ActionItemType.BUTTON,
          onItemClickListener: (ev) => {
            this.archiveChat();
          }
        }, {
          title: 'Add administrator',
          svgIcon: 'mdi:shield-plus',
          type: ActionItemType.BUTTON,
          disabled: true,
          onItemClickListener: (ev) => {
            console.log('Add administrator feature coming soon!');
          }
        }
      ]
    }
  ];

  constructor(
    private auth: AuthService,
    private afFs: AngularFirestore,
    private coreDialogs: DialogsService,
    private dialog: MatDialog,
    private dom: DomSanitizer,
    fb: FormBuilder,
    route: ActivatedRoute,
    private router: Router,
    private shared: SharedService,
    public toolbarService: ToolbarService
  ) {
    route.params
      .pipe(map(p => p.id))
      .subscribe(chatId => {
        console.log(`Chat ID: ${chatId}`);
        this.chatId = chatId;
      });
    this.chatDocument = afFs.doc(`chats/${this.chatId}`);
    this.chat$ = this.chatDocument.valueChanges();

    // Check if document exists
    this.chatDocument.get().pipe(map(doc => doc.exists)).subscribe(exists => {
      if (!exists) {
        // Document doesn't exist! Return back
        this.shared.openSnackBar({
          msg: 'The chat group you\'re trying to view doesn\'t exist or you do not have permissions to access it.',
          additionalOpts: {
            duration: 6000
          }
        });
        router.navigate(['chats']);
      } else {
        this.messagesCollection = afFs.collection(`chats/${this.chatId}/messages`, ref => ref.orderBy('createdAt'));
        this.messages$ = this.messagesCollection.snapshotChanges().pipe(
          map(actions => actions.map(a => {
            // const authorData = a.payload.doc.data().author.get().then(snapshot => snapshot.data());
            const authorData = from(a.payload.doc.data().author.get()).pipe(
              tap(doc => console.log('Author data:', doc.data())),
              map(doc => doc.get('user'))
            );
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, authorData, ...data };
          }))
        );
      }
    });

    this.newMessageForm = fb.group({
      message: null
    });

    // Hide the default toolbar
    this.toolbarService.showToolbar = false;

    this.chat$.subscribe(chat => {
      this.chat = chat;
      // Note: This code snippet is inserted here as it needs this.chat, which
      // is only set when this Observable is subscribed
      this.toolbarActionItems = [...this.toolbarActionItems,
        ...(this.isAdmin(chat) ? this.adminToolbarActionItems : this.nonAdminToolbarActionItems)];
      console.log('Current toolbar action items:', this.toolbarActionItems);
      console.log('Current toolbar instance:', this.toolbar);
      // this.toolbar.actionItems = this.toolbarActionItems;
    });
  }

  isMember(): Observable<boolean> {
    return this.chat$.pipe(
      map(chat => (chat.members as DocumentReference[]).some(members => members.id === this.auth.user.uid))
    );
  }

  toggleSidenav() {
    if (this.toolbarService.sidenav) {
      console.log('Sidenav ref exists!');
      this.toolbarService.sidenav.toggle();
    } else {
      console.log('Sidenav ref doesn\'t exist!');
    }
  }

  /**
   * Checks if the currently signed-in user is an adminstrator/owner of a specified chat
   * @param chat The chat group to check
   * @return `true` if the user is an admin/owner, `false` otherwise
   */
  isAdmin(chat: Chat): boolean {
    return chat.owner.id === this.auth.user.uid || (chat.admins as DocumentReference[]).some(e => e.id === this.auth.user.uid);
  }

  /**
   * An observable to check if the currently signed-in user is an adminstrator/owner of a specified chat
   * @param chat The chat group to check
   * @return `true` if the user is an admin/owner, `false` otherwise
   */
  isAdminObs(): Observable<boolean> {
    return this.chatDocument
      .get()
      .pipe(
        map((doc, index) => {
          console.log('Admin data:', doc.get('admins'));
          if (doc.data()['owner']) {
            return doc.data()['owner']['id'] === this.afFs.doc(`users/${this.auth.user.uid}`).ref.id;
          } else if (doc.data()['admins']) {
            return (doc.data()['admins'] as DocumentReference[])
              .some(e => e.id === this.afFs.doc(`users/${this.auth.user.uid}`).ref.id);
          } else {
            return false;
          }
        })
      );
  }
  onClickMenu(event: MouseEvent) {
    event.stopImmediatePropagation();
    event.preventDefault();
  }
  showChatInfo() {
    this.dialog.open<ChatInfoDialogComponent, AngularFirestoreDocument<Chat>>(ChatInfoDialogComponent, {
      data: this.chatDocument
    });
  }
  editChatDetails() {
    const dialogRef = this.dialog.open<EditChatDialogComponent, string>(EditChatDialogComponent, {
      data: this.chatId
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.chatDocument
          .update(dialogRef.componentInstance.editChatForm.value)
          .then(() => {
            const snackBarRef = this.shared.openSnackBar({ msg: 'Successfully saved edits to the chat\' s details!', action: 'Undo' });
            snackBarRef.onAction()
              .subscribe(() => {
                this.editChatDetails();
              });
          })
          .catch((error) => {
            this.shared.openSnackBar({
              msg: `An error occurred while attempting to edit the chat's details: ${error.message}`,
              additionalOpts: {
                duration: 5000
              }
            });
            console.error(`An error occurred while attempting to edit chat ID ${this.chatId}'s details: `, error);
          });
      }
    });
  }

  joinChat() {
    this.chatDocument.update({
      members: firestore.FieldValue.arrayUnion(this.afFs.doc(`users/${this.auth.user.uid}`).ref)
    })
    .then(() => {
      this.shared.openSnackBar({ msg: 'You\'ve successfully joined this chat!' });
      console.log('Successfully joined the chat!');
    })
    .catch((error) => {
      this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
      console.error('An error occurred while attempting to join the chat:', error);
    });
  }

  archiveChat() {
    const dialogText = `
    <p>Are you sure you want to archive "${this.chat.name}"?</p>
    <p>Archiving chats only disables the ability for anyone
    (except administrators and the owner) to send messages to the chat.
    Existing messages are kept intact.</p>
    <p>Note: You can unarchive "${this.chat.name}" at any time.</p>
    `;
    const dialogRef = this.coreDialogs.openConfirmDialog({
      title: `Archive "${this.chat.name}"?`,
      msg: this.dom.sanitize(SecurityContext.HTML, dialogText),
      isHtml: true,
      positiveBtnText: 'Archive chat',
      positiveBtnColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {

      }
    });
  }
  leaveChat(event: MouseEvent | boolean = false) {
    if (typeof event === 'boolean') {
      if (event === true) {
        this.chatDocument
          .update({
            members: firestore.FieldValue.arrayRemove(this.afFs.doc(`users/${this.auth.user.uid}`).ref)
          })
          .then(() => {
            const snackBarRef = this.shared.openSnackBar({
              msg: `Successfully left "${this.chat.name}"!`,
              action: 'Undo'
            });
            snackBarRef.onAction().subscribe(() => {
              this.chatDocument
                .update({
                  members: firestore.FieldValue.arrayUnion(this.afFs.doc(`users/${this.auth.user.uid}`).ref)
                })
                .then(() => {
                  this.shared.openSnackBar({ msg: 'Successfully reverted action!' });
                })
                .catch((error) => {
                  this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
                });
            });
            this.router.navigateByUrl('/chats');
          })
          .catch((error) => {
            this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
          });
      }
    } else if (event.shiftKey) {
      this.leaveChat(true);
    } else {
      const dialogText = `
      <p>Are you sure you want to leave "${this.chat.name}"?</p>
      <small>Tip: To bypass this dialog, hold down the <kbd>Shift</kbd> key while clicking the leave action.</small>
      `;
      const dialogRef = this.coreDialogs.openConfirmDialog({
        title: `Leave "${this.chat.name}"?`,
        msg: this.dom.bypassSecurityTrustHtml(dialogText),
        isHtml: true,
        positiveBtnText: 'Leave'
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'ok') {
          this.leaveChat(true);
        }
      });
    }
  }
  removeChat() {
    if (this.isAdmin(this.chat)) {
      // The user is an admin
      this.chatDocument
        .delete()
        .then(() => {
          const snackBarRef = this.shared.openSnackBar({
            msg: `Successfully deleted ${this.chat.name}!`,
            action: 'Undo',
            additionalOpts: {
              duration: 6000
            }
          });
          snackBarRef.onAction().subscribe(() => {
            this.chatDocument
              .set(this.chat)
              .then(() => {
                this.shared.openSnackBar({ msg: 'Successfully undone chat deletion! (Note that messages are\'t restored.)' });
              })
              .catch((error) => {
                console.error('An error occurred:', error.message);
                this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
              });
          });
        })
        .catch((error) => {
          console.error('An error occurred:', error.message);
          this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
        });
    } else {
      this.shared.openSnackBar({ msg: 'Error: You must be an admin to delete the chat! ' });
      console.error(`Admin privileges required to delete the chat "${this.chat.name}"!`);
    }
  }
  deleteChat(event: MouseEvent) {
    if (event.shiftKey) {
      this.removeChat();
    } else {
      const dialogText = `
      <p>Are you sure you want to delete "${this.chat.name}"?</p>
      <p>Note that only information about the chat can be recovered. All messages will be permanently deleted!</p>
      <small>Tip: To bypass this dialog, hold down the <kbd>Shift</kbd> key while clicking the delete action.</small>
      `;
      const dialogRef = this.coreDialogs.openConfirmDialog({
        title: `Delete "${this.chat.name}"?`,
        msg: this.dom.bypassSecurityTrustHtml(dialogText),
        isHtml: true,
        positiveBtnText: 'Delete',
        positiveBtnColor: 'warn'
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'ok') {
          this.removeChat();
        }
      });
    }
  }
  reportChatAsSpam(ev: Event) {
    const dialogText = `
    <p>Are you sure you want to report "${this.chat.name}" as spam?</p>
    <p>Note that once you mark "${this.chat.name}" as spam, you'll also be removed from the chat.</p>
    `;
    const dialogRef = this.coreDialogs.openConfirmDialog({
      title: `Report "${this.chat.name}" as spam?`,
      msg: this.dom.bypassSecurityTrustHtml(dialogText),
      isHtml: true,
      positiveBtnText: 'Report as spam',
      positiveBtnColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        // TODO: Implement reporting chat as spam
      }
    });
  }

  sendMessage() {
    const chatMsg = {
      author: this.afFs.doc(`users/${this.auth.user.uid}`).ref,
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastModified: firestore.FieldValue.serverTimestamp(),
      message: this.newMessageForm.get('message').value
    };
    this.messagesCollection.add(chatMsg).then(() => {
      // We don't have to keep showing a snackbar for every time the user sends a message
      console.log('Successfully sent message with the following payload:', chatMsg);
    }).catch((error) => {
      console.error('Error: Could not send message:', error);
      this.shared.openSnackBar({ msg: 'Could not send the message. Please try again later.' });
    });
    // Reset the form
    this.newMessageForm.reset();
  }
  /**
   * Checks whether the message's author is the current user
   * @param chatMessage The chat message
   * @returns `true` if the current user authored the message, `false` otherwise
   */
  isAuthor(chatMessage: ChatMessage): boolean {
    return chatMessage.author.id === this.auth.user.uid;
  }

  getUserDisplayNameByDocRef(docRef: DocumentReference): Promise<string> {
    console.log(`Getting ${docRef.id}\'s display name...`);
    return docRef.get()
      .then(doc => doc.get('user.displayName') as string || '<no-name>');
  }
  getUserDisplayName(id: string): Promise<string> {
    console.log(`Getting ${id}\'s display name...`);
    return this.afFs.doc(`users/${id}`).get()
      .pipe(
        take(1),
        map(doc => doc.get('user.displayName') || '<no-name>'),
        tap(displayName => console.log(`Display name: ${displayName}`))
      ).toPromise();
  }
  getUserPhotoUrlByDocRef(docRef: DocumentReference): Promise<string | undefined> {
    console.log(docRef);
    console.log(`Getting ${docRef.id}\'s photo URL...`);
    return docRef.get()
      .then(doc => doc.get('user.photoURL') as string);
  }
  getUserPhotoUrl(id: string): Promise<string> {
    console.log(`Getting ${id}\'s photo URL...`);
    return this.afFs.doc(`users/${id}`).get()
      .pipe(
        take(1),
        map(doc => doc.get('user.photoURL')),
        tap(photoURL => console.log(`Photo URL: ${photoURL}`))
      ).toPromise();
  }

  log(value: any) {
    console.log(value);
    return value;
  }

  ngOnDestroy() {
    this.toolbarService.showToolbar = true;
  }

}
