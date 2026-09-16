# Monthory Data Model

## Purpose

This document defines Monthory's current financial domain model.

The model is designed to stay framework-agnostic while being mapped by the repository and persistence layers.

## Domain overview

```text
Month
├── Journal
├── Income[]
├── Transaction[]
├── Transfer[]
├── Reflection
└── Templates[]

Category[]
Account[]
```

## Domain entities

### Month

The central monthly container.

Example:

```json
{
  "id": "2026-09",
  "year": 2026,
  "month": 9
}
```

Rules:

- `id` must use the `YYYY-MM` format.
- `year` must be a four-digit integer.
- `month` must be an integer from 1 to 12.
- `id` must match the year and month values.
- A month must not store derived totals.

### Journal

Monthly notes written during the month.

Example:

```json
{
  "monthId": "2026-09",
  "notes": "September felt busy but manageable.",
  "createdAt": "2026-09-30T10:15:00.000Z",
  "updatedAt": "2026-09-30T10:15:00.000Z"
}
```

Rules:

- `monthId` references the associated Month.
- `notes` is optional plain text.
- Timestamps use ISO strings.
- No rich-text formatting is introduced at this stage.

### Reflection

End-of-month notes separate from the journal narrative.

Example:

```json
{
  "monthId": "2026-09",
  "notes": "We spent more, but we also noticed why.",
  "createdAt": "2026-09-30T18:00:00.000Z",
  "updatedAt": "2026-09-30T18:00:00.000Z"
}
```

Rules:

- `monthId` references the associated Month.
- `notes` is optional plain text.
- Timestamps use ISO strings.

### Income

Money coming into the user's financial life.

This is the first financial record surfaced in the app.

Example:

```json
{
  "id": "income-salary-001",
  "monthId": "2026-09",
  "date": "2026-09-05",
  "description": "Salary",
  "amount": 10000,
  "accountId": "acc-maybank"
}
```

Rules:

- `amount` must be positive.
- `monthId` identifies the month.
- `date` must be a valid `YYYY-MM-DD` date that belongs to the same month.
- `description` must be non-empty.
- `categoryId` is optional.
- `accountId` is optional.
- Income is never stored as a negative value.

### Transaction

Money going out.

This is the first spending record surfaced in the app.

Example:

```json
{
  "id": "tx-001",
  "monthId": "2026-09",
  "date": "2026-09-06",
  "description": "Groceries",
  "amount": 500,
  "categoryId": "cat-groceries",
  "accountId": "acc-cash"
}
```

Rules:

- `amount` must be positive.
- `monthId` identifies the month.
- `date` must be a valid `YYYY-MM-DD` date that belongs to the same month.
- `description` must be non-empty.
- `categoryId` is optional.
- `accountId` is optional.
- Transactions are always outgoing facts.

### Transfer

Money moving between accounts.

Example:

```json
{
  "id": "tr-001",
  "monthId": "2026-09",
  "date": "2026-09-18",
  "amount": 3000,
  "fromAccountId": "acc-maybank",
  "toAccountId": "acc-cimb",
  "description": "Move savings"
}
```

Rules:

- `amount` must be positive.
- `fromAccountId` and `toAccountId` are required.
- Source and destination accounts must differ.
- Transfers do not affect income or spending totals.

### Category

Reusable context for financial records.

Categories are global, not month-specific.
Category management is reached from Settings; selection for a spending record will remain separate.

Example:

```json
{
  "id": "cat-groceries",
  "name": "Groceries",
  "icon": "shopping-basket",
  "archived": false
}
```

Rules:

- `id` must be stable.
- `name` must be non-empty.
- `name` is trimmed and treated case-insensitively for duplicate detection.
- `icon` is optional and presentation-friendly.
- `archived` is optional and defaults to `false`.
- Archived categories remain valid for historical records and are excluded from new-record selection.

### Account

Where money is held or moved through.

Example:

```json
{
  "id": "acc-maybank",
  "name": "Maybank",
  "type": "bank",
  "archived": false
}
```

Rules:

- `id` must be stable.
- `name` must be non-empty.
- `type` must be a non-empty, extensible string.
- `archived` is optional and defaults to `false`.

### Template

Reusable pattern for creating future income or transaction records.

Example:

```json
{
  "id": "tpl-internet",
  "type": "transaction",
  "description": "Internet",
  "amount": 129,
  "categoryId": "cat-utilities",
  "accountId": "acc-maybank",
  "frequency": "monthly"
}
```

Rules:

- `type` must be `income` or `transaction`.
- `description` must be non-empty.
- `amount` must be positive.
- `frequency` is intentionally simple for v0.1.
- A template is not itself a financial record.

## Derived values

Calculate, do not store.

At the domain level, the monthly summary currently exposes:

- `totalIncome`
- `totalSpending`
- `netAmount`

Transfers do not affect these totals.

## Validation

The domain layer validates:

- month id format and month parts
- positive amounts
- valid dates that belong to the month
- required names and descriptions where needed
- distinct transfer accounts

## Notes

This document describes the current domain layer, not a persistence schema.

Persistence mapping can be added later without changing the core domain concepts.
