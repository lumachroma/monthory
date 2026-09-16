import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateMonthlySummary } from '../../src/domain/summary.js';

test('calculates a monthly summary from income and transaction records', () => {
  const summary = calculateMonthlySummary({
    incomes: [
      { amount: 10000 },
      { amount: 2000 },
    ],
    transactions: [
      { amount: 500 },
      { amount: 1000 },
      { amount: 250 },
    ],
    transfers: [
      { amount: 3000 },
    ],
  });

  assert.deepEqual(summary, {
    totalIncome: 12000,
    totalSpending: 1750,
    netAmount: 10250,
  });
});

test('ignores transfers when calculating summary totals', () => {
  const summary = calculateMonthlySummary({
    incomes: [{ amount: 1500 }],
    transactions: [{ amount: 250 }],
    transfers: [{ amount: 999999 }],
  });

  assert.deepEqual(summary, {
    totalIncome: 1500,
    totalSpending: 250,
    netAmount: 1250,
  });
});
