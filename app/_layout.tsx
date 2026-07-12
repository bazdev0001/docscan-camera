import React, { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as Sentry from '@sentry/react-native';
import { useAuth } from '../hooks/useAuth';
import { LoadingScreen } from '../components/common/LoadingScreen';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN ?? '',
  enabled: !__DEV__,
});

export default function RootLayout(): React.JSX.Element {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === '(auth)';
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/sign-in');
    } else if (user && inAuthGroup) {
      router.replace('/(tabs)/camera');
    }
  }, [user, loading, segments, router]);

  if (loading) return <LoadingScreen />;
  return <Slot />;
}
