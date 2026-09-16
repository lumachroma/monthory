import { createMonthJournalApplication } from './monthJournal.js';
import { createMonthIncomeApplication } from './monthIncome.js';
import { dexieFinanceRepository } from '../persistence/dexie/index.js';

export const monthJournalApplication = createMonthJournalApplication(dexieFinanceRepository);
export const monthIncomeApplication = createMonthIncomeApplication(dexieFinanceRepository);