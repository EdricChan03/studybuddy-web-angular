export type Visibility = 'private' | 'public' | 'unlisted';
/**
 * Interfaces that extend this class have the ability to specify
 * the visibility of the object. This will then be set based
 * on the current Firestore Rules.
 */
export interface HasVisibility {
  /** The visibility of the object */
  visibility?: Visibility;
}
