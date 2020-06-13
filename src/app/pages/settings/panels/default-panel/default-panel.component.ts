import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

import { SettingsCategory } from '../../models/setting';
import { SettingsPanel } from '../../models/settings-panel';
import { SettingsPanelsService } from '../../settings-panels.service';
import { SettingsStorageService } from '../../settings-storage.service';

@Component({
  selector: 'app-default-panel',
  templateUrl: './default-panel.component.html'
})
export class DefaultPanelComponent {
  settingsCategories: SettingsCategory[];
  constructor(
    panelsService: SettingsPanelsService,
    route: ActivatedRoute,
    private settingsStorage: SettingsStorageService
  ) {
    route.params.pipe(
      filter(params => params['id'])
    ).subscribe(params => {
      const panel = panelsService.getSettingPanelById(params['id']);
      this.settingsCategories = panel.settings;
      this.updateSettingsValues(panel);
    });
  }

  updateSettingsValues(panel: SettingsPanel) {
    const values = this.settingsStorage.getSetting(panel.key || `${panel.id}Options`);
    const settings = panel.settings.flatMap(category => category.settings);
    for (const id in values) {
      if (id in values) {
        const tempSetting = settings.find(setting => setting.id === id);
        tempSetting.value = values[id];
      }
    }
  }
}
