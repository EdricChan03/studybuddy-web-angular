import { firestore } from 'firebase';
import { DocumentReference } from '@angular/fire/firestore';

/** Interface to indicate that an AngularFire interface should have a document ID */
export interface HasId {
  /** The document ID */
  id?: string;
}

/** Interface to indicate that a document object should have timestamp metadata. */
export interface HasTimestampMetadata {
  /** The date that the document was last modified at. */
  lastModified?: firestore.Timestamp | firestore.FieldValue;
  /** The date that the document was created at. */
  createdAt?: firestore.Timestamp | firestore.FieldValue;
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
  /**
   * A sublist of the navigation item
   *
   * Note: Only one sublist can be created.
   */
  list?: SidenavLink[];
  /** Whether the navigation item should be hidden. */
  hidden?: boolean;
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
   * Whether to enable experimental features
   */
  enableExperimental?: boolean;
  /**
   * Whether to close the sidenav when a list item is clicked
   */
  closeSidenavOnClick?: boolean;
}
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
  /** Whether the todo has been archived */
  isArchived?: boolean;
}

export interface Chat extends HasId, HasTimestampMetadata {
  /** The name of the chat */
  name: string;
  /** A list of admins in the chat as document references to the UIDs */
  admins: DocumentReference[] | firestore.FieldValue;
  /** A list of members in the chat as document references to the user IDs */
  members: DocumentReference[] | firestore.FieldValue;
  /**
   * The owner of the chat (aka. the person who created the chat)
   * as a document document reference to the user ID
   */
  owner: DocumentReference;
  /** A description of the chat */
  description?: string;
  /** The pinned message in the chat */
  pinnedMessage?: DocumentReference;
  /** The visibility of the chat */
  visibility?: ChatVisibility;
}

/**
 * Indicates the visibility of a chat group
 *
 * Description of accepted values:
 * - `public`: Indicates that the chat group is publicly available (aka it will be listed in the list of public chats)
 * - `private`: Indicates that the chat group is private
 * (aka it can only be accessed with the chat's ID and the user has been invited by an existing user in the chat group)
 * - `unlisted`: Indicates that the chat group is only accessible with the ID
 */
export type ChatVisibility = 'public' | 'private' | 'unlisted';

/** Represents a message in a chat group */
export interface ChatMessage extends HasId {
  /** The author of the message */
  author: DocumentReference;
  /** The message's content */
  message: string;
  /** The message that this message is replying to */
  replyTo?: DocumentReference;
  /** The date that the message was last modified on */
  lastModified?: firestore.Timestamp | firestore.FieldValue;
  /** The date that the message was sent on */
  createdAt?: firestore.Timestamp | firestore.FieldValue;
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
