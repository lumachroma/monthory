# Monthory Roadmap

## Guiding principle

Build the smallest useful financial journal first.

Do not build future complexity before the core journaling habit is proven.

Current status: the app shell, standalone domain v0.1 layer, and local persistence v0.1 layer are in place. Cloud sync is not yet implemented.

## Completed foundation

- application shell
- Monthory identity
- dashboard and journal navigation
- month selector
- mobile-first empty states
- calm design tokens
- Zustand shell UI state
- financial domain factories, validators, and summary logic
- Dexie local persistence layer
- repository contracts
- persistence tests
- domain-level tests

## Release 1 — Foundation

Goal: make monthly financial journaling simple and dependable.

### Data
- categories
- accounts
- recurring templates
- months
- journal
- reflection
- income
- transactions
- transfers

### Journal
- monthly journal
- reflection

### Domain
- validation helpers
- derived monthly summary
- stable month IDs

### Experience
- dashboard
- monthly navigation
- journal page shell
- mobile-first responsive UI

### Storage
- Dexie and IndexedDB
- offline-first PWA foundation already exists
- JSON import/export later

### Quality
- Vanilla JavaScript (no TypeScript)
- domain validation
- domain-level tests
- repository tests
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
