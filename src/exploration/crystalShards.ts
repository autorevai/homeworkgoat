/**
 * Crystal Shard Definitions
 * Collectible shards scattered throughout worlds that unlock secret areas.
 * Collect all 5 shards in a world to unlock a secret boss or special reward!
 */

import type { CrystalShardDef } from '../persistence/types';

/**
 * Crystal colors and their meanings
 */
export const CRYSTAL_COLORS = {
  red: { hex: '#FF4444', glow: '#FF6666', meaning: 'Power' },
  blue: { hex: '#4444FF', glow: '#6666FF', meaning: 'Wisdom' },
  green: { hex: '#44FF44', glow: '#66FF66', meaning: 'Nature' },
  purple: { hex: '#AA44FF', glow: '#CC66FF', meaning: 'Mystery' },
  gold: { hex: '#FFD700', glow: '#FFEC8B', meaning: 'Mastery' },
} as const;

export type CrystalColor = keyof typeof CRYSTAL_COLORS;

/**
 * All crystal shards in the game - 5 per world
 * Collecting all 5 unlocks a secret area/reward
 */
export const CRYSTAL_SHARDS: CrystalShardDef[] = [
  // ============================================
  // World: School - 5 shards (unlock Scholar's Secret)
  // ============================================
  { id: 'shard-school-1', worldId: 'world-school', position: [17, 0, 8], color: 'blue' },
  { id: 'shard-school-2', worldId: 'world-school', position: [-17, 0, 8], color: 'blue' },
  { id: 'shard-school-3', worldId: 'world-school', position: [12, 0, -14], color: 'green' },
  { id: 'shard-school-4', worldId: 'world-school', position: [-12, 0, -14], color: 'green' },
  { id: 'shard-school-5', worldId: 'world-school', position: [0, 0, 16], color: 'gold', secretAreaId: 'secret-school-library' },

  // ============================================
  // World: Forest - 5 shards (unlock Forest Spirit's Grove)
  // ============================================
  { id: 'shard-forest-1', worldId: 'world-forest', position: [17, 0, 10], color: 'green' },
  { id: 'shard-forest-2', worldId: 'world-forest', position: [-17, 0, 10], color: 'green' },
  { id: 'shard-forest-3', worldId: 'world-forest', position: [14, 0, -12], color: 'purple' },
  { id: 'shard-forest-4', worldId: 'world-forest', position: [-14, 0, -12], color: 'purple' },
  { id: 'shard-forest-5', worldId: 'world-forest', position: [0, 0, -16], color: 'gold', secretAreaId: 'secret-forest-grove' },

  // ============================================
  // World: Castle - 5 shards (unlock Royal Treasury)
  // ============================================
  { id: 'shard-castle-1', worldId: 'world-castle', position: [16, 0, 10], color: 'purple' },
  { id: 'shard-castle-2', worldId: 'world-castle', position: [-16, 0, 10], color: 'purple' },
  { id: 'shard-castle-3', worldId: 'world-castle', position: [15, 0, -14], color: 'red' },
  { id: 'shard-castle-4', worldId: 'world-castle', position: [-15, 0, -14], color: 'red' },
  { id: 'shard-castle-5', worldId: 'world-castle', position: [0, 0, -15], color: 'gold', secretAreaId: 'secret-castle-treasury' },

  // ============================================
  // World: Space - 5 shards (unlock Cosmic Observatory)
  // ============================================
  { id: 'shard-space-1', worldId: 'world-space', position: [16, 0, 12], color: 'blue' },
  { id: 'shard-space-2', worldId: 'world-space', position: [-16, 0, 12], color: 'blue' },
  { id: 'shard-space-3', worldId: 'world-space', position: [14, 0, -10], color: 'purple' },
  { id: 'shard-space-4', worldId: 'world-space', position: [-14, 0, -10], color: 'purple' },
  { id: 'shard-space-5', worldId: 'world-space', position: [0, 0, -15], color: 'gold', secretAreaId: 'secret-space-observatory' },

  // ============================================
  // World: Underwater - 5 shards (unlock Atlantis Temple)
  // ============================================
  { id: 'shard-underwater-1', worldId: 'world-underwater', position: [15, 0, 14], color: 'blue' },
  { id: 'shard-underwater-2', worldId: 'world-underwater', position: [-15, 0, 14], color: 'blue' },
  { id: 'shard-underwater-3', worldId: 'world-underwater', position: [12, 0, -10], color: 'green' },
  { id: 'shard-underwater-4', worldId: 'world-underwater', position: [-12, 0, -10], color: 'green' },
  { id: 'shard-underwater-5', worldId: 'world-underwater', position: [0, 0, -16], color: 'gold', secretAreaId: 'secret-underwater-temple' },
];

/**
 * Get all shards for a specific world
 */
export function getShardsForWorld(worldId: string): CrystalShardDef[] {
  return CRYSTAL_SHARDS.filter((shard) => shard.worldId === worldId);
}

/**
 * Get a shard by ID
 */
export function getShardById(shardId: string): CrystalShardDef | undefined {
  return CRYSTAL_SHARDS.find((shard) => shard.id === shardId);
}

/**
 * Check if all shards in a world are collected
 */
export function areAllShardsCollected(worldId: string, collectedShardIds: string[]): boolean {
  const worldShards = getShardsForWorld(worldId);
  return worldShards.every((shard) => collectedShardIds.includes(shard.id));
}

/**
 * Get collection progress for a world
 */
export function getShardProgress(worldId: string, collectedShardIds: string[]): { collected: number; total: number } {
  const worldShards = getShardsForWorld(worldId);
  const collected = worldShards.filter((shard) => collectedShardIds.includes(shard.id)).length;
  return { collected, total: worldShards.length };
}

/**
 * Generate a math problem for collecting a shard
 * Shards are slightly easier than chests - meant to be scattered rewards
 */
export function generateShardPuzzle(color: string): {
  prompt: string;
  answer: number;
  choices: number[];
  hint: string;
} {
  let a: number, b: number, answer: number, prompt: string, hint: string;

  // Shards use simpler problems - more about exploration than difficulty
  if (color === 'gold') {
    // Gold shards are harder - they're the final piece
    a = Math.floor(Math.random() * 9) + 2;
    b = Math.floor(Math.random() * 9) + 2;
    answer = a * b;
    prompt = `${a} × ${b} = ?`;
    hint = `Think of ${a} groups of ${b}`;
  } else {
    // Regular shards - simple addition/subtraction
    a = Math.floor(Math.random() * 15) + 5;
    b = Math.floor(Math.random() * 10) + 1;
    if (Math.random() > 0.5) {
      answer = a + b;
      prompt = `${a} + ${b} = ?`;
      hint = `Start at ${a} and count up ${b}`;
    } else {
      answer = a - b;
      prompt = `${a} - ${b} = ?`;
      hint = `Start at ${a} and count down ${b}`;
    }
  }

  // Generate wrong choices close to the answer
  const wrongChoices = new Set<number>();
  while (wrongChoices.size < 3) {
    const offset = Math.floor(Math.random() * 8) - 4;
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
 * Get reward for collecting all shards in a world
 */
export function getShardCollectionReward(worldId: string): {
  xp: number;
  coins: number;
  cosmetic: string;
  title: string;
} {
  switch (worldId) {
    case 'world-school':
      return { xp: 100, coins: 75, cosmetic: 'scholar-hat', title: 'Master Scholar' };
    case 'world-forest':
      return { xp: 150, coins: 100, cosmetic: 'forest-spirit-aura', title: 'Forest Friend' };
    case 'world-castle':
      return { xp: 200, coins: 150, cosmetic: 'royal-cape', title: 'Royal Champion' };
    case 'world-space':
      return { xp: 250, coins: 200, cosmetic: 'astronaut-helmet', title: 'Space Explorer' };
    case 'world-underwater':
      return { xp: 300, coins: 250, cosmetic: 'poseidon-crown', title: 'Ocean Master' };
    default:
      return { xp: 100, coins: 50, cosmetic: 'mystery-gem', title: 'Shard Collector' };
  }
}
