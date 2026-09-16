import assert from 'node:assert/strict';
import test from 'node:test';

import { createMonth, createMonthId } from '../../src/domain/month.js';

test('creates a valid month with a deterministic id', () => {
  const month = createMonth({ year: 2026, month: 9 });

  assert.deepEqual(month, {
    id: '2026-09',
    year: 2026,
    month: 9,
  });
  assert.equal(createMonthId(2026, 9), '2026-09');
});

test('rejects an invalid month value', () => {
  assert.throws(() => createMonth({ year: 2026, month: 13 }), /month value/i);
});

test('rejects a mismatched month id', () => {
  assert.throws(() => createMonth({ id: '2026-08', year: 2026, month: 9 }), /must match/i);
});
