export function createFinanceRepository(repository) {
  if (repository === null || typeof repository !== 'object') {
    throw new Error('Finance repository must be an object.');
  }

  return repository;
}