import {
  assertNonEmptyString,
  assertPlainObject,
  createDomainId,
  normalizeOptionalString,
} from './validation.js';

export function createAccount(input = {}) {
  assertPlainObject(input, 'account');

  const name = assertNonEmptyString(input.name, 'account name');
  const type = assertNonEmptyString(input.type, 'account type');
  const icon = normalizeOptionalString(input.icon, 'account icon');

  return {
    id: input.id === undefined || input.id === null ? createDomainId('account') : assertNonEmptyString(input.id, 'account id'),
    name,
    type,
    ...(icon === undefined ? {} : { icon }),
    archived: Boolean(input.archived),
  };
}
