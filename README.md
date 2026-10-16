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
- **Culori** — OKLCH color space manipulation for theming
- **react-markdown** — Markdown rendering for AI chat

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

Single‑page application organized by concern:

```
src/
├── components/      # UI components (Hero, About, Works, etc.)
├── hooks/           # Custom React hooks (useTheme, useActiveSection, useInView, etc.)
├── constants/       # Data files (skillsData, techIcons)
├── services/        # API clients (chatService for Ganymede)
├── assets/          # Images, fonts, audio
├── App.jsx          # Root component with section orchestration
├── App.css          # Tailwind import, theme variables, animations
└── main.jsx         # Entry point
```

### Custom hooks

| Hook | Purpose |
|------|---------|
| `useTheme` | Japanese/Filipino theme toggle with `localStorage` persistence |
| `useActiveSection` | Tracks which section is in view via `IntersectionObserver` |
| `useInView` | Generic `IntersectionObserver` wrapper |
| `useScrollAnimation` | Scroll‑driven hero text animation (requestAnimationFrame‑based) |
| `useDuration` | Calculates experience duration from a start date |
| `useForm` | Contact form state + EmailJS submission |
| `useChat` | Ganymede chat state with `localStorage` persistence |

## Theming

The site uses CSS custom properties scoped to `[data-theme="japanese"]` and `[data-theme="filipino"]` on `<html>`. The `useTheme` hook reads from `localStorage` on load and toggles the attribute dynamically.

## Environment Variables

Create a `.env` file in the project root:

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Ganymede backend URL (default: `http://localhost:8000`) |
| `VITE_MOKUSEI_API_KEY` | Mokusei AI API key |
| `VITE_EMAILJS_SERVICE_ID` | EmailJS service ID |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS template ID |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS public key |

## Getting Started

```bash
npm install
npm run dev
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview the production build locally |
| `lint` | `eslint .` | Lint all source files |

## Build

```bash
npm run build
```

Output is written to `dist/`. Deploy to any static host (Vercel, Netlify, GitHub Pages, etc.).

## Ganymede AI Chat

A floating AI chat assistant (Ganymede v1.2 by Mokusei AI) is available as an optional feature. It is currently disabled in `App.jsx`. To enable:

1. Uncomment the `GanymedeChat` import and usage in `src/App.jsx`
2. Start the Ganymede backend server on `localhost:8000`
3. Set `VITE_API_URL` and `VITE_MOKUSEI_API_KEY` in `.env`

The chat supports Markdown rendering, periodic prompt suggestions, and message persistence to `localStorage`.