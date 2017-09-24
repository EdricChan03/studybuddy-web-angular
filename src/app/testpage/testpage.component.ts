import { Shared } from './../shared';
import { Component } from '@angular/core';
import { MdSnackBarVerticalPosition, MdSnackBarHorizontalPosition } from '@angular/material';

@Component({
	selector: 'app-testpage',
	templateUrl: './testpage.component.html'
})
export class TestpageComponent {
	constructor(private shared: Shared) { }
	duration: number = 1000;
	action: string = "Undo";
	verticalPos = ["top", "bottom"];
	horizontalPos = ["start", "center", "end", "left", "right"];
	verticalPosition: MdSnackBarVerticalPosition = "bottom";
	horizontalPosition: MdSnackBarHorizontalPosition = "end";
	extraClass: string;
	alertDialog() {
		this.shared.openAlertDialog({ msg: "I'm an alert message made with code!", ok: "Got it" });
	}
	confirmDialog() {
		this.shared.openConfirmDialog({ msg: "I'm a confirm message made with code!", cancel: "Nah", ok: "Yeah" }).afterClosed().subscribe((res) => {
			console.log(res);
		});
	}
	promptDialog() {
		this.shared.openPromptDialog({ msg: "I'm a prompt message prepopulated with a value!", cancel: "Nah", ok: "Yeah", inputType: "text", placeholder: "A value goes here", value: "Something here", color: "accent" }).afterClosed().subscribe((res) => {
			document.getElementById('result').innerText = `Result: ${res}`;
		});
	}
	closeSnackBar() {
		this.shared.closeSnackbar();
	}
	snackBar() {
		if (this.extraClass) {
			this.shared.openSnackBar({ msg: "I'm a snackbar!", additionalOpts: { horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition, extraClasses: new Array(this.extraClass) } });
		} else {
			this.shared.openSnackBar({ msg: "I'm a snackbar!", additionalOpts: { horizontalPosition: this.horizontalPosition, verticalPosition: this.verticalPosition } });
		}
	}
	durationSnackBar() {
		this.shared.openSnackBar({ msg: "I'm a duration snackbar!", additionalOpts: { duration: this.duration } });
	}
	snackBarWithResult() {
		let snackBarRef = this.shared.openSnackBarWithRef({ msg: "I'm a snackbar with an action!", action: this.action });
		snackBarRef.onAction().subscribe(_ => {
			this.shared.openAlertDialog({ msg: `You clicked on the "${this.action}" button.` });
		});
	}
}
