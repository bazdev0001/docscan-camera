import { ExpoConfig, ConfigContext } from 'expo/config';
export default ({ config }: ConfigContext): ExpoConfig => ({
  ...(config as ExpoConfig),
  name: 'DocScan Camera',
  slug: 'docscan-camera',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'dark',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.apex.docscancamera',
    infoPlist: {
      NSCameraUsageDescription: 'DocScan Camera needs camera access to scan documents',
    },
  },
  android: {
    package: 'com.apex.docscancamera',
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
      backgroundColor: '#000000',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      { cameraPermission: 'DocScan Camera needs camera access to scan documents' },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/icon.png',
        color: '#6366f1',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    eas: {
      projectId: '6cba3039-35e2-43d2-819b-12a0257d43e8',
    },
  },
});
