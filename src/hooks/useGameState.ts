/**
 * Game State Hook
 * Central state management for the entire game using Zustand.
 */

import { create } from 'zustand';
import type { SaveData, AvatarConfig } from '../persistence/types';
import { logger } from '../utils/logger';
import {
  loadSaveData,
  saveSaveData,
  clearSaveData,
  createDefaultSaveData,
} from '../persistence/storage';
import { levelFromXp, xpProgressInLevel, updateStatsAfterAnswer } from '../learning/learningEngine';
import type { QuestionSkill } from '../learning/types';
import { getUserId } from '../firebase/authService';
import { logScreenView, logLevelUp, logAvatarCustomized, logUserEvent } from '../firebase/analyticsService';
import { createInitialAbilityStates, updateUnlockedAbilities, tickCooldowns, useAbility } from '../abilities/abilities';
import { createInitialAdventureProgress } from '../adventure/paths';
import { completeDailyChallenge, createInitialDailyProgress, isStreakBroken } from '../daily/dailyChallenge';
// Types imported for documentation purposes (used in SaveData)
// AbilityState from '../abilities/abilities'
// AdventureProgress from '../adventure/paths'
// DailyProgress from '../daily/dailyChallenge'

export type GameScreen =
  | 'loading'
  | 'mainMenu'
  | 'avatarSetup'
  | 'nameSetup'
  | 'gradeLevelSetup'
  | 'playing'
  | 'options'
  | 'accessibility'
  | 'questComplete'
  | 'worldSelector'
  | 'bossBattle';

export interface QuestCompleteData {
  questId: string;
  questTitle: string;
  xpEarned: number;
  correctAnswers: number;
  totalQuestions: number;
}

interface GameState {
  // Core state
  screen: GameScreen;
  saveData: SaveData;
  isNewPlayer: boolean;

  // Quest completion data (for the reward screen)
  questCompleteData: QuestCompleteData | null;

  // Current world
  currentWorldId: string;

  // Computed values
  level: number;
  xpProgress: { current: number; needed: number };

  // Actions
  initialize: () => void;
  setScreen: (screen: GameScreen) => void;
  updateAvatar: (config: AvatarConfig) => void;
  updatePlayerName: (name: string) => void;
  addXp: (amount: number) => void;
  completeQuest: (questId: string, xpReward: number, correctAnswers: number, totalQuestions: number, questTitle: string) => void;
  recordAnswer: (skill: QuestionSkill, correct: boolean) => void;
  resetProgress: () => void;
  dismissQuestComplete: () => void;

  // World actions
  setCurrentWorld: (worldId: string) => void;
  unlockWorld: (worldId: string) => void;

  // Ability actions
  useAbilityAction: (abilityId: string) => void;
  tickAbilityCooldowns: () => void;

  // Daily challenge actions
  completeDailyAction: () => { xpBonus: number; streakReward: { title: string; cosmetic?: string } | null };

  // Boss actions
  defeatBoss: (bossId: string, xpReward: number) => void;

  // Adventure progress
  updateAdventureProgress: (skill: QuestionSkill, correct: boolean) => void;

  // Generic save data update (for AI worlds, etc.)
  updateSaveData: (updates: Partial<SaveData>) => void;
}

export const useGameState = create<GameState>((set, get) => ({
  // Initial state
  screen: 'loading',
  saveData: createDefaultSaveData(),
  isNewPlayer: true,
  questCompleteData: null,
  currentWorldId: 'world-school',
  level: 1,
  xpProgress: { current: 0, needed: 100 },

  // Initialize the game from localStorage
  initialize: () => {
    logger.debug('game', 'initializing_game_state');
    const saveData = loadSaveData();
    const isNewPlayer = !saveData.playerName;
    const level = levelFromXp(saveData.xp);
    const xpProgress = xpProgressInLevel(saveData.xp);

    // Initialize new expansion data if not present
    if (!saveData.abilityStates || Object.keys(saveData.abilityStates).length === 0) {
      saveData.abilityStates = createInitialAbilityStates(level);
    }
    if (!saveData.adventureProgress || Object.keys(saveData.adventureProgress).length === 0) {
      saveData.adventureProgress = createInitialAdventureProgress();
    }
    if (!saveData.dailyProgress) {
      saveData.dailyProgress = createInitialDailyProgress();
    }
    if (!saveData.defeatedBossIds) {
      saveData.defeatedBossIds = [];
    }
    if (!saveData.currentWorldId) {
      saveData.currentWorldId = 'world-school';
    }
    if (!saveData.unlockedWorldIds) {
      saveData.unlockedWorldIds = ['world-school'];
    }
    if (!saveData.unlockedCosmetics) {
      saveData.unlockedCosmetics = [];
    }
    if (!saveData.unlockedTitles) {
      saveData.unlockedTitles = [];
    }
    if (!saveData.gradeLevel) {
      saveData.gradeLevel = 3; // Default to 3rd grade
    }
    if (saveData.tutorialCompleted === undefined) {
      saveData.tutorialCompleted = false;
    }

    // Check if streak is broken
    if (isStreakBroken(saveData.dailyProgress)) {
      saveData.dailyProgress = {
        ...saveData.dailyProgress,
        currentStreak: 0,
      };
    }

    // Update ability unlocks based on current level
    const { states: updatedAbilities } = updateUnlockedAbilities(saveData.abilityStates, level);
    saveData.abilityStates = updatedAbilities;

    logger.game.initialized(isNewPlayer);
    logger.debug('game', 'loaded_save_data', {
      level,
      xp: saveData.xp,
      completedQuests: saveData.completedQuestIds.length,
      currentWorld: saveData.currentWorldId,
    });

    // Save updated data
    saveSaveData(saveData);

    set({
      saveData,
      isNewPlayer,
      level,
      xpProgress,
      currentWorldId: saveData.currentWorldId,
      screen: isNewPlayer ? 'mainMenu' : 'mainMenu',
    });
  },

  setScreen: (screen) => {
    const prevScreen = get().screen;
    logger.game.screenChanged(prevScreen, screen);
    set({ screen });

    // Analytics: track screen view
    const userId = getUserId();
    if (userId) {
      logScreenView(userId, screen).catch(console.error);
    }
  },

  updateAvatar: (config) => {
    const { saveData } = get();
    const changes = {
      hairColor: config.hairColor,
      shirtColor: config.shirtColor,
      pantsColor: config.pantsColor,
      accessory: config.accessory,
    };
    logger.ui.avatarCustomized(changes);

    // Analytics: track avatar customization
    const userId = getUserId();
    if (userId) {
      logAvatarCustomized(userId, changes).catch(console.error);
    }

    const newSaveData = { ...saveData, avatarConfig: config };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },

  updatePlayerName: (name) => {
    const { saveData } = get();
    logger.ui.nameSet(name.length);

    // Analytics: track name set
    const userId = getUserId();
    if (userId) {
      logUserEvent(userId, 'settings_changed', { action: 'name_set', name_length: name.length }).catch(console.error);
    }

    const newSaveData = { ...saveData, playerName: name };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData, isNewPlayer: false });
  },

  addXp: (amount) => {
    const { saveData, level: oldLevel } = get();
    const newXp = saveData.xp + amount;
    const newSaveData = { ...saveData, xp: newXp };
    const level = levelFromXp(newXp);
    const xpProgress = xpProgressInLevel(newXp);

    logger.game.xpGained(amount, newXp, 'direct');

    if (level > oldLevel) {
      logger.game.levelUp(level);

      // Analytics: track level up
      const userId = getUserId();
      if (userId) {
        logLevelUp(userId, level, newXp).catch(console.error);
      }
    }

    saveSaveData(newSaveData);
    set({ saveData: newSaveData, level, xpProgress });
  },

  completeQuest: (questId, xpReward, correctAnswers, totalQuestions, questTitle) => {
    const { saveData, level: oldLevel } = get();

    logger.quest.completed(questId, correctAnswers, totalQuestions, xpReward);

    // Only add quest if not already completed
    const completedQuestIds = saveData.completedQuestIds.includes(questId)
      ? saveData.completedQuestIds
      : [...saveData.completedQuestIds, questId];

    const newXp = saveData.xp + xpReward;
    const newSaveData = {
      ...saveData,
      xp: newXp,
      completedQuestIds,
    };

    const level = levelFromXp(newXp);
    const xpProgress = xpProgressInLevel(newXp);

    logger.game.xpGained(xpReward, newXp, `quest:${questId}`);

    if (level > oldLevel) {
      logger.game.levelUp(level);

      // Analytics: track level up from quest
      const userId = getUserId();
      if (userId) {
        logLevelUp(userId, level, newXp).catch(console.error);
      }
    }

    saveSaveData(newSaveData);
    set({
      saveData: newSaveData,
      level,
      xpProgress,
      questCompleteData: {
        questId,
        questTitle,
        xpEarned: xpReward,
        correctAnswers,
        totalQuestions,
      },
      screen: 'questComplete',
    });
  },

  recordAnswer: (skill, correct) => {
    const { saveData } = get();
    logger.debug('quest', 'answer_recorded', { skill, correct });
    const newStats = updateStatsAfterAnswer(saveData.learningStats, skill, correct);
    const newSaveData = { ...saveData, learningStats: newStats };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },

  resetProgress: () => {
    logger.game.progressReset();
    clearSaveData();
    const saveData = createDefaultSaveData();
    set({
      saveData,
      isNewPlayer: true,
      level: 1,
      xpProgress: { current: 0, needed: 100 },
      questCompleteData: null,
      screen: 'mainMenu',
    });
  },

  dismissQuestComplete: () => {
    logger.debug('ui', 'quest_complete_dismissed');
    set({ questCompleteData: null, screen: 'playing' });
  },

  // World actions
  setCurrentWorld: (worldId) => {
    const { saveData } = get();
    const newSaveData = {
      ...saveData,
      currentWorldId: worldId,
    };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData, currentWorldId: worldId });
  },

  unlockWorld: (worldId) => {
    const { saveData } = get();
    if (saveData.unlockedWorldIds.includes(worldId)) return;

    const newSaveData = {
      ...saveData,
      unlockedWorldIds: [...saveData.unlockedWorldIds, worldId],
    };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },

  // Ability actions
  useAbilityAction: (abilityId) => {
    const { saveData } = get();
    const newAbilityStates = useAbility(saveData.abilityStates, abilityId);
    const newSaveData = { ...saveData, abilityStates: newAbilityStates };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },

  tickAbilityCooldowns: () => {
    const { saveData } = get();
    const newAbilityStates = tickCooldowns(saveData.abilityStates);
    const newSaveData = { ...saveData, abilityStates: newAbilityStates };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },

  // Daily challenge actions
  completeDailyAction: () => {
    const { saveData, level: oldLevel } = get();
    const result = completeDailyChallenge(saveData.dailyProgress);

    const newXp = saveData.xp + result.xpBonus;
    let newSaveData = {
      ...saveData,
      dailyProgress: result.newProgress,
      xp: newXp,
    };

    // Add cosmetic reward if earned
    if (result.streakReward?.cosmetic) {
      newSaveData = {
        ...newSaveData,
        unlockedCosmetics: [...(newSaveData.unlockedCosmetics || []), result.streakReward.cosmetic],
      };
    }

    const level = levelFromXp(newXp);
    const xpProgress = xpProgressInLevel(newXp);

    if (level > oldLevel) {
      // Update abilities when leveling up
      const { states: updatedAbilities } = updateUnlockedAbilities(newSaveData.abilityStates, level);
      newSaveData.abilityStates = updatedAbilities;
      logger.game.levelUp(level);
    }

    saveSaveData(newSaveData);
    set({ saveData: newSaveData, level, xpProgress });

    return { xpBonus: result.xpBonus, streakReward: result.streakReward };
  },

  // Boss actions
  defeatBoss: (bossId, xpReward) => {
    const { saveData, level: oldLevel } = get();

    const defeatedBossIds = saveData.defeatedBossIds.includes(bossId)
      ? saveData.defeatedBossIds
      : [...saveData.defeatedBossIds, bossId];

    const newXp = saveData.xp + xpReward;
    const newSaveData = {
      ...saveData,
      xp: newXp,
      defeatedBossIds,
    };

    const level = levelFromXp(newXp);
    const xpProgress = xpProgressInLevel(newXp);

    if (level > oldLevel) {
      const { states: updatedAbilities } = updateUnlockedAbilities(newSaveData.abilityStates, level);
      newSaveData.abilityStates = updatedAbilities;
      logger.game.levelUp(level);
    }

    saveSaveData(newSaveData);
    set({ saveData: newSaveData, level, xpProgress });
  },

  // Adventure progress
  updateAdventureProgress: (skill, correct) => {
    const { saveData } = get();
    const pathId = `path-${skill}`;
    const currentProgress = saveData.adventureProgress[pathId] || {
      pathId,
      currentLevel: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      mastery: 0,
    };

    const newQuestionsAnswered = currentProgress.questionsAnswered + 1;
    const newCorrectAnswers = correct ? currentProgress.correctAnswers + 1 : currentProgress.correctAnswers;
    const newMastery = newQuestionsAnswered > 0 ? (newCorrectAnswers / newQuestionsAnswered) * 100 : 0;

    const newProgress = {
      ...currentProgress,
      questionsAnswered: newQuestionsAnswered,
      correctAnswers: newCorrectAnswers,
      mastery: newMastery,
    };

    const newSaveData = {
      ...saveData,
      adventureProgress: {
        ...saveData.adventureProgress,
        [pathId]: newProgress,
      },
    };

    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },

  // Generic save data update for AI worlds and other extensions
  updateSaveData: (updates: Partial<SaveData>) => {
    const { saveData } = get();
    const newSaveData = { ...saveData, ...updates };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },
}));
