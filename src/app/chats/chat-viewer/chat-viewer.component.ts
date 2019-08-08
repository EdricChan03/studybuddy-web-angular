import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { ChatEvent, ChatMessage } from '../../interfaces';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { AuthService } from '../../auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { firestore } from 'firebase';
import { SharedService } from '../../shared.service';

@Component({
  selector: 'app-chat-viewer',
  templateUrl: './chat-viewer.component.html',
  styleUrls: ['./chat-viewer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatViewerComponent implements OnInit {

  messages$: Observable<ChatMessage[]>;
  messagesCollection: AngularFirestoreCollection<ChatMessage>;
  newMessageForm: FormGroup;
  chatId: string;
  constructor(
    private auth: AuthService,
    private afFs: AngularFirestore,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private shared: SharedService
  ) {
    route.params
      .pipe(map(p => p.id))
      .subscribe(chatId => {
        console.log(`Chat ID: ${chatId}`);
        this.chatId = chatId;
      });
    this.messagesCollection = afFs.collection(`chats/${this.chatId}/messages`);
    this.messages$ = this.messagesCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const authorData = a.payload.doc.data().author.get().then(snapshot => snapshot.data());
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        return { id, authorData, ...data };
      }))
    );
    this.newMessageForm = fb.group({
      message: null
    });
  }

  sendMessage() {
    const chatMsg = {
      author: this.afFs.doc(`users/${this.auth.authState.uid}`).ref,
      createdAt: firestore.FieldValue.serverTimestamp(),
      lastModified: firestore.FieldValue.serverTimestamp(),
      message: this.newMessageForm.get('message').value
    }
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
    return chatMessage.author.id === this.auth.authState.uid;
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

  ngOnInit() {
  }

}
