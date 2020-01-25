import { Component, TemplateRef, ViewChild } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../../auth.service';
import { Chat } from '../../interfaces';
import { SharedService } from '../../shared.service';
import { firestore } from 'firebase';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-chat-explore',
  templateUrl: './chat-explore.component.html'
})
export class ChatExploreComponent {
  // chatsSearch$ = new Subject<string>();
  // chatsSearchResults$: Observable<Chat[]>;
  publicChats$: Observable<Chat[]>;
  constructor(
    private afFs: AngularFirestore,
    private api: ApiService,
    private auth: AuthService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    public shared: SharedService
  ) {
    shared.title = 'Explore chats';
    auth.getAuthState().subscribe(user => {
      if (user) {
        this.publicChats$ = afFs.collection<Chat>('chats', query => query.where('visibility', '==', 'public'))
          .valueChanges({ idField: 'id' });
      }
    });
  }

  hasJoinedChat(chat: Chat): boolean {
    return (chat.members as DocumentReference[]).some(e => e.id === this.auth.authState.uid);
  }

  joinChat(chat: Chat) {
    const chatRef = this.afFs.doc<Chat>(`chats/${chat['id']}`);
    chatRef
      .get()
      .subscribe((value) => {
        chatRef
          .update({ members: firestore.FieldValue.arrayUnion(this.afFs.doc(`users/${this.auth.authState.uid}`).ref) })
          .then(() => {
            console.log(`Successfully joined chat ${chatRef.ref.id}!`);
            this.shared.openSnackBar({
              msg: `Successfully joined "${value.data()['name']}"!`,
              additionalOpts: {
                duration: 6000
              }
            });
          })
          .catch((error) => {
            console.error(`An error occurred while attempting to join chat ${chatRef.ref.id}`, error);
            this.shared.openSnackBar({
              msg: `An error occurred while attempting to join the chat: ${error.message}`
            });
          });
      });
  }

  getUserData(userDoc: DocumentReference): Observable<firebase.User> {
    return this.afFs.doc(`users/${userDoc.id}`).get().pipe(
      take(1),
      map(snapshot => snapshot.data() as firebase.User)
    );
    // return this.api.getUserById(ownerDoc.id);
  }

  getUserDisplayName(userDoc: DocumentReference): Observable<string> {
    return this.getUserData(userDoc).pipe(map(user => user.displayName));
  }
}
