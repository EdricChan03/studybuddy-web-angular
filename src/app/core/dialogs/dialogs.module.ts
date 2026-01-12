import { PortalModule } from '@angular/cdk/portal';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';

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
