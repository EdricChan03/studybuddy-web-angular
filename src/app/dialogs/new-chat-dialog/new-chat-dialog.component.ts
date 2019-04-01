import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SharedService } from '../../shared.service';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-new-chat-dialog',
  templateUrl: './new-chat-dialog.component.html'
})
export class NewChatDialogComponent {

  createChatForm: FormGroup;
  helpDialogRef: MatDialogRef<any>;
  constructor(
    private fb: FormBuilder,
    private shared: SharedService
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
    this.helpDialogRef = this.shared.openHelpDialog(templateRef);
  }
  closeHelpDialog() {
    this.helpDialogRef.close();
    this.helpDialogRef = null;
  }
}
