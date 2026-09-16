import assert from 'node:assert/strict';
import test from 'node:test';

import { createAccount } from '../../src/domain/account.js';
import { createCategory } from '../../src/domain/category.js';
import { createIncome } from '../../src/domain/income.js';
import { createJournal } from '../../src/domain/journal.js';
import { createReflection } from '../../src/domain/reflection.js';
import { createTemplate } from '../../src/domain/template.js';
import { createTransaction } from '../../src/domain/transaction.js';
import { createTransfer } from '../../src/domain/transfer.js';

test('creates a valid income record', () => {
  const income = createIncome({
    id: 'income-1',
    monthId: '2026-09',
    date: '2026-09-05',
    description: 'Salary',
    amount: 10000,
    categoryId: 'cat-income',
    accountId: 'acc-maybank',
  });

  assert.deepEqual(income, {
    id: 'income-1',
    monthId: '2026-09',
    date: '2026-09-05',
    description: 'Salary',
    amount: 10000,
    categoryId: 'cat-income',
    accountId: 'acc-maybank',
  });
});

test('rejects income with a non-positive amount', () => {
  assert.throws(() => createIncome({ monthId: '2026-09', date: '2026-09-05', description: 'Salary', amount: 0 }), /greater than zero/i);
});

test('creates a valid outgoing transaction', () => {
  const transaction = createTransaction({
    id: 'tx-1',
    monthId: '2026-09',
    date: '2026-09-06',
    description: 'Groceries',
    amount: 250,
    categoryId: 'cat-groceries',
    accountId: 'acc-cash',
  });

  assert.deepEqual(transaction, {
    id: 'tx-1',
    monthId: '2026-09',
    date: '2026-09-06',
    description: 'Groceries',
    amount: 250,
    categoryId: 'cat-groceries',
    accountId: 'acc-cash',
  });
});

test('rejects transaction with a non-positive amount', () => {
  assert.throws(() => createTransaction({ monthId: '2026-09', date: '2026-09-06', description: 'Groceries', amount: -1 }), /greater than zero/i);
});

test('creates a valid transfer', () => {
  const transfer = createTransfer({
    id: 'transfer-1',
    monthId: '2026-09',
    date: '2026-09-07',
    amount: 3000,
    fromAccountId: 'acc-maybank',
    toAccountId: 'acc-cimb',
    description: 'Move savings',
  });

  assert.deepEqual(transfer, {
    id: 'transfer-1',
    monthId: '2026-09',
    date: '2026-09-07',
    amount: 3000,
    fromAccountId: 'acc-maybank',
    toAccountId: 'acc-cimb',
    description: 'Move savings',
  });
});

test('rejects transfer when accounts match', () => {
  assert.throws(
    () => createTransfer({ monthId: '2026-09', date: '2026-09-07', amount: 3000, fromAccountId: 'acc-cash', toAccountId: 'acc-cash' }),
    /must differ/i,
  );
});

test('rejects transfer with a non-positive amount', () => {
  assert.throws(
    () => createTransfer({ monthId: '2026-09', date: '2026-09-07', amount: 0, fromAccountId: 'acc-a', toAccountId: 'acc-b' }),
    /greater than zero/i,
  );
});

test('creates a valid category', () => {
  const category = createCategory({ id: 'cat-food', name: 'Food', icon: 'utensils', archived: false });

  assert.deepEqual(category, {
    id: 'cat-food',
    name: 'Food',
    icon: 'utensils',
    archived: false,
  });
});

test('trims category names', () => {
  const category = createCategory({ name: '  Transport  ' });

  assert.equal(category.name, 'Transport');
});

test('rejects category names that are too long', () => {
  assert.throws(() => createCategory({ name: 'a'.repeat(61) }), /60 characters or fewer/i);
});

test('rejects category with an empty name', () => {
  assert.throws(() => createCategory({ name: '   ' }), /non-empty string/i);
});

test('creates a valid account', () => {
  const account = createAccount({ id: 'acc-cash', name: 'Cash', type: 'cash', archived: false });

  assert.deepEqual(account, {
    id: 'acc-cash',
    name: 'Cash',
    type: 'cash',
    archived: false,
  });
});

test('rejects account with an empty name', () => {
  assert.throws(() => createAccount({ name: '', type: 'bank' }), /non-empty string/i);
});

test('creates a valid journal entry', () => {
  const journal = createJournal({
    monthId: '2026-09',
    notes: 'A calm month.',
    createdAt: '2026-09-30T10:15:00.000Z',
    updatedAt: '2026-09-30T12:00:00.000Z',
  });

  assert.deepEqual(journal, {
    monthId: '2026-09',
    notes: 'A calm month.',
    createdAt: '2026-09-30T10:15:00.000Z',
    updatedAt: '2026-09-30T12:00:00.000Z',
  });
});

test('creates a valid reflection entry', () => {
  const reflection = createReflection({
    monthId: '2026-09',
    notes: 'We spent more, but we also noticed why.',
  });

  assert.equal(reflection.monthId, '2026-09');
  assert.equal(reflection.notes, 'We spent more, but we also noticed why.');
  assert.equal(typeof reflection.createdAt, 'string');
  assert.equal(typeof reflection.updatedAt, 'string');
});

test('creates a valid template', () => {
  const template = createTemplate({
    id: 'tpl-netflix',
    type: 'transaction',
    description: 'Netflix',
    amount: 55,
    categoryId: 'cat-entertainment',
    accountId: 'acc-card',
    frequency: 'monthly',
  });

  assert.deepEqual(template, {
    id: 'tpl-netflix',
    type: 'transaction',
    description: 'Netflix',
    amount: 55,
    categoryId: 'cat-entertainment',
    accountId: 'acc-card',
    frequency: 'monthly',
  });
});
