import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';

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
