import { HasId, HasTimestampMetadata } from '../../../../interfaces';
import { QuestionType } from './question-type';
import { Answer } from './answer';

/** Interface representing a question object. */
export interface Question extends HasId, HasTimestampMetadata {
  /** The text of the question */
  text: string;
  /** The type of the question */
  type: QuestionType;
  /** The list of answers */
  answers: Answer[];
  /** The amount of points that this question is worth */
  points?: number;
}
