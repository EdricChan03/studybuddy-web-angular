import { Component, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { Dialog } from '../../../../../core/dialogs/dialog';
import { Setting } from '../../../models/setting';
import { SettingDialogEntry, ListSettingDialogConfig } from '../../../models/setting-dialog';

@Component({
  selector: 'app-list-setting-dialog',
  templateUrl: './list-setting-dialog.component.html',
  styleUrls: ['./list-setting-dialog.component.scss']
})
export class ListSettingDialogComponent extends Dialog {
  /** @private */
  dialogTitle: string;
  /** @private */
  currentValue: string;
  /** @private */
  entries: SettingDialogEntry[];
  /** @private */
  radioGroupColor: ThemePalette = null;

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

  constructor(@Inject(MAT_DIALOG_DATA) public data: {
    setting: Setting<string, ListSettingDialogConfig>
  }) {
    super(null);
    if (data.setting) {
      this.dialogTitle = data.setting.title;
      this.currentValue = data.setting.value;
      if (data.setting.dialogConfig) {
        if (data.setting.dialogConfig.entries) {
          this.entries = data.setting.dialogConfig.entries;
        }
        if (data.setting.dialogConfig.radioGroupColor) {
          this.radioGroupColor = data.setting.dialogConfig.radioGroupColor;
        }
      }
    }
  }
}
