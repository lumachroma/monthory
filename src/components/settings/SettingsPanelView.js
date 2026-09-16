import { createElement } from 'react';

const e = createElement;

function renderSettingsRoot({ backLabel, onBack, onOpenCategories }) {
  return e(
    'section',
    { className: 'space-y-5' },
    e(
      'div',
      { className: 'flex items-start justify-between gap-4 rounded-[1.75rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-5 sm:px-6 sm:py-6' },
      e(
        'div',
        null,
        e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Settings'),
        e('h2', { className: 'mt-2 text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl' }, 'Quiet setup'),
        e('p', { className: 'mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base' }, 'Small preferences that help Monthory stay out of the way.'),
      ),
      e(
        'button',
        {
          type: 'button',
          onClick: onBack,
          'aria-label': backLabel,
          className: 'rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]',
        },
        '← Back',
      ),
    ),
    e(
      'button',
      {
        type: 'button',
        onClick: onOpenCategories,
        className:
          'flex w-full flex-col gap-2 rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-5 text-left transition hover:bg-[color:var(--surface)] sm:px-6 sm:py-6',
      },
      e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Categories'),
      e('h3', { className: 'text-lg font-semibold tracking-tight text-[color:var(--text-primary)]' }, 'Manage how you label your spending'),
      e('p', { className: 'max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)]' }, 'Keep your category vocabulary tidy without turning Monthory into a settings app.'),
    ),
  );
}

function renderCategoriesScreen({ onBack, children }) {
  return e(
    'section',
    { className: 'space-y-5' },
    e(
      'div',
      { className: 'flex items-start justify-between gap-4 rounded-[1.75rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-5 sm:px-6 sm:py-6' },
      e(
        'div',
        null,
        e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Settings'),
        e('h2', { className: 'mt-2 text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl' }, 'Categories'),
        e('p', { className: 'mt-3 max-w-xl text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base' }, 'Manage how you label your spending.'),
      ),
      e(
        'button',
        {
          type: 'button',
          onClick: onBack,
          'aria-label': 'Back to settings',
          className: 'rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]',
        },
        '← Settings',
      ),
    ),
    children,
  );
}

export function SettingsPanelView({ mode, backLabel, onBack, onOpenCategories, children }) {
  if (mode === 'categories') {
    return renderCategoriesScreen({ onBack, children });
  }

  return renderSettingsRoot({ backLabel, onBack, onOpenCategories });
}