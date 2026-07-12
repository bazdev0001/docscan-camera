# DocScan Camera

> AI-powered document scanner for iOS and Android — capture, extract, export.

## What It Does
DocScan Camera is a mobile app that uses the device camera to photograph documents and sends them to Claude Vision (Sonnet 4) for structured field extraction. Results are displayed as labelled key-value pairs and can be exported as JSON. Documents are saved locally on-device using expo-file-system — no cloud storage by default.

## Tech Stack
- Language: TypeScript (strict mode, zero errors)
- Framework: Expo ~56 / React Native 0.85 / React 19
- Key deps: `expo-camera`, `expo-file-system`, `expo-sharing`, `@react-navigation/native-stack`, Anthropic API (direct fetch, no SDK)

## Key Features
- Full-screen camera with grid overlay and flash toggle for document alignment
- Claude Sonnet 4 Vision integration — base64 image → structured JSON fields
- Local document storage with per-document metadata (ID, timestamp, photo, analysis)
- JSON export via native share dialog
- Dark theme (indigo accent `#6366f1`) throughout all screens
- Graceful error handling: permission denied, empty documents, API failures

## How to Run
```bash
npm install
# Add EXPO_PUBLIC_ANTHROPIC_API_KEY to .env
npm start              # Expo dev server
npx expo start --ios   # iOS (macOS only)
npx expo start --android
npx expo start --web   # experimental
```

Production export:
```bash
npx expo export --platform ios --output-dir dist
```

## Status
Working — production-ready MVP (v1.0.0, 2026-06-05). iOS bundle exported successfully (2.1 MB). TypeScript compiles clean. Not yet submitted to App Store.
