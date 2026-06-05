# DocScan Camera

AI-powered document scanner for iOS and Android using Expo React Native and Claude Vision API.

## Overview

DocScan Camera is a mobile app that captures documents using your device's camera and uses Claude's Vision API to extract and analyze text and structured data fields.

**Features:**
- Full-screen camera capture with grid overlay
- Flash toggle and grid visibility controls
- Photo preview and retake
- AI-powered document analysis using Claude Sonnet 4 Vision
- Extracted field display (with empty field handling)
- JSON export functionality

## Tech Stack

- **Framework:** Expo React Native with TypeScript
- **Navigation:** React Navigation (Native Stack)
- **Camera:** expo-camera
- **File System:** expo-file-system
- **API:** Anthropic Claude Sonnet 4 Vision Model
- **UI/UX:** React Native StyleSheet (dark theme)

## Project Structure

```
src/
├── types/
│   └── index.ts              # TypeScript interfaces
├── config/
│   └── index.ts              # API configuration
├── services/
│   └── aiService.ts          # Claude Vision API integration
├── components/
│   ├── CameraView.tsx        # Camera capture component
│   ├── DocumentPreview.tsx   # Photo preview & confirm
│   ├── AnalysisView.tsx      # Results display & export
│   └── FieldRenderer.tsx     # Individual field renderer
└── screens/
    ├── HomeScreen.tsx        # App home/launcher
    └── ScanScreen.tsx        # Scan orchestration
App.tsx                        # Navigation & theming
```

## Setup

### Prerequisites
- Node.js 16+ and npm
- Anthropic API key (Claude Sonnet 4)
- iOS or Android device (or emulator)

### Installation

1. Clone and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

3. Run the app:
```bash
npm start        # Development
npm run ios      # iOS (macOS only)
npm run android  # Android
npm run web      # Web (experimental)
```

## Usage

1. **Open app** - See home screen with camera icon
2. **Tap "Scan Document"** - Navigate to camera
3. **Capture photo** - Use camera controls to snap document
   - Toggle **Grid** to show/hide alignment guide
   - Toggle **Flash** for low-light shots
4. **Review & analyze** - Confirm photo quality and tap "Analyze Document"
5. **View results** - See extracted fields displayed
6. **Export** - Save results as JSON or scan again

## API Integration

### Claude Vision Extraction

The app sends photos to Claude Sonnet 4 for structured extraction:

- **Input:** JPEG image (base64) + extraction prompt
- **Output:** JSON array of fields with label, key, and value
- **Empty handling:** Unreadable documents return `{"label": "Status", "key": "status", "value": "empty"}`
- **Error handling:** API errors display gracefully with retry option

### Configuration

Edit `src/config/index.ts` to change:
- `ANTHROPIC_API_KEY` - Your API key (from .env)
- `MODEL` - Claude model version (default: claude-3-5-sonnet-20241022)

## Components

### CameraView
- Full-screen camera with expo-camera
- 3×3 grid overlay (blue lines at 33%/66%)
- Flash toggle button
- Grid toggle button
- Capture button (centered, bottom)

### DocumentPreview
- Full-screen photo display
- "Retake" button (top left)
- "Analyze Document" button (center bottom)
- Loading spinner during analysis

### AnalysisView
- Scrollable results view
- Field renderer for each extracted item
- "Empty" placeholder for null/missing values
- Export button (JSON download/share)
- "Scan Again" button (return to camera)

### FieldRenderer
- Displays label + value pair
- Gray italic "Empty" for null values
- Dark theme styling

## Theming

**Dark Theme Colors:**
- Background: `#000000`
- Surface: `#12121a`
- Accent (indigo): `#6366f1`
- Text: `#ffffff`
- Dim text: `#aaa`, `#888`
- Borders: `#1a1a24`

All screens use dark theme with light text for contrast.

## Error Handling

- **Camera permission denied** - Alert + fallback message
- **Capture failure** - Alert with retry option
- **API errors** - Display error message with retry option
- **Empty documents** - Returns "empty" status field
- **Export errors** - Alert with user-friendly message

## Development

### Build locally
```bash
npm start
```

### Type checking
```bash
npx tsc --noEmit
```

### File size management
- Images are resized to 80% quality for API transfer
- Base64 encoding keeps payload reasonable (~200-500KB per image)

## Next Steps

1. Implement in-app document library (saved scans)
2. Add batch processing (multiple pages)
3. Fine-tune extraction schema for specific document types
4. Add offline mode for retries
5. Implement user accounts and cloud sync

## License

Private project for testing. Do not redistribute.
