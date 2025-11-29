/**
 * Adaptive Learning Engine
 * 
 * This makes the game ACTUALLY educational by:
 * 1. Tracking what the student struggles with
 * 2. Selecting questions based on their weak areas
 * 3. Using spaced repetition to reinforce learning
 * 4. Adjusting difficulty dynamically
 * 
 * PHILOSOPHY:
 * - Stay in the "Zone of Proximal Development" (not too easy, not too hard)
 * - ~70-80% success rate is optimal for learning
 * - Recent mistakes matter more than old ones
 * - Celebrate progress, not just correct answers
 */

import type { Question, QuestionSkill } from './types';
import { questionBank } from './questions';

// Track individual question performance
export interface QuestionHistory {
  questionId: string;
  attempts: number;
  correct: number;
  lastAttempted: number;
  lastCorrect: boolean;
  averageTimeMs: number;
}

// Track skill-level performance with recency weighting
export interface SkillMastery {
  skill: QuestionSkill;
  totalAttempts: number;
  totalCorrect: number;
  recentAttempts: number[]; // Last 10 attempts (1 = correct, 0 = wrong)
  currentMastery: number; // 0-100 weighted score
  trend: 'improving' | 'stable' | 'struggling';
}

// Adaptive state stored per player
export interface AdaptiveLearningState {
  questionHistory: Record<string, QuestionHistory>;
  skillMastery: Record<QuestionSkill, SkillMastery>;
  currentDifficultyLevel: 'easy' | 'medium' | 'adaptive';
  consecutiveCorrect: number;
  consecutiveWrong: number;
  lastSessionDate: string;
  totalPlayTime: number;
}

/**
 * Calculate weighted mastery score
 * Recent performance counts more than old performance
 */
function calculateWeightedMastery(recentAttempts: number[]): number {
  if (recentAttempts.length === 0) return 50; // No data = assume middle
  
  // Weight recent attempts more heavily
  // Most recent = weight 10, oldest = weight 1
  let weightedSum = 0;
  let totalWeight = 0;
  
  for (let i = 0; i < recentAttempts.length; i++) {
    const weight = i + 1; // Older attempts get lower weight
    weightedSum += recentAttempts[i] * weight;
    totalWeight += weight;
  }
  
  return Math.round((weightedSum / totalWeight) * 100);
}

/**
 * Determine if a skill's trend is improving, stable, or struggling
 */
function calculateTrend(recentAttempts: number[]): 'improving' | 'stable' | 'struggling' {
  if (recentAttempts.length < 4) return 'stable';
  
  const firstHalf = recentAttempts.slice(0, Math.floor(recentAttempts.length / 2));
  const secondHalf = recentAttempts.slice(Math.floor(recentAttempts.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const diff = secondAvg - firstAvg;
  
  if (diff > 0.15) return 'improving';
  if (diff < -0.15) return 'struggling';
  return 'stable';
}

/**
 * Create initial adaptive learning state
 */
export function createInitialAdaptiveState(): AdaptiveLearningState {
  const skills: QuestionSkill[] = ['addition', 'subtraction', 'multiplication', 'division', 'wordProblem'];
  
  const skillMastery: Record<QuestionSkill, SkillMastery> = {} as any;
  for (const skill of skills) {
    skillMastery[skill] = {
      skill,
      totalAttempts: 0,
      totalCorrect: 0,
      recentAttempts: [],
      currentMastery: 50, // Start at middle
      trend: 'stable',
    };
  }
  
  return {
    questionHistory: {},
    skillMastery,
    currentDifficultyLevel: 'easy', // Start easy for new players
    consecutiveCorrect: 0,
    consecutiveWrong: 0,
    lastSessionDate: new Date().toISOString().split('T')[0],
    totalPlayTime: 0,
  };
}

/**
 * Update state after answering a question
 */
export function updateAdaptiveState(
  state: AdaptiveLearningState,
  question: Question,
  correct: boolean,
  timeMs: number
): AdaptiveLearningState {
  const newState = { ...state };
  
  // Update question history
  const history = newState.questionHistory[question.id] || {
    questionId: question.id,
    attempts: 0,
    correct: 0,
    lastAttempted: 0,
    lastCorrect: false,
    averageTimeMs: 0,
  };
  
  history.attempts += 1;
  history.correct += correct ? 1 : 0;
  history.lastAttempted = Date.now();
  history.lastCorrect = correct;
  history.averageTimeMs = (history.averageTimeMs * (history.attempts - 1) + timeMs) / history.attempts;
  newState.questionHistory[question.id] = history;
  
  // Update skill mastery
  const skillMastery = { ...newState.skillMastery[question.skill] };
  skillMastery.totalAttempts += 1;
  skillMastery.totalCorrect += correct ? 1 : 0;
  skillMastery.recentAttempts = [...skillMastery.recentAttempts, correct ? 1 : 0].slice(-10);
  skillMastery.currentMastery = calculateWeightedMastery(skillMastery.recentAttempts);
  skillMastery.trend = calculateTrend(skillMastery.recentAttempts);
  newState.skillMastery[question.skill] = skillMastery;
  
  // Update streaks
  if (correct) {
    newState.consecutiveCorrect += 1;
    newState.consecutiveWrong = 0;
  } else {
    newState.consecutiveWrong += 1;
    newState.consecutiveCorrect = 0;
  }
  
  // Adjust difficulty based on performance
  if (newState.consecutiveCorrect >= 5 && newState.currentDifficultyLevel === 'easy') {
    newState.currentDifficultyLevel = 'adaptive';
  } else if (newState.consecutiveWrong >= 3 && newState.currentDifficultyLevel !== 'easy') {
    newState.currentDifficultyLevel = 'easy';
  }
  
  return newState;
}

/**
 * THE MAIN ADAPTIVE ALGORITHM
 * 
 * Selects the best question for the student right now.
 * 
 * Strategy:
 * 1. Find weakest skill (lowest mastery)
 * 2. If struggling, pick easier questions in that skill
 * 3. If improving, challenge with harder questions
 * 4. Use spaced repetition for previously missed questions
 * 5. Avoid recently asked questions
 */
export function selectAdaptiveQuestion(
  state: AdaptiveLearningState,
  excludeIds: string[] = [],
  forcedSkill?: QuestionSkill
): Question {
  const now = Date.now();
  
  // Step 1: Find the skill to focus on
  let targetSkill: QuestionSkill;
  
  if (forcedSkill) {
    targetSkill = forcedSkill;
  } else {
    // Find weakest skill (lowest mastery that has been attempted)
    const skills = Object.values(state.skillMastery);
    const attemptedSkills = skills.filter(s => s.totalAttempts > 0);
    
    if (attemptedSkills.length === 0) {
      // New player - start with addition (easiest)
      targetSkill = 'addition';
    } else {
      // 70% chance to work on weakest skill, 30% chance random (variety)
      if (Math.random() < 0.7) {
        targetSkill = attemptedSkills.reduce((min, curr) => 
          curr.currentMastery < min.currentMastery ? curr : min
        ).skill;
      } else {
        targetSkill = attemptedSkills[Math.floor(Math.random() * attemptedSkills.length)].skill;
      }
    }
  }
  
  // Step 2: Get candidate questions for this skill
  const candidates = questionBank.filter(q => 
    q.skill === targetSkill && 
    !excludeIds.includes(q.id)
  );
  
  if (candidates.length === 0) {
    // Fallback to any question
    const fallback = questionBank.filter(q => !excludeIds.includes(q.id));
    return fallback[Math.floor(Math.random() * fallback.length)] || questionBank[0];
  }
  
  // Step 3: Score each candidate
  const scoredCandidates = candidates.map(question => {
    let score = 100; // Base score
    const history = state.questionHistory[question.id];
    const skillMastery = state.skillMastery[targetSkill];
    
    // Spaced repetition: Prioritize questions they got wrong before
    if (history) {
      if (!history.lastCorrect) {
        // They got this wrong - should try again
        const timeSinceLast = now - history.lastAttempted;
        const hoursSince = timeSinceLast / (1000 * 60 * 60);
        
        // Optimal spacing: 1 hour, 1 day, 3 days, 1 week
        if (hoursSince >= 1 && hoursSince < 24) {
          score += 50; // Good time to retry
        } else if (hoursSince >= 24) {
          score += 30; // Also good
        }
      } else {
        // They got it right before - lower priority unless it's been a while
        const daysSince = (now - history.lastAttempted) / (1000 * 60 * 60 * 24);
        if (daysSince < 1) {
          score -= 40; // Too recent
        } else if (daysSince >= 3) {
          score += 10; // Time for a refresher
        }
      }
      
      // Accuracy on this specific question
      const accuracy = history.correct / history.attempts;
      if (accuracy < 0.5) {
        score += 30; // They struggle with this one
      }
    } else {
      // Never attempted - give bonus for novelty
      score += 20;
    }
    
    // Match difficulty to current mastery
    const masteryLevel = skillMastery.currentMastery;
    
    if (masteryLevel < 50) {
      // Struggling - prefer easy questions
      if (question.difficulty === 'easy') score += 40;
      if (question.difficulty === 'medium') score -= 20;
    } else if (masteryLevel < 75) {
      // Getting there - mix of difficulties
      if (question.difficulty === 'easy') score += 10;
      if (question.difficulty === 'medium') score += 20;
    } else {
      // Strong - prefer medium/harder questions
      if (question.difficulty === 'easy') score -= 10;
      if (question.difficulty === 'medium') score += 30;
    }
    
    // Trend adjustments
    if (skillMastery.trend === 'struggling') {
      if (question.difficulty === 'easy') score += 20;
    } else if (skillMastery.trend === 'improving') {
      if (question.difficulty === 'medium') score += 15;
    }
    
    // Add small random factor to prevent predictability
    score += Math.random() * 20;
    
    return { question, score };
  });
  
  // Step 4: Pick the highest scored question
  scoredCandidates.sort((a, b) => b.score - a.score);
  return scoredCandidates[0].question;
}

/**
 * Get a summary of what the student should work on
 */
export function getLearningRecommendations(state: AdaptiveLearningState): {
  weakestSkill: QuestionSkill;
  strongestSkill: QuestionSkill;
  recommendation: string;
  encouragement: string;
} {
  const skills = Object.values(state.skillMastery).filter(s => s.totalAttempts > 0);
  
  if (skills.length === 0) {
    return {
      weakestSkill: 'addition',
      strongestSkill: 'addition',
      recommendation: 'Let\'s start with some addition problems!',
      encouragement: 'Welcome to your math adventure! 🌟',
    };
  }
  
  const sorted = [...skills].sort((a, b) => a.currentMastery - b.currentMastery);
  const weakest = sorted[0];
  const strongest = sorted[sorted.length - 1];
  
  const skillNames: Record<QuestionSkill, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    wordProblem: 'Word Problems',
  };
  
  let recommendation = '';
  let encouragement = '';
  
  if (weakest.currentMastery < 50) {
    recommendation = `Let's practice ${skillNames[weakest.skill]} - you've got this!`;
    encouragement = weakest.trend === 'improving' 
      ? `You're getting better at ${skillNames[weakest.skill]}! Keep it up! 📈`
      : `${skillNames[weakest.skill]} is tricky, but practice makes perfect! 💪`;
  } else if (weakest.currentMastery < 75) {
    recommendation = `${skillNames[weakest.skill]} is almost mastered - a few more practice rounds!`;
    encouragement = `You're doing great! ${skillNames[strongest.skill]} is your superpower! ⭐`;
  } else {
    recommendation = `Amazing! Try some harder problems to challenge yourself!`;
    encouragement = `Math Champion in the making! All skills above 75%! 🏆`;
  }
  
  return {
    weakestSkill: weakest.skill,
    strongestSkill: strongest.skill,
    recommendation,
    encouragement,
  };
}

/**
 * Generate a personalized quest based on what the student needs
 */
export function generateAdaptiveQuest(
  state: AdaptiveLearningState,
  questionCount: number = 5
): string[] {
  const questionIds: string[] = [];
  
  for (let i = 0; i < questionCount; i++) {
    const question = selectAdaptiveQuestion(state, questionIds);
    questionIds.push(question.id);
  }
  
  return questionIds;
}

/**
 * Should we show an encouraging message?
 */
export function shouldShowEncouragement(state: AdaptiveLearningState): {
  show: boolean;
  message: string;
  type: 'milestone' | 'streak' | 'improvement' | 'persistence';
} | null {
  // Milestone: Hit a new mastery threshold
  const skills = Object.values(state.skillMastery);
  const highMastery = skills.find(s => 
    s.currentMastery >= 80 && 
    s.totalAttempts >= 10 &&
    s.recentAttempts.slice(-3).every(a => a === 1)
  );
  
  if (highMastery) {
    return {
      show: true,
      message: `🌟 You've mastered ${highMastery.skill}! Amazing work!`,
      type: 'milestone',
    };
  }
  
  // Streak: 5+ correct in a row
  if (state.consecutiveCorrect === 5) {
    return {
      show: true,
      message: '🔥 5 in a row! You\'re on fire!',
      type: 'streak',
    };
  }
  
  if (state.consecutiveCorrect === 10) {
    return {
      show: true,
      message: '🚀 10 in a row! UNSTOPPABLE!',
      type: 'streak',
    };
  }
  
  // Improvement: Was struggling, now improving
  const improvingSkill = skills.find(s => 
    s.trend === 'improving' && 
    s.totalAttempts >= 10 &&
    s.currentMastery > 60
  );
  
  if (improvingSkill && Math.random() < 0.3) { // Don't spam
    return {
      show: true,
      message: `📈 Your ${improvingSkill.skill} is really improving! Great effort!`,
      type: 'improvement',
    };
  }
  
  // Persistence: Keep trying after wrong answers
  if (state.consecutiveWrong === 3) {
    return {
      show: true,
      message: '💪 Tough problems! But you\'re learning with each try!',
      type: 'persistence',
    };
  }
  
  return null;
}
