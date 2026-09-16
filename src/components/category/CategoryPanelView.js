import { createElement } from 'react';

const e = createElement;

function renderCategoryRow(category, { onEditCategory, onArchiveCategory, isMutating, archived }) {
  return e(
    'article',
    {
      key: category.id,
      className:
        'flex flex-col gap-3 rounded-[1.25rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between',
    },
    e(
      'div',
      null,
      e('h3', { className: 'text-sm font-medium text-[color:var(--text-primary)] sm:text-base' }, category.name),
      e(
        'p',
        { className: 'mt-1 text-xs text-[color:var(--text-muted)] sm:text-sm' },
        archived ? 'Archived category' : 'Active category',
      ),
    ),
    e(
      'div',
      { className: 'flex items-center gap-2' },
      e(
        'button',
        {
          type: 'button',
          onClick: () => onEditCategory(category),
          disabled: isMutating,
          className:
            'rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface)] disabled:cursor-not-allowed disabled:opacity-50',
        },
        'Rename',
      ),
      archived
        ? null
        : e(
            'button',
            {
              type: 'button',
              onClick: () => onArchiveCategory(category),
              disabled: isMutating,
              className:
                'rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50',
            },
            'Archive',
          ),
    ),
  );
}

export function CategoryPanelView({
  activeCategories,
  archivedCategories,
  isLoading,
  errorMessage,
  isFormOpen,
  formMode,
  formValues,
  isMutating,
  onOpenAdd,
  onEditCategory,
  onArchiveCategory,
  onSubmit,
  onCancel,
  onFieldChange,
}) {
  if (isLoading) {
    return e(
      'section',
      { className: 'grid min-h-[16rem] place-items-center rounded-[1.75rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-6 py-8 text-center sm:px-10 sm:py-12' },
      e(
        'div',
        { className: 'max-w-xl' },
        e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Categories'),
        e('h2', { className: 'mt-3 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl' }, 'Loading categories'),
        e('p', { className: 'mt-4 text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base' }, 'Loading starter categories and your custom categories.'),
      ),
    );
  }

  return e(
    'section',
    { className: 'space-y-5' },
    e(
      'div',
      { className: 'rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-6 sm:rounded-[1.75rem] sm:px-8 sm:py-8' },
      e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Categories'),
      e('h2', { className: 'mt-3 text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl' }, 'Where did the money go?'),
      e('p', { className: 'mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:mt-4 sm:text-base' }, 'Categories give a little context without turning Monthory into a budgeting app.'),
    ),
    errorMessage
      ? e('div', { className: 'rounded-[1.25rem] border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900', role: 'alert' }, errorMessage)
      : null,
    e(
      'div',
      { className: 'rounded-[1.75rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-5 sm:px-6 sm:py-6' },
      e(
        'div',
        { className: 'flex items-center justify-between gap-3' },
        e(
          'div',
          null,
          e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Active categories'),
          e('p', { className: 'mt-2 text-sm text-[color:var(--text-secondary)]' }, `${activeCategories.length} active`),
        ),
        e('button', { type: 'button', onClick: onOpenAdd, className: 'inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95' }, '+ Add category'),
      ),
      e(
        'div',
        { className: 'mt-5 grid gap-3' },
        ...activeCategories.map((category) => renderCategoryRow(category, { onEditCategory, onArchiveCategory, isMutating, archived: false })),
      ),
      archivedCategories.length > 0
        ? e(
            'div',
            { className: 'mt-6 space-y-3' },
            e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Archived categories'),
            ...archivedCategories.map((category) => renderCategoryRow(category, { onEditCategory, onArchiveCategory, isMutating, archived: true })),
          )
        : null,
    ),
    isFormOpen
      ? e(
          'form',
          { onSubmit, className: 'rounded-[1.75rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-5 sm:px-6 sm:py-6' },
          e(
            'div',
            { className: 'flex items-start justify-between gap-4' },
            e(
              'div',
              null,
              e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, formMode === 'edit' ? 'Rename category' : 'Add category'),
              e('h3', { className: 'mt-2 text-xl font-semibold tracking-tight text-[color:var(--text-primary)]' }, formMode === 'edit' ? 'Update this label' : 'Create a new label'),
            ),
            e('button', { type: 'button', onClick: onCancel, className: 'rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]' }, 'Cancel'),
          ),
          e(
            'div',
            { className: 'mt-5 grid gap-4' },
            e(
              'label',
              { className: 'grid gap-2 text-sm font-medium text-[color:var(--text-primary)]', htmlFor: 'category-name' },
              'Name',
              e('input', {
                id: 'category-name',
                name: 'name',
                type: 'text',
                value: formValues.name,
                onChange: (event) => onFieldChange('name', event.target.value),
                required: true,
                className: 'rounded-[1rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)]',
              }),
            ),
            e(
              'div',
              { className: 'flex justify-end gap-3 pt-2' },
              e('button', { type: 'button', onClick: onCancel, className: 'rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-2.5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]' }, 'Cancel'),
              e('button', { type: 'submit', disabled: isMutating, className: 'rounded-full bg-[color:var(--accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60' }, isMutating ? 'Saving...' : 'Save'),
            ),
          ),
        )
      : null,
  );
}