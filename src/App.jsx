import { useAppStore } from './store/useAppStore';

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
    <main className="min-h-screen px-4 py-4 text-[color:var(--text-primary)] sm:px-6 sm:py-6">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-stretch">
        <div className="flex w-full flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] shadow-[0_28px_90px_-42px_rgba(60,43,28,0.34)]">
          <header className="border-b border-[color:var(--border-subtle)] px-5 py-5 sm:px-8 sm:py-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] text-[color:var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  <span className="text-lg font-semibold tracking-[-0.08em]">M</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-[0.32em] text-[color:var(--text-muted)]">
                    Monthory
                  </p>
                  <h1 className="mt-1 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">
                    Your financial journal
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] p-1 self-start lg:self-auto">
                <button
                  type="button"
                  onClick={() => setActiveView('dashboard')}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
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
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                    activeView === 'journal'
                      ? 'bg-[color:var(--surface)] text-[color:var(--text-primary)] shadow-sm'
                      : 'text-[color:var(--text-secondary)]'
                  }`}
                >
                  Journal
                </button>
              </div>
            </div>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
              A calm, private foundation for monthly financial reflection. The shell is in place;
              the journal and dashboard will follow in later stages.
            </p>

            <div className="mt-5 flex flex-col gap-3 rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                  Month selector
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-[color:var(--text-primary)]">
                  {selectedMonth.label}
                </h2>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={goToPreviousMonth}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                  aria-label="Previous month"
                >
                  &lt;
                </button>
                <select
                  value={selectedMonthKey}
                  onChange={(event) => setSelectedMonthKey(event.target.value)}
                  className="min-w-0 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-2 text-sm font-medium text-[color:var(--text-primary)] outline-none"
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]"
                  aria-label="Next month"
                >
                  &gt;
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 px-5 py-6 sm:px-8 sm:py-8">
            <section className="grid min-h-[22rem] place-items-center rounded-[1.75rem] border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-6 py-8 text-center sm:px-10 sm:py-12">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                  {activeView === 'dashboard' ? 'Dashboard page' : 'Journal page'}
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">
                  {activeView === 'dashboard' ? 'No monthly insights yet' : 'No journal entries yet'}
                </h2>
                <p className="mt-4 text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
                  {activeView === 'dashboard'
                    ? 'This will hold the monthly summary surface once financial data is introduced.'
                    : 'This will become the monthly writing space once journal content is introduced.'}
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}