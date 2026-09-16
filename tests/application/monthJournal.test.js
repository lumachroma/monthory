import assert from 'node:assert/strict';
import test from 'node:test';

import { createMonthJournalApplication } from '../../src/application/monthJournal.js';

function createMemoryRepository() {
  const months = new Map();
  const journals = new Map();

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
    journals: {
      async getByMonthId(monthId) {
        return journals.get(monthId) ?? null;
      },

      async save(journal) {
        journals.set(journal.monthId, journal);
        return journal;
      },
    },
    __months: months,
    __journals: journals,
  };
}

test('getOrCreateMonth returns an existing month', async () => {
  const repository = createMemoryRepository();
  const application = createMonthJournalApplication(repository);
  const existingMonth = { id: '2026-09', year: 2026, month: 9 };

  repository.__months.set(existingMonth.id, existingMonth);

  assert.deepEqual(await application.getOrCreateMonth('2026-09'), existingMonth);
  assert.equal(repository.__months.size, 1);
});

test('getOrCreateMonth creates a missing month', async () => {
  const repository = createMemoryRepository();
  const application = createMonthJournalApplication(repository);

  assert.deepEqual(await application.getOrCreateMonth('2026-09'), {
    id: '2026-09',
    year: 2026,
    month: 9,
  });
  assert.equal(repository.__months.size, 1);
});

test('loadMonthJournal creates the month and returns no journal when empty', async () => {
  const repository = createMemoryRepository();
  const application = createMonthJournalApplication(repository);

  const result = await application.getMonthJournal('2026-09');

  assert.deepEqual(result.month, { id: '2026-09', year: 2026, month: 9 });
  assert.equal(result.journal, null);
  assert.equal(repository.__months.size, 1);
});

test('saveMonthJournal creates and updates journal notes', async () => {
  const repository = createMemoryRepository();
  const application = createMonthJournalApplication(repository);

  const firstSave = await application.saveMonthJournal('2026-09', 'September was busy.');

  assert.equal(firstSave.month.id, '2026-09');
  assert.equal(firstSave.journal.monthId, '2026-09');
  assert.equal(firstSave.journal.notes, 'September was busy.');
  assert.equal(repository.__journals.get('2026-09').notes, 'September was busy.');

  const updatedSave = await application.saveMonthJournal('2026-09', 'September was calmer.');

  assert.equal(updatedSave.journal.notes, 'September was calmer.');
  assert.equal(repository.__journals.get('2026-09').notes, 'September was calmer.');
  assert.ok(updatedSave.journal.updatedAt >= firstSave.journal.updatedAt);
});

test('shiftMonthId handles year boundaries', () => {
  const application = createMonthJournalApplication(createMemoryRepository());

  assert.equal(application.shiftMonthId('2026-12', 1), '2027-01');
  assert.equal(application.shiftMonthId('2027-01', -1), '2026-12');
});