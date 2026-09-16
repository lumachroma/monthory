export function renderEmptyStateSection({ eyebrow, title, description, cards, gridClassName }) {
  return (
    <section className="space-y-5">
      <div className="rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-6 sm:rounded-[1.75rem] sm:px-8 sm:py-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
          {eyebrow}
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:mt-4 sm:text-base">
          {description}
        </p>
      </div>

      <div className={`grid grid-cols-1 gap-3 sm:gap-4 ${gridClassName}`}>
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-[1.25rem] border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-4 py-5 sm:rounded-[1.5rem] sm:px-6 sm:py-7"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-muted)]">
              Empty state
            </p>
            <h3 className="mt-2.5 text-base font-semibold tracking-tight text-[color:var(--text-primary)] sm:mt-3 sm:text-lg">
              {card.title}
            </h3>
            <p className="mt-2.5 text-sm leading-6 text-[color:var(--text-secondary)] sm:mt-3">
              {card.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}