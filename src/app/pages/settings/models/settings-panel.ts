import { SettingsCategory } from './setting';
import { ThemePalette } from '@angular/material/core';

export interface SettingsPanelCategory {
  /** The name of the panel category. */
  name: string;
  /** The ID of the panel category. */
  id: string;
}

/** The default panel category to be used if no category is specified. */
export const DEFAULT_PANEL_CATEGORY: SettingsPanelCategory = {
  name: 'Other',
  id: 'default'
};

export interface SettingsPanelAction {
  /** The title of the action. */
  title: string;
  /** Whether the action should be disabled. */
  disabled?: boolean;
  /** The color of the action. */
  color?: ThemePalette;
  /** The action's type. (E.g. `save`, `reset`) */
  type?: string;
  /** The on click listener which is invoked when the action is clicked on. */
  onClickListener?: (ev: Event) => void;
}

export const DEFAULT_PANEL_ACTION: SettingsPanelAction = {
  title: null,
  color: 'primary',
  onClickListener: () => { /* No-op */ }
};

export interface SettingsPanel {
  /** The key that settings in this panel should be saved in. */
  key?: string;
  /** The ID of the panel. */
  id: string;
  /** The name of the panel. */
  title: string;
  /** The description of the panel. */
  summary?: string;
  /** The panel's badge, if any. */
  badge?: string;
  /** The icon of the panel. */
  icon?: string;
  /** The SVG icon of the panel. */
  svgIcon?: string;
  /**
   * The link of the panel.
   * If not specified, the `id` attribute will be used.
   */
  link?: string;
  /** Whether the panel should be hidden from the list of panels, but still be accessible. */
  hidden?: boolean;
  /**
   * The category of the panel.
   * If not specified, it will be assigned to the `default` category.
   *
   * Optionally, a `string` can be used to represent the category's ID to use.
   */
  category?: SettingsPanelCategory | string;
  /** The list of settings in the panel. (For indexing purposes) */
  settings?: SettingsCategory[];
  /**
   * Whether the panel should have actions to save and reset.
   *
   * Implies that {@link SettingsPanel#actions} is empty.
   */
  hasSaveResetActions?: boolean;
  /** The list of actions of the panel. */
  actions?: SettingsPanelAction[];
}
