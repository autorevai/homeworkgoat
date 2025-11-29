/**
 * AI World Cache Manager
 *
 * Manages the local cache of AI-generated worlds with:
 * - Max 5 worlds cached (prevents localStorage bloat)
 * - LRU eviction (least recently used gets removed)
 * - Analytics tracking on generation and completion
 * - Integration with Firestore for permanent storage
 */

import type { GeneratedWorldData, AIWorldCompletion, AIQuestionAnalytics } from '../persistence/types';
import type { Question, Quest } from '../learning/types';
import type { World } from '../worlds/types';
import { generateWorldForPlayer, createPlayerProfileFromGameState } from './worldGenerator';
import { saveGeneratedWorldToFirestore, recordWorldCompletion, recordQuestionAnalyticsBatch } from '../firebase/aiAnalyticsService';
import { getCurrentUser } from '../firebase/authService';
import type { SaveData } from '../persistence/types';
import type { AdaptiveLearningState } from '../learning/adaptiveLearning';

const MAX_CACHED_WORLDS = 5;

/**
 * Generate a new AI world and add it to the cache
 */
export async function generateAndCacheWorld(
  saveData: SaveData,
  adaptiveState?: AdaptiveLearningState
): Promise<GeneratedWorldData> {
  // Create player profile
  const profile = createPlayerProfileFromGameState(saveData, adaptiveState);

  // Generate the world
  const bundle = await generateWorldForPlayer(profile);

  // Create the cached world data
  const worldData: GeneratedWorldData = {
    world: bundle.world,
    quests: bundle.quests,
    questions: bundle.questions,
    generatedAt: Date.now(),
    playerProfileUsed: {
      level: profile.level,
      weakSkills: profile.weakSkills,
      strongSkills: profile.strongSkills,
      averageMastery: profile.averageMastery || 50,
    },
  };

  // Save to Firestore for analytics (async, don't wait)
  const user = getCurrentUser();
  if (user) {
    saveGeneratedWorldToFirestore(user.uid, worldData).catch((err) => {
      console.warn('Failed to save world to Firestore:', err);
    });
  }

  return worldData;
}

/**
 * Add a generated world to the cache, evicting old ones if needed
 */
export function addWorldToCache(
  currentWorlds: GeneratedWorldData[],
  newWorld: GeneratedWorldData
): GeneratedWorldData[] {
  // Check if world already exists (by ID)
  const existingIndex = currentWorlds.findIndex(
    (w) => w.world.id === newWorld.world.id
  );

  if (existingIndex !== -1) {
    // Update existing world (move to end = most recent)
    const updated = [...currentWorlds];
    updated.splice(existingIndex, 1);
    updated.push(newWorld);
    return updated;
  }

  // Add new world
  const updated = [...currentWorlds, newWorld];

  // Evict oldest if over limit (LRU - first in list is oldest)
  if (updated.length > MAX_CACHED_WORLDS) {
    console.log(`Cache full (${updated.length}/${MAX_CACHED_WORLDS}), evicting oldest world`);
    return updated.slice(-MAX_CACHED_WORLDS);
  }

  return updated;
}

/**
 * Remove a world from the cache
 */
export function removeWorldFromCache(
  currentWorlds: GeneratedWorldData[],
  worldId: string
): GeneratedWorldData[] {
  return currentWorlds.filter((w) => w.world.id !== worldId);
}

/**
 * Get a cached world by ID
 */
export function getCachedWorld(
  currentWorlds: GeneratedWorldData[],
  worldId: string
): GeneratedWorldData | undefined {
  return currentWorlds.find((w) => w.world.id === worldId);
}

/**
 * Get all quests for a cached world
 */
export function getQuestsForWorld(
  currentWorlds: GeneratedWorldData[],
  worldId: string
): Quest[] {
  const world = getCachedWorld(currentWorlds, worldId);
  return world?.quests || [];
}

/**
 * Get all questions for a cached world
 */
export function getQuestionsForWorld(
  currentWorlds: GeneratedWorldData[],
  worldId: string
): Question[] {
  const world = getCachedWorld(currentWorlds, worldId);
  return world?.questions || [];
}

/**
 * Get a specific question from a cached world
 */
export function getQuestionFromCache(
  currentWorlds: GeneratedWorldData[],
  questionId: string
): Question | undefined {
  for (const worldData of currentWorlds) {
    const question = worldData.questions.find((q) => q.id === questionId);
    if (question) return question;
  }
  return undefined;
}

/**
 * Get a specific quest from a cached world
 */
export function getQuestFromCache(
  currentWorlds: GeneratedWorldData[],
  questId: string
): Quest | undefined {
  for (const worldData of currentWorlds) {
    const quest = worldData.quests.find((q) => q.id === questId);
    if (quest) return quest;
  }
  return undefined;
}

/**
 * Check if a world ID is from an AI-generated world
 */
export function isAIGeneratedWorld(worldId: string): boolean {
  return worldId.startsWith('ai-') || worldId.includes('-ai-');
}

/**
 * Record completion of an AI world with analytics
 */
export async function recordAIWorldCompletion(
  worldData: GeneratedWorldData,
  questsCompleted: number,
  questionResults: { questionId: string; correct: boolean; timeMs: number; hintUsed: boolean }[],
  playerLevel: number,
  playerMastery: number
): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;

  // Calculate summary stats
  const correctCount = questionResults.filter((r) => r.correct).length;
  const totalTime = questionResults.reduce((sum, r) => sum + r.timeMs, 0);
  const hintsUsed = questionResults.filter((r) => r.hintUsed).length;

  // Create completion record
  const completion: AIWorldCompletion = {
    worldId: worldData.world.id,
    worldName: worldData.world.name,
    completedAt: Date.now(),
    questsCompleted,
    totalQuests: worldData.quests.length,
    questionsCorrect: correctCount,
    totalQuestions: questionResults.length,
    averageTimePerQuestion: questionResults.length > 0 ? totalTime / questionResults.length : 0,
    hintsUsed,
  };

  // Create detailed question analytics
  const questionAnalytics: AIQuestionAnalytics[] = questionResults.map((result, index) => {
    const question = worldData.questions.find((q) => q.id === result.questionId);
    return {
      questionId: result.questionId,
      worldId: worldData.world.id,
      skill: question?.skill || 'addition',
      difficulty: question?.difficulty || 'easy',
      commonCoreStandard: question?.commonCoreStandard,
      wasCorrect: result.correct,
      timeToAnswerMs: result.timeMs,
      hintUsed: result.hintUsed,
      attemptNumber: index + 1,
      playerLevel,
      playerMasteryAtTime: playerMastery,
      timestamp: Date.now(),
    };
  });

  // Save to Firestore (async)
  try {
    await Promise.all([
      recordWorldCompletion(user.uid, completion),
      recordQuestionAnalyticsBatch(user.uid, questionAnalytics),
    ]);
    console.log('Recorded AI world completion analytics');
  } catch (error) {
    console.error('Failed to record AI world analytics:', error);
  }
}

/**
 * Get combined list of all worlds (hardcoded + AI-generated)
 */
export function getAllAvailableWorlds(
  hardcodedWorlds: World[],
  cachedWorlds: GeneratedWorldData[]
): World[] {
  const aiWorlds = cachedWorlds.map((cw) => cw.world);
  return [...hardcodedWorlds, ...aiWorlds];
}

/**
 * Calculate cache size in bytes (approximate)
 */
export function getCacheSizeBytes(worlds: GeneratedWorldData[]): number {
  return JSON.stringify(worlds).length;
}

/**
 * Get cache stats for debugging/monitoring
 */
export function getCacheStats(worlds: GeneratedWorldData[]): {
  worldCount: number;
  totalQuestions: number;
  totalQuests: number;
  oldestWorld: Date | null;
  newestWorld: Date | null;
  sizeBytes: number;
} {
  if (worlds.length === 0) {
    return {
      worldCount: 0,
      totalQuestions: 0,
      totalQuests: 0,
      oldestWorld: null,
      newestWorld: null,
      sizeBytes: 0,
    };
  }

  const totalQuestions = worlds.reduce((sum, w) => sum + w.questions.length, 0);
  const totalQuests = worlds.reduce((sum, w) => sum + w.quests.length, 0);
  const timestamps = worlds.map((w) => w.generatedAt).sort((a, b) => a - b);

  return {
    worldCount: worlds.length,
    totalQuestions,
    totalQuests,
    oldestWorld: new Date(timestamps[0]),
    newestWorld: new Date(timestamps[timestamps.length - 1]),
    sizeBytes: getCacheSizeBytes(worlds),
  };
}
