import {
  createJournal,
  createMonth,
  createMonthId,
  parseMonthId,
} from '../domain/index.js';

function toMonthLabel(monthId) {
  const { year, month } = parseMonthId(monthId);
  const date = new Date(Date.UTC(year, month - 1, 1));

  return date.toLocaleString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export function getCurrentMonthId(referenceDate = new Date()) {
  return createMonthId(referenceDate.getFullYear(), referenceDate.getMonth() + 1);
}

export function shiftMonthId(monthId, offset) {
  const { year, month } = parseMonthId(monthId);
  const shiftedDate = new Date(Date.UTC(year, month - 1 + offset, 1));

  return createMonthId(shiftedDate.getUTCFullYear(), shiftedDate.getUTCMonth() + 1);
}

export function formatMonthLabel(monthId) {
  return toMonthLabel(monthId);
}

export function createMonthJournalApplication(repository) {
  if (repository === null || typeof repository !== 'object') {
    throw new Error('Month journal application requires a repository object.');
  }

  async function getOrCreateMonth(monthId) {
    const existingMonth = await repository.months.getById(monthId);

    if (existingMonth) {
      return existingMonth;
    }

    const { year, month } = parseMonthId(monthId);
    const createdMonth = createMonth({ id: monthId, year, month });

    await repository.months.save(createdMonth);

    return createdMonth;
  }

  async function loadMonthJournal(monthId) {
    const month = await getOrCreateMonth(monthId);
    const journal = await repository.journals.getByMonthId(monthId);

    return {
      month,
      journal: journal ?? null,
    };
  }

  async function getMonthJournal(monthId) {
    return loadMonthJournal(monthId);
  }

  async function saveMonthJournal(monthId, notes) {
    const month = await getOrCreateMonth(monthId);
    const existingJournal = await repository.journals.getByMonthId(monthId);

    const journal = createJournal({
      monthId,
      notes,
      createdAt: existingJournal?.createdAt,
      updatedAt: existingJournal ? new Date() : undefined,
    });

    await repository.journals.save(journal);

    return {
      month,
      journal,
    };
  }

  return {
    getOrCreateMonth,
    getMonthJournal,
    loadMonthJournal,
    saveMonthJournal,
    getCurrentMonthId,
    shiftMonthId,
    formatMonthLabel,
  };
}