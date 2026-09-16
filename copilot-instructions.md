# Monthory — AI Development Instructions

## 1. Project identity

**Monthory**

**Your financial journal.**

Monthory is a calm, private place to journal personal finances.

It is not primarily:

- an accounting system
- a budgeting coach
- an expense tracker
- an enterprise finance dashboard

Its purpose is to help users capture what happened, reflect on where their money went, and understand their financial story one month at a time.

## 2. Product philosophy

> Observe first. Improve second.

Monthory provides an un-opinionated view of the user's financial life.

Do not make assumptions about what the user should spend, save, or change.

The product should help the user observe, reflect, and decide.

## 3. Mission

> To make financial awareness a sustainable monthly habit.

## 4. North Star

> Awareness over anxiety.  
> Sustainability over intensity.

## 5. Product test

Before implementing or recommending a feature, ask:

> Does this make financial journaling more sustainable?

If the answer is no, prefer not to implement it.

## 6. Product principles

### Journal first
Think in terms of journal entries and monthly chapters, not accounting workflows.

### Sustainable by design
Reduce friction. Prefer workflows users can repeat for years.

### Progress over perfection
Never shame or judge spending.

### Private by default
Do not send financial data to external services unless explicitly required and approved.

### Intentionally simple
Prefer the simplest maintainable implementation.

### One month at a time
The monthly journal is the primary unit of experience.

## 7. Brand voice

Monthory should feel:

- calm
- thoughtful
- personal
- private
- minimal
- honest
- intentional

Avoid:

- judgemental language
- fear-based warnings
- aggressive calls to action
- unnecessary gamification
- corporate/accounting jargon where plain language works

## 8. Technology stack

Use the existing stack unless there is a compelling reason to change it:

- Vite
- React 19
- Vanilla JavaScript (no TypeScript)
- shadcn/ui
- Tailwind CSS
- Lucide React
- Zustand
- React Hook Form
- Zod
- Dexie
- IndexedDB
- Recharts
- date-fns
- vite-plugin-pwa
- Vitest
- React Testing Library
- ESLint
- Prettier

Do not add dependencies casually.

## 9. Architecture

Use this flow:

```text
UI
 |
Feature / Business Logic
 |
Repository
 |
Dexie
 |
IndexedDB
```

UI components must not directly access IndexedDB.

Persistence must go through the repository boundary.

## 10. Data model

The canonical model is:

```text
FinanceData
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

Read `DATA_MODEL.md` before changing the schema.

## 11. Data rules

### Store facts, calculate derived values

Never persist calculated values such as:

- total income
- total spending
- remaining income
- category totals
- account totals
- savings rate
- yearly totals

Calculate them from source data.

### Use stable IDs

Never use display names as identifiers.

Use references such as:

- categoryId
- accountId
- sourceId
- templateId

### Keep master data separate

Master data:

- categories
- accounts
- income sources
- templates

Monthly facts:

- income entries
- transactions

## 12. Templates

Templates represent recurring patterns.

Examples:

- Electricity
- Internet
- Spotify
- instalments

A template is not the transaction.

A monthly transaction stores the actual amount paid that month.

A fixed template may provide a default amount. Variable recurring entries may omit it.

## 13. Accounts vs categories

Keep these concepts separate.

**Category = what the money was for.**

Examples:

- Groceries
- Utilities
- Education

**Account = how/where the money moved.**

Examples:

- Maybank Visa
- CIMB Mastercard
- Cash
- TNG eWallet

Do not use bank/payment accounts as spending categories.

## 14. React guidance

Prefer:

- functional components
- small components
- focused hooks
- pure business logic
- composition

Avoid:

- giant components
- unnecessary abstraction
- deep prop drilling
- global state for local concerns
- clever patterns without a clear benefit

Use Zustand for genuinely shared application state.

## 15. UI guidance

Use shadcn/ui components where appropriate.

Prefer:

- mobile-first layouts
- semantic HTML
- accessible labels
- keyboard navigation
- visible focus states
- restrained visual hierarchy
- clear primary actions

Avoid:

- excessive modals
- dense enterprise tables where cards/forms work better
- excessive animation
- visual clutter
- dashboard decoration without purpose

## 16. Forms and validation

Use React Hook Form for non-trivial forms.

Use Zod for:

- imported JSON
- persisted data validation
- important form validation
- schema migrations

Never trust imported data blindly.

## 17. Storage

Use Dexie/IndexedDB.

Do not replace IndexedDB with localStorage for primary financial data.

LocalStorage may only be used for genuinely tiny, non-critical UI preferences if necessary.

## 18. Import/export

The canonical JSON model is the portable backup format.

Import must:

1. parse
2. validate with Zod
3. check version
4. migrate if necessary
5. persist through the repository

Export must produce valid canonical FinanceData.

## 19. Security and privacy

Treat all financial data as sensitive.

Do not:

- send financial data to analytics
- log transaction details in production
- include financial data in error telemetry
- expose data through URLs
- add external services without necessity

Exports should be treated as sensitive files.

## 20. Testing

Prioritise tests for:

- totals
- derived calculations
- template generation
- import/export
- schema validation
- migrations
- repository behaviour

UI tests should focus on important user workflows rather than implementation details.

## 21. Accessibility

All new UI must consider:

- keyboard access
- semantic structure
- labels
- contrast
- focus
- touch target size
- responsive layouts

## 22. Performance

Prefer straightforward code.

Use lazy loading where it materially helps.

Avoid premature optimisation.

Do not introduce memoisation everywhere.

Measure before solving hypothetical performance problems.

## 23. Feature development workflow

Before coding:

1. Read relevant documentation.
2. Understand the existing data model.
3. Identify the smallest useful change.
4. Check whether the feature supports the product philosophy.
5. Consider data migration implications.
6. Plan tests.

While coding:

1. Follow existing conventions.
2. Reuse existing components.
3. Keep changes focused.
4. Avoid unrelated refactors.
5. Keep the repository boundary intact.

After coding:

1. Run type checks.
2. Run linting.
3. Run tests.
4. Verify responsive behaviour.
5. Check accessibility.
6. Verify import/export compatibility when data is affected.

## 24. Schema changes

Never casually change persisted data structures.

When changing the schema:

1. Update DATA_MODEL.md.
2. Increment the schema/data version when appropriate.
3. Create a migration.
4. Add migration tests.
5. Preserve existing user data.
6. Update sample data.

## 25. Future cloud sync

Do not implement cloud sync in Release 1.

Keep the repository abstraction capable of supporting a future cloud adapter.

Do not couple the UI to Supabase.

## 26. Avoid over-engineering

Do not introduce:

- Redux
- GraphQL
- a backend
- microservices
- event buses
- complex dependency injection
- unnecessary design patterns

unless a demonstrated requirement makes them necessary.

Simple is a feature.

## 27. Naming

Use product language consistently.

Prefer:

- Journal
- Entry
- Spending
- Income
- Category
- Account
- Template
- Month
- Reflection

Avoid unnecessarily technical language in user-facing UI.

## 28. The final rule

Monthory is not trying to tell users how to live.

It helps them see their own journey clearly enough to decide what to do next.

Build accordingly.
