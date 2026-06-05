import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { ScanScreen } from './src/screens/ScanScreen';

type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const darkTheme = {
  dark: true,
  colors: {
    primary: '#6366f1',
    background: '#000',
    card: '#000',
    text: '#fff',
    border: '#333',
    notification: '#6366f1',
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400' as const,
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500' as const,
    },
    bold: {
      fontFamily: 'System',
      fontWeight: '700' as const,
    },
    heavy: {
      fontFamily: 'System',
      fontWeight: '800' as const,
    },
  },
};

export default function App() {
  return (
    <NavigationContainer theme={darkTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            presentation: 'fullScreenModal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
