import { Component, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';

import { Dialog } from '@app/core/dialogs/dialog';
import { Setting } from '../../../models/setting';
import { InputSettingDialogConfig, InputSettingDialogInputConfig } from '../../../models/setting-dialog';

@Component({
  selector: 'app-input-setting-dialog',
  templateUrl: './input-setting-dialog.component.html',
  styleUrls: ['./input-setting-dialog.component.scss']
})
export class InputSettingDialogComponent extends Dialog {
  /** @private */
  dialogTitle: string;
  /** @private */
  currentValue: string;
  /** @private */
  inputConfig: InputSettingDialogInputConfig = {
    label: 'Enter a value'
  };
  /** @private */
  requiresValue = false;

  readonly defaultNegativeBtnText = 'Cancel';
  readonly defaultPositiveBtnText = 'Save';

  get hasActionBtns() {
    return null; // No-op
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

  get negativeBtnColor(): ThemePalette {
    if (this.data.setting.dialogConfig && this.data.setting.dialogConfig.negativeBtnColor) {
      return this.data.setting.dialogConfig.negativeBtnColor;
    }
    return this.defaultBtnColor;
  }

  get neutralBtnColor() {
    return null; // No-op
  }

  get positiveBtnColor(): ThemePalette {
    if (this.data.setting.dialogConfig && this.data.setting.dialogConfig.positiveBtnColor) {
      return this.data.setting.dialogConfig.positiveBtnColor;
    }
    return this.defaultBtnColor;
  }

  get negativeBtnText(): string {
    if (this.data.setting.dialogConfig && this.data.setting.dialogConfig.negativeBtnColor) {
      return this.data.setting.dialogConfig.negativeBtnColor;
    }
    return this.defaultNegativeBtnText;
  }

  get positiveBtnText(): string {
    if (this.data.setting.dialogConfig && this.data.setting.dialogConfig.positiveBtnColor) {
      return this.data.setting.dialogConfig.positiveBtnColor;
    }
    return this.defaultPositiveBtnText;
  }

  get shouldDisablePositiveBtn(): boolean {
    return this.requiresValue ? this.currentValue === null || this.currentValue.length <= 0 : false;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    setting: Setting<string, InputSettingDialogConfig>
  }) {
    super(null);
    if (data.setting) {
      this.dialogTitle = data.setting.title;
      this.currentValue = data.setting.value;
      if (data.setting.dialogConfig) {
        if (data.setting.dialogConfig.inputConfig) {
          this.inputConfig = data.setting.dialogConfig.inputConfig;
        }
        if ('requiresValue' in data.setting.dialogConfig) {
          this.requiresValue = data.setting.dialogConfig.requiresValue;
        }
      }
    }
  }
}
