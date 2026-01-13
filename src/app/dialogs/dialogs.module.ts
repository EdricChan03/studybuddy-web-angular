import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
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
