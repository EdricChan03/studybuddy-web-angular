import { Injectable, InjectionToken, Inject } from '@angular/core';

export const SETTINGS_STORAGE = new InjectionToken<Storage>('Settings storage', {
  factory: () => localStorage
});

@Injectable({
  providedIn: 'root'
})
export class SettingsStorageService {

  constructor(@Inject(SETTINGS_STORAGE) private storage: Storage) { }

  get settingsLength(): number {
    return this.storage.length;
  }

  setSetting(key: string, val: any) {
    if (typeof val === 'string') {
      this.storage[key] = val;
    } else {
      this.storage[key] = JSON.stringify(val);
    }
  }

  hasSetting(key: string): boolean {
    return key in this.storage;
  }

  getSetting<T = any>(key: string, defaultVal?: T): T {
    return this.hasSetting(key) ? JSON.parse(this.storage[key]) as T : defaultVal;
  }

  getSettingKeyByIndex(index: number): string {
    return this.storage.key(index);
  }

  removeSetting(key: string) {
    delete this.storage[key];
  }

  clearSettings() {
    this.storage.clear();
  }
}
