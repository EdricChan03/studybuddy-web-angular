import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-hotkey-help-dialog',
  templateUrl: './hotkey-help-dialog.component.html'
})
export class HotkeyHelpDialogComponent {
  hotkeys = Array.from(this.data);

  constructor(@Inject(MAT_DIALOG_DATA) public data: Map<string, string>) {}
}
