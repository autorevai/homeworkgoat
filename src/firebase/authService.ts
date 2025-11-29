/**
 * Firebase Auth Service
 * Handles student authentication - anonymous sign-in for easy access.
 */

import {
  signInAnonymously,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { auth } from './config';

/**
 * Sign in anonymously - perfect for young students who don't need accounts
 */
export async function signInAnonymous(): Promise<User> {
  const result = await signInAnonymously(auth);
  return result.user;
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Get the current user (or null if not signed in)
 */
export function getCurrentUser(): User | null {
  return auth.currentUser;
}

/**
 * Subscribe to auth state changes
 */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get the current user's ID (or null)
 */
export function getUserId(): string | null {
  return auth.currentUser?.uid ?? null;
}
