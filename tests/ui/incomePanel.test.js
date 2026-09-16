import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { IncomePanelView } from '../../src/components/income/IncomePanelView.js';

test('income empty state renders calmly', () => {
  const markup = renderToStaticMarkup(
    React.createElement(IncomePanelView, {
      monthLabel: 'September 2026',
      incomes: [],
      totalIncome: 0,
      isLoading: false,
      errorMessage: '',
      isFormOpen: false,
      formMode: 'add',
      formValues: { description: '', amount: '', date: '2026-09-16' },
      isMutating: false,
      onOpenAdd: () => {},
      onEditIncome: () => {},
      onDeleteIncome: () => {},
      onSubmit: () => {},
      onCancel: () => {},
      onFieldChange: () => {},
    }),
  );

  assert.match(markup, /No income recorded yet\./);
  assert.match(markup, /Add something when you’re ready\./);
  assert.match(markup, /RM\s?0/);
});

test('income list renders entries and total', () => {
  const markup = renderToStaticMarkup(
    React.createElement(IncomePanelView, {
      monthLabel: 'September 2026',
      incomes: [
        { id: 'income-1', description: 'Salary', date: '2026-09-05', amount: 12000 },
        { id: 'income-2', description: 'Freelance', date: '2026-09-15', amount: 800 },
      ],
      totalIncome: 12800,
      isLoading: false,
      errorMessage: '',
      isFormOpen: false,
      formMode: 'add',
      formValues: { description: '', amount: '', date: '2026-09-16' },
      isMutating: false,
      onOpenAdd: () => {},
      onEditIncome: () => {},
      onDeleteIncome: () => {},
      onSubmit: () => {},
      onCancel: () => {},
      onFieldChange: () => {},
    }),
  );

  assert.match(markup, /Salary/);
  assert.match(markup, /Freelance/);
  assert.match(markup, /RM\s?12,000/);
  assert.match(markup, /RM\s?800/);
  assert.match(markup, /RM\s?12,800/);
});