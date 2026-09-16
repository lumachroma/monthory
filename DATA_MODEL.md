# Monthory Data Model

## Purpose

This document defines the canonical application data model.

The JSON structure is designed to be portable across:

- IndexedDB
- local JSON export/import
- future cloud storage
- future relational databases

## Top-level model

```text
FinanceData
├── version
├── settings
├── incomeSources
├── categories
├── accounts
├── templates
└── years
    └── months
        ├── income
        └── transactions
```

## Canonical JSON example

```json
{
  "version": "1.0.0",
  "settings": {
    "currency": "MYR",
    "locale": "en-MY",
    "startOfWeek": "Monday"
  },
  "incomeSources": [
    {
      "id": "income-salary",
      "name": "Salary",
      "type": "fixed"
    },
    {
      "id": "income-allowance",
      "name": "Allowance",
      "type": "variable"
    },
    {
      "id": "income-bonus",
      "name": "Bonus",
      "type": "variable"
    }
  ],
  "categories": [
    {
      "id": "cat-utilities",
      "name": "Utilities",
      "type": "living"
    },
    {
      "id": "cat-groceries",
      "name": "Groceries",
      "type": "living"
    },
    {
      "id": "cat-subscriptions",
      "name": "Subscriptions",
      "type": "lifestyle"
    }
  ],
  "accounts": [
    {
      "id": "acc-maybank",
      "name": "Maybank Visa",
      "type": "bank"
    },
    {
      "id": "acc-cimb",
      "name": "CIMB Mastercard",
      "type": "bank"
    },
    {
      "id": "acc-cash",
      "name": "Cash",
      "type": "cash"
    }
  ],
  "templates": [
    {
      "id": "tpl-electricity",
      "categoryId": "cat-utilities",
      "name": "Electricity",
      "defaultAmount": null,
      "recurring": true
    },
    {
      "id": "tpl-internet",
      "categoryId": "cat-utilities",
      "name": "Internet",
      "defaultAmount": 129,
      "recurring": true
    },
    {
      "id": "tpl-spotify",
      "categoryId": "cat-subscriptions",
      "name": "Spotify",
      "defaultAmount": 16,
      "recurring": true
    }
  ],
  "years": [
    {
      "year": 2026,
      "months": [
        {
          "id": "2026-01",
          "income": [
            {
              "sourceId": "income-salary",
              "amount": 8500
            },
            {
              "sourceId": "income-allowance",
              "amount": 500
            }
          ],
          "transactions": [
            {
              "id": "tx-001",
              "templateId": "tpl-internet",
              "accountId": "acc-maybank",
              "amount": 129
            },
            {
              "id": "tx-002",
              "templateId": "tpl-electricity",
              "accountId": "acc-maybank",
              "amount": 118
            },
            {
              "id": "tx-003",
              "categoryId": "cat-groceries",
              "accountId": "acc-cash",
              "name": "Lotus",
              "amount": 420
            }
          ]
        }
      ]
    }
  ]
}
```

## Entity definitions

### Settings
Application preferences. Settings should not contain transactional facts.

### Income sources
Reusable definitions for where income comes from.

Examples:

- Salary
- Allowance
- Bonus

### Categories
Reusable definitions describing what money was used for.

Examples:

- Utilities
- Groceries
- Education
- Insurance
- Dining
- Travel

### Accounts
Reusable definitions describing how money was paid or where funds are held.

Examples:

- Maybank Visa
- CIMB Mastercard
- Cash
- TNG eWallet

Accounts and categories are intentionally separate.

### Templates
Reusable definitions for recurring transactions.

A template may contain a default amount, but a monthly transaction owns the actual amount for that month.

Examples:

- Electricity
- Internet
- Spotify
- Instalment ABC

### Year
Groups months by calendar year.

### Month
Represents a monthly journal chapter.

A month contains:

- income entries
- transactions

## Transaction rules

A transaction may reference:

- templateId, when created from a recurring template
- categoryId, when categorised
- accountId, when payment source is known

A manually created transaction does not need a template.

A template does not replace the monthly transaction. It defines a reusable pattern.

## Derived values

Calculate, do not store:

```text
Total Income
Total Spending
Remaining Income
Category Totals
Account Totals
Savings Rate
Yearly Totals
Monthly Trends
```

## ID rules

IDs must be stable and unique.

IDs must never depend on display names.

Renaming:

```text
Utilities -> Household Utilities
```

must not require rewriting transactions.

## Import/export

The JSON format is the portable backup format.

Import flow:

```text
JSON file
  |
Parse
  |
Zod validation
  |
Migration/version check
  |
Repository
  |
IndexedDB
```

Export flow:

```text
IndexedDB
  |
Repository
  |
Canonical FinanceData
  |
JSON file
```

## Versioning

The top-level `version` is mandatory.

Schema changes must use migrations rather than silently changing existing data.

Never break existing user data because of a new UI feature.
