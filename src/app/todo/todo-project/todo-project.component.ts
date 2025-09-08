import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { TodoItem, TodoProject } from '../../interfaces';

@Component({
  selector: 'app-todo-project',
  templateUrl: './todo-project.component.html'
})
export class TodoProjectComponent {
  projectDoc: AngularFirestoreDocument<TodoProject>;
  project: Observable<TodoProject>;
  projectId: string;
  percentageComplete: Observable<number>;
  constructor(
    route: ActivatedRoute,
    afFs: AngularFirestore,
    afAuth: AngularFireAuth
  ) {
    route.params
      .pipe(
        filter(params => params.projectId)
      )
      .subscribe(params => {
        this.projectId = params.projectId;
      });

    afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.projectDoc = afFs.doc<TodoProject>(`users/${user.uid}/todoProjects/${this.projectId}`);
        this.project = this.projectDoc.valueChanges();
        this.percentageComplete = this.projectDoc.get()
        .pipe(
          map(snapshot => {
            const val = snapshot.get('todosDone') as TodoItem[];
            return val ? val.length : 0;
          })
        );
      }
    });
  }
}
