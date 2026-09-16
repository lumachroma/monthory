import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CategorySelector } from '../../src/components/category/CategorySelector.js';

test('category selector renders active categories and no-category option', () => {
  const markup = renderToStaticMarkup(
    React.createElement(CategorySelector, {
      label: 'Category',
      categories: [
        { id: 'cat_food', name: 'Food' },
        { id: 'cat_transport', name: 'Transport' },
      ],
      value: 'cat_food',
      onChange: () => {},
      allowNone: true,
      noneLabel: 'No category',
    }),
  );

  assert.match(markup, /No category/);
  assert.match(markup, /Food/);
  assert.match(markup, /Transport/);
});

test('category selector does not render archived categories when they are omitted', () => {
  const markup = renderToStaticMarkup(
    React.createElement(CategorySelector, {
      label: 'Category',
      categories: [{ id: 'cat_food', name: 'Food' }],
      value: '',
      onChange: () => {},
      allowNone: true,
    }),
  );

  assert.doesNotMatch(markup, /Archived/);
});

test('category selector shows the current archived category label when selected', () => {
  const markup = renderToStaticMarkup(
    React.createElement(CategorySelector, {
      label: 'Category',
      categories: [{ id: 'cat_food', name: 'Food' }],
      value: 'cat_archived',
      selectedCategoryLabel: 'Travel (archived)',
      onChange: () => {},
      allowNone: true,
    }),
  );

  assert.match(markup, /Travel \(archived\)/);
});