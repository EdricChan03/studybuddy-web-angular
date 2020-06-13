export interface Experiment {
  /** The name of the experiment. */
  name: string;
  /** A description of the experiment. */
  description?: string;
  /**
   * The type of form UI (e.g. `boolean` -> represents a checkbox) to be used to represent the experiment.
   * @deprecated Use {@link Experiment#formType} instead.
   */
  type?: 'boolean' | 'string' | 'number' | 'checkbox' | 'input';
  /** The type of form UI to be used to represent the experiment's value. */
  formType?: 'checkbox' | 'input';
  /** An acceptable value type for the experiment's value. */
  valueType?: 'boolean' | 'string' | 'number';
  /** The default value of the experiment. */
  defaultValue?: any;
  /** The experiment's key, similar to Android Preferences. */
  key: string;
}
