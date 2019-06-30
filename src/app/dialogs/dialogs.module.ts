import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MarkdownModule } from 'ngx-markdown';
import { ChatInfoDialogComponent } from './chat-info-dialog/chat-info-dialog.component';
import { EditChatDialogComponent } from './edit-chat-dialog/edit-chat-dialog.component';
import { EditContentDialogComponent } from './edit-content-dialog/edit-content-dialog.component';
import { JoinChatDialogComponent } from './join-chat-dialog/join-chat-dialog.component';
import { MarkdownDialogComponent } from './markdown-dialog/markdown-dialog.component';
import { NewChatDialogComponent } from './new-chat-dialog/new-chat-dialog.component';
import { NewProjectDialogComponent } from './new-project-dialog/new-project-dialog.component';
import { SignInDialogComponent } from './sign-in-dialog/sign-in-dialog.component';
import { TodoDialogComponent } from './todo-dialog/todo-dialog.component';
import { UserInfoDialogComponent } from './user-info-dialog/user-info-dialog.component';

/** A list of Angular Material modules internally used by the dialogs */
const MATERIAL_MODULES = [
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatTabsModule
];

/** A list of dialogs */
const DIALOGS = [
  ChatInfoDialogComponent,
  EditChatDialogComponent,
  EditContentDialogComponent,
  JoinChatDialogComponent,
  MarkdownDialogComponent,
  NewChatDialogComponent,
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
  ],
  entryComponents: [
    DIALOGS
  ]
})
export class DialogsModule { }
