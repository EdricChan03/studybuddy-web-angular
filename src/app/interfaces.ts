import { firestore } from 'firebase';

export interface SidenavLink {
  link?: string;
  icon?: string;
  svgIcon?: string;
  title?: string;
  list?: SidenavLink[];
}
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
  /**
   * Whether to close the sidenav when a list item is clicked
   */
  closeSidenavOnClick?: boolean;
}
export interface TodoItem {
  /**
   * The content of the todo
   */
  content?: string;
  /**
   * The title of the todo
   */
  title: string;
  /**
   * The due date of the todo
   */
  dueDate?: firestore.Timestamp;
  /**
   * Whether the todo has already been finished
   */
  hasDone?: boolean;
  /**
   * The tags to assign to the todo
   */
  tags?: string[];
  /**
   * The project that the todo is in
   */
  project?: string;
  /**
   * The id of the todo
   */
  id?: string | any;
}

export interface Chat {
  id: string;
  name: string;
  people: string[];
  lastModified?: Date;
  createdAt: Date;
  owner: string;
  notifications?: number | string;
}

export interface TodoProject {
  name: string;
  todos?: any;
  id?: string;
  color?: string;
}
