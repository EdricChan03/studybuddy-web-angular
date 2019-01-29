import { Component, Inject, OnInit } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth.service';
import { Chat } from '../../interfaces';
import { SharedService } from '../../shared.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-chat-dialog',
  templateUrl: './edit-chat-dialog.component.html'
})
export class EditChatDialogComponent implements OnInit {
  chatDoc: AngularFirestoreDocument<Chat>;
  chatDoc$: Observable<Chat>;
  chatForm: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private id: string,
    private auth: AuthService,
    private afFs: AngularFirestore,
    private dialogRef: MatDialogRef<EditChatDialogComponent>,
    private shared: SharedService,
    private fb: FormBuilder
  ) {
    this.chatDoc = afFs.doc(`chats/${id}`);
    this.chatDoc$ = this.chatDoc.valueChanges();
    this.chatForm = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.maxLength(300)]
    });
  }

  isAdmin(chat: Chat): boolean {
    return chat.owner.id === this.auth.authState.uid ||
      (chat.admins as DocumentReference[]).some(e => e.id === this.auth.authState.uid);
  }
  ngOnInit() {
    this.chatDoc.get()
      .subscribe(doc => {
        if (!this.isAdmin(doc.data() as Chat)) {
          this.dialogRef.close();
          this.shared.openSnackBar({ msg: 'You\'re not allowed to edit the chat\'s details as you are not an admin of the chat!' });
        }
        const _formData = {};
        for (const key in doc.data()) {
          if (doc.data().hasOwnProperty(key)) {
            if (key === 'name' || key === 'description') {
              _formData[key] = doc.data()[key];
            }
          }
        }
        this.chatForm.setValue(_formData);
      });
  }
}
