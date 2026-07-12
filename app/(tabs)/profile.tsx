import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { signOut } from '../../services/auth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Colors } from '../../constants/colors';

export default function ProfileScreen(): React.JSX.Element {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignOut = async (): Promise<void> => {
    try {
      setLoading(true);
      await signOut();
    } catch (error) {
      Alert.alert('Error', 'Could not sign out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <Card>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email ?? 'Not available'}</Text>
      </Card>

      <Button
        title="Sign Out"
        onPress={handleSignOut}
        loading={loading}
        variant="outline"
        style={styles.signOutButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: Colors.text,
  },
  signOutButton: {
    marginTop: 32,
  },
});
