import { createMonthJournalApplication } from './monthJournal.js';
import { dexieFinanceRepository } from '../persistence/dexie/index.js';

export const monthJournalApplication = createMonthJournalApplication(dexieFinanceRepository);