import { UrlTree } from '@angular/router';

/** Represents the behavior/behaviour of the menu button when interacted with. */
// export enum MenuButtonBehavior {
//   /**
//    * Indicates that the menu button's behavior/behaviour should be
//    * of a menu button.
//    * This menu button should ideally and typically control a side drawer.
//    */
//   MENU = 'menu',
//   /**
//    * Indicates that the menu button's behavior/behaviour should be
//    * of a back button.
//    * This button should navigate back to the previous page that the user was
//    * on.
//    */
//   BACK = 'back',
//   /**
//    * Indicates that custom behavior/behaviour should be used for the
//    * menu button.
//    * (Note: This property is currently **unsupported** until a future version.)
//    */
//   CUSTOM = 'custom'
// }
/** Represents a custom behavior/behaviour of the menu button when interacted with. */
export interface MenuButtonCustomBehavior {
  /** The handler to use when the menu button is clicked. */
  handlerType: 'listener' | 'router';
  /** The listener which is invoked when the menu button is clicked on. */
  onClick?: (ev?: Event) => void;
  /** The path to navigate to with `Router#navigateByUrl`. */
  navigateTo?: string | UrlTree;
}

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
