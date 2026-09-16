import { createElement, useEffect, useMemo, useState } from 'react';

import { monthTransactionApplication } from '../../application/index.js';
import { getTodayDateInputValue } from '../../lib/format.js';
import { TransactionPanelView } from './TransactionPanelView.js';

function createEmptyFormValues(referenceDate = new Date()) {
  return {
    description: '',
    amount: '',
    date: getTodayDateInputValue(referenceDate),
  };
}

function getFriendlyTransactionError(error) {
  const message = error instanceof Error ? error.message : String(error ?? '');

  if (/greater than zero/i.test(message)) {
    return 'Amount must be greater than zero.';
  }

  if (/non-empty string/i.test(message) && /description/i.test(message)) {
    return 'Description is required.';
  }

  if (/YYYY-MM-DD/i.test(message) || /real calendar date/i.test(message)) {
    return 'Date must be a valid calendar date.';
  }

  if (/month id/i.test(message)) {
    return 'The selected month is invalid.';
  }

  return 'Something went wrong with your spending entry. Please try again.';
}

export function MonthTransactionPanel({ monthId, monthLabel, onRecordsChanged }) {
  const [transactionState, setTransactionState] = useState({ month: null, transactions: [], totalSpending: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingTransactionId, setEditingTransactionId] = useState(null);
  const [formValues, setFormValues] = useState(createEmptyFormValues());

  const panelMonthLabel = useMemo(() => monthLabel, [monthLabel]);

  useEffect(() => {
    let active = true;

    async function loadTransactions() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const loadedTransactionState = await monthTransactionApplication.listTransactionsForMonth(monthId);

        if (!active) {
          return;
        }

        setTransactionState(loadedTransactionState);
        setIsFormOpen(false);
        setFormMode('add');
        setEditingTransactionId(null);
        setFormValues(createEmptyFormValues());
      } catch {
        if (!active) {
          return;
        }

        setErrorMessage('Something went wrong opening this month’s spending. Please try again.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadTransactions();

    return () => {
      active = false;
    };
  }, [monthId]);

  function openAddTransactionForm() {
    setErrorMessage('');
    setIsFormOpen(true);
    setFormMode('add');
    setEditingTransactionId(null);
    setFormValues(createEmptyFormValues());
  }

  function openEditTransactionForm(transaction) {
    setErrorMessage('');
    setIsFormOpen(true);
    setFormMode('edit');
    setEditingTransactionId(transaction.id);
    setFormValues({
      description: transaction.description,
      amount: String(transaction.amount),
      date: transaction.date,
    });
  }

  function closeTransactionForm() {
    setIsFormOpen(false);
    setFormMode('add');
    setEditingTransactionId(null);
    setFormValues(createEmptyFormValues());
    setErrorMessage('');
  }

  function updateFormField(field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  async function reloadTransactionState() {
    const loadedTransactionState = await monthTransactionApplication.listTransactionsForMonth(monthId);
    setTransactionState(loadedTransactionState);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsMutating(true);
    setErrorMessage('');

    try {
      const nextTransaction = {
        ...(formMode === 'edit' ? { id: editingTransactionId } : {}),
        monthId,
        description: formValues.description,
        amount: Number(formValues.amount),
        date: formValues.date,
      };

      if (formMode === 'edit') {
        await monthTransactionApplication.updateTransaction(nextTransaction);
      } else {
        await monthTransactionApplication.createTransaction(nextTransaction);
      }

      await reloadTransactionState();
      if (typeof onRecordsChanged === 'function') {
        await onRecordsChanged();
      }
      closeTransactionForm();
    } catch (error) {
      setErrorMessage(getFriendlyTransactionError(error));
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDeleteTransaction(transaction) {
    if (!window.confirm(`Delete spending entry “${transaction.description}”?`)) {
      return;
    }

    setIsMutating(true);
    setErrorMessage('');

    try {
      await monthTransactionApplication.deleteTransaction(transaction.id);

      if (editingTransactionId === transaction.id) {
        closeTransactionForm();
      }

      await reloadTransactionState();
      if (typeof onRecordsChanged === 'function') {
        await onRecordsChanged();
      }
    } catch {
      setErrorMessage('Something went wrong deleting this spending entry. Please try again.');
    } finally {
      setIsMutating(false);
    }
  }

  return createElement(TransactionPanelView, {
    monthLabel: panelMonthLabel,
    transactions: transactionState.transactions,
    totalSpending: transactionState.totalSpending,
    isLoading,
    errorMessage,
    isFormOpen,
    formMode,
    formValues,
    isMutating,
    onOpenAdd: openAddTransactionForm,
    onEditTransaction: openEditTransactionForm,
    onDeleteTransaction: handleDeleteTransaction,
    onSubmit: handleSubmit,
    onCancel: closeTransactionForm,
    onFieldChange: updateFormField,
  });
}