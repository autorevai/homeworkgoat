/**
 * Persistence Types
 * Updated to support worlds, adventures, conquests, abilities, and daily challenges.
 */

import type { LearningStats, QuestionSkill, Question, Quest } from '../learning/types';
import type { AdventureProgress } from '../adventure/paths';
import type { AbilityState } from '../abilities/abilities';
import type { DailyProgress } from '../daily/dailyChallenge';
import type { World } from '../worlds/types';

/**
 * Grade level type (2nd through 6th grade)
 */
export type GradeLevel = 2 | 3 | 4 | 5 | 6;

/**
 * Grade level configuration
 */
export interface GradeLevelConfig {
  level: GradeLevel;
  name: string;
  ageRange: string;
  mathOperations: {
    addition: { minNum: number; maxNum: number; multiDigit: boolean };
    subtraction: { minNum: number; maxNum: number; multiDigit: boolean };
    multiplication: { minNum: number; maxNum: number };
    division: { minNum: number; maxNum: number };
    wordProblems: { complexity: 'simple' | 'medium' | 'complex' };
  };
}

/**
 * Grade level configurations for difficulty scaling
 */
export const GRADE_CONFIGS: Record<GradeLevel, GradeLevelConfig> = {
  2: {
    level: 2,
    name: '2nd Grade',
    ageRange: '7-8',
    mathOperations: {
      addition: { minNum: 1, maxNum: 20, multiDigit: false },
      subtraction: { minNum: 1, maxNum: 15, multiDigit: false },
      multiplication: { minNum: 1, maxNum: 5 },
      division: { minNum: 1, maxNum: 10 },
      wordProblems: { complexity: 'simple' },
    },
  },
  3: {
    level: 3,
    name: '3rd Grade',
    ageRange: '8-9',
    mathOperations: {
      addition: { minNum: 1, maxNum: 100, multiDigit: true },
      subtraction: { minNum: 1, maxNum: 50, multiDigit: true },
      multiplication: { minNum: 1, maxNum: 10 },
      division: { minNum: 1, maxNum: 50 },
      wordProblems: { complexity: 'simple' },
    },
  },
  4: {
    level: 4,
    name: '4th Grade',
    ageRange: '9-10',
    mathOperations: {
      addition: { minNum: 10, maxNum: 500, multiDigit: true },
      subtraction: { minNum: 10, maxNum: 200, multiDigit: true },
      multiplication: { minNum: 2, maxNum: 12 },
      division: { minNum: 2, maxNum: 100 },
      wordProblems: { complexity: 'medium' },
    },
  },
  5: {
    level: 5,
    name: '5th Grade',
    ageRange: '10-11',
    mathOperations: {
      addition: { minNum: 50, maxNum: 1000, multiDigit: true },
      subtraction: { minNum: 50, maxNum: 500, multiDigit: true },
      multiplication: { minNum: 3, maxNum: 15 },
      division: { minNum: 3, maxNum: 150 },
      wordProblems: { complexity: 'medium' },
    },
  },
  6: {
    level: 6,
    name: '6th Grade',
    ageRange: '11-12',
    mathOperations: {
      addition: { minNum: 100, maxNum: 2000, multiDigit: true },
      subtraction: { minNum: 100, maxNum: 1000, multiDigit: true },
      multiplication: { minNum: 5, maxNum: 20 },
      division: { minNum: 5, maxNum: 200 },
      wordProblems: { complexity: 'complex' },
    },
  },
};

/**
 * AI-Generated World Bundle
 * Contains everything needed to play a generated world
 */
export interface GeneratedWorldData {
  world: World;
  quests: Quest[];
  questions: Question[];

  // Metadata for AI improvement
  generatedAt: number;
  playerProfileUsed: {
    level: number;
    weakSkills: QuestionSkill[];
    strongSkills: QuestionSkill[];
    averageMastery: number;
  };
}

/**
 * Analytics for AI-generated question performance
 * Used to improve AI prompt and difficulty scaling
 */
export interface AIQuestionAnalytics {
  questionId: string;
  worldId: string;
  skill: QuestionSkill;
  difficulty: 'easy' | 'medium';
  commonCoreStandard?: string;

  // Performance data
  wasCorrect: boolean;
  timeToAnswerMs: number;
  hintUsed: boolean;
  attemptNumber: number; // 1st try, 2nd try, etc.

  // Context
  playerLevel: number;
  playerMasteryAtTime: number;
  timestamp: number;
}

/**
 * Summary of AI world completion
 */
export interface AIWorldCompletion {
  worldId: string;
  worldName: string;
  completedAt: number;
  questsCompleted: number;
  totalQuests: number;
  questionsCorrect: number;
  totalQuestions: number;
  averageTimePerQuestion: number;
  hintsUsed: number;
}

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

/**
 * Treasure Chest types
 */
export type ChestRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface TreasureChestReward {
  xp: number;
  coins?: number;
  cosmetic?: string;
}

export interface TreasureChestDef {
  id: string;
  worldId: string;
  position: [number, number, number];
  rarity: ChestRarity;
  rewards: TreasureChestReward;
}

/**
 * Crystal Shard types
 */
export interface CrystalShardDef {
  id: string;
  worldId: string;
  position: [number, number, number];
  color: string;
  secretAreaId?: string; // Optional secret area unlocked by collecting all shards
}

export interface SaveData {
  // Version for migration support
  saveVersion: number;

  // Player identity
  playerName: string;
  avatarConfig: AvatarConfig;
  gradeLevel: GradeLevel; // Player's grade level for difficulty scaling

  // Core progression
  xp: number;
  coins: number; // Currency for cosmetics
  completedQuestIds: string[];
  defeatedBossIds: string[];

  // Exploration progress
  openedChestIds: string[];
  collectedShardIds: string[];

  // World system
  currentWorldId: string;
  unlockedWorldIds: string[];

  // AI-Generated Worlds (cached locally, max 5)
  generatedWorlds: GeneratedWorldData[];

  // AI World History (for analytics - stored in Firestore too)
  aiWorldHistory: AIWorldCompletion[];

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

  // Tutorial state
  tutorialCompleted: boolean;

  // Achievement tracking
  unlockedAchievementIds: string[];
  achievementStats: {
    speedBonuses: number;
    perfectQuests: number;
  };

  // World completion tracking (to not show popup twice)
  shownWorldCompleteIds: string[];

  // Timestamps
  createdAt: number;
  lastPlayedAt: number;
}

// Current save version - increment when making breaking changes
export const CURRENT_SAVE_VERSION = 5;

/**
 * Create default save data for new players
 */
export function createDefaultSaveData(): SaveData {
  return {
    saveVersion: CURRENT_SAVE_VERSION,
    playerName: '',
    avatarConfig: { ...DEFAULT_AVATAR },
    gradeLevel: 3, // Default to 3rd grade
    xp: 0,
    coins: 0,
    completedQuestIds: [],
    defeatedBossIds: [],
    openedChestIds: [],
    collectedShardIds: [],
    currentWorldId: 'world-school',
    unlockedWorldIds: ['world-school'],
    generatedWorlds: [],
    aiWorldHistory: [],
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
    tutorialCompleted: false,
    unlockedAchievementIds: [],
    achievementStats: {
      speedBonuses: 0,
      perfectQuests: 0,
    },
    shownWorldCompleteIds: [],
    createdAt: Date.now(),
    lastPlayedAt: Date.now(),
  };
}

/**
 * Migrate old save data to new version
 */
export function migrateSaveData(oldData: Partial<SaveData>): SaveData {
  const defaults = createDefaultSaveData();

  // Version 1 -> 2 -> 3 -> 4: Add new fields progressively
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

    // Version 3: AI-generated worlds
    generatedWorlds: oldData.generatedWorlds || [],
    aiWorldHistory: oldData.aiWorldHistory || [],

    // Version 4: Exploration (treasure chests & crystal shards)
    coins: oldData.coins || 0,
    openedChestIds: oldData.openedChestIds || [],
    collectedShardIds: oldData.collectedShardIds || [],

    // Version 5: Grade level for difficulty scaling
    gradeLevel: oldData.gradeLevel || 3,

    // Version 6: Tutorial state
    tutorialCompleted: oldData.tutorialCompleted ?? false,

    // Version 7: Achievements
    unlockedAchievementIds: oldData.unlockedAchievementIds || [],
    achievementStats: oldData.achievementStats || {
      speedBonuses: 0,
      perfectQuests: 0,
    },

    // Version 8: World completion tracking
    shownWorldCompleteIds: oldData.shownWorldCompleteIds || [],
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
