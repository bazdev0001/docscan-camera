import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChanged } from '../services/auth';

interface AuthState {
  user: User | null;
  loading: boolean;
}

export const useAuth = (): AuthState => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((firebaseUser: User | null) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading };
};
