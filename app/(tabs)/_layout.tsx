import React from 'react';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function TabLayout(): React.JSX.Element {
  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: Colors.primary,
      tabBarStyle: { backgroundColor: Colors.surface },
      tabBarInactiveTintColor: Colors.textSecondary,
      headerShown: false,
    }}>
      <Tabs.Screen name="camera" options={{ title: 'Scan' }} />
      <Tabs.Screen name="history" options={{ title: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
