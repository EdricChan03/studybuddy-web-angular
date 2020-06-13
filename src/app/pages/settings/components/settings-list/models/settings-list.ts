import { Setting } from '../../../models/setting';

export interface SettingsValueChange<Value = any> {
  /** The setting that was updated. */
  source: Setting<Value>;
  /** The old value of the setting. */
  oldValue: Value;
  /** The new value of the setting. */
  newValue: Value;
}
