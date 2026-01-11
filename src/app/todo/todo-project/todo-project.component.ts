import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, docData, DocumentReference, Firestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { TodoProject } from '../../interfaces';

@Component({
  selector: 'app-todo-project',
  templateUrl: './todo-project.component.html'
})
export class TodoProjectComponent {
  projectDoc: DocumentReference<TodoProject>;
  project: Observable<TodoProject>;
  projectId: string;
  percentageComplete: Observable<number>;
  constructor(
    route: ActivatedRoute,
    afFs: Firestore,
    afAuth: Auth
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
        this.projectDoc = doc(afFs, `users/${user.uid}/todoProjects/${this.projectId}`) as DocumentReference<TodoProject>;
        this.project = docData(this.projectDoc, { idField: 'id' });
        this.percentageComplete = this.project.pipe(
          map(project => {
            const val = project.todosDone;
            return val ? val.length : 0;
          })
        );
      }
    });
  }
}
