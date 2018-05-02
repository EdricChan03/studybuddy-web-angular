import {
	trigger,
	transition,
	style,
	animate,
	AnimationTriggerMetadata,
	keyframes
} from '@angular/animations';

export interface Animations {
	/**
	 * Enter-leave animation
	 */
	enterLeaveAnimation: AnimationTriggerMetadata;
	flashColourUpdateAnimation: AnimationTriggerMetadata;
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
	flashColourUpdateAnimation: trigger('flashColourAnim', [
		transition(':enter', [
			animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
				style({ 'background-color': '*', offset: 0 }),
				style({ 'background-color': '#fff3e0', offset: 0.25 }),
				style({ 'background-color': '#fff3e0', offset: 0.75 }),
				style({ 'background-color': '*', offset: 1 })
			])
			)]
		)])
}

/**
 * Gets a flashing colour animation
 * @param {string} colour The colour to flash
 * @param {string} [animationName] The animation metadata's name
 * @deprecated Use your own implementation
 * @returns {AnimationTriggerMetadata} The animation metadata
 */
export function getColourFlashAnimation(colour: string, animationName?: string): AnimationTriggerMetadata {
	if (!animationName) { 
		animationName = 'colourAnim';
	}
	return trigger(animationName, [
		transition(':enter', [
			animate('0.5s cubic-bezier(0.4, 0, 0.2, 1)', keyframes([
				style({ 'background-color': '*', offset: 0 }),
				style({ 'background-color': colour, offset: 0.25 }),
				style({ 'background-color': colour, offset: 0.75 }),
				style({ 'background-color': '*', offset: 1 })
			])
			)]
		)])
}
