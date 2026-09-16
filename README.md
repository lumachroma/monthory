# Monthory

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
- dashboard and journal navigation
- a month selector
- mobile-first empty states
- calm design tokens for the shell
- shell UI state in Zustand
- a standalone financial domain layer in `src/domain`
- domain-level Node tests in `tests/domain`

The app does not yet include Dexie, IndexedDB persistence, authentication, cloud sync, or a financial entry UI.

## Technical direction

Monthory is an offline-first PWA built with Vite + React + Vanilla JavaScript (no TypeScript), shadcn/ui, Zustand, Zod, and a future Dexie/IndexedDB persistence layer. It is designed for static hosting at near-zero cost.

Current repo conventions also include a domain layer in `src/domain` and Node-based domain tests under `tests/domain`.

See:

- [PRODUCT.md](PRODUCT.md)
- [ARCHITECTURE.md](ARCHITECTURE.md)
- [DATA_MODEL.md](DATA_MODEL.md)
- [ROADMAP.md](ROADMAP.md)
- [copilot-instructions.md](copilot-instructions.md)
