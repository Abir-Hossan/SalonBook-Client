# SalonBook — Phase 01 Recovery & Verification Report

**Date:** 2026-11-19  
**Authorization:** Continue Phase 01 recovery only  
**Phase 02:** Not authorized; not started  
**Deployment:** Not performed

## Executive result

The dependency blocker is confirmed to be an environment-level DNS/network restriction, not a bad npm package version or a broken registry URL. The official registry is configured (`https://registry.npmjs.org/`), but DNS resolution returns `EAI_AGAIN` / `Temporary failure in name resolution`. No HTTP proxy is configured. The environment's resolver is `168.63.129.16`; both `registry.npmjs.org` and `www.google.com` fail DNS lookup.

The workspace has no `node_modules`, no `package-lock.json`, and no usable npm package cache. A clean, isolated npm cache was verified and contains zero cached package records. No untrusted mirror or package source was used.

**Result: Phase 01 remains blocked and is not complete.**

## 1. Workspace inventory

- Workspace: `salonbook-client`
- Files before recovery logs: 87 (the workspace now additionally contains verification logs and this report)
- 18 App Router page routes found.
- 34 TypeScript/TSX source files.
- 14 public image files.
- All 13 literal `/images/...` references resolve.
- All `@/` alias imports statically resolve to a source file.
- Existing source implementation and archived route-group attempt were preserved.
- No `.git` directory is present in this workspace.
- No backend repository or backend source was modified.

### Important package inventory

- `package.json`: present; dependencies and version ranges inspected.
- `package-lock.json`: **absent before and after recovery**. It was not deleted or regenerated.
- `node_modules`: absent before and after recovery.
- `.npmrc`: absent.
- No local Next.js, React, ESLint or Playwright npm package installation was found.
- Global Node.js: `v22.16.0`
- Global npm: `10.9.2`
- Globally installed TypeScript: `5.8.3`
- Global package inventory does not include Next.js, React, ESLint or the project's dependencies.

## 2. Registry/network diagnosis

### Verified commands

`npm config get registry`:
```text
https://registry.npmjs.org/
```

`npm ping --fetch-retries=0 --fetch-timeout=5000`:
```text
npm error code EAI_AGAIN
npm error syscall getaddrinfo
npm error request to https://registry.npmjs.org/-/ping failed,
reason: getaddrinfo EAI_AGAIN registry.npmjs.org
```

`curl -I --connect-timeout 5 --max-time 8 https://registry.npmjs.org/`:
```text
curl: (6) Could not resolve host: registry.npmjs.org
```

`/etc/resolv.conf`:
```text
nameserver 168.63.129.16
```

No HTTP, HTTPS or ALL proxy URL is configured in the process environment or npm configuration. The container has a default network route, but name resolution is failing. This report does not claim whether the DNS failure is caused by the host, sandbox policy, resolver outage, or upstream network configuration; the observed failure is DNS resolution from this execution environment.

## 3. Cache diagnosis

The default npm cache path `/home/oai/.npm` has root-owned directory metadata and contains only `_logs`; `_cacache` is absent. `npm cache verify` against the default path returned EACCES due to directory ownership.

To avoid modifying permissions or touching root-owned cache files, the recovery check used a separate cache path:
`/tmp/salonbook-npm-cache`

`npm cache verify --cache /tmp/salonbook-npm-cache`:
```text
Cache verified and compressed
Content verified: 0 (0 bytes)
Index entries: 0
```

An offline installation was attempted without allowing lockfile mutation:
```bash
npm install --offline --package-lock=false --ignore-scripts --no-audit --no-fund --cache /tmp/salonbook-npm-cache
```
It failed with `ENOTCACHED` because the official registry metadata for `@eslint/eslintrc` is not cached. No `package-lock.json` or `node_modules` was created.

## 4. Validation results

| Check | Result | Details |
|---|---|---|
| TS/TSX syntax parsing | PASS | TypeScript 5.8.3 transpile parser; 34 files, zero syntax diagnostics |
| Route inventory | PASS | 18 page routes discovered |
| `@/` alias import audit | PASS | No unresolved alias paths found |
| Local image reference audit | PASS | 13 references; zero missing files |
| `npm run typecheck` | BLOCKED | Global `tsc` runs, but Next/React/dependency type declarations are absent; module and JSX type errors cascade from missing packages |
| `npm run lint` | BLOCKED | `eslint` executable/package is not installed |
| `npm run build` | BLOCKED | `next` executable/package is not installed |
| `npm run dev` | BLOCKED | `next` executable/package is not installed |
| `npm run start` | BLOCKED | `next` executable/package is not installed |
| Real-browser route tests | NOT RUN | No runnable Next.js application |
| Nine viewport tests | NOT RUN | No runnable application to inspect |
| Browser console/network checks | NOT RUN | No application browser session |
| Actual implementation screenshots | NOT CAPTURED | No running frontend |
| Live Figma pixel comparison | NOT COMPLETED | Supplied PDF/contact sheet is available; live Figma MCP screenshot quota was previously exhausted |

### Exact quality-gate outputs

- `npm run typecheck` exits 1. The first errors report missing `next`, `next/link`, `react`, `sonner`, and absent JSX intrinsic element declarations. These are not a clean typecheck; a genuine typecheck must be repeated after installing dependencies.
- `npm run lint` exits 127: `eslint: Permission denied` (no local `node_modules/.bin` or global ESLint package exists).
- `npm run build` exits 127: `next: Permission denied` (no local Next.js installation exists).
- `npm run dev` and `npm run start` also exit 127 because Next.js is unavailable.

## 5. Viewport verification matrix

The following nine viewports are required. None can honestly be marked passed without a running application and rendered DOM.

| Viewport | Status |
|---|---|
| 320×568 | NOT RUN — app cannot start |
| 375×667 | NOT RUN — app cannot start |
| 390×844 | NOT RUN — app cannot start |
| 430×932 | NOT RUN — app cannot start |
| 768×1024 | NOT RUN — app cannot start |
| 1024×768 | NOT RUN — app cannot start |
| 1280×800 | NOT RUN — app cannot start |
| 1440×900 | NOT RUN — app cannot start |
| 1920×1080 | NOT RUN — app cannot start |

Chromium 144 and Playwright CLI 1.57.0 are present in the environment, but their presence does not substitute for a running Next.js app. No mock static page was presented as an application screenshot.

## 6. Dependency safety and version decisions

- No dependency version was changed during recovery.
- No package registry other than the official npm registry was used.
- No package was installed from a third-party mirror, arbitrary Git URL, or downloaded tarball.
- No lockfile was deleted.
- Since `package-lock.json` was already absent, the project currently lacks a pinned dependency resolution. Once official registry access is restored, the first successful `npm install` must generate and retain a lockfile. Future clean installs should use `npm ci`.

## 7. Reproducible recovery procedure

Run this from a network-enabled development environment, from the root of the unchanged `salonbook-client` directory.

### PowerShell (Windows)
```powershell
node --version
npm --version
npm config get registry

# Use only the official npm registry and a user-writable cache.
npm install --registry=https://registry.npmjs.org/ `
  --cache "$env:LOCALAPPDATA\npm-cache" `
  --no-audit

# Confirm npm created the dependency lockfile; preserve it.
Test-Path .\package-lock.json
npm ls --depth=0

npm run typecheck
npm run lint
npm run build

# Start the app after the build succeeds.
npm run start
```

For development/browser interaction instead of production mode:
```powershell
npm run dev
```

After the first successful online install, retain `package-lock.json` and use:
```powershell
npm ci
```
for subsequent clean, reproducible installations. Do not delete or regenerate the lockfile unless a deliberate dependency change is reviewed.

### Environment/network administrator
Allow DNS resolution and outbound HTTPS (TCP 443) to the official npm registry `registry.npmjs.org` from this execution environment, or provide a documented organization-controlled proxy that forwards to the official npm registry. Do not disable TLS verification and do not substitute an unknown registry mirror.

## 8. Required browser verification after installation

Once the app starts:
1. Use Chromium/Playwright against the actual local server.
2. Visit all 18 routes (including representative valid and invalid dynamic service IDs).
3. At each of the nine requested viewport sizes, inspect page width, horizontal overflow, header/sidebar behavior, cards, tables, form controls, text wrapping, and image cropping.
4. Capture real screenshots of the rendered implementation.
5. Record browser console errors, failed network requests, missing images, and hydration errors.
6. Compare matching public/customer/admin screens against the supplied Figma PDF/contact sheet. Document differences and fix those within frontend scope.
7. Re-run TypeScript, ESLint, and production build after fixes.
8. Update this report with evidence and actual results.

## 9. Phase boundary

No backend work, deployment, or Phase 02 implementation was performed. Phase 01 remains open. Wait for explicit user approval before Phase 02.
