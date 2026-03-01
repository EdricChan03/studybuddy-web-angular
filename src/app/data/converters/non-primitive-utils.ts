import { FieldValue, Timestamp, WithFieldValue } from '@firebase/firestore';
import { toTimestamp } from '@app/data/models/dto/temporal';
import { Temporal } from 'temporal-polyfill';

export const setToDto = <T>(set: FieldValue | WithFieldValue<Set<T>>): FieldValue | T[] => {
  if (set instanceof FieldValue) return set;
  if (set instanceof Set) return [...set];

  throw new Error('WithFieldValue of a Set is not supported');
};

export const temporalInstantToDto = (instant: FieldValue | WithFieldValue<Temporal.Instant>): FieldValue | Timestamp => {
  if (instant instanceof FieldValue) return instant;
  if (instant instanceof Temporal.Instant) return toTimestamp(instant);

  throw new Error('WithFieldValue of a Temporal.Instant is not supported');
}
