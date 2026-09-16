import { assertMonthId, assertPlainObject, normalizeText, normalizeTimestamp } from './validation.js';

export function createJournal(input = {}) {
  assertPlainObject(input, 'journal');

  const monthId = assertMonthId(input.monthId);
  const notes = normalizeText(input.notes);
  const createdAt = normalizeTimestamp(input.createdAt, 'journal createdAt');
  const updatedAt = input.updatedAt === undefined || input.updatedAt === null
    ? createdAt
    : normalizeTimestamp(input.updatedAt, 'journal updatedAt');

  return {
    monthId,
    notes,
    createdAt,
    updatedAt,
  };
}
