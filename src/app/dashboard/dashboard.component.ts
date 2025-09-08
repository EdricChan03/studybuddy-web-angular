import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TodoDialogComponent } from '../dialogs';
import { TodoItem } from '../interfaces';
import { SharedService } from '../shared.service';
import { ToolbarService } from '../toolbar.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: [`
  .empty-state-image {
    width: 300px;
  }
  `]
})
export class DashboardComponent {
  currentUser: string;
  todos$: Observable<TodoItem[]>;
  todosCollection: AngularFirestoreCollection<TodoItem>;
  constructor(
    private shared: SharedService,
    private afAuth: AngularFireAuth,
    private dialog: MatDialog,
    private afFs: AngularFirestore,
    private dom: DomSanitizer,
    public toolbarService: ToolbarService
  ) {
    shared.title = 'Dashboard';
    afAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.currentUser = user.uid;
        this.todosCollection = this.afFs.collection<TodoItem>(`users/${this.currentUser}/todos`);
        this.todos$ = this.todosCollection.snapshotChanges().pipe(map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as TodoItem;
            data.id = a.payload.doc.id;
            return data;
          });
        }));
        this.todos$.subscribe(() => {
          this.toolbarService.setProgress(false);
        });
      } else {
        console.warn('Current user doesn\'t exist yet!');
      }
    });
  }

  toggleChecked(todo: TodoItem) {
    this.todosCollection.doc<TodoItem>(todo.id).update({
      isDone: !todo.isDone
    });
  }

  newTodo() {
    const dialogRef = this.dialog.open(TodoDialogComponent, { disableClose: true });
    dialogRef.componentInstance.isNewTodo = true;
  }
}
