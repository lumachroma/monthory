import {
  assertNonEmptyString,
  assertPlainObject,
  createDomainId,
  normalizeOptionalString,
} from './validation.js';

export function createCategory(input = {}) {
  assertPlainObject(input, 'category');

  const name = assertNonEmptyString(input.name, 'category name');
  const icon = normalizeOptionalString(input.icon, 'category icon');

  return {
    id: input.id === undefined || input.id === null ? createDomainId('category') : assertNonEmptyString(input.id, 'category id'),
    name,
    ...(icon === undefined ? {} : { icon }),
    archived: Boolean(input.archived),
  };
}
