import { Temporal } from 'temporal-polyfill';
import { Timestamp } from '@firebase/firestore';

/** Converts the specified `instant` to its Firestore {@link Timestamp} equivalent. */
export const toTimestamp = (instant: Temporal.Instant): Timestamp => Timestamp.fromMillis(instant.epochMilliseconds);
