import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';

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
