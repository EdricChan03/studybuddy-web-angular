import { Component } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/firestore';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { Chat } from '../../interfaces';
import { debounceTime, take, map } from 'rxjs/operators';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-join-chat-dialog',
  templateUrl: './join-chat-dialog.component.html'
})
export class JoinChatDialogComponent {

  joinChatForm: FormGroup;
  chatsCollection: AngularFirestoreCollection<Chat>;
  errors = {
    invalidChatId: false,
    userAlreadyJoined: false,
    initial: true
  };
  constructor(
    private fb: FormBuilder,
    private afFs: AngularFirestore,
    private auth: AuthService,
    private dialogRef: MatDialogRef<JoinChatDialogComponent>
  ) {
    this.chatsCollection = afFs.collection('chats');
    this.joinChatForm = fb.group({
      id: [null, Validators.required]
    });
  }
  validateForm() {
    this.chatsCollection
      .doc<Chat>(this.joinChatForm.get('id').value)
      .get()
      .pipe(
        debounceTime(500),
        take(1)
      )
      .subscribe((snapshot) => {
        this.errors.initial = false;
        if (snapshot.exists) {
          this.errors.invalidChatId = false;
          console.log();
          if ((snapshot.data()['members'] as DocumentReference[]).includes(this.afFs.doc(`users/${this.auth.user.uid}`).ref)) {
            this.errors.userAlreadyJoined = true;
          } else {
            this.errors.userAlreadyJoined = false;
          }
        } else {
          this.errors.invalidChatId = true;
        }
        if (Object.keys(this.errors).every(prop => !this.errors[prop])) {
          this.dialogRef.close('ok');
        }
      });
  }
}
