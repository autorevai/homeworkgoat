/**
 * Storage Utilities
 * Handles saving and loading game data from localStorage and Firebase.
 */

import type { SaveData, AvatarConfig } from './types';
import { DEFAULT_AVATAR } from './types';
import { createInitialStats } from '../learning/learningEngine';
import { savePlayerData, loadPlayerData } from '../firebase/firestoreService';
import { getUserId } from '../firebase/authService';

const STORAGE_KEY = 'homework-goat-save';
const CURRENT_VERSION = 1;

// Track if we should sync to cloud
let cloudSyncEnabled = false;

export function enableCloudSync(enabled: boolean): void {
  cloudSyncEnabled = enabled;
}

export function isCloudSyncEnabled(): boolean {
  return cloudSyncEnabled;
}

/**
 * Create a fresh save data object with defaults
 */
export function createDefaultSaveData(): SaveData {
  return {
    saveVersion: CURRENT_VERSION,
    playerName: '',
    avatarConfig: { ...DEFAULT_AVATAR },
    xp: 0,
    completedQuestIds: [],
    unlockedCosmetics: [],
    learningStats: createInitialStats(),
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  };
}

/**
 * Load save data from localStorage
 * Returns default data if no save exists or if data is corrupted
 */
export function loadSaveData(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultSaveData();
    }

    const data = JSON.parse(raw) as SaveData;

    // Version check - migrate if needed in the future
    if (data.saveVersion !== CURRENT_VERSION) {
      console.warn('Save data version mismatch, using defaults');
      return createDefaultSaveData();
    }

    // Validate required fields exist
    if (!data.avatarConfig || typeof data.xp !== 'number') {
      console.warn('Save data corrupted, using defaults');
      return createDefaultSaveData();
    }

    // Ensure learning stats exist (for backwards compatibility)
    if (!data.learningStats) {
      data.learningStats = createInitialStats();
    }

    return data;
  } catch (error) {
    console.error('Failed to load save data:', error);
    return createDefaultSaveData();
  }
}

/**
 * Save data to localStorage (and Firebase if enabled)
 */
export function saveSaveData(data: SaveData): void {
  try {
    const toSave: SaveData = {
      ...data,
      lastPlayedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));

    // Also save to Firebase if cloud sync is enabled
    if (cloudSyncEnabled) {
      const userId = getUserId();
      if (userId) {
        savePlayerData(userId, toSave).catch((error) => {
          console.error('Failed to sync to cloud:', error);
        });
      }
    }
  } catch (error) {
    console.error('Failed to save data:', error);
  }
}

/**
 * Load save data from Firebase (cloud)
 */
export async function loadCloudSaveData(): Promise<SaveData | null> {
  const userId = getUserId();
  if (!userId) return null;

  try {
    return await loadPlayerData(userId);
  } catch (error) {
    console.error('Failed to load cloud save:', error);
    return null;
  }
}

/**
 * Sync local save data to cloud
 */
export async function syncToCloud(): Promise<boolean> {
  const userId = getUserId();
  if (!userId) return false;

  try {
    const localData = loadSaveData();
    await savePlayerData(userId, localData);
    return true;
  } catch (error) {
    console.error('Failed to sync to cloud:', error);
    return false;
  }
}

/**
 * Check if a save exists
 */
export function hasSaveData(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}

/**
 * Clear all save data (reset progress)
 */
export function clearSaveData(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Update just the avatar config
 */
export function updateAvatarConfig(config: AvatarConfig): void {
  const data = loadSaveData();
  data.avatarConfig = config;
  saveSaveData(data);
}

/**
 * Update player name
 */
export function updatePlayerName(name: string): void {
  const data = loadSaveData();
  data.playerName = name;
  saveSaveData(data);
}

/**
 * Add XP and save
 */
export function addXp(amount: number): SaveData {
  const data = loadSaveData();
  data.xp += amount;
  saveSaveData(data);
  return data;
}

/**
 * Mark a quest as completed
 */
export function completeQuest(questId: string): SaveData {
  const data = loadSaveData();
  if (!data.completedQuestIds.includes(questId)) {
    data.completedQuestIds.push(questId);
  }
  saveSaveData(data);
  return data;
}

/**
 * Check if a quest is completed
 */
export function isQuestCompleted(questId: string): boolean {
  const data = loadSaveData();
  return data.completedQuestIds.includes(questId);
}
