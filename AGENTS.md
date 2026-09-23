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

- Asset filenames are case-sensitive and some contain spaces (`srmap image.jpg`, `vg10.jpg` vs `VG12.jpg`). Preserve exact names; modal uses `encodeURI()` — keep it.
- Certificates: cards wire via `data-file` (preview `<img>`) + optional `data-pdf` (download link). Keep PNG previews alongside source PDFs (`mongodb-certification.*`, `class-12-marksheet.*`).
- Known placeholder: 8086 Emulator link is `[PASTE YOUR ACTUAL REPO URL HERE]` (`index.html:348`) — replace with real URL, don't ship as-is.
- Fragile: LeetCode bars re-set `bar.style.width` to itself to retrigger the transition (`script.js:158-164`); `[data-aos]` `--aos-delay` is cleared after entry. Don't rely on either persisting.
- Preserve `prefers-reduced-motion` handling (disables reveals/ripple), modal focus-to-close-button, and Escape-closes-modal-and-nav.
