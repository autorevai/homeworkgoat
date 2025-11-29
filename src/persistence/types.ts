/**
 * Persistence Types
 * Updated to support worlds, adventures, conquests, abilities, and daily challenges.
 */

import type { LearningStats } from '../learning/types';
import type { AdventureProgress } from '../adventure/paths';
import type { AbilityState } from '../abilities/abilities';
import type { DailyProgress } from '../daily/dailyChallenge';

export interface AvatarConfig {
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  skinColor: string;
  accessory: 'none' | 'glasses' | 'cap' | 'headphones' | 'crown' | 'wizard-hat';
}

export const DEFAULT_AVATAR: AvatarConfig = {
  hairColor: '#4a3728',
  shirtColor: '#4CAF50',
  pantsColor: '#1565C0',
  skinColor: '#FFDAB9',
  accessory: 'none',
};

// Color options for avatar customization
export const HAIR_COLORS = [
  '#4a3728', // Brown
  '#1a1a1a', // Black
  '#D4AF37', // Blonde
  '#8B4513', // Auburn
  '#FF4500', // Red
  '#4169E1', // Blue (fantasy)
  '#9932CC', // Purple (fantasy)
  '#32CD32', // Green (fantasy)
];

export const SHIRT_COLORS = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF5722', // Orange
  '#9C27B0', // Purple
  '#F44336', // Red
  '#FFD700', // Gold
  '#00BCD4', // Cyan
  '#E91E63', // Pink
];

export const PANTS_COLORS = [
  '#1565C0', // Blue
  '#4a3728', // Brown
  '#1a1a1a', // Black
  '#388E3C', // Green
  '#7B1FA2', // Purple
  '#455A64', // Gray
];

export const ACCESSORIES: Array<{ id: AvatarConfig['accessory']; label: string; emoji: string }> = [
  { id: 'none', label: 'None', emoji: '✖️' },
  { id: 'glasses', label: 'Glasses', emoji: '👓' },
  { id: 'cap', label: 'Cap', emoji: '🧢' },
  { id: 'headphones', label: 'Headphones', emoji: '🎧' },
  { id: 'crown', label: 'Crown', emoji: '👑' },
  { id: 'wizard-hat', label: 'Wizard Hat', emoji: '🧙' },
];

export interface SaveData {
  // Version for migration support
  saveVersion: number;

  // Player identity
  playerName: string;
  avatarConfig: AvatarConfig;

  // Core progression
  xp: number;
  completedQuestIds: string[];
  defeatedBossIds: string[];

  // World system
  currentWorldId: string;
  unlockedWorldIds: string[];

  // Adventure paths (skill trees)
  adventureProgress: Record<string, AdventureProgress>;

  // Abilities
  abilityStates: Record<string, AbilityState>;
  
  // Daily challenges
  dailyProgress: DailyProgress;

  // Cosmetics and titles
  unlockedCosmetics: string[];
  equippedCosmetics: {
    headwear?: string;
    cape?: string;
    aura?: string;
    pet?: string;
  };
  unlockedTitles: string[];
  equippedTitle: string | null;

  // Learning stats
  learningStats: LearningStats;

  // Audio settings
  audioEnabled: boolean;
  autoReadQuestions: boolean;

  // Timestamps
  createdAt: number;
  lastPlayedAt: number;
}

// Current save version - increment when making breaking changes
export const CURRENT_SAVE_VERSION = 2;

/**
 * Create default save data for new players
 */
export function createDefaultSaveData(): SaveData {
  return {
    saveVersion: CURRENT_SAVE_VERSION,
    playerName: '',
    avatarConfig: { ...DEFAULT_AVATAR },
    xp: 0,
    completedQuestIds: [],
    defeatedBossIds: [],
    currentWorldId: 'world-school',
    unlockedWorldIds: ['world-school'],
    adventureProgress: {},
    abilityStates: {},
    dailyProgress: {
      currentStreak: 0,
      longestStreak: 0,
      lastCompletedDate: null,
      totalDailiesCompleted: 0,
      dailyRewardsEarned: [],
    },
    unlockedCosmetics: [],
    equippedCosmetics: {},
    unlockedTitles: [],
    equippedTitle: null,
    learningStats: {
      totalQuestionsAnswered: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      skillProgress: {
        addition: { correct: 0, total: 0 },
        subtraction: { correct: 0, total: 0 },
        multiplication: { correct: 0, total: 0 },
        division: { correct: 0, total: 0 },
        wordProblem: { correct: 0, total: 0 },
      },
    },
    audioEnabled: true,
    autoReadQuestions: false,
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  };
}

/**
 * Migrate old save data to new version
 */
export function migrateSaveData(oldData: Partial<SaveData>): SaveData {
  const defaults = createDefaultSaveData();

  // Version 1 -> 2: Add new fields
  const migrated: SaveData = {
    ...defaults,
    ...oldData,
    saveVersion: CURRENT_SAVE_VERSION,
    
    // Ensure new fields exist
    defeatedBossIds: oldData.defeatedBossIds || [],
    currentWorldId: oldData.currentWorldId || 'world-school',
    unlockedWorldIds: oldData.unlockedWorldIds || ['world-school'],
    adventureProgress: oldData.adventureProgress || {},
    abilityStates: oldData.abilityStates || {},
    dailyProgress: oldData.dailyProgress || defaults.dailyProgress,
    equippedCosmetics: oldData.equippedCosmetics || {},
    unlockedTitles: oldData.unlockedTitles || [],
    equippedTitle: oldData.equippedTitle || null,
    audioEnabled: oldData.audioEnabled ?? true,
    autoReadQuestions: oldData.autoReadQuestions ?? false,
  };

  return migrated;
}

/**
 * Validate save data structure
 */
export function validateSaveData(data: unknown): data is SaveData {
  if (typeof data !== 'object' || data === null) return false;
  
  const d = data as Record<string, unknown>;
  
  return (
    typeof d.saveVersion === 'number' &&
    typeof d.playerName === 'string' &&
    typeof d.xp === 'number' &&
    Array.isArray(d.completedQuestIds)
  );
}

/**
 * Firebase collection paths
 */
export const FIREBASE_PATHS = {
  users: 'users',
  leaderboards: {
    weekly: 'leaderboards/weekly',
    allTime: 'leaderboards/allTime',
  },
  dailyChallenges: 'dailyChallenges',
} as const;

/**
 * Leaderboard entry type
 */
export interface LeaderboardEntry {
  odUI: string;
  playerName: string;
  xp: number;
  level: number;
  questsCompleted: number;
  longestStreak: number;
  updatedAt: number;
}
