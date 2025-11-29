/**
 * World System Types
 * Defines the structure for multiple game worlds that unlock as players progress.
 */

export type WorldTheme = 'school' | 'forest' | 'castle' | 'space' | 'underwater';

export interface WorldUnlockRequirement {
  type: 'level' | 'quests' | 'xp';
  value: number;
}

export interface SkyConfig {
  sunPosition?: [number, number, number];
  inclination?: number;
  azimuth?: number;
}

export interface World {
  id: string;
  name: string;
  description: string;
  theme: WorldTheme;
  unlockRequirement: WorldUnlockRequirement;
  questIds: string[];
  bossId?: string; // Optional boss battle for this world

  // Visual customization
  skyColor: string;
  groundColor: string;
  ambientColor: string;
  skyConfig?: SkyConfig;

  // Position where player spawns
  spawnPoint: [number, number, number];
}

export interface WorldProgress {
  worldId: string;
  questsCompleted: number;
  totalQuests: number;
  bossDefeated: boolean;
  firstVisited: number;
  lastVisited: number;
}

/**
 * Check if a world is unlocked based on player stats
 */
export function isWorldUnlocked(
  world: World,
  playerLevel: number,
  completedQuestIds: string[],
  totalXp: number
): boolean {
  switch (world.unlockRequirement.type) {
    case 'level':
      return playerLevel >= world.unlockRequirement.value;
    case 'quests':
      return completedQuestIds.length >= world.unlockRequirement.value;
    case 'xp':
      return totalXp >= world.unlockRequirement.value;
    default:
      return false;
  }
}

/**
 * Get unlock progress as a percentage
 */
export function getUnlockProgress(
  world: World,
  playerLevel: number,
  completedQuestIds: string[],
  totalXp: number
): number {
  const requirement = world.unlockRequirement;
  
  switch (requirement.type) {
    case 'level':
      return Math.min(100, (playerLevel / requirement.value) * 100);
    case 'quests':
      return Math.min(100, (completedQuestIds.length / requirement.value) * 100);
    case 'xp':
      return Math.min(100, (totalXp / requirement.value) * 100);
    default:
      return 0;
  }
}

/**
 * Get a human-readable description of what's needed to unlock
 */
export function getUnlockDescription(world: World): string {
  const { type, value } = world.unlockRequirement;
  
  switch (type) {
    case 'level':
      return `Reach Level ${value}`;
    case 'quests':
      return `Complete ${value} quests`;
    case 'xp':
      return `Earn ${value} XP`;
    default:
      return 'Unknown requirement';
  }
}
