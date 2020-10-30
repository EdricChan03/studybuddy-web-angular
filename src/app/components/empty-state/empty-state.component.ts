import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { UrlTree } from '@angular/router';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html'
})
export class EmptyStateComponent {

  constructor() { }

  /** The title to be shown. */
  @Input() emptyStateTitle: string;

  /** The message to be shown. */
  @Input() emptyStateMsg?: string;

  /** Whether to show a call-to-action (CTA) button. */
  @Input() showCtaBtn = false;

  /**
   * The text of the call-to-action (CTA) button.
   * Note: The `showCtaBtn` input must be set to `true` in order for
   * this attribute to have any effect.
   */
  @Input() ctaBtnText?: string;

  /**
   * The icon of the call-to-action (CTA) button.
   * Note: The `showCtaBtn` input must be set to `true` in order for
   * this attribute to have any effect.
   */
  @Input() ctaBtnIcon?: string;

  /**
   * The SVG icon of the call-to-action (CTA) button.
   * Note: The `showCtaBtn` input must be set to `true` in order for
   * this attribute to have any effect.
   */
  @Input() ctaBtnSvgIcon?: string;

  /**
   * The colour/color of the call-to-action (CTA) button.
   * Note: The `showCtaBtn` input must be set to `true` in order for
   * this attribute to have any effect.
   */
  @Input() ctaBtnColor?: ThemePalette = null;

  /**
   * The link that the call-to-action (CTA) button should go to on click.
   * Note: The `showCtaBtn` input must be set to `true` in order for
   * this attribute to have any effect.
   */
  @Input() ctaBtnRouterLink?: string | UrlTree;

  /**
   * The listener of the call-to-action (CTA) button that will be invoked
   * on click.
   * Note: The `showCtaBtn` input must be set to `true` in order for
   * this attribute to have any effect.
   */
  @Output() ctaBtnClick: EventEmitter<MouseEvent> = new EventEmitter();

  /**
   * Whether the call-to-action (CTA) button should be replaced with the
   * consumer-provided actions.
   * These consumer-provider actions can then passed in via transclusion
   * with the `[empty-state-actions]` attribute.
   */
  @Input() hasCustomActions = false;
  /**
   * The image source to be shown.
   * Note that either the `src` or the `icon` attribute should be specified.
   */
  @Input() emptyStateImageSrc?: string;

  /**
   * The alternate text for the image to be shown.
   * Note that either the `src` or the `icon` attribute should be specified.
   */
  @Input() emptyStateImageAlt = 'Empty state image';

  /**
   * The CSS class name(s) to be applied to the image.
   * Note that either the `src` or the `icon` attribute should be specified.
   */
  @Input() emptyStateImageClass?: string | string[];

  /**
   * The icon to be shown.
   * Note that either the `src` or the `icon` attribute should be specified.
   */
  @Input() emptyStateIcon?: string;

  /**
   * The CSS class name(s) to be applied to the icon.
   * Note that either the `src` or the `icon` attribute should be specified.
   */
  @Input() emptyStateIconClass?: string | string[];

  /**
   * The SVG icon to be shown.
   * Note that either the `svgIcon` or the `icon` attribute should be specified.
   */
  @Input() emptyStateSvgIcon?: string;

  get hasImage() {
    return this.emptyStateImageSrc && !this.emptyStateIcon && !this.emptyStateSvgIcon;
  }

  get hasIcon() {
    return this.emptyStateIcon && !this.emptyStateSvgIcon && !this.emptyStateImageSrc;
  }

  get hasSvgIcon() {
    return this.emptyStateSvgIcon && !this.emptyStateIcon && !this.emptyStateImageSrc;
  }

  get hasCtaBtnIcon() {
    return this.ctaBtnIcon && !this.ctaBtnSvgIcon;
  }

  get hasCtaBtnSvgIcon() {
    return this.ctaBtnSvgIcon && !this.ctaBtnIcon;
  }
}
