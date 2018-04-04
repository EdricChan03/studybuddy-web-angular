import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Settings } from '../interfaces';
import { SharedService } from '../shared.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
	constructor(private shared: SharedService) { }

	defaultSettings: Settings = {
		enableCalendar: false,
		enableNotifications: false,
		enableExperimental: false,
		darkTheme: false,
		showTodosAsTable: false,
		closeSidenavOnClick: true
	};
	settings: Settings = {

	};
	saveSettings() {
		if (this.settings) {
			let tempSettings: Settings;
			if (window.localStorage['settings']) {
				tempSettings = <Settings>JSON.parse(window.localStorage['settings']);
			}
			window.localStorage['settings'] = JSON.stringify(this.settings);
			const snackBarRef = this.shared.openSnackBar({ msg: 'Settings saved', action: 'Undo', additionalOpts: { duration: 6000, horizontalPosition: 'start' } });
			this.settings = this.retrieveSettings();
			// tslint:disable-next-line:max-line-length
			snackBarRef.onAction().subscribe(() => {
				window.localStorage['settings'] = JSON.stringify(tempSettings);
				tempSettings = null;
				this.settings = this.retrieveSettings();
			});
		} else {
			console.error('Could not save settings as the variable is undefined.');
		}
	}
	retrieveSettings(): Settings | any {
		return <Settings>JSON.parse(window.localStorage.getItem('settings'));
	}
	resetSettings() {
		// tslint:disable-next-line:max-line-length
		const dialogRef = this.shared.openConfirmDialog({ title: 'Delete settings?', disableClose: true });
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (result === 'ok') {
					window.localStorage.setItem('settings', JSON.stringify(this.defaultSettings));
					this.settings = this.retrieveSettings();
					this.shared.openSnackBar({ msg: 'Settings were reset', hasElevation: true, additionalOpts: { horizontalPosition: 'start' } });
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
