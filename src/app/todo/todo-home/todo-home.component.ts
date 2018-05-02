import { ToolbarService } from '../../toolbar.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { TodoDialogComponent } from '../../dialogs';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from 'angularfire2/auth';
import { SharedService, SnackBarConfig } from '../../shared.service';
import { TodoItem } from '../../interfaces';
import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MatMenuTrigger } from '@angular/material/menu';
import { Observable, of } from 'rxjs';
import { transition, style, animate, trigger, keyframes } from '@angular/animations';
// import { animations } from '../../animations';

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
export class TodoHomeComponent implements OnInit {
	@ViewChild(MatMenuTrigger) rightClickMenu: MatMenuTrigger;
	currentUser: string;
	todos$: Observable<TodoItem[]>;
	todosCollection: AngularFirestoreCollection<TodoItem>;
	todoTable = false;
	selectedTodos: TodoItem[] = [];
	constructor(
		private shared: SharedService,
		private afAuth: AngularFireAuth,
		private dialog: MatDialog,
		private fs: AngularFirestore,
		private dom: DomSanitizer,
		public toolbarService: ToolbarService
	) {
		shared.title = 'Todos';
		afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
				this.todosCollection = this.fs.collection(`users/${this.currentUser}/todos`);
				this.todos$ = this.todosCollection.snapshotChanges().map(actions => {
					return actions.map(a => {
						const data = a.payload.doc.data() as TodoItem;
						data.id = a.payload.doc.id;
						return data;
					});
				});
				this.todos$.subscribe(() => {
					this.toolbarService.setProgress(false);
				})
			} else {
				console.warn('Current user doesn\'t exist yet!');
			}
		});
	}
	private _checkEmpty(statement: any): boolean {
		return statement.length != 0;
	}
	clearSelectedTodos() {
		this.selectedTodos = [];
		this.toolbarService.showToolbar = true;
	}
	markSelectedTodosAsDone() {
		for (let i = 0; i < this.selectedTodos.length; i++) {
			this.todosCollection.doc<TodoItem>(this.selectedTodos[i].id).update({
				hasDone: true
			});
		}
		this.clearSelectedTodos();
	}
	deleteSelectedTodos() {
		// tslint:disable-next-line:max-line-length
		this.shared.openConfirmDialog({ title: 'Delete todos?', msg: 'Once deleted, it will be lost forever and cannot be retrieved again.' }).afterClosed().subscribe(result => {
			if (result === 'ok') {
				for (let i = 0; i < this.selectedTodos.length; i++) {
					this._deleteTodo(this.selectedTodos[i].id);
				}
				// tslint:disable-next-line:max-line-length
				this.shared.openSnackBar({ msg: 'Todos deleted', additionalOpts: { duration: 4000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
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
		const dialogRef = this.shared.openConfirmDialog({ msg: 'Are you sure you want to delete all todos? Once deleted, it cannot be restored!', title: 'Delete all todos?' });
		dialogRef.afterClosed().subscribe(result => {
			if (result == 'ok') {
				let promises = [];
				this.todosCollection.ref.get()
					.then((refs) => {
						refs.forEach((doc) => {
							promises.push(this.todosCollection.doc(doc.id).delete());
						})
					})
					.catch((error: { message: string }) => {
						let snackBarRef = this.shared.openErrorSnackBar({ action: 'Retry', hasElevation: 2, msg: `${error.message}`, additionalOpts: { horizontalPosition: 'start' } });
						snackBarRef.onAction().subscribe(result => {
							this.deleteAllTodos();
						})
					})
				Promise.all(promises).then(() => {
					console.log('All documents of collection deleted.');
				})
					.catch((error: { message: string }) => {
						let snackBarRef = this.shared.openErrorSnackBar({ action: 'Retry', hasElevation: 2, msg: `${error.message}`, additionalOpts: { horizontalPosition: 'start' } });
						snackBarRef.onAction().subscribe(result => {
							this.deleteAllTodos();
						})
					})
			}
		})
	}
	toggleChecked(todo: TodoItem) {
		todo.hasDone = !todo.hasDone;
		if (todo.hasDone) {
			this.todosCollection.doc<TodoItem>(todo.id).update({
				hasDone: true
			});
		} else {
			this.todosCollection.doc<TodoItem>(todo.id).update({
				hasDone: false
			});
		}
	}
	handleListClick(todo: TodoItem, event: MouseEvent) {
		if (!this.toolbarService.showToolbar) {
			if (this.selectedTodos.indexOf(todo) === -1) {
				this.selectedTodos.push(todo);
				console.debug('[DEBUG] Selected items pushed:', this.selectedTodos);
			} else {
				this.selectedTodos = this.selectedTodos.filter((filteredTodo) => {
					return filteredTodo.id !== todo.id;
				});
				console.debug('[DEBUG] Item removed:', this.selectedTodos);
			}
		} else {
			if (event.ctrlKey || event.metaKey) {
				if (this.selectedTodos.indexOf(todo) === -1) {
					this.selectedTodos.push(todo);
					console.debug('[DEBUG] Selected items pushed:', this.selectedTodos);
				} else {
					this.selectedTodos = this.selectedTodos.filter((filteredTodo) => {
						return filteredTodo.id !== todo.id;
					});
					console.debug('[DEBUG] Item removed:', this.selectedTodos);
				}
			} else {
				this.toggleChecked(todo);
			}
		}
		if (this.selectedTodos.length > 0) {
			this.toolbarService.showToolbar = false;
		} else {
			this.toolbarService.showToolbar = true;
		}
	}
	checkboxOnClick(event: MouseEvent) {
		event.preventDefault();
	}
	hasListItemSelected(todoItem: TodoItem): boolean {
		return this.selectedTodos.includes(todoItem);
	}
	newTodo() {
		let dialogRef = this.dialog.open(TodoDialogComponent, { disableClose: true });
		dialogRef.componentInstance.isNewTodo = true;
	}
	editTodo(todoItem: TodoItem, event?: KeyboardEvent | MouseEvent) {
		if (event) {
			event.stopImmediatePropagation();
		}
		let dialogRef = this.dialog.open(TodoDialogComponent, { disableClose: true });
		let tempTodoItem = Object.assign({}, todoItem);
		dialogRef.componentInstance.isNewTodo = false;
		dialogRef.componentInstance.todoToEdit = tempTodoItem;
	}
	private _deleteTodo(id: string) {
		this.todosCollection.doc(id).delete().then(() => {
			// tslint:disable-next-line:max-line-length
			this.shared.openSnackBar({ msg: 'Todo was removed', additionalOpts: { duration: 3000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
		});
	}
	stopPropogation(event: KeyboardEvent) {
		event.stopImmediatePropagation();
	}
	removeTodo(id: string, bypassDialog?: boolean, event?: KeyboardEvent) {
		if (event) {
			event.stopImmediatePropagation();
			// Check if shify key is pressed
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
		// tslint:disable-next-line:max-line-length
		let dialogRef = this.shared.openConfirmDialog({ msg: this.dom.bypassSecurityTrustHtml(dialogText), title: 'Delete todo?', isHtml: true, ok: 'Delete', okColor: 'warn' });
		dialogRef.afterClosed().subscribe(res => {
			if (res === 'ok') {
				this._deleteTodo(id);
			} else {
				// tslint:disable-next-line:max-line-length
				this.shared.openSnackBar({ msg: 'Todo was not deleted', action: 'Undo', additionalOpts: { duration: 6000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } }).onAction().subscribe(() => {
					this.removeTodo(id, true);
				});
			}
		});
	}
	/**
	 * The on change for a checkbox
	 * @param {TodoItem} todo The todo item
	 * @param {MatCheckboxChange} event The checkbox change event
	 */
	onSelectedChange(todo: TodoItem, event: MatCheckboxChange) {
		this.fs.doc<TodoItem>(`users/${this.currentUser}/todos/${todo.id}`).update({
			hasDone: event.checked
		});
	}
	ngOnInit() {
		this.toolbarService.setProgress(true, true);
	}

}