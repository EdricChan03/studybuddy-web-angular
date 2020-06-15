import { Component } from '@angular/core';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { filter, switchMap } from 'rxjs/operators';
import { TodoProject } from '../../interfaces';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

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
    private route: ActivatedRoute,
    private afFs: AngularFirestore,
    private afAuth: AngularFireAuth
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
        this.projectDoc = afFs.doc(`users/${user.uid}/todoProjects/${this.projectId}`);
        this.project = this.projectDoc.valueChanges();
        this.percentageComplete = this.projectDoc.get()
        .pipe(
          switchMap((snapshot) => {
            const val = snapshot.get('todosDone');
            return val ? val.length : 0;
          })
        );
      }
    });
  }
}
