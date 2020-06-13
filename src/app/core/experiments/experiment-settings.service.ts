import { Inject, Injectable, InjectionToken } from '@angular/core';

export const SETTINGS_STORAGE = new InjectionToken<Storage>('Settings storage', {
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class ExperimentSettingsService {

  constructor(@Inject(SETTINGS_STORAGE) private storage: Storage) { }

  get experimentSettingLength(): number {
    return this.storage.length;
  }

  setExperimentSetting(key: string, val: any) {
    this.storage[key] = val;
  }

  getExperimentSetting<T = any>(key: string, defaultVal?: T) {
    return key in this.storage ? this.storage[key] : defaultVal;
  }

  getExperimentSettingByIndex(index: number) {
    return this.storage.key(index);
  }

  removeExperiment(key: string) {
    delete this.storage[key];
  }

  clearExperiments() {
    this.storage.clear();
  }
}
