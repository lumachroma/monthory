const MONTH_ID_PATTERN = /^\d{4}-(0[1-9]|1[0-2])$/;
const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function createDomainId(prefix) {
  if (typeof prefix !== 'string' || prefix.trim() === '') {
    throw new Error('ID prefix must be a non-empty string.');
  }

  const randomId = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;

  return `${prefix.trim()}-${randomId}`;
}

export function createTimestamp(now = new Date()) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new Error('Timestamp source must be a valid Date instance.');
  }

  return now.toISOString();
}

export function normalizeTimestamp(value, fieldName) {
  if (value === undefined || value === null) {
    return createTimestamp();
  }

  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new Error(`${fieldName} must be a valid Date instance.`);
    }

    return value.toISOString();
  }

  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be an ISO timestamp string.`);
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`${fieldName} must be a valid ISO timestamp string.`);
  }

  return parsed.toISOString();
}

export function assertPlainObject(value, label) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }

  return value;
}

export function assertNonEmptyString(value, label) {
  if (typeof value !== 'string') {
    throw new Error(`${label} must be a non-empty string.`);
  }

  const trimmed = value.trim();

  if (trimmed === '') {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return trimmed;
}

export function normalizeOptionalString(value, label) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return assertNonEmptyString(value, label);
}

export function normalizeText(value) {
  if (value === undefined || value === null) {
    return '';
  }

  if (typeof value !== 'string') {
    throw new Error('Text value must be a string.');
  }

  return value.trim();
}

export function assertPositiveAmount(value, label) {
  if (typeof value !== 'number' || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a number greater than zero.`);
  }

  return value;
}

export function assertMonthParts(year, month) {
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    throw new Error('Month year must be a four-digit integer.');
  }

  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error('Month value must be an integer from 1 to 12.');
  }

  return { year, month };
}

export function createMonthId(year, month) {
  const normalized = assertMonthParts(year, month);

  return `${normalized.year}-${String(normalized.month).padStart(2, '0')}`;
}

export function assertMonthId(monthId) {
  if (typeof monthId !== 'string' || !MONTH_ID_PATTERN.test(monthId)) {
    throw new Error('Month id must use the YYYY-MM format.');
  }

  return monthId;
}

export function parseMonthId(monthId) {
  const normalizedMonthId = assertMonthId(monthId);
  const [yearPart, monthPart] = normalizedMonthId.split('-');

  return {
    year: Number(yearPart),
    month: Number(monthPart),
  };
}

export function assertDateString(date) {
  if (typeof date !== 'string' || !ISO_DATE_PATTERN.test(date)) {
    throw new Error('Date must use the YYYY-MM-DD format.');
  }

  const parsed = new Date(`${date}T00:00:00Z`);

  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    throw new Error('Date must be a real calendar date in YYYY-MM-DD format.');
  }

  return date;
}

export function assertDateBelongsToMonth(date, monthId) {
  const normalizedDate = assertDateString(date);
  const normalizedMonthId = assertMonthId(monthId);
  const parsedDate = new Date(`${normalizedDate}T00:00:00Z`);
  const { year, month } = parseMonthId(normalizedMonthId);

  if (parsedDate.getUTCFullYear() !== year || parsedDate.getUTCMonth() + 1 !== month) {
    throw new Error('Date must belong to the same calendar month as monthId.');
  }

  return normalizedDate;
}

export function normalizeOptionalId(value, label) {
  if (value === undefined || value === null) {
    return undefined;
  }

  return assertNonEmptyString(value, label);
}

export function normalizeTemplateType(type) {
  const normalizedType = assertNonEmptyString(type, 'template type');

  if (normalizedType !== 'income' && normalizedType !== 'transaction') {
    throw new Error('Template type must be income or transaction.');
  }

  return normalizedType;
}
