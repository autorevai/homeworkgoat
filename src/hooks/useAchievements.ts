/**
 * Achievement Hook
 * Manages achievement checking and unlocking.
 */

import { useCallback, useState } from 'react';
import { useGameState } from './useGameState';
import {
  Achievement,
  ACHIEVEMENTS,
  checkAchievements,
  AchievementStats,
} from '../achievements/achievements';
import { getShardsForWorld } from '../exploration/crystalShards';
import { worlds } from '../worlds/worldDefinitions';

export function useAchievements() {
  const { saveData, updateSaveData, addXp, level } = useGameState();
  const [pendingAchievements, setPendingAchievements] = useState<Achievement[]>([]);

  /**
   * Build achievement stats from current save data
   */
  const buildStats = useCallback((): AchievementStats => {
    // Check which worlds have all shards collected
    const completedWorldShards: string[] = [];
    for (const world of worlds) {
      const worldShards = getShardsForWorld(world.id);
      const allCollected = worldShards.every((s) =>
        saveData.collectedShardIds?.includes(s.id)
      );
      if (allCollected) {
        completedWorldShards.push(world.id);
      }
    }

    // Calculate skill mastery percentages
    const skillMastery: Record<string, number> = {};
    const skills = saveData.learningStats?.skillProgress || {};
    for (const [skill, progress] of Object.entries(skills)) {
      if (progress.total > 0) {
        skillMastery[skill] = (progress.correct / progress.total) * 100;
      }
    }

    return {
      questsCompleted: saveData.completedQuestIds?.length || 0,
      bossesDefeated: saveData.defeatedBossIds?.length || 0,
      chestsOpened: saveData.openedChestIds?.length || 0,
      shardsCollected: saveData.collectedShardIds?.length || 0,
      completedWorldShards,
      level,
      xp: saveData.xp || 0,
      questionsCorrect: saveData.learningStats?.totalCorrect || 0,
      currentStreak: saveData.dailyProgress?.currentStreak || 0,
      speedBonuses: saveData.achievementStats?.speedBonuses || 0,
      perfectQuests: saveData.achievementStats?.perfectQuests || 0,
      worldsUnlocked: saveData.unlockedWorldIds?.length || 1,
      skillMastery,
      tutorialCompleted: saveData.tutorialCompleted || false,
    };
  }, [saveData, level]);

  /**
   * Check for new achievements and unlock them
   */
  const checkAndUnlockAchievements = useCallback(() => {
    const stats = buildStats();
    const unlockedIds = saveData.unlockedAchievementIds || [];
    const newlyUnlocked = checkAchievements(stats, unlockedIds);

    if (newlyUnlocked.length > 0) {
      // Add newly unlocked achievements
      const newIds = newlyUnlocked.map((a) => a.id);
      const totalXp = newlyUnlocked.reduce((sum, a) => sum + a.xpReward, 0);
      const totalCoins = newlyUnlocked.reduce((sum, a) => sum + (a.coinReward || 0), 0);
      const cosmetics = newlyUnlocked
        .filter((a) => a.cosmeticReward)
        .map((a) => a.cosmeticReward!);

      // Update save data
      updateSaveData({
        unlockedAchievementIds: [...unlockedIds, ...newIds],
        coins: (saveData.coins || 0) + totalCoins,
        unlockedCosmetics: [...(saveData.unlockedCosmetics || []), ...cosmetics],
      });

      // Add XP separately for level up checks
      if (totalXp > 0) {
        addXp(totalXp);
      }

      // Queue achievements for display
      setPendingAchievements((prev) => [...prev, ...newlyUnlocked]);
    }

    return newlyUnlocked;
  }, [buildStats, saveData, updateSaveData, addXp]);

  /**
   * Record a speed bonus (called from boss battle)
   */
  const recordSpeedBonus = useCallback(() => {
    const currentStats = saveData.achievementStats || { speedBonuses: 0, perfectQuests: 0 };
    updateSaveData({
      achievementStats: {
        ...currentStats,
        speedBonuses: currentStats.speedBonuses + 1,
      },
    });
  }, [saveData.achievementStats, updateSaveData]);

  /**
   * Record a perfect quest (called when quest completed with all correct)
   */
  const recordPerfectQuest = useCallback(() => {
    const currentStats = saveData.achievementStats || { speedBonuses: 0, perfectQuests: 0 };
    updateSaveData({
      achievementStats: {
        ...currentStats,
        perfectQuests: currentStats.perfectQuests + 1,
      },
    });
  }, [saveData.achievementStats, updateSaveData]);

  /**
   * Clear pending achievements (after showing popups)
   */
  const clearPendingAchievements = useCallback(() => {
    setPendingAchievements([]);
  }, []);

  /**
   * Get all achievements with unlock status
   */
  const getAllAchievements = useCallback(() => {
    const unlockedIds = saveData.unlockedAchievementIds || [];
    const stats = buildStats();

    return ACHIEVEMENTS.map((achievement) => ({
      ...achievement,
      unlocked: unlockedIds.includes(achievement.id),
      progress: getAchievementProgress(achievement, stats),
    }));
  }, [saveData.unlockedAchievementIds, buildStats]);

  /**
   * Get unlocked count
   */
  const getUnlockedCount = useCallback(() => {
    return (saveData.unlockedAchievementIds || []).length;
  }, [saveData.unlockedAchievementIds]);

  return {
    pendingAchievements,
    checkAndUnlockAchievements,
    recordSpeedBonus,
    recordPerfectQuest,
    clearPendingAchievements,
    getAllAchievements,
    getUnlockedCount,
  };
}

/**
 * Helper to get progress (imported from achievements but needs stats)
 */
function getAchievementProgress(
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
    default:
      return 0;
  }
}
