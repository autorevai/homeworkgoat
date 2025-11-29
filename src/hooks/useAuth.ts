/**
 * Auth Hook
 * Manages Firebase authentication state in React.
 */

import { useState, useEffect, useCallback } from 'react';
import type { User } from 'firebase/auth';
import { signInAnonymous, signOut, onAuthChange } from '../firebase/authService';
import { enableCloudSync, syncToCloud, loadCloudSaveData } from '../persistence/storage';
import { logger } from '../utils/logger';

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
      if (user) {
        logger.auth.sessionRestored(user.uid);
      }
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
    logger.auth.signInStarted();
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const user = await signInAnonymous();
      logger.auth.signInSuccess(user.uid, user.isAnonymous);
      // Sync local data to cloud after sign in
      await syncToCloud();
      return user;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      logger.auth.signInError(errorMessage);
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    logger.auth.signOut();
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      await signOut();
      enableCloudSync(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign out failed';
      logger.error('auth', 'sign_out_error', { error: errorMessage });
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
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
