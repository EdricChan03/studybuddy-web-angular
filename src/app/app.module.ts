import { ResourcesComponent } from './resources/resources.component';
import { TodoService, TodoDatabase, TodoDataSource } from './todo/todo.service';
import { NewTodoDialog } from './newtodo/newtodo.component';
import { MyMaterialModule } from './material.module';
import {
	Shared,
	SHARED_DIALOGS
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
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { TestpageComponent } from './testpage/testpage.component';

@NgModule({
	declarations: [
		AppComponent,
		AppdownloadsComponent,
		TodoComponent,
		TestpageComponent,
		ResourcesComponent,
		NewTodoDialog,
		SHARED_DIALOGS
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
		AngularFirestoreModule.enablePersistence()
	],
	bootstrap: [AppComponent],
	providers: [
		Shared,
		TodoService,
		TodoDatabase,
		TodoDataSource
	],
	entryComponents: [
		SHARED_DIALOGS,
		NewTodoDialog
	]
})
export class AppModule { }
