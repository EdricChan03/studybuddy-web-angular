import { UrlTree } from '@angular/router';

/** Represents a custom behavior of the menu button when interacted with. */
export type MenuButtonCustomBehavior = {
  /** The handler to use when the menu button is clicked. */
  handlerType: 'listener';
  /** The listener which is invoked when the menu button is clicked on. */
  onClick: (ev?: Event) => void;
} | {
  /** The handler to use when the menu button is clicked. */
  handlerType: 'router';
  /** The path to navigate to with `Router#navigateByUrl`. */
  navigateTo: string | UrlTree;
};

/**
 * Configuration for the menu button typically displayed next to the title
 * on the toolbar.
 */
export interface MenuButtonConfig {
  /**
   * The behavior of the menu button when interacted with.
   * (Defaults to `MenuButtonBehavior.MENU` if not specified)
   */
  behavior?: MenuButtonCustomBehavior;
  /** The title of the menu button which will be shown as a native tooltip. */
  title?: string;
  /** The aria-label property of the menu button, if any. */
  ariaLabel?: string;
  /**
   * The menu button's icon.
   *
   * Note: Either this property or the `svgIcon` property should be
   * specified. (If both properties are specified, this property's
   * value overrides the value of the `svgIcon` property)
   */
  icon?: string;
  /**
   * The menu button's SVG icon.
   *
   * Note: Either the `icon` property or this property should be
   * specified. (If both properties are specified, the `icon` property's
   * value overrides the value of this property)
   */
  svgIcon?: string;
  /** Whether to show a tooltip. */
  showTooltip?: boolean;
}
