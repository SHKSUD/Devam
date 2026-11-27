# Project Rules: Devam (`redesign/ive-v2`)

## Architecture & Stack
- **Zero-build Vanilla JS, HTML5, and CSS3 Progressive Web App** deployed statically via `vercel.json`.
- **Do NOT** introduce React, Next.js, npm bundlers, or external build dependencies unless explicitly requested.
- **Strict Zero External Runtime CDNs:** Never load Tailwind CDN, unpkg, Babel standalone, or external JS/CSS frameworks inside `index.html` or `WEBAPPS/*` — every screen and embedded lab must work 100% offline.
- Keep `index.html`, `app.js`, and `styles.css` cleanly modularized alongside `classes/`, `WEBAPPS/`, `CURRICULUM/`, and `ALL_CHAPTERS/`.
- **No `window.*` Data Leaks:** All class curriculum, concept, quest, deep-learning, and exam-blueprint modules (`classes/class6/*.js`) must register via `registerClassData()` / `registerConcepts()` in `classes/registry.js`, be loaded via `<script>` tags in `index.html`, and be listed in `CORE_ASSETS` in `sw.js`.
- **Lazy View Rendering & Structured Reader Calls:** Render only the active route view on boot (lazy-rendering secondary views on first switch), and pass structured `{ subjectId, chapterNum }` metadata to `openReader()` instead of parsing display titles.

## Branch & Deployment Discipline
- Active redesign work lives on **`redesign/ive-v2`** (auto-deployed to `https://devam-v2.vercel.app`).
- **Do NOT merge into `main`** unless explicitly instructed by the user.

## Curriculum, Exam & Deep Learning Integrity
- **Term- & Syllabus-Specific Papers:** Every generated paper (`PA-1`, `Mid-Term`, `PA-2`, `Annual`) must strictly filter questions to that term's official Bloom Public School syllabus (`termSyllabi`) and match exact mark totals (`25M / 1h` for PA-1 & PA-2; `60M / 2h 30m` for Mid-Term & Annual).
- **Datesheets:** Parse `'YYYY-MM-DD'` dates as local midnight (`new Date(y, m - 1, d)`) to avoid timezone off-by-one shifts.
- **School Paper Replica:** `.official-exam-sheet.replica-paper-mode` must always stay crisp white paper (`#FFFFFF`) with high-contrast dark ink regardless of active student neon skin (`cyber`, `aurora`, `sunset`, `daylight`).

## PWA & Two-Tier Service Worker Discipline
- **Two-Tier Cache Separation:** Keep `APP_SHELL_CACHE` (incremented on every code, HTML, CSS, manifest, or `WEBAPPS/` edit) strictly separate from `PDF_CACHE` (`devam-pdfs-v1`, NEVER deleted during `activate` so students retain offline textbooks across app updates).
- Guard `cache.put(...)` calls with `.catch(() => {})` (`QuotaExceededError` safety on iPad Safari), keep `CORE_ASSETS` in sync with `index.html` `<script>`/`<link>` tags, keep App-Shell fetches Network-First (`{ cache: 'no-cache' }`) with `{ ignoreSearch: true }` & `navigate` fallback, and keep `.pdf` files Cache-First.

## Pre-Push Validator Gate & Verification
- Always run `node --check` on every modified `.js` file AND run **`node scripts/validate-content.js`** before every commit to verify schema, datesheets, 36 term-paper combinations, Deep Learning simulator bounds, and `CORE_ASSETS` parity (PowerShell 5.1: chain commands with `;`, not `&&`).
- Use the browser verifier to confirm **zero console errors**, **zero failed network requests**, clean Service Worker activation, resolved PNG icons, responsive iPad/desktop layout, and working interactive controls.
- Keep `COVERAGE_REPORT.md` updated via `node scripts/validate-content.js`.
