import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';

import { ListSettingDialogComponent } from './list-setting-dialog/list-setting-dialog.component';
import { MultiSelectListSettingDialogComponent } from './multi-select-list-setting-dialog/multi-select-list-setting-dialog.component';
import { InputSettingDialogComponent } from './input-setting-dialog/input-setting-dialog.component';

const SETTINGS_DIALOGS = [
  InputSettingDialogComponent,
  ListSettingDialogComponent,
  MultiSelectListSettingDialogComponent
];

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatRadioModule
];

@NgModule({
  declarations: [SETTINGS_DIALOGS],
  imports: [
    CommonModule,
    FormsModule,
    MATERIAL_MODULES,
    FlexLayoutModule
  ],
  exports: [SETTINGS_DIALOGS]
})
export class SettingsDialogsModule { }
