import { createMonthJournalApplication } from './monthJournal.js';
import { createMonthIncomeApplication } from './monthIncome.js';
import { createMonthOverviewApplication } from './monthOverview.js';
import { createMonthTransactionApplication } from './monthTransaction.js';
import { dexieFinanceRepository } from '../persistence/dexie/index.js';

export const monthJournalApplication = createMonthJournalApplication(dexieFinanceRepository);
export const monthIncomeApplication = createMonthIncomeApplication(dexieFinanceRepository);
export const monthTransactionApplication = createMonthTransactionApplication(dexieFinanceRepository);
export const monthOverviewApplication = createMonthOverviewApplication(dexieFinanceRepository);