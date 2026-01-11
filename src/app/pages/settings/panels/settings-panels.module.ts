import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RemoteConfigModule } from '@angular/fire/remote-config';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

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
