export interface Settings {
	/**
	 * Whether to enable the experimental calendar
	 */
	enableCalendar?: boolean;
	/**
	 * Whether to show todos in a table
	 */
	showTodosAsTable?: boolean;
	/**
	 * Whether to enable dark theme
	 */
	darkTheme?: boolean;
	/**
	 * Whether to enable notifications
	 */
	enableNotifications?: boolean;
	/**
	 * Whether to enable experimental stuff
	 */
	enableExperimental?: boolean;
}
export interface TodoItem {
	/**
	 * The content of the todo
	 */
	content: string;
	/**
	 * The title of the todo
	 */
	title: string;
	/**
	 * The due date of the todo
	 */
	dueDate?: Date | string | number | any;
	/**
	 * Whether the todo has already been finished
	 */
	hasDone?: boolean;
	/**
	 * The tags to assign to the todo
	 */
	tags?: string[] | any;
	/**
	 * The project that the todo is in
	 */
	project?: string;
	/**
	 * The id of the todo
	 */
	id?: string | any;
}
