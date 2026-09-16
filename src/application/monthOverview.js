import { calculateMonthlySummary } from '../domain/index.js';

function assertRepository(repository) {
  if (repository === null || typeof repository !== 'object') {
    throw new Error('Month overview application requires a repository object.');
  }
}

export function createMonthOverviewApplication(repository) {
  assertRepository(repository);

  async function getMonthlyFinancialSummary(monthId) {
    const [incomeState, transactionState] = await Promise.all([
      repository.incomes.listByMonth(monthId),
      repository.transactions.listByMonth(monthId),
    ]);

    return calculateMonthlySummary({
      incomes: incomeState,
      transactions: transactionState,
    });
  }

  return {
    getMonthlyFinancialSummary,
  };
}