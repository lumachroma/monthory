import Dexie from 'dexie';

export function createMonthoryDatabase(options = {}) {
  const databaseName = options.name ?? 'monthory';
  const database = new Dexie(databaseName);

  database.version(1).stores({
    months: 'id, year, month',
    journals: 'monthId, createdAt, updatedAt',
    reflections: 'monthId, createdAt, updatedAt',
    incomes: 'id, monthId, date',
    transactions: 'id, monthId, date',
    transfers: 'id, monthId, date',
    categories: 'id, name, archived',
    accounts: 'id, name, type, archived',
    templates: 'id, type, frequency, categoryId, accountId',
  });

  return database;
}

export async function resetMonthoryDatabase(database) {
  if (database === null || typeof database !== 'object' || !Array.isArray(database.tables)) {
    throw new Error('A valid Monthory database instance is required.');
  }

  await database.transaction('rw', database.tables, async () => {
    await Promise.all(database.tables.map((table) => table.clear()));
  });
}
