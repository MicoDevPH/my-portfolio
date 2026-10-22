# Mico L. Nakase — Portfolio

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![ESLint](https://img.shields.io/badge/ESLint-10-4B32C3?logo=eslint)](https://eslint.org)
[![Prettier](https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier)](https://prettier.io)

Personal portfolio website for **Full Stack & Generative AI Developer** and **music producer**.

## Stack

- **React 19** — UI framework
- **Vite 8** — Build tool with HMR (via Rolldown)
- **Tailwind CSS v4** — Utility-first styling via `@tailwindcss/vite` plugin
- **EmailJS** — Client-side contact form delivery
- **Vercel Functions** — Content API in `api/`
- **MongoDB Atlas** — Works, tracks, journey and skills data
- **Cloudinary** — Cover images, screenshots and MP3s (served auto-optimized)

## Features

- **Loading screen** — MLN. logo entrance with column-reveal animation; logo flies to navbar on dismiss
- **Dual‑theme system** — Toggle between Japanese (sakura, red/white/pink) and Filipino (jeepney, blue/red/yellow) themes; preference persisted in `localStorage`
- **Hero** — Animated text entrance (MICO slides left, NAKASE slides right) + scroll‑driven 3D perspective exit (600vh)
- **About** — Bio, role highlights (Junior AI Engineer at Prosperna, Truchorus performer), stats, CV download link
- **Works** — Tabbed carousel (Programming / Music) with prev/next navigation; music tracks include inline audio player (play, pause, scrub, volume)
- **Work Detail** — Full‑screen overlay with hero image, description, tags, and key features per project
- **Timeline** — Three‑tab timeline (Education, Experience, Leadership) with scroll progress bar
- **Skills** — Three scrolling marquee rows (Frontend, Backend, Tools & VC); hover shows experience duration
- **Contact** — EmailJS-powered form (name, email, subject, message) + social links panel (GitHub, LinkedIn, Facebook, Instagram, TikTok, Email)
- **Footer** — MLN. logo, location (San Pedro, Laguna), "Open for commissions" indicator, social icons
- **Navbar** — Sticky, responsive, active section highlighted via IntersectionObserver, hamburger menu on mobile
- **ErrorBoundary** — Wraps all sections for graceful failure handling

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
├── components/      # UI components (Hero, About, Works, etc.)
├── hooks/           # Custom React hooks (useContent, useTheme, useActiveSection, etc.)
├── lib/             # Content shaping, shared slugify, class helpers
├── constants/       # techIcons
├── services/        # API clients (contentService)
├── assets/          # Static images (profile photo, etc.)
├── App.jsx          # Root component with section orchestration
├── App.css          # Tailwind import, theme variables, animations
└── main.jsx         # Entry point
```

### Content

All works, tracks, journey entries and skills live in MongoDB and are edited at
`admin.miconakase.xyz`. The site loads them in one request (`GET /api/content`), cached
on Vercel's CDN for 30 seconds, so edits go live within about half a minute.

### Custom hooks

| Hook | Purpose |
|------|---------|
| `useTheme` | Japanese/Filipino theme toggle with `localStorage` persistence |
| `useActiveSection` | Tracks which section is in view via `IntersectionObserver` |
| `useInView` | Generic `IntersectionObserver` wrapper |
| `useScrollAnimation` | Scroll‑driven hero text animation (requestAnimationFrame‑based) |
| `useDuration` | Calculates experience duration from a start date |
| `useForm` | Contact form state + EmailJS submission |
| `useContent` | Loads portfolio content from `/api/content` |

## Theming

The site uses CSS custom properties scoped to `[data-theme="japanese"]` and `[data-theme="filipino"]` on `<html>`. The `useTheme` hook reads from `localStorage` on load and toggles the attribute dynamically.

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
| `dev:api` | `node --watch scripts/dev-api.mjs` | Run the `api/` functions locally |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview the production build locally |
| `lint` | `eslint .` | Lint all source files |

## Build

```bash
npm run build
```

Output is written to `dist/`. Deployed on Vercel, which also runs the `api/` functions.