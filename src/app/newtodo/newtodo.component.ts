import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularFireAuth } from 'angularfire2/auth';
import { SharedService } from '../shared.service';
import { TodoItem } from '../interfaces';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'newtodo-dialog',
	templateUrl: './newtodo.component.html'
})
export class NewTodoDialog {
	newTodo: TodoItem = {
		'title': '',
		'content': ''
	};
	todoCollection: AngularFirestoreCollection<TodoItem>;
	constructor(
		private shared: SharedService,
		private afAuth: AngularFireAuth,
		private dialogRef: MatDialogRef<NewTodoDialog>,
		private fs: AngularFirestore) {
		if (afAuth.auth.currentUser) {
			this.todoCollection = this.fs.collection(`users/${afAuth.auth.currentUser.uid}/todos`);
		} else {
			// User isn't signed in! Add todo stuff to disable dialog
			console.warn('Current user is logged out. Please login before continuing.');
		}
	}
	resetForm() {
		this.newTodo = {
			'title': '',
			'content': ''
		};
	}
	cancel() {
		this.dialogRef.close();
	}
	addTodo() {
		if (this.newTodo.dueDate) {
			this.newTodo.dueDate = new Date(this.newTodo.dueDate);
		}
		this.todoCollection.add(this.newTodo).then(result => {
			console.log(`Successfully written data with result: ${result}`);
		}, error => {
			console.error(`An error occured: ${error.message}`);
		});
		this.dialogRef.close();
	}

}
