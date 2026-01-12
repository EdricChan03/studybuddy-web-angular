import { Component } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, collectionData, CollectionReference, doc, Firestore, updateDoc } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

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
    .task-dashboard__header {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class DashboardComponent {
  currentUser: string;
  todos$: Observable<TodoItem[]>;
  todosCollection: CollectionReference<TodoItem>;

  constructor(
    private shared: SharedService,
    private afAuth: Auth,
    private dialog: MatDialog,
    private afFs: Firestore,
    private dom: DomSanitizer,
    public toolbarService: ToolbarService
  ) {
    shared.title = 'Dashboard';
    afAuth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        this.currentUser = user.uid;
        this.todosCollection = collection(afFs, `users/${this.currentUser}/todos`) as CollectionReference<TodoItem>;
        this.todos$ = collectionData(this.todosCollection, {idField: 'id'});
        this.todos$.subscribe(() => {
          this.toolbarService.setProgress(false);
        });
      } else {
        console.warn('Current user doesn\'t exist yet!');
      }
    });
  }

  toggleChecked(todo: TodoItem) {
    updateDoc(
      doc(this.todosCollection, todo.id),
      {
        isDone: !todo.isDone
      }
    ).catch(err => {
      this.shared.openSnackBar({
        msg: `Could not mark todo as ${!todo.isDone ? 'completed' : 'incomplete'}. Try again later`
      });
      console.error('Could not update todo\'s completion:', err);
    });
  }

  newTodo() {
    const dialogRef = this.dialog.open(TodoDialogComponent, { disableClose: true });
    dialogRef.componentInstance.isNewTodo = true;
  }
}
