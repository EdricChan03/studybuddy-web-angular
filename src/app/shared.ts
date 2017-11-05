import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { Injectable, Component, OnInit, ViewChild, DoCheck } from '@angular/core';
import { MatSnackBarConfig, MatSnackBar, SimpleSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material/dialog';
import { MatSelectionList } from '@angular/material/list';
import { ComponentType } from '@angular/cdk/portal';
import { Title, SafeHtml } from '@angular/platform-browser';
import * as firebase from 'firebase';

@Injectable()
export class Shared {
	private currentUser: string;
	constructor(private snackbar: MatSnackBar, private dialog: MatDialog, private afDatabase: AngularFireDatabase, private title: Title, private afAuth: AngularFireAuth, private fs: AngularFirestore) {
		afAuth.auth.onAuthStateChanged((user) => {
			if (user) {
				console.log(user);
				this.currentUser = user.uid;
			} else {
			}
		})
	}
	/**
	 * Opens a snackbar with the specified params and no return
	 * @param {SnackBarConfig} opts The options of the snackbar
	 */
	public openSnackBar(opts: SnackBarConfig) {
		this.handleSnackBar(opts);
	}
	/**
	 * Opens a snackbar with the specified params and a return of the snackbar's ref (for component)
	 * @param {SnackBarConfig} opts The options of the snackbar
	 * @returns {MatSnackBarRef<any>}
	 */
	public openSnackBarComponent(opts: SnackBarConfig): MatSnackBarRef<any> {
		return this.handleSnackBarWithComponent(opts);
	}
	/**
	 * Opens a snackbar with the specified params and a return of the snackbar's ref (not for component)
	 * @param {SnackBarConfig} opts The options of the snackbar
	 * @returns {MatSnackBar<SimpleSnackBar>}
	 */
	public openSnackBarWithRef(opts: SnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
		return this.handleSnackBarWithRef(opts);
	}
	/**
	 * Handling of the snackBar
	 * @param {SnackBarConfig} opts The snackBar config
	 * @private
	 */
	private handleSnackBar(opts: SnackBarConfig) {
		if (opts) {
			if (opts.component) {
				if (opts.additionalOpts) {
					this.snackbar.openFromComponent(opts.component, opts.additionalOpts);
				} else {
					this.snackbar.openFromComponent(opts.component);
				}
			} else {
				if (opts.action) {
					if (opts.additionalOpts) {
						this.snackbar.open(opts.msg, opts.action, opts.additionalOpts);
					} else {
						this.snackbar.open(opts.msg, opts.action);
					}
				} else {
					if (opts.additionalOpts) {
						this.snackbar.open(opts.msg, undefined, opts.additionalOpts);
					} else {
						this.snackbar.open(opts.msg);
					}
				}
			}
		} else {
			this.throwError("message", "string");
		}
	}
	/**
	 * Handles a snackbar with a snackbarref if the developer needs a return
	 * @param {SnackBarConfig} opts The config for the snackbar.
	 * @returns {MatSnackBarRef<SimpleSnackBar>}
	 * @private
	 */
	private handleSnackBarWithRef(opts: SnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
		if (opts) {
			if (opts.action) {
				if (opts.additionalOpts) {
					return this.snackbar.open(opts.msg, opts.action, opts.additionalOpts);
				} else {
					return this.snackbar.open(opts.msg, opts.action);
				}
			} else {
				this.throwError("opts.action", "string");
			}
		} else {
			this.throwError("opts", "SnackBarConfig");
		}
	}
	/**
	 * Handles a snackbar with a component
	 * @param {SnackBarConfig} opts The config for the snackbar
	 * @returns {MatSnackbarRef<any>}
	 */
	private handleSnackBarWithComponent(opts: SnackBarConfig): MatSnackBarRef<any> {
		if (opts) {
			if (opts.additionalOpts) {
				if (opts.additionalOpts) {
					return this.snackbar.openFromComponent(opts.component, opts.additionalOpts);
				} else {
					return this.snackbar.openFromComponent(opts.component);
				}
			} else {
				this.throwError("opts.additionalOpts", "MatSnackBarConfig");
			}
		} else {
			this.throwError("opts", "SnackBarConfig");
		}
	}
	/**
	 * Closes the current snackbar
	 */
	public closeSnackbar() {
		this.snackbar.dismiss();
	}
	/**
	 * Opens an alert dialog with the specified parameters
	 * @param {AlertDialogConfig} opts The options for the dialog
	 * @returns {MatDialogRef<AlertDialog>}
	 */
	public openAlertDialog(opts: AlertDialogConfig): MatDialogRef<AlertDialog> {
		if (opts) {
			let dialogRef = this.dialog.open(AlertDialog);
			dialogRef.componentInstance.alertConfig = opts;
			return dialogRef;
		} else {
			this.throwError("opts", "AlertDialogConfig");
		}
	}
	/**
	 * Opens a confirm dialog with the specified parameters
	 * @param {ConfirMatialogConfig} opts The options for the dialog
	 * @return {MatDialogRef<ConfirMatialog>}
	 */
	public openConfirmDialog(opts: ConfirmDialogConfig): MatDialogRef<ConfirmDialog> {
		if (opts) {
			let dialogRef = this.dialog.open(ConfirmDialog);
			dialogRef.componentInstance.confirmConfig = opts;
			return dialogRef;
		} else {
			this.throwError("opts", "ConfirmDialogConfig");
		}
	}
	/**
	 * Opens a prompt dialog with the specified parameters
	 * @param {PromptDialogConfig} opts The options for the dialog
	 * @return {MatDialogRef<PromptDialog>}
	 */
	public openPromptDialog(opts: PromptDialogConfig): MatDialogRef<PromptDialog> {
		if (opts) {
			let dialogRef = this.dialog.open(PromptDialog);
			dialogRef.componentInstance.promptConfig = opts;
			return dialogRef;
		} else {
			this.throwError("opts", "PromptDialogConfig");
		}
	}
	/**
	 * Opens a selection dialog with the configured options
	 * @param {SelectionDialogConfig} opts The options for the dialog
	 * @returns {MatDialogRef<SelectionDialog>}
	 */
	public openSelectionDialog(opts: SelectionDialogConfig): MatDialogRef<SelectionDialog> {
		if (opts) {
			let dialogRef = this.dialog.open(SelectionDialog, { disableClose: true, panelClass: "selection-dialog" });
			dialogRef.componentInstance.selectionConfig = opts;
			return dialogRef;
		} else {
			this.throwError("opts", "SelectionDialogConfig");
		}
	}
	/**
	 * Gets all currently opened dialogs
	 * @returns {MatDialogRef<any>[]}
	 */
	public getDialogs(): MatDialogRef<any>[] {
		return this.dialog.openDialogs;
	}
	/**
	 * Closes all dialogs currently opened
	 */
	public closeAllDialogs() {
		this.dialog.closeAll();
	}
	/**
	 * Gets a dialog by its id
	 * @param {string} id The ID of the dialog
	 * @returns {MatDialogRef<any>}
	 */
	public getDialogById(id: string): MatDialogRef<any> {
		return this.dialog.getDialogById(id);
	}
	/**
	 * Observable for after all dialogs have been closed
	 * @returns {Observable<void>}
	 */
	public afterAllClosed(): Observable<void> {
		return this.dialog.afterAllClosed;
	}
	/**
	 * Throws an error with the specified parameters
	 * @param {string} variable The variable that was not specified
	 * @param {string} type The type of variable
	 * @private
	 */
	private throwError(variable: string, type: string) {
		throw new Error(`${variable} was not specified. Please ensure that the ${variable} property is specified and that it is of type ${type}.`);
	}
	/**
	 * Adds a new todo
	 * @param {string} userId The user's id
	 * @param {Todo} todo The todo object
	 * @returns {firebase.database.ThenableReference}
	 * @todo Convert to Firestore
	 */
	public newTodo(todo: Todo) {
		this.fs.collection(`users/${this.currentUser}`).add({
			todo
		})
			.then((result => {
				console.log(`Document was written at ${result}`);
			}))
	}
	/**
	 * Gets the user's todos
	 * @returns {FirebaseListObservable<Todo[]>}
	 * @todo Convert to Firestore
	 */
	public getTodos(): Observable<any> {
		return this.fs.collection(`users/${this.currentUser}`).valueChanges();
		// return this.afDatabase.list(`users/${this.currentUser}/todo`).valueChanges();
	}
	/**
	 * Sets the document's title
	 * @param {string} title The title of the document to set
	 */
	public setTitle(title: string) {
		this.title.setTitle(title);
	}
	/**
	 * Returns the document's title
	 */
	public getTitle(): string {
		return this.title.getTitle();
	}
}


@Component({
	selector: 'alert-dialog',
	templateUrl: './partials/alertdialog.shared.html'
})
export class AlertDialog implements OnInit {
	constructor(private dialogRef: MatDialogRef<AlertDialog>) {
	}
	alertConfig: AlertDialogConfig;
	close() {
		this.dialogRef.close();
	}
	ngOnInit() {
		if (this.alertConfig.disableClose) {
			this.dialogRef.disableClose = true;
		}
	}
}
@Component({
	selector: 'confirm-dialog',
	templateUrl: './partials/confirmdialog.shared.html'
})
export class ConfirmDialog implements OnInit {
	constructor(private dialogRef: MatDialogRef<ConfirmDialog>) {

	}
	confirmConfig: ConfirmDialogConfig;
	cancel() {
		this.dialogRef.close("cancel");
	}
	ok() {
		this.dialogRef.close("ok");
	}
	ngOnInit() {
		if (this.confirmConfig.disableClose) {
			this.dialogRef.disableClose = true;
		}
	}
}
@Component({
	selector: 'prompt-dialog',
	templateUrl: './partials/promptdialog.shared.html'
})
export class PromptDialog implements OnInit {
	constructor(private dialogRef: MatDialogRef<PromptDialog>) {
	}
	promptConfig: PromptDialogConfig;
	input: string|number;
	cancel() {
		this.dialogRef.close("cancel");
	}
	ok() {
		this.dialogRef.close(this.input);
	}
	ngOnInit() {
		if (this.promptConfig.value) {
			this.input = this.promptConfig.value;
		}
		if (this.promptConfig.disableClose) {
			this.dialogRef.disableClose = true;
		}
	}
}
@Component({
	selector: 'selection-dialog',
	templateUrl: './partials/selectiondialog.shared.html'
})
export class SelectionDialog implements OnInit, DoCheck {
	@ViewChild('selection') selection: MatSelectionList;
	constructor(private dialogRef: MatDialogRef<SelectionDialog>) {
	}
	selectionConfig: SelectionDialogConfig;
	ngOnInit() {
		if (this.selectionConfig.disableClose) {
			this.dialogRef.disableClose = true;
		}
	}
	cancel() {
		this.dialogRef.close("cancel");
	}
	ok() {
		this.dialogRef.close(this.selection.selectedOptions.selected);
	}
	ngDoCheck() {
		console.log(this.selection);
	}
}
export interface SnackBarConfig {
	/**
	 * The message for the snackbar
	 * @type {string}
	 */
	msg: string;
	/**
	 * The action for the snackbar
	 * @type {string}
	 */
	action?: string;
	/**
	 * The custom component for the snackbar to open in
	 * @type {ComponentType<any>}
	 */
	component?: ComponentType<any>;
	/**
	 * Additional options
	 * @type {MatSnackBarConfig}
	 */
	additionalOpts?: MatSnackBarConfig;
}
export interface DialogConfig extends MatDialogConfig {
	/**
	 * The message of the dialog
	 * @type {string|SafeHtml}
	 */
	msg: string | SafeHtml;
	/**
	 * The title of the dialog
	 * @type {string}
	 */
	title?: string;
	/**
	 * Whether the dialog's message is HTML
	 * @type {boolean}
	 */
	isHtml?: boolean;
}
export interface AlertDialogConfig extends DialogConfig {
	/**
	 * The ok button text
	 * @type {string}
	 */
	ok?: string;
}

export interface ConfirmDialogConfig extends DialogConfig {
	/**
	 * The ok button text
	 * @type {string}
	 */
	ok?: string;
	/**
	 * The cancel button text
	 * @type {string}
	 */
	cancel?: string;
}

export interface PromptDialogConfig extends DialogConfig {
	/**
	 * The ok button text
	 * @type {string}
	 */
	ok?: string;
	/**
	 * The cancel button text
	 * @type {string}
	 */
	cancel?: string;
	/**
	 * The placeholder of the input
	 * @type {string}
	 */
	placeholder: string;
	/**
	 * The input type
	 * @type {"text"|"email"|"password"|"number"}
	 */
	inputType?: "text" | "email" | "password" | "number";
	/**
	 * The initial value of the input
	 * @type {string|number}
	 */
	value?: string|number;
	/**
	 * The color of the input
	 * @type {"primary"|"accent"|"warn"}
	 */
	color?: "primary" | "accent" | "warn";
}
export interface SelectionDialogConfig extends DialogConfig {
	/**
	 * The ok button text
	 * @type {string}
	 */
	ok?: string;
	/**
	 * The cancel button text
	 * @type {string}
	 */
	cancel?: string;
	/**
	 * The options for the selection dialog
	 * @type {SelectionDialogOptions[]}
	 */
	options: SelectionDialogOptions[];
}
export interface SelectionDialogOptions {
	/**
	 * The title of the selection list item
	 * @type {string}
	 */
	content: string;
	/**
	 * Whether the selection list item is disabled
	 * @type {boolean}
	 */
	disabled?: boolean;
	/**
	 * The value of the selection list item
	 * @type {any}
	 */
	value: any;
	/**
	 * The checkbox position of the selection list item
	 * @type {"before"|"after"}
	 */
	checkboxPosition?: "before" | "after";
	/**
	 * Whether the selection list item is initially selected
	 * @type {boolean}
	 */
	selected?: boolean;
}
export interface AboutDialogConfig extends DialogConfig {
	/**
	 * The app's name
	 * @type {string}
	 */
	appName: string;
	/**
	 * The app's icon
	 * @type {string}
	 */
	appImg: string;
	/**
	 * The app's image width
	 * @type {string}
	 */
	appImgWidth?: string;
	/**
	 * The app's image height
	 * @type {string}
	 */
	appImgHeight?: string;
	/**
	 * The app's version
	 * @type {string|number|any}
	 */
	version: string | number | any;

}
export interface Todo {
	/**
	 * The title of the todo
	 * @type {string}
	 */
	title: string;
	/**
	 * The content of the todo
	 * @type {string}
	 */
	content: string;
	/**
	 * The due date of the todo
	 * @type {number|any}
	 */
	dueDate?: number | any;
	/**
	 * The tags of the todo
	 * @type {string[]}
	 */
	tags?: string[];
	/**
	 * Whether the todo is done
	 * @type {boolean}
	 */
	isDone?: boolean;
}

export const SHARED_DIALOGS = [
	AlertDialog,
	ConfirmDialog,
	PromptDialog,
	SelectionDialog
];