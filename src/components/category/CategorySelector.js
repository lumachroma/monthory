import { createElement } from 'react';

const e = createElement;

export function CategorySelector({
  label = 'Category',
  categories,
  value = '',
  onChange,
  allowNone = true,
  noneLabel = 'No category',
  id = 'category-selector',
}) {
  return e(
    'label',
    { className: 'grid gap-2 text-sm font-medium text-[color:var(--text-primary)]', htmlFor: id },
    label,
    e(
      'select',
      {
        id,
        value,
        onChange: (event) => onChange(event.target.value),
        className: 'rounded-[1rem] border border-[color:var(--border-subtle)] bg-[color:var(--surface)] px-4 py-3 text-base text-[color:var(--text-primary)] outline-none transition focus:border-[color:var(--accent)]',
      },
      allowNone ? e('option', { value: '' }, noneLabel) : null,
      ...categories.map((category) => e('option', { key: category.id, value: category.id }, category.name)),
    ),
  );
}