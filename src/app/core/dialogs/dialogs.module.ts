import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';

import { MessageDialogComponent } from './message-dialog/message-dialog.component';
import { PortalDialogComponent } from './portal-dialog/portal-dialog.component';
import { PromptDialogComponent } from './prompt-dialog/prompt-dialog.component';
import { SelectionDialogComponent } from './selection-dialog/selection-dialog.component';

const DIALOGS = [
  MessageDialogComponent,
  PortalDialogComponent,
  PromptDialogComponent,
  SelectionDialogComponent
];

const MATERIAL_MODULES = [
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule
];

@NgModule({
  declarations: [DIALOGS],
  imports: [
    CommonModule,
    FormsModule,
    FlexModule,
    PortalModule,
    MATERIAL_MODULES
  ]
})
export class DialogsModule { }
