import { create } from 'zustand';

import { getCurrentMonthId, shiftMonthId } from '../application/monthJournal.js';

export const useAppStore = create((set) => ({
  shellReady: true,
  activeView: 'dashboard',
  selectedMonthId: getCurrentMonthId(),
  setActiveView: (activeView) => set({ activeView }),
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