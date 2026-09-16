export function MonthJournalEditor({
  monthLabel,
  notes,
  onNotesChange,
  onSave,
  isLoading,
  isSaving,
  errorMessage,
  hasJournal,
}) {
  if (isLoading) {
    return (
      <section className="grid min-h-[22rem] place-items-center rounded-[1.75rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-6 py-8 text-center sm:px-10 sm:py-12">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
            Journal
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">
            Opening {monthLabel}
          </h2>
          <p className="mt-4 text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base">
            Loading your journal.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-6 sm:rounded-[1.75rem] sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
          Journal
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">
          {monthLabel}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:mt-4 sm:text-base">
          {hasJournal
            ? 'Continue writing about your month.'
            : 'Nothing here yet. Start with a thought about your month.'}
        </p>
      </div>

      {errorMessage ? (
        <div
          className="rounded-[1.25rem] border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900"
          role="alert"
        >
          {errorMessage}
        </div>
      ) : null}

      <form className="space-y-4" onSubmit={onSave}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-[color:var(--text-primary)]" htmlFor="month-journal-notes">
            How was your month?
          </label>
          <textarea
            id="month-journal-notes"
            value={notes}
            onChange={(event) => onNotesChange(event.target.value)}
            placeholder="Write something about this month..."
            className="min-h-[14rem] w-full rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-4 text-base leading-7 text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)]"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </section>
  );
}