/**
 * Auth Hook
 * Manages Firebase authentication state in React.
 */

import { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { signInAnonymous, signOut, onAuthChange } from '../firebase/authService';
import { enableCloudSync, syncToCloud, loadCloudSaveData } from '../persistence/storage';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthChange((user) => {
      setState({
        user,
        loading: false,
        error: null,
      });

      // Enable cloud sync when user is signed in
      enableCloudSync(user !== null);
    });

    return unsubscribe;
  }, []);

  const signIn = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const user = await signInAnonymous();
      // Sync local data to cloud after sign in
      await syncToCloud();
      return user;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign in failed',
      }));
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signOut();
      enableCloudSync(false);
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Sign out failed',
      }));
    }
  }, []);

  const loadFromCloud = useCallback(async () => {
    if (!state.user) return null;
    return loadCloudSaveData();
  }, [state.user]);

  return {
    user: state.user,
    isSignedIn: state.user !== null,
    loading: state.loading,
    error: state.error,
    signIn,
    logout,
    loadFromCloud,
  };
}
