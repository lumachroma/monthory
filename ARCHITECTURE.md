# Monthory Architecture

## Goals

Monthory is designed around four constraints:

1. Simple
2. Near-zero cost
3. Secure and privacy-first
4. Easy to maintain

The architecture should remain useful even if the project is maintained lightly for years.

## Application type

Offline-first Progressive Web App.

The initial application has no required backend, API, authentication service, or hosted database.

Current milestone state:

- application shell is implemented
- income and journal navigation are in place
- shell UI state is handled in Zustand
- financial domain v0.1 lives in `src/domain`
- local persistence v0.1 lives in `src/persistence/dexie`
- repository contracts live in `src/repositories`
- monthly journal and monthly income application layers live in `src/application`
- monthly transaction and monthly overview application layers live in `src/application`
- global category application layer lives in `src/application`
- secondary settings navigation lives in the app shell state/UI

## High-level architecture

```text
React UI
   |
Feature / Business Logic
   |
Domain
   |
Finance Repository
   |
Dexie
   |
IndexedDB
```

The UI must not directly manipulate IndexedDB.

## Technology stack

### Core
- Vite
- React 19
- Vanilla JavaScript (no TypeScript)

### UI
- shadcn/ui
- Tailwind CSS
- Lucide React

### State
- Zustand

### Data and validation
- Dexie
- IndexedDB
- Zod

### Forms
- React Hook Form

### Charts
- Recharts

### Dates
- date-fns

### PWA
- vite-plugin-pwa

### Quality
- ESLint
- Prettier
- Vitest
- React Testing Library

### Hosting
- Cloudflare Pages or GitHub Pages

## Layer responsibilities

### UI
Responsible for presentation, user interaction, accessibility, and responsive behaviour.

### Features
Contains domain-specific workflows such as overview, income, spending, journal, transactions, categories, accounts, templates, and settings.

### Business logic
Calculates derived values and coordinates domain operations. Business logic should be testable without rendering React.

### Domain
Contains framework-agnostic factories, validators, and derived calculations for Monthory financial concepts.

### Repository
The single persistence boundary.

Examples:

```text
loadFinanceData()
saveFinanceData()
createMonth()
duplicateMonth()
deleteMonth()
addTransaction()
updateTransaction()
deleteTransaction()
importData()
exportData()
generateRecurringTransactions()
```

### Storage
Dexie owns IndexedDB access in the current milestone.

No feature should depend on Dexie's schema directly.

The repository layer is implemented in `src/repositories` and `src/persistence/dexie`.

## Repository abstraction

The repository should make the storage implementation replaceable.

Initial:

```text
FinanceRepository
        |
      Dexie
        |
   IndexedDB
```

Possible future:

```text
FinanceRepository
        |
  Local + Cloud adapters
        |
 IndexedDB + Supabase
```

Cloud sync is explicitly not required for Release 1.

## Data philosophy

Store facts. Calculate derived values.

Do not persist:

- monthly spending totals
- category totals
- total income
- remaining income
- savings rate
- yearly totals

These should be derived from source data.

Transfers are facts but should not affect income or spending totals.

## IDs

Every persistent entity has a stable ID.

Never use display names as identifiers.

Use references such as:

- categoryId
- accountId
- sourceId
- templateId

## Normalisation

Keep master data separate from monthly activity.

Master data:

- categories
- accounts
- templates

Monthly data:

- journal
- reflection
- income
- transactions
- transfers

This avoids duplicating names and makes future reporting easier.

Categories are global and archived categories remain part of historical lookups.
The current entry point for category management is a secondary Settings screen, not the primary month workflow.

## PWA

The app should:

- load without network access after installation/cache population
- remain usable offline
- provide a clear update path
- avoid making the user dependent on an online service

## Security and privacy

Release 1 should not send financial data to a server.

Avoid third-party analytics by default.

Avoid collecting personal data.

Do not log financial transaction contents to the console in production.

Treat exported JSON as sensitive user data.

## Performance

Prefer simple code.

Lazy-load routes where useful.

Avoid premature optimisation.

Do not introduce a dependency unless it solves a real problem.

## Accessibility

- semantic HTML
- keyboard support
- accessible labels
- sufficient contrast
- responsive mobile-first layouts
- visible focus states

## Engineering principle

> Make the simplest architecture that preserves the product philosophy and future options.
