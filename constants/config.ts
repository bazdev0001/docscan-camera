export const Collections = {
  USERS: 'users',
  SCANNED_DOCUMENTS: 'scanned_documents',
  NOTIFICATIONS: 'notifications',
} as const;

export const AppConfig = {
  appName: 'DocScan Camera',
  appSlug: 'docscan-camera',
  bundleId: 'com.apex.docscancamera',
  version: '1.0.0',
  sentryDsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
} as const;

export const ClaudeConfig = {
  apiKey: process.env.EXPO_PUBLIC_CLAUDE_API_KEY ?? '',
  model: 'claude-sonnet-4-20250514',
  maxImageSize: 4 * 1024 * 1024,
} as const;
