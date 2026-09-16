import {
  assertNonEmptyString,
  assertPlainObject,
  createDomainId,
  normalizeOptionalString,
} from './validation.js';

const MAX_CATEGORY_NAME_LENGTH = 60;

export function normalizeCategoryName(value) {
  const name = assertNonEmptyString(value, 'category name');

  if (name.length > MAX_CATEGORY_NAME_LENGTH) {
    throw new Error(`Category name must be ${MAX_CATEGORY_NAME_LENGTH} characters or fewer.`);
  }

  return name;
}

export function normalizeCategoryNameKey(value) {
  return normalizeCategoryName(value).toLowerCase();
}

export function createCategory(input = {}) {
  assertPlainObject(input, 'category');

  const name = normalizeCategoryName(input.name);
  const icon = normalizeOptionalString(input.icon, 'category icon');

  return {
    id: input.id === undefined || input.id === null ? createDomainId('category') : assertNonEmptyString(input.id, 'category id'),
    name,
    ...(icon === undefined ? {} : { icon }),
    archived: Boolean(input.archived),
  };
}
