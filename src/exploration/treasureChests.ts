/**
 * Treasure Chest Definitions
 * Chests scattered throughout worlds that require solving math problems to open.
 */

import type { TreasureChestDef, ChestRarity } from '../persistence/types';

/**
 * Rarity configurations
 */
export const CHEST_RARITY_CONFIG: Record<ChestRarity, {
  color: string;
  glowColor: string;
  xpMultiplier: number;
  coinMultiplier: number;
  cosmeticChance: number;
}> = {
  common: {
    color: '#8B4513',
    glowColor: '#D4A574',
    xpMultiplier: 1,
    coinMultiplier: 1,
    cosmeticChance: 0,
  },
  rare: {
    color: '#4169E1',
    glowColor: '#87CEEB',
    xpMultiplier: 1.5,
    coinMultiplier: 2,
    cosmeticChance: 0.1,
  },
  epic: {
    color: '#9932CC',
    glowColor: '#DA70D6',
    xpMultiplier: 2,
    coinMultiplier: 3,
    cosmeticChance: 0.25,
  },
  legendary: {
    color: '#FFD700',
    glowColor: '#FFF8DC',
    xpMultiplier: 3,
    coinMultiplier: 5,
    cosmeticChance: 0.5,
  },
};

/**
 * All treasure chests in the game - spread across 40x40 worlds
 * Each world has 8-10 chests for exploration
 */
export const TREASURE_CHESTS: TreasureChestDef[] = [
  // ============================================
  // World: School (10 chests - intro to exploration)
  // ============================================
  { id: 'chest-school-1', worldId: 'world-school', position: [15, 0, 5], rarity: 'common', rewards: { xp: 15, coins: 10 } },
  { id: 'chest-school-2', worldId: 'world-school', position: [-15, 0, 5], rarity: 'common', rewards: { xp: 15, coins: 10 } },
  { id: 'chest-school-3', worldId: 'world-school', position: [10, 0, -8], rarity: 'common', rewards: { xp: 15, coins: 10 } },
  { id: 'chest-school-4', worldId: 'world-school', position: [-10, 0, -8], rarity: 'common', rewards: { xp: 15, coins: 10 } },
  { id: 'chest-school-5', worldId: 'world-school', position: [18, 0, -12], rarity: 'rare', rewards: { xp: 30, coins: 25 } },
  { id: 'chest-school-6', worldId: 'world-school', position: [-18, 0, -12], rarity: 'rare', rewards: { xp: 30, coins: 25 } },
  { id: 'chest-school-7', worldId: 'world-school', position: [0, 0, 14], rarity: 'common', rewards: { xp: 15, coins: 10 } },
  { id: 'chest-school-8', worldId: 'world-school', position: [16, 0, 12], rarity: 'common', rewards: { xp: 15, coins: 10 } },
  { id: 'chest-school-9', worldId: 'world-school', position: [-16, 0, 12], rarity: 'rare', rewards: { xp: 30, coins: 25 } },
  { id: 'chest-school-10', worldId: 'world-school', position: [0, 0, -16], rarity: 'epic', rewards: { xp: 50, coins: 40, cosmetic: 'scholar-glasses' } },

  // ============================================
  // World: Forest (10 chests)
  // ============================================
  { id: 'chest-forest-1', worldId: 'world-forest', position: [16, 0, 4], rarity: 'common', rewards: { xp: 20, coins: 15 } },
  { id: 'chest-forest-2', worldId: 'world-forest', position: [-16, 0, 4], rarity: 'common', rewards: { xp: 20, coins: 15 } },
  { id: 'chest-forest-3', worldId: 'world-forest', position: [12, 0, -10], rarity: 'common', rewards: { xp: 20, coins: 15 } },
  { id: 'chest-forest-4', worldId: 'world-forest', position: [-12, 0, -10], rarity: 'rare', rewards: { xp: 40, coins: 30 } },
  { id: 'chest-forest-5', worldId: 'world-forest', position: [18, 0, -15], rarity: 'rare', rewards: { xp: 40, coins: 30 } },
  { id: 'chest-forest-6', worldId: 'world-forest', position: [-18, 0, -15], rarity: 'rare', rewards: { xp: 40, coins: 30 } },
  { id: 'chest-forest-7', worldId: 'world-forest', position: [6, 0, 12], rarity: 'common', rewards: { xp: 20, coins: 15 } },
  { id: 'chest-forest-8', worldId: 'world-forest', position: [-6, 0, 12], rarity: 'common', rewards: { xp: 20, coins: 15 } },
  { id: 'chest-forest-9', worldId: 'world-forest', position: [0, 0, -18], rarity: 'epic', rewards: { xp: 60, coins: 50, cosmetic: 'forest-cape' } },
  { id: 'chest-forest-10', worldId: 'world-forest', position: [-8, 0, 8], rarity: 'rare', rewards: { xp: 40, coins: 30 } },

  // ============================================
  // World: Castle (10 chests)
  // ============================================
  { id: 'chest-castle-1', worldId: 'world-castle', position: [14, 0, 6], rarity: 'common', rewards: { xp: 25, coins: 20 } },
  { id: 'chest-castle-2', worldId: 'world-castle', position: [-14, 0, 6], rarity: 'common', rewards: { xp: 25, coins: 20 } },
  { id: 'chest-castle-3', worldId: 'world-castle', position: [18, 0, -8], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-castle-4', worldId: 'world-castle', position: [-18, 0, -8], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-castle-5', worldId: 'world-castle', position: [10, 0, -15], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-castle-6', worldId: 'world-castle', position: [-10, 0, -15], rarity: 'epic', rewards: { xp: 75, coins: 60 } },
  { id: 'chest-castle-7', worldId: 'world-castle', position: [0, 0, 10], rarity: 'common', rewards: { xp: 25, coins: 20 } },
  { id: 'chest-castle-8', worldId: 'world-castle', position: [16, 0, 14], rarity: 'common', rewards: { xp: 25, coins: 20 } },
  { id: 'chest-castle-9', worldId: 'world-castle', position: [-16, 0, 14], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-castle-10', worldId: 'world-castle', position: [0, 0, -17], rarity: 'legendary', rewards: { xp: 100, coins: 80, cosmetic: 'royal-crown' } },

  // ============================================
  // World: Space (10 chests)
  // ============================================
  { id: 'chest-space-1', worldId: 'world-space', position: [15, 0, 8], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-space-2', worldId: 'world-space', position: [-15, 0, 8], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-space-3', worldId: 'world-space', position: [18, 0, -5], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-space-4', worldId: 'world-space', position: [-18, 0, -5], rarity: 'epic', rewards: { xp: 75, coins: 60 } },
  { id: 'chest-space-5', worldId: 'world-space', position: [12, 0, -14], rarity: 'epic', rewards: { xp: 75, coins: 60 } },
  { id: 'chest-space-6', worldId: 'world-space', position: [-12, 0, -14], rarity: 'epic', rewards: { xp: 75, coins: 60 } },
  { id: 'chest-space-7', worldId: 'world-space', position: [8, 0, 14], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-space-8', worldId: 'world-space', position: [-8, 0, 14], rarity: 'rare', rewards: { xp: 50, coins: 40 } },
  { id: 'chest-space-9', worldId: 'world-space', position: [0, 0, -17], rarity: 'legendary', rewards: { xp: 150, coins: 100, cosmetic: 'cosmic-aura' } },
  { id: 'chest-space-10', worldId: 'world-space', position: [0, 0, 6], rarity: 'epic', rewards: { xp: 75, coins: 60 } },

  // ============================================
  // World: Underwater (10 chests)
  // ============================================
  { id: 'chest-underwater-1', worldId: 'world-underwater', position: [14, 0, 10], rarity: 'rare', rewards: { xp: 60, coins: 50 } },
  { id: 'chest-underwater-2', worldId: 'world-underwater', position: [-14, 0, 10], rarity: 'rare', rewards: { xp: 60, coins: 50 } },
  { id: 'chest-underwater-3', worldId: 'world-underwater', position: [18, 0, 0], rarity: 'epic', rewards: { xp: 80, coins: 65 } },
  { id: 'chest-underwater-4', worldId: 'world-underwater', position: [-18, 0, 0], rarity: 'epic', rewards: { xp: 80, coins: 65 } },
  { id: 'chest-underwater-5', worldId: 'world-underwater', position: [10, 0, -12], rarity: 'epic', rewards: { xp: 80, coins: 65 } },
  { id: 'chest-underwater-6', worldId: 'world-underwater', position: [-10, 0, -12], rarity: 'epic', rewards: { xp: 80, coins: 65 } },
  { id: 'chest-underwater-7', worldId: 'world-underwater', position: [6, 0, 16], rarity: 'rare', rewards: { xp: 60, coins: 50 } },
  { id: 'chest-underwater-8', worldId: 'world-underwater', position: [-6, 0, 16], rarity: 'rare', rewards: { xp: 60, coins: 50 } },
  { id: 'chest-underwater-9', worldId: 'world-underwater', position: [0, 0, -17], rarity: 'legendary', rewards: { xp: 200, coins: 150, cosmetic: 'trident-staff' } },
  { id: 'chest-underwater-10', worldId: 'world-underwater', position: [16, 0, -16], rarity: 'legendary', rewards: { xp: 200, coins: 150, cosmetic: 'mermaid-tail' } },
];

/**
 * Get all chests for a specific world
 */
export function getChestsForWorld(worldId: string): TreasureChestDef[] {
  return TREASURE_CHESTS.filter((chest) => chest.worldId === worldId);
}

/**
 * Get a chest by ID
 */
export function getChestById(chestId: string): TreasureChestDef | undefined {
  return TREASURE_CHESTS.find((chest) => chest.id === chestId);
}

/**
 * Generate a math problem for unlocking a chest
 * Difficulty scales with rarity
 */
export function generateChestPuzzle(rarity: ChestRarity): {
  prompt: string;
  answer: number;
  choices: number[];
  hint: string;
} {
  let a: number, b: number, answer: number, prompt: string, hint: string;

  switch (rarity) {
    case 'common':
      // Simple addition or subtraction
      a = Math.floor(Math.random() * 20) + 5;
      b = Math.floor(Math.random() * 15) + 1;
      if (Math.random() > 0.5) {
        answer = a + b;
        prompt = `${a} + ${b} = ?`;
        hint = `Count up from ${a}`;
      } else {
        answer = a - b;
        prompt = `${a} - ${b} = ?`;
        hint = `Count down from ${a}`;
      }
      break;

    case 'rare':
      // Multiplication
      a = Math.floor(Math.random() * 9) + 2;
      b = Math.floor(Math.random() * 9) + 2;
      answer = a * b;
      prompt = `${a} × ${b} = ?`;
      hint = `Think of ${a} groups of ${b}`;
      break;

    case 'epic':
      // Division or harder multiplication
      if (Math.random() > 0.5) {
        b = Math.floor(Math.random() * 9) + 2;
        answer = Math.floor(Math.random() * 10) + 2;
        a = b * answer;
        prompt = `${a} ÷ ${b} = ?`;
        hint = `How many groups of ${b} fit in ${a}?`;
      } else {
        a = Math.floor(Math.random() * 12) + 3;
        b = Math.floor(Math.random() * 12) + 3;
        answer = a * b;
        prompt = `${a} × ${b} = ?`;
        hint = `Break it down: ${a} × ${Math.floor(b / 2)} × 2`;
      }
      break;

    case 'legendary':
      // Multi-step or word problem style
      a = Math.floor(Math.random() * 20) + 10;
      b = Math.floor(Math.random() * 5) + 2;
      const c = Math.floor(Math.random() * 10) + 1;
      answer = a * b + c;
      prompt = `${a} × ${b} + ${c} = ?`;
      hint = `First multiply, then add!`;
      break;

    default:
      a = 5;
      b = 3;
      answer = 8;
      prompt = '5 + 3 = ?';
      hint = 'Count on your fingers!';
  }

  // Generate wrong choices close to the answer
  const wrongChoices = new Set<number>();
  while (wrongChoices.size < 3) {
    const offset = Math.floor(Math.random() * 10) - 5;
    if (offset !== 0) {
      const wrong = answer + offset;
      if (wrong > 0 && wrong !== answer) {
        wrongChoices.add(wrong);
      }
    }
  }

  const choices = [answer, ...Array.from(wrongChoices)].sort(() => Math.random() - 0.5);

  return { prompt, answer, choices, hint };
}

/**
 * Get display info for a chest rarity
 */
export function getChestRarityInfo(rarity: ChestRarity): {
  label: string;
  emoji: string;
  description: string;
} {
  switch (rarity) {
    case 'common':
      return { label: 'Common', emoji: '📦', description: 'A simple wooden chest' };
    case 'rare':
      return { label: 'Rare', emoji: '💎', description: 'A chest with a blue glow' };
    case 'epic':
      return { label: 'Epic', emoji: '🔮', description: 'A magical purple chest' };
    case 'legendary':
      return { label: 'Legendary', emoji: '👑', description: 'A legendary golden chest!' };
    default:
      return { label: 'Unknown', emoji: '❓', description: 'A mysterious chest' };
  }
}
