import { createElement, useEffect, useMemo, useState } from 'react';

import { categoryApplication } from '../../application/index.js';
import { CategoryPanelView } from './CategoryPanelView.js';

function createEmptyFormValues() {
  return { name: '' };
}

function getFriendlyCategoryError(error) {
  const message = error instanceof Error ? error.message : String(error ?? '');

  if (/already exists/i.test(message)) {
    return 'A category with that name already exists.';
  }

  if (/characters or fewer/i.test(message)) {
    return message;
  }

  if (/non-empty string/i.test(message)) {
    return 'Category name is required.';
  }

  if (/not found/i.test(message)) {
    return 'That category no longer exists.';
  }

  return 'Something went wrong with your category. Please try again.';
}

export function MonthCategoryPanel() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [formValues, setFormValues] = useState(createEmptyFormValues());

  const activeCategories = useMemo(() => categories.filter((category) => !category.archived), [categories]);
  const archivedCategories = useMemo(() => categories.filter((category) => category.archived), [categories]);

  useEffect(() => {
    let active = true;

    async function loadCategories() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        await categoryApplication.ensureDefaultCategories();
        const loadedCategories = await categoryApplication.listCategories();

        if (!active) {
          return;
        }

        setCategories(loadedCategories);
      } catch {
        if (!active) {
          return;
        }

        setErrorMessage('Something went wrong opening categories. Please try again.');
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      active = false;
    };
  }, []);

  function openAddCategoryForm() {
    setErrorMessage('');
    setIsFormOpen(true);
    setFormMode('add');
    setEditingCategoryId(null);
    setFormValues(createEmptyFormValues());
  }

  function openEditCategoryForm(category) {
    setErrorMessage('');
    setIsFormOpen(true);
    setFormMode('edit');
    setEditingCategoryId(category.id);
    setFormValues({ name: category.name });
  }

  function closeCategoryForm() {
    setIsFormOpen(false);
    setFormMode('add');
    setEditingCategoryId(null);
    setFormValues(createEmptyFormValues());
    setErrorMessage('');
  }

  function updateFormField(field, value) {
    setFormValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  async function reloadCategories() {
    setCategories(await categoryApplication.listCategories());
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsMutating(true);
    setErrorMessage('');

    try {
      if (formMode === 'edit') {
        await categoryApplication.renameCategory(editingCategoryId, formValues.name);
      } else {
        await categoryApplication.createCategory(formValues.name);
      }

      await reloadCategories();
      closeCategoryForm();
    } catch (error) {
      setErrorMessage(getFriendlyCategoryError(error));
    } finally {
      setIsMutating(false);
    }
  }

  async function handleArchiveCategory(category) {
    if (!window.confirm(`Archive category “${category.name}”?`)) {
      return;
    }

    setIsMutating(true);
    setErrorMessage('');

    try {
      await categoryApplication.archiveCategory(category.id);
      await reloadCategories();
    } catch {
      setErrorMessage('Something went wrong archiving this category. Please try again.');
    } finally {
      setIsMutating(false);
    }
  }

  return createElement(CategoryPanelView, {
    activeCategories,
    archivedCategories,
    isLoading,
    errorMessage,
    isFormOpen,
    formMode,
    formValues,
    isMutating,
    onOpenAdd: openAddCategoryForm,
    onEditCategory: openEditCategoryForm,
    onArchiveCategory: handleArchiveCategory,
    onSubmit: handleSubmit,
    onCancel: closeCategoryForm,
    onFieldChange: updateFormField,
  });
}