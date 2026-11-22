# SalonBook Phase 04 Part 2

## Integration

The Next.js application proxies the native Better Auth paths under the frontend origin. Email and password flows use those paths. The server-rendered account resolver forwards the recognized session cookies to the existing SalonBook account endpoint to obtain current role and block status. The dashboard uses the existing sign-out endpoint to revoke both native and legacy sessions.

Google sign-in starts at the native Better Auth endpoint and uses the frontend origin for the callback. The return page checks the actual session before giving a customer a route back to the preserved booking or routing an administrator to their dashboard. The sign-up and sign-in links retain the opaque booking identifier. The selected service, date and time are stored in the originating tab. The appointment is created only when the customer submits the restored form.

Part 1 server files and database models were preserved. Changes are in `next.config.ts`, `src/lib/browser-auth.ts`, `src/lib/server-account.ts`, `src/app/sign-in/page.tsx`, `src/components/auth-form.tsx`, `src/components/booking-preview.tsx` and `src/components/dashboard-shell.tsx`.

## Environment

- Set Client `SALONBOOK_API_URL` to the Express `/api` base when building and starting the Client.
- Set server `BETTER_AUTH_URL` to the public Client origin, without a path. That origin must serve the Next.js Better Auth proxy.
- Set server `CLIENT_URL` to that same origin and include the exact origin in `ALLOWED_ORIGINS`. Use HTTPS for production. Keep `BETTER_AUTH_SECRET` and the configured replica-set connection server-side.
- With an authorized Google test project, set both Google variables on the server and register `<public-client-origin>/api/better-auth/callback/google`. Keep the legacy callback registered only if applications still use it.
- The existing environment files were not written and verification used an isolated loopback MongoDB replica set.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Client typecheck and lint | PASS | Both commands exited 0. |
| Client production build | PASS | Next.js 15.5.29 completed the production build and generated 23 static outputs. The Windows workspace returned EPERM on nested output-directory creation. An isolated build runner retried that operation with recursive directory creation. The workaround was confined to the verification runner. |
| Real browser authentication and booking | PASS | Chrome 157 against the production Next.js build and local MongoDB. Checked registration and password visibility, invalid and valid sign-in, HttpOnly / SameSite=Lax cookie, sign-out and cookie removal, protected customer access, wrong-role admin access, expired and blocked sessions, draft survival through refresh and sign-up, restored login and registration details, and one persisted booking after explicit submission. |
| Responsive auth smoke checks | PASS | Both authentication pages opened and rendered visible forms without horizontal overflow at 390, 768 and 1440 CSS pixels. |
| Browser Google flow with mock provider | PASS | Chrome verified PKCE initiation, the callback proxy, HttpOnly cookie and booking resume. Google navigation and the token exchange were locally intercepted for the controlled test. |
| Server typecheck, lint and build | PASS | Commands exited 0. |
| Server regression suite | PASS | 83 passed, including local MongoDB auth tests and mocked OAuth. |
| Phase 03 live Atlas | SKIPPED / OPEN | Six tests require a dedicated Atlas URI, which was unavailable. |
| Live Google and production HTTPS | NOT VERIFIED | Live Google credentials and a deployed HTTPS endpoint were unavailable. Production database records were outside the test scope. |

Production acceptance still needs the registered Google callback and live authorization flow, deployed HTTPS cookie and proxy verification, and the independent Atlas suite. Password recovery and Apple remain unavailable. This verification covered the auth and booking scope, with no new Stripe or external image-provider acceptance run.

## References

- [Better Auth Google OAuth setup](https://better-auth.com/docs/authentication/google)
- [Next.js rewrites](https://nextjs.org/docs/app/api-reference/config/next-config-js/rewrites)
