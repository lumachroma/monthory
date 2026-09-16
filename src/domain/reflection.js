import { assertMonthId, assertPlainObject, normalizeText, normalizeTimestamp } from './validation.js';

export function createReflection(input = {}) {
  assertPlainObject(input, 'reflection');

  const monthId = assertMonthId(input.monthId);
  const notes = normalizeText(input.notes);
  const createdAt = normalizeTimestamp(input.createdAt, 'reflection createdAt');
  const updatedAt = input.updatedAt === undefined || input.updatedAt === null
    ? createdAt
    : normalizeTimestamp(input.updatedAt, 'reflection updatedAt');

  return {
    monthId,
    notes,
    createdAt,
    updatedAt,
  };
}
