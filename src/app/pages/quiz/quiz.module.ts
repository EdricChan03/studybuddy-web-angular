import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormlyModule } from '@ngx-formly/core';
import { EmptyStateModule } from '../../components/empty-state/empty-state.module';
import { CreateQuizComponent } from './create-quiz/create-quiz.component';
import { QuizListComponent } from './quiz-list/quiz-list.component';
import { QuizRoutingModule } from './quiz-routing.module';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatFormFieldModule,
  MatInputModule
];

const ANGULAR_FIRE_MODULES = [
  AngularFireAuthModule,
  AngularFireAuthGuardModule,
  AngularFirestoreModule
];

@NgModule({
  declarations: [QuizListComponent, CreateQuizComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormlyModule,
    MATERIAL_MODULES,
    ANGULAR_FIRE_MODULES,
    FlexLayoutModule,
    EmptyStateModule,
    QuizRoutingModule
  ]
})
export class QuizModule { }
