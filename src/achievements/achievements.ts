/**
 * Achievement System
 * Badges and rewards for reaching milestones.
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'exploration' | 'combat' | 'learning' | 'collection' | 'special';
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  xpReward: number;
  coinReward?: number;
  cosmeticReward?: string;
  condition: AchievementCondition;
  secret?: boolean; // Hidden until unlocked
}

export type AchievementCondition =
  | { type: 'questsCompleted'; count: number }
  | { type: 'bossesDefeated'; count: number }
  | { type: 'chestsOpened'; count: number }
  | { type: 'shardsCollected'; count: number }
  | { type: 'worldShardsComplete'; worldId: string }
  | { type: 'levelReached'; level: number }
  | { type: 'xpEarned'; xp: number }
  | { type: 'questionsCorrect'; count: number }
  | { type: 'streak'; days: number }
  | { type: 'speedBonusCount'; count: number }
  | { type: 'perfectQuest'; count: number }
  | { type: 'worldsUnlocked'; count: number }
  | { type: 'skillMastery'; skill: string; percentage: number }
  | { type: 'firstBoss' }
  | { type: 'firstChest' }
  | { type: 'firstShard' }
  | { type: 'tutorialComplete' };

export const ACHIEVEMENTS: Achievement[] = [
  // === EXPLORATION ACHIEVEMENTS ===
  {
    id: 'first-chest',
    name: 'Treasure Hunter',
    description: 'Open your first treasure chest',
    icon: '📦',
    category: 'exploration',
    tier: 'bronze',
    xpReward: 25,
    condition: { type: 'firstChest' },
  },
  {
    id: 'chest-collector-10',
    name: 'Chest Collector',
    description: 'Open 10 treasure chests',
    icon: '🎁',
    category: 'exploration',
    tier: 'silver',
    xpReward: 100,
    coinReward: 50,
    condition: { type: 'chestsOpened', count: 10 },
  },
  {
    id: 'chest-master-25',
    name: 'Treasure Master',
    description: 'Open 25 treasure chests',
    icon: '💰',
    category: 'exploration',
    tier: 'gold',
    xpReward: 250,
    coinReward: 100,
    cosmeticReward: 'treasure-hunter-cape',
    condition: { type: 'chestsOpened', count: 25 },
  },
  {
    id: 'chest-legend-50',
    name: 'Legendary Treasure Hunter',
    description: 'Open all 50 treasure chests',
    icon: '👑',
    category: 'exploration',
    tier: 'platinum',
    xpReward: 500,
    coinReward: 250,
    cosmeticReward: 'golden-aura',
    condition: { type: 'chestsOpened', count: 50 },
  },
  {
    id: 'first-shard',
    name: 'Crystal Finder',
    description: 'Collect your first crystal shard',
    icon: '💎',
    category: 'collection',
    tier: 'bronze',
    xpReward: 25,
    condition: { type: 'firstShard' },
  },
  {
    id: 'shard-collector-10',
    name: 'Crystal Collector',
    description: 'Collect 10 crystal shards',
    icon: '✨',
    category: 'collection',
    tier: 'silver',
    xpReward: 100,
    coinReward: 50,
    condition: { type: 'shardsCollected', count: 10 },
  },
  {
    id: 'shard-master-25',
    name: 'Crystal Master',
    description: 'Collect all 25 crystal shards',
    icon: '🌟',
    category: 'collection',
    tier: 'platinum',
    xpReward: 500,
    coinReward: 200,
    cosmeticReward: 'crystal-crown',
    condition: { type: 'shardsCollected', count: 25 },
  },
  {
    id: 'school-shards-complete',
    name: 'School Spirit',
    description: 'Collect all shards in School Courtyard',
    icon: '🏫',
    category: 'collection',
    tier: 'gold',
    xpReward: 150,
    condition: { type: 'worldShardsComplete', worldId: 'world-school' },
  },
  {
    id: 'forest-shards-complete',
    name: 'Forest Friend',
    description: 'Collect all shards in Enchanted Forest',
    icon: '🌲',
    category: 'collection',
    tier: 'gold',
    xpReward: 200,
    condition: { type: 'worldShardsComplete', worldId: 'world-forest' },
  },

  // === COMBAT ACHIEVEMENTS ===
  {
    id: 'first-boss',
    name: 'Boss Slayer',
    description: 'Defeat your first boss',
    icon: '⚔️',
    category: 'combat',
    tier: 'bronze',
    xpReward: 50,
    condition: { type: 'firstBoss' },
  },
  {
    id: 'boss-hunter-5',
    name: 'Boss Hunter',
    description: 'Defeat 5 bosses',
    icon: '🗡️',
    category: 'combat',
    tier: 'silver',
    xpReward: 150,
    coinReward: 75,
    condition: { type: 'bossesDefeated', count: 5 },
  },
  {
    id: 'boss-champion-10',
    name: 'Champion',
    description: 'Defeat 10 bosses',
    icon: '🏆',
    category: 'combat',
    tier: 'gold',
    xpReward: 300,
    coinReward: 150,
    cosmeticReward: 'champion-helm',
    condition: { type: 'bossesDefeated', count: 10 },
  },
  {
    id: 'speed-demon-10',
    name: 'Speed Demon',
    description: 'Get 10 speed bonuses in boss battles',
    icon: '⚡',
    category: 'combat',
    tier: 'silver',
    xpReward: 100,
    condition: { type: 'speedBonusCount', count: 10 },
  },
  {
    id: 'speed-master-50',
    name: 'Lightning Calculator',
    description: 'Get 50 speed bonuses in boss battles',
    icon: '🌩️',
    category: 'combat',
    tier: 'gold',
    xpReward: 250,
    cosmeticReward: 'lightning-aura',
    condition: { type: 'speedBonusCount', count: 50 },
  },

  // === LEARNING ACHIEVEMENTS ===
  {
    id: 'first-quest',
    name: 'Apprentice',
    description: 'Complete your first quest',
    icon: '📚',
    category: 'learning',
    tier: 'bronze',
    xpReward: 20,
    condition: { type: 'questsCompleted', count: 1 },
  },
  {
    id: 'quest-seeker-10',
    name: 'Quest Seeker',
    description: 'Complete 10 quests',
    icon: '📖',
    category: 'learning',
    tier: 'silver',
    xpReward: 100,
    condition: { type: 'questsCompleted', count: 10 },
  },
  {
    id: 'quest-master-50',
    name: 'Quest Master',
    description: 'Complete 50 quests',
    icon: '🎓',
    category: 'learning',
    tier: 'gold',
    xpReward: 300,
    coinReward: 150,
    cosmeticReward: 'scholar-robe',
    condition: { type: 'questsCompleted', count: 50 },
  },
  {
    id: 'correct-100',
    name: 'Math Whiz',
    description: 'Answer 100 questions correctly',
    icon: '🧮',
    category: 'learning',
    tier: 'silver',
    xpReward: 150,
    condition: { type: 'questionsCorrect', count: 100 },
  },
  {
    id: 'correct-500',
    name: 'Math Genius',
    description: 'Answer 500 questions correctly',
    icon: '🧠',
    category: 'learning',
    tier: 'gold',
    xpReward: 400,
    cosmeticReward: 'genius-glasses',
    condition: { type: 'questionsCorrect', count: 500 },
  },
  {
    id: 'perfect-quest-5',
    name: 'Perfectionist',
    description: 'Complete 5 quests with all correct answers',
    icon: '💯',
    category: 'learning',
    tier: 'silver',
    xpReward: 150,
    condition: { type: 'perfectQuest', count: 5 },
  },
  {
    id: 'perfect-quest-20',
    name: 'Flawless',
    description: 'Complete 20 quests with all correct answers',
    icon: '⭐',
    category: 'learning',
    tier: 'gold',
    xpReward: 350,
    cosmeticReward: 'star-cape',
    condition: { type: 'perfectQuest', count: 20 },
  },

  // === SPECIAL ACHIEVEMENTS ===
  {
    id: 'tutorial-complete',
    name: 'Ready to Learn!',
    description: 'Complete the tutorial',
    icon: '🎮',
    category: 'special',
    tier: 'bronze',
    xpReward: 15,
    condition: { type: 'tutorialComplete' },
  },
  {
    id: 'level-5',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '🌟',
    category: 'special',
    tier: 'bronze',
    xpReward: 50,
    condition: { type: 'levelReached', level: 5 },
  },
  {
    id: 'level-10',
    name: 'Math Hero',
    description: 'Reach level 10',
    icon: '🦸',
    category: 'special',
    tier: 'silver',
    xpReward: 150,
    coinReward: 100,
    condition: { type: 'levelReached', level: 10 },
  },
  {
    id: 'level-20',
    name: 'Math Legend',
    description: 'Reach level 20',
    icon: '👑',
    category: 'special',
    tier: 'gold',
    xpReward: 400,
    coinReward: 250,
    cosmeticReward: 'legendary-crown',
    condition: { type: 'levelReached', level: 20 },
  },
  {
    id: 'streak-7',
    name: 'Dedicated Learner',
    description: 'Play for 7 days in a row',
    icon: '📅',
    category: 'special',
    tier: 'silver',
    xpReward: 200,
    coinReward: 100,
    condition: { type: 'streak', days: 7 },
  },
  {
    id: 'streak-30',
    name: 'Commitment Master',
    description: 'Play for 30 days in a row',
    icon: '🔥',
    category: 'special',
    tier: 'platinum',
    xpReward: 1000,
    coinReward: 500,
    cosmeticReward: 'flame-aura',
    condition: { type: 'streak', days: 30 },
  },
  {
    id: 'world-explorer-3',
    name: 'World Explorer',
    description: 'Unlock 3 different worlds',
    icon: '🌍',
    category: 'exploration',
    tier: 'silver',
    xpReward: 150,
    condition: { type: 'worldsUnlocked', count: 3 },
  },
  {
    id: 'world-master-5',
    name: 'World Master',
    description: 'Unlock all 5 worlds',
    icon: '🌌',
    category: 'exploration',
    tier: 'gold',
    xpReward: 400,
    coinReward: 200,
    cosmeticReward: 'cosmic-cape',
    condition: { type: 'worldsUnlocked', count: 5 },
  },

  // === SECRET ACHIEVEMENTS ===
  {
    id: 'xp-milestone-1000',
    name: 'Experience Seeker',
    description: 'Earn 1000 total XP',
    icon: '✨',
    category: 'special',
    tier: 'bronze',
    xpReward: 50,
    condition: { type: 'xpEarned', xp: 1000 },
    secret: true,
  },
  {
    id: 'xp-milestone-10000',
    name: 'XP Master',
    description: 'Earn 10000 total XP',
    icon: '💫',
    category: 'special',
    tier: 'gold',
    xpReward: 300,
    cosmeticReward: 'xp-glow',
    condition: { type: 'xpEarned', xp: 10000 },
    secret: true,
  },
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter((a) => a.category === category);
}

/**
 * Check if a specific achievement condition is met
 */
export function checkAchievementCondition(
  condition: AchievementCondition,
  stats: AchievementStats
): boolean {
  switch (condition.type) {
    case 'questsCompleted':
      return stats.questsCompleted >= condition.count;
    case 'bossesDefeated':
      return stats.bossesDefeated >= condition.count;
    case 'chestsOpened':
      return stats.chestsOpened >= condition.count;
    case 'shardsCollected':
      return stats.shardsCollected >= condition.count;
    case 'worldShardsComplete':
      return stats.completedWorldShards.includes(condition.worldId);
    case 'levelReached':
      return stats.level >= condition.level;
    case 'xpEarned':
      return stats.xp >= condition.xp;
    case 'questionsCorrect':
      return stats.questionsCorrect >= condition.count;
    case 'streak':
      return stats.currentStreak >= condition.days;
    case 'speedBonusCount':
      return stats.speedBonuses >= condition.count;
    case 'perfectQuest':
      return stats.perfectQuests >= condition.count;
    case 'worldsUnlocked':
      return stats.worldsUnlocked >= condition.count;
    case 'skillMastery':
      return (stats.skillMastery[condition.skill] || 0) >= condition.percentage;
    case 'firstBoss':
      return stats.bossesDefeated >= 1;
    case 'firstChest':
      return stats.chestsOpened >= 1;
    case 'firstShard':
      return stats.shardsCollected >= 1;
    case 'tutorialComplete':
      return stats.tutorialCompleted;
    default:
      return false;
  }
}

/**
 * Stats used to check achievement conditions
 */
export interface AchievementStats {
  questsCompleted: number;
  bossesDefeated: number;
  chestsOpened: number;
  shardsCollected: number;
  completedWorldShards: string[];
  level: number;
  xp: number;
  questionsCorrect: number;
  currentStreak: number;
  speedBonuses: number;
  perfectQuests: number;
  worldsUnlocked: number;
  skillMastery: Record<string, number>;
  tutorialCompleted: boolean;
}

/**
 * Check all achievements and return newly unlocked ones
 */
export function checkAchievements(
  stats: AchievementStats,
  unlockedAchievementIds: string[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (unlockedAchievementIds.includes(achievement.id)) {
      continue;
    }

    // Check if condition is met
    if (checkAchievementCondition(achievement.condition, stats)) {
      newlyUnlocked.push(achievement);
    }
  }

  return newlyUnlocked;
}

/**
 * Get tier color for display
 */
export function getTierColor(tier: Achievement['tier']): string {
  switch (tier) {
    case 'bronze':
      return '#CD7F32';
    case 'silver':
      return '#C0C0C0';
    case 'gold':
      return '#FFD700';
    case 'platinum':
      return '#E5E4E2';
    default:
      return '#888888';
  }
}

/**
 * Get progress towards an achievement (0-100)
 */
export function getAchievementProgress(
  achievement: Achievement,
  stats: AchievementStats
): number {
  const condition = achievement.condition;

  switch (condition.type) {
    case 'questsCompleted':
      return Math.min(100, (stats.questsCompleted / condition.count) * 100);
    case 'bossesDefeated':
      return Math.min(100, (stats.bossesDefeated / condition.count) * 100);
    case 'chestsOpened':
      return Math.min(100, (stats.chestsOpened / condition.count) * 100);
    case 'shardsCollected':
      return Math.min(100, (stats.shardsCollected / condition.count) * 100);
    case 'levelReached':
      return Math.min(100, (stats.level / condition.level) * 100);
    case 'xpEarned':
      return Math.min(100, (stats.xp / condition.xp) * 100);
    case 'questionsCorrect':
      return Math.min(100, (stats.questionsCorrect / condition.count) * 100);
    case 'streak':
      return Math.min(100, (stats.currentStreak / condition.days) * 100);
    case 'speedBonusCount':
      return Math.min(100, (stats.speedBonuses / condition.count) * 100);
    case 'perfectQuest':
      return Math.min(100, (stats.perfectQuests / condition.count) * 100);
    case 'worldsUnlocked':
      return Math.min(100, (stats.worldsUnlocked / condition.count) * 100);
    case 'worldShardsComplete':
      return stats.completedWorldShards.includes(condition.worldId) ? 100 : 0;
    case 'firstBoss':
    case 'firstChest':
    case 'firstShard':
    case 'tutorialComplete':
      return checkAchievementCondition(condition, stats) ? 100 : 0;
    default:
      return 0;
  }
}
