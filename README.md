# Tarot Ghibli Inspired

Static multi-page tarot site built with Vite and deployed to GitHub Pages.

## Overview

This project is a client-side tarot experience with three main flows:

- `index.html`: landing page and spread selection
- `reading.html`: reading result view for 1-card, 3-card, and Celtic Cross spreads
- `explore.html`: encyclopedia view for the full 78-card deck

The site is intentionally backend-free. Tarot data is loaded from a local JSON file and reading state is stored in `sessionStorage`.

## Current MVP Scope

The repository currently includes:

- Ghibli-inspired landing page with spread selection
- Tarot engine with shuffle, draw, reversed toggle, and session persistence
- Reading page with spread layout, selectable cards, and detail panel
- Explore page with search, suit/arcana filters, and upright/reversed detail view
- GitHub Pages workflow using the official Pages deploy actions
- Basic accessibility and release polish:
  - skip links
  - focus states
  - `aria-live` status regions
  - reduced-motion handling
  - Open Graph metadata

## Tech Stack

- Vite
- Vanilla HTML, CSS, and JavaScript
- Static JSON data in `public/data/tarot.json`
- GitHub Pages via GitHub Actions

## Local Development

Install dependencies:

```bash
npm install
```

Start the dev server:

```bash
npm run dev
```

Build production output:

```bash
npm run build
```

Preview the built site locally:

```bash
npm run preview
```

## Project Structure

```txt
.
├── index.html
├── reading.html
├── explore.html
├── public/
│   ├── assets/
│   └── data/tarot.json
├── src/
│   ├── content/
│   ├── scripts/
│   │   ├── core/
│   │   ├── pages/
│   │   └── ui/
│   └── styles/
└── .github/workflows/deploy.yml
```

## Deploy Notes

The site is configured for GitHub Pages with:

- workflow: [.github/workflows/deploy.yml](/D:/tarot/.github/workflows/deploy.yml)
- Vite base path: [vite.config.js](/D:/tarot/vite.config.js)

Important:

- `vite.config.js` currently uses `base: "/tarot-ghibli/"`.
- If your GitHub repository name is different, update that value before publishing.
- In GitHub repository settings, Pages should use `GitHub Actions` as the source.

## Content Notes

- Tarot data is stored in [public/data/tarot.json](/D:/tarot/public/data/tarot.json).
- Image paths already exist in the schema, but the current MVP still relies on styled card placeholders rather than a full illustrated deck.
- `public/assets/ui/og-cover.svg` is used for social preview metadata.

## Release Checklist

Before publishing:

1. Confirm the repository name matches the Vite `base` path.
2. Run `npm run build`.
3. Push to `main` so the Pages workflow runs.
4. Verify `index.html`, `reading.html`, and `explore.html` render correctly on the deployed URL.
5. Check that direct navigation to `reading.html` shows the empty-state guard when no reading is stored.

## Known Limitations

- No bespoke tarot artwork yet
- No saved reading history beyond the current browser session
- No Lighthouse audit results committed yet
- No manual device QA captured for iOS Safari / Android Chrome yet
