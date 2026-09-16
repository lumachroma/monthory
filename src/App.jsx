import { createElement, useCallback, useEffect, useMemo, useState } from 'react';

import {
  monthIncomeApplication,
  monthJournalApplication,
  monthOverviewApplication,
  monthTransactionApplication,
} from './application/index.js';
import { useAppStore } from './store/useAppStore';
import { calculateMonthlySummary } from './domain/index.js';
import { renderEmptyStateSection } from './components/ui/EmptyStateSection';
import { MonthJournalEditor } from './components/journal/MonthJournalEditor';
import { MonthIncomePanel } from './components/income/MonthIncomePanel.jsx';
import { MonthTransactionPanel } from './components/transaction/MonthTransactionPanel.jsx';
import { SettingsPanel } from './components/settings/SettingsPanel.jsx';

export default function App() {
  const {
    activeView,
    goBackFromSettings,
    goToNextMonth,
    goToPreviousMonth,
    selectedMonthId,
    openSettings,
    setActiveView,
    previousPrimaryView,
  } = useAppStore();

  const [journalState, setJournalState] = useState({ month: null, journal: null });
  const [notes, setNotes] = useState('');
  const [isLoadingJournal, setIsLoadingJournal] = useState(true);
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [journalError, setJournalError] = useState('');
  const [incomeState, setIncomeState] = useState({ incomes: [], totalIncome: 0 });
  const [transactionState, setTransactionState] = useState({ transactions: [], totalSpending: 0 });
  const [isLoadingFinancialOverview, setIsLoadingFinancialOverview] = useState(true);
  const [financialOverviewError, setFinancialOverviewError] = useState('');

  const selectedMonthLabel = useMemo(
    () => monthJournalApplication.formatMonthLabel(selectedMonthId),
    [selectedMonthId],
  );

  const monthlyFinancialSummary = useMemo(
    () => calculateMonthlySummary({ incomes: incomeState.incomes, transactions: transactionState.transactions }),
    [incomeState.incomes, transactionState.transactions],
  );

  const refreshFinancialOverview = useCallback(async () => {
    const [loadedIncomeState, loadedTransactionState, loadedSummary] = await Promise.all([
      monthIncomeApplication.listIncomeForMonth(selectedMonthId),
      monthTransactionApplication.listTransactionsForMonth(selectedMonthId),
      monthOverviewApplication.getMonthlyFinancialSummary(selectedMonthId),
    ]);

    setIncomeState({ incomes: loadedIncomeState.incomes, totalIncome: loadedSummary.totalIncome });
    setTransactionState({ transactions: loadedTransactionState.transactions, totalSpending: loadedSummary.totalSpending });
  }, [selectedMonthId]);

  useEffect(() => {
    let active = true;

    async function loadJournal() {
      setIsLoadingJournal(true);
      setJournalError('');

      try {
        const loadedJournalState = await monthJournalApplication.loadMonthJournal(selectedMonthId);

        if (!active) {
          return;
        }

        setJournalState(loadedJournalState);
        setNotes(loadedJournalState.journal?.notes ?? '');
      } catch {
        if (!active) {
          return;
        }

        setJournalError('Something went wrong opening your journal. Please try again.');
      } finally {
        if (active) {
          setIsLoadingJournal(false);
        }
      }
    }

    loadJournal();

    return () => {
      active = false;
    };
  }, [selectedMonthId]);

  useEffect(() => {
    let active = true;

    async function loadFinancialOverview() {
      setIsLoadingFinancialOverview(true);
      setFinancialOverviewError('');

      try {
        await refreshFinancialOverview();

        if (!active) {
          return;
        }
      } catch {
        if (!active) {
          return;
        }

        setFinancialOverviewError('Something went wrong opening your month overview. Please try again.');
      } finally {
        if (active) {
          setIsLoadingFinancialOverview(false);
        }
      }
    }

    loadFinancialOverview();

    return () => {
      active = false;
    };
  }, [refreshFinancialOverview]);

  async function handleJournalSave(event) {
    event.preventDefault();
    setIsSavingJournal(true);
    setJournalError('');

    try {
      const savedJournalState = await monthJournalApplication.saveMonthJournal(selectedMonthId, notes);

      setJournalState(savedJournalState);
      setNotes(savedJournalState.journal.notes);
    } catch {
      setJournalError('Something went wrong saving your journal. Please try again.');
    } finally {
      setIsSavingJournal(false);
    }
  }

  return (
    <main className="min-h-screen px-3 py-3 text-[color:var(--text-primary)] sm:px-6 sm:py-6">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-stretch">
        <div className="flex w-full flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] shadow-[0_28px_90px_-42px_rgba(60,43,28,0.34)]">
          <header className="border-b border-[color:var(--border-subtle)] px-4 py-4 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] text-[color:var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] sm:h-12 sm:w-12">
                  <span className="text-lg font-semibold tracking-[-0.08em]">M</span>
                </div>
                <div className="min-w-0">
                  <p className="text-[0.7rem] font-medium uppercase tracking-[0.28em] text-[color:var(--text-muted)] sm:text-xs sm:tracking-[0.32em]">
                    Monthory
                  </p>
                  <h1 className="mt-1 text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">
                    Your financial journal
                  </h1>
                </div>
              </div>

              <div className="grid w-full grid-cols-2 gap-2 rounded-[1.25rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] p-1 self-start sm:flex sm:w-auto sm:items-center sm:gap-2 sm:rounded-full lg:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('dashboard')}
                  aria-pressed={activeView === 'dashboard'}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeView === 'dashboard'
                      ? 'bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-sm'
                      : 'text-[color:var(--text-secondary)]'
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('journal')}
                  aria-pressed={activeView === 'journal'}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeView === 'journal'
                      ? 'bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-sm'
                      : 'text-[color:var(--text-secondary)]'
                  }`}
                >
                  Journal
                </button>

                <button
                  type="button"
                  onClick={openSettings}
                  aria-label="Open settings"
                  aria-pressed={activeView === 'settings'}
                  className={`col-span-2 inline-flex items-center justify-center gap-2 rounded-full border border-[color:var(--border-subtle)] px-4 py-2 text-sm font-medium transition hover:bg-[color:var(--surface)] sm:col-span-1 ${
                    activeView === 'settings'
                      ? 'bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-sm'
                      : 'bg-transparent text-[color:var(--text-secondary)]'
                  }`}
                >
                  Settings
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] p-3.5 sm:mt-5 sm:p-4">
              <button
                type="button"
                onClick={goToPreviousMonth}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                aria-label="Previous month"
              >
                &lt;
              </button>

              <div className="min-w-0 flex-1 text-center">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)] sm:text-xs sm:tracking-[0.28em]">
                  Current month
                </p>
                <h2 className="mt-1 text-base font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-lg">
                  {selectedMonthLabel}
                </h2>
              </div>

              <button
                type="button"
                onClick={goToNextMonth}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                aria-label="Next month"
              >
                &gt;
              </button>
            </div>
          </header>

          <div className="flex-1 px-4 py-5 sm:px-8 sm:py-8">
            {activeView === 'dashboard' ? (
              <div className="space-y-5">
                <section className="rounded-[1.75rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-5 sm:px-6 sm:py-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]">Monthly picture</p>
                  <h2 className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-2xl">
                    {selectedMonthLabel}
                  </h2>

                  {financialOverviewError ? (
                    <div className="mt-4 rounded-[1.25rem] border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900" role="alert">
                      {financialOverviewError}
                    </div>
                  ) : null}

                  {isLoadingFinancialOverview ? (
                    <p className="mt-4 text-sm leading-6 text-[color:var(--text-secondary)]">Loading summary…</p>
                  ) : (
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      <div className="rounded-[1.25rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Income</p>
                        <p className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                          RM {monthlyFinancialSummary.totalIncome.toLocaleString('en-MY')}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Spending</p>
                        <p className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                          RM {monthlyFinancialSummary.totalSpending.toLocaleString('en-MY')}
                        </p>
                      </div>
                      <div className="rounded-[1.25rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">Difference</p>
                        <p className="mt-2 text-xl font-semibold tracking-tight text-[color:var(--text-primary)]">
                          RM {monthlyFinancialSummary.netAmount.toLocaleString('en-MY')}
                        </p>
                      </div>
                    </div>
                  )}
                </section>

                {createElement(MonthIncomePanel, {
                  monthId: selectedMonthId,
                  monthLabel: selectedMonthLabel,
                  onRecordsChanged: refreshFinancialOverview,
                })}
                {createElement(MonthTransactionPanel, {
                  monthId: selectedMonthId,
                  monthLabel: selectedMonthLabel,
                  onRecordsChanged: refreshFinancialOverview,
                })}
              </div>
            ) : activeView === 'journal' ? (
              renderEmptyStateSection({
                eyebrow: 'Journal page',
                title: journalState.journal ? 'Edit your journal' : 'Nothing here yet',
                description: journalState.journal
                  ? `Continue writing about ${selectedMonthLabel}.`
                  : 'Start with a thought about your month.',
                cards: [
                  {
                    title: 'Daily note area',
                    description: 'A small writing surface will appear here once monthly journaling begins.',
                  },
                ],
                gridClassName: 'grid-cols-1',
              })
            ) : (
              createElement(SettingsPanel, {
                backLabel: previousPrimaryView === 'journal' ? 'Back to journal' : 'Back to overview',
                onBack: goBackFromSettings,
              })
            )}

            {activeView === 'journal' ? (
              <div className="mt-5">
                {MonthJournalEditor({
                  monthLabel: selectedMonthLabel,
                  notes,
                  onNotesChange: setNotes,
                  onSave: handleJournalSave,
                  isLoading: isLoadingJournal,
                  isSaving: isSavingJournal,
                  errorMessage: journalError,
                  hasJournal: Boolean(journalState.journal),
                })}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}