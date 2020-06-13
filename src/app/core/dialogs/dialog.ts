import { ThemePalette } from '@angular/material/core';

import { DialogOpts } from './models';

/** An abstract dialog class. */
export abstract class Dialog {
  constructor(public opts: DialogOpts) { }
  /** The default color to be used for the dialog's buttons. */
  readonly defaultBtnColor: ThemePalette = 'primary';

  /** Whether the dialog has action buttons. */
  get hasActionBtns(): boolean {
    if ('hideActionBtns' in this.opts) {
      if (typeof this.opts.hideActionBtns === 'boolean') {
        return !this.opts.hideActionBtns;
      } else if (Array.isArray(this.opts.hideActionBtns)) {
        // Skip the below logic
        return true;
      }
    }

    return 'negativeBtnText' in this.opts || 'positiveBtnText' in this.opts || 'neutralBtnText' in this.opts;
  }

  /** Whether the negative button should be hidden. */
  abstract get hideNegativeBtn(): boolean;

  /** Whether the neutral button should be hidden. */
  abstract get hideNeutralBtn(): boolean;

  /** Whether the positive button should be hidden. */
  abstract get hidePositiveBtn(): boolean;

  /** The negative button's colour. */
  get negativeBtnColor(): ThemePalette {
    return 'negativeBtnColor' in this.opts ? this.opts.negativeBtnColor : this.defaultBtnColor;
  }

  /** The neutral button's colour. */
  get neutralBtnColor(): ThemePalette {
    return 'neutralBtnColor' in this.opts ? this.opts.neutralBtnColor : this.defaultBtnColor;
  }

  /** The positive button's colour. */
  get positiveBtnColor(): ThemePalette {
    return 'positiveBtnColor' in this.opts ? this.opts.positiveBtnColor : this.defaultBtnColor;
  }
}
