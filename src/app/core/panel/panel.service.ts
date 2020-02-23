import {
  ComponentPortal, ComponentType, Portal, TemplatePortal
} from '@angular/cdk/portal';
import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { from, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PanelService {
  /** The panel. */
  panel: MatSidenav;
  private viewContainerRef: ViewContainerRef;
  private panelPortal$ = new Subject<Portal<any>>();

  /** Retrieves the current panel portal as an `Observable`. */
  get panelPortal() {
    return from(this.panelPortal$);
  }

  /** Sets the view container ref needed for {@link #setPanelContent}. */
  setViewContainerRef(vcr: ViewContainerRef) {
    this.viewContainerRef = vcr;
  }

  /** Sets the panel portal to the specified portal. */
  setPanelPortal(panelPortal: Portal<any>) {
    this.panelPortal$.next(panelPortal);
  }

  /**
   * Sets the panel content.
   * @param componentOrTemplateRef The component/template reference used.
   * @see PanelService#setPanelPortal
   */
  setPanelContent(componentOrTemplateRef: ComponentType<any> | TemplateRef<any>) {
    let portal: Portal<any>;
    if (componentOrTemplateRef instanceof TemplateRef) {
      const vcr = this.viewContainerRef ? this.viewContainerRef : null;
      portal = new TemplatePortal(componentOrTemplateRef, vcr);
    } else {
      portal = new ComponentPortal(componentOrTemplateRef);
    }
    this.panelPortal$.next(portal);
  }

  /** Resets the current panel portal. */
  clearPanelPortal() {
    this.panelPortal$.next(null);
  }

  /** Opens the panel with optionally a portal to be set. */
  open(portal?: Portal<any>) {
    if (portal) {
      this.panelPortal$.next(portal);
    }
    if (this.panel) {
      return this.panel.open();
    }
  }

  /** Toggles the panel. */
  toggle() {
    if (this.panel) {
      return this.panel.toggle();
    }
  }

  /** Closes the panel. */
  close() {
    if (this.panel) {
      return this.panel.close();
    }
  }
}
