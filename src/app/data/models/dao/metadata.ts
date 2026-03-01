import { Temporal } from 'temporal-polyfill';

export { HasId } from '../common/id';

export interface WithTimestampMetadata {
  /** Date when this document was last modified at. */
  lastModified: Temporal.Instant;
  /** Date when this document was created. */
  createdAt: Temporal.Instant;
}

export interface WithTimestampMetadataJson {
  /** Date when this document was last modified at, in ISO8601 form. */
  lastModified: string;
  /** Date when this document was created, in ISO8601 form. */
  createdAt: string;
}
