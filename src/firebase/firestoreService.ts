/**
 * Firestore Service
 * Handles saving and loading player data to/from Firebase.
 */

import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { SaveData } from '../persistence/types';

const PLAYERS_COLLECTION = 'players';

export interface FirestoreSaveData extends Omit<SaveData, 'lastPlayedAt' | 'createdAt'> {
  lastPlayedAt: Timestamp;
  createdAt: Timestamp;
}

/**
 * Save player data to Firestore
 */
export async function savePlayerData(userId: string, data: SaveData): Promise<void> {
  const playerRef = doc(db, PLAYERS_COLLECTION, userId);

  const firestoreData = {
    ...data,
    lastPlayedAt: serverTimestamp(),
  };

  // Check if document exists
  const docSnap = await getDoc(playerRef);

  if (docSnap.exists()) {
    await updateDoc(playerRef, firestoreData);
  } else {
    await setDoc(playerRef, {
      ...firestoreData,
      createdAt: serverTimestamp(),
    });
  }
}

/**
 * Load player data from Firestore
 */
export async function loadPlayerData(userId: string): Promise<SaveData | null> {
  const playerRef = doc(db, PLAYERS_COLLECTION, userId);
  const docSnap = await getDoc(playerRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data() as FirestoreSaveData;

  // Convert Firestore timestamps to numbers
  return {
    ...data,
    lastPlayedAt: data.lastPlayedAt?.toDate?.()?.getTime() ?? Date.now(),
    createdAt: data.createdAt?.toDate?.()?.getTime() ?? Date.now(),
  } as SaveData;
}

/**
 * Check if player data exists in Firestore
 */
export async function playerDataExists(userId: string): Promise<boolean> {
  const playerRef = doc(db, PLAYERS_COLLECTION, userId);
  const docSnap = await getDoc(playerRef);
  return docSnap.exists();
}
