import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { SharedService } from '../../../shared.service';
import { SettingsPanel } from '../models/settings-panel';
import { SettingsPanelsService } from '../settings-panels.service';
import { SettingsStorageService } from '../settings-storage.service';
import { DialogsService } from '../../../core/dialogs/dialogs.service';
import { DialogResult } from '../../../core/dialogs/models';

@Component({
  selector: 'app-settings-outlet',
  templateUrl: './settings-outlet.component.html',
  styleUrls: ['./settings-outlet.component.scss']
})
export class SettingsOutletComponent {
  currentPanelId$: Observable<string>;
  constructor(
    private coreDialogs: DialogsService,
    public panelsService: SettingsPanelsService,
    route: ActivatedRoute,
    public router: Router,
    private settingsStorage: SettingsStorageService,
    public shared: SharedService
  ) {
    shared.title = 'Settings';

    route.queryParams
      .pipe(
        filter(params => params.panel || params.settingPanel)
      ).subscribe(params => {
        const panelId = params.panel ? params.panel : params.settingPanel;
        if (panelsService.settingsPanelsIds.includes(panelId)) {
          router.navigate(['./', panelId], { relativeTo: route, replaceUrl: true });
        } else {
          console.warn(`The 'panel'/'settingPanel' query parameter is set to an invalid setting panel ID.` +
            `\nThe available settings panel IDs are: ${panelsService.settingsPanelsIds.join()}`);
        }
      });
    this.currentPanelId$ = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      switchMap(() => route.firstChild.url),
      map(segment => segment[0].path),
      startWith(router.url.replace(/.*\//, ''))
    );
  }

  private updateSetting(key: string, value: any) {
    this.settingsStorage.setSetting(key, JSON.stringify(value));
  }

  resetSettings(panel: SettingsPanel) {
    const confirmDialogRef = this.coreDialogs.openConfirmDialog({
      title: 'Reset settings?',
      msg: 'This cannot be undone!',
      positiveBtnText: 'Reset',
      positiveBtnColor: 'warn'
    });

    confirmDialogRef.afterClosed().subscribe(result => {
      if (result === DialogResult.POSITIVE) {
        const settingsKey = panel.key || panel.id;
        if (settingsKey !== undefined) {
          this.updateSetting(settingsKey, '');
          this.shared.openSnackBar({
            msg: 'Successfully reset settings!'
          });
        } else {
          console.warn('The specified panel doesn\'t have a key or ID.');
        }
      }
    });
  }

  saveSettings(panel: SettingsPanel) {
    const settingsKey = panel.key || panel.id;
    const valuesMap = {};
    const settings = panel.settings.flatMap(categories => categories.settings);
    settings.forEach(setting => {
      valuesMap[setting.id] = setting.value;
    });

    if (settingsKey !== undefined) {
      this.updateSetting(settingsKey, valuesMap);
      this.shared.openSnackBar({
        msg: 'Successfully saved settings!'
      });
    } else {
      console.warn('The specified panel doesn\'t have a key or ID.');
    }
  }
}
