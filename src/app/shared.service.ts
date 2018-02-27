import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable } from 'rxjs/Observable';
import { Injectable, Component, OnInit, ViewChild, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';

import {
	MatSnackBarConfig,
	MatSnackBar,
	SimpleSnackBar,
	MatSnackBarRef,
	MatSnackBarModule
} from '@angular/material/snack-bar';
import {
	MatDialog,
	MatDialogRef,
	MatDialogConfig,
	MatDialogModule
} from '@angular/material/dialog';
import { MatSelectionList, MatListModule } from '@angular/material/list';
import { ComponentType } from '@angular/cdk/portal';
import { Title, SafeHtml } from '@angular/platform-browser';
import { BrowserModule } from '@angular/platform-browser';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable()
export class SharedService {
	constructor(
		private snackbar: MatSnackBar,
		private dialog: MatDialog,
		private title: Title,
		private breakpointObserver: BreakpointObserver
	) { }
	// Getters and setters
	/**
	 * Getter to check if the user is online
	 * @returns {boolean}
	 */
	get isOnline(): boolean {
		return navigator.onLine;
	}
	/**
 	 * Detects if the user is using a mobile device
 	 * @returns {boolean}
 	 */
	get isMobile(): boolean {
		if (this.breakpointObserver.isMatched('(max-width: 599px)')) {
			return true;
		} else {
			return false;
		}
	}
	/**
	 * Opens a snackbar with the specified params and a return of the snackbar's ref (for component)
	 * @param {SnackBarConfig} opts The options of the snackbar
	 * @returns {MatSnackBarRef<any>}
	 */
	openSnackBarComponent(opts: SnackBarConfig): MatSnackBarRef<any> {
		return this.handleSnackBarWithComponent(opts);
	}
	/**
	 * Opens a snackbar with the specified params and a return of the snackbar's ref (not for component)
	 * @param {SnackBarConfig} opts The options of the snackbar
	 * @returns {MatSnackBar<SimpleSnackBar>}
	 */
	openSnackBar(opts: SnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
		return this.handleSnackBar(opts);
	}
	/**
	 * Handles a snackbar with a snackbarref if the developer needs a return
	 * @param {SnackBarConfig} opts The config for the snackbar.
	 * @returns {MatSnackBarRef<SimpleSnackBar>}
	 * @private
	 */
	private handleSnackBar(opts: SnackBarConfig): MatSnackBarRef<SimpleSnackBar> {
		if (opts) {
			if (opts.action) {
				if (opts.additionalOpts) {
					if (opts.additionalOpts.panelClass) {
						if (typeof opts.additionalOpts.panelClass === 'string') {
							let tempArray = [];
							if (typeof opts.hasElevation === 'number') {
								tempArray.push(`mat-elevation-z${opts.hasElevation}`);
							} else {
								tempArray.push('mat-elevation-z3');
							}
							tempArray.push(opts.additionalOpts.panelClass);
							opts.additionalOpts.panelClass = tempArray;
						} else {
							if (typeof opts.hasElevation === 'number') {
								opts.additionalOpts.panelClass = `mat-elevation-z${opts.hasElevation}`;
							} else {
								opts.additionalOpts.panelClass = 'mat-elevation-z3';
							}
						}
					} else {
						if (typeof opts.hasElevation === 'number') {
							opts.additionalOpts.panelClass = `mat-elevation-z${opts.hasElevation}`;
						} else {
							opts.additionalOpts.panelClass = 'mat-elevation-z3';
						}
					}
					return this.snackbar.open(opts.msg, opts.action, opts.additionalOpts);
				} else {
					return this.snackbar.open(opts.msg, opts.action);
				}
			} else {
				if (opts.additionalOpts) {
					if (opts.additionalOpts.panelClass) {
						if (typeof opts.additionalOpts.panelClass === 'string') {
							let tempArray = [];
							if (typeof opts.hasElevation === 'number') {
								tempArray.push(`mat-elevation-z${opts.hasElevation}`);
							} else {
								tempArray.push('mat-elevation-z3');
							}
							tempArray.push(opts.additionalOpts.panelClass);
							opts.additionalOpts.panelClass = tempArray;
						} else {
							if (typeof opts.hasElevation === 'number') {
								opts.additionalOpts.panelClass = `mat-elevation-z${opts.hasElevation}`;
							} else {
								opts.additionalOpts.panelClass = 'mat-elevation-z3';
							}
						}
					} else {
						if (typeof opts.hasElevation === 'number') {
							opts.additionalOpts.panelClass = `mat-elevation-z${opts.hasElevation}`;
						} else {
							opts.additionalOpts.panelClass = 'mat-elevation-z3';
						}
					}
					return this.snackbar.open(opts.msg, undefined, opts.additionalOpts);
				} else {
					return this.snackbar.open(opts.msg);
				}
			}
		} else {
			this.throwError('opts', 'SnackBarConfig');
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
				this.throwError('opts.additionalOpts', 'MatSnackBarConfig');
			}
		} else {
			this.throwError('opts', 'SnackBarConfig');
		}
	}
	/**
	 * Closes the current snackbar
	 */
	closeSnackBar() {
		this.snackbar.dismiss();
	}
	/**
	 * Opens an alert dialog with the specified parameters
	 * @param {AlertDialogConfig} opts The options for the dialog
	 * @returns {MatDialogRef<AlertDialog>}
	 */
	openAlertDialog(opts: AlertDialogConfig): MatDialogRef<AlertDialog> {
		if (opts) {
			const dialogRef = this.dialog.open(AlertDialog);
			dialogRef.componentInstance.alertConfig = opts;
			return dialogRef;
		} else {
			this.throwError('opts', 'AlertDialogConfig');
		}
	}
	/**
	 * Opens a confirm dialog with the specified parameters
	 * @param {ConfirMatialogConfig} opts The options for the dialog
	 * @return {MatDialogRef<ConfirMatialog>}
	 */
	openConfirmDialog(opts: ConfirmDialogConfig): MatDialogRef<ConfirmDialog> {
		if (opts) {
			const dialogRef = this.dialog.open(ConfirmDialog);
			dialogRef.componentInstance.confirmConfig = opts;
			return dialogRef;
		} else {
			this.throwError('opts', 'ConfirmDialogConfig');
		}
	}
	/**
	 * Opens a prompt dialog with the specified parameters
	 * @param {PromptDialogConfig} opts The options for the dialog
	 * @return {MatDialogRef<PromptDialog>}
	 */
	openPromptDialog(opts: PromptDialogConfig): MatDialogRef<PromptDialog> {
		if (opts) {
			const dialogRef = this.dialog.open(PromptDialog);
			dialogRef.componentInstance.promptConfig = opts;
			return dialogRef;
		} else {
			this.throwError('opts', 'PromptDialogConfig');
		}
	}
	/**
	 * Opens a selection dialog with the configured options
	 * @param {SelectionDialogConfig} opts The options for the dialog
	 * @returns {MatDialogRef<SelectionDialog>}
	 */
	openSelectionDialog(opts: SelectionDialogConfig): MatDialogRef<SelectionDialog> {
		if (opts) {
			const dialogRef = this.dialog.open(SelectionDialog, { disableClose: true, panelClass: 'selection-dialog' });
			dialogRef.componentInstance.selectionConfig = opts;
			return dialogRef;
		} else {
			this.throwError('opts', 'SelectionDialogConfig');
		}
	}
	/**
	 * Gets all currently opened dialogs
	 * @returns {MatDialogRef<any>[]}
	 */
	getDialogs(): MatDialogRef<any>[] {
		return this.dialog.openDialogs;
	}
	/**
	 * Closes all dialogs currently opened
	 */
	closeAllDialogs() {
		this.dialog.closeAll();
	}
	/**
	 * Gets a dialog by its id
	 * @param {string} id The ID of the dialog
	 * @returns {MatDialogRef<any>}
	 */
	getDialogById(id: string): MatDialogRef<any> {
		return this.dialog.getDialogById(id);
	}
	/**
	 * Observable for after all dialogs have been closed
	 * @returns {Observable<void>}
	 */
	afterAllClosed(): Observable<void> {
		return this.dialog.afterAllClosed;
	}
	/**
	 * Throws an error with the specified parameters
	 * @param {string} variable The variable that was not specified
	 * @param {string} type The type of variable
	 * @private
	 */
	private throwError(variable: string, type: string) {
		// tslint:disable-next-line:max-line-length
		throw new Error(`"${variable}" was not specified. Please ensure that the "${variable}" property is specified and that it is of type "${type}".`);
	}
	/**
	 * Sets the document's title
	 * @param {string} title The title of the document to set
	 */
	setTitle(title: string) {
		this.title.setTitle(title);
	}
	/**
	 * Returns the document's title
	 */
	getTitle(): string {
		return this.title.getTitle();
	}
}


@Component({
	selector: 'alert-dialog',
	template: `
	<h2 matDialogTitle>{{alertConfig.title ? alertConfig.title : 'Alert'}}</h2>
	<mat-dialog-content fxLayout="column" class="mat-typography">
		<p class="mat-body" *ngIf="!alertConfig.isHtml">{{alertConfig.msg}}</p>
		<span *ngIf="alertConfig.isHtml" [innerHTML]="alertConfig.msg"></span>
	</mat-dialog-content>
	<mat-dialog-actions align="end">
		<button mat-button [color]="alertConfig.okColor ? alertConfig.okColor : 'primary'" (click)="close()">{{alertConfig.ok ? alertConfig.ok : 'Dismiss'}}</button>
	</mat-dialog-actions>
	`
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
	template: `
	<h2 matDialogTitle>{{confirmConfig.title ? confirmConfig.title : 'Confirm'}}</h2>
	<mat-dialog-content fxLayout="column" class="mat-typography">
		<p class="mat-body" *ngIf="!confirmConfig.isHtml">{{confirmConfig.msg}}</p>
		<span *ngIf="confirmConfig.isHtml" [innerHTML]="confirmConfig.msg"></span>
		<div class="checkbox-box" *ngIf="confirmConfig.hasCheckbox">
			<mat-checkbox [color]="confirmConfig.checkboxColor" [(ngModel)]="confirmConfig.checkboxValue">{{confirmConfig.checkboxLabel}}</mat-checkbox>
		</div>
	</mat-dialog-content>
	<mat-dialog-actions align="end">
		<button mat-button (click)="cancel()" [color]="confirmConfig.cancelColor ? confirmConfig.cancelColor : 'primary'">{{confirmConfig.cancel ? confirmConfig.cancel : 'Cancel'}}</button>
		<button mat-button (click)="ok()" [color]="confirmConfig.okColor ? confirmConfig.okColor : 'primary'" [disabled]="okBtnDisabled">{{confirmConfig.ok ? confirmConfig.ok : 'OK'}}</button>
	</mat-dialog-actions>
	`,
	styles: [
		`
		.checkbox-box {
			padding: 8px;
			background-color: grey;
			overflow-wrap: break-word;
			word-wrap: break-word;
			hyphens: auto;
		}
		`
	]
})
export class ConfirmDialog implements OnInit {
	constructor(private dialogRef: MatDialogRef<ConfirmDialog>) {

	}
	get okBtnDisabled() {
		if (this.confirmConfig.dialogRequiresCheckbox) {
			if (this.confirmConfig.checkboxValue) {
				return false;
			} else {
				return true;
			}
		} else {
			return false;
		}
	}
	confirmConfig: ConfirmDialogConfig;
	cancel() {
		this.dialogRef.close('cancel');
	}
	ok() {
		this.dialogRef.close('ok');
	}
	ngOnInit() {
		if (this.confirmConfig.disableClose) {
			this.dialogRef.disableClose = true;
		}
	}
}
@Component({
	selector: 'prompt-dialog',
	template: `
	<h2 matDialogTitle>{{promptConfig.title ? promptConfig.title : 'Prompt'}}</h2>
	<mat-dialog-content fxLayout="column" class="mat-typography">
		<p class="mat-body" *ngIf="!promptConfig.isHtml">{{promptConfig.msg}}</p>
		<span *ngIf="promptConfig.isHtml" [innerHTML]="promptConfig.msg"></span>
		<form #form="ngForm">
			<mat-form-field [color]="promptConfig.inputColor ? promptConfig.inputColor : 'primary'" style="width:100%">
				<input matInput [(ngModel)]="input" placeholder="{{promptConfig.placeholder}}" type="{{promptConfig.inputType ? promptConfig.inputType : 'text'}}" required name="input">
				<mat-error>This is required.</mat-error>
			</mat-form-field>
		</form>
	</mat-dialog-content>
	<mat-dialog-actions align="end">
		<button mat-button (click)="cancel()" [color]="promptConfig.cancelColor ? promptConfig.cancelColor : 'primary'">{{promptConfig.cancel ? promptConfig.cancel : 'Cancel'}}</button>
		<button mat-button (click)="ok()" [color]="promptConfig.okColor ? promptConfig.okColor : 'primary'" [disabled]="form.invalid">{{promptConfig.ok ? promptConfig.ok : 'OK'}}</button>
	</mat-dialog-actions>
	`
})
export class PromptDialog implements OnInit {
	constructor(private dialogRef: MatDialogRef<PromptDialog>) {
	}
	promptConfig: PromptDialogConfig;
	input: string | number;
	cancel() {
		this.dialogRef.close('cancel');
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
	template: `
	<h2 matDialogTitle>{{selectionConfig.title ? selectionConfig.title : 'Select options from the list'}}</h2>
	<mat-dialog-content fxLayout="column" class="mat-typography">
		<mat-selection-list #selection>
			<mat-list-option *ngFor="let option of selectionConfig.options" [disabled]="option.disabled" [value]="option.value" [checkboxPosition]="option.checkboxPosition ? option.checkboxPosition : 'before'" [selected]="option.selected">
				{{option.content}}
			</mat-list-option>
		</mat-selection-list>
	</mat-dialog-content>
	<mat-dialog-actions align="end">
		<button mat-button color="primary" (click)="cancel()">{{selectionConfig.cancel ? selectionConfig.cancel : 'Cancel'}}</button>
		<button mat-button color="primary" (click)="ok()" [disabled]="selection.selectedOptions.selected.length < 1">{{selectionConfig.ok ? selectionConfig.ok : 'OK'}}</button>
	</mat-dialog-actions>
	`
})
export class SelectionDialog implements OnInit {
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
		this.dialogRef.close('cancel');
	}
	ok() {
		this.dialogRef.close(this.selection.selectedOptions.selected);
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
	/**
	 * Whether to show an elevation on the snackbar
	 * If a number is supplied, the elevation level will be the specified number. Or else it will be set to level 3
	 * @type {number|boolean}
	 */
	hasElevation?: number | boolean;
}
export interface DialogConfig extends MatDialogConfig {
	/**
	 * The message of the dialog
	 * @type {string|SafeHtml}
	 */
	msg?: string | SafeHtml;
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
	/**
	 * The theme color for the dialog
	 * @type {ThemePalette}
	 */
	themeColor?: ThemePalette;
}
export interface AlertDialogConfig extends DialogConfig {
	/**
	 * The ok button text
	 * @type {string}
	 */
	ok?: string;
	/**
	 * The ok button color
	 */
	okColor?: ThemePalette;
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
	/**
	 * The ok button color
	 * @type {ThemePalette}
	 */
	okColor?: ThemePalette;
	/**
	 * The cancel button color
	 * @type {ThemePalette}
	 */
	cancelColor?: ThemePalette;
	/**
	 * Whether the confirm dialog should have a checkbox
	 * @type {boolean}
	 */
	hasCheckbox?: boolean;
	/**
	 * The label pf the checkbox. Depends on `hasCheckbox`.
	 * @type {string}
	 */
	checkboxLabel?: string;
	/**
	 * The color of the checkbox
	 * @type {ThemePalette}
	 */
	checkboxColor?: ThemePalette;
	/**
	 * Whether the dialog must have the checkbox checked in order for the ok button to be enabled
	 * @type {boolean}
	 */
	dialogRequiresCheckbox?: boolean;
	/**
	 * The initial value of the checkbox
	 * @type {boolean}
	 */
	checkboxValue?: boolean;
}

export interface PromptDialogConfig extends DialogConfig {
	/**
	 * The ok button text
	 * @type {string}
	 */
	ok?: string;
	/**
	 * The color of the ok button
	 * @type {ThemePalette}
	 */
	okColor?: ThemePalette;
	/**
	 * The cancel button text
	 * @type {string}
	 */
	cancel?: string;
	/**
	 * The color of the cancel button
	 * @type {ThemePalette}
	 */
	cancelColor?: ThemePalette;
	/**
	 * The placeholder of the input
	 * @type {string}
	 */
	placeholder: string;
	/**
	 * The input type
	 * @type {'text'|'email'|'password'|'number'|string}
	 */
	inputType?: 'text' | 'email' | 'password' | 'number' | string;
	/**
	 * The initial value of the input
	 * @type {string|number}
	 */
	value?: string | number;
	/**
	 * The color of the input
	 * @type {ThemePalette}
	 */
	inputColor?: ThemePalette;
}
export interface SelectionDialogConfig extends DialogConfig {
	/**
	 * The ok button text
	 * @type {string}
	 */
	ok?: string;
	/**
	 * The color of the ok button
	 * @type {ThemePalette}
	 */
	okColor?: ThemePalette;
	/**
	 * The cancel button text
	 * @type {string}
	 */
	cancel?: string;
	/**
	 * The color of the cancel button
	 * @type {ThemePalette}
	 */
	cancelColor?: ThemePalette;
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
	checkboxPosition?: 'before' | 'after';
	/**
	 * Whether the selection list item is initially selected
	 * @type {boolean}
	 */
	selected?: boolean;
}

const SHARED_DIALOGS = [
	AlertDialog,
	ConfirmDialog,
	PromptDialog,
	SelectionDialog
];
const SHARED_MODULES = [
	BrowserModule,
	BrowserAnimationsModule,
	FormsModule,
	MatButtonModule,
	MatDialogModule,
	MatFormFieldModule,
	MatInputModule,
	MatListModule,
	MatSnackBarModule,
	MatCheckboxModule
];
@NgModule({
	imports: SHARED_MODULES,
	declarations: SHARED_DIALOGS,
	entryComponents: SHARED_DIALOGS,
	exports: SHARED_DIALOGS,
	providers: [SharedService]
})
export class SharedModule { }
