import { Component, SecurityContext } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import firebase from 'firebase/app';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { DialogsService } from '../core/dialogs/dialogs.service';
import { ChatInfoDialogComponent } from '../dialogs';
import { EditChatDialogComponent } from '../dialogs/edit-chat-dialog/edit-chat-dialog.component';
import { JoinChatDialogComponent } from '../dialogs/join-chat-dialog/join-chat-dialog.component';
import { NewChatDialogComponent } from '../dialogs/new-chat-dialog/new-chat-dialog.component';
import { Chat } from '../interfaces';
import { SharedService } from '../shared.service';
import { ToolbarService } from '../toolbar.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html'
})
export class ChatsComponent {

  chats$: Observable<Chat[]>;
  chatsCollection: AngularFirestoreCollection<Chat>;
  constructor(
    private coreDialogs: DialogsService,
    private shared: SharedService,
    private dialog: MatDialog,
    private afFs: AngularFirestore,
    private auth: AuthService,
    private toolbarService: ToolbarService,
    private dom: DomSanitizer
  ) {
    shared.title = 'Chats';
    auth.getAuthState().subscribe((user) => {
      if (user) {
        this.chatsCollection = afFs.collection<Chat>(
          'chats',
          ref => ref.where(
            'members',
            'array-contains',
            afFs.doc(`users/${auth.user.uid}`).ref
          )
        );
        this.chats$ = this.chatsCollection.snapshotChanges().pipe(map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            data['id'] = a.payload.doc.id;
            return data;
          });
        }));
        this.chats$.subscribe(() => {
          this.toolbarService.setProgress(false);
        });
      } else {
        console.warn('Current user doesn\'t exist yet!');
      }
    });
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
  isAdminObs(chat: Chat): Observable<boolean> {
    return this.afFs.doc<Chat>(`chats/${chat['id']}`)
      .get()
      .pipe(
        map((doc, index) => {
          console.log('Admin data:', doc.get('admins'));
          if (doc.data()['owner']) {
            return doc.data()['owner']['id'] === this.afFs.doc(`users/${this.auth.user.uid}`).ref.id;
          } else if (doc.data()['admins']) {
            return doc.data()['admins'].some(e => e.id === this.afFs.doc(`users/${this.auth.user.uid}`).ref.id);
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
  showChatInfo(chat: Chat, event: MouseEvent) {
    this.dialog.open<ChatInfoDialogComponent, AngularFirestoreDocument<Chat>>(ChatInfoDialogComponent, {
      data: this.afFs.doc<Chat>(`chats/${chat['id']}`)
    });
  }
  editChatDetails(chat: Chat, event: MouseEvent) {
    const dialogRef = this.dialog.open<EditChatDialogComponent, string>(EditChatDialogComponent, {
      data: chat['id']
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        this.afFs.doc(`chats/${chat['id']}`)
          .update(dialogRef.componentInstance.editChatForm.value)
          .then(() => {
            const snackBarRef = this.shared.openSnackBar({ msg: 'Successfully saved edits to the chat\' s details!', action: 'Undo' });
            snackBarRef.onAction()
              .subscribe(() => {
                this.editChatDetails(chat, event);
              });
          })
          .catch((error) => {
            this.shared.openSnackBar({
              msg: `An error occurred while attempting to edit the chat's details: ${error.message}`,
              additionalOpts: {
                duration: 5000
              }
            });
            console.error(`An error occurred while attempting to edit chat ID ${chat['id']}'s details: `, error);
          });
      }
    });
  }
  archiveChat(chat: Chat, event: MouseEvent) {
    const dialogText = `
    <p>Are you sure you want to archive "${chat.name}"?</p>
    <p>Archiving chats only disables the ability for anyone
    (except administrators and the owner) to send messages to the chat.
    Existing messages are kept intact.</p>
    <p>Note: You can unarchive "${chat.name}" at any time.</p>
    `;
    const dialogRef = this.coreDialogs.openConfirmDialog({
      title: `Archive "${chat.name}"?`,
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
  leaveChat(chat: Chat, event: MouseEvent | boolean = false) {
    if (typeof event === 'boolean') {
      if (event === true) {
        this.afFs.doc(`chats/${chat['id']}`)
          .update({
            members: firebase.firestore.FieldValue.arrayRemove(this.afFs.doc(`users/${this.auth.user.uid}`).ref)
          })
          .then(() => {
            const snackBarRef = this.shared.openSnackBar({
              msg: `Successfully left "${chat['name']}"!`,
              action: 'Undo'
            });
            snackBarRef.onAction().subscribe(() => {
              this.afFs.doc(`chats/${chat['id']}`)
                .update({
                  members: firebase.firestore.FieldValue.arrayUnion(this.afFs.doc(`users/${this.auth.user.uid}`).ref)
                })
                .then(() => {
                  this.shared.openSnackBar({ msg: 'Successfully reverted action!' });
                })
                .catch((error) => {
                  this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
                });
            });
          })
          .catch((error) => {
            this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
          });
      }
    } else if (event.shiftKey) {
      this.leaveChat(chat, true);
    } else {
      const dialogText = `
      <p>Are you sure you want to leave "${chat.name}"?</p>
      <small>Tip: To bypass this dialog, hold down the <kbd>Shift</kbd> key while clicking the leave action.</small>
      `;
      const dialogRef = this.coreDialogs.openConfirmDialog({
        title: `Leave "${chat.name}"?`,
        msg: this.dom.bypassSecurityTrustHtml(dialogText),
        isHtml: true,
        positiveBtnText: 'Leave'
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'ok') {
          this.leaveChat(chat, true);
        }
      });
    }
  }
  removeChat(chat: Chat) {
    if (this.isAdmin(chat)) {
      // The user is an admin
      this.afFs.doc(`chats/${chat['id']}`)
        .delete()
        .then(() => {
          const snackBarRef = this.shared.openSnackBar({
            msg: `Successfully deleted ${chat['name']}`,
            action: 'Undo',
            additionalOpts: {
              duration: 6000
            }
          });
          snackBarRef.onAction().subscribe(() => {
            this.afFs.doc(`chats/${chat['id']}`)
              .set(chat)
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
      console.error(`Admin privileges required to delete the chat "${chat.name}"!`);
    }
  }
  deleteChat(chat: Chat, event: MouseEvent) {
    if (event.shiftKey) {
      this.removeChat(chat);
    } else {
      const dialogText = `
      <p>Are you sure you want to delete "${chat.name}"?</p>
      <p>Note that only information about the chat can be recovered. All messages will be permanently deleted!</p>
      <small>Tip: To bypass this dialog, hold down the <kbd>Shift</kbd> key while clicking the delete action.</small>
      `;
      const dialogRef = this.coreDialogs.openConfirmDialog({
        title: `Delete "${chat.name}"?`,
        msg: this.dom.bypassSecurityTrustHtml(dialogText),
        isHtml: true,
        positiveBtnText: 'Delete',
        positiveBtnColor: 'warn'
      });
      dialogRef.afterClosed().subscribe((result) => {
        if (result === 'ok') {
          this.removeChat(chat);
        }
      });
    }
  }
  reportChatAsSpam(chat: Chat, ev: Event) {
    const dialogText = `
    <p>Are you sure you want to report "${chat.name}" as spam?</p>
    <p>Note that once you mark "${chat.name}" as spam, you'll also be removed from the chat.</p>
    `;
    const dialogRef = this.coreDialogs.openConfirmDialog({
      title: `Report "${chat.name}" as spam?`,
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
  joinChat() {
    const dialogRef = this.dialog.open(JoinChatDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        const formVal = dialogRef.componentInstance.joinChatForm.value;
        const chatRef = this.afFs.doc<Chat>(`chats/${formVal['id']}`);
        chatRef
          .get()
          .subscribe((value) => {
            chatRef
              .update({ members: firebase.firestore.FieldValue.arrayUnion(this.afFs.doc(`users/${this.auth.user.uid}`).ref) })
              .then(() => {
                this.shared.openSnackBar({
                  msg: `Successfully joined "${value.data()['name']}"!`,
                  additionalOpts: {
                    duration: 6000
                  }
                });
              });
          });
      }
    });
  }
  newChat() {
    const dialogRef = this.dialog.open(NewChatDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        const formVal: Chat = dialogRef.componentInstance.createChatForm.value;
        formVal['members'] = [this.afFs.doc(`users/${this.auth.user.uid}`).ref];
        formVal['admins'] = [this.afFs.doc(`users/${this.auth.user.uid}`).ref];
        formVal['owner'] = this.afFs.doc(`users/${this.auth.user.uid}`).ref;
        // Set the created at date as the server's timestamp
        formVal['createdAt'] = firebase.firestore.FieldValue.serverTimestamp();
        this.afFs.collection<Chat>(`chats`)
          .add(formVal)
          .then(() => {
            this.shared.openSnackBar({ msg: 'Successfully created group chat!' });
          })
          .catch((error) => {
            this.shared.openSnackBar({ msg: `An error occurred: ${error.message}` });
          });
      }
    });
  }

}
