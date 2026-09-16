import {
  assertDateBelongsToMonth,
  assertMonthId,
  assertNonEmptyString,
  assertPlainObject,
  assertPositiveAmount,
  createDomainId,
  normalizeOptionalId,
} from './validation.js';

export function createIncome(input = {}) {
  assertPlainObject(input, 'income');

  const monthId = assertMonthId(input.monthId);
  const date = assertDateBelongsToMonth(input.date, monthId);
  const description = assertNonEmptyString(input.description, 'income description');
  const amount = assertPositiveAmount(input.amount, 'income amount');
  const categoryId = normalizeOptionalId(input.categoryId, 'income categoryId');
  const accountId = normalizeOptionalId(input.accountId, 'income accountId');

  return {
    id: input.id === undefined || input.id === null ? createDomainId('income') : assertNonEmptyString(input.id, 'income id'),
    monthId,
    date,
    description,
    amount,
    ...(categoryId === undefined ? {} : { categoryId }),
    ...(accountId === undefined ? {} : { accountId }),
  };
}
