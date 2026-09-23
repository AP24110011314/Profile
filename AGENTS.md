# AGENTS.md

## Project Overview

Personal developer portfolio website — single-page static site with vanilla HTML, CSS, and JS. No build tools, frameworks, or dependencies.

## Running Locally

No dev server needed. Open `index.html` in a browser:
```bash
open index.html
```

## Architecture

- `index.html` — Single-page layout with all sections (Navbar, Hero, Experience timeline, Education timeline with photos, Projects, CP, Skills, Interests, Achievements, Certificates, Contact, Footer); 5 project cards including 8086 Emulator; SEO meta tags (OG, favicon, preload, font-display=swap)
- `style.css` — All styling uses CSS custom properties (warm earth tone palette: `#E2D9C3`, `#343D1A`, `#B8892D`, `#D8C9A8`). Neo-Brutalist aesthetic with glassmorphism on navbar and cards.
- `script.js` — Vanilla JS: navbar scroll effect, hamburger menu, AOS-style IntersectionObserver animations, certificate modal viewer (event-delegated, state-based), active nav link highlighting, LeetCode bar animations. No React or frameworks used.
- Responsive tiers: 1024px (2-col grids) → 768px (slide-in nav + stacked hero + 1-col grids) → 480px (2-col stats, 1-col interests/contact). Staggered `[data-aos]` reveals via `--aos-delay` (cleared after entry); `prefers-reduced-motion` disables animation. Tap targets ≥44px on coarse pointers.

## Key Conventions

- **No external UI frameworks** — CSS is hand-written with custom properties and `clamp()` for responsive typography.
- **Google Fonts**: Inter (UI) + Playfair Display (headings) loaded from Google Fonts CDN.
- **Images are local** (`Photo.jpg`, certificate PNGs, etc.) — not served from any CDN.
- **Live site** at https://amanmaddheshiya.me/ (custom domain).
- **Vercel**: static deploy, no build step — `vercel.json` at root (`cleanUrls`, no trailing slash). Framework preset: Other, output directory default.
- **Repo is named `Profile`** — at `github.com/AP24110011314/Profile`.

## Things That Can Trip Up an Agent

- No `package.json`, no `node_modules`, no build scripts — this is purely static HTML/CSS/JS.
- No testing, linting, or typechecking infrastructure exists.
- Certificate images in the certificates section are `.jpg`/`.png` files (converted from PDFs like `class-12-marksheet.pdf`, `mongodb-certification.pdf`). Original PDFs and PNG previews exist in the repo root. The certificates section uses icon-based preview cards; the modal always renders `<img>` from the PNG preview with `object-fit:contain`, plus a PDF download link.
- The LeetCode bar animation in `script.js` uses a self-referencing `setTimeout` trick (`bar.style.width = bar.style.width`) to re-trigger CSS transitions — this is fragile; if bar widths are set differently, the animation may not fire.
