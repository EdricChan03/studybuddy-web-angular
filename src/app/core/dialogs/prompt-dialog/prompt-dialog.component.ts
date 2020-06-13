import { Component, OnInit, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Dialog } from '../dialog';
import { PromptDialogOpts } from '../models';

@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html'
})
export class PromptDialogComponent extends Dialog implements OnInit {
  input: string | number;
  /** The default text to be used for the negative button. */
  readonly defaultNegativeBtnText = 'Cancel';
  /** The default text to be used for the positive button. */
  readonly defaultPositiveBtnText = 'OK';
  /** The default color to be used for the input. */
  readonly defaultInputColor = 'primary';

  constructor(@Inject(MAT_DIALOG_DATA) public opts: PromptDialogOpts) {
    super(opts);
  }

  get hideNegativeBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('negative');
    }
  }

  get hideNeutralBtn(): boolean {
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('neutral');
    }

    return !('neutralBtnText' in this.opts);
  }

  get hidePositiveBtn(): boolean {
    // As the default text will be used if no text was specified,
    // the button will always be shown unless explicitly hidden.
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('positive');
    }
  }

  get inputColor(): ThemePalette {
    // This is to handle users using the now deprecated `color` property.
    // tslint:disable-next-line:deprecation
    return this.opts.color ? this.opts.color :
      (this.opts.inputConfig && 'color' in this.opts.inputConfig) ? this.opts.inputConfig.color : this.defaultInputColor;
  }

  ngOnInit() {
    // tslint:disable:deprecation
    if (this.opts.value) {
      this.input = this.opts.value;
    } else if (this.opts.inputConfig.value) {
      this.input = this.opts.inputConfig.value;
    }
    // tslint:enable:deprecation
  }
}
