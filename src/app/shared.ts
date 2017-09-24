import { Observable } from 'rxjs/Observable';
import { Injectable, Component } from '@angular/core';
import { MdSnackBarConfig, MdSnackBar, MdDialog, MdDialogConfig } from '@angular/material';
import { ComponentType } from '@angular/cdk/portal';

@Injectable()
export class Shared {
	constructor(private snackbar: MdSnackBar, private dialog: MdDialog) { }
	/**
	 * Opens a snackbar with the specified params
	 * @param {string} message The message of the snackbar
	 * @param {string} action The action to display on the snackbar (optional)
	 * @param {MdSnackBarConfig} config The configuration of the snackbar (optional)
	 */
	public openSnackBar(message: string, action?: string, config?: MdSnackBarConfig) {
		if (message) {
			if (action) {
				if (config) {
					this.snackbar.open(message, action, config);
				} else {
					this.snackbar.open(message, action);
				}
			} else if (config) {
				this.snackbar.open(message, undefined, config);
			} else {
				this.snackbar.open(message);
			}
		} else {
			this.throwError("message", "string");
		}
	}
	/**
	 * Opens a snackbar with a component
	 * @param {ComponentType<any>} component The component to open the snackbar
	 * @param {MdSnackBarConfig} config The configuration of the snackbar (optional)
	 */
	public openComponentSnackbar(component: ComponentType<any>, config?: MdSnackBarConfig) {
		if (component) {
			if (config) {
				this.snackbar.openFromComponent(component, config);
			} else {
				this.snackbar.openFromComponent(component);
			}
		} else {
			this.throwError("component", "ComponentType<any>");
		}
	}
	/**
	 * Opens a snackbar with a duration set until the snackbar disappears
	 * @param {string} message The message of the snackbar
	 * @param {number} duration The duration of the snackbar in milliseconds
	 * @param {string} action The action of the snackbar (optional)
	 */
	public openDurationSnackbar(message: string, duration: number, action?: string) {
		if (action) {
			if (duration) {
				this.snackbar.open(message, action, { duration: duration })
			} else {
				this.throwError("duration", "number");
			}
		} else {
			if (duration) {
				this.snackbar.open(message, undefined, { duration: duration })
			} else {
				this.throwError("duration", "number");
			}
		}
	}
	public openSnackbarWithResult(message: string, action: string): Observable<void> {
		if (message) {
			let snackbarRef = this.snackbar.open(message, action);
			return snackbarRef.onAction();
		} else {
			this.throwError("message", "string");
		}
	}
	public openAlertDialog(opts: AlertDialogConfig) {
		if (opts) {
			let dialogRef = this.dialog.open(AlertDialog);
			dialogRef.componentInstance.alertConfig = opts;
		} else {
			this.throwError("opts", "AlertDialogConfig");
		}
	}
	public openConfirmDialog(opts: ConfirmDialogConfig): Observable<any> {
		if (opts) {
			let dialogRef = this.dialog.open(ConfirmDialog);
			dialogRef.componentInstance.confirmConfig = opts;
			return dialogRef.afterClosed();
		} else {
			this.throwError("opts", "ConfirmDialogConfig");
		}
	}
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
	 * Throws an error
	 * @param {string} variable The variable that was not specified
	 * @param {string} type The type of variable
	 * @private
	 */
	private throwError(variable: string, type: string) {
		throw new Error(`No ${variable} value was specified. Please ensure that the ${variable} property is specified and that it is of type ${type}.`);
	}
}


@Component({
	selector: 'alert-dialog',
	templateUrl: './partials/alertdialog.shared.html'
})
export class AlertDialog {
	alertConfig: AlertDialogConfig;
}
@Component({
	selector: 'confirm-dialog',
	templateUrl: './partials/confirmdialog.shared.html'
})
export class ConfirmDialog {
	confirmConfig: ConfirmDialogConfig;
}
@Component({
	selector: 'prompt-dialog',
	templateUrl: './partials/promptdialog.shared.html'
})
export class PromptDialog {
	promptConfig: PromptDialogConfig;
}
interface DialogConfig extends MdDialogConfig {
	msg: string;
	title?: string;
}
interface AlertDialogConfig extends DialogConfig {
	ok?: string;
}

interface ConfirmDialogConfig extends DialogConfig {
	ok?: string;
	cancel?: string;
}

interface PromptDialogConfig extends DialogConfig {
	ok?: string;
	cancel?: string;
}