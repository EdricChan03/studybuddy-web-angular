import { Injectable, NgModule, ElementRef } from '@angular/core';
import { OverlayModule, Overlay, OverlayRef, OverlayConfig, OriginConnectionPosition, OverlayConnectionPosition, ConnectedPositionStrategy, GlobalPositionStrategy } from '@angular/cdk/overlay';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { cleanSession } from 'selenium-webdriver/safari';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class OverlayService {
	constructor(
		public overlay: Overlay
	) { }
	/**
	 * The overlay ref
	 */
	public overlayRef: OverlayRef;
	/**
	 * Gets the overlay's config
	 */
	get overlayConfig(): OverlayConfig {
		if (this.overlayRef) {
			return this.overlayRef.getConfig();
		}
	}
	/**
	 * Gets the overlay's keyboard events
	 */
	get overlayKeyboardEvents(): Observable<KeyboardEvent> {
		if (this.overlayRef) {
			return this.overlayRef.keydownEvents();
		}
	}
		/**
	 * Creates a center overlay position strategy
	 * @returns {GlobalPositionStrategy} The position strategy
	 */
	createCenterOverlayPositionStrategy(): GlobalPositionStrategy {
		return this.overlay
			.position()
			.global()
			.centerHorizontally()
			.centerVertically();
	}
	/**
	 * Creates a below the position of an element position strategy
	 * @param {ElementRef} elementRef The element ref
	 * @param {OriginConnectionPosition} originPos The origin's positions
	 * @param {OverlayConnectionPosition} overlayPos The overlay's positions
	 * @returns {ConnectedPositionStrategy} The position strategy
	 */
	createBelowPosElPositionStrategy(
		elementRef: ElementRef,
		originPos: OriginConnectionPosition,
		overlayPos: OverlayConnectionPosition
	): ConnectedPositionStrategy {
		return this.overlay
			.position()
			.connectedTo(elementRef, originPos, overlayPos);
	}
	/**
	 * Creates an overlay
	 * @param portal The component portal which should ideally be already initialized
	 * @param config The configuration for the overlay
	 * @param backdropClose Whether to enable closing the overlay when the backdrop has been clicked
	 */
	createOverlay(portal: ComponentPortal<any>, config?: OverlayConfig, backdropClose?: boolean) {
		this.overlayRef = this.overlay.create(config);
		this.overlayRef.attach(portal);
		if (backdropClose) {
			this.overlayRef.backdropClick().subscribe(() => this.destroyOverlay(true));
		}
	}
	/**
	 * Closes the overlay
	 * @deprecated Use {@link OverlayService#destroyOverlay} instead
	 * @param cleanFromDOM Whether to clean the DOM overlay completely
	 */
	destroyOverlay(cleanFromDOM?: boolean) {
		if (cleanFromDOM) {
			this.overlayRef.detach();
			this.overlayRef.dispose();
		} else {
			this.overlayRef.detach();
		}
	}
	/**
	 * Closes the overlay
	 * @deprecated Use {@link OverlayService#destroyOverlay} instead
	 * @param cleanFromDOM Whether to clean the DOM overlay completely
	 */
	closeOverlay(cleanFromDOM?: boolean) {
		if (cleanFromDOM !== null) {
			this.destroyOverlay(cleanFromDOM);
		} else {
			this.destroyOverlay();
		}
	}

}

@NgModule({
	imports: [
		OverlayModule,
		PortalModule
	],
	providers: [
		OverlayService
	]
})
export class OverlayServiceModule { }