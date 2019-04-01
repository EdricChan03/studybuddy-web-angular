import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import 'hammerjs';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { ApiService } from './api.service';
import { AppComponent } from './app.component';
import { AppRouting } from './app.routing';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { AuthService } from './auth.service';
import { ChatExploreComponent } from './chats/chat-explore/chat-explore.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { ChatsComponent } from './chats/chats.component';
import { CheatsheetHomeComponent } from './cheatsheets/cheatsheet-home/cheatsheet-home.component';
import { CheatsheetViewerComponent } from './cheatsheets/shared/cheatsheet-viewer/cheatsheet-viewer.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DialogsModule } from './dialogs/dialogs.module';
import { LoginComponent } from './login/login.component';
import { MaterialModule } from './material.module';
import { MessageCardComponent, MessagingService } from './messaging.service';
import { NoteNotFoundComponent } from './notes/note-not-found/note-not-found.component';
import { NotesHomeComponent } from './notes/notes-home/notes-home.component';
import { NotesViewerComponent } from './notes/notes-viewer/notes-viewer.component';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from './shared.service';
import { SearchInputComponent } from './shared/search-input/search-input.component';
import { SignupComponent } from './signup/signup.component';
import { SupportViewerComponent } from './support/shared/support-viewer/support-viewer.component';
import { SupportHomeComponent } from './support/support-home/support-home.component';
import { TestpageComponent } from './testpage/testpage.component';
import { TipsComponent } from './tips/tips.component';
import { TodoArchivedComponent, TodoDashboardComponent, TodoHomeComponent, TodoProjectComponent } from './todo';
import { TodoDashboardNewComponent } from './todo/todo-dashboard-new/todo-dashboard-new.component';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { ToolbarService } from './toolbar.service';

@NgModule({
  declarations: [
    AppComponent,
    AppDownloadsComponent,
    TodoHomeComponent,
    TestpageComponent,
    TipsComponent,
    SettingsComponent,
    TodoProjectComponent,
    TodoArchivedComponent,
    TodoDashboardComponent,
    AboutComponent,
    SupportHomeComponent,
    SupportViewerComponent,
    SearchInputComponent,
    ChatsComponent,
    ChatExploreComponent,
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
    TodoDashboardNewComponent,
    SignupComponent
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
      markedOptions: {
        provide: MarkedOptions,
        useValue: {
          gfm: true,
          tables: true,
          breaks: false,
          headerIds: true,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false
        }
      }
    }),
    NgCircleProgressModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    DialogsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    ToolbarService,
    MessagingService,
    AuthService,
    ApiService
  ]
})
export class AppModule { }
