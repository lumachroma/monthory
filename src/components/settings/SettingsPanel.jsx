import { createElement, useState } from 'react';

import { MonthCategoryPanel } from '../category/MonthCategoryPanel.jsx';
import { SettingsPanelView } from './SettingsPanelView.js';

export function SettingsPanel({ backLabel, onBack }) {
  const [mode, setMode] = useState('root');

  function openCategories() {
    setMode('categories');
  }

  function returnToSettings() {
    setMode('root');
  }

  return createElement(SettingsPanelView, {
    mode,
    backLabel,
    onBack: mode === 'categories' ? returnToSettings : onBack,
    onOpenCategories: openCategories,
    children: mode === 'categories' ? createElement(MonthCategoryPanel) : null,
  });
}