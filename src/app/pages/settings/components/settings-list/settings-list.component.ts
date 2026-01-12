import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatPseudoCheckboxState } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';

import { ListSettingDialogComponent } from '../settings-dialogs/list-setting-dialog/list-setting-dialog.component';
import { MultiSelectListSettingDialogComponent } from '../settings-dialogs/multi-select-list-setting-dialog/multi-select-list-setting-dialog.component';
import { SettingsCategory, Setting } from '../../models/setting';
import { SettingsValueChange } from './models/settings-list';
import { InputSettingDialogComponent } from '../settings-dialogs/input-setting-dialog/input-setting-dialog.component';

@Component({
  selector: 'app-settings-list',
  templateUrl: './settings-list.component.html'
})
export class SettingsListComponent {
  /** The list of settings categories to be displayed. */
  @Input() settings: SettingsCategory[];
  /** Event emitted when any of the setting values have changed. */
  @Output() settingsChange = new EventEmitter<SettingsValueChange>();

  constructor(private dialog: MatDialog) {}

  onSettingClick(setting: Setting, event?: Event) {
    const oldValue = setting.value;
    let newValue;
    switch (setting.type) {
      case 'checkbox':
        newValue = !setting.value;
        this.emitSettingsChanged(setting, oldValue, newValue, /* updateSettingsValue = */ true);
        break;
      case 'input':
        this.openInputDialog(setting);
        break;
      case 'list':
        this.openListDialog(setting);
        break;
      case 'multi-select-list':
        this.openMultiselectListDialog(setting);
        break;
      default:
        if (setting.onClickListener) {
          setting.onClickListener(event);
        } else {
          if (setting.type) {
            console.warn(`Unsupported setting type "${setting.type}" for setting with ID "${setting.id}".`);
          } else {
            console.warn(`No click listener was specified for setting with ID "${setting.id}". Skipping...`);
          }
        }
        break;
    }
  }

  private emitSettingsChanged(source: Setting, oldValue: any, newValue: any, updateSettingsValue: boolean = false) {
    this.settingsChange.emit({
      source,
      oldValue,
      newValue
    });
    if (updateSettingsValue) {
      source.value = newValue;
    }
  }

  openInputDialog(setting: Setting) {
    const dialogRef = this.dialog.open(InputSettingDialogComponent, {
      data: {
        setting // Will be passed as "setting: setting"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      // Clicking on the cancel button returns an empty string as the result.
      if (result !== undefined && result.length > 0) {
        this.emitSettingsChanged(setting, setting.value, result, /* updateSettingsValue = */ true);
      }
    });
  }

  openListDialog(setting: Setting) {
    const dialogRef = this.dialog.open(ListSettingDialogComponent, {
      data: {
        setting // Will be passed as "setting: setting"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.length > 0) {
        this.emitSettingsChanged(setting, setting.value, result, /* updateSettingsValue = */ true);
      }
    });
  }

  openMultiselectListDialog(setting: Setting) {
    const dialogRef = this.dialog.open(MultiSelectListSettingDialogComponent, {
      data: {
        setting // Will be passed as "setting: setting"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined && result.length > 0) {
        this.emitSettingsChanged(setting, setting.value, result, /* updateSettingsValue = */ true);
      }
    });
  }

  getCheckboxState(boolVal: boolean): MatPseudoCheckboxState {
    return boolVal ? 'checked' : 'unchecked';
  }
}
