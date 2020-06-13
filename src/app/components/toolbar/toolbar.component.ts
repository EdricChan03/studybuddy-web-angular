import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared.service';
import { ActionItem } from './models/action-item';
import { MenuButtonConfig } from './models/menu-button-config';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolbarComponent {

  constructor(
    private shared: SharedService,
    private router: Router
  ) {
    this.invalidateNonOverflowActionItems();
    this.invalidateOverflowActionItems();
  }

  /** A title to be set on the toolbar. */
  @Input() toolbarTitle?: string = this.shared.title;

  private _actionItems: ActionItem[];
  /** The list of action items to show on the toolbar. */
  @Input() set actionItems(value: ActionItem[]) {
    this._actionItems = value;
    // Update non-overflow/overflow action item arrays
    this.invalidateNonOverflowActionItems();
    this.invalidateOverflowActionItems();
  }
  get actionItems() {
    return this._actionItems;
  }

  /**
   * The list of action items that should only be shown in the overflow menu.
   * @private
   */
  overflowActionItems: ActionItem[];
  /**
   * The list of action items that should not be shown in the overflow menu.
   * @private
   */
  nonOverflowActionItems: ActionItem[];

  /** The default menu button configuration. */
  readonly defaultMenuButtonConfig: MenuButtonConfig = {
    // behavior: MenuButtonBehavior.MENU,
    behavior: {
      handlerType: 'listener',
      onClick: (ev) => this.menuClick.emit(ev)
    },
    icon: 'menu',
    showTooltip: false,
    title: 'Menu'
  };

  /** Configuration for the menu button. */
  @Input() menuButtonConfig: MenuButtonConfig = this.defaultMenuButtonConfig;

  /** The colour/color of the toolbar. */
  @Input() color: ThemePalette | null = null;

  /** Event that is emitted when the menu button is clicked on. */
  @Output() menuClick = new EventEmitter<Event>();

  /**
   * Whether to hide the menu button.
   *
   * Note: The menu button is hidden by default if no click listener for
   * the menu is specified. (See {@link ToolbarComponent#menuClick} for more info)
   */
  @Input() hideMenuButton = false;

  /**
   * Whether the overflow menu should be shown.
   * @private
   */
  get shouldShowOverflow(): boolean {
    return this.actionItems.some(item => item.overflowOnly);
  }

  /**
   * Returns whether the specified action item should use a font icon.
   * @param actionItem The action item
   * @returns `true` if a font icon should be used, `false` otherwise.
   * @private
   */
  shouldUseFontIcon(actionItem: ActionItem): boolean {
    return actionItem.icon !== undefined;
  }

  /**
   * Returns whether the specified action item should use an SVG icon.
   * @param actionItem The action item
   * @returns `true` if an SVG icon should be used, `false` otherwise.
   * @private
   */
  shouldUseSvgIcon(actionItem: ActionItem): boolean {
    return actionItem.icon === undefined && actionItem.svgIcon !== undefined;
  }

  /**
   * Returns whether the menu button has a custom icon.
   * @returns `true` if the menu button has a custom icon, `false` otherwise.
   * @private
   */
  get menuButtonHasCustomIcon(): boolean {
    return this.menuButtonConfig.icon !== undefined || this.menuButtonConfig.svgIcon !== undefined;
  }
  /**
   * Returns whether the menu button should use a font icon.
   * @returns `true` if a font icon should be used, `false` otherwise.
   * @private
   */
  get menuButtonShouldUseFontIcon(): boolean {
    return this.menuButtonConfig.icon !== undefined;
  }
  /**
   * Returns whether the menu button should use an SVG icon.
   * @returns `true` if an SVG icon should be used, `false` otherwise.
   * @private
   */
  get menuButtonShouldUseSvgIcon(): boolean {
    return this.menuButtonConfig.icon === undefined && this.menuButtonConfig.icon !== undefined;
  }

  /**
   * Retrieves the (action item/menu button)'s `aria-label` property.
   * @param value The action item/menu button
   * @returns The value to be used on the `aria-label` property
   * @private
   */
  getAriaLabel(value: ActionItem | MenuButtonConfig): string {
    return value.ariaLabel ? value.ariaLabel : value.title;
  }

  handleMenuButtonClick(ev: Event) {
    // switch (this.menuButtonConfig.behavior) {
    //   case MenuButtonBehavior.MENU:
    //     this.menuClick.emit(ev);
    //   case MenuButtonBehavior.BACK:
    //     //
    // }
    switch (this.menuButtonConfig.behavior.handlerType) {
      case 'listener':
        this.menuClick.emit(ev);
        break;
      case 'router':
        this.router.navigateByUrl(this.menuButtonConfig.behavior.navigateTo);
        break;
      default:
        console.warn(`Handler type ${this.menuButtonConfig.behavior['handlerType']} not implemented!`);
        break;
    }
  }

  private invalidateOverflowActionItems() {
    this.overflowActionItems = this.actionItems ? this.actionItems.filter(item => item.overflowOnly) : null;
  }

  private invalidateNonOverflowActionItems() {
    this.nonOverflowActionItems = this.actionItems ? this.actionItems.filter(item => !item.overflowOnly) : null;
  }
}
