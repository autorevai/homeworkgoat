/**
 * Storage Utilities
 * Handles saving and loading game data from localStorage and Firebase.
 */

import type { SaveData, AvatarConfig } from './types';
import { createDefaultSaveData as createDefaultSaveDataFromTypes, CURRENT_SAVE_VERSION, migrateSaveData } from './types';
import { savePlayerData, loadPlayerData } from '../firebase/firestoreService';
import { getUserId } from '../firebase/authService';
import { logger } from '../utils/logger';

const STORAGE_KEY = 'homework-goat-save';

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
  return createDefaultSaveDataFromTypes();
}

/**
 * Load save data from localStorage
 * Returns default data if no save exists or if data is corrupted
 */
export function loadSaveData(): SaveData {
  logger.storage.localLoadStarted();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      logger.storage.localLoadSuccess(false);
      return createDefaultSaveData();
    }

    const data = JSON.parse(raw) as SaveData;

    // Version check - migrate if needed
    if (data.saveVersion !== CURRENT_SAVE_VERSION) {
      logger.warn('storage', 'save_version_mismatch', { found: data.saveVersion, expected: CURRENT_SAVE_VERSION });
      // Migrate old data to new format
      return migrateSaveData(data);
    }

    // Validate required fields exist
    if (!data.avatarConfig || typeof data.xp !== 'number') {
      logger.warn('storage', 'save_data_corrupted', { hasAvatar: !!data.avatarConfig, xpType: typeof data.xp });
      return createDefaultSaveData();
    }

    logger.storage.localLoadSuccess(true);
    return data;
  } catch (error) {
    logger.storage.localLoadError(error instanceof Error ? error.message : 'Unknown error');
    return createDefaultSaveData();
  }
}

/**
 * Save data to localStorage (and Firebase if enabled)
 */
export function saveSaveData(data: SaveData): void {
  logger.storage.localSaveStarted();
  try {
    const toSave: SaveData = {
      ...data,
      lastPlayedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    logger.storage.localSaveSuccess();

    // Also save to Firebase if cloud sync is enabled
    if (cloudSyncEnabled) {
      const userId = getUserId();
      if (userId) {
        logger.storage.cloudSyncStarted();
        savePlayerData(userId, toSave)
          .then(() => {
            logger.storage.cloudSyncSuccess();
          })
          .catch((error) => {
            logger.storage.cloudSyncError(error instanceof Error ? error.message : 'Unknown error');
          });
      }
    }
  } catch (error) {
    logger.storage.localSaveError(error instanceof Error ? error.message : 'Unknown error');
  }
}

/**
 * Load save data from Firebase (cloud)
 */
export async function loadCloudSaveData(): Promise<SaveData | null> {
  const userId = getUserId();
  if (!userId) {
    logger.debug('storage', 'cloud_load_skipped_no_user');
    return null;
  }

  logger.storage.cloudLoadStarted();
  try {
    const data = await loadPlayerData(userId);
    logger.storage.cloudLoadSuccess(data !== null);
    return data;
  } catch (error) {
    logger.storage.cloudLoadError(error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

/**
 * Sync local save data to cloud
 */
export async function syncToCloud(): Promise<boolean> {
  const userId = getUserId();
  if (!userId) {
    logger.debug('storage', 'cloud_sync_skipped_no_user');
    return false;
  }

  logger.storage.cloudSyncStarted();
  try {
    const localData = loadSaveData();
    await savePlayerData(userId, localData);
    logger.storage.cloudSyncSuccess();
    return true;
  } catch (error) {
    logger.storage.cloudSyncError(error instanceof Error ? error.message : 'Unknown error');
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
