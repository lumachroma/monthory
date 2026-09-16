import assert from 'node:assert/strict';
import test from 'node:test';

import { createMonthOverviewApplication } from '../../src/application/monthOverview.js';
import { createMonthTransactionApplication } from '../../src/application/monthTransaction.js';

function createMemoryRepository() {
  const months = new Map();
  const incomes = new Map();
  const transactions = new Map();

  return {
    months: {
      async getById(id) {
        return months.get(id);
      },

      async save(month) {
        months.set(month.id, month);
        return month;
      },
    },
    incomes: {
      async listByMonth(monthId) {
        return [...incomes.values()].filter((income) => income.monthId === monthId);
      },

      async save(income) {
        incomes.set(income.id, income);
        return income;
      },

      async delete(id) {
        incomes.delete(id);
      },
    },
    transactions: {
      async listByMonth(monthId) {
        return [...transactions.values()]
          .filter((transaction) => transaction.monthId === monthId)
          .sort((left, right) => String(left.date).localeCompare(String(right.date)) || String(left.id).localeCompare(String(right.id)));
      },

      async save(transaction) {
        transactions.set(transaction.id, transaction);
        return transaction;
      },

      async delete(id) {
        transactions.delete(id);
      },
    },
    __months: months,
    __transactions: transactions,
    __incomes: incomes,
  };
}

test('createTransaction saves a month-scoped spending entry', async () => {
  const repository = createMemoryRepository();
  const application = createMonthTransactionApplication(repository);

  const transaction = await application.createTransaction({
    monthId: '2026-09',
    date: '2026-09-05',
    description: 'Groceries',
    amount: 180,
  });

  assert.equal(transaction.monthId, '2026-09');
  assert.equal(repository.__months.has('2026-09'), true);
  assert.equal(repository.__transactions.get(transaction.id).description, 'Groceries');
});

test('listTransactionsForMonth returns only the selected month', async () => {
  const repository = createMemoryRepository();
  const application = createMonthTransactionApplication(repository);

  await application.createTransaction({ monthId: '2026-09', date: '2026-09-05', description: 'Groceries', amount: 180 });
  await application.createTransaction({ monthId: '2026-10', date: '2026-10-01', description: 'Petrol', amount: 80 });

  const september = await application.listTransactionsForMonth('2026-09');

  assert.equal(september.transactions.length, 1);
  assert.equal(september.transactions[0].description, 'Groceries');
  assert.equal(september.totalSpending, 180);
});

test('updateTransaction preserves the transaction id and updates the saved record', async () => {
  const repository = createMemoryRepository();
  const application = createMonthTransactionApplication(repository);

  const transaction = await application.createTransaction({ monthId: '2026-09', date: '2026-09-05', description: 'Groceries', amount: 180 });

  const updatedTransaction = await application.updateTransaction({
    id: transaction.id,
    monthId: '2026-09',
    date: '2026-09-06',
    description: 'Groceries and fruit',
    amount: 200,
  });

  assert.equal(updatedTransaction.id, transaction.id);
  assert.equal(repository.__transactions.get(transaction.id).description, 'Groceries and fruit');
  assert.equal((await application.getMonthlySpendingTotal('2026-09')), 200);
});

test('deleteTransaction removes the entry and updates the monthly total', async () => {
  const repository = createMemoryRepository();
  const application = createMonthTransactionApplication(repository);

  const transaction = await application.createTransaction({ monthId: '2026-09', date: '2026-09-05', description: 'Groceries', amount: 180 });

  await application.deleteTransaction(transaction.id);

  const transactionState = await application.listTransactionsForMonth('2026-09');

  assert.equal(transactionState.transactions.length, 0);
  assert.equal(transactionState.totalSpending, 0);
});

test('getMonthlySpendingTotal sums the selected month only', async () => {
  const repository = createMemoryRepository();
  const application = createMonthTransactionApplication(repository);

  await application.createTransaction({ monthId: '2026-09', date: '2026-09-01', description: 'Groceries', amount: 180 });
  await application.createTransaction({ monthId: '2026-09', date: '2026-09-15', description: 'Dinner', amount: 65 });
  await application.createTransaction({ monthId: '2026-10', date: '2026-10-01', description: 'Petrol', amount: 80 });

  assert.equal(await application.getMonthlySpendingTotal('2026-09'), 245);
  assert.equal(await application.getMonthlySpendingTotal('2026-10'), 80);
});

test('getMonthlyFinancialSummary combines income and spending into net amount', async () => {
  const repository = createMemoryRepository();
  const transactionApplication = createMonthTransactionApplication(repository);
  const overviewApplication = createMonthOverviewApplication(repository);

  await repository.incomes.save({ id: 'income-1', monthId: '2026-09', date: '2026-09-01', description: 'Salary', amount: 12500 });
  await transactionApplication.createTransaction({ monthId: '2026-09', date: '2026-09-05', description: 'Groceries', amount: 180 });
  await transactionApplication.createTransaction({ monthId: '2026-09', date: '2026-09-06', description: 'Utilities', amount: 240 });

  const summary = await overviewApplication.getMonthlyFinancialSummary('2026-09');

  assert.equal(summary.totalIncome, 12500);
  assert.equal(summary.totalSpending, 420);
  assert.equal(summary.netAmount, 12080);
});