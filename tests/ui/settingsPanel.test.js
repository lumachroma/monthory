import assert from 'node:assert/strict';
import test from 'node:test';

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { SettingsPanelView } from '../../src/components/settings/SettingsPanelView.js';

test('settings panel renders a secondary categories entry point', () => {
  const markup = renderToStaticMarkup(
    React.createElement(SettingsPanelView, {
      mode: 'root',
      backLabel: 'Back to overview',
      onBack: () => {},
      onOpenCategories: () => {},
      children: null,
    }),
  );

  assert.match(markup, /Settings/);
  assert.match(markup, /Categories/);
  assert.match(markup, /Manage how you label your spending/);
  assert.match(markup, /aria-label="Back to overview"/);
});

test('categories screen renders a labelled back control', () => {
  const markup = renderToStaticMarkup(
    React.createElement(SettingsPanelView, {
      mode: 'categories',
      backLabel: 'Back to overview',
      onBack: () => {},
      onOpenCategories: () => {},
      children: React.createElement('div', null, 'Category manager'),
    }),
  );

  assert.match(markup, /← Settings/);
  assert.match(markup, /aria-label="Back to settings"/);
  assert.match(markup, /Category manager/);
});