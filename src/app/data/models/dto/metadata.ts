import { Timestamp } from '@firebase/firestore';

export { HasId } from '../common/id';

export interface WithDbTimestampMetadata {
  /** Creation date of this document as a Firestore {@link Timestamp}. */
  createdAt: Timestamp;
  /** Last modification date of this document as a Firestore {@link Timestamp}. */
  lastModified: Timestamp;
}
