import { Component } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

@Component({
  selector: 'app-edit-content-dialog',
  templateUrl: './edit-content-dialog.component.html',
  styleUrls: ['./edit-content-dialog.component.scss']
})
export class EditContentDialogComponent {
  constructor(private dialogRef: MatDialogRef<EditContentDialogComponent>) { }
  isToggled = {
    'italic': false,
    'bold': false
  };
  cancel() {
    this.dialogRef.close();
  }
  updateVal() {
    this.dialogRef.close();
  }
  toggleState(type) {
    this.isToggled[type] = !this.isToggled[type];
  }
}
