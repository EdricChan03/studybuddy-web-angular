import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import {
  AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService,
  APP_NAME, APP_VERSION, COLLECTION_ENABLED, DEBUG_MODE
} from '@angular/fire/analytics';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFirePerformanceModule } from '@angular/fire/performance';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import 'hammerjs';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { ApiService } from './api.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppDownloadsComponent } from './appdownloads/appdownloads.component';
import { AuthService } from './auth.service';
import { ChatExploreComponent } from './chats/chat-explore/chat-explore.component';
import { ChatViewerComponent } from './chats/chat-viewer/chat-viewer.component';
import { ChatsComponent } from './chats/chats.component';
import { ComponentsModule } from './components/components.module';
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
import { CustomFormlyModule } from './shared/formly/custom-formly.module';
import { SearchInputComponent } from './shared/search-input/search-input.component';
import { SignupComponent } from './signup/signup.component';
import { SupportViewerComponent } from './support/shared/support-viewer/support-viewer.component';
import { SupportHomeComponent } from './support/support-home/support-home.component';
import { TipsComponent } from './tips/tips.component';
import { TodoArchivedComponent, TodoDashboardComponent, TodoHomeComponent, TodoProjectComponent } from './todo';
import { TodoDashboardNewComponent } from './todo/todo-dashboard-new/todo-dashboard-new.component';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { ToolbarService } from './toolbar.service';
import { UserViewerComponent } from './user-viewer/user-viewer.component';
import { HotkeysModule } from './hotkeys/hotkeys.module';

function EmailValidator(control: FormControl): ValidationErrors {
  // Regex from https://emailregex.com/
  return !control.value ||
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(control.value) ? null : { email: true };
}

function minItemsValidationMessage(err, field: FormlyFieldConfig) {
  return `A minimum of ${field.templateOptions.minItems} items are required.`;
}

@NgModule({
  declarations: [
    AppComponent,
    AppDownloadsComponent,
    TodoHomeComponent,
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
    MessageCardComponent,
    NotesHomeComponent,
    NotesViewerComponent,
    NoteNotFoundComponent,
    AccountComponent,
    LoginComponent,
    DashboardComponent,
    TodoOutletComponent,
    TodoDashboardNewComponent,
    SignupComponent,
    UserViewerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validators: [
        { name: 'email', validation: EmailValidator }
      ],
      validationMessages: [
        { name: 'required', message: 'This field is required.' },
        { name: 'email', message: 'Please enter a valid email address!' },
        { name: 'minItems', message: minItemsValidationMessage }
      ]
    }),
    FormlyMaterialModule,
    CustomFormlyModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFireAuthModule,
    AngularFireAuthGuardModule,
    AngularFirestoreModule.enablePersistence({ synchronizeTabs: true }),
    AngularFirePerformanceModule,
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
    ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production, scope: './' }),
    DialogsModule,
    HotkeysModule,
    ComponentsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    ToolbarService,
    MessagingService,
    AuthService,
    ApiService,
    // @angular/fire optional Analytics services
    ScreenTrackingService,
    UserTrackingService,
    { provide: APP_NAME, useValue: environment.analytics.appName },
    { provide: APP_VERSION, useValue: environment.analytics.appVersion },
    { provide: COLLECTION_ENABLED, useValue: !environment.analytics.disableCollection },
    { provide: DEBUG_MODE, useValue: environment.analytics.debugMode }
  ]
})
export class AppModule { }
