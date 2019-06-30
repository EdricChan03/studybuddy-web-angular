// Code adapted from https://netbasal.com/diy-keyboard-shortcuts-in-your-angular-application-4704734547a2

import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { EventManager } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { HotkeyHelpDialogComponent } from './hotkey-help-dialog/hotkey-help-dialog.component';

interface HotkeyOptions {
  /** The element to bind the hotkey to. */
  element: any;
  /** A valid hotkey bind. */
  keys: string;
  /** The description of the hotkey, if any. */
  description?: string;
  /**
   * Blacklist for elements that should not have keyboard shortcuts
   *
   * When specified, it is assumed that all other elements are whitelisted.
   */
  shortcutBlacklistEls?: string[];
  /**
   * Whitelist for elements that should have keyboard shortcuts
   *
   * When specified, it is assumed that all other elements are blacklisted.
   */
  shortcutWhitelistEls?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class HotkeysService {
  hotkeys = new Map<string, string>();
  readonly hotkeyHelpDialogId = 'hotkey-help-dialog';
  defaults: Partial<HotkeyOptions> = {
    element: this.document
  };

  constructor(
    private eventManager: EventManager,
    private dialog: MatDialog,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.addShortcut({ keys: 'shift.?', description: 'Show this help dialog' })
      .subscribe(() => {
        this.openHelpDialog();
      });
  }

  /**
   * Adds a keyboard shortcut which binds to the specified `element`
   * @param options Options for the shortcut
   * @returns The observable
   */
  addShortcut(options: Partial<HotkeyOptions>): Observable<KeyboardEvent> {
    const merged = { ...this.defaults, ...options };
    const event = `keydown.${merged.keys}`;

    if (merged.description) {
      this.hotkeys.set(merged.keys, merged.description);
    }

    return new Observable(observer => {
      const handler = (e: KeyboardEvent) => {
        let skipHotkey = false;
        if (merged.shortcutBlacklistEls !== undefined) {
          const blacklistEls = merged.shortcutBlacklistEls.map(el => el.toUpperCase());
          // We can't just assume that the target is always a HTML element
          // See https://stackoverflow.com/q/28900077/6782707
          if (e.target instanceof Element) {
            // Target is a HTML element
            if (blacklistEls.includes(e.target.tagName)) {
              skipHotkey = true;
            }
          }
        }
        if (merged.shortcutWhitelistEls !== undefined) {
          const whitelistEls = merged.shortcutWhitelistEls.map(el => el.toUpperCase());
          // We can't just assume that the target is always a HTML element
          // See https://stackoverflow.com/q/28900077/6782707
          if (e.target instanceof Element) {
            // Target is a HTML element
            if (!whitelistEls.includes(e.target.tagName)) {
              skipHotkey = true;
            }
          }
        }

        if (!skipHotkey) {
          e.preventDefault();
          observer.next(e);
        }
      };

      const dispose = this.eventManager.addEventListener(
        merged.element, event, handler
      );

      return () => {
        dispose();
        this.hotkeys.delete(merged.keys);
      };
    });
  }

  openHelpDialog() {
    if (this.dialog.getDialogById(this.hotkeyHelpDialogId) != null) {
      // Close existing dialog
      this.dialog.getDialogById(this.hotkeyHelpDialogId).close();
    } else {
      this.dialog.open(HotkeyHelpDialogComponent, {
        data: this.hotkeys,
        id: this.hotkeyHelpDialogId
      });
    }
  }
}
