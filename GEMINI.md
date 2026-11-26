# Project Rules: Devam (`redesign/ive-v2`)

## Architecture & Stack
- **Zero-build Vanilla JS, HTML5, and CSS3 Progressive Web App** deployed statically via `vercel.json`.
- **Do NOT** introduce React, Next.js, npm bundlers, or external build dependencies unless explicitly requested.
- Keep `index.html`, `app.js`, and `styles.css` cleanly modularized alongside `classes/`, `WEBAPPS/`, `CURRICULUM/`, and `ALL_CHAPTERS/`.
- All class data modules (`classes/class6/*.js`) register via `registerClassData()` / `registerConcepts()` in `classes/registry.js` and must be loaded in `<script>` tags in `index.html` and listed in `CORE_ASSETS` in `sw.js`.

## Branch & Deployment Discipline
- Active redesign work lives on **`redesign/ive-v2`** (auto-deployed to `https://devam-v2.vercel.app`).
- **Do NOT merge into `main`** unless explicitly instructed by the user.

## Curriculum, Exam & Deep Learning Integrity
- **Term- & Syllabus-Specific Papers:** Every generated paper (`PA-1`, `Mid-Term`, `PA-2`, `Annual`) must strictly filter questions to that term's official Bloom Public School syllabus (`termSyllabi`) and match exact mark totals (`25M / 1h` for PA-1 & PA-2; `60M / 2h 30m` for Mid-Term & Annual).
- **Datesheets:** Parse `'YYYY-MM-DD'` dates as local midnight (`new Date(y, m - 1, d)`) to avoid timezone off-by-one shifts.
- **School Paper Replica:** `.official-exam-sheet.replica-paper-mode` must always stay crisp white paper (`#FFFFFF`) with high-contrast dark ink regardless of active student neon skin (`cyber`, `aurora`, `sunset`, `daylight`).

## PWA & Service Worker Discipline
- Whenever modifying `index.html`, `app.js`, `styles.css`, `manifest.json`, or any file inside `classes/` or `WEBAPPS/`, **ALWAYS increment `CACHE_NAME` in `sw.js`** and ensure any new core JS file is added to `CORE_ASSETS`.
- Keep app-shell assets (`HTML/JS/CSS`) Network-First with `{ cache: 'no-cache' }` and offline fallback so Vercel & local updates appear immediately, while keeping opened NCERT `.pdf` files Cache-First for offline study.

## Verification Before Pushing to `redesign/ive-v2`
- Run `node --check` on every modified `.js` file (PowerShell 5.1: chain commands with `;`, not `&&`).
- Use the browser verifier to confirm **zero console errors**, **zero failed network requests**, responsive iPad/desktop layout, and working interactive controls/simulators.
- Update `COVERAGE_REPORT.md` whenever curriculum chapters, paper pools, or simulator mappings change.
