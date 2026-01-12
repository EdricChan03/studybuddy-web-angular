import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';

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
