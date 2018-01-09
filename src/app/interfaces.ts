export interface Settings {
	enableCalendar?: boolean;
	showTodosAsTable?: boolean;
	darkTheme?: boolean;
	enableNotifications?: boolean;
	enableExperimental?: boolean;
}
export interface TodoItem {
	content: string;
	title: string;
	dueDate?: Date | string | number | any;
	hasDone?: boolean;
	tags?: string[] | any;
	project?: string;
	id?: string | any;
}
