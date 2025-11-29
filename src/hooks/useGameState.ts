/**
 * Game State Hook
 * Central state management for the entire game using Zustand.
 */

import { create } from 'zustand';
import type { SaveData, AvatarConfig } from '../persistence/types';
import type { LearningStats } from '../learning/types';
import { 
  loadSaveData, 
  saveSaveData, 
  clearSaveData,
  createDefaultSaveData,
} from '../persistence/storage';
import { levelFromXp, xpProgressInLevel, updateStatsAfterAnswer } from '../learning/learningEngine';
import type { QuestionSkill } from '../learning/types';

export type GameScreen = 
  | 'loading'
  | 'mainMenu'
  | 'avatarSetup'
  | 'nameSetup'
  | 'playing'
  | 'options'
  | 'questComplete';

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
}

export const useGameState = create<GameState>((set, get) => ({
  // Initial state
  screen: 'loading',
  saveData: createDefaultSaveData(),
  isNewPlayer: true,
  questCompleteData: null,
  level: 1,
  xpProgress: { current: 0, needed: 100 },

  // Initialize the game from localStorage
  initialize: () => {
    const saveData = loadSaveData();
    const isNewPlayer = !saveData.playerName;
    const level = levelFromXp(saveData.xp);
    const xpProgress = xpProgressInLevel(saveData.xp);

    set({
      saveData,
      isNewPlayer,
      level,
      xpProgress,
      screen: isNewPlayer ? 'mainMenu' : 'mainMenu',
    });
  },

  setScreen: (screen) => set({ screen }),

  updateAvatar: (config) => {
    const { saveData } = get();
    const newSaveData = { ...saveData, avatarConfig: config };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },

  updatePlayerName: (name) => {
    const { saveData } = get();
    const newSaveData = { ...saveData, playerName: name };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData, isNewPlayer: false });
  },

  addXp: (amount) => {
    const { saveData } = get();
    const newXp = saveData.xp + amount;
    const newSaveData = { ...saveData, xp: newXp };
    const level = levelFromXp(newXp);
    const xpProgress = xpProgressInLevel(newXp);
    
    saveSaveData(newSaveData);
    set({ saveData: newSaveData, level, xpProgress });
  },

  completeQuest: (questId, xpReward, correctAnswers, totalQuestions, questTitle) => {
    const { saveData } = get();
    
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
    const newStats = updateStatsAfterAnswer(saveData.learningStats, skill, correct);
    const newSaveData = { ...saveData, learningStats: newStats };
    saveSaveData(newSaveData);
    set({ saveData: newSaveData });
  },

  resetProgress: () => {
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
    set({ questCompleteData: null, screen: 'playing' });
  },
}));
