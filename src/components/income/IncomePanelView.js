import { createElement } from 'react';

import { formatCalendarDate, formatCurrencyAmount } from '../../lib/format.js';
import { CategorySelector } from '../category/CategorySelector.js';

const e = createElement;

export function IncomePanelView({
  monthLabel,
  incomes,
  totalIncome,
  isLoading,
  errorMessage,
  isFormOpen,
  formMode,
  formValues,
  isMutating,
  onOpenAdd,
  onEditIncome,
  onDeleteIncome,
  onSubmit,
  onCancel,
  onFieldChange,
  activeCategories,
  categoryById,
}) {
  if (isLoading) {
    return e(
      'section',
      { className: 'grid min-h-[22rem] place-items-center rounded-[1.75rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-6 py-8 text-center sm:px-10 sm:py-12' },
      e(
        'div',
        { className: 'max-w-xl' },
        e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Income'),
        e('h2', { className: 'mt-3 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl' }, `Opening ${monthLabel}`),
        e('p', { className: 'mt-4 text-sm leading-6 text-[color:var(--text-secondary)] sm:text-base' }, 'Loading income for this month.'),
      ),
    );
  }

  return e(
    'section',
    { className: 'space-y-5' },
    e(
      'div',
      { className: 'rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-5 py-6 sm:rounded-[1.75rem] sm:px-8 sm:py-8' },
      e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Income'),
      e('h2', { className: 'mt-3 text-xl font-semibold tracking-tight text-[color:var(--text-primary)] sm:text-3xl' }, monthLabel),
      e('p', { className: 'mt-3 max-w-2xl text-sm leading-6 text-[color:var(--text-secondary)] sm:mt-4 sm:text-base' }, 'Record what came in this month. Keep it simple.'),
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
          e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, 'Monthly total'),
          e('p', { className: 'mt-2 text-2xl font-semibold tracking-tight text-[color:var(--text-primary)]' }, formatCurrencyAmount(totalIncome)),
        ),
        e('button', { type: 'button', onClick: onOpenAdd, className: 'inline-flex items-center justify-center rounded-full bg-[color:var(--accent)] px-4 py-2 text-sm font-medium text-white transition hover:opacity-95' }, '+ Add income'),
      ),
      incomes.length === 0
        ? e(
            'div',
            { className: 'mt-6 rounded-[1.5rem] border border-dashed border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-5 py-8 text-center' },
            e('p', { className: 'text-lg font-medium text-[color:var(--text-primary)]' }, 'No income recorded yet.'),
            e('p', { className: 'mt-2 text-sm leading-6 text-[color:var(--text-secondary)]' }, 'Add something when you’re ready.'),
          )
        : e(
            'div',
            { className: 'mt-6 divide-y divide-[color:var(--border-subtle)] overflow-hidden rounded-[1.5rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)]' },
            ...incomes.map((income) =>
              e(
                'article',
                { key: income.id, className: 'flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between' },
                e(
                  'div',
                  { className: 'min-w-0' },
                  e('h3', { className: 'truncate text-sm font-medium text-[color:var(--text-primary)] sm:text-base' }, income.description),
                  e(
                    'p',
                    { className: 'mt-1 text-xs text-[color:var(--text-muted)] sm:text-sm' },
                    `${formatCalendarDate(income.date)}${income.categoryId ? ` · ${categoryById[income.categoryId]?.name ?? 'Archived category'}` : ' · No category'}`,
                  ),
                ),
                e(
                  'div',
                  { className: 'flex items-center justify-between gap-3 sm:justify-end' },
                  e('p', { className: 'text-sm font-semibold text-[color:var(--text-primary)] sm:text-base' }, formatCurrencyAmount(income.amount)),
                  e(
                    'div',
                    { className: 'flex items-center gap-2' },
                    e('button', { type: 'button', onClick: () => onEditIncome(income), disabled: isMutating, className: 'rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface-soft)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-primary)] transition hover:bg-[color:var(--surface)] disabled:cursor-not-allowed disabled:opacity-50' }, 'Edit'),
                    e('button', { type: 'button', onClick: () => onDeleteIncome(income), disabled: isMutating, className: 'rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-800 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50' }, 'Delete'),
                  ),
                ),
              ),
            ),
          ),
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
              e('p', { className: 'text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-muted)]' }, formMode === 'edit' ? 'Edit income' : 'Add income'),
              e('h3', { className: 'mt-2 text-xl font-semibold tracking-tight text-[color:var(--text-primary)]' }, formMode === 'edit' ? 'Update this entry' : 'Add a new entry'),
            ),
            e('button', { type: 'button', onClick: onCancel, className: 'rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-3 py-1.5 text-sm font-medium text-[color:var(--text-secondary)] transition hover:text-[color:var(--text-primary)]' }, 'Cancel'),
          ),
          e(
            'div',
            { className: 'mt-5 grid gap-4' },
            e(
              'label',
              { className: 'grid gap-2 text-sm font-medium text-[color:var(--text-primary)]', htmlFor: 'income-description' },
              'Description',
              e('input', {
                id: 'income-description',
                name: 'description',
                type: 'text',
                value: formValues.description,
                onChange: (event) => onFieldChange('description', event.target.value),
                required: true,
                className: 'rounded-[1rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)]',
              }),
            ),
            e(
              'label',
              { className: 'grid gap-2 text-sm font-medium text-[color:var(--text-primary)]', htmlFor: 'income-amount' },
              'Amount',
              e('input', {
                id: 'income-amount',
                name: 'amount',
                type: 'number',
                inputMode: 'decimal',
                min: '0.01',
                step: '0.01',
                value: formValues.amount,
                onChange: (event) => onFieldChange('amount', event.target.value),
                required: true,
                className: 'rounded-[1rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--text-primary)] outline-none transition placeholder:text-[color:var(--text-muted)] focus:border-[color:var(--accent)]',
              }),
            ),
            e(
              'label',
              { className: 'grid gap-2 text-sm font-medium text-[color:var(--text-primary)]', htmlFor: 'income-date' },
              'Date',
              e('input', {
                id: 'income-date',
                name: 'date',
                type: 'date',
                value: formValues.date,
                onChange: (event) => onFieldChange('date', event.target.value),
                required: true,
                className: 'rounded-[1rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--text-primary)] outline-none transition focus:border-[color:var(--accent)]',
              }),
            ),
            e(CategorySelector, {
              label: 'Category',
              categories: activeCategories,
              value: formValues.categoryId,
              onChange: (nextCategoryId) => onFieldChange('categoryId', nextCategoryId),
              allowNone: true,
              noneLabel: 'No category',
              id: 'income-category',
              selectedCategoryLabel:
                formValues.categoryId && categoryById[formValues.categoryId]
                  ? `${categoryById[formValues.categoryId].name} (archived)`
                  : '',
            }),
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