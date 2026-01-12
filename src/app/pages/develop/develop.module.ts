import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatDividerModule } from '@angular/material/divider';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { DevelopRoutingModule } from './develop-routing.module';
import { DevelopSharedServiceComponent } from './shared-service/shared-service.component';
import { SharedModule } from '../../shared.service';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDividerModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatRadioModule,
  MatSelectModule
];

@NgModule({
  declarations: [
    DevelopSharedServiceComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    MATERIAL_MODULES,
    SharedModule,
    DevelopRoutingModule
  ]
})
export class DevelopModule { }
