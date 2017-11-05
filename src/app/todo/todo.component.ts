import { AngularFirestore } from 'angularfire2/firestore';
import { TodoService, TodoDatabase, TodoDataSource } from './todo.service';
import { Observable } from 'rxjs/Observable';
import { NewTodoDialog } from './../newtodo/newtodo.component';
import { MatDialog, MatPaginator } from '@angular/material';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Shared, Todo } from './../shared';
import { Component, OnInit, AfterViewInit, AfterContentInit, ViewChild } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import 'rxjs/add/observable/of';

@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html'
})
export class TodoComponent implements OnInit{
	currentUser: string;
	todos: Observable<any>;
	todoTable: boolean = false;
	public dataSource: TodoDataSource | null;
	public displayedColumns = [
		'title',
		'content',
		'dueDate',
		'tags',
		'importance',
		'type'
	]
	@ViewChild(MatPaginator) paginator: MatPaginator;
	public dataLength: any;
	constructor(
		private shared: Shared,
		private afAuth: AngularFireAuth,
		private db: AngularFireDatabase,
		private dialog: MatDialog,
		private todoService: TodoService,
		private todoDatabase: TodoDatabase,
		private fs: AngularFirestore
	) {
		afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
				this.todos = this.db.list(`users/${this.currentUser}/todo`).valueChanges();
			} else {
			}
		})
	}
	/**
	 * @todo
	 */
	deleteMember() {

	}
	/**
	 * @todo
	 */
	goToDetailPage() {
	}
	newTodo() {
		this.dialog.open(NewTodoDialog);
	}
	removeTodo(key: string) {
		this.shared.openConfirmDialog({ msg: "Are you sure you want to delete the todo? Once deleted, it will be lost forever and cannot be retrieved again." }).afterClosed().subscribe(res => {
			if (res == 'ok') {
				// this.todos.delete(key).then(_ => {
				// 	this.shared.openSnackBar({ msg: "Todo was removed", additionalOpts: { duration: 3000 } });
				// })
			} else {
				this.shared.openSnackBarWithRef({ msg: "Todo was not deleted", action: "Undo", additionalOpts: { duration: 6000 } }).onAction().subscribe(_ => {
					this.removeTodo(key);
				})
			}
		})
	}
	getTodos() {
		let result = this.shared.getTodos();
		result.subscribe(res => {
			console.log(res);
		})
		// console.log(result);
	}
	ngOnInit() {
		this.todoDatabase.getTodos().subscribe(data => {
			console.log(data);
			this.dataSource = new TodoDataSource(this.todoDatabase, this.paginator);
			this.dataLength = data;
		})
		console.log(`Data source: ${this.dataSource}`)
	}

}
