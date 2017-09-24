import { NewTodoDialog } from './../newtodo/newtodo.component';
import { MdDialog } from '@angular/material';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Shared, Todo } from './../shared';
import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';

@Component({
	selector: 'app-todo',
	templateUrl: './todo.component.html'
})
export class TodoComponent {
	currentUser: string;
	todos: FirebaseListObservable<any>;
	constructor(private shared: Shared, private afAuth: AngularFireAuth, private db: AngularFireDatabase, private dialog: MdDialog) {
		afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
				this.todos = this.db.list(`users/${this.currentUser}/todo`);
			} else {
			}
		})
	}
	newTodo() {
		this.dialog.open(NewTodoDialog);
	}
	removeTodo(key: string) {
		this.shared.openConfirmDialog({ msg: "Are you sure you want to continue? Once deleted, the todo will be lost forever." }).afterClosed().subscribe(res => {
			if (res == 'ok' || res == 'dontShowAgain') {
				this.todos.remove(key).then(_ => {
					this.shared.openSnackBar({ msg: "Successfully removed todo.", additionalOpts: { duration: 3000 } });
				})
			} else {
				this.shared.openSnackBarWithRef({msg: "You did not delete the todo.", action: "Undo", additionalOpts: {duration: 6000}}).onAction().subscribe(_ => {
					this.removeTodo(key);
				})
			}
		})
	}
	getTodos() {
		let result = this.shared.getTodos(this.currentUser);
		result.subscribe(res => {
			console.log(res);
		})
		// console.log(result);
	}

}
