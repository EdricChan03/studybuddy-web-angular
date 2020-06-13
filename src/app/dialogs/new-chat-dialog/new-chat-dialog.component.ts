import { Component, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-chat-dialog',
  templateUrl: './new-chat-dialog.component.html'
})
export class NewChatDialogComponent {

  createChatForm: FormGroup;
  helpDialogRef: MatDialogRef<any>;
  constructor(
    private dialog: MatDialog,
    fb: FormBuilder
  ) {
    this.createChatForm = fb.group({
      name: ['', Validators.required],
      description: ['', Validators.maxLength(300)],
      // New chat groups are private by default
      visibility: 'private'
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
