# docscan-camera — DECISIONS.md

## Phase 2 — APEX App Factory Migration

### Date: 2026-07-12

---

## What Existed (Phase 1 Baseline)

- React Navigation (native-stack) — NOT expo-router
- App.tsx with 2-screen stack: Home, Scan
- src/screens/: HomeScreen.tsx, ScanScreen.tsx, DocumentLibrary.tsx
- src/components/: CameraView.tsx, AnalysisView.tsx, DocumentPreview.tsx, FieldRenderer.tsx
- src/services/aiService.ts — Claude Vision via fetch (EXPO_PUBLIC_ANTHROPIC_API_KEY)
- src/services/storage.ts — expo-file-system local storage
- src/types/index.ts, src/config/index.ts
- package.json: expo ~56.0.8, react-navigation, expo-camera, expo-file-system, expo-sharing
- tsconfig.json: extends expo/tsconfig.base, strict: true (missing types: ["jest"])
- NO: jest.config.js, eslint.config.js, eas.json, app.config.ts, .github/workflows/ci.yml
- NO: scripts/pre-push.sh, .maestro/, .claudecode/, Firebase, Sentry, expo-router

---

## Technical Decisions

### D1: Navigation — migrate to expo-router
- **Decided**: Migrate from @react-navigation/native + @react-navigation/native-stack to expo-router
- **Rationale**: APEX standard pattern; file-based routing; required by template; enables typedRoutes
- **Impact**: Remove react-navigation packages; restructure screens to app/ directory

### D2: Bundle ID — com.apex.docscancamera
- **Decided**: Use `com.apex.docscancamera` for both iOS and Android
- **Rationale**: APEX fleet convention; instructed in Phase 2 spec

### D3: Auth — Firebase Auth
- **Decided**: Add Firebase Auth (sign-in, sign-up, sign-out)
- **Rationale**: APEX standard; template already implements full auth flow
- **Implementation**: services/firebase.ts, services/auth.ts, hooks/useAuth.ts

### D4: Storage — Firestore (primary) + local file system (retained)
- **Decided**: Add Firestore for document history; retain expo-file-system
- **Rationale**: Cloud sync + persistence; template pattern
- **Collections**: scanned_documents (per userId)

### D5: Error tracking — @sentry/react-native
- **Decided**: Use @sentry/react-native
- **Rationale**: APEX standard; initialized in app/_layout.tsx; disabled in dev mode
- **DSN**: via EXPO_PUBLIC_SENTRY_DSN env var

### D6: Push notifications — expo-notifications
- **Decided**: Add expo-notifications with registerForPushNotificationsAsync
- **Rationale**: APEX standard feature set
- **Token storage**: Not yet persisted to Firestore (Phase 3 concern)

### D7: Claude API key env var
- **Decided**: Keep EXPO_PUBLIC_ANTHROPIC_API_KEY (existing) AND add EXPO_PUBLIC_CLAUDE_API_KEY
- **Rationale**: aiService.ts used EXPO_PUBLIC_ANTHROPIC_API_KEY; constants/config.ts uses EXPO_PUBLIC_CLAUDE_API_KEY
- **Resolution**: constants/config.ts uses EXPO_PUBLIC_CLAUDE_API_KEY; aiService.ts updated to use ClaudeConfig

### D8: Remove @anthropic-ai/sdk
- **Decided**: Remove from package.json; aiService.ts already uses fetch directly
- **Rationale**: Keeps bundle smaller; fetch is already working

### D9: Expo version upgrade
- **Decided**: Upgrade expo ~56.0.8 → ~57.0.4, react-native 0.85.3 → 0.86.0
- **Rationale**: Template uses 57.0.4; required for expo-router compatibility

### D10: app.json → app.config.ts
- **Decided**: Replace app.json with app.config.ts
- **Rationale**: TypeScript config enables dynamic env var injection; APEX standard

### D11: Dark theme
- **Decided**: docscan-camera uses DARK theme (#000 background, not #fff)
- **Rationale**: Existing app uses dark UI; camera apps work better dark
- **Implementation**: constants/colors.ts uses dark palette (overrides template's light palette)

---

## EAS Status

- **BLOCKED**: EAS build requires Apple Developer credentials and Expo account login
- `npx eas-cli build --platform ios --profile preview --non-interactive` fails without auth
- Decision: Document as blocked; EAS setup is a Phase 3/DevOps concern

---

## Files Created/Modified in Phase 2

### New files (from template):
- jest.config.js
- eslint.config.js
- scripts/pre-push.sh
- .github/workflows/ci.yml
- .maestro/flows/smoke.yaml
- .claudecode/CLAUDE.md
- eas.json
- app.config.ts

### New files (docscan-specific):
- app/_layout.tsx
- app/(auth)/_layout.tsx
- app/(auth)/sign-in.tsx
- app/(auth)/sign-up.tsx
- app/(tabs)/_layout.tsx
- app/(tabs)/camera.tsx
- app/(tabs)/history.tsx
- app/(tabs)/profile.tsx
- components/common/LoadingScreen.tsx
- components/ui/Button.tsx
- components/ui/Input.tsx
- components/ui/Card.tsx
- components/camera/CameraViewComponent.tsx
- components/camera/DocumentPreview.tsx
- components/camera/AnalysisView.tsx
- components/camera/FieldRenderer.tsx
- constants/colors.ts (dark theme)
- constants/config.ts
- hooks/useAuth.ts
- hooks/useFirestore.ts
- services/firebase.ts
- services/auth.ts
- services/firestore.ts
- services/aiService.ts (updated)
- services/notifications.ts
- types/index.ts (merged)
- __tests__/components/Button.test.tsx
- __tests__/hooks/useAuth.test.ts

### Modified:
- package.json (upgraded, added deps)
- tsconfig.json (added types: ["jest"])
- index.ts (expo-router entry)
- .env.example (updated)

### Deleted (logical — old files now unused):
- App.tsx (replaced by expo-router)
- app.json (replaced by app.config.ts)
- src/ directory (all files moved to new structure)
