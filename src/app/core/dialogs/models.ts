import { Portal } from '@angular/cdk/portal';
import { ThemePalette } from '@angular/material/core';
import { SafeHtml } from '@angular/platform-browser';

export type ButtonType = 'negative' | 'neutral' | 'positive';

export type DialogType = 'alert' | 'confirm' | 'message' | 'prompt' | 'portal' | 'selection';

export interface BaseDialogOpts {
  /** The dialog's title. */
  title?: string;
}

export interface DialogBtnOpts {
  /** The positive button's text. */
  positiveBtnText?: string;
  /** The positive button's color. */
  positiveBtnColor?: ThemePalette;
  /** The negative button's text. */
  negativeBtnText?: string;
  /** The negative button's color. */
  negativeBtnColor?: ThemePalette;
  /** The neutral button's text. */
  neutralBtnText?: string;
  /** The neutral button's color. */
  neutralBtnColor?: ThemePalette;
  /**
   * Whether to hide the action buttons.
   *
   * Optionally, you can specify which buttons to hide.
   */
  hideActionBtns?: ButtonType[] | boolean;
  /** The initial button to focus on. */
  initialActionBtnFocus?: ButtonType;
}

export interface DialogOptsWithMsg {
  /** The dialog's message. */
  msg?: string | SafeHtml;
  /** The dialog's title. */
  title?: string;
  /** Whether the dialog's message is in HTML. */
  isHtml?: boolean;
}

export interface DialogOpts extends BaseDialogOpts, DialogBtnOpts, DialogOptsWithMsg { }

// TODO: Remove the interfaces that extend DialogOpts with no additional options
/* eslint-disable @typescript-eslint/no-empty-interface */
/** @deprecated Use `DialogOpts` instead */
export interface AlertDialogOpts extends DialogOpts { }

/** @deprecated Use `DialogOpts` instead */
export interface ConfirmDialogOpts extends DialogOpts { }
/* eslint-enable @typescript-eslint/no-empty-interface */

export interface PromptDialogInputConfig {
  /** The input's placeholder. */
  placeholder?: string;
  /** The input's label. */
  label?: string;
  /** The input type. */
  inputType?: string;
  /** The input's initial value. */
  value?: string;
  /** The input's color. */
  color?: ThemePalette;
}

export interface PromptDialogOpts extends DialogOpts {
  /** Configuration for the input. */
  inputConfig?: PromptDialogInputConfig;
  /**
   * The input's placeholder.
   * @deprecated Use {@link PromptDialogInputConfig#placeholder} instead
   */
  placeholder?: string;
  /**
   * The input type.
   * @deprecated Use {@link PromptDialogInputConfig#inputType} instead
   */
  inputType?: 'text' | 'email' | 'password' | 'number';
  /**
   * The initial value of the input
   * @deprecated Use {@link PromptDialogInputConfig#value} instead
   */
  value?: string | number;
  /**
   * The color of the input
   * @deprecated Use {@link PromptDialogInputConfig#color} instead
   */
  color?: ThemePalette;
}

export interface SelectionDialogOpts extends DialogOpts {
  /** Options to be shown in the dialog. */
  options: SelectionDialogOption[];
}

export interface SelectionDialogOption {
  /**
   * The title of the selection list item
   */
  content: string;
  /**
   * Whether the selection list item is disabled
   */
  disabled?: boolean;
  /**
   * The value of the selection list item
   */
  value: any;
  /**
   * The checkbox position of the selection list item
   */
  checkboxPosition?: 'before' | 'after';
  /**
   * Whether the selection list item is initially selected
   */
  selected?: boolean;
}

export interface PortalDialogOpts<T> extends DialogOpts {
  /** The portal to render in the dialog. */
  portal: Portal<T>;
}

/** The result returned by the dialog. */
export enum DialogResult {
  NEGATIVE = 'cancel',
  CANCEL = 'cancel',
  NEUTRAL = 'neutral',
  POSITIVE = 'ok',
  OK = 'ok'
}
