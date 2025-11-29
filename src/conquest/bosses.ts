/**
 * Conquest Mode - Boss Battle System
 * Epic boss fights that test students' math skills!
 */

export type BossDifficulty = 'easy' | 'medium' | 'hard' | 'legendary';

export interface BossPhase {
  name: string;
  healthThreshold: number; // Boss enters this phase when health drops to this %
  dialogue: string;
  speedMultiplier: number; // How much faster questions come
  questionDifficulty: 'easy' | 'medium' | 'mixed';
}

export interface BossBattle {
  id: string;
  name: string;
  description: string;
  bossName: string;
  worldId: string;
  requiredQuests: string[]; // Must complete these first
  questionCount: number;
  timeLimit?: number; // Optional timer in seconds
  difficulty: BossDifficulty;
  phases: BossPhase[];
  rewards: {
    xp: number;
    cosmetics: string[];
    title?: string;
  };
  // Visual theming
  bossEmoji: string;
  backgroundColor: string;
  accentColor: string;
}

export interface BossBattleProgress {
  bossId: string;
  currentHealth: number; // 0-100
  questionsAnswered: number;
  correctAnswers: number;
  currentPhase: number;
  timeRemaining?: number;
  defeated: boolean;
}

export const bossBattles: BossBattle[] = [
  // =====================================================
  // FOREST BOSS: Tree Spirit
  // =====================================================
  {
    id: 'boss-tree-spirit',
    name: 'Wrath of the Ancient Tree',
    description: 'The Tree Spirit has awakened and only math can calm its fury!',
    bossName: 'Elderwood the Ancient',
    worldId: 'world-forest',
    requiredQuests: ['quest-fairy-lights', 'quest-owl-wisdom', 'quest-mushroom-math'],
    questionCount: 8,
    difficulty: 'easy',
    phases: [
      {
        name: 'Awakening',
        healthThreshold: 100,
        dialogue: '*ancient groaning* Who disturbs my slumber?!',
        speedMultiplier: 1.0,
        questionDifficulty: 'easy',
      },
      {
        name: 'Rustling Fury',
        healthThreshold: 50,
        dialogue: '*leaves shake violently* You dare challenge me?!',
        speedMultiplier: 1.2,
        questionDifficulty: 'mixed',
      },
      {
        name: 'Final Stand',
        healthThreshold: 25,
        dialogue: '*bark creaks* Perhaps... you ARE worthy...',
        speedMultiplier: 1.0,
        questionDifficulty: 'easy',
      },
    ],
    rewards: {
      xp: 300,
      cosmetics: ['leaf-crown', 'bark-armor'],
      title: 'Friend of the Forest',
    },
    bossEmoji: '🌳',
    backgroundColor: '#1a3d1a',
    accentColor: '#4CAF50',
  },

  // =====================================================
  // CASTLE BOSS: Math Dragon
  // =====================================================
  {
    id: 'boss-math-dragon',
    name: 'The Math Dragon',
    description: 'Defeat the legendary dragon by solving 10 problems without mercy!',
    bossName: 'Calculus the Fierce',
    worldId: 'world-castle',
    requiredQuests: ['quest-royal-vault', 'quest-knight-training', 'quest-wizard-potions'],
    questionCount: 10,
    timeLimit: 180, // 3 minutes
    difficulty: 'hard',
    phases: [
      {
        name: 'Dragon\'s Welcome',
        healthThreshold: 100,
        dialogue: '*breathes fire* Another hero to roast! Let\'s see your math skills!',
        speedMultiplier: 1.0,
        questionDifficulty: 'easy',
      },
      {
        name: 'Heated Battle',
        healthThreshold: 70,
        dialogue: '*eyes glow red* Not bad, little one. But can you handle THIS?!',
        speedMultiplier: 1.3,
        questionDifficulty: 'medium',
      },
      {
        name: 'Inferno Mode',
        healthThreshold: 40,
        dialogue: '*spreads wings* FEEL MY MATHEMATICAL FURY!',
        speedMultiplier: 1.5,
        questionDifficulty: 'medium',
      },
      {
        name: 'Final Calculation',
        healthThreshold: 15,
        dialogue: '*panting* Impossible... you may... actually... win...',
        speedMultiplier: 1.2,
        questionDifficulty: 'mixed',
      },
    ],
    rewards: {
      xp: 500,
      cosmetics: ['dragon-helmet', 'flame-cape', 'dragon-wings'],
      title: 'Dragon Slayer',
    },
    bossEmoji: '🐉',
    backgroundColor: '#3d1a1a',
    accentColor: '#FF5722',
  },

  // =====================================================
  // SPACE BOSS: Cosmic Calculator
  // =====================================================
  {
    id: 'boss-cosmic-calculator',
    name: 'Cosmic Calculator Showdown',
    description: 'Face the AI that guards the galaxy\'s mathematical secrets!',
    bossName: 'CALC-9000',
    worldId: 'world-space',
    requiredQuests: ['quest-asteroid-count', 'quest-fuel-calculation', 'quest-alien-decoder'],
    questionCount: 12,
    timeLimit: 240, // 4 minutes
    difficulty: 'hard',
    phases: [
      {
        name: 'System Boot',
        healthThreshold: 100,
        dialogue: 'INITIATING MATH PROTOCOL... PREPARE FOR CALCULATION.',
        speedMultiplier: 1.0,
        questionDifficulty: 'easy',
      },
      {
        name: 'Processing',
        healthThreshold: 75,
        dialogue: 'IMPRESSIVE. INCREASING DIFFICULTY PARAMETERS.',
        speedMultiplier: 1.2,
        questionDifficulty: 'mixed',
      },
      {
        name: 'Overclocked',
        healthThreshold: 50,
        dialogue: 'WARNING: HUMAN EXCEEDING EXPECTED PERFORMANCE.',
        speedMultiplier: 1.4,
        questionDifficulty: 'medium',
      },
      {
        name: 'Critical Error',
        healthThreshold: 25,
        dialogue: 'ERROR 404: DEFEAT NOT COMPUTED. HOW IS THIS POSSIBLE?!',
        speedMultiplier: 1.1,
        questionDifficulty: 'medium',
      },
    ],
    rewards: {
      xp: 600,
      cosmetics: ['cyber-visor', 'neon-suit', 'hologram-pet'],
      title: 'Galaxy Brain',
    },
    bossEmoji: '🤖',
    backgroundColor: '#0a1a3d',
    accentColor: '#00BCD4',
  },

  // =====================================================
  // UNDERWATER BOSS: Kraken King
  // =====================================================
  {
    id: 'boss-kraken-king',
    name: 'Wrath of the Kraken King',
    description: 'The legendary sea monster rises! Only perfect math can defeat it!',
    bossName: 'Kraken King Tentaculus',
    worldId: 'world-underwater',
    requiredQuests: ['quest-pearl-counting', 'quest-treasure-dive', 'quest-coral-calculation'],
    questionCount: 15,
    timeLimit: 300, // 5 minutes
    difficulty: 'legendary',
    phases: [
      {
        name: 'Rising Tide',
        healthThreshold: 100,
        dialogue: '*emerges from the depths* WHO DARES ENTER MY DOMAIN?!',
        speedMultiplier: 1.0,
        questionDifficulty: 'easy',
      },
      {
        name: 'Tentacle Terror',
        healthThreshold: 80,
        dialogue: '*tentacles writhe* You have courage! But do you have SKILL?!',
        speedMultiplier: 1.2,
        questionDifficulty: 'mixed',
      },
      {
        name: 'Ink Storm',
        healthThreshold: 60,
        dialogue: '*sprays ink* CAN YOU THINK THROUGH THE DARKNESS?!',
        speedMultiplier: 1.4,
        questionDifficulty: 'medium',
      },
      {
        name: 'Maelstrom',
        healthThreshold: 35,
        dialogue: '*creates whirlpool* THE SEA ITSELF FIGHTS FOR ME!',
        speedMultiplier: 1.5,
        questionDifficulty: 'medium',
      },
      {
        name: 'Last Wave',
        healthThreshold: 15,
        dialogue: '*weakening* You... are worthy... of the crown...',
        speedMultiplier: 1.0,
        questionDifficulty: 'mixed',
      },
    ],
    rewards: {
      xp: 1000,
      cosmetics: ['kraken-crown', 'ocean-cape', 'trident-staff', 'bubble-aura'],
      title: 'Ocean Conqueror',
    },
    bossEmoji: '🦑',
    backgroundColor: '#0a2a3d',
    accentColor: '#26C6DA',
  },
];

/**
 * Get boss battle by ID
 */
export function getBossBattleById(id: string): BossBattle | undefined {
  return bossBattles.find((b) => b.id === id);
}

/**
 * Get boss battle for a world
 */
export function getBossBattleForWorld(worldId: string): BossBattle | undefined {
  return bossBattles.find((b) => b.worldId === worldId);
}

/**
 * Get all bosses for a world
 */
export function getBossesForWorld(worldId: string): BossBattle[] {
  return bossBattles.filter((b) => b.worldId === worldId);
}

/**
 * Check if boss is unlocked (all required quests completed)
 */
export function isBossUnlocked(boss: BossBattle, completedQuestIds: string[]): boolean {
  return boss.requiredQuests.every((questId) => completedQuestIds.includes(questId));
}

/**
 * Get current boss phase based on remaining health
 */
export function getCurrentBossPhase(boss: BossBattle, currentHealth: number): BossPhase {
  // Find the phase with the highest threshold that's still at or below current health
  for (let i = boss.phases.length - 1; i >= 0; i--) {
    if (currentHealth <= boss.phases[i].healthThreshold) {
      return boss.phases[i];
    }
  }
  return boss.phases[0];
}

/**
 * Calculate damage dealt to boss per correct answer
 */
export function calculateBossDamage(boss: BossBattle): number {
  return Math.ceil(100 / boss.questionCount);
}

/**
 * Create initial boss battle progress
 */
export function createBossBattleProgress(boss: BossBattle): BossBattleProgress {
  return {
    bossId: boss.id,
    currentHealth: 100,
    questionsAnswered: 0,
    correctAnswers: 0,
    currentPhase: 0,
    timeRemaining: boss.timeLimit,
    defeated: false,
  };
}

/**
 * Get difficulty display info
 */
export function getDifficultyInfo(difficulty: BossDifficulty): { 
  label: string; 
  color: string; 
  stars: number;
} {
  switch (difficulty) {
    case 'easy':
      return { label: 'Easy', color: '#4CAF50', stars: 1 };
    case 'medium':
      return { label: 'Medium', color: '#FF9800', stars: 2 };
    case 'hard':
      return { label: 'Hard', color: '#f44336', stars: 3 };
    case 'legendary':
      return { label: 'LEGENDARY', color: '#9C27B0', stars: 5 };
  }
}
