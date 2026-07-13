# DocScan Camera — Development & Build Guide

*Engineering onboarding, local dev, testing, and release process.*
*Standard format shared across the Apex portfolio — see `bankruptcy-app/docs/DEVELOPMENT.md`
for the reference version this was modeled on. Keep these in sync when the pattern changes.*

## 1. Architecture

| Layer | Tech | Location |
|---|---|---|
| Mobile client | React Native (Expo SDK 57, expo-router) | `app/` |
| Auth + data | Firebase Auth + Firestore | `services/firebase.ts`, `services/firestore.ts` |
| Document OCR/extraction | Claude Vision API (Sonnet 4, direct fetch) | `services/aiService.ts` |
| Local file storage | expo-file-system (photos + metadata) | `services/storage.ts` |
| Error tracking | Sentry (`@sentry/react-native`) | `app/_layout.tsx`, disabled in dev |
| Push notifications | expo-notifications | `services/notifications.ts` |

Camera → Claude Vision → structured JSON fields is the core flow (`app/(tabs)/camera.tsx`
orchestrates capture → preview → analyze → results). Firestore stores document history per
user; the raw photo stays local via expo-file-system.

**Note (2026-07-13):** this app was Phase-2 migrated (2026-07-12, see repo's own
`DECISIONS.md`) from a plain React Navigation + local-storage-only app to the current
expo-router + Firebase + Sentry design. The root `README.md` still describes the old
pre-migration run commands (`expo start`) — do not follow it; this doc is current.

## 2. Local setup

```bash
git clone https://github.com/bazdev0001/docscan-camera
cd docscan-camera && npm install
```

Requires a `.env` (copy `.env.example`) with:
- `EXPO_PUBLIC_FIREBASE_*` — Firebase console → Project settings → your web app
- `EXPO_PUBLIC_CLAUDE_API_KEY` — this app's own Claude API key (see §6 for why it's a separate
  var from `EXPO_PUBLIC_ANTHROPIC_API_KEY`)

### Running the app
```bash
npx expo run:ios        # NOT "expo start" — SDK 57 + Expo Go version mismatch,
                         # same trap as bankruptcy-app. Always use run:ios for a dev-client build.
```

## 3. Testing

### TypeScript
```bash
npx tsc --noEmit         # strict mode — verified clean 2026-07-13
```

### Unit tests
```bash
npx jest                 # verified 6/6 passing 2026-07-13 (Button, useAuth)
```

### End-to-end UI test (Maestro)
```bash
brew install --cask temurin   # Java required, one-time
maestro test .maestro/flows/smoke.yaml
```
Current coverage: sign-in screen fields render, sign-up navigation, back-navigation. Does
**not** yet cover the logged-in flows (camera capture, Claude Vision analysis, document
history) — those need a seeded Firebase test account, not set up yet.

## 4. Release / build pipeline

- iOS builds go through EAS → TestFlight → App Store Connect.
- `eas.json` submit config has `ascAppId: ""` — **the App Store Connect app record does not
  exist yet for this app**, same as reminder-app. Same manual/browser-automation step
  bankruptcy-app needed.
- Bundle ID: `com.apex.docscancamera`. EAS project ID:
  `6cba3039-35e2-43d2-819b-12a0257d43e8` (already set in `app.config.ts`).
- EAS billing is metered (account `bazdev0001`) — check
  `expo.dev/accounts/bazdev0001/settings/billing` before large batches of rebuilds.

## 5. Team roles

| Who | Runs where | Responsibility |
|---|---|---|
| Sage | VPS / has Firebase + Apple credentials | EAS submit, App Store Connect record creation, portfolio-wide decisions |
| MCC ("MacAir Claude Code") | Barry's Mac | Local builds, Simulator launches, Maestro test execution |
| Claude (Cowork) | Cloud, has direct GitHub clone access to public repos | Code review/fixes, doc maintenance, orchestration |

## 6. Common pitfalls (fixed once, documented so they don't recur)

- **`expo start`** — do not use, same as every other Expo-57 app in this portfolio. Always
  `npx expo run:ios`.
- **Two Claude API key env vars exist**: `EXPO_PUBLIC_ANTHROPIC_API_KEY` (used by the original
  `aiService.ts`) and `EXPO_PUBLIC_CLAUDE_API_KEY` (used by the newer `constants/config.ts`
  from the Phase 2 migration). Per the repo's own `DECISIONS.md` (D7), the resolution is:
  `constants/config.ts` is the source of truth and uses `EXPO_PUBLIC_CLAUDE_API_KEY`;
  `aiService.ts` was updated to read from that config rather than the old var directly. Set
  `EXPO_PUBLIC_CLAUDE_API_KEY` in `.env`, not the Anthropic-named one.
- **`ascAppId` is empty in `eas.json`** — App Store Connect record doesn't exist yet; `eas
  submit` will fail until it's created (see §4).
- **STATUS.md may read as more/less complete than reality** — this repo had a stale
  `STATUS.md` (dated 2026-06-05, pre-migration) claiming "100% production ready" while Barry's
  own tracking said 80%. Verified 2026-07-13: the migrated code is genuinely solid (typecheck
  + tests both pass), but always verify claims live (`tsc --noEmit`, `jest`) rather than trust
  a status doc's date-stamped claim without checking it.
