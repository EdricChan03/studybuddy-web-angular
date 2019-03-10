import { firestore } from 'firebase';
import { DocumentReference } from '@angular/fire/firestore';

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
  /**
   * A sublist of the navigation item
   *
   * Note: Only one sublist can be created.
   */
  list?: SidenavLink[];
}
export interface Settings {
  /**
   * Whether to enable the experimental calendar
   */
  enableCalendar?: boolean;
  /**
   * The default view to show the todos
   */
  todoView?: 'list' | 'table' | 'agenda';
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
  isDone?: boolean;
  /**
   * The tags to assign to the todo
   */
  tags?: string[];
  /**
   * The project that the todo is in
   */
  project?: DocumentReference;
  /**
   * The id of the todo
   */
  id?: string | any;
}

export interface Chat {
  /**
   * The name of the chat
   */
  name: string;
  /** A description of the chat */
  description?: string;
  /**
   * A list of members in the chat as document references to the UIDs
   */
  members: DocumentReference[] | firestore.FieldValue;
  /**
   * A list of admins in the chat as document references to the UIDs
   */
  admins: DocumentReference[] | firestore.FieldValue;
  /**
   * The date that the chat was last modified at
   */
  lastModified?: firestore.Timestamp;
  /**
   * The date that the chat was created at
   */
  createdAt?: firestore.Timestamp;
  /**
   * The owner of the chat (aka. the person who created the chat)
   */
  owner: DocumentReference;
  /** The pinned message in the chat */
  pinnedMessage?: DocumentReference;
}

/** Represents a message in a chat group */
export interface ChatMessage {
  /** The author of the message */
  author: DocumentReference;
  /** The message's content */
  message: string;
  /** The message that this message is replying to */
  replyTo?: DocumentReference;
  /** The date that the message was last modified on */
  lastModified?: firestore.Timestamp;
  /** The date that the message was sent on */
  createdAt?: firestore.Timestamp;
}
export interface TodoProject {
  /**
   * The name of the project
   */
  name: string;
  /**
   * The project document's ID
   */
  id?: string;
  /**
   * The color of the project in hexadecimal color
   */
  color?: string;
  /** The Material icon used to represent this todo */
  icon?: string;
  /**
   * The due date of the project
   */
  dueDate?: firestore.Timestamp;
  /**
   * The list of todos assigned to this project as document references
   */
  todos?: DocumentReference[];
  /**
   * The list of todos assigned to this projecct which are marked as done
   */
  todosDone?: DocumentReference[];
}
