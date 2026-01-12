import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MarkdownModule } from 'ngx-markdown';

import { EditContentDialogComponent } from './edit-content-dialog/edit-content-dialog.component';
import { MarkdownDialogComponent } from './markdown-dialog/markdown-dialog.component';
import { NewProjectDialogComponent } from './new-project-dialog/new-project-dialog.component';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';
import { UserInfoDialogComponent } from './user-info-dialog/user-info-dialog.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule
];

/** A list of dialogs */
const DIALOGS = [
  EditContentDialogComponent,
  MarkdownDialogComponent,
  NewProjectDialogComponent,
  SignInDialogComponent,
  TodoDialogComponent,
  UserInfoDialogComponent
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    MATERIAL_MODULES,
    MarkdownModule.forChild()
  ],
  declarations: [
    DIALOGS
  ],
  exports: [
    DIALOGS
  ]
})
export class DialogsModule {
}
