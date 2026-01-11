import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getAnalytics,
  provideAnalytics,
  setAnalyticsCollectionEnabled,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { AuthGuardModule } from '@angular/fire/auth-guard';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';

import { FlexLayoutModule } from '@angular/flex-layout';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
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
import { ComponentsModule } from './components/components.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DialogsModule } from './dialogs/dialogs.module';
import { HotkeysModule } from './core/hotkeys/hotkeys.module';
import { MaterialModule } from './material.module';
import { SharedModule } from './shared.service';
import { CustomFormlyModule } from './shared/formly/custom-formly.module';
import { SearchInputComponent } from './shared/search-input/search-input.component';
import { TipsComponent } from './tips/tips.component';
import {
  TodoArchivedComponent,
  TodoDashboardComponent,
  TodoHomeComponent,
  TodoProjectComponent,
} from './todo';
import { TodoOutletComponent } from './todo/todo-outlet/todo-outlet.component';
import { ToolbarService } from './toolbar.service';
import { UserViewerComponent } from './user-viewer/user-viewer.component';
import { DialogsModule as CoreDialogsModule } from './core/dialogs/dialogs.module';

function EmailValidator(control: FormControl): ValidationErrors {
  // Regex from https://emailregex.com/
  return !control.value ||
    /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      control.value,
    )
    ? null
    : { email: true };
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
    DashboardComponent,
    TodoOutletComponent,
    UserViewerComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot({
      validators: [{ name: 'email', validation: EmailValidator }],
      validationMessages: [
        { name: 'required', message: 'This field is required.' },
        { name: 'email', message: 'Please enter a valid email address!' },
        { name: 'minItems', message: minItemsValidationMessage },
      ],
    }),
    FormlyMaterialModule,
    CustomFormlyModule,
    MaterialModule,
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => {
      const analytics = getAnalytics();
      setAnalyticsCollectionEnabled(
        analytics,
        !environment.analytics.disableCollection,
      );
      return analytics;
    }),
    provideAuth(() => getAuth()),
    AuthGuardModule,
    provideFirestore(() => getFirestore()),
    providePerformance(() => getPerformance()),
    provideRemoteConfig(() => {
      const config = getRemoteConfig();
      config.settings = {
        ...config.settings,
        ...environment?.remoteConfig?.settings,
      };
      return config;
    }),
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
          smartypants: false,
        },
      },
    }),
    NgCircleProgressModule.forRoot(),
    ServiceWorkerModule.register('./ngsw-worker.js', {
      enabled: environment.production,
      scope: './',
    }),
    DialogsModule,
    HotkeysModule,
    ComponentsModule,
    CoreDialogsModule,
  ],
  bootstrap: [AppComponent],
  providers: [
    ToolbarService,
    AuthService,
    ApiService,
    // @angular/fire optional Analytics services
    ScreenTrackingService,
    UserTrackingService,
  ],
})
export class AppModule { }
