import {
  assertNonEmptyString,
  assertPlainObject,
  assertPositiveAmount,
  createDomainId,
  normalizeOptionalId,
  normalizeTemplateType,
} from './validation.js';

export function createTemplate(input = {}) {
  assertPlainObject(input, 'template');

  const type = normalizeTemplateType(input.type);
  const description = assertNonEmptyString(input.description, 'template description');
  const amount = assertPositiveAmount(input.amount, 'template amount');
  const frequency = assertNonEmptyString(input.frequency, 'template frequency');
  const categoryId = normalizeOptionalId(input.categoryId, 'template categoryId');
  const accountId = normalizeOptionalId(input.accountId, 'template accountId');

  return {
    id: input.id === undefined || input.id === null ? createDomainId('template') : assertNonEmptyString(input.id, 'template id'),
    type,
    description,
    amount,
    frequency,
    ...(categoryId === undefined ? {} : { categoryId }),
    ...(accountId === undefined ? {} : { accountId }),
  };
}
