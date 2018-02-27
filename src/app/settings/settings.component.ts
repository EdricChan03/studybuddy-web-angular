import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Settings } from '../interfaces';
import { SharedService } from '../shared.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
	constructor(private shared: SharedService) { }
	settings: Settings = {
		enableCalendar: false,
		enableNotifications: false,
		enableExperimental: false,
		darkTheme: false,
		showTodosAsTable: false
	};
	save() {
		if (this.settings) {
			if (window.localStorage['settings']) {

				let tempSettings = <Settings>JSON.parse(window.localStorage['settings']);
				window.localStorage['settings'] = JSON.stringify(this.settings);
				// tslint:disable-next-line:max-line-length
				const snackBarRef = this.shared.openSnackBar({ msg: 'Settings saved', action: 'Undo', additionalOpts: { duration: 6000, horizontalPosition: 'start' } });
				snackBarRef.onAction().subscribe(() => {
					window.localStorage['settings'] = JSON.stringify(tempSettings);
					tempSettings = null;
				});
			}
		} else {
			console.error('Could not save settings as the variable is undefined.');
		}
	}
	resetSettings() {
		// tslint:disable-next-line:max-line-length
		const dialogRef = this.shared.openConfirmDialog({title: 'Delete settings?', disableClose: true });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (result === 'ok') {
					window.localStorage.setItem('settings', '');
				}
			}
		});
	}
	ngOnInit() {
		if (window.localStorage['settings']) {
			this.settings = <Settings>JSON.parse(window.localStorage['settings']);
		}
	}
}
