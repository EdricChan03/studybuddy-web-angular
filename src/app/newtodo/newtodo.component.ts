import { MdDialogRef } from '@angular/material';
import { AngularFireAuth } from 'angularfire2/auth';
import { Todo, Shared } from './../shared';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'newtodo-dialog',
	templateUrl: './newtodo.component.html'
})
export class NewTodoDialog {
	add: Todo = {
		"title": "",
		"content": ""
	}
	currentUser: string;
	constructor(private shared: Shared, private afAuth: AngularFireAuth, private dialogRef: MdDialogRef<NewTodoDialog>) {
		afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
			} else {
			}
		})
	}

	cancel() {
		this.dialogRef.close();
	}
	addTodo(add: Todo) {
		if (add.dueDate) {
			add.dueDate = new Date(add.dueDate).getTime();
		}
		this.shared.newTodo(this.currentUser, add).then(_ => {
			this.dialogRef.close();
		}, (a) => {
			this.shared.openSnackBar({msg: `Error: ${a}`, additionalOpts: {duration: 4000}});
		});
	}

}
