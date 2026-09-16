import { create } from 'zustand';

import { getCurrentMonthId, shiftMonthId } from '../application/monthJournal.js';

export const useAppStore = create((set) => ({
  shellReady: true,
  activeView: 'dashboard',
  previousPrimaryView: 'dashboard',
  selectedMonthId: getCurrentMonthId(),
  setActiveView: (activeView) => set({ activeView }),
  openSettings: () =>
    set((state) => ({
      previousPrimaryView: state.activeView === 'settings' ? state.previousPrimaryView : state.activeView,
      activeView: 'settings',
    })),
  goBackFromSettings: () =>
    set((state) => ({
      activeView: state.previousPrimaryView,
    })),
  setSelectedMonthId: (selectedMonthId) => set({ selectedMonthId }),
  goToPreviousMonth: () =>
    set((state) => ({
      selectedMonthId: shiftMonthId(state.selectedMonthId, -1),
    })),
  goToNextMonth: () =>
    set((state) => ({
      selectedMonthId: shiftMonthId(state.selectedMonthId, 1),
    })),
}));