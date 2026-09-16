import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { TransactionPanelView } from '../../src/components/transaction/TransactionPanelView.js';

test('transaction empty state renders calmly', () => {
  const markup = renderToStaticMarkup(
    React.createElement(TransactionPanelView, {
      monthLabel: 'September 2026',
      transactions: [],
      totalSpending: 0,
      isLoading: false,
      errorMessage: '',
      isFormOpen: false,
      formMode: 'add',
      formValues: { description: '', amount: '', date: '2026-09-16' },
      isMutating: false,
      onOpenAdd: () => {},
      onEditTransaction: () => {},
      onDeleteTransaction: () => {},
      onSubmit: () => {},
      onCancel: () => {},
      onFieldChange: () => {},
    }),
  );

  assert.match(markup, /Nothing recorded yet\./);
  assert.match(markup, /Add something when you’re ready\./);
  assert.match(markup, /RM\s?0/);
});

test('transaction list renders entries and total', () => {
  const markup = renderToStaticMarkup(
    React.createElement(TransactionPanelView, {
      monthLabel: 'September 2026',
      transactions: [
        { id: 'tx-1', description: 'Groceries', date: '2026-09-05', amount: 180 },
        { id: 'tx-2', description: 'Petrol', date: '2026-09-15', amount: 80 },
      ],
      totalSpending: 260,
      isLoading: false,
      errorMessage: '',
      isFormOpen: false,
      formMode: 'add',
      formValues: { description: '', amount: '', date: '2026-09-16' },
      isMutating: false,
      onOpenAdd: () => {},
      onEditTransaction: () => {},
      onDeleteTransaction: () => {},
      onSubmit: () => {},
      onCancel: () => {},
      onFieldChange: () => {},
    }),
  );

  assert.match(markup, /Groceries/);
  assert.match(markup, /Petrol/);
  assert.match(markup, /RM\s?180/);
  assert.match(markup, /RM\s?80/);
  assert.match(markup, /RM\s?260/);
});