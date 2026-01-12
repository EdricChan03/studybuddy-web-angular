import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  collection,
  collectionData,
  CollectionReference, deleteDoc, doc,
  Firestore,
  query as fsQuery,
  runTransaction, updateDoc,
  where
} from '@angular/fire/firestore';
import { MatLegacyCheckboxChange as MatCheckboxChange } from '@angular/material/legacy-checkbox';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyMenuTrigger as MatMenuTrigger } from '@angular/material/legacy-menu';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable } from 'rxjs';

import { DialogsService } from '../../core/dialogs/dialogs.service';
import { TodoDialogComponent } from '../../dialogs';
import { TodoItem } from '../../interfaces';
import { SharedService } from '../../shared.service';
import { ToolbarService } from '../../toolbar.service';

@Component({
  selector: 'app-todo-home',
  templateUrl: './todo-home.component.html',
  animations: [
    trigger('todoUpdateAnim', [
      transition(':enter', [
        animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
          style({ 'background-color': '*', offset: 0 }),
          style({ 'background-color': '#fff3e0', offset: 0.25 }),
          style({ 'background-color': '#fff3e0', offset: 0.75 }),
          style({ 'background-color': '*', offset: 1 })
        ])
        )]
      )])
  ]
})
export class TodoHomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatMenuTrigger, { static: false }) rightClickMenu: MatMenuTrigger;
  currentUser: string;
  todos$: Observable<TodoItem[]>;
  todosCollection: CollectionReference<TodoItem>;
  todoView: 'list' | 'table' | 'agenda' = 'list';
  selectedTodos: TodoItem[] = [];
  dataSource: MatTableDataSource<TodoItem>;
  columnsToDisplay = ['isDone', 'title', 'content', 'actions'];
  constructor(
    private coreDialogs: DialogsService,
    private shared: SharedService,
    public toolbar: ToolbarService,
    private dialog: MatDialog,
    private dom: DomSanitizer,
    private afFs: Firestore,
    private afAuth: Auth
  ) {
    shared.title = 'Todos';
    afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user.uid;
        this.todosCollection = collection(afFs, `users/${this.currentUser}/todos`) as CollectionReference<TodoItem>;
        const todosData = fsQuery(
          this.todosCollection,
          where('isArchived', '==', false)
        );
        // Skip archived todos
        this.todos$ = collectionData(this.todosCollection, { idField: 'id' });
      } else {
        console.warn('Current user doesn\'t exist yet!');
      }
    });
  }
  private _checkEmpty(statement: any): boolean {
    return statement.length !== 0 || statement !== null;
  }

  ngOnInit() {
    this.toolbar.setProgress(true, true);
    this.toolbar.showToolbar = false;
  }

  ngAfterViewInit() {
    this.todos$.subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
    });
  }

  ngOnDestroy() {
    // Try to prevent memory leaks here by nullifying the data source.
    this.dataSource = null;
    // Also prevent memory leaks here
    this.todos$ = null;
    // Reset toolbar
    this.toolbar.showToolbar = true;
  }

  clearSelectedTodos() {
    this.selectedTodos = [];
  }

  markSelectedTodosAsDone() {
    runTransaction(
      this.afFs,
      async (transaction) => {
        for (const todo of this.selectedTodos) {
          transaction.update(doc(this.todosCollection, todo.id), { isDone: true });
        }
      }
    ).then(() => {
      this.clearSelectedTodos();
    }, err => {
      console.error('Could not mark selected todos as completed:', err);
      this.shared.openSnackBar({ msg: 'Could not mark selected todos complete. Try again later' });
    });
  }

  deleteSelectedTodos() {
    this.coreDialogs.openConfirmDialog({
      title: `Delete ${this.selectedTodos.length} todos?`,
      msg: 'Once deleted, it will be lost forever and cannot be retrieved again.'
    }).afterClosed().subscribe(result => {
      if (result === 'ok') {
        for (const todo of this.selectedTodos) {
          this._deleteTodo(todo.id);
        }
        this.shared.openSnackBar({ msg: 'Successfully deleted todos!' });
        // Reset selected todos
        this.clearSelectedTodos();
      }
    });
  }

  /**
   * Deletes all todos
   * See https://stackoverflow.com/a/49161622 for more info
   */
  deleteAllTodos() {
    // TODO: Probably not a good idea for performance, we should remove this functionality entirely
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

  handleListClick(todo: TodoItem, event: MouseEvent) {
    this.toggleChecked(todo);
  }

  checkboxOnClick(event: MouseEvent) {
    event.preventDefault();
  }

  hasListItemSelected(todoItem: TodoItem): boolean {
    return this.selectedTodos.includes(todoItem);
  }

  newTodo() {
    const dialogRef = this.dialog.open(TodoDialogComponent, { disableClose: true });
    dialogRef.componentInstance.isNewTodo = true;
  }

  editTodo(todoItem: TodoItem, event?: MouseEvent) {
    if (event) {
      this.stopPropogation(event);
    }
    const dialogRef = this.dialog.open(TodoDialogComponent, { disableClose: true });
    const tempTodoItem = Object.assign({}, todoItem);
    dialogRef.componentInstance.isNewTodo = false;
    dialogRef.componentInstance.todoToEdit = tempTodoItem;
  }
  private _deleteTodo(id: string) {
    deleteDoc(doc(this.todosCollection, id)).then(() => {
      this.shared.openSnackBar({ msg: 'Successfully deleted todo!' });
    });
  }

  stopPropogation(event: MouseEvent, stopImmediatePropagation = false) {
    if (event.stopImmediatePropagation && stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }
    if (event.stopPropagation && !stopImmediatePropagation) {
      event.stopPropagation();
    }
  }

  archiveTodo(todo: TodoItem) {
    updateDoc(doc(this.todosCollection, todo.id), { isArchived: true }).then(() => {
      console.log(`Successfully archived todo (document ID: ${todo.id})`);
      this.shared.openSnackBar({ msg: 'Successfully archived todo!' });
    })
    .catch((error) => {
      console.error(`An error occurred while attempting to archive the todo (document ID: ${todo.id}):`, error);
      this.shared.openSnackBar({
        msg: `An error occurred while attempting to archive the todo: ${error.message}`,
        action: 'Retry',
        additionalOpts: {
          duration: 8000
        }
      })
        .onAction().subscribe(() => this.archiveTodo(todo));
    });
  }

  removeTodo(id: string, bypassDialog?: boolean, event?: MouseEvent) {
    if (event) {
      this.stopPropogation(event);
      // Check if shift key is pressed
      if (event.shiftKey || bypassDialog) {
        this._deleteTodo(id);
      } else {
        // Show confirmation dialog
        this.deleteConfirmDialog(id, true);
      }
    } else {
      this.deleteConfirmDialog(id, true);
    }
  }
  deleteConfirmDialog(id: string, showHint?: boolean) {
    // eslint-disable-next-line max-len
    let dialogText = '<p>Are you sure you want to delete the todo? Once deleted, it will be lost forever and cannot be retrieved again.</p>';
    if (showHint) {
      dialogText += '<p><small>TIP: To bypass this dialog, hold the shift key when clicking the delete button.</small></p>';
    }
    const dialogRef = this.coreDialogs.openConfirmDialog({
      msg: this.dom.bypassSecurityTrustHtml(dialogText),
      title: 'Delete todo?',
      isHtml: true,
      positiveBtnText: 'Delete',
      positiveBtnColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res === 'ok') {
        this._deleteTodo(id);
      }
    });
  }
  /**
   * The on change for a checkbox
   * @param todo The todo item
   * @param event The checkbox change event
   */
  onSelectedChange(todo: TodoItem, event: MatCheckboxChange) {
    updateDoc(
      doc(this.todosCollection, todo.id),
      { isDone: event.checked }
    ).catch((err) => {
      this.shared.openSnackBar({
        msg: `Could not mark todo as ${event.checked ? 'complete' : 'incomplete'}. Try again later`
      });
      console.error(`Could not update todo isDone to ${event.checked}:`, err);
    });
  }
}
