import { createCategory as createCategoryEntity, normalizeCategoryNameKey } from '../domain/index.js';
import { CategoryNameConflictError } from './errors.js';
import { DEFAULT_CATEGORIES } from './categoryDefaults.js';

function assertRepository(repository) {
  if (repository === null || typeof repository !== 'object') {
    throw new Error('Category application requires a repository object.');
  }
}

function hasMatchingName(categories, name, ignoreId) {
  const normalizedNameKey = normalizeCategoryNameKey(name);

  return categories.some((category) => category.id !== ignoreId && normalizeCategoryNameKey(category.name) === normalizedNameKey);
}

export function createCategoryApplication(repository) {
  assertRepository(repository);

  async function listCategories() {
    return repository.categories.listAll();
  }

  async function listActiveCategories() {
    return repository.categories.listActive();
  }

  async function ensureDefaultCategories() {
    const existingCategories = await repository.categories.listAll();

    for (const defaultCategory of DEFAULT_CATEGORIES) {
      const hasSameId = existingCategories.some((category) => category.id === defaultCategory.id);
      const hasSameName = existingCategories.some((category) => normalizeCategoryNameKey(category.name) === normalizeCategoryNameKey(defaultCategory.name));

      if (hasSameId || hasSameName) {
        continue;
      }

      await repository.categories.create(createCategoryEntity(defaultCategory));
    }

    return repository.categories.listAll();
  }

  async function createCategory(name, options = {}) {
    const categories = await repository.categories.listAll();

    if (hasMatchingName(categories, name)) {
      throw new CategoryNameConflictError(name.trim());
    }

    const category = createCategoryEntity({
      name,
      icon: options.icon,
    });

    return repository.categories.create(category);
  }

  async function renameCategory(id, name) {
    const category = await repository.categories.getById(id);

    if (!category) {
      throw new Error(`Category with id ${id} was not found.`);
    }

    const categories = await repository.categories.listAll();

    if (hasMatchingName(categories, name, category.id)) {
      throw new CategoryNameConflictError(name.trim());
    }

    const updatedCategory = createCategoryEntity({
      ...category,
      name,
    });

    return repository.categories.update(updatedCategory);
  }

  async function archiveCategory(id) {
    return repository.categories.archive(id);
  }

  return {
    listCategories,
    listActiveCategories,
    ensureDefaultCategories,
    createCategory,
    renameCategory,
    archiveCategory,
  };
}