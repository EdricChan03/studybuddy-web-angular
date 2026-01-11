import { Component } from '@angular/core';
import { getString, RemoteConfig } from '@angular/fire/remote-config';
import { MatPseudoCheckboxState } from '@angular/material/core';

import { Experiment } from '@app/core/experiments/models/experiment';
import { SettingsPanelsService } from '../../settings-panels.service';
import { SettingsStorageService } from '../../settings-storage.service';

@Component({
  selector: 'app-experiments-panel',
  templateUrl: './experiments-panel.component.html'
})
export class ExperimentsPanelComponent {
  experiments: Experiment[] = [];
  experimentVals: {[key: string]: boolean | string | number } = {};
  constructor(
    panelsService: SettingsPanelsService,
    private settingsStorage: SettingsStorageService,
    remoteConfig: RemoteConfig
  ) {
    panelsService.getSettingPanelById('experiments').actions = [
      {
        title: 'Reset',
        color: 'warn',
        onClickListener: () => {
          this.experimentVals = {};
          console.log('Reset was clicked!');
        }
      },
      {
        title: 'Save',
        color: 'primary',
        onClickListener: () => {
          console.log('Experiment values:', this.experimentVals);
          settingsStorage.setSetting('experimentSettings', JSON.stringify(this.experimentVals));
          console.log('Save was clicked!');
        }
      }
    ];

    this.loadAvailableExperiments(getString(remoteConfig, 'available_experiments'));
  }

  private loadAvailableExperiments(value: string) {
    console.log('Currently available experiments:', JSON.parse(value));

    const parsedVal = JSON.parse(value) as Experiment[];
    this.experiments = parsedVal;
    const keys = parsedVal.map(experiment => experiment.key);
    keys.forEach(key => {
      let defaultValue = null;
      const experiment = parsedVal.find(exp => exp.key === key);
      if ('defaultValue' in experiment) {
        defaultValue = experiment.defaultValue;
      }
      this.experimentVals[key] = defaultValue;
    });

    this.experimentVals = this.settingsStorage.getSetting<Record<string, boolean | string | number>>(
      'experimentSettings', {}
    );
  }

  getCheckboxState(boolVal: any): MatPseudoCheckboxState {
    return (typeof boolVal === 'boolean' && boolVal) ? 'checked' : 'unchecked';
  }
}
