import { calculateMonthlySummary, createIncome as createIncomeEntity, createMonth, parseMonthId } from '../domain/index.js';

function assertRepository(repository) {
  if (repository === null || typeof repository !== 'object') {
    throw new Error('Month income application requires a repository object.');
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

export function createMonthIncomeApplication(repository) {
  assertRepository(repository);

  async function listIncomeForMonth(monthId) {
    const month = await getOrCreateMonth(repository, monthId);
    const incomes = await repository.incomes.listByMonth(monthId);
    const summary = calculateMonthlySummary({ incomes });

    return {
      month,
      incomes,
      totalIncome: summary.totalIncome,
    };
  }

  async function getMonthlyIncomeTotal(monthId) {
    const incomeState = await listIncomeForMonth(monthId);

    return incomeState.totalIncome;
  }

  async function createIncome(input) {
    const income = createIncomeEntity(input);

    await getOrCreateMonth(repository, income.monthId);
    await repository.incomes.save(income);

    return income;
  }

  async function updateIncome(input) {
    if (input?.id === undefined || input?.id === null || String(input.id).trim() === '') {
      throw new Error('Income id is required to update an income entry.');
    }

    const income = createIncomeEntity(input);

    await getOrCreateMonth(repository, income.monthId);
    await repository.incomes.save(income);

    return income;
  }

  async function deleteIncome(id) {
    await repository.incomes.delete(id);
  }

  return {
    listIncomeForMonth,
    getMonthlyIncomeTotal,
    createIncome,
    updateIncome,
    deleteIncome,
  };
}