/**
 * Persistence Types
 * Defines the structure of saved game data.
 */

import type { LearningStats } from '../learning/types';

export interface AvatarConfig {
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  accessory: 'none' | 'cap' | 'glasses';
}

export interface SaveData {
  saveVersion: 1;
  playerName: string;
  avatarConfig: AvatarConfig;
  xp: number;
  completedQuestIds: string[];
  unlockedCosmetics: string[];
  learningStats: LearningStats;
  createdAt: number;
  lastPlayedAt: number;
}

export const DEFAULT_AVATAR: AvatarConfig = {
  hairColor: '#8B4513',
  shirtColor: '#4CAF50',
  pantsColor: '#2196F3',
  accessory: 'none',
};

export const HAIR_COLORS = [
  '#8B4513', // Brown
  '#FFD700', // Blonde
  '#1a1a1a', // Black
  '#FF6B35', // Ginger
  '#9C27B0', // Purple
  '#E91E63', // Pink
  '#00BCD4', // Cyan
  '#4CAF50', // Green
];

export const SHIRT_COLORS = [
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#FF9800', // Orange
  '#9C27B0', // Purple
  '#F44336', // Red
  '#FFEB3B', // Yellow
  '#00BCD4', // Cyan
  '#E91E63', // Pink
];

export const PANTS_COLORS = [
  '#2196F3', // Blue
  '#1a1a1a', // Black
  '#795548', // Brown
  '#607D8B', // Gray
  '#4CAF50', // Green
  '#9C27B0', // Purple
  '#F44336', // Red
  '#FF9800', // Orange
];

export const ACCESSORIES = [
  { id: 'none', label: 'None' },
  { id: 'cap', label: 'Baseball Cap' },
  { id: 'glasses', label: 'Cool Glasses' },
] as const;
