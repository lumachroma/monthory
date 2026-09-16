# Monthory

[![Deploy GitHub Pages](https://github.com/lumachroma/monthory/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/lumachroma/monthory/actions/workflows/deploy-pages.yml)

**Your financial journal.**

Monthory is a calm, private place to journal your financial life. It is not built to judge spending or push complicated budgets. It helps you capture what happened, reflect on where your money went, and understand your financial story one month at a time.

## Philosophy

> Observe first. Improve second.

Monthory makes financial awareness a sustainable monthly habit.

- Journal first
- Sustainable by design
- Progress over perfection
- Private by default
- Intentionally simple
- One month at a time

## North Star

> Awareness over anxiety.  
> Sustainability over intensity.

## Product test

Before adding a feature:

> Does this make financial journaling more sustainable?

If not, leave it out.

## Current implementation

Monthory currently includes:

- an application shell with Monthory identity
- income and journal navigation
- a month selector
- a monthly journal use-case layer
- a journal editor for the current month
- month loading and save persistence for the journal flow
- a monthly income use-case layer
- an income list, editor, delete flow, and monthly total
- local persistence for income by month
- a monthly transaction use-case layer
- a spending list, editor, delete flow, and monthly total
- a derived monthly financial overview with income, spending, and difference
- a global category foundation with starter categories, archive, rename, and custom creation
- a reusable category selector for future record forms
- a secondary Settings entry point with nested Categories management
- mobile-first empty states
- calm design tokens for the shell
- shell UI state in Zustand
- a standalone financial domain layer in `src/domain`
- a local persistence layer in `src/persistence/dexie`
- repository contracts in `src/repositories`
- domain, application, UI, and persistence tests in `tests/domain`, `tests/application`, `tests/ui`, and `tests/persistence`

The app does not yet include account or template UI. It also does not include authentication, cloud sync, or Supabase.

## Technical direction

Monthory is an offline-first PWA built with Vite + React + Vanilla JavaScript (no TypeScript), shadcn/ui, Zustand, Dexie, IndexedDB, and Zod. It is designed for static hosting at near-zero cost.

Current repo conventions also include a domain layer in `src/domain`, a persistence layer in `src/persistence/dexie`, repository contracts in `src/repositories`, and Node-based tests under `tests`.

## Deployment

Monthory is configured for GitHub Pages as a project site.

- Workflow: [.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)
- Published URL: `https://lumachroma.github.io/monthory/`
- GitHub Pages base path: `/monthory/`

When `GITHUB_PAGES=true`, the Vite build switches the app base path, asset URLs, and PWA manifest scope/start URL to `/monthory/`.

Before the first deployment, enable GitHub Pages in the repository settings and choose GitHub Actions as the publishing source. The workflow can publish after that, but it cannot turn Pages on without extra repository-admin permissions.

See:

- [PRODUCT.md](PRODUCT.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [DATA_MODEL.md](DATA_MODEL.md)
- [ROADMAP.md](ROADMAP.md)
- [copilot-instructions.md](copilot-instructions.md)
