import type { Copyable } from './copyable';

/**
 * Generic AppModel type to be used for Firestore collection/document references.
 * @template M The `AppModel` type to be used for {@link Copyable}.
 * @template Data Data to be returned by {@link AppModel.asRecord}.
 * @template DataJson Data to be returned by {@link AppModel.toJSON}.
 */
export interface AppModel<M extends AppModel<M, Data, DataJson>, Data, DataJson>
  extends Copyable<M, Partial<Data>> {
  /** Converts this model class to its JSON equivalent, suitable for use in stringified data. */
  toJSON(): DataJson;

  /** Converts this model class to its JS object equivalent. */
  asRecord(): Data;
}
