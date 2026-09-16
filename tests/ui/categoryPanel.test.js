import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CategoryPanelView } from '../../src/components/category/CategoryPanelView.js';

test('category panel renders active and archived categories', () => {
  const markup = renderToStaticMarkup(
    React.createElement(CategoryPanelView, {
      activeCategories: [
        { id: 'cat_food', name: 'Food' },
        { id: 'cat_transport', name: 'Transport' },
      ],
      archivedCategories: [{ id: 'cat_old', name: 'Old Stuff', archived: true }],
      isLoading: false,
      errorMessage: '',
      isFormOpen: false,
      formMode: 'add',
      formValues: { name: '' },
      isMutating: false,
      onOpenAdd: () => {},
      onEditCategory: () => {},
      onArchiveCategory: () => {},
      onSubmit: () => {},
      onCancel: () => {},
      onFieldChange: () => {},
    }),
  );

  assert.match(markup, /Food/);
  assert.match(markup, /Transport/);
  assert.match(markup, /Old Stuff/);
  assert.match(markup, /Archived categories/);
});

test('category panel shows the add form when opened', () => {
  const markup = renderToStaticMarkup(
    React.createElement(CategoryPanelView, {
      activeCategories: [],
      archivedCategories: [],
      isLoading: false,
      errorMessage: '',
      isFormOpen: true,
      formMode: 'add',
      formValues: { name: 'Kids activities' },
      isMutating: false,
      onOpenAdd: () => {},
      onEditCategory: () => {},
      onArchiveCategory: () => {},
      onSubmit: () => {},
      onCancel: () => {},
      onFieldChange: () => {},
    }),
  );

  assert.match(markup, /Add category/);
  assert.match(markup, /Kids activities/);
});