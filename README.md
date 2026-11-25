# SalonBook Client

Luxury salon appointment-booking frontend built with Next.js App Router, React, TypeScript, and Tailwind CSS.

## Application scope

- Public home, service catalogue, service details, sign-in/sign-up, payment result and error pages
- Customer overview, appointments, and profile
- Admin overview, service management, appointment management, customer management, transactions, and profile
- Responsive public, customer and administration layouts
- Loading, empty, error, success, and confirmation UI states

The public catalogue, booking availability, Better Auth, dashboards and payments use the Express API through Next.js rewrites. Booking drafts are saved in the originating browser tab until authentication. Submitting a real booking writes to the Server. The customer portal includes payment history.

## Requirements

- Node.js 20.9+ (Node 22 LTS recommended)
- npm 10+

## Setup

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. Run the Express server concurrently with a configured MongoDB replica set. To populate the catalogue, use the Server's `npm run seed:catalog` after building, or set `SEED_DEMO_CATALOG=true` on the development Server.

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
- `/customer/transactions`
- `/admin`
- `/admin/services`
- `/admin/services/new`
- `/admin/services/[id]/edit`
- `/admin/appointments`
- `/admin/users`
- `/admin/transactions`
- `/admin/profile`

## Deployment

Set `SALONBOOK_API_URL` to the public HTTPS Express URL ending in `/api` before building on Vercel. The Client branch and backend must be deployed together because appointment availability and portal pagination use the updated API.

The explicitly labelled `/demo` routes use local preview data. Public and authenticated booking flows use the real API.

[Project status and server deployment](https://github.com/Abir-Hossan/SalonBook-Server/blob/completion/assignment-readiness/PROJECT_STATUS.md)
