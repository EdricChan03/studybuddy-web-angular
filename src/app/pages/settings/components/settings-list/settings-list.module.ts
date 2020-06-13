import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { SettingsDialogsModule } from '../settings-dialogs/settings-dialogs.module';
import { SettingsListComponent } from './settings-list.component';

const MATERIAL_MODULES = [
  MatCheckboxModule,
  MatIconModule,
  MatListModule
];

@NgModule({
  declarations: [
    SettingsListComponent
  ],
  imports: [
    CommonModule,
    MATERIAL_MODULES,
    SettingsDialogsModule
  ],
  exports: [
    SettingsListComponent
  ]
})
export class SettingsListModule { }
