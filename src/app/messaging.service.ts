import { Injectable } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Injectable()
export class MessagingService {

	private _messages: Message[];
	get messages(): Message[] {
		return this._messages;
	}
	getMessages(): Message[] {
		return this._messages;
	}
	addMessage(message: Message) {
		this._messages.push(message);
	}
	addMessages(messages: Message[]) {
		for (let i = 0; i++; i < messages.length) {
			this._messages.push(messages[i]);
		}
	}
	setMessages(messages: Message[]) {
		this._messages = messages;
	}
	getMessageById(id: string): Message {
		return this._messages.find((message: Message) => message.id === id);
	}
	deleteMessageById(id: string) {
		this._messages = this._messages.filter((message: Message) => message.id !== id);
	}
}

interface MessageGroup {
	/**
	 * Messages of the group
	 */
	messages: Message[];
	/**
	 * The title of the group
	 */
	title: string;
}
interface Message {
	/**
	 * The title of the message
	 */
	title: string;
	/**
	 * The image of the message
	 */
	img?: string;
	/**
	 * The action buttons of the message 
	 */
	actions?: MessageAction[];
	/** 
	 * Whether to disable the dismiss button
	 */
	disableDismiss?: boolean;
	/**
	 * The id of the message
	 */
	id: string;
}
interface MessageAction {
	/** 
	 * Whether the action button is an icon button
	 */
	isIconBtn?: boolean;
	/**
	 * The name of the icon
	 * Note: If this property is specified, it'll be automatically assumed to be an icon button
	 */
	icon?: string;
	/**
	 * The title of the action button
	 * Note: If this property is specified, it'll be automatically assumed to be a normal button
	 */
	title?: string;
	/**
	 * The tooltip text of the action button
	 * Note: If the `title` property is specified, this property will be ignored
	 */
	tooltipText?: string;
	/**
	 * The color of the action button
	 */
	color?: ThemePalette;
	/**
	 * The on click listener for the action button
	 */
	onClickListener?: (ev: Event) => {};
}