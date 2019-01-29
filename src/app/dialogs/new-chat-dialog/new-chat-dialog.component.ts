import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-chat-dialog',
  templateUrl: './new-chat-dialog.component.html'
})
export class NewChatDialogComponent {

  createChatForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.createChatForm = fb.group({
      name: ['', Validators.required],
      description: ''
    });
  }

}
