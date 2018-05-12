import { ToolbarService } from './toolbar.service';
import { TipsComponent } from './tips/tips.component';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared.service';
import { environment } from '../environments/environment';
import { AppRouting } from './app.routing';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { TestpageComponent } from './testpage/testpage.component';
import { HttpClientModule } from '@angular/common/http';
import 'hammerjs';
import { SettingsComponent } from './settings/settings.component';
import {
	TodoHomeComponent,
	TodoProjectComponent,
	TodoArchivedComponent,
	TodoDashboardComponent
} from './todo';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { AboutComponent } from './about/about.component';
import {
	EditContentDialogComponent,
	TodoDialogComponent,
	SignInDialogComponent,
	UserInfoDialogComponent,
	NewProjectDialogComponent
} from './dialogs';
import { SupportHomeComponent } from './support/support-home/support-home.component';
import { SupportViewerComponent } from './support/shared/support-viewer/support-viewer.component';
import { SupportSearchComponent } from './support/shared/support-search/support-search.component';
import { ChatsComponent } from './chats/chats.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { CheatsheetViewerComponent } from './cheatsheets/shared/cheatsheet-viewer/cheatsheet-viewer.component';
import { CheatsheetHomeComponent } from './cheatsheets/cheatsheet-home/cheatsheet-home.component';
import { MessagingService, MessageCardComponent } from './messaging.service';
import { NotesHomeComponent } from './notes/notes-home/notes-home.component';
import { NotesViewerComponent } from './notes/notes-viewer/notes-viewer.component';
import { NoteNotFoundComponent } from './notes/note-not-found/note-not-found.component';
import { AccountComponent } from './account/account.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthService } from './auth.service';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { TodoDashboardNewComponent } from './todo/todo-dashboard-new/todo-dashboard-new.component';

@NgModule({
	declarations: [
		AppComponent,
		AppDownloadsComponent,
		TodoHomeComponent,
		TestpageComponent,
		TipsComponent,
		TodoDialogComponent,
		SettingsComponent,
		TodoProjectComponent,
		TodoArchivedComponent,
		TodoDashboardComponent,
		EditContentDialogComponent,
		AboutComponent,
		SignInDialogComponent,
		SupportHomeComponent,
		SupportViewerComponent,
		SupportSearchComponent,
		UserInfoDialogComponent,
		ChatsComponent,
		ChatViewerComponent,
		CheatsheetViewerComponent,
		CheatsheetHomeComponent,
		MessageCardComponent,
		NotesHomeComponent,
		NotesViewerComponent,
		NoteNotFoundComponent,
		AccountComponent,
		LoginComponent,
		DashboardComponent,
		TodoOutletComponent,
		NewProjectDialogComponent,
		TodoDashboardNewComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule,
		AppRouting,
		HttpClientModule,
		FlexLayoutModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireAuthModule,
		AngularFirestoreModule.enablePersistence(),
		SharedModule,
		MarkdownModule.forRoot({
			provide: MarkedOptions,
			useValue: {
				gfm: true,
				tables: true,
				breaks: false,
				pedantic: false,
				sanitize: false,
				smartLists: true,
				smartypants: false
			}
		})
	],
	bootstrap: [AppComponent],
	providers: [
		ToolbarService,
		MessagingService,
		AuthService,
		NewProjectDialogComponent
	],
	entryComponents: [
		TodoDialogComponent,
		EditContentDialogComponent,
		SignInDialogComponent,
		UserInfoDialogComponent,
		NewProjectDialogComponent
	]
})
export class AppModule { }
