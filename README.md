# SalonBook Client

Luxury salon appointment-booking frontend built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Phase 01 scope

- Public home, service catalogue, service details, sign-in/sign-up, payment result and error pages
- Customer overview, appointments, and profile
- Admin overview, service management, appointment management, customer management, transactions, and profile
- Responsive layouts and temporary local mock data
- Loading, empty, error, success, and confirmation UI states

Home, service browsing, and service details read from the Express API at `SALONBOOK_API_URL`. The booking, auth, and dashboard screens still contain preview flows.

The sign-in screen uses a client component for interactive controls so the route can be prerendered. Authentication and password recovery still require the server integration.

## Requirements

- Node.js 20.9+ (Node 22 LTS recommended)
- npm 10+

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Run the server concurrently. To preview a populated catalogue before MongoDB is connected, set `SEED_DEMO_CATALOG=true` on the development server.

## Quality checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Routes

- `/`
- `/services`
- `/services/[id]`
- `/sign-in`
- `/sign-up`
- `/payment/success`
- `/payment/cancel`
- `/customer`
- `/customer/appointments`
- `/customer/profile`
- `/admin`
- `/admin/services`
- `/admin/services/new`
- `/admin/services/[id]/edit`
- `/admin/appointments`
- `/admin/users`
- `/admin/transactions`
- `/admin/profile`

## Temporary mock behavior

Forms and dashboard actions demonstrate frontend states only. Data is not persisted and no real authentication or payment is performed. These flows will be replaced by backend integration in the corresponding approved phases.
