import { ThemePalette } from '@angular/material/core';
import { MatLegacyFormFieldAppearance as MatFormFieldAppearance } from '@angular/material/legacy-form-field';

export interface SettingDialogEntry {
  /** The title of the entry. */
  title: string;
  /** The value of the entry. */
  value: string;
  /** Whether the entry is disabled. */
  disabled?: boolean;
  /** The color of the entry. */
  color?: ThemePalette | string;
}

/** Config for a setting dialog. */
export interface SettingDialogConfig<Value = string> {
  /** The current setting value. (Defaults to the setting value) */
  value?: Value;
  /** The list of entries to be shown. */
  // TODO: Separate to `Setting` interface
  entries: SettingDialogEntry[];
  /** The dialog's title. (Defaults to the setting title) */
  title?: string;
  /** The negative button's text. */
  negativeBtnText?: string;
  /** The negative button's color. */
  negativeBtnColor?: ThemePalette;
  /** The positive button's text. */
  positiveBtnText?: string;
  /** The positive button's color. */
  positiveBtnColor?: ThemePalette;
}

/** Config for the input setting dialog's input. */
export interface InputSettingDialogInputConfig {
  /** The input's color. */
  color?: ThemePalette;
  /** The input's appearance. */
  appearance?: MatFormFieldAppearance;
  /** The input's label. */
  label?: string;
  /** The input's placeholder. */
  placeholder?: string;
  /** The input's hint. */
  hint?: string;
  /** Corresponds to the `align` attribute of `<mat-hint>`. */
  hintAlign?: 'start' | 'end' | string;
  /** The input's suffix. */
  suffix?: string;
  /** The input's prefix. */
  prefix?: string;
}

/** Config for an input setting dialog. */
export interface InputSettingDialogConfig extends SettingDialogConfig<string> {
  /** Config for the input. */
  inputConfig?: InputSettingDialogInputConfig;
  /** Whether a value _must_ be specified. */
  requiresValue?: boolean;
}

/** Config for a list setting dialog. */
export interface ListSettingDialogConfig extends SettingDialogConfig<string> {
  /** The radio group's color. */
  radioGroupColor?: ThemePalette;
}

/** Config for a multi-select list setting dialog. */
export interface MultiSelectListSettingDialogConfig extends SettingDialogConfig<string[]> {
  /** The selection list's color. (This sets the checkbox color for all list options) */
  selectionListColor?: ThemePalette;
  /** Whether the label should appear before or after the checkbox. */
  checkboxPosition?: 'before' | 'after';
}
