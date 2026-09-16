import assert from 'node:assert/strict';
import test from 'node:test';

import { useAppStore } from '../../src/store/useAppStore.js';

test('settings navigation preserves the selected month', () => {
  useAppStore.setState({
    activeView: 'dashboard',
    previousPrimaryView: 'dashboard',
    selectedMonthId: '2026-09',
  });

  useAppStore.getState().openSettings();

  assert.equal(useAppStore.getState().activeView, 'settings');
  assert.equal(useAppStore.getState().previousPrimaryView, 'dashboard');
  assert.equal(useAppStore.getState().selectedMonthId, '2026-09');

  useAppStore.getState().goBackFromSettings();

  assert.equal(useAppStore.getState().activeView, 'dashboard');
  assert.equal(useAppStore.getState().selectedMonthId, '2026-09');
});