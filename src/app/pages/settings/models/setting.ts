import { SettingDialogConfig } from './setting-dialog';

/** The default settings category. */
export const DEFAULT_SETTINGS_CATEGORY: Partial<SettingsCategory> = {
  id: '[DEFAULT]',
  title: null // No title
};

export interface SettingsCategory {
  /** The settings category's ID. */
  id: string;
  /** The settings category's title. */
  title?: string;
  /** The settings that are in this category. */
  settings: Setting<any>[];
}

/**
 * Represents an individual setting.
 * @template Value The type used to represent the setting's value.
 * @template DialogConfig The type used to represent configuration options for
 * the setting's dialog.
 */
export interface Setting<Value = any, DialogConfig = SettingDialogConfig> {
  /** The setting's unique ID. */
  id: string;
  /** The setting's title. */
  title: string;
  /** The setting's summary. */
  summary?: string;
  /** The setting's icon. */
  icon?: string;
  /** The setting's SVG icon. */
  svgIcon?: string;
  /** The setting's type. */
  type: 'checkbox' | 'input' | 'list' | 'multi-select-list' | string;
  /** The setting's current value. */
  value: Value;
  /** Config for the setting's dialog (if applicable). */
  dialogConfig?: DialogConfig;
  /** The setting's on click listener. */
  onClickListener?: (ev: Event) => void;
}
