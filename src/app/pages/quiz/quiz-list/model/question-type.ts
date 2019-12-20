
/** The question type to be used for the question. */
export enum QuestionType {
  /** Enum to indicate that this question has no type (E.g. text-only question with no answers) */
  None = 'none',
  /** Enum to indicate that this question's type should be default (short-answer) */
  Default = 'default',
  /** Enum to indicate that this question should be a short answer question */
  Short_Answer = 'short_answer',
  /** Enum to indicate that this question should be a paragraph question */
  Paragraph = 'paragraph',
  /** Enum to indicate that this question should be a multiple-choice question */
  Multiple_Choice = 'multiple_choice',
  /** Enum to indicate that this question should be a checkbox question */
  Check_Boxes = 'check_boxes',
  /** Enum to indicate that this question should be a drop-down question */
  Drop_Down = 'drop_down',
  /** Enum to indicate that this question should be a linear-scale question */
  Linear_Scale = 'linear_scale',
  /** Enum to indicate that this question should be a multiple-choice grid question */
  Multiple_Choice_Grid = 'multiple_choice_grid',
  /** Enum to indicate that this question should be a checkbox grid question */
  Check_Box_Grid = 'check_box_grid',
  /** Enum to indicate that this question should be a date question */
  Date = 'date',
  /** Enum to indicate that this question should be a time question */
  Time = 'time'
}
