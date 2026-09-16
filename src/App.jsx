import { useAppStore } from './store/useAppStore';
import { renderEmptyStateSection } from './components/ui/EmptyStateSection';

export default function App() {
  const {
    activeView,
    goToNextMonth,
    goToPreviousMonth,
    monthOptions,
    selectedMonthKey,
    setActiveView,
    setSelectedMonthKey,
  } = useAppStore();

  const selectedMonth = monthOptions.find((option) => option.key === selectedMonthKey) ?? monthOptions[2];

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
                  Dashboard
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

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:mt-4 sm:text-base">
              A calm, private foundation for monthly financial reflection. The shell is in place;
              the journal and dashboard will follow in later stages.
            </p>

            <div className="mt-4 flex flex-col gap-3 rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] p-3.5 sm:mt-5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)] sm:text-xs sm:tracking-[0.28em]">
                  Month selector
                </p>
                <h2 className="mt-1 text-base font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-lg">
                  {selectedMonth.label}
                </h2>
              </div>

              <div className="flex w-full items-center gap-2 self-start sm:w-auto sm:self-auto">
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                  aria-label="Previous month"
                >
                  &lt;
                </button>
                <select
                  value={selectedMonthKey}
                  onChange={(event) => setSelectedMonthKey(event.target.value)}
                  className="min-w-0 flex-1 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-2 text-sm font-medium text-[color:var(--text-primary)] outline-none sm:flex-none sm:min-w-52"
                >
                  {monthOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={goToNextMonth}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                  aria-label="Next month"
                >
                  &gt;
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 px-4 py-5 sm:px-8 sm:py-8">
            {activeView === 'dashboard' ? (
              renderEmptyStateSection({
                eyebrow: 'Dashboard page',
                title: 'No monthly insights yet',
                description: `The dashboard will eventually summarize ${selectedMonth.label} with calm, glanceable context. For now it stays empty and non-judgmental.`,
                cards: [
                  {
                    title: 'Monthly snapshot',
                    description: 'A quiet summary of the month will appear here once journal data exists.',
                  },
                  {
                    title: 'Trend view',
                    description: 'This space will surface simple directional context instead of dense reporting.',
                  },
                  {
                    title: 'Reflection cues',
                    description: 'Short prompts and gentle reminders can live here without overwhelming the page.',
                  },
                ],
                gridClassName: 'lg:grid-cols-3',
              })
            ) : (
              renderEmptyStateSection({
                eyebrow: 'Journal page',
                title: 'No journal entries yet',
                description: `The journal will eventually hold notes for ${selectedMonth.label}. For now it is only a quiet page shell.`,
                cards: [
                  {
                    title: 'Daily note area',
                    description: 'A small writing surface will appear here once monthly journaling begins.',
                  },
                  {
                    title: 'Recent entries',
                    description: 'This panel will later list entries in a calm, scannable way.',
                  },
                  {
                    title: 'Writing prompts',
                    description: 'Gentle questions can support reflection without turning the app into a form.',
                  },
                ],
                gridClassName: 'md:grid-cols-2 xl:grid-cols-3',
              })
            )}
          </div>
        </div>
      </section>
    </main>
  );
}