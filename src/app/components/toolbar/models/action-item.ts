/** Represents the supported values for the type of action item. */
export enum ActionItemType {
  /** Indicates that the action item's type should be a button. */
  BUTTON = 'button',
  /** Indicates the action item's type should be an icon button. */
  ICON_BUTTON = 'icon-button',
  /**
   * Indicates the action item's type should be a button that launches
   * a menu when clicked.
   */
  MENU_BUTTON = 'menu-button',
  /**
   * Indicates the action item's type should be an icon button that launches
   * a menu when clicked.
   */
  MENU_ICON_BUTTON = 'menu-icon-button'
}
/** An interface to represent an action item. */
export interface ActionItem {
  /** The title of the action item. */
  title: string;
  /**
   * The action item's `aria-label` property, if any.
   * (Defaults to the `title` property if not specified)
   */
  ariaLabel?: string;
  /** The ID of the action item. */
  id?: string;
  /**
   * The action item's icon.
   *
   * Note: Either this property or the `svgIcon` property should be
   * specified. (If both properties are specified, this property's
   * value overrides the value of the `svgIcon` property)
   */
  icon?: string;
  /**
   * The action item's SVG icon.
   *
   * Note: Either the `icon` property or this property should be
   * specified. (If both properties are specified, the `icon` property's
   * value overrides the value of this property)
   */
  svgIcon?: string;
  /**
   * The action item's type.
   *
   * Note: This value will be ignored if the `overflowOnly` property is
   * set to `true`.
   *
   * @see ActionItemType
   */
  type?: ActionItemType;
  /** The click listener for the action item. */
  onItemClickListener?: (ev?: MouseEvent) => void;
  /** Whether to only show this action item in the overflow menu. */
  overflowOnly?: boolean;
  /** Whether to mark this action item as disabled. */
  disabled?: boolean;
  /**
   * The children/sub-items of this action item, if any.
   *
   * Accepted values:
   * - A list of action items, or
   * - A list of action item IDs (coming soon!)
   */
  // TODO: Implement this
  children?: ActionItem[] | string[];
}
