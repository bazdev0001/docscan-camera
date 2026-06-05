import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Scan: undefined;
};

type HomeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'Home'
>;

export function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>DocScan</Text>
        <Text style={styles.subtitle}>
          AI-Powered Document Scanner
        </Text>

        <View style={styles.iconContainer}>
          <Text style={styles.icon}>📄</Text>
        </View>

        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('Scan')}
        >
          <Text style={styles.scanButtonText}>Scan Document</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 60,
    textAlign: 'center',
  },
  iconContainer: {
    marginBottom: 60,
  },
  icon: {
    fontSize: 80,
  },
  scanButton: {
    backgroundColor: '#6366f1',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
