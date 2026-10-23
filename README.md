# Mico L. Nakase — Portfolio

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier)](https://prettier.io)

Personal portfolio of **Mico L. Nakase**, a Full Stack & Generative AI Developer and music producer,
styled as a Pokémon / Game Boy-inspired neo-brutalist site.

**Live:** [www.miconakase.xyz](https://www.miconakase.xyz) · **GitHub:** [@miconakase](https://github.com/miconakase)

## Stack

- **React 19** — UI framework
- **Vite 8** — Build tool with HMR (via Rolldown)
- **Tailwind CSS v4** — Utility-first styling via `@tailwindcss/vite` plugin
- **EmailJS** — Client-side contact form delivery
- **Vercel Functions** — Content API in `api/`
- **MongoDB Atlas** — Works, tracks, journey and skills data
- **Cloudinary** — Cover images, screenshots and MP3s (served auto-optimized)

## Features

- **Loading screen** — "MICODEX" Pokédex boot screen with a Game Boy LCD that types out lines; exits by sliding the device away and splitting the backdrop along a Pokéball seam. Waits for content (up to 8s) before leaving
- **Light / dark mode** — Toggle in the navbar; preference persisted in `localStorage`
- **Pixel cursor** — Custom pixel-sprite cursor
- **Hero** — Name stretched to match the navbar width, a game-style dialog box that types each line, auto-advances and loops (click / Enter / Space to advance), and a scroll-driven exit
- **About** — Bio, live stats (years coding, project and track counts) and a Pokémon TCG-style profile card with a holo shine that follows the pointer and flips on tap
- **Works** — Two tabs:
  - **Programming** — Game Boy cartridge cards, with a wide spotlight card for featured projects
  - **Music** — Track list with cover art, play/pause, an equalizer animation, a shared audio player and a details popup with color-coded credits and links
- **Project pages** — Shareable `#/works/<slug>` routes with description, tech tags, key features, outcome, live/GitHub links and a screenshot gallery with a preview modal
- **Journey** — Route-map timeline (work, leadership, education) zig-zagging along a dashed path, with type-badge tags, the current job highlighted and minor entries behind a "Show N older" button
- **Skills** — Core stack as "party" cards and everything else in a compact "PC Box" grouped by category; each skill shows a Pokémon-style level (one level per month of use)
- **Contact** — EmailJS form with typewriter placeholder messages + social links (GitHub, Facebook, Instagram, TikTok, LinkedIn, Email)
- **Footer** — Location (San Pedro, Laguna), blinking availability badge, social icons
- **Navbar** — Sticky and responsive, active section highlighted via `IntersectionObserver`, battle-menu style mobile menu
- **Admin app** — Separate site for editing all content and uploading images/audio to Cloudinary, behind a password login

## Architecture

Three parts in one repo, deployed as two Vercel projects:

```
www.miconakase.xyz        portfolio (this folder) + api/
admin.miconakase.xyz      admin app (admin/, Vercel Root Directory = admin)
```

```
api/                 # Vercel Functions: content CRUD, admin login, Cloudinary upload signing
├── _lib/            # DB connection, auth cookie, validation (not routes)
admin/               # Separate Vite app for editing content (proxies /api to the portfolio)
scripts/dev-api.mjs  # Runs api/ locally on :3001
src/
├── components/      # UI components (Hero, About, Works, PokeCard, etc.)
├── hooks/           # Custom React hooks (useContent, useTheme, useDialog, etc.)
├── lib/             # Content shaping, shared slugify, class helpers
├── constants/       # techIcons
├── services/        # API clients (contentService)
├── assets/          # Static images (profile photo, etc.)
├── App.jsx          # Root component with section orchestration and #/works routing
├── App.css          # Tailwind import, design tokens, light/dark themes, animations
└── main.jsx         # Entry point
```

### Content

All works, tracks, journey entries and skills live in MongoDB and are edited at
`admin.miconakase.xyz`. The site loads them in one request (`GET /api/content`), cached
on Vercel's CDN for 30 seconds, so edits go live within about half a minute.

### Custom hooks

| Hook | Purpose |
|------|---------|
| `useTheme` | Light/dark toggle with `localStorage` persistence |
| `useActiveSection` | Tracks which section is in view via `IntersectionObserver` |
| `useInView` | Generic `IntersectionObserver` wrapper for scroll-in animations |
| `useScrollAnimation` | Scroll‑driven hero animation (requestAnimationFrame‑based) |
| `useDialog` | Game-style dialog: types a line, waits or auto-advances, optionally loops |
| `useTypewriter` | Cycles typed placeholder text in the contact form |
| `useDuration` | Formats start dates and turns months of use into a skill level |
| `useForm` | Contact form state + EmailJS submission |
| `useContent` | Loads portfolio content from `/api/content` |

## Theming

Design tokens (colors, fonts, brutalist shadows, animations) are defined in `src/App.css` with
Tailwind v4's `@theme`. Dark mode overrides them under `:root[data-theme='dark']`; the
`useTheme` hook sets `data-theme` on `<html>` and remembers the choice in `localStorage`.

Fonts are self-hosted via Fontsource: **Space Grotesk** (body), **Pixelify Sans** (display) and
**Press Start 2P** (pixel labels).

## Environment Variables

Create a `.env.local` file in the project root (git-ignored). The same values go in the
portfolio's Vercel project settings; the admin project needs none.

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string (database `portfolio`) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret (server only) |
| `ADMIN_PASSWORD` | Password for the admin app |
| `SESSION_SECRET` | Random string that signs the admin login cookie |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

## Getting Started

Requires Node.js 22.12 or newer.

```bash
npm install
npm run dev:api   # content API on :3001 (separate terminal)
npm run dev       # site on :5173, proxies /api to :3001

cd admin && npm install && npm run dev   # admin on :5174
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with HMR |
| `dev:api` | `node --watch --env-file=.env.local scripts/dev-api.mjs` | Run the `api/` functions locally |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview the production build locally |
| `lint` | `eslint .` | Lint all source files |

## Build

```bash
npm run build
```

Output is written to `dist/`. Deployed on Vercel, which also runs the `api/` functions.
