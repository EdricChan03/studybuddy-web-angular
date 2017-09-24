import { Observable } from 'rxjs/Observable';
import { Injectable, Component, OnInit } from '@angular/core';
import { MdSnackBarConfig, MdSnackBar, MdDialog, MdDialogConfig, MdDialogRef, SimpleSnackBar, MdSnackBarRef } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';

@Injectable()
export class Shared {
	constructor(private snackbar: MdSnackBar, private dialog: MdDialog) { }
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
	 * @returns {MdSnackBarRef<any>}
	 */
	public openSnackBarComponent(opts: SnackBarConfig): MdSnackBarRef<any> {
		return this.handleSnackBarWithComponent(opts);
	}
	/**
	 * Opens a snackbar with the specified params and a return of the snackbar's ref (not for component)
	 * @param {SnackBarConfig} opts The options of the snackbar
	 * @returns {MdSnackBar<SimpleSnackBar>}
	 */
	public openSnackBarWithRef(opts: SnackBarConfig): MdSnackBarRef<SimpleSnackBar> {
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
	 * @returns {MdSnackBarRef<SimpleSnackBar>}
	 * @private
	 */
	private handleSnackBarWithRef(opts: SnackBarConfig): MdSnackBarRef<SimpleSnackBar> {
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
	 * @returns {MdSnackbarRef<any>}
	 */
	private handleSnackBarWithComponent(opts: SnackBarConfig): MdSnackBarRef<any> {
		if (opts) {
			if (opts.additionalOpts) {
				if (opts.additionalOpts) {
					return this.snackbar.openFromComponent(opts.component, opts.additionalOpts);
				} else {
					return this.snackbar.openFromComponent(opts.component);
				}
			} else {
				this.throwError("opts.additionalOpts", "MdSnackBarConfig");
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
	 * @returns {Observable<any>}
	 */
	public openAlertDialog(opts: AlertDialogConfig): Observable<any> {
		if (opts) {
			let dialogRef = this.dialog.open(AlertDialog);
			dialogRef.componentInstance.alertConfig = opts;
			return dialogRef.afterClosed();
		} else {
			this.throwError("opts", "AlertDialogConfig");
		}
	}
	/**
	 * Opens a confirm dialog with the specified parameters
	 * @param {ConfirmDialogConfig} opts The options for the dialog
	 * @return {Observable<any>}
	 */
	public openConfirmDialog(opts: ConfirmDialogConfig): Observable<any> {
		if (opts) {
			let dialogRef = this.dialog.open(ConfirmDialog);
			dialogRef.componentInstance.confirmConfig = opts;
			return dialogRef.afterClosed();
		} else {
			this.throwError("opts", "ConfirmDialogConfig");
		}
	}
	/**
	 * Opens a prompt dialog with the specified parameters
	 * @param {PromptDialogConfig} opts The options for the dialog
	 * @return {Observable<any>}
	 */
	public openPromptDialog(opts: PromptDialogConfig): Observable<any> {
		if (opts) {
			let dialogRef = this.dialog.open(PromptDialog);
			dialogRef.componentInstance.promptConfig = opts;
			return dialogRef.afterClosed();
		} else {
			this.throwError("opts", "PromptDialogConfig");
		}
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
}


@Component({
	selector: 'alert-dialog',
	templateUrl: './partials/alertdialog.shared.html'
})
export class AlertDialog {
	constructor(private dialogRef: MdDialogRef<AlertDialog>) { }
	alertConfig: AlertDialogConfig;
	close() {
		this.dialogRef.close();
	}
}
@Component({
	selector: 'confirm-dialog',
	templateUrl: './partials/confirmdialog.shared.html'
})
export class ConfirmDialog {
	constructor(private dialogRef: MdDialogRef<ConfirmDialog>) { }
	confirmConfig: ConfirmDialogConfig;
	cancel() {
		this.dialogRef.close("cancel");
	}
	ok() {
		this.dialogRef.close("ok");
	}
}
@Component({
	selector: 'prompt-dialog',
	templateUrl: './partials/promptdialog.shared.html'
})
export class PromptDialog implements OnInit {
	constructor(private dialogRef: MdDialogRef<PromptDialog>) { }
	promptConfig: PromptDialogConfig;
	input: string;
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
	}
}
export interface SnackBarConfig {
	msg: string;
	action?: string;
	component?: ComponentType<any>;
	additionalOpts?: MdSnackBarConfig;
}
export interface DialogConfig extends MdDialogConfig {
	msg: string;
	title?: string;
}
export interface AlertDialogConfig extends DialogConfig {
	ok?: string;
}

export interface ConfirmDialogConfig extends DialogConfig {
	ok?: string;
	cancel?: string;
}

export interface PromptDialogConfig extends DialogConfig {
	ok?: string;
	cancel?: string;
	placeholder: string;
	inputType?: "text" | "email" | "password" | "number";
	value?: string;
	color?: "primary" | "accent" | "warn";
}