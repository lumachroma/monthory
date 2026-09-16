import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import test from 'node:test';

import 'fake-indexeddb/auto';

import { createCategory } from '../../../src/domain/category.js';

const { createDexieFinanceRepository } = await import('../../../src/persistence/dexie/financeRepository.js');
const { createMonthoryDatabase } = await import('../../../src/persistence/dexie/database.js');

async function withRepository(run) {
  const databaseName = `monthory-category-test-${randomUUID()}`;
  const database = createMonthoryDatabase({ name: databaseName });
  const repository = createDexieFinanceRepository(database);

  try {
    return await run(repository, database);
  } finally {
    database.close();
    await database.delete();
  }
}

test('persists, lists, updates, and archives categories', async () => {
  await withRepository(async (repository) => {
    const category = createCategory({ id: 'cat-groceries', name: 'Groceries' });

    await repository.categories.create(category);

    assert.deepEqual(await repository.categories.getById('cat-groceries'), category);
    assert.deepEqual(await repository.categories.listActive(), [category]);

    const renamed = await repository.categories.update({ ...category, name: 'Food' });

    assert.equal(renamed.name, 'Food');
    assert.equal((await repository.categories.listAll())[0].name, 'Food');

    const archived = await repository.categories.archive('cat-groceries');

    assert.equal(archived.archived, true);
    assert.deepEqual(await repository.categories.listActive(), []);
    assert.equal((await repository.categories.listAll())[0].archived, true);
  });
});

test('supports a persistence round trip for categories', async () => {
  const databaseName = `monthory-category-roundtrip-${randomUUID()}`;
  const category = createCategory({ id: 'cat-health', name: 'Health' });

  const firstDatabase = createMonthoryDatabase({ name: databaseName });
  const firstRepository = createDexieFinanceRepository(firstDatabase);

  await firstRepository.categories.create(category);
  firstDatabase.close();

  const secondDatabase = createMonthoryDatabase({ name: databaseName });
  const secondRepository = createDexieFinanceRepository(secondDatabase);

  try {
    assert.deepEqual(await secondRepository.categories.getById('cat-health'), category);
  } finally {
    secondDatabase.close();
    await secondDatabase.delete();
  }
});