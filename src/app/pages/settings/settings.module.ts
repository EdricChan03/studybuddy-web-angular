import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { SettingsOutletComponent } from './settings-outlet/settings-outlet.component';
import { SettingsPanelsService } from './settings-panels.service';
import { SettingsRoutingModule } from './settings-routing.module';

import { DialogsModule } from '../../core/dialogs/dialogs.module';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatListModule
];

@NgModule({
  declarations: [
    SettingsOutletComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MATERIAL_MODULES,
    DialogsModule,
    SettingsRoutingModule
  ],
  providers: [
    SettingsPanelsService
  ]
})
export class SettingsModule { }
