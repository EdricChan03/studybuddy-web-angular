import { ResourcesComponent } from './resources/resources.component';
import { TodoService, TodoDatabase, TodoDataSource } from './todo/todo.service';
import { NewTodoDialog } from './newtodo/newtodo.component';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared.service';
import { environment } from '../environments/environment';
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
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
	declarations: [
		AppComponent,
		AppdownloadsComponent,
		TodoComponent,
		TestpageComponent,
		ResourcesComponent,
		NewTodoDialog,
		SettingsComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		MaterialModule,
		AppRouting,
		HttpClientModule,
		FlexLayoutModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		AngularFirestoreModule.enablePersistence(),
		SharedModule
	],
	bootstrap: [AppComponent],
	providers: [
		SharedService,
		TodoService,
		TodoDatabase,
		TodoDataSource
	],
	entryComponents: [
		NewTodoDialog
	]
})
export class AppModule { }
