import { NewTodoDialog } from './newtodo/newtodo.component';
import { MyMaterialModule } from './material.module';
import {
	Shared,
	AlertDialog,
	ConfirmDialog,
	PromptDialog
} from './shared';
import { environment } from './../environments/environment';
import { AppRouting } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { AppdownloadsComponent } from './appdownloads/appdownloads.component';
import { TodoComponent } from './todo/todo.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { TestpageComponent } from './testpage/testpage.component';


@NgModule({
	declarations: [
		AppComponent,
		AppdownloadsComponent,
		TodoComponent,
		TestpageComponent,
		NewTodoDialog,
		AlertDialog,
		ConfirmDialog,
		PromptDialog
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		MyMaterialModule,
		AppRouting,
		FlexLayoutModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		AngularFireDatabaseModule
	],
	bootstrap: [AppComponent],
	providers: [
		Shared
	],
	entryComponents: [
		AlertDialog,
		PromptDialog,
		ConfirmDialog,
		NewTodoDialog
	]
})
export class AppModule { }
