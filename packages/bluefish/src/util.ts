import * as _ from 'lodash';

// https://github.com/microsoft/TypeScript/issues/15012#issuecomment-365453623
// https://github.com/microsoft/TypeScript/issues/28374#issuecomment-538013161
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// https://stackoverflow.com/a/49683575. merges record intersection types
export type Id<T> = T extends infer U ? { [K in keyof U]: U[K] } : never;

// https://twitter.com/joshmpollock/status/1550513727098740737
export type OptionalPropertyNames<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T];

/**
 * Complete a partial.
 *
 * @param partial - An object with optional values.
 * @param missing - An object with values for all the partial's optional properties
 */
export function completePartial<T extends object>(
  partial: T,
  missing: { [K in OptionalPropertyNames<T>]-?: T[K] },
): Id<Required<T>> {
  const partialNoUndef = _.pickBy(partial, (v) => v !== undefined);
  return { ...missing, ...partialNoUndef } as unknown as Id<Required<T>>;
}
