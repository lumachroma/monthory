import { assertMonthParts, assertMonthId, createMonthId, assertPlainObject } from './validation.js';

export function createMonth(input = {}) {
  assertPlainObject(input, 'month');

  const normalizedYear = input.year;
  const normalizedMonth = input.month;
  const resolvedId = input.id ?? createMonthId(normalizedYear, normalizedMonth);

  assertMonthParts(normalizedYear, normalizedMonth);
  assertMonthId(resolvedId);

  const expectedId = createMonthId(normalizedYear, normalizedMonth);

  if (resolvedId !== expectedId) {
    throw new Error('Month id must match the provided year and month.');
  }

  return {
    id: resolvedId,
    year: normalizedYear,
    month: normalizedMonth,
  };
}

export { createMonthId };
