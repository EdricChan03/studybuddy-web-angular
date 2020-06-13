import { Component, Inject, ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';

import { Dialog } from '../../../../../core/dialogs/dialog';
import { Setting } from '../../../models/setting';
import { MultiSelectListSettingDialogConfig, SettingDialogEntry } from '../../../models/setting-dialog';

@Component({
  selector: 'app-multi-select-list-setting-dialog',
  templateUrl: './multi-select-list-setting-dialog.component.html'
})
export class MultiSelectListSettingDialogComponent extends Dialog {
  /** @private */
  dialogTitle: string;
  /** @private */
  entries: (SettingDialogEntry & { selected: boolean })[];
  /** @private */
  selectionListColor: ThemePalette = null;
  @ViewChild('selection') selection: MatSelectionList;

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

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      setting: Setting<string[], MultiSelectListSettingDialogConfig>
    },
    private dialogRef: MatDialogRef<MultiSelectListSettingDialogComponent>
  ) {
    super(null);
    if (data.setting) {
      this.dialogTitle = data.setting.title;
      if (data.setting.dialogConfig) {
        if (data.setting.dialogConfig.entries) {
          data.setting.dialogConfig.entries.forEach(entry => {
            if (data.setting.value) {
              entry['selected'] = data.setting.value.includes(entry.value);
            } else {
              entry['selected'] = false;
            }
          });
          this.entries = data.setting.dialogConfig.entries as (SettingDialogEntry & { selected: boolean })[];
        }
        if (data.setting.dialogConfig.selectionListColor) {
          this.selectionListColor = data.setting.dialogConfig.selectionListColor;
        }
      }
    }
  }

  close() {
    this.dialogRef.close(this.selection.selectedOptions.selected);
  }
}
