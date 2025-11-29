/**
 * Daily Challenge System
 * Encourages daily play with streak bonuses and special rewards.
 */

import { quests } from '../learning/quests';

export interface DailyChallenge {
  date: string; // YYYY-MM-DD format
  questId: string;
  bonusXp: number;
  streakMultiplier: number;
  specialReward?: string;
}

export interface DailyProgress {
  currentStreak: number;
  longestStreak: number;
  lastCompletedDate: string | null;
  totalDailiesCompleted: number;
  dailyRewardsEarned: string[];
}

// Streak milestones with special rewards
export const STREAK_REWARDS: Record<number, { title: string; reward: string; cosmetic?: string }> = {
  3: { title: '3-Day Warrior', reward: 'First streak badge!', cosmetic: 'streak-badge-bronze' },
  7: { title: 'Week Warrior', reward: 'One full week!', cosmetic: 'streak-badge-silver' },
  14: { title: 'Fortnight Fighter', reward: 'Two weeks strong!', cosmetic: 'streak-badge-gold' },
  30: { title: 'Month Master', reward: 'A whole month!', cosmetic: 'streak-crown' },
  60: { title: 'Dedication Legend', reward: '60 days!', cosmetic: 'legendary-streak-aura' },
  100: { title: 'Century Champion', reward: '100 DAYS!', cosmetic: 'diamond-streak-wings' },
};

// XP bonus percentages based on streak
export const STREAK_XP_BONUSES: Record<number, number> = {
  0: 0,    // No streak
  1: 0,    // Day 1 - no bonus yet
  2: 5,    // Day 2 - 5% bonus
  3: 10,   // Day 3 - 10% bonus
  5: 15,   // Day 5 - 15% bonus
  7: 20,   // Week - 20% bonus
  14: 30,  // 2 weeks - 30% bonus
  30: 50,  // Month - 50% MAX bonus
};

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

/**
 * Get the XP bonus percentage for a given streak
 */
export function getStreakXpBonus(streak: number): number {
  // Find the highest tier the streak qualifies for
  const tiers = Object.keys(STREAK_XP_BONUSES)
    .map(Number)
    .sort((a, b) => b - a);

  for (const tier of tiers) {
    if (streak >= tier) {
      return STREAK_XP_BONUSES[tier];
    }
  }

  return 0;
}

/**
 * Generate the daily challenge for a given date
 * Uses date as seed for consistent results
 */
export function generateDailyChallenge(dateString?: string): DailyChallenge {
  const date = dateString || getTodayDateString();
  
  // Create a simple hash from the date for pseudo-random selection
  const dateHash = date.split('-').reduce((acc, part) => acc + parseInt(part, 10), 0);
  
  // Select quest based on date hash
  const questIndex = dateHash % quests.length;
  const quest = quests[questIndex];

  // Base bonus XP for dailies
  const bonusXp = 50;

  return {
    date,
    questId: quest.id,
    bonusXp,
    streakMultiplier: 1, // Gets multiplied by streak bonus
  };
}

/**
 * Check if a date is "yesterday" relative to another date
 */
export function isYesterday(dateString: string, relativeTo?: string): boolean {
  const today = relativeTo ? new Date(relativeTo) : new Date();
  const checkDate = new Date(dateString);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  return checkDate.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
}

/**
 * Check if a date is "today"
 */
export function isToday(dateString: string): boolean {
  return dateString === getTodayDateString();
}

/**
 * Calculate the new streak after completing today's challenge
 */
export function calculateNewStreak(progress: DailyProgress): number {
  const today = getTodayDateString();

  // Already completed today
  if (progress.lastCompletedDate === today) {
    return progress.currentStreak;
  }

  // Check if streak continues (completed yesterday)
  if (progress.lastCompletedDate && isYesterday(progress.lastCompletedDate)) {
    return progress.currentStreak + 1;
  }

  // Check if this is continuing from today (shouldn't happen but just in case)
  if (progress.lastCompletedDate === today) {
    return progress.currentStreak;
  }

  // Streak broken or first day
  return 1;
}

/**
 * Check if player missed a day and broke their streak
 */
export function isStreakBroken(progress: DailyProgress): boolean {
  if (!progress.lastCompletedDate) return false;
  
  const today = getTodayDateString();
  const lastCompleted = progress.lastCompletedDate;

  // If last completed was today or yesterday, streak is safe
  if (lastCompleted === today || isYesterday(lastCompleted)) {
    return false;
  }

  // Streak is broken
  return true;
}

/**
 * Get the next streak milestone
 */
export function getNextStreakMilestone(currentStreak: number): { 
  daysAway: number; 
  milestone: number;
  reward: typeof STREAK_REWARDS[number];
} | null {
  const milestones = Object.keys(STREAK_REWARDS)
    .map(Number)
    .sort((a, b) => a - b);

  for (const milestone of milestones) {
    if (milestone > currentStreak) {
      return {
        daysAway: milestone - currentStreak,
        milestone,
        reward: STREAK_REWARDS[milestone],
      };
    }
  }

  return null; // All milestones achieved!
}

/**
 * Check if completing today would earn a streak reward
 */
export function checkStreakReward(newStreak: number): typeof STREAK_REWARDS[number] | null {
  return STREAK_REWARDS[newStreak] || null;
}

/**
 * Create initial daily progress
 */
export function createInitialDailyProgress(): DailyProgress {
  return {
    currentStreak: 0,
    longestStreak: 0,
    lastCompletedDate: null,
    totalDailiesCompleted: 0,
    dailyRewardsEarned: [],
  };
}

/**
 * Update progress after completing a daily challenge
 */
export function completeDailyChallenge(progress: DailyProgress): {
  newProgress: DailyProgress;
  xpBonus: number;
  streakReward: typeof STREAK_REWARDS[number] | null;
  newMilestone: boolean;
} {
  const today = getTodayDateString();

  // Don't double-count if already completed today
  if (progress.lastCompletedDate === today) {
    return {
      newProgress: progress,
      xpBonus: 0,
      streakReward: null,
      newMilestone: false,
    };
  }

  const newStreak = calculateNewStreak(progress);
  const xpBonus = getStreakXpBonus(newStreak);
  const streakReward = checkStreakReward(newStreak);

  const newProgress: DailyProgress = {
    currentStreak: newStreak,
    longestStreak: Math.max(progress.longestStreak, newStreak),
    lastCompletedDate: today,
    totalDailiesCompleted: progress.totalDailiesCompleted + 1,
    dailyRewardsEarned: streakReward?.cosmetic
      ? [...progress.dailyRewardsEarned, streakReward.cosmetic]
      : progress.dailyRewardsEarned,
  };

  return {
    newProgress,
    xpBonus,
    streakReward,
    newMilestone: !!streakReward,
  };
}

/**
 * Get motivational message based on streak status
 */
export function getStreakMessage(progress: DailyProgress): string {
  const today = getTodayDateString();

  if (progress.lastCompletedDate === today) {
    return `✅ Daily complete! ${progress.currentStreak} day streak!`;
  }

  if (isStreakBroken(progress)) {
    return `Your ${progress.currentStreak} day streak ended 😢 Start a new one today!`;
  }

  if (progress.currentStreak === 0) {
    return 'Start your streak today! 🔥';
  }

  const nextMilestone = getNextStreakMilestone(progress.currentStreak);
  if (nextMilestone && nextMilestone.daysAway <= 3) {
    return `${progress.currentStreak} day streak! ${nextMilestone.daysAway} more for ${nextMilestone.reward.title}! 🎯`;
  }

  return `🔥 ${progress.currentStreak} day streak! Keep it going!`;
}
