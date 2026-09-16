import { assertPlainObject, assertPositiveAmount } from './validation.js';

function sumAmounts(records) {
  if (!Array.isArray(records)) {
    throw new Error('Records must be provided as an array.');
  }

  return records.reduce((total, record, index) => {
    if (record === null || typeof record !== 'object') {
      throw new Error(`Record at index ${index} must be an object.`);
    }

    return total + assertPositiveAmount(record.amount, `Record amount at index ${index}`);
  }, 0);
}

export function calculateMonthlySummary(input = {}) {
  assertPlainObject(input, 'monthly summary input');

  const incomes = input.incomes ?? [];
  const transactions = input.transactions ?? [];

  if (input.transfers !== undefined && !Array.isArray(input.transfers)) {
    throw new Error('Transfers must be provided as an array when supplied.');
  }

  const totalIncome = sumAmounts(incomes);
  const totalSpending = sumAmounts(transactions);

  return {
    totalIncome,
    totalSpending,
    netAmount: totalIncome - totalSpending,
  };
}
