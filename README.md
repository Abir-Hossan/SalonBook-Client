# SalonBook Client

SalonBook is a salon appointment booking application. This repository contains the Next.js frontend for the public catalogue, customer portal, and administration dashboard. The companion [SalonBook Server](https://github.com/Abir-Hossan/SalonBook-Server) provides the API and stores application data.

## What the app does

| Area | Features |
| --- | --- |
| Public catalogue | Browse, search, filter, and sort services. View service details and available times. |
| Customer portal | Create an account, request an appointment, manage upcoming bookings, and view payment history. |
| Admin dashboard | Manage services and customers, confirm appointments, and review transactions. |

A customer submits a booking request, an administrator confirms it, and the customer can then pay for the confirmed appointment using Stripe Checkout in test mode. A draft can be resumed in the originating browser tab after sign-in. The `/demo` pages use local sample data.

## Local setup

Use Node.js 24 and npm 10 or newer. Start the [companion API](https://github.com/Abir-Hossan/SalonBook-Server#local-setup) with a local MongoDB replica set.

```bash
npm ci
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The example environment points `SALONBOOK_API_URL` to `http://127.0.0.1:5000/api`. Keep the frontend origin consistent with the Server's authentication and CORS settings. If the catalogue is empty, seed the local database from the Server repository.

## Verification

```bash
node --test tests/api-target.test.mjs
npm run typecheck
npm run lint
npm run build
```

The GitHub Actions browser job runs the booking smoke test in Chromium against the companion API and a disposable MongoDB replica set.

## Deployment

Set `SALONBOOK_API_URL` in the Vercel environment to the corresponding HTTPS API URL ending in `/api`. Use independent Preview and Production values. The Server must trust the exact browser origin used for authentication. For a protected Preview, sign in to Vercel in the same browser used to test provider redirects.

Verify a deployment with the frontend's `/salon-api/health` route and the API's `/api/ready` route. For screen references and asset provenance, see the [design mapping](FIGMA_SCREEN_MAPPING.md).
