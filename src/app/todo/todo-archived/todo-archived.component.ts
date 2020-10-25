
import { map } from 'rxjs/operators';
import { ToolbarService } from '../../toolbar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { TodoDialogComponent } from '../../dialogs';
import { MatCheckboxChange } from '@angular/material/checkbox';
// import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from '@angular/fire/auth';
import { SharedService } from '../../shared.service';
import { TodoItem } from '../../interfaces';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, SecurityContext } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { transition, style, animate, trigger, keyframes } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { DialogsService } from '../../core/dialogs/dialogs.service';
// import { animations } from '../../animations';

@Component({
  selector: 'app-todo-archived',
  templateUrl: './todo-archived.component.html',
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
export class TodoArchivedComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatMenuTrigger, { static: false }) rightClickMenu: MatMenuTrigger;
  currentUser: string;
  todos$: Observable<TodoItem[]>;
  todosCollection: AngularFirestoreCollection<TodoItem>;
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
    private afFs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) {
    shared.title = 'Todos';
    afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user.uid;
        this.todosCollection = this.afFs.collection<TodoItem>(
          `users/${this.currentUser}/todos`,
          ref => ref.where('isArchived', '==', true)
        );
        this.todos$ = this.todosCollection.snapshotChanges().pipe(map(actions => {
          return actions.map(a => {
            // tslint:disable-next-line:no-shadowed-variable
            const data = a.payload.doc.data() as TodoItem;
            data.id = a.payload.doc.id;
            return data;
          });
        }));
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
  }

  clearSelectedTodos() {
    this.selectedTodos = [];
    this.toolbar.showToolbar = true;
  }
  markSelectedTodosAsDone() {
    for (const todo of this.selectedTodos) {
      this.todosCollection.doc<TodoItem>(todo.id).update({
        isDone: true
      });
    }
    this.clearSelectedTodos();
  }
  unarchiveSelectedTodos() {
    this.coreDialogs.openConfirmDialog({
      msg: `Unarchive ${this.selectedTodos.length} todos?`,
      positiveBtnText: 'Confirm'
    }).afterClosed().subscribe(result => {
      if (result === 'ok') {
        // Use Array#forEach to simplify for-loop
        this.selectedTodos.forEach(todo => this.unarchiveTodo(todo, true));
        this.shared.openSnackBar({ msg: 'Successfully unarchived todos!' });
        // Reset selected todos
        this.clearSelectedTodos();
      }
    });
  }
  deleteSelectedTodos() {
    this.coreDialogs.openConfirmDialog({
      title: `Delete ${this.selectedTodos.length} todos?`,
      msg: 'Once deleted, it will be lost forever and cannot be retrieved again.',
      positiveBtnText: 'Confirm'
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
    const dialogRef = this.coreDialogs.openConfirmDialog({
      msg: 'Are you sure you want to delete all todos? Once deleted, it cannot be restored!',
      title: 'Delete all todos?',
      positiveBtnText: 'Cancel',
      negativeBtnText: 'Delete',
      negativeBtnColor: 'warn'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'ok') {
        const promises = [];
        this.todosCollection.ref.get()
          .then((refs) => {
            refs.forEach((doc) => {
              promises.push(this.todosCollection.doc(doc.id).delete());
            });
          })
          .catch((error: { message: string }) => {
            const snackBarRef = this.shared.openSnackBar({
              action: 'Retry',
              msg: `${error.message}`
            });
            snackBarRef.onAction().subscribe(() => {
              this.deleteAllTodos();
            });
          });
        Promise.all(promises).then(() => {
          console.log('All documents of collection deleted.');
          this.shared.openSnackBar({
            msg: 'Successfully deleted all todos!'
          });
        })
          .catch((error: { message: string }) => {
            const snackBarRef = this.shared.openSnackBar({
              action: 'Retry',
              msg: `An error occurred: ${error.message}`,
            });
            snackBarRef.onAction().subscribe(() => {
              this.deleteAllTodos();
            });
          });
      }
    });
  }
  toggleChecked(todo: TodoItem) {
    this.todosCollection.doc<TodoItem>(todo.id).update({
      isDone: !todo.isDone
    });
  }
  handleListClick(todo: TodoItem, event: MouseEvent) {
    if (!this.toolbar.showToolbar) {
      if (this.selectedTodos.indexOf(todo) === -1) {
        this.selectedTodos.push(todo);
        console.log('[DEBUG] Selected items pushed:', this.selectedTodos);
      } else {
        this.selectedTodos = this.selectedTodos.filter((filteredTodo) => {
          return filteredTodo.id !== todo.id;
        });
        console.log('[DEBUG] Item removed:', this.selectedTodos);
      }
    } else {
      if (event.ctrlKey || event.metaKey) {
        if (this.selectedTodos.indexOf(todo) === -1) {
          this.selectedTodos.push(todo);
          console.log('[DEBUG] Selected items pushed:', this.selectedTodos);
        } else {
          this.selectedTodos = this.selectedTodos.filter((filteredTodo) => {
            return filteredTodo.id !== todo.id;
          });
          console.log('[DEBUG] Item removed:', this.selectedTodos);
        }
      } else {
        this.toggleChecked(todo);
      }
    }
    if (this.selectedTodos.length > 0) {
      this.toolbar.showToolbar = false;
    } else {
      this.toolbar.showToolbar = true;
    }
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
  unarchiveTodo(todo: TodoItem, skipConfirmDialog = false) {
    let unarchiveConfirm = false;
    if (!skipConfirmDialog) {
      this.coreDialogs.openConfirmDialog({
        msg: 'Unarchive todo?',
        positiveBtnText: 'Unarchive'
      }).afterClosed().subscribe(result => {
        if (result === 'ok') {
          unarchiveConfirm = true;
        }
      });
    } else {
      unarchiveConfirm = true;
    }
    if (unarchiveConfirm) {
      this.todosCollection.doc(todo.id).update({
        isArchived: false
      })
        .then(() => {
          console.log(`Successfully unarchived todo (document ID: ${todo.id})`);
          this.shared.openSnackBar({ msg: 'Successfully unarchived todo!' });
        })
        .catch((error) => {
          console.error('An error occurred while attempting to archive the todo:', error);
          this.shared.openSnackBar({ msg: `An error occurred while attempting to archive the todo: ${error.message}` });
        });
    } else {
      console.error('User cancelled the confirmation request.');
    }
  }

  private _deleteTodo(id: string) {
    this.todosCollection.doc(id).delete().then(() => {
      console.log(`Successfully deleted todo (document ID: ${id})`);
      this.shared.openSnackBar({ msg: 'Successfully deleted todo!' });
    })
      .catch((error) => {
        console.error('An error occurred while attempting to delete the todo:', error);
        this.shared.openSnackBar({ msg: `An error occurred while attempting to delete the todo: ${error.message}` });
      });
  }

  // Method for stopping propogation
  stopPropogation(event: MouseEvent, stopImmediatePropagation = false) {
    if (event.stopImmediatePropagation && stopImmediatePropagation) {
      event.stopImmediatePropagation();
    }
    if (event.stopPropagation && !stopImmediatePropagation) {
      event.stopPropagation();
    }
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
    // tslint:disable-next-line:max-line-length
    let dialogText = '<p>Are you sure you want to delete the todo? Once deleted, it will be lost forever and cannot be retrieved again.</p>';
    if (showHint) {
      dialogText += '<p><small>TIP: To bypass this dialog, hold the shift key when clicking the delete button.</small></p>';
    }
    const dialogRef = this.coreDialogs.openConfirmDialog({
      // Note: DomSanizier#sanitize is the preferred method here as it sanitises according to the security context,
      // as compared to DomSanitizer#bypassSecurityTrustHtml which completely bypasses security checks
      msg: this.dom.sanitize(SecurityContext.HTML, dialogText),
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
    this.afFs.doc<TodoItem>(`users/${this.currentUser}/todos/${todo.id}`).update({
      isDone: event.checked
    });
  }

}
