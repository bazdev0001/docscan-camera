# DocScan Camera — Claude Code Context

## Architecture
- Expo Router for file-based routing (app/ directory)
- Firebase Auth for all authentication
- Firestore for document history (scanned_documents collection)
- TypeScript strict mode — no any types allowed
- All screens in app/(tabs)/ or app/(auth)/
- Shared components in components/
- Firebase logic in services/
- Custom hooks in hooks/
- Camera components in components/camera/

## App-Specific Context
- Dark theme (#000 background) — this is a camera app, dark UI is intentional
- Claude Vision API (fetch, not SDK) in services/aiService.ts
- Bundle ID: com.apex.docscancamera
- Main feature: scan documents with camera → analyze with Claude → save to Firestore

## Coding Standards
- Functional components only, no class components
- Custom hooks for all Firebase operations
- All async operations wrapped in try/catch
- No inline styles — use StyleSheet.create()
- All props typed with TypeScript interfaces in types/index.ts
- Export all components as named exports

## Testing Standards
- Every component gets a test in __tests__/components/
- Every hook gets a test in __tests__/hooks/
- Maestro flows in .maestro/flows/
- Run before every commit: tsc --noEmit && eslint . && jest

## Firebase Rules
- Always use useAuth hook for auth state
- Always use useFirestore hook for data operations
- Never call Firebase directly from components
- All Firestore collections defined as constants in constants/config.ts

## Common Patterns
- Loading states: use LoadingScreen component
- Error handling: log to Sentry, show user-friendly message
- Navigation: use Expo Router Link and router.push()
- Forms: controlled components with useState
- Camera: CameraViewComponent handles permissions internally

## Environment Variables
- EXPO_PUBLIC_CLAUDE_API_KEY — Claude Vision API key
- EXPO_PUBLIC_FIREBASE_API_KEY — Firebase project API key
- EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN
- EXPO_PUBLIC_FIREBASE_PROJECT_ID
- EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET
- EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- EXPO_PUBLIC_FIREBASE_APP_ID
- EXPO_PUBLIC_SENTRY_DSN
