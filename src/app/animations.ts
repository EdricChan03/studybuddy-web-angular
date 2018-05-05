import {
	trigger,
	transition,
	style,
	animate,
	AnimationTriggerMetadata,
	keyframes,
	state
} from '@angular/animations';

export interface Animations {
	/**
	 * Enter-leave animation
	 */
	enterLeaveAnimation: AnimationTriggerMetadata;
	/**
	 * Animation for flashing a color when an update has taken place
	 */
	flashColorUpdateAnimation: AnimationTriggerMetadata;
	/**
	 * Animation used for toggling icon for nested list
	 */
	toggleIconAnimation: AnimationTriggerMetadata;
	/**
	 * Animation used for toggling items for nested list
	 */
	toggleItemsAnimation: AnimationTriggerMetadata;
}
export const animations: Animations = {
	enterLeaveAnimation: trigger('enterLeaveAnim', [
		transition(':enter', [
			style({ transform: 'translateX(-100%)' }),
			animate('0.2s ease-in-out')
		]),
		transition(':leave', [
			style({ transform: 'translateX(100%)' }),
			animate('0.2s ease-in-out')
		])
	]),
	flashColorUpdateAnimation: trigger('flashColorAnim', [
		transition(':enter', [
			animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
				style({ 'background-color': '*', offset: 0 }),
				style({ 'background-color': '#fff3e0', offset: 0.25 }),
				style({ 'background-color': '#fff3e0', offset: 0.75 }),
				style({ 'background-color': '*', offset: 1 })
			])
			)]
		)]),
	toggleIconAnimation: trigger('toggleIconAnim', [
		state('toggled', style({
			transform: 'rotate(90deg)'
		})),
		state('notToggled', style({
			transform: 'rotate(0deg)'
		})),
		transition('* => *', animate('200ms ease-in-out'))
	]),

	toggleItemsAnimation: trigger('toggleItemsAnim', [
		state('notToggled', style({
			visibility: 'hidden',
			opacity: 0,
			'max-height': '0'
		})),
		state('toggled', style({
			visibility: 'visible',
			opacity: 1,
			'max-height': '4000px'
		})),
		transition('notToggled => toggled', animate('500ms ease-in-out')),
		transition('toggled => notToggled', animate('280ms ease-out'))
	])
}
