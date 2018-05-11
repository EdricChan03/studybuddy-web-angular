import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AngularFireAuth } from 'angularfire2/auth';
import { SharedService } from '../../shared.service';
import { TodoItem } from '../../interfaces';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { EditContentDialogComponent } from '../edit-content-dialog/edit-content-dialog.component';
import { MatChipInputEvent } from '@angular/material';
import * as firebase from 'firebase';

@Component({
	selector: 'app-todo-dialog',
	templateUrl: './todo-dialog.component.html'
})
export class TodoDialogComponent implements OnInit {
	todoItem: TodoItem;
	isNewTodo: boolean;
	todoToEdit: TodoItem;
	todoCollection: AngularFirestoreCollection<TodoItem>;
	showUnsupportedNotice = true;
	enableTags = false;
	helpDialogRef: MatDialogRef<any>;
	mkdnText = '**Bold**\n' +
		'_Italics_\n' +
		'**_Bold + Italics_**\n' +
		'~strikethrough~\n' +
		'[Link](https://google.com)\n' +
		'[YouTube][test]\n\n' +
		'[test]: https://youtube.com';
	mkdnLists = 'Unordered:\n' +
		'- List item #1\n' +
		'- List item #2\n' +
		'Ordered:\n' +
		'1. Ordered item #1\n' +
		'2. Ordered item #2\n' +
		'3. Ordered item #3';
	mkdnImg = '![Alternate text](https://example.com/myimg.jpg)';
	mkdnHeaders = '# <h1>\n' +
		'## <h2>\n' +
		'### <h3>\n' +
		'#### <h4>\n' +
		'##### <h5>\n' +
		'###### <h6>';
	mkdnCode = '```\n' +
		'Code blocks are typically in three backticks (\`)\n' +
		'```\n' +
		'```html\n' +
		'<p>This is an example of syntax-highlighting! <em>wow</em><p>\n' +
		'```';
	@ViewChild('helpContentDialog') helpContentDialogTmpl: TemplateRef<any>;
	constructor(
		// TODO(Edric): Figure out a way to make this private
		public shared: SharedService,
		private afAuth: AngularFireAuth,
		private dialogRef: MatDialogRef<TodoDialogComponent>,
		private afFs: AngularFirestore,
		private dialog: MatDialog
	) {
		if (afAuth.auth.currentUser) {
			this.todoCollection = this.afFs.collection(`users/${afAuth.auth.currentUser.uid}/todos`);
		} else {
			// User isn't signed in! Add todo stuff to disable dialog
			// tslint:disable-next-line:max-line-length
			let loginDialogRef = this.shared.openConfirmDialog({ title: 'Login before continuing', disableClose: true, isHtml: true, msg: '<p>To access this content, please login before continuing.</p><p>If you believe that this is an error and that you are already signed in, DM me on Twitter at @EdricChan03.</p><p><strong>Note: Please enable popups before clicking the Login button. This will be the only time popups will show.</strong></p>', ok: 'Login' });
			loginDialogRef.afterClosed().subscribe(result => {
				if (result === 'ok') {
					this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((a) => {
						// tslint:disable-next-line:max-line-length
						this.shared.openSnackBar({ msg: `Signed in as ${a.user.email}`, additionalOpts: { duration: 4000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
					}, err => {
						// tslint:disable-next-line:max-line-length
						this.shared.openSnackBar({ msg: `Error: ${err.message}`, additionalOpts: { duration: 4000, horizontalPosition: 'start', panelClass: 'mat-elevation-z3' } });
					});
				}
				this.dialogRef.close();
			});
		}
	}
	/**
	 * Checks if the browser is Firefox or Safari
	 */
	// get isUnsupported(): boolean {
	// 	if ((this.platform.FIREFOX || this.platform.SAFARI) && this.showUnsupportedNotice) {
	// 		return true;
	// 	} else {
	// 		return false;
	// 	}
	// }
	get isMobile(): boolean {
		return this.shared.isMobile;
	}
	showHelp(help: 'content' | 'project' | 'dueDate') {
		switch (help) {
			case 'content':
				this.helpDialogRef = this.shared.openHelpDialog(this.helpContentDialogTmpl);
				break;
		}
	}
	closeHelpDialog() {
		this.helpDialogRef.close();
		this.helpDialogRef = null;
	}
	addTag(event: MatChipInputEvent) {
		let input = event.input;
		let value = event.value;

		// Add a tag
		if ((value || '').trim()) {
			this.todoItem.tags.push(value.trim());
			this.todoItem.tags.sort();
		}

		// Reset the input value
		if (input) {
			input.value = '';
		}
	}
	removeTag(tag: string) {
		let index = this.todoItem.tags.indexOf(tag);
		if (index >= 0) {
			this.todoItem.tags.splice(index, 1);
		}
	}
	/**
	 * Hides the notice
	 * @param {boolean} toggleTo What to toggle the value to
	 */
	toggleNotice(toggleTo?: boolean) {
		if (toggleTo) {
			this.showUnsupportedNotice = toggleTo;
		} else {
			this.showUnsupportedNotice = !this.showUnsupportedNotice;
			const snackBarRef = this.shared.openSnackBar({ msg: 'Notice dismissed', action: 'Undo', additionalOpts: { duration: 6000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
			snackBarRef.onAction().subscribe(() => {
				this.showUnsupportedNotice = !this.showUnsupportedNotice;
			});
		}
	}
	editContent() {
		this.dialog.open(EditContentDialogComponent, { disableClose: true, panelClass: 'no-padding' });
	}
	ngOnInit() {
		if (this.isNewTodo) {
			this.todoItem = {
				'content': '',
				'title': '',
				'tags': []
			};
		} else {
			this.todoItem = this.todoToEdit;
		}
	}
	resetForm() {
		this.todoItem = {
			'title': '',
			'content': ''
		};
	}
	cancel() {
		this.dialogRef.close();
	}
	checkWhitespace(typeToCheck: 'content' | 'title') {
		switch (typeToCheck) {
			case 'content':
				this.todoItem.content = this.todoItem.content.replace(/^\s+/, '').replace(/\s+$/, '');
				break;
			case 'title':
				this.todoItem.title = this.todoItem.title.replace(/^\s+/, '').replace(/\s+$/, '');
				break;
		}
	}
	saveOrAddTodo() {
		if (this.isNewTodo) {
			if (this.todoItem.dueDate) {
				this.todoItem.dueDate = new Date(this.todoItem.dueDate);
			}
			this.todoCollection.add(this.todoItem).then(result => {
				// tslint:disable-next-line:max-line-length
				this.shared.openSnackBar({ msg: 'Todo was added', additionalOpts: { duration: 5000, panelClass: 'mat-elevation-z3', horizontalPosition: 'start' } });
				console.log(`Successfully written data with result: ${result}`);
			}, error => {
				// tslint:disable-next-line:max-line-length
				this.shared.openSnackBar({ msg: `An error occured: ${error.message}`, additionalOpts: { duration: 6000, horizontalPosition: 'start' }, hasElevation: true });
				console.error(`An error occured: ${error.message}`);
			});
		} else {
			this.todoCollection.doc<TodoItem>(this.todoToEdit.id)
				.update(this.todoToEdit)
				.then(result => {
					// tslint:disable-next-line:max-line-length
					this.shared.openSnackBar({ msg: 'Todo was updated', additionalOpts: { duration: 5000, horizontalPosition: 'start' }, hasElevation: true });
					console.log(`Successfully updated data with result: ${result}`);
				}, error => {
					// tslint:disable-next-line:max-line-length
					this.shared.openSnackBar({ msg: `An error occured: ${error.message}`, additionalOpts: { duration: 6000, horizontalPosition: 'start' }, hasElevation: true });
					console.error(`An error occured: ${error.message}`);
				});
		}
		this.dialogRef.close();
	}
}
