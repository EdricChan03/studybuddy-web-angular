import { Component, Input, ViewChild } from '@angular/core';
import { MatMenu } from '@angular/material/menu';
import { ActionItem } from '../action-item';

// Note: Code adapted from https://stackoverflow.com/a/53977579/6782707,
// which allows for sub-menus.
@Component({
  selector: 'app-menu-item',
  templateUrl: './menu-item.component.html'
})
export class MenuItemComponent {
  /** The list of action items to render. */
  @Input() items: ActionItem[];
  @ViewChild('subMenu', { static: true }) subMenu: MatMenu;
}
