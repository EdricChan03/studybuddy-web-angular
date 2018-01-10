import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { TodoService, TodoDatabase, TodoDataSource } from './todo.service';
import { Observable } from 'rxjs/Observable';
import { NewTodoDialog } from '../newtodo/newtodo.component';
import { MatDialog, MatPaginator } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { SharedService } from '../shared.service';
import { TodoItem } from '../interfaces';
import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/of';

@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html'
})
export class TodoComponent implements OnInit {
	currentUser: string;
	todos$: Observable<TodoItem[]>;
	todosCollection: AngularFirestoreCollection<TodoItem>;
	todoTable = false;
	public dataSource: TodoDataSource | null;
	public displayedColumns = [
		'title',
		'content',
		'dueDate',
		'tags',
		'importance',
		'type'
	];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	public dataLength: any;
	constructor(
		private shared: SharedService,
		private afAuth: AngularFireAuth,
		private dialog: MatDialog,
		private todoService: TodoService,
		private todoDatabase: TodoDatabase,
		private fs: AngularFirestore
	) {
		afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
				this.todosCollection = this.fs.collection(`users/${this.currentUser}/todos`);
				this.todos$ = this.todosCollection.snapshotChanges().map(actions => {
					return actions.map(a => {
						const data = a.payload.doc.data() as TodoItem;
						const id = a.payload.doc.id;
						return { id, ...data };
					});
				});
				console.log(this.fs.collection(`users/${this.currentUser}/todos`).valueChanges());
			} else {
				console.warn('Current user doesn\'t exist yet!');
			}
		});
	}
	/**
	 * @todo
	 */
	goToDetailPage() {
	}
	newTodo() {
		this.dialog.open(NewTodoDialog, { disableClose: true });
	}
	removeTodo(id: string) {
		// tslint:disable-next-line:max-line-length
		this.shared.openConfirmDialog({ msg: 'Are you sure you want to delete the todo? Once deleted, it will be lost forever and cannot be retrieved again.' }).afterClosed().subscribe(res => {
			if (res === 'ok') {
				this.todosCollection.doc(id).delete().then(() => {
					// tslint:disable-next-line:max-line-length
					this.shared.openSnackBar({ msg: 'Todo was removed', additionalOpts: { duration: 3000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
				});
			} else {
				// tslint:disable-next-line:max-line-length
				this.shared.openSnackBar({ msg: 'Todo was not deleted', action: 'Undo', additionalOpts: { duration: 6000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } }).onAction().subscribe(() => {
					this.removeTodo(id);
				});
			}
		});
	}
	ngOnInit() {
		this.todoDatabase.getTodos().subscribe(data => {
			console.log(data);
			this.dataSource = new TodoDataSource(this.todoDatabase, this.paginator);
			this.dataLength = data;
		});
		console.log(`Data source: ${this.dataSource}`);
	}

}
