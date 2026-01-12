import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RemoteConfigModule } from '@angular/fire/remote-config';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { DefaultPanelComponent } from './default-panel/default-panel.component';
import { SettingsPanelsRoutingModule } from './settings-panels-routing.module';
import { SettingsStorageService } from '../settings-storage.service';
import { SettingsListModule } from '../components/settings-list/settings-list.module';

import { AccountPanelComponent } from './account-panel/account-panel.component';
import { ExperimentsPanelComponent } from './experiments-panel/experiments-panel.component';

import { EmptyStateModule } from '@app/components/empty-state/empty-state.module';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatSelectModule,
  MatTooltipModule
];

const ANGULAR_FIRE_MODULES = [
  RemoteConfigModule
];

@NgModule({
  declarations: [
    AccountPanelComponent,
    ExperimentsPanelComponent,
    DefaultPanelComponent
  ],
  imports: [
    CommonModule,
    MATERIAL_MODULES,
    ANGULAR_FIRE_MODULES,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    SettingsListModule,
    SettingsPanelsRoutingModule,
    EmptyStateModule
  ],
  providers: [
    SettingsStorageService
  ]
})
export class SettingsPanelsModule { }
