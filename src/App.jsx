export default function App() {
  return (
    <main className="min-h-screen px-4 py-4 text-[color:var(--text-primary)] sm:px-6 sm:py-6">
      <section className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl items-stretch">
        <div className="flex w-full flex-col overflow-hidden rounded-[2rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] shadow-[0_28px_90px_-42px_rgba(60,43,28,0.34)]">
          <header className="border-b border-[color:var(--border-subtle)] px-5 py-5 sm:px-8 sm:py-6">
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

            <p className="mt-4 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
              A calm, private foundation for monthly financial reflection. The shell is in place;
              the journal and dashboard will follow in later stages.
            </p>
          </header>

          <div className="grid flex-1 place-items-center px-5 py-10 sm:px-8 sm:py-14">
            <div className="max-w-xl rounded-[1.75rem] border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-6 py-8 text-center sm:px-8 sm:py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                Application layout
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">
                Foundation ready
              </h2>
              <p className="mt-4 text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
                This stage establishes the app frame and identity only. Navigation, month selector,
                pages, and data work are intentionally left for the next steps.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}