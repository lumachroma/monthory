const currencyFormatter = new Intl.NumberFormat('en-MY', {
  style: 'currency',
  currency: 'MYR',
  maximumFractionDigits: 0,
});

export function formatCurrencyAmount(amount) {
  return currencyFormatter.format(amount).replace(/^MYR\s?/, 'RM');
}

export function formatCalendarDate(dateValue) {
  const date = new Date(`${dateValue}T00:00:00Z`);

  return date.toLocaleDateString('en-MY', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export function getTodayDateInputValue(referenceDate = new Date()) {
  const year = referenceDate.getFullYear();
  const month = String(referenceDate.getMonth() + 1).padStart(2, '0');
  const day = String(referenceDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}