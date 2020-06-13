import { ThemePalette } from '@angular/material/core';

import { Dialog } from './dialog';
import { DialogOpts } from './models';

class DialogImpl extends Dialog {
  constructor(public opts: DialogOpts) {
    super(opts);
  }

  get hideNegativeBtn() {
    return null; // No-op
  }

  get hideNeutralBtn() {
    return null; // No-op
  }

  get hidePositiveBtn() {
    return null; // No-op
  }
}

describe('Dialog', () => {
  const btnTypes = ['negative', 'neutral', 'positive'];
  function createDialogImpl(opts: DialogOpts): DialogImpl {
    const dialogImpl = new DialogImpl(opts);
    return dialogImpl;
  }

  describe('get hasActionBtns', () => {
    it('should return the inverse of the hideActionBtns property', () => {
      const opts: DialogOpts = {
        msg: null,
        hideActionBtns: true
      };
      const dialogImpl = createDialogImpl(opts);

      expect(dialogImpl.hasActionBtns).toEqual(!opts.hideActionBtns);
    });

    it('should return true if the hideActionBtns property is an array', () => {
      const opts: DialogOpts = {
        msg: null,
        hideActionBtns: ['neutral', 'negative']
      };
      const dialogImpl = createDialogImpl(opts);

      expect(dialogImpl.hasActionBtns).toEqual(true);
    });

    it('should return true if a button text is specified', () => {
      const defaultOpts: DialogOpts = {
        msg: null
      };
      const positiveBtnOpts: DialogOpts = {
        ...defaultOpts,
        positiveBtnText: 'Positive'
      };
      const neutralBtnOpts: DialogOpts = {
        ...defaultOpts,
        neutralBtnText: 'Neutral'
      };
      const negativeBtnOpts: DialogOpts = {
        ...defaultOpts,
        negativeBtnText: 'Negative'
      };
      const opts: DialogOpts[] = [positiveBtnOpts, neutralBtnOpts, negativeBtnOpts];

      opts.forEach(opt => {
        const dialogImpl = createDialogImpl(opt);
        expect(dialogImpl.hasActionBtns).toEqual(true);
      });
    });
  });

  describe('button colors', () => {
    btnTypes.forEach(type => {
      const method = `${type}BtnColor`;
      describe(`get ${method}`, () => {
        it('should return the default color if no color is specified', () => {
          const dialogImpl = createDialogImpl({ msg: null });

          expect(dialogImpl[method]).toEqual(dialogImpl.defaultBtnColor);
        });

        it('should return the specified color if specified', () => {
          const color: ThemePalette = 'warn';
          const dialogImpl = createDialogImpl({
            msg: null,
            [method]: color
          });

          expect(dialogImpl[method]).toEqual(color);
        });
      });
    });
  });
});
