import { Component, Inject, OnInit, TemplateRef } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
  editChatForm: FormGroup;
  helpDialogRef: MatDialogRef<any>;
  constructor(
    @Inject(MAT_DIALOG_DATA) private id: string,
    private auth: AuthService,
    private afFs: AngularFirestore,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<EditChatDialogComponent>,
    private shared: SharedService,
    private fb: FormBuilder
  ) {
    this.chatDoc = afFs.doc(`chats/${id}`);
    this.chatDoc$ = this.chatDoc.valueChanges();
    this.editChatForm = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.maxLength(300)],
      visibility: 'private'
    });
  }

  isAdmin(chat: Chat): boolean {
    return chat.owner.id === this.auth.user.uid ||
      (chat.admins as DocumentReference[]).some(e => e.id === this.auth.user.uid);
  }
  ngOnInit() {
    this.chatDoc.get()
      .subscribe(doc => {
        if (!this.isAdmin(doc.data() as Chat)) {
          this.dialogRef.close();
          this.shared.openSnackBar({ msg: 'You\'re not allowed to edit the chat\'s details as you are not an admin of the chat!' });
        }
        const _formData = {};
        const formControlNames = Object.keys(this.editChatForm.controls);
        console.log(formControlNames);
        for (const key in doc.data()) {
          if (doc.data().hasOwnProperty(key)) {
            if (formControlNames.includes(key)) {
              _formData[key] = doc.data()[key];
            }
          }
        }
        if (!_formData['visibility']) {
          // Set existing chat groups to be public
          _formData['visibility'] = 'public';
        }
        this.editChatForm.patchValue(_formData);
      });
  }

  showHelpDialog(templateRef: TemplateRef<any>, event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.helpDialogRef = this.dialog.open(templateRef);
  }
  closeHelpDialog() {
    this.helpDialogRef.close();
    this.helpDialogRef = null;
  }
}
