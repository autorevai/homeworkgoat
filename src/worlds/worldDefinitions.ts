/**
 * World Definitions
 * All available worlds in Homework GOAT.
 */

import type { World } from './types';

export const worlds: World[] = [
  // ===================
  // WORLD 1: SCHOOL COURTYARD (Starting Area)
  // ===================
  {
    id: 'world-school',
    name: 'School Courtyard',
    description: 'Where every math hero begins their journey! Meet friendly NPCs and learn the basics.',
    theme: 'school',
    unlockRequirement: { type: 'level', value: 1 },
    questIds: [
      'quest-power-crystals',
      'quest-treasure-hunt',
      'quest-robot-repair',
      'quest-lunch-count',
    ],
    skyColor: '#87CEEB',
    groundColor: '#4a7c4e',
    ambientColor: '#ffffff',
    spawnPoint: [0, 0, 8],
  },

  // ===================
  // WORLD 2: ENCHANTED FOREST
  // ===================
  {
    id: 'world-forest',
    name: 'Enchanted Forest',
    description: 'Magical creatures need your math skills! Help fairies, owls, and forest guardians.',
    theme: 'forest',
    unlockRequirement: { type: 'level', value: 3 },
    questIds: [
      'quest-fairy-lights',
      'quest-owl-wisdom',
      'quest-mushroom-math',
      'quest-forest-guardian',
    ],
    bossId: 'boss-tree-spirit',
    skyColor: '#2d5a27',
    groundColor: '#3d6b35',
    ambientColor: '#90EE90',
    spawnPoint: [0, 0, 10],
  },

  // ===================
  // WORLD 3: KINGDOM OF NUMBERS
  // ===================
  {
    id: 'world-castle',
    name: 'Kingdom of Numbers',
    description: 'The royal castle awaits! Help knights, wizards, and the King himself!',
    theme: 'castle',
    unlockRequirement: { type: 'level', value: 5 },
    questIds: [
      'quest-royal-vault',
      'quest-knight-training',
      'quest-wizard-potions',
      'quest-dragon-eggs',
    ],
    bossId: 'boss-math-dragon',
    skyColor: '#4a4a6a',
    groundColor: '#8b7355',
    ambientColor: '#FFD700',
    spawnPoint: [0, 0, 12],
  },

  // ===================
  // WORLD 4: SPACE STATION ALPHA
  // ===================
  {
    id: 'world-space',
    name: 'Space Station Alpha',
    description: 'Math is universal! Help astronauts and aliens in the cosmos!',
    theme: 'space',
    unlockRequirement: { type: 'level', value: 8 },
    questIds: [
      'quest-asteroid-count',
      'quest-fuel-calculation',
      'quest-alien-decoder',
      'quest-gravity-math',
    ],
    bossId: 'boss-cosmic-calculator',
    skyColor: '#0a0a2e',
    groundColor: '#2a2a4a',
    ambientColor: '#00FFFF',
    spawnPoint: [0, 0, 8],
  },

  // ===================
  // WORLD 5: UNDERWATER KINGDOM (Bonus World)
  // ===================
  {
    id: 'world-underwater',
    name: 'Underwater Kingdom',
    description: 'Dive deep into math mysteries with mermaids and sea creatures!',
    theme: 'underwater',
    unlockRequirement: { type: 'level', value: 12 },
    questIds: [
      'quest-pearl-counting',
      'quest-treasure-dive',
      'quest-coral-calculation',
      'quest-whale-song',
    ],
    bossId: 'boss-kraken-king',
    skyColor: '#006994',
    groundColor: '#0077be',
    ambientColor: '#00CED1',
    spawnPoint: [0, 0, 8],
  },
];

/**
 * Get a world by its ID
 */
export function getWorldById(id: string): World | undefined {
  return worlds.find((w) => w.id === id);
}

/**
 * Get the starting world
 */
export function getStartingWorld(): World {
  return worlds[0];
}

/**
 * Get all unlocked worlds for a player
 */
export function getUnlockedWorlds(
  playerLevel: number,
  completedQuestIds: string[],
  totalXp: number
): World[] {
  return worlds.filter((world) => {
    const { type, value } = world.unlockRequirement;
    switch (type) {
      case 'level':
        return playerLevel >= value;
      case 'quests':
        return completedQuestIds.length >= value;
      case 'xp':
        return totalXp >= value;
      default:
        return false;
    }
  });
}

/**
 * Get the next world to unlock
 */
export function getNextWorldToUnlock(
  playerLevel: number,
  completedQuestIds: string[],
  totalXp: number
): World | null {
  const unlocked = getUnlockedWorlds(playerLevel, completedQuestIds, totalXp);
  const unlockedIds = new Set(unlocked.map((w) => w.id));
  
  return worlds.find((w) => !unlockedIds.has(w.id)) || null;
}

/**
 * Get quests for a specific world
 */
export function getWorldQuestIds(worldId: string): string[] {
  const world = getWorldById(worldId);
  return world?.questIds || [];
}
