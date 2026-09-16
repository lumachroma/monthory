import assert from 'node:assert/strict';
import test from 'node:test';

import { createMonthIncomeApplication } from '../../src/application/monthIncome.js';

function createMemoryRepository() {
  const months = new Map();
  const incomes = new Map();

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
        return [...incomes.values()]
          .filter((income) => income.monthId === monthId)
          .sort((left, right) => String(left.date).localeCompare(String(right.date)) || String(left.id).localeCompare(String(right.id)));
      },

      async save(income) {
        incomes.set(income.id, income);
        return income;
      },

      async delete(id) {
        incomes.delete(id);
      },
    },
    __months: months,
    __incomes: incomes,
  };
}

test('createIncome saves a month-scoped income entry', async () => {
  const repository = createMemoryRepository();
  const application = createMonthIncomeApplication(repository);

  const income = await application.createIncome({
    monthId: '2026-09',
    date: '2026-09-05',
    description: 'Salary',
    amount: 12000,
  });

  assert.equal(income.monthId, '2026-09');
  assert.equal(repository.__months.has('2026-09'), true);
  assert.equal(repository.__incomes.get(income.id).description, 'Salary');
});

test('createIncome persists an optional category id', async () => {
  const repository = createMemoryRepository();
  const application = createMonthIncomeApplication(repository);

  const income = await application.createIncome({
    monthId: '2026-09',
    date: '2026-09-05',
    description: 'Salary',
    amount: 12000,
    categoryId: 'cat-income',
  });

  assert.equal(income.categoryId, 'cat-income');
  assert.equal(repository.__incomes.get(income.id).categoryId, 'cat-income');
});

test('updateIncome can change or remove a category id', async () => {
  const repository = createMemoryRepository();
  const application = createMonthIncomeApplication(repository);

  const income = await application.createIncome({
    monthId: '2026-09',
    date: '2026-09-05',
    description: 'Salary',
    amount: 12000,
    categoryId: 'cat-income',
  });

  const updatedIncome = await application.updateIncome({
    id: income.id,
    monthId: '2026-09',
    date: '2026-09-06',
    description: 'Salary',
    amount: 12500,
    categoryId: 'cat-bonus',
  });

  assert.equal(updatedIncome.categoryId, 'cat-bonus');

  const uncategorisedIncome = await application.updateIncome({
    id: income.id,
    monthId: '2026-09',
    date: '2026-09-06',
    description: 'Salary',
    amount: 12500,
  });

  assert.equal(Object.prototype.hasOwnProperty.call(uncategorisedIncome, 'categoryId'), false);
});

test('listIncomeForMonth returns only the selected month', async () => {
  const repository = createMemoryRepository();
  const application = createMonthIncomeApplication(repository);

  await application.createIncome({ monthId: '2026-09', date: '2026-09-05', description: 'Salary', amount: 10000 });
  await application.createIncome({ monthId: '2026-10', date: '2026-10-01', description: 'Bonus', amount: 2000 });

  const september = await application.listIncomeForMonth('2026-09');

  assert.equal(september.incomes.length, 1);
  assert.equal(september.incomes[0].description, 'Salary');
  assert.equal(september.totalIncome, 10000);
});

test('updateIncome preserves the income id and updates the saved record', async () => {
  const repository = createMemoryRepository();
  const application = createMonthIncomeApplication(repository);

  const income = await application.createIncome({ monthId: '2026-09', date: '2026-09-05', description: 'Salary', amount: 10000 });

  const updatedIncome = await application.updateIncome({
    id: income.id,
    monthId: '2026-09',
    date: '2026-09-06',
    description: 'Salary updated',
    amount: 11000,
  });

  assert.equal(updatedIncome.id, income.id);
  assert.equal(repository.__incomes.get(income.id).description, 'Salary updated');
  assert.equal((await application.getMonthlyIncomeTotal('2026-09')), 11000);
});

test('deleteIncome removes the entry and updates the monthly total', async () => {
  const repository = createMemoryRepository();
  const application = createMonthIncomeApplication(repository);

  const income = await application.createIncome({ monthId: '2026-09', date: '2026-09-05', description: 'Salary', amount: 10000 });

  await application.deleteIncome(income.id);

  const incomeState = await application.listIncomeForMonth('2026-09');

  assert.equal(incomeState.incomes.length, 0);
  assert.equal(incomeState.totalIncome, 0);
});

test('getMonthlyIncomeTotal sums the selected month only', async () => {
  const repository = createMemoryRepository();
  const application = createMonthIncomeApplication(repository);

  await application.createIncome({ monthId: '2026-09', date: '2026-09-01', description: 'Salary', amount: 10000 });
  await application.createIncome({ monthId: '2026-09', date: '2026-09-15', description: 'Bonus', amount: 2500 });
  await application.createIncome({ monthId: '2026-10', date: '2026-10-01', description: 'October salary', amount: 12000 });

  assert.equal(await application.getMonthlyIncomeTotal('2026-09'), 12500);
  assert.equal(await application.getMonthlyIncomeTotal('2026-10'), 12000);
});