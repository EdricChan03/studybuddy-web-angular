/** Interface used to represent an answer object. */
export interface Answer {
  /** The text of the answer */
  text: string;
  /** The value of the answer */
  value: any;
  /** Whether this answer should be marked as correct */
  isCorrect?: boolean;
}
