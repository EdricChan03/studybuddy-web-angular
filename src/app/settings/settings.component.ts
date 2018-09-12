import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Settings } from '../interfaces';
import { SharedService } from '../shared.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
  constructor(
    private shared: SharedService
  ) {
    shared.title = 'Settings';
  }

  defaultSettings: Settings = {
    enableCalendar: false,
    enableNotifications: false,
    enableExperimental: false,
    enableDarkTheme: false,
    todoView: 'table',
    closeSidenavOnClick: true
  };
  settings: Settings = {};
  saveSettings() {
    if (this.settings) {
      let tempSettings: Settings;
      if (this.shared.settings !== null) {
        tempSettings = this.shared.settings;
      } else {
        tempSettings = {};
      }
      window.localStorage['settings'] = JSON.stringify(this.settings);
      const snackBarRef = this.shared.openSnackBar({
        msg: 'Settings saved',
        action: 'Undo',
        additionalOpts: { duration: 6000 }
      });
      snackBarRef.onAction().subscribe(() => {
        this.shared.settings = tempSettings;
        tempSettings = null;
        this.settings = this.retrieveSettings();
      });
    } else {
      console.error('Could not save settings as the variable is undefined.');
    }
  }
  retrieveSettings(): Settings {
    if (this.shared.settings === null) {
      return {};
    } else {
      return this.shared.settings;
    }
  }
  resetSettings() {
    const dialogRef = this.shared.openConfirmDialog({
      title: 'Delete settings?',
      disableClose: true
    });
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
