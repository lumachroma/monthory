import { createFinanceRepository } from '../../repositories/financeRepository.js';
import { NotFoundError, PersistenceError } from '../../repositories/errors.js';
import { createMonthoryDatabase, resetMonthoryDatabase } from './database.js';

function ensureId(value, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`${label} must be a non-empty string.`);
  }

  return value.trim();
}

function sortById(records) {
  return [...records].sort((left, right) => String(left.id).localeCompare(String(right.id)));
}

function sortByMonthThenId(records) {
  return [...records].sort((left, right) => {
    const monthComparison = String(left.monthId).localeCompare(String(right.monthId));

    if (monthComparison !== 0) {
      return monthComparison;
    }

    return String(left.id ?? left.monthId).localeCompare(String(right.id ?? right.monthId));
  });
}

function sortByDateThenId(records) {
  return [...records].sort((left, right) => {
    const dateComparison = String(left.date).localeCompare(String(right.date));

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return String(left.id).localeCompare(String(right.id));
  });
}

async function runPersistenceOperation(operation, handler) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new PersistenceError(operation, error);
  }
}

async function getRequiredRecord(table, id, entityName) {
  const record = await table.get(id);

  if (!record) {
    throw new NotFoundError(entityName, id);
  }

  return record;
}

function createIdRepository(table, entityName) {
  return {
    async getById(id) {
      return runPersistenceOperation(`${entityName}.getById`, async () => table.get(ensureId(id, `${entityName} id`)));
    },

    async list() {
      return runPersistenceOperation(`${entityName}.list`, async () => sortById(await table.toArray()));
    },

    async save(entity) {
      return runPersistenceOperation(`${entityName}.save`, async () => {
        await table.put(entity);
        return entity;
      });
    },

    async delete(id) {
      return runPersistenceOperation(`${entityName}.delete`, async () => {
        const recordId = ensureId(id, `${entityName} id`);
        await getRequiredRecord(table, recordId, entityName);
        await table.delete(recordId);
      });
    },
  };
}

function createMonthScopedRepository(table, entityName) {
  return {
    async getByMonthId(monthId) {
      return runPersistenceOperation(`${entityName}.getByMonthId`, async () => table.get(ensureId(monthId, 'monthId')));
    },

    async list() {
      return runPersistenceOperation(`${entityName}.list`, async () => sortByMonthThenId(await table.toArray()));
    },

    async listByMonth(monthId) {
      return runPersistenceOperation(`${entityName}.listByMonth`, async () => {
        const recordMonthId = ensureId(monthId, 'monthId');
        return sortByMonthThenId(await table.where('monthId').equals(recordMonthId).toArray());
      });
    },

    async save(entity) {
      return runPersistenceOperation(`${entityName}.save`, async () => {
        await table.put(entity);
        return entity;
      });
    },

    async delete(monthId) {
      return runPersistenceOperation(`${entityName}.delete`, async () => {
        const recordMonthId = ensureId(monthId, 'monthId');
        await getRequiredRecord(table, recordMonthId, entityName);
        await table.delete(recordMonthId);
      });
    },
  };
}

function createMonthRepository(table) {
  return {
    async getById(id) {
      return runPersistenceOperation('months.getById', async () => table.get(ensureId(id, 'month id')));
    },

    async list() {
      return runPersistenceOperation('months.list', async () => sortById(await table.toArray()));
    },

    async save(month) {
      return runPersistenceOperation('months.save', async () => {
        await table.put(month);
        return month;
      });
    },

    async delete(id) {
      return runPersistenceOperation('months.delete', async () => {
        const monthId = ensureId(id, 'month id');
        await getRequiredRecord(table, monthId, 'Month');
        await table.delete(monthId);
      });
    },
  };
}

export function createDexieFinanceRepository(database = createMonthoryDatabase()) {
  const monthsTable = database.table('months');
  const journalsTable = database.table('journals');
  const reflectionsTable = database.table('reflections');
  const incomesTable = database.table('incomes');
  const transactionsTable = database.table('transactions');
  const transfersTable = database.table('transfers');
  const categoriesTable = database.table('categories');
  const accountsTable = database.table('accounts');
  const templatesTable = database.table('templates');

  return createFinanceRepository({
    database,
    months: createMonthRepository(monthsTable),
    journals: createMonthScopedRepository(journalsTable, 'journals'),
    reflections: createMonthScopedRepository(reflectionsTable, 'reflections'),
    incomes: {
      ...createIdRepository(incomesTable, 'income'),
      async listByMonth(monthId) {
        return runPersistenceOperation('incomes.listByMonth', async () => {
          const recordMonthId = ensureId(monthId, 'monthId');
          return sortByDateThenId(await incomesTable.where('monthId').equals(recordMonthId).toArray());
        });
      },
    },
    transactions: {
      ...createIdRepository(transactionsTable, 'transaction'),
      async listByMonth(monthId) {
        return runPersistenceOperation('transactions.listByMonth', async () => {
          const recordMonthId = ensureId(monthId, 'monthId');
          return sortByDateThenId(await transactionsTable.where('monthId').equals(recordMonthId).toArray());
        });
      },
    },
    transfers: {
      ...createIdRepository(transfersTable, 'transfer'),
      async listByMonth(monthId) {
        return runPersistenceOperation('transfers.listByMonth', async () => {
          const recordMonthId = ensureId(monthId, 'monthId');
          return sortByDateThenId(await transfersTable.where('monthId').equals(recordMonthId).toArray());
        });
      },
    },
    categories: createIdRepository(categoriesTable, 'category'),
    accounts: createIdRepository(accountsTable, 'account'),
    templates: createIdRepository(templatesTable, 'template'),
    async reset() {
      return resetMonthoryDatabase(database);
    },
  });
}
