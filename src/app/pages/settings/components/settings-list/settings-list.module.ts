import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';

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
