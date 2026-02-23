export interface Copyable<T, CopyData> {
  /**
   * Create a copy of this model class, optionally with the specified `data` properties
   * merged into the resulting model class.
   * @param data Desired data to be merged into the copied model class.
   */
  copy(data?: CopyData): T;
}
