import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { SharedService } from '../../../shared.service';
import { Quiz } from './model/quiz';

@Component({
  selector: 'app-quiz-list',
  templateUrl: './quiz-list.component.html'
})
export class QuizListComponent implements OnInit {

  // completedQuizzesCollection: AngularFirestoreCollection<Quiz>;
  // completedQuizzes$: Observable<Quiz[]>;
  ownedQuizzesCollection: AngularFirestoreCollection<Quiz>;
  ownedQuizzes$: Observable<Quiz[]>;
  constructor(
    private shared: SharedService,
    private afAuth: AngularFireAuth,
    private afFs: AngularFirestore
  ) {
    shared.title = 'Quizzes';
    afAuth.auth.onAuthStateChanged(user => {
      // this.completedQuizzesCollection = afFs.collection(`users/${user.uid}/completedQuizzes`);
      // this.completedQuizzes$ = this.completedQuizzesCollection.valueChanges({ idfield: 'id' });
      this.ownedQuizzesCollection = afFs.collection('quizzes', ref => ref.where('author', '==', afFs.doc(`users/${user.uid}`).ref));
      this.ownedQuizzes$ = this.ownedQuizzesCollection.valueChanges({ idField: 'id' });
    });
  }

  ngOnInit() {
  }

}
