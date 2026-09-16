# Monthory Roadmap

## Guiding principle

Build the smallest useful financial journal first.

Do not build future complexity before the core journaling habit is proven.

## Release 1 — Foundation

Goal: make monthly financial journaling simple and dependable.

### Data
- settings
- income sources
- categories
- accounts
- recurring templates
- years and months
- income entries
- transactions

### Journal
- monthly journal
- income entry
- spending entry
- category totals
- account totals
- remaining income

### Experience
- dashboard
- monthly navigation
- simple transaction entry
- recurring transaction generation
- mobile-first responsive UI

### Storage
- Dexie
- IndexedDB
- offline-first PWA
- JSON import/export

### Quality
- Vanilla JavaScript (no TypeScript)
- Zod validation
- unit tests for core calculations
- accessibility baseline

## Release 2 — Better journaling

Potential features:

- transaction search
- filters
- notes
- recurring template management
- easier month creation
- duplicate previous month
- richer journal presentation

## Release 3 — Reflection

Potential features:

- yearly review
- monthly comparison
- category trends
- account trends
- spending patterns
- reflective summaries

These should remain descriptive and un-opinionated.

## Release 4 — Optional cloud

Potential features:

- optional authentication
- Supabase
- encrypted/secure sync architecture
- multi-device access
- backup and restore

Offline-first remains a core principle.

## Explicit non-goals

Do not introduce these merely because they are common in finance apps:

- aggressive budgets
- guilt-based alerts
- gamification
- unnecessary notifications
- financial advice
- investment recommendations
- behavioural scoring
- social features

They may only be reconsidered if they clearly support the product philosophy.

## Scope rule

A roadmap item is not a commitment to build it.

The current release takes priority.

## Definition of done

A feature is done when it is:

- simple
- intuitive
- accessible
- tested
- maintainable
- aligned with the product philosophy

Not when it contains the maximum number of capabilities.
