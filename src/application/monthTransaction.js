import { calculateMonthlySummary, createMonth, createTransaction as createTransactionEntity, parseMonthId } from '../domain/index.js';

function assertRepository(repository) {
  if (repository === null || typeof repository !== 'object') {
    throw new Error('Month transaction application requires a repository object.');
  }
}

async function getOrCreateMonth(repository, monthId) {
  const existingMonth = await repository.months.getById(monthId);

  if (existingMonth) {
    return existingMonth;
  }

  const { year, month } = parseMonthId(monthId);
  const createdMonth = createMonth({ id: monthId, year, month });

  await repository.months.save(createdMonth);

  return createdMonth;
}

export function createMonthTransactionApplication(repository) {
  assertRepository(repository);

  async function listTransactionsForMonth(monthId) {
    const month = await getOrCreateMonth(repository, monthId);
    const transactions = await repository.transactions.listByMonth(monthId);
    const summary = calculateMonthlySummary({ transactions });

    return {
      month,
      transactions,
      totalSpending: summary.totalSpending,
    };
  }

  async function getMonthlySpendingTotal(monthId) {
    const transactionState = await listTransactionsForMonth(monthId);

    return transactionState.totalSpending;
  }

  async function createTransaction(input) {
    const transaction = createTransactionEntity(input);

    await getOrCreateMonth(repository, transaction.monthId);
    await repository.transactions.save(transaction);

    return transaction;
  }

  async function updateTransaction(input) {
    if (input?.id === undefined || input?.id === null || String(input.id).trim() === '') {
      throw new Error('Transaction id is required to update a transaction entry.');
    }

    const transaction = createTransactionEntity(input);

    await getOrCreateMonth(repository, transaction.monthId);
    await repository.transactions.save(transaction);

    return transaction;
  }

  async function deleteTransaction(id) {
    await repository.transactions.delete(id);
  }

  return {
    listTransactionsForMonth,
    getMonthlySpendingTotal,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}