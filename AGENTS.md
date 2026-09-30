# AGENTS.md

## Stack / Run

- Static single page: `index.html` + `style.css` + `script.js`. No `package.json`, build, tests, or lint.
- Preview with `open index.html` (use `python3 -m http.server` if fonts/fetch need http). No dev server required.
- Deploy: Vercel static (`vercel.json`: `cleanUrls`, no trailing slash). `CNAME` holds `amanmaddheshiya.me` — do not delete/rename. Live at https://amanmaddheshiya.me/

## Structure

- All sections live in `index.html` (nav, hero, experience/education timelines, projects, CP, skills, interests, achievements, certificates, contact, footer, `#modal-overlay`).
- Styling is hand-written CSS custom props + `clamp()`. Breakpoints: 1240px (compact nav), 1024/768/480px (layout), plus hamburger panel at 1000px (10 links don't fit a row below that). Only external dependency is Google Fonts (Inter + Playfair Display).
- `script.js` is vanilla JS: IntersectionObserver `[data-aos]` reveals, scroll-spy nav, hamburger + scrim, delegated certificate modal (`selectedCert` state), ripple, LeetCode bars, plus living-hero effects (role typer, stat count-up, particles, mouse parallax — all gated behind `prefers-reduced-motion`).

## Gotchas

- Asset filenames are case-sensitive and some contain spaces (`srmap image.jpg`, `vg10.jpg` vs `VG12.jpg`, `Dabur_internship.jpg`, `YSP.jpg`). Preserve exact names; modal uses `encodeURI()` — keep it.
- Certificates: cards wire via `data-file` (preview `<img>`) + optional `data-pdf` (download link). Only `mongodb-certification` and `class-12-marksheet` have both PNG + PDF; `Dabur_internship.jpg` / `YSP.jpg` are JPG-only with no `data-pdf`.
- Known placeholder: 8086 Emulator link is `[PASTE YOUR ACTUAL REPO URL HERE]` (`index.html:350`) — replace with real URL, don't ship as-is.
- Mobile nav breakpoint is 1000px, not 768px (`style.css:373-381` explains why; ignore stale `script.js:74` "below 768px" comment). `.nav-links` / `.nav-scrim` must stay `position:absolute` — `#navbar` has `backdrop-filter`, which breaks `fixed` descendants (zero-height panel).
- Fragile: LeetCode bars re-set `bar.style.width` to itself to retrigger the transition (`script.js:265-271`); `[data-aos]` `--aos-delay` is cleared after entry (`script.js:111-114`). Don't rely on either persisting.
- Preserve `prefers-reduced-motion` handling (disables reveals/ripple), modal focus-to-close-button, and Escape-closes-modal-and-nav.
