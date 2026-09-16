import { createElement, useEffect, useMemo, useState } from 'react';

import { categoryApplication, monthIncomeApplication } from '../../application/index.js';
import { getTodayDateInputValue } from '../../lib/format.js';
import { IncomePanelView } from './IncomePanelView.js';

function createEmptyFormValues(referenceDate = new Date()) {
  return {
    description: '',
    amount: '',
    date: getTodayDateInputValue(referenceDate),
    categoryId: '',
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

export function MonthIncomePanel({ monthId, monthLabel, onRecordsChanged }) {
  const [incomeState, setIncomeState] = useState({ month: null, incomes: [], totalIncome: 0 });
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingIncomeId, setEditingIncomeId] = useState(null);
  const [formValues, setFormValues] = useState(createEmptyFormValues());

  const panelMonthLabel = useMemo(() => monthLabel, [monthLabel]);
  const activeCategories = useMemo(() => categories.filter((category) => !category.archived), [categories]);
  const categoryById = useMemo(() => Object.fromEntries(categories.map((category) => [category.id, category])), [categories]);

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

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setIsLoadingCategories(true);

      try {
        const loadedCategories = await categoryApplication.listCategories();

        if (!active) {
          return;
        }

        setCategories(loadedCategories);
      } finally {
        if (active) {
          setIsLoadingCategories(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

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
      categoryId: income.categoryId ?? '',
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
        ...(formValues.categoryId ? { categoryId: formValues.categoryId } : {}),
      };

      if (formMode === 'edit') {
        await monthIncomeApplication.updateIncome(nextIncome);
      } else {
        await monthIncomeApplication.createIncome(nextIncome);
      }

      await reloadIncomeState();
      if (typeof onRecordsChanged === 'function') {
        await onRecordsChanged();
      }
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
      if (typeof onRecordsChanged === 'function') {
        await onRecordsChanged();
      }
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
      isLoadingCategories,
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
      activeCategories,
      categoryById,
    })
  );
}