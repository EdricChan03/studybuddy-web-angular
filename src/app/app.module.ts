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
import {
	MdButtonModule,
	MdToolbarModule,
	MdSidenavModule,
	MdIconModule,
	MdListModule,
	MdMenuModule,
	MdCardModule,
	MdFormFieldModule,
	MdInputModule,
	MdDatepickerModule,
	MdNativeDateModule,
	MdSnackBarModule,
    MdTooltipModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { AppdownloadsComponent } from './appdownloads/appdownloads.component';
import { TodoComponent } from './todo/todo.component';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

const MATERIAL_MODULES = [
	MdButtonModule,
	MdToolbarModule,
	MdSidenavModule,
	MdIconModule,
	MdListModule,
	MdMenuModule,
	MdCardModule,
	MdFormFieldModule,
	MdInputModule,
	MdDatepickerModule,
	MdNativeDateModule,
	MdSnackBarModule,
	MdTooltipModule
];
@NgModule({
	imports: [
		MATERIAL_MODULES
	],
	exports: [
		MATERIAL_MODULES
	]
})
export class MyMaterialModule { }
@NgModule({
	declarations: [
		AppComponent,
		AppdownloadsComponent,
		TodoComponent,
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
		ConfirmDialog
	]
})
export class AppModule { }
