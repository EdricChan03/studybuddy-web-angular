import { SharedService, SelectionDialogOptions } from '../shared.service';
import { Component } from '@angular/core';
import { MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
	selector: 'app-testpage',
	templateUrl: './testpage.component.html'
})
export class TestpageComponent {
	constructor(private shared: SharedService, private dom: DomSanitizer) { }
	snackBarProps: SnackBarProps = {};
	verticalPos = ['top', 'bottom'];
	horizontalPos = ['start', 'center', 'end', 'left', 'right'];
	alertDialog() {
		this.shared.openAlertDialog({ msg: 'I\'m an alert message made with code!', ok: 'Got it' });
	}
	confirmDialog() {
		// tslint:disable-next-line:max-line-length
		this.shared.openConfirmDialog({ msg: 'I\'m a confirm message made with code!', cancel: 'Nah', ok: 'Yeah' }).afterClosed().subscribe((res) => {
			console.log(res);
		});
	}
	promptDialog() {
		// tslint:disable-next-line:max-line-length
		this.shared.openPromptDialog({ msg: 'I\'m a prompt message prepopulated with a value!', cancel: 'Nah', ok: 'Yeah', inputType: 'text', placeholder: 'A value goes here', value: 'Something here', color: 'accent' }).afterClosed().subscribe((res) => {
			document.getElementById('result').innerText = `Result: ${res}`;
		});
	}
	selectionDialog() {
		const tempVar = [];
		for (let i = 0; i < 10; i++) {
			if (i === 1) {
				tempVar.push({ content: 'Item 1', disabled: true, value: 'item-1' });
			} else if (i === 8) {
				tempVar.push({ content: 'Item 8', value: 'item-8', selected: true });
			} else {
				tempVar.push({ content: `Item ${i}`, value: `item-${i}` });
			}
		}
		const dialogRef = this.shared.openSelectionDialog({ msg: 'Select from tons of options', ok: 'Yeah', cancel: 'Nah', options: tempVar });
		dialogRef.afterClosed().subscribe((result) => {
			this.shared.openAlertDialog({ msg: this.dom.bypassSecurityTrustHtml('<pre><code>{{result | json}}</code></pre>'), isHtml: true });
		});
	}
	closeSnackBar() {
		this.shared.closeSnackbar();
	}
	snackBar() {
		// tslint:disable-next-line:max-line-length
		this.shared.openSnackBar({ msg: 'I\'m a snackbar!', additionalOpts: { horizontalPosition: this.snackBarProps.horizontalPos, verticalPosition: this.snackBarProps.verticalPos, panelClass: this.snackBarProps.panelClass } });
	}
	durationSnackBar() {
		this.shared.openSnackBar({ msg: 'I\'m a duration snackbar!', additionalOpts: { duration: this.snackBarProps.duration } });
	}
	snackBarWithResult() {
		const snackBarRef = this.shared.openSnackBar({ msg: 'I\'m a snackbar with an action!', action: this.snackBarProps.action });
		snackBarRef.onAction().subscribe(_ => {
			this.shared.openAlertDialog({ msg: `You clicked on the "${this.snackBarProps.action}" button.` });
		});
	}
}

interface SnackBarProps {
	duration?: number;
	action?: string;
	verticalPos?: MatSnackBarVerticalPosition;
	horizontalPos?: MatSnackBarHorizontalPosition;
	panelClass?: string;
}