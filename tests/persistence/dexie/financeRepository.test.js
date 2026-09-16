import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';

import 'fake-indexeddb/auto';

import {
  createAccount,
  createCategory,
  createIncome,
  createJournal,
  createMonth,
  createReflection,
  createTemplate,
  createTransaction,
  createTransfer,
} from '../../../src/domain/index.js';

const { createDexieFinanceRepository } = await import('../../../src/persistence/dexie/financeRepository.js');
const { createMonthoryDatabase } = await import('../../../src/persistence/dexie/database.js');

async function withRepository(run) {
  const databaseName = `monthory-test-${randomUUID()}`;
  const database = createMonthoryDatabase({ name: databaseName });
  const repository = createDexieFinanceRepository(database);

  try {
    return await run(repository, database);
  } finally {
    database.close();
    await database.delete();
  }
}

test('persists and retrieves a month', async () => {
  await withRepository(async (repository) => {
    const month = createMonth({ year: 2026, month: 9 });

    await repository.months.save(month);

    assert.deepEqual(await repository.months.getById('2026-09'), month);
    assert.deepEqual(await repository.months.list(), [month]);
  });
});

test('saves, updates, lists, and deletes income by month', async () => {
  await withRepository(async (repository) => {
    const septemberIncome = createIncome({
      id: 'income-1',
      monthId: '2026-09',
      date: '2026-09-05',
      description: 'Salary',
      amount: 10000,
      accountId: 'acc-maybank',
    });
    const updatedSeptemberIncome = { ...septemberIncome, amount: 11000 };
    const octoberIncome = createIncome({
      id: 'income-2',
      monthId: '2026-10',
      date: '2026-10-01',
      description: 'Bonus',
      amount: 2000,
      accountId: 'acc-maybank',
    });

    await repository.incomes.save(septemberIncome);
    await repository.incomes.save(octoberIncome);
    await repository.incomes.save(updatedSeptemberIncome);

    assert.deepEqual(await repository.incomes.getById('income-1'), updatedSeptemberIncome);
    assert.deepEqual(await repository.incomes.listByMonth('2026-09'), [updatedSeptemberIncome]);
    assert.deepEqual(await repository.incomes.listByMonth('2026-10'), [octoberIncome]);

    await repository.incomes.delete('income-1');

    assert.equal(await repository.incomes.getById('income-1'), undefined);
    assert.deepEqual(await repository.incomes.listByMonth('2026-09'), []);
  });
});

test('saves, updates, and isolates transactions by month', async () => {
  await withRepository(async (repository) => {
    const septemberTransactions = [
      createTransaction({
        id: 'tx-1',
        monthId: '2026-09',
        date: '2026-09-06',
        description: 'Groceries',
        amount: 100,
        categoryId: 'cat-groceries',
        accountId: 'acc-cash',
      }),
      createTransaction({
        id: 'tx-2',
        monthId: '2026-09',
        date: '2026-09-07',
        description: 'Utilities',
        amount: 200,
        categoryId: 'cat-utilities',
        accountId: 'acc-maybank',
      }),
    ];
    const octoberTransactions = [
      createTransaction({
        id: 'tx-3',
        monthId: '2026-10',
        date: '2026-10-01',
        description: 'Restaurant',
        amount: 300,
        categoryId: 'cat-dining',
        accountId: 'acc-cimb',
      }),
      createTransaction({
        id: 'tx-4',
        monthId: '2026-10',
        date: '2026-10-02',
        description: 'Petrol',
        amount: 400,
        categoryId: 'cat-transport',
        accountId: 'acc-maybank',
      }),
    ];

    for (const transaction of [...septemberTransactions, ...octoberTransactions]) {
      await repository.transactions.save(transaction);
    }

    assert.deepEqual(await repository.transactions.listByMonth('2026-09'), septemberTransactions);
    assert.deepEqual(await repository.transactions.listByMonth('2026-10'), octoberTransactions);

    const updatedTransaction = { ...septemberTransactions[0], amount: 125 };
    await repository.transactions.save(updatedTransaction);

    assert.deepEqual(await repository.transactions.getById('tx-1'), updatedTransaction);

    await repository.transactions.delete('tx-2');

    assert.deepEqual(await repository.transactions.listByMonth('2026-09'), [updatedTransaction]);
  });
});

test('persists category ids for income and transactions across updates and reloads', async () => {
  await withRepository(async (repository) => {
    const income = createIncome({
      id: 'income-cat-1',
      monthId: '2026-09',
      date: '2026-09-05',
      description: 'Salary',
      amount: 10000,
      categoryId: 'cat-income',
    });
    const transaction = createTransaction({
      id: 'tx-cat-1',
      monthId: '2026-09',
      date: '2026-09-06',
      description: 'Groceries',
      amount: 180,
      categoryId: 'cat-food',
    });

    await repository.incomes.save(income);
    await repository.transactions.save(transaction);

    assert.equal((await repository.incomes.getById('income-cat-1')).categoryId, 'cat-income');
    assert.equal((await repository.transactions.getById('tx-cat-1')).categoryId, 'cat-food');

    await repository.incomes.save({ ...income, categoryId: 'cat-bonus' });
    const transactionWithoutCategory = { ...transaction };
    delete transactionWithoutCategory.categoryId;
    await repository.transactions.save(transactionWithoutCategory);

    assert.equal((await repository.incomes.getById('income-cat-1')).categoryId, 'cat-bonus');
    assert.equal(Object.prototype.hasOwnProperty.call(await repository.transactions.getById('tx-cat-1'), 'categoryId'), false);
  });
});

test('persists transfers without affecting month isolation', async () => {
  await withRepository(async (repository) => {
    const transfer = createTransfer({
      id: 'tr-1',
      monthId: '2026-09',
      date: '2026-09-18',
      amount: 3000,
      fromAccountId: 'acc-maybank',
      toAccountId: 'acc-cimb',
      description: 'Move savings',
    });
    const otherMonthTransfer = createTransfer({
      id: 'tr-2',
      monthId: '2026-10',
      date: '2026-10-18',
      amount: 1500,
      fromAccountId: 'acc-maybank',
      toAccountId: 'acc-cash',
      description: 'Move cash',
    });

    await repository.transfers.save(transfer);
    await repository.transfers.save(otherMonthTransfer);

    assert.deepEqual(await repository.transfers.getById('tr-1'), transfer);
    assert.deepEqual(await repository.transfers.listByMonth('2026-09'), [transfer]);
    assert.deepEqual(await repository.transfers.listByMonth('2026-10'), [otherMonthTransfer]);
  });
});

test('persists journals and reflections by month', async () => {
  await withRepository(async (repository) => {
    const journal = createJournal({
      monthId: '2026-09',
      notes: 'Monthly notes',
      createdAt: '2026-09-30T10:15:00.000Z',
    });
    const reflection = createReflection({
      monthId: '2026-09',
      notes: 'End-of-month reflection',
      createdAt: '2026-09-30T18:00:00.000Z',
    });
    const otherMonthJournal = createJournal({
      monthId: '2026-10',
      notes: 'October notes',
      createdAt: '2026-10-30T10:15:00.000Z',
    });

    await repository.journals.save(journal);
    await repository.reflections.save(reflection);
    await repository.journals.save(otherMonthJournal);

    assert.deepEqual(await repository.journals.getByMonthId('2026-09'), journal);
    assert.deepEqual(await repository.journals.listByMonth('2026-09'), [journal]);
    assert.deepEqual(await repository.journals.listByMonth('2026-10'), [otherMonthJournal]);
    assert.deepEqual(await repository.reflections.getByMonthId('2026-09'), reflection);

    await repository.journals.delete('2026-09');
    await repository.reflections.delete('2026-09');

    assert.equal(await repository.journals.getByMonthId('2026-09'), undefined);
    assert.equal(await repository.reflections.getByMonthId('2026-09'), undefined);
  });
});

test('persists category, account, and template records', async () => {
  await withRepository(async (repository) => {
    const category = createCategory({ id: 'cat-food', name: 'Food', icon: 'utensils' });
    const account = createAccount({ id: 'acc-cash', name: 'Cash', type: 'cash' });
    const template = createTemplate({
      id: 'tpl-netflix',
      type: 'transaction',
      description: 'Netflix',
      amount: 55,
      categoryId: 'cat-entertainment',
      accountId: 'acc-cash',
      frequency: 'monthly',
    });

    await repository.categories.save(category);
    await repository.accounts.save(account);
    await repository.templates.save(template);

    assert.deepEqual(await repository.categories.getById('cat-food'), category);
    assert.deepEqual(await repository.accounts.getById('acc-cash'), account);
    assert.deepEqual(await repository.templates.getById('tpl-netflix'), template);
  });
});

test('supports a persistence round trip by reopening the same database', async () => {
  const databaseName = `monthory-roundtrip-${randomUUID()}`;
  const month = createMonth({ year: 2026, month: 9 });

  const firstDatabase = createMonthoryDatabase({ name: databaseName });
  const firstRepository = createDexieFinanceRepository(firstDatabase);

  await firstRepository.months.save(month);
  firstDatabase.close();

  const secondDatabase = createMonthoryDatabase({ name: databaseName });
  const secondRepository = createDexieFinanceRepository(secondDatabase);

  try {
    assert.deepEqual(await secondRepository.months.getById('2026-09'), month);
  } finally {
    secondDatabase.close();
    await secondDatabase.delete();
  }
});

test('supports month isolation for monthly lookups', async () => {
  await withRepository(async (repository) => {
    const septemberIncome = createIncome({
      id: 'income-sep',
      monthId: '2026-09',
      date: '2026-09-02',
      description: 'Salary',
      amount: 5000,
      accountId: 'acc-maybank',
    });
    const octoberIncome = createIncome({
      id: 'income-oct',
      monthId: '2026-10',
      date: '2026-10-02',
      description: 'Salary',
      amount: 6000,
      accountId: 'acc-maybank',
    });

    await repository.incomes.save(septemberIncome);
    await repository.incomes.save(octoberIncome);

    assert.deepEqual(await repository.incomes.listByMonth('2026-09'), [septemberIncome]);
    assert.deepEqual(await repository.incomes.listByMonth('2026-10'), [octoberIncome]);
  });
});