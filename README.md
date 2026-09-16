# Monthory

Monthory is a calm, private financial journal.

It is not an accounting system, budgeting app, or expense tracker.

The app is designed to help people build a sustainable monthly journaling habit around their financial life.

There is no backend, no auth, no cloud dependency, and no financial data model in place yet.

## Current App

Monthory is currently an empty web app shell.

• Vite + React 19 application scaffold
• Tailwind CSS v4 UI foundation
• Zustand state store initialized for future app state
• PWA manifest and service worker support wired in
• No features, no repository layer, and no IndexedDB persistence yet

## What Gets Tracked

Nothing yet.

Monthory is still at the foundation stage, so no journal entries, categories, accounts, templates, or month data are stored.

## Interaction Model

The current app has no user-facing workflow yet.

The intended experience will remain calm, minimal, and notebook-like as the app grows.

## Tech Stack

• React 19
• Vite
• JavaScript
• Tailwind CSS v4
• Zustand
• lucide-react
• vite-plugin-pwa

## Architecture Notes

Monthory is planned as a layered app.

UI

↓

Business Logic

↓

Repository

↓

Dexie

↓

IndexedDB

The current scaffold only initializes the UI and state layers. Persistence and domain logic will be added later, one stage at a time.

## Development

Prerequisites:

• Node.js 20+
• npm 10+

Install dependencies:

  npm install

Start the dev server:

  npm run dev

Useful scripts:

• npm run build
• npm run preview
• npm run lint

## Deployment

Deployment has not been set up yet.

The app is prepared as a web PWA, so the next deployment stage can target a static host such as Cloudflare Pages or GitHub Pages.

## Project Structure

```text
src/
  app/
  assets/
  components/
  features/
    dashboard/
    journal/
    income/
    transactions/
    templates/
    categories/
    accounts/
    settings/
  hooks/
  repository/
  services/
  store/
  types/
  utils/
```

Current scaffold files:

```text
src/
  App.jsx
  index.css
  main.jsx
  lib/
    utils.js
  store/
    useAppStore.js
```

## Future Direction

The next stages will add the app shell, repository layer, and offline-first persistence.

Planned areas include monthly journals, recurring templates, categories, accounts, and reflection-focused views.

## License

This project has not been assigned a license yet.
