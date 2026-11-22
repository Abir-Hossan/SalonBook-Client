# SalonBook — Figma Screen Inventory & Route Mapping

**Primary visual source:** `SalonBook — Complete UI_UX Design.zip` (20 original PNG exports).  
**Supplementary source:** `stitch_salonbook_luxury_design_system.zip` (HTML, design tokens, image references and screen exports).  
**Functional source:** original SalonBook assignment and permanent Master Prompt.  
**Status:** inventory completed from all 20 PNG exports; implementation and visual verification are in progress.

## Source inventory

All 20 primary Figma PNGs were extracted and inspected as a contact sheet. The source dimensions are included below. The exports are high-resolution, long-form desktop design boards; their dimensions are not browser viewport sizes.

| # | Original Figma PNG | Source dimensions | Route / implementation target | Main content / state | Current status |
|---:|---|---:|---|---|---|
| 01 | `SalonBook — Luxury Salon Discovery & Booking.png` | 2592 × 11816 | `/` | Public landing page; luxury hero, philosophy, discovery/experience sections, service highlights and public footer | Existing route; visual reconstruction pending |
| 02 | `SalonBook — Browse Curated Atelier Services.png` | 2592 × 6002 | `/services` | Availability alert, editorial intro, four metrics, search/sort, category filters, quick filters, service cards, loading/empty state controls, pagination, concierge banner and footer | Rebuilt first; browser comparison pending |
| 03 | `SalonBook — Service Details_ Dimensional French Balayage.png` | 2592 × 6190 | `/services/[id]` | Service photography, service summary, pricing/duration, inclusions, booking flow and related state | Existing route; visual reconstruction pending |
| 04 | `SalonBook — Sign In to Your Sanctuary.png` | 2592 × 2620 | `/sign-in` | Sign-in form, editorial visual panel, account navigation and footer | Existing route; visual reconstruction pending |
| 05 | `SalonBook — Join the Sanctuary_ Create Patron Account.png` | 2592 × 3922 | `/sign-up` | Customer registration form, account creation guidance and editorial visual panel | Existing route; visual reconstruction pending |
| 06 | `SalonBook — Patron Portal_ Overview.png` | 2592 × 3720 | `/customer` | Customer overview, welcome area, metrics, upcoming appointment and portal navigation | Existing route; visual reconstruction pending |
| 07 | `SalonBook — Patron Portal_ My Appointments.png` | 3548 × 4509 | `/customer/appointments` | Appointment list, filters, appointment status, payment status and allowed customer actions | Existing route; visual reconstruction pending |
| 08 | `SalonBook — Patron Portal_ My Profile.png` | 2592 × 3842 | `/customer/profile` | Customer identity, editable profile fields, account details and save feedback | Existing route; visual reconstruction pending |
| 09 | `SalonBook — Admin Governance_ Dashboard Overview.png` | 2592 × 5242 | `/admin` | Admin overview, key metrics, recent appointments, activity and management shortcuts | Existing route; visual reconstruction pending |
| 10 | `SalonBook — Admin Governance_ Manage Atelier Services.png` | 2592 × 3674 | `/admin/services` | Service management table/list, search/filter, status and service actions | Existing route; visual reconstruction pending |
| 11 | `SalonBook — Admin Governance_ Curate Atelier Service.png` | 2592 × 4138 | `/admin/services/new` and `/admin/services/[id]/edit` | Create/edit service form, image preview, pricing, duration, category and active state | Existing routes; visual reconstruction pending |
| 12 | `SalonBook — Admin Governance_ Manage Appointments.png` | 3804 × 3871 | `/admin/appointments` | Appointment queue, filters, appointment details and admin confirmation/cancellation states | Existing route; visual reconstruction pending |
| 13 | `SalonBook — Admin Governance_ Manage Users.png` | 2592 × 3855 | `/admin/users` | Customer directory, account status, search and block/unblock controls | Existing route; visual reconstruction pending |
| 14 | `SalonBook — Admin Governance_ Financial Ledger & Transactions.png` | 2592 × 4840 | `/admin/transactions` | Transaction ledger, payment status, totals and transaction details | Existing route; visual reconstruction pending |
| 15 | `SalonBook — Sign In to Your Sanctuary-1.png` | 2592 × 3308 | `/sign-in` | Alternate sign-in composition/variant; treated as a design state, not a duplicate route | Existing route; variant review pending |
| 16 | `SalonBook — Better Auth_ Patron Registration & Role Safeguard.png` | 2592 × 4513 | `/sign-up` and auth feedback states | Registration/role-safeguard and auth boundary states; only customer self-registration is allowed | Existing auth routes; business-rule reconciliation required |
| 17 | `SalonBook — Appointment Booking_ Availability, Guardrails & Lifecycle States.png` | 2592 × 5792 | `/services/[id]` booking preview and appointment states | Availability selection, booking guardrails, pending/confirmed/cancelled lifecycle and feedback | Existing booking preview; state-by-state visual review pending |
| 18 | `SalonBook — Stripe Checkout, Webhook Reconciliation & Escrow Settlement.png` | 2592 × 3488 | `/payment/success` and `/payment/cancel` | Payment outcome and reconciliation UI states | Existing routes; escrow concepts are excluded where they conflict with assignment rules |
| 19 | `SalonBook — Patron Profile Management & Global Feedback Systems.png` | 2592 × 2838 | `/customer/profile` plus shared feedback components | Profile management and global toast/confirmation/feedback states | Existing route/components; visual reconstruction pending |
| 20 | `SalonBook — Full-Stack Architecture & MongoDB Schema Integration Blueprint.png` | 2592 × 5470 | Documentation only; no user-facing route | Architecture, collections and integration blueprint | Reference only; no Phase 01 UI route |

## Design-source precedence

1. **Figma PNGs** control visual composition, content hierarchy, spacing, typography, imagery and component appearance.
2. **Stitch HTML and `salonbook/DESIGN.md`** supplement the Figma exports with design tokens, source markup and image assets. Stitch-specific differences do not override the Figma PNG.
3. **Original assignment and permanent Master Prompt** control functionality, routes, roles, appointment lifecycle and payment rules. Conflicting Figma/Stitch concepts (including escrow, deposits, artisan/concierge booking rules or role terminology) must not silently alter those rules.

## Verified Stitch design tokens

| Token | Value |
|---|---|
| Surface / canvas | `#FFF8F5` |
| Surface container low | `#FFF1E8` |
| Surface container | `#FAEBE1` |
| Primary | `#120D0A` |
| On-surface | `#211A14` |
| On-surface variant | `#4E4541` |
| Secondary | `#745A31` |
| Secondary container | `#FEDAA7` |
| Outline variant | `#D1C4BF` |
| Display / headings | Playfair Display |
| Body / interface | Manrope |
| Desktop content max width | 1320px |
| Desktop outer margin token | 5rem |
| Mobile layout | 4-column grid, 1rem gutters, 1.25rem outer margin |

## Services page image-source audit

The original project image set contained multiple severely degraded black/noise images (for example `hair-treatment.jpg`, `hair-styling.jpg`, `spa-treatment.jpg`, `salon-experience.jpg`, `salon-lounge.jpg`, `salon-interior.jpg` and `facial-treatment.jpg`). These files are not suitable for final display.

The Stitch ZIP contains high-quality local source images in named `screen.png` asset folders. Verified local copies were added to `public/images/`:

- `service-blowout.png` — editorial blowout portrait
- `service-balayage.png` — balayage portrait
- `service-head-spa.png` — botanical head-spa treatment
- `service-facial.png` — facial treatment
- `service-makeup.png` — editorial makeup application
- `service-manicure.png` — manicure detail
- `salon-reception.png` — salon reception / lounge
- `salon-interior-original.png` — salon interior

The `/services` page now uses the six service photographs represented in the Figma service catalog. Other legacy image files remain in the workspace but should not be used by the rebuilt public catalog.

## Visual verification log

| Screen | Reference inspected | Implementation screenshot | Overlay/diff | Responsive checks | Result |
|---|---|---|---|---|---|
| `/services` | Yes | Not yet captured from updated workspace | Not yet run | Not yet run | In progress |
| Other 19 screens | Yes (source inventory/contact sheet) | Not yet captured | Not yet run | Not yet run | Pending |

A screen is not considered visually verified until an actual running-browser screenshot is compared with its corresponding original PNG. Source inspection and static checks do not count as visual acceptance.
