import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '../../hooks/useAuth';

// Mock firebase auth
jest.mock('../../services/auth', () => ({
  onAuthStateChanged: (callback: (user: null) => void): (() => void) => {
    // Simulate async auth state resolution
    setTimeout(() => callback(null), 0);
    return jest.fn(); // unsubscribe function
  },
}));

describe('useAuth', () => {
  it('returns loading true initially', async () => {
    const { result } = await renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
    expect(result.current.user).toBeNull();
  });

  it('returns null user when signed out', async () => {
    const { result } = await renderHook(() => useAuth());
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeNull();
  });
});
