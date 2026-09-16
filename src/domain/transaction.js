import {
  assertDateBelongsToMonth,
  assertMonthId,
  assertNonEmptyString,
  assertPlainObject,
  assertPositiveAmount,
  createDomainId,
  normalizeOptionalId,
} from './validation.js';

export function createTransaction(input = {}) {
  assertPlainObject(input, 'transaction');

  const monthId = assertMonthId(input.monthId);
  const date = assertDateBelongsToMonth(input.date, monthId);
  const description = assertNonEmptyString(input.description, 'transaction description');
  const amount = assertPositiveAmount(input.amount, 'transaction amount');
  const categoryId = normalizeOptionalId(input.categoryId, 'transaction categoryId');
  const accountId = normalizeOptionalId(input.accountId, 'transaction accountId');

  return {
    id: input.id === undefined || input.id === null ? createDomainId('transaction') : assertNonEmptyString(input.id, 'transaction id'),
    monthId,
    date,
    description,
    amount,
    ...(categoryId === undefined ? {} : { categoryId }),
    ...(accountId === undefined ? {} : { accountId }),
  };
}
