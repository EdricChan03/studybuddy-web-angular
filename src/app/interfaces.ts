import type { FieldValue, Timestamp } from '@firebase/firestore-types';
import type { DocumentReference } from '@angular/fire/firestore';

/** Interface to indicate that an AngularFire interface should have a document ID */
export interface HasId {
  /** The document ID */
  id?: string;
}

/** Interface to indicate that a document object should have timestamp metadata. */
export interface HasTimestampMetadata {
  /** The date that the document was last modified at. */
  lastModified?: Timestamp | FieldValue;
  /** The date that the document was created at. */
  createdAt?: Timestamp | FieldValue;
}

export interface SidenavLink {
  /**
   * The link of the navigation item
   */
  link?: string;
  /**
   * The icon of the navigation icon
   */
  icon?: string;
  /**
   * The icon of the navigation icon as an SVG icon
   */
  svgIcon?: string;
  /**
   * The title of the navigation item
   */
  title?: string;
  /** Whether the navigation item should be hidden. */
  hidden?: boolean;
  /** The navigation item's badge, if any */
  badge?: string;
}

/** @deprecated Settings are no longer stored in a single object. */
export interface Settings {
  /**
   * Whether to enable the experimental calendar
   */
  enableCalendar?: boolean;
  /**
   * The default view to show the todos in.
   */
  todoView?: 'list' | 'table';
  /**
   * Whether to enable dark theme
   */
  darkTheme?: boolean;
  /**
   * Whether to enable notifications
   */
  enableNotifications?: boolean;
  /**
   * Whether to enable experimental features
   */
  enableExperimental?: boolean;
  /**
   * Whether to close the sidenav when a list item is clicked
   */
  closeSidenavOnClick?: boolean;
}

/** Represents a todo item. */
export interface TodoItem extends HasId {
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
  dueDate?: Timestamp;
  /**
   * Whether the todo has already been finished
   */
  isDone?: boolean;
  /**
   * The tags to assign to the todo
   */
  tags?: string[];
  /**
   * The project that the todo is in
   */
  project?: DocumentReference;
  /** Whether the todo has been archived */
  isArchived?: boolean;
}

export interface TodoProject extends HasId {
  /**
   * The name of the project
   */
  name: string;
  /**
   * The color of the project in hexadecimal color
   */
  color?: string;
  /** The Material icon used to represent this todo */
  icon?: string;
  /**
   * The due date of the project
   */
  dueDate?: Timestamp;
  /**
   * The list of todos assigned to this project as document references
   */
  todos?: DocumentReference[];
  /**
   * The list of todos assigned to this projecct which are marked as done
   */
  todosDone?: DocumentReference[];
}
