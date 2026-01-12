import { Component, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

export interface MarkdownDialogConfig {
  /**
   * The dialog's title
   */
  title: string;
  /**
   * The markdown to display in the dialog
   */
  text: string;
  /**
   * The colour/color of the negative dialog button
   */
  negativeDialogBtnColor?: ThemePalette;
  /**
   * Whether to show the negative dialog button
   */
  hasNegativeDialogBtn?: boolean;
  /**
   * The text of the negative dialog button
   *
   * Note: If this isn't set, the button's text will be set to 'Cancel'
   */
  negativeDialogBtnText?: string;
  /**
   * The colour/color of the positive dialog button
   */
  positiveDialogBtnColor?: ThemePalette;
  /**
   * Whether to show the positive dialog button
   */
  hasPositiveDialogBtn?: boolean;
  /**
   * The text of the positive dialog button
   *
   * Note: If this isn't set, the button's text will be set to 'Ok'
   */
  positiveDialogBtnText?: string;
}

@Component({
  selector: 'app-markdown-dialog',
  templateUrl: './markdown-dialog.component.html'
})
export class MarkdownDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: MarkdownDialogConfig) { }

}
