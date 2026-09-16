import {
  assertDateBelongsToMonth,
  assertMonthId,
  assertNonEmptyString,
  assertPlainObject,
  assertPositiveAmount,
  createDomainId,
  normalizeOptionalString,
} from './validation.js';

export function createTransfer(input = {}) {
  assertPlainObject(input, 'transfer');

  const monthId = assertMonthId(input.monthId);
  const date = assertDateBelongsToMonth(input.date, monthId);
  const amount = assertPositiveAmount(input.amount, 'transfer amount');
  const fromAccountId = assertNonEmptyString(input.fromAccountId, 'transfer fromAccountId');
  const toAccountId = assertNonEmptyString(input.toAccountId, 'transfer toAccountId');

  if (fromAccountId === toAccountId) {
    throw new Error('Transfer source and destination accounts must differ.');
  }

  const description = normalizeOptionalString(input.description, 'transfer description');

  return {
    id: input.id === undefined || input.id === null ? createDomainId('transfer') : assertNonEmptyString(input.id, 'transfer id'),
    monthId,
    date,
    amount,
    fromAccountId,
    toAccountId,
    ...(description === undefined ? {} : { description }),
  };
}
