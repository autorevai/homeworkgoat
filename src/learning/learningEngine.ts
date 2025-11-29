/**
 * Learning Engine
 * Handles question selection, performance tracking, and learning progression.
 */

import type { Question, Quest, LearningStats, QuestionSkill } from './types';
import { getQuestionsByIds } from './questions';

/**
 * Get questions for a specific quest
 */
export function getQuestQuestions(quest: Quest): Question[] {
  return getQuestionsByIds(quest.questionIds);
}

/**
 * Calculate XP needed for next level
 * Uses a simple formula: level * 100
 */
export function xpForLevel(level: number): number {
  return level * 100;
}

/**
 * Calculate total XP needed to reach a level from level 1
 */
export function totalXpForLevel(level: number): number {
  // Sum of 100 + 200 + 300 + ... + (level-1)*100
  // = 100 * (1 + 2 + ... + (level-1))
  // = 100 * (level-1) * level / 2
  return 100 * (level - 1) * level / 2;
}

/**
 * Calculate level from total XP
 */
export function levelFromXp(totalXp: number): number {
  // Solve: 100 * (level-1) * level / 2 <= totalXp
  // 50 * level^2 - 50 * level <= totalXp
  // Using quadratic formula: level = (50 + sqrt(2500 + 200*totalXp)) / 100
  const level = Math.floor((50 + Math.sqrt(2500 + 200 * totalXp)) / 100);
  return Math.max(1, level);
}

/**
 * Calculate XP progress within current level
 */
export function xpProgressInLevel(totalXp: number): { current: number; needed: number } {
  const level = levelFromXp(totalXp);
  const xpAtLevelStart = totalXpForLevel(level);
  const xpNeededForNext = xpForLevel(level);
  
  return {
    current: totalXp - xpAtLevelStart,
    needed: xpNeededForNext,
  };
}

/**
 * Create initial learning stats
 */
export function createInitialStats(): LearningStats {
  return {
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    totalIncorrect: 0,
    skillProgress: {
      addition: { correct: 0, total: 0 },
      subtraction: { correct: 0, total: 0 },
      multiplication: { correct: 0, total: 0 },
      division: { correct: 0, total: 0 },
      wordProblem: { correct: 0, total: 0 },
    },
  };
}

/**
 * Update stats after answering a question
 */
export function updateStatsAfterAnswer(
  stats: LearningStats,
  skill: QuestionSkill,
  correct: boolean
): LearningStats {
  return {
    totalQuestionsAnswered: stats.totalQuestionsAnswered + 1,
    totalCorrect: stats.totalCorrect + (correct ? 1 : 0),
    totalIncorrect: stats.totalIncorrect + (correct ? 0 : 1),
    skillProgress: {
      ...stats.skillProgress,
      [skill]: {
        correct: stats.skillProgress[skill].correct + (correct ? 1 : 0),
        total: stats.skillProgress[skill].total + 1,
      },
    },
  };
}

/**
 * Calculate accuracy percentage
 */
export function calculateAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

/**
 * Get a summary of skill performance
 */
export function getSkillSummary(stats: LearningStats): Array<{
  skill: QuestionSkill;
  label: string;
  accuracy: number;
  total: number;
}> {
  const skillLabels: Record<QuestionSkill, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    wordProblem: 'Word Problems',
  };

  return Object.entries(stats.skillProgress).map(([skill, progress]) => ({
    skill: skill as QuestionSkill,
    label: skillLabels[skill as QuestionSkill],
    accuracy: calculateAccuracy(progress.correct, progress.total),
    total: progress.total,
  }));
}
