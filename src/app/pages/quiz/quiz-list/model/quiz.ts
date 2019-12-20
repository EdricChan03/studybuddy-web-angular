import { HasId, HasTimestampMetadata } from '../../../../interfaces';
import { Question } from './question';
import { HasVisibility } from '../../../../shared/model/visibility';
import { DocumentReference } from '@angular/fire/firestore';

/** Interface representing a quiz object. */
export interface Quiz extends HasId, HasTimestampMetadata, HasVisibility {
  /** The title of the quiz */
  title: string;
  /** The description of the quiz */
  description?: string;
  /** The list of questions */
  questions: Question[];
  /** The author of the quiz */
  author?: DocumentReference;
}
