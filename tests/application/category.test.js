import assert from 'node:assert/strict';
import test from 'node:test';

import { createCategoryApplication } from '../../src/application/category.js';

function createMemoryRepository() {
  const categories = new Map();

  return {
    categories: {
      async listAll() {
        return [...categories.values()];
      },

      async listActive() {
        return [...categories.values()].filter((category) => !category.archived);
      },

      async getById(id) {
        return categories.get(id);
      },

      async create(category) {
        categories.set(category.id, category);
        return category;
      },

      async update(category) {
        categories.set(category.id, category);
        return category;
      },

      async archive(id) {
        const category = categories.get(id);
        const archivedCategory = { ...category, archived: true };
        categories.set(id, archivedCategory);
        return archivedCategory;
      },
    },
    __categories: categories,
  };
}

test('ensureDefaultCategories seeds starter categories once', async () => {
  const repository = createMemoryRepository();
  const application = createCategoryApplication(repository);

  await application.ensureDefaultCategories();
  await application.ensureDefaultCategories();

  const categories = await application.listCategories();

  assert.equal(categories.length, 11);
  assert.equal(repository.__categories.size, 11);
});

test('ensureDefaultCategories does not overwrite renamed or archived categories', async () => {
  const repository = createMemoryRepository();
  const application = createCategoryApplication(repository);

  repository.__categories.set('cat_food', { id: 'cat_food', name: 'Dining & Groceries', archived: false });
  repository.__categories.set('cat_travel', { id: 'cat_travel', name: 'Travel', archived: true });

  await application.ensureDefaultCategories();

  assert.equal((await application.listCategories()).find((category) => category.id === 'cat_food').name, 'Dining & Groceries');
  assert.equal((await application.listCategories()).find((category) => category.id === 'cat_travel').archived, true);
});

test('createCategory rejects duplicate names case-insensitively', async () => {
  const repository = createMemoryRepository();
  const application = createCategoryApplication(repository);

  await application.createCategory('Food');

  await assert.rejects(() => application.createCategory('food'), /already exists/i);
});

test('renameCategory preserves the category id', async () => {
  const repository = createMemoryRepository();
  const application = createCategoryApplication(repository);

  await application.createCategory('Shopping');
  const category = (await application.listCategories()).find((entry) => entry.name === 'Shopping');

  const renamed = await application.renameCategory(category.id, 'Personal');

  assert.equal(renamed.id, category.id);
  assert.equal(renamed.name, 'Personal');
});

test('archiveCategory marks the category as archived', async () => {
  const repository = createMemoryRepository();
  const application = createCategoryApplication(repository);

  await application.createCategory('Travel');
  const category = (await application.listCategories()).find((entry) => entry.name === 'Travel');

  const archived = await application.archiveCategory(category.id);

  assert.equal(archived.archived, true);
  assert.equal((await application.listActiveCategories()).some((entry) => entry.id === category.id), false);
});