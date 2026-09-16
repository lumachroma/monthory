import { createElement, useEffect, useMemo, useState } from 'react';

import { monthIncomeApplication } from '../../application/index.js';
import { getTodayDateInputValue } from '../../lib/format.js';
import { IncomePanelView } from './IncomePanelView.js';

function createEmptyFormValues(referenceDate = new Date()) {
  return {
    description: '',
    amount: '',
    date: getTodayDateInputValue(referenceDate),
  };
}

function getFriendlyIncomeError(error) {
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

  return 'Something went wrong with your income entry. Please try again.';
}

export function MonthIncomePanel({ monthId, monthLabel }) {
  const [incomeState, setIncomeState] = useState({ month: null, incomes: [], totalIncome: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [formValues, setFormValues] = useState(createEmptyFormValues());

  const panelMonthLabel = useMemo(() => monthLabel, [monthLabel]);

  useEffect(() => {
    let active = true;

    async function loadIncome() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const loadedIncomeState = await monthIncomeApplication.listIncomeForMonth(monthId);

        if (!active) {
          return;
        }

        setIncomeState(loadedIncomeState);
        setIsFormOpen(false);
        setFormMode('add');
        setEditingIncomeId(null);
        setFormValues(createEmptyFormValues());
      } catch {
        if (!active) {
          return;
        }

        setErrorMessage('Something went wrong opening this month’s income. Please try again.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadIncome();

    return () => {
      active = false;
    };
  }, [monthId]);

  function openAddIncomeForm() {
    setErrorMessage('');
    setIsFormOpen(true);
    setFormMode('add');
    setEditingIncomeId(null);
    setFormValues(createEmptyFormValues());
  }

  function openEditIncomeForm(income) {
    setErrorMessage('');
    setIsFormOpen(true);
    setFormMode('edit');
    setEditingIncomeId(income.id);
    setFormValues({
      description: income.description,
      amount: String(income.amount),
      date: income.date,
    });
  }

  function closeIncomeForm() {
    setIsFormOpen(false);
    setFormMode('add');
    setEditingIncomeId(null);
    setFormValues(createEmptyFormValues());
    setErrorMessage('');
  }

  function updateFormField(field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  async function reloadIncomeState() {
    const loadedIncomeState = await monthIncomeApplication.listIncomeForMonth(monthId);
    setIncomeState(loadedIncomeState);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsMutating(true);
    setErrorMessage('');

    try {
      const nextIncome = {
        ...(formMode === 'edit' ? { id: editingIncomeId } : {}),
        monthId,
        description: formValues.description,
        amount: Number(formValues.amount),
        date: formValues.date,
      };

      if (formMode === 'edit') {
        await monthIncomeApplication.updateIncome(nextIncome);
      } else {
        await monthIncomeApplication.createIncome(nextIncome);
      }

      await reloadIncomeState();
      closeIncomeForm();
    } catch (error) {
      setErrorMessage(getFriendlyIncomeError(error));
    } finally {
      setIsMutating(false);
    }
  }

  async function handleDeleteIncome(income) {
    if (!window.confirm(`Delete income entry “${income.description}”?`)) {
      return;
    }

    setIsMutating(true);
    setErrorMessage('');

    try {
      await monthIncomeApplication.deleteIncome(income.id);

      if (editingIncomeId === income.id) {
        closeIncomeForm();
      }

      await reloadIncomeState();
    } catch {
      setErrorMessage('Something went wrong deleting this income entry. Please try again.');
    } finally {
      setIsMutating(false);
    }
  }

  return (
    createElement(IncomePanelView, {
      monthLabel: panelMonthLabel,
      incomes: incomeState.incomes,
      totalIncome: incomeState.totalIncome,
      isLoading,
      errorMessage,
      isFormOpen,
      formMode,
      formValues,
      isMutating,
      onOpenAdd: openAddIncomeForm,
      onEditIncome: openEditIncomeForm,
      onDeleteIncome: handleDeleteIncome,
      onSubmit: handleSubmit,
      onCancel: closeIncomeForm,
      onFieldChange: updateFormField,
    })
  );
}