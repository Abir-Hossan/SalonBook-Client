# SalonBook — Visual QA Report

**Phase:** 01 — Frontend only  
**Current state:** In progress; not accepted as complete.  
**Primary visual reference:** 20 PNGs in `SalonBook — Complete UI_UX Design.zip`.

## Current work completed

- Extracted and inventoried all 20 original Figma PNG exports, including dimensions and route/state mapping in `FIGMA_SCREEN_MAPPING.md`.
- Inspected the Stitch ZIP's 28 screen exports, 20 HTML screen files, `DESIGN.md`, and local image assets.
- Confirmed the Stitch design tokens specify Playfair Display for headings and Manrope for interface/body text.
- Audited the existing `public/images` directory and identified multiple image files that render as black/noisy or distorted assets.
- Added eight verified local Stitch image assets to `public/images/` and remapped the public service imagery to the relevant original source photos.
- Rebuilt `/services` to include the Figma reference's availability alert, editorial heading, four statistics, search/sort, category filters, quick filters, six image-led service cards, loading/empty inspection states, pagination, concierge panel and footer.
- Updated the shared public header/footer styling and home-page salon imagery toward the supplied Figma/Stitch design system.
- Updated mock service and appointment display data for the six service-card treatments visible in the Figma catalog. All data remains frontend preview data only.

## Current blockers / not yet verified

- The updated workspace has not yet been run in a browser in this environment.
- The current sandbox copy does not contain `node_modules` or the user's newly generated `package-lock.json`; the successful local Windows build reported by the user belongs to their local copy and is not evidence that this updated workspace builds.
- TypeScript, ESLint and production build have not been rerun after these source edits.
- No actual post-edit localhost screenshots have been captured.
- No pixel overlay, image-difference measurement, browser console/network inspection or nine-viewport run has been completed.
- Only `/services` has been rebuilt in this incremental pass. The other 19 design screens still require page-by-page reconstruction and comparison.

## Image verification

The eight added local assets were opened and decoded with Pillow after extraction. They are local PNGs, not remote hotlinks. Their original source folders are documented in `FIGMA_SCREEN_MAPPING.md`.

## Responsive verification matrix

All entries remain **NOT RUN** until tested against the updated running application.

| Viewport | `/services` | Other routes |
|---|---|---|
| 320 × 568 | NOT RUN | NOT RUN |
| 375 × 667 | NOT RUN | NOT RUN |
| 390 × 844 | NOT RUN | NOT RUN |
| 430 × 932 | NOT RUN | NOT RUN |
| 768 × 1024 | NOT RUN | NOT RUN |
| 1024 × 768 | NOT RUN | NOT RUN |
| 1280 × 800 | NOT RUN | NOT RUN |
| 1440 × 900 | NOT RUN | NOT RUN |
| 1920 × 1080 | NOT RUN | NOT RUN |

## Acceptance decision

**Phase 01 remains OPEN.** The work completed so far is a source-level reconstruction pass, not final visual or functional acceptance. Do not infer a similarity percentage. Do not start Phase 02 or deployment.

## Post-edit static checks (current sandbox source)

- TypeScript/TSX syntax transpilation: **34 files parsed, 0 syntax diagnostics**.
- `@/` alias imports: **0 unresolved imports** in the static path audit.
- Literal `/images/...` references: **11 found, 0 missing**.
- Newly added source photos: **8 files opened and verified as decodable PNGs**.
- ESLint config JavaScript syntax: `node --check` passed.

These are source/static checks only. They do not replace the full TypeScript project check, ESLint run, Next.js production build or browser testing. Those remain pending because this sandbox workspace has no `node_modules` and no generated `package-lock.json`.

## Targeted authentication-screen refinement (2026-11-19)

User supplied two 1917px-wide visual references for `/sign-in` and `/sign-up`. The implementation was refined specifically against those references:

- Desktop split changed to 44.25% visual panel / 55.75% form panel.
- The left visual panel now uses a generated CSS grain texture instead of the two 480px-wide black/noise placeholder JPEGs.
- Brand mark and editorial copy retain the supplied screenshot wording and left-panel hierarchy.
- Form content is positioned to match the supplied right-panel alignment and vertical placement.
- Sign-in fields, remember-me row, forgot-password action, Google preview action, account link and legal note are retained.
- Sign-up name/email/password/profile-image fields, password guidance, account link and legal note are retained.
- Responsive stacked behavior is retained for narrow screens.
- Google Fonts import was moved before the Tailwind import to address the previously observed CSS `@import` ordering warning.

**Verification limitation:** This is a source update based on the two supplied screenshots. No new local browser screenshots, viewport tests, TypeScript run, ESLint run, or production build were executed in this environment. Re-run those checks in the user's installed workspace before treating these two pages as verified.

## Current workspace verification — 2026-11-21

Offline npm install using existing dependencies, TypeScript, ESLint and Next.js production build all exited 0. The build generated 19 static pages and compiled dynamic routes. The earlier missing-dependencies notes describe the historical reconstruction pass.

Home, catalogue and service details now use the Express API. Authentication, booking and dashboard actions still contain preview flows. Browser screenshots, console/network inspection and the nine-viewport matrix remain pending because this workspace cannot reach the local application over loopback. Phase 01 remains open.
