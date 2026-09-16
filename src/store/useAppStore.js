import { create } from 'zustand';

function getMonthKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');

  return `${year}-${month}`;
}

function shiftMonth(date, offset) {
  const shiftedDate = new Date(date.getFullYear(), date.getMonth() + offset, 1);

  return getMonthKey(shiftedDate);
}

const currentMonth = new Date();
const monthOptions = [-2, -1, 0, 1, 2].map((offset) => {
  const monthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);

  return {
    key: getMonthKey(monthDate),
    label: monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
  };
});

export const useAppStore = create((set) => ({
  shellReady: true,
  activeView: 'dashboard',
  selectedMonthKey: getMonthKey(currentMonth),
  monthOptions,
  setActiveView: (activeView) => set({ activeView }),
  setSelectedMonthKey: (selectedMonthKey) => set({ selectedMonthKey }),
  goToPreviousMonth: () =>
    set((state) => ({
      selectedMonthKey: shiftMonth(new Date(`${state.selectedMonthKey}-01T00:00:00`), -1),
    })),
  goToNextMonth: () =>
    set((state) => ({
      selectedMonthKey: shiftMonth(new Date(`${state.selectedMonthKey}-01T00:00:00`), 1),
    })),
}));