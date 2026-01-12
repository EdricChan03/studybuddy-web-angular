import { Component, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Dialog } from '../dialog';
import { PortalDialogOpts } from '../models';

@Component({
  selector: 'app-portal-dialog',
  templateUrl: './portal-dialog.component.html'
})
export class PortalDialogComponent<T = any> extends Dialog {
  /** The default text to be used for the negative button. */
  readonly defaultNegativeBtnText = 'Cancel';
  /** The default text to be used for the positive button. */
  readonly defaultPositiveBtnText = 'OK';

  constructor(@Inject(MAT_DIALOG_DATA) public opts: PortalDialogOpts<T>) {
    super(opts);
  }

  get hideNegativeBtn(): boolean {
    if ('hideActionBtns' in this.opts &&
      Array.isArray(this.opts.hideActionBtns)) {
      return this.opts.hideActionBtns.includes('negative');
    }

    return !('negativeBtnText' in this.opts);
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
}
