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
import { AngularFireRemoteConfigModule, DEFAULTS as DEFAULT_CONFIG, SETTINGS as REMOTE_CONFIG_SETTINGS } from '@angular/fire/remote-config';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormControl, FormsModule, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { FormlyMaterialModule } from '@ngx-formly/material';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AboutComponent } from './about/about.component';
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
import { HotkeysModule } from './core/hotkeys/hotkeys.module';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared.service';
import { CustomFormlyModule } from './shared/formly/custom-formly.module';
import { SearchInputComponent } from './shared/search-input/search-input.component';
import { SignupComponent } from './signup/signup.component';
import { TipsComponent } from './tips/tips.component';
import { TodoArchivedComponent, TodoDashboardComponent, TodoHomeComponent, TodoProjectComponent } from './todo';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { ToolbarService } from './toolbar.service';
import { UserViewerComponent } from './user-viewer/user-viewer.component';
import { DialogsModule as CoreDialogsModule } from './core/dialogs/dialogs.module';

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
    TodoProjectComponent,
    TodoArchivedComponent,
    TodoDashboardComponent,
    AboutComponent,
    SearchInputComponent,
    ChatsComponent,
    ChatExploreComponent,
    ChatViewerComponent,
    DashboardComponent,
    TodoOutletComponent,
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
    AngularFireRemoteConfigModule,
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
    ComponentsModule,
    CoreDialogsModule
  ],
  bootstrap: [AppComponent],
  providers: [
    ToolbarService,
    AuthService,
    ApiService,
    // @angular/fire optional Analytics services
    ScreenTrackingService,
    UserTrackingService,
    { provide: APP_NAME, useValue: environment.analytics.appName },
    { provide: APP_VERSION, useValue: environment.analytics.appVersion },
    { provide: COLLECTION_ENABLED, useValue: !environment.analytics.disableCollection },
    { provide: DEBUG_MODE, useValue: environment.analytics.debugMode },
    {
      provide: REMOTE_CONFIG_SETTINGS, useFactory: () =>
        ('remoteConfig' in environment && 'settings' in environment.remoteConfig) ? environment.remoteConfig.settings : {}
    },
    {
      provide: DEFAULT_CONFIG, useFactory: () =>
        ('remoteConfig' in environment && 'defaults' in environment.remoteConfig) ? environment.remoteConfig.defaults : {}
    }
  ]
})
export class AppModule { }
