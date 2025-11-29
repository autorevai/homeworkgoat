/**
 * AI Analytics Service
 *
 * Tracks AI-generated content performance for continuous improvement.
 * This data helps us:
 * 1. Identify questions that are too hard/easy
 * 2. Find patterns in what content works best
 * 3. Improve AI prompts over time
 * 4. Validate difficulty scaling
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  writeBatch,
  doc,
} from 'firebase/firestore';
import { db } from './config';
import type { AIQuestionAnalytics, AIWorldCompletion, GeneratedWorldData } from '../persistence/types';
import type { QuestionSkill } from '../learning/types';

// Firestore collection names
const COLLECTIONS = {
  AI_WORLDS: 'aiGeneratedWorlds',
  AI_QUESTION_ANALYTICS: 'aiQuestionAnalytics',
  AI_WORLD_COMPLETIONS: 'aiWorldCompletions',
} as const;

/**
 * Save a generated world to Firestore for analytics
 * This creates a permanent record of what was generated
 */
export async function saveGeneratedWorldToFirestore(
  userId: string,
  worldData: GeneratedWorldData
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.AI_WORLDS), {
      userId,
      worldId: worldData.world.id,
      worldName: worldData.world.name,
      worldTheme: worldData.world.theme,
      questCount: worldData.quests.length,
      questionCount: worldData.questions.length,

      // Player profile at generation time
      playerLevel: worldData.playerProfileUsed.level,
      weakSkills: worldData.playerProfileUsed.weakSkills,
      strongSkills: worldData.playerProfileUsed.strongSkills,
      averageMastery: worldData.playerProfileUsed.averageMastery,

      // Question breakdown
      questionsBySkill: getQuestionBreakdown(worldData),

      // Timestamps
      generatedAt: Timestamp.fromMillis(worldData.generatedAt),
      createdAt: Timestamp.now(),
    });

    console.log('Saved AI world to Firestore:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Failed to save AI world to Firestore:', error);
    throw error;
  }
}

/**
 * Record analytics for a single question answer
 */
export async function recordQuestionAnalytics(
  userId: string,
  analytics: AIQuestionAnalytics
): Promise<void> {
  try {
    await addDoc(collection(db, COLLECTIONS.AI_QUESTION_ANALYTICS), {
      userId,
      ...analytics,
      timestamp: Timestamp.fromMillis(analytics.timestamp),
      createdAt: Timestamp.now(),
    });
  } catch (error) {
    console.error('Failed to record question analytics:', error);
    // Don't throw - analytics failures shouldn't break gameplay
  }
}

/**
 * Record multiple question analytics in a batch (more efficient)
 */
export async function recordQuestionAnalyticsBatch(
  userId: string,
  analyticsArray: AIQuestionAnalytics[]
): Promise<void> {
  if (analyticsArray.length === 0) return;

  try {
    const batch = writeBatch(db);

    analyticsArray.forEach((analytics) => {
      const docRef = doc(collection(db, COLLECTIONS.AI_QUESTION_ANALYTICS));
      batch.set(docRef, {
        userId,
        ...analytics,
        timestamp: Timestamp.fromMillis(analytics.timestamp),
        createdAt: Timestamp.now(),
      });
    });

    await batch.commit();
    console.log(`Recorded ${analyticsArray.length} question analytics`);
  } catch (error) {
    console.error('Failed to record question analytics batch:', error);
  }
}

/**
 * Record world completion summary
 */
export async function recordWorldCompletion(
  userId: string,
  completion: AIWorldCompletion
): Promise<void> {
  try {
    await addDoc(collection(db, COLLECTIONS.AI_WORLD_COMPLETIONS), {
      userId,
      ...completion,
      completedAt: Timestamp.fromMillis(completion.completedAt),
      createdAt: Timestamp.now(),
    });

    console.log('Recorded AI world completion:', completion.worldId);
  } catch (error) {
    console.error('Failed to record world completion:', error);
  }
}

/**
 * Get aggregated analytics for AI improvement insights
 * (This would be used by an admin dashboard or analytics job)
 */
export async function getQuestionPerformanceStats(
  skill?: QuestionSkill,
  limitCount: number = 100
): Promise<{
  totalQuestions: number;
  correctRate: number;
  avgTimeMs: number;
  hintUsageRate: number;
  byDifficulty: Record<string, { correct: number; total: number }>;
}> {
  try {
    let q = query(
      collection(db, COLLECTIONS.AI_QUESTION_ANALYTICS),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    if (skill) {
      q = query(
        collection(db, COLLECTIONS.AI_QUESTION_ANALYTICS),
        where('skill', '==', skill),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );
    }

    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map((d) => d.data() as AIQuestionAnalytics);

    if (docs.length === 0) {
      return {
        totalQuestions: 0,
        correctRate: 0,
        avgTimeMs: 0,
        hintUsageRate: 0,
        byDifficulty: {},
      };
    }

    const correct = docs.filter((d) => d.wasCorrect).length;
    const totalTime = docs.reduce((sum, d) => sum + d.timeToAnswerMs, 0);
    const hintsUsed = docs.filter((d) => d.hintUsed).length;

    const byDifficulty: Record<string, { correct: number; total: number }> = {};
    docs.forEach((d) => {
      if (!byDifficulty[d.difficulty]) {
        byDifficulty[d.difficulty] = { correct: 0, total: 0 };
      }
      byDifficulty[d.difficulty].total++;
      if (d.wasCorrect) byDifficulty[d.difficulty].correct++;
    });

    return {
      totalQuestions: docs.length,
      correctRate: correct / docs.length,
      avgTimeMs: totalTime / docs.length,
      hintUsageRate: hintsUsed / docs.length,
      byDifficulty,
    };
  } catch (error) {
    console.error('Failed to get question performance stats:', error);
    return {
      totalQuestions: 0,
      correctRate: 0,
      avgTimeMs: 0,
      hintUsageRate: 0,
      byDifficulty: {},
    };
  }
}

/**
 * Get worlds that performed well (high completion rate, good accuracy)
 * These could be reused or used as templates
 */
export async function getHighPerformingWorlds(
  limitCount: number = 10
): Promise<AIWorldCompletion[]> {
  try {
    // Get completions with high accuracy
    const q = query(
      collection(db, COLLECTIONS.AI_WORLD_COMPLETIONS),
      orderBy('questionsCorrect', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as AIWorldCompletion);
  } catch (error) {
    console.error('Failed to get high performing worlds:', error);
    return [];
  }
}

// Helper: Break down questions by skill
function getQuestionBreakdown(worldData: GeneratedWorldData): Record<QuestionSkill, number> {
  const breakdown: Record<QuestionSkill, number> = {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
    wordProblem: 0,
  };

  worldData.questions.forEach((q) => {
    breakdown[q.skill]++;
  });

  return breakdown;
}

/**
 * Check if analytics collection is accessible
 * (Useful for debugging Firestore permissions)
 */
export async function testAnalyticsConnection(): Promise<boolean> {
  try {
    const q = query(collection(db, COLLECTIONS.AI_WORLDS), limit(1));
    await getDocs(q);
    return true;
  } catch (error) {
    console.error('Analytics connection test failed:', error);
    return false;
  }
}
