# SalonBook — Development Progress

**Current phase:** Phase 01 — Frontend Development  
**Status:** IN PROGRESS — visual reconstruction and QA are not complete.  
**Phase 02:** Backend foundation implemented in the sibling `server/` workspace; user-run verification is recorded in `server/BACKEND_TEST_REPORT.md`.  
**Deployment:** Not performed.

## Source-of-truth order

1. Original 20-screen Figma PNG export — visual source of truth.
2. Stitch ZIP — supplementary HTML, CSS, design tokens and local image assets.
3. Original assignment / Permanent Master Prompt — functional and business-rule source of truth.

## Completed in this incremental pass

- [x] Inspected all 20 Figma PNG exports and recorded source dimensions.
- [x] Created `FIGMA_SCREEN_MAPPING.md` covering all 20 screens, route targets, system states and verification status.
- [x] Inspected Stitch screen exports, HTML source files, `DESIGN.md` and image folders.
- [x] Identified the Stitch design tokens: Playfair Display, Manrope, warm ivory/peach surfaces, espresso text and champagne accents.
- [x] Audited existing project image assets and found multiple degraded black/noise images.
- [x] Added eight verified local image assets from the Stitch ZIP into `public/images/`.
- [x] Replaced the service catalog's corrupted image references with local high-quality source images.
- [x] Rebuilt `/services` with Figma-derived page sections and interactive preview controls.
- [x] Updated shared public header/footer toward the reference composition.
- [x] Updated home-page hero/experience imagery to verified local salon images.
- [x] Updated sample service and appointment content to align with the six treatments shown in the Figma catalog.
- [x] Created `VISUAL_QA_REPORT.md` and recorded unverified items honestly.

## Remaining Phase 01 work

- [ ] Re-run `npm run typecheck`, `npm run lint`, and `npm run build` after the latest frontend source edits in the user's local Client workspace.
- [ ] Fix all introduced or pre-existing source errors and warnings where appropriate.
- [ ] Start the updated application and test all 18 routes in a real browser.
- [ ] Capture actual browser screenshots for all applicable Figma screens/states.
- [ ] Compare each implementation screenshot with its corresponding original PNG; use overlays/diffs where practical.
- [ ] Reconstruct homepage, service details, authentication, customer portal, admin pages and all additional states.
- [ ] Verify every referenced image path and browser image response.
- [ ] Run the nine required viewport sizes on representative pages and check all routes for overflow/layout regressions.
- [ ] Inspect browser console and network errors.
- [ ] Update visual QA and implementation reports with evidence.

## Verification evidence boundaries

The previous local Windows environment output supplied by the user showed successful dependency installation, TypeScript check and a production build before the latest Figma-first reconstruction edits. That result does **not** validate the source edits made in this pass. The current sandbox workspace has no installed dependencies or lockfile, so no post-edit runtime/build result is claimed here.

## Strict boundaries

- This document tracks Phase 01 frontend progress only; backend work is tracked separately in `../server/`.
- No real authentication or payment processing is accepted as complete in this phase.
- No deployment.

## 2026-11-19 — Sign-in and sign-up reference alignment

- Updated `/sign-in` and `/sign-up` to follow the two user-supplied split-panel screenshots.
- Desktop layout uses a 44.25% textured editorial panel and 55.75% warm form panel.
- Replaced the stretched low-resolution black/noise JPEG backgrounds with a CSS-generated grain texture.
- Adjusted form and back-link alignment, typography, spacing, and responsive overrides.
- Moved the Google Fonts `@import` before Tailwind's import to address CSS import ordering.
- Existing preview-only form interactions remain unchanged.
- Not yet verified by a new browser run; local typecheck, lint, build, screenshots, and responsive checks remain required.
