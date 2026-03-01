import { Temporal } from 'temporal-polyfill';
import { Timestamp } from '@firebase/firestore';

export const toBoolean = (value: unknown): boolean => {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value === 'true';
  return Boolean(value);
}

export const toInstantOrNull = (value: unknown): Temporal.Instant | null => {
  if (value instanceof Temporal.Instant) return value;
  if (value instanceof Timestamp) return Temporal.Instant.fromEpochMilliseconds(value.toMillis());
  if (typeof value === 'string') return Temporal.Instant.from(value);
  if (typeof value === 'number') return Temporal.Instant.fromEpochMilliseconds(value);
  return null;
}
