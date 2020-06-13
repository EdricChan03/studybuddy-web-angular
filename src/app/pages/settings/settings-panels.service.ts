import { Injectable } from '@angular/core';

import { SettingsPanel, SettingsPanelCategory, DEFAULT_PANEL_CATEGORY } from './models/settings-panel';

import { environment } from '../../../environments/environment';

import { panels } from '../../../assets/settings/settings.json';

@Injectable()
/** Service which lists the list of settings panels available. */
export class SettingsPanelsService {
  /** The list of panel categories. */
  readonly settingsPanelsCategories: SettingsPanelCategory[] = []
  .concat(DEFAULT_PANEL_CATEGORY);
  /** The list of panel category IDs. */
  get settingsPanelsCategoryIds() {
    return this.settingsPanelsCategories.map(category => category.id);
  }

  /** The list of panels. */
  settingsPanels: SettingsPanel[] = panels;

  constructor() {
    this.settingsPanels.forEach(panel => {
      if (panel.key === undefined && panel.id !== undefined) {
        panel.key = `${panel.id}Settings`;
      }
    });
    if (environment.production) {
      this.getSettingPanelById('testing').hidden = true;
    }
  }

  /**
   * Retrieves a setting panel by its ID.
   * @param id The ID of the setting panel to find.
   */
  getSettingPanelById(id: string): SettingsPanel {
    return this.settingsPanels.find(panel => panel.id === id);
  }

  /** The list of panel IDs. */
  get settingsPanelsIds() {
    return this.settingsPanels.map(panel => panel.id);
  }
}
