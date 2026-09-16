import { createElement, useEffect, useMemo, useState } from 'react';

import { monthJournalApplication } from './application/index.js';
import { useAppStore } from './store/useAppStore';
import { renderEmptyStateSection } from './components/ui/EmptyStateSection';
import { MonthJournalEditor } from './components/journal/MonthJournalEditor';
import { MonthIncomePanel } from './components/income/MonthIncomePanel.jsx';

export default function App() {
  const {
    activeView,
    goToNextMonth,
    goToPreviousMonth,
    selectedMonthId,
    setActiveView,
  } = useAppStore();

  const [journalState, setJournalState] = useState({ month: null, journal: null });
  const [notes, setNotes] = useState('');
  const [isLoadingJournal, setIsLoadingJournal] = useState(true);
  const [isSavingJournal, setIsSavingJournal] = useState(false);
  const [journalError, setJournalError] = useState('');

  const selectedMonthLabel = useMemo(
    () => monthJournalApplication.formatMonthLabel(selectedMonthId),
    [selectedMonthId],
  );

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
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeView === 'dashboard'
                      ? 'bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-sm'
                      : 'text-[color:var(--text-secondary)]'
                  }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView('journal')}
                  className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeView === 'journal'
                      ? 'bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-sm'
                      : 'text-[color:var(--text-secondary)]'
                  }`}
                >
                  Journal
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
              createElement(MonthIncomePanel, { monthId: selectedMonthId, monthLabel: selectedMonthLabel })
            ) : (
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