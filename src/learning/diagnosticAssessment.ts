/**
 * Diagnostic Assessment System
 * 
 * This runs when a new player starts to figure out their current level.
 * Instead of assuming everyone starts at the same place, we quickly
 * assess their skills and place them appropriately.
 * 
 * DESIGN PHILOSOPHY:
 * - Quick (5-10 minutes max) - kids lose patience
 * - Adaptive - stops early if clearly easy or clearly hard
 * - Encouraging - feels like a game, not a test
 * - Actionable - produces a clear learning plan
 */

import type { Question, QuestionSkill, Difficulty } from './types';
import { generateQuestion } from './questionGenerator';
import type { AdaptiveLearningState } from './adaptiveLearning';
import { createInitialAdaptiveState } from './adaptiveLearning';

// Assessment question with metadata
export interface AssessmentQuestion extends Question {
  gradeLevel: number; // 1, 2, 3, 4 (approximate grade level)
  skillWeight: number; // How much this tells us about their skill
}

// Result of a single skill assessment
export interface SkillAssessmentResult {
  skill: QuestionSkill;
  questionsAsked: number;
  correct: number;
  estimatedLevel: 'below' | 'on' | 'above'; // Below grade, on grade, above grade
  confidence: number; // 0-100 how confident we are
  startingDifficulty: Difficulty;
  specificWeaknesses: string[]; // e.g., "7×8", "borrowing in subtraction"
}

// Full diagnostic result
export interface DiagnosticResult {
  overallLevel: 'below' | 'on' | 'above';
  overallConfidence: number;
  skillResults: Record<QuestionSkill, SkillAssessmentResult>;
  recommendedStartingWorld: string;
  recommendedPath: QuestionSkill; // Which skill to focus on first
  personalizedMessage: string;
  estimatedGradeLevel: number; // 2.5, 3.0, 3.5, etc.
  adaptiveState: AdaptiveLearningState; // Pre-populated based on assessment
}

// Assessment state during the test
export interface AssessmentState {
  currentSkill: QuestionSkill;
  currentSkillIndex: number;
  questionsInCurrentSkill: number;
  correctInCurrentSkill: number;
  currentDifficulty: 'easy' | 'medium' | 'hard';
  allResponses: Array<{
    skill: QuestionSkill;
    question: AssessmentQuestion;
    correct: boolean;
    timeMs: number;
  }>;
  skillResults: Partial<Record<QuestionSkill, SkillAssessmentResult>>;
  isComplete: boolean;
  currentQuestion: AssessmentQuestion | null;
}

// Skills to assess in order (easier to harder conceptually for 3rd graders)
const ASSESSMENT_ORDER: QuestionSkill[] = [
  'addition',
  'subtraction', 
  'multiplication',
  'division',
  'wordProblem',
];

// Questions per skill in assessment (adaptive - may stop early)
const BASE_QUESTIONS_PER_SKILL = 4;
const MAX_QUESTIONS_PER_SKILL = 6;
const MIN_QUESTIONS_PER_SKILL = 3;

/**
 * Generate an assessment question at a specific difficulty
 */
function generateAssessmentQuestion(
  skill: QuestionSkill,
  difficulty: 'easy' | 'medium' | 'hard'
): AssessmentQuestion {
  // Map hard to medium for our generator (we don't have hard questions)
  const genDifficulty: Difficulty = difficulty === 'hard' ? 'medium' : difficulty;
  const baseQuestion = generateQuestion(skill, genDifficulty);
  
  // Assign grade level based on difficulty and skill
  let gradeLevel = 3;
  if (difficulty === 'easy') gradeLevel = 2;
  if (difficulty === 'hard') gradeLevel = 4;
  if (skill === 'wordProblem') gradeLevel += 0.5;
  
  return {
    ...baseQuestion,
    id: `assess-${baseQuestion.id}`,
    gradeLevel,
    skillWeight: difficulty === 'medium' ? 1.5 : 1,
  };
}

/**
 * Create initial assessment state
 */
export function createAssessmentState(): AssessmentState {
  const firstSkill = ASSESSMENT_ORDER[0];
  return {
    currentSkill: firstSkill,
    currentSkillIndex: 0,
    questionsInCurrentSkill: 0,
    correctInCurrentSkill: 0,
    currentDifficulty: 'easy', // Always start easy
    allResponses: [],
    skillResults: {},
    isComplete: false,
    currentQuestion: generateAssessmentQuestion(firstSkill, 'easy'),
  };
}

/**
 * Determine next difficulty based on performance
 */
function getNextDifficulty(
  correct: number,
  total: number,
  currentDifficulty: 'easy' | 'medium' | 'hard'
): 'easy' | 'medium' | 'hard' {
  const accuracy = total > 0 ? correct / total : 0;
  
  if (accuracy >= 0.8 && currentDifficulty !== 'hard') {
    // Doing great, increase difficulty
    return currentDifficulty === 'easy' ? 'medium' : 'hard';
  } else if (accuracy < 0.4 && currentDifficulty !== 'easy') {
    // Struggling, decrease difficulty
    return currentDifficulty === 'hard' ? 'medium' : 'easy';
  }
  
  return currentDifficulty;
}

/**
 * Check if we have enough data for this skill
 */
function shouldMoveToNextSkill(state: AssessmentState): boolean {
  const { questionsInCurrentSkill, correctInCurrentSkill } = state;
  
  // Always do minimum questions
  if (questionsInCurrentSkill < MIN_QUESTIONS_PER_SKILL) {
    return false;
  }
  
  // If we hit max, move on
  if (questionsInCurrentSkill >= MAX_QUESTIONS_PER_SKILL) {
    return true;
  }
  
  // Early exit conditions
  const accuracy = correctInCurrentSkill / questionsInCurrentSkill;
  
  // If clearly mastered (100% on 3+), move on
  if (accuracy === 1 && questionsInCurrentSkill >= 3) {
    return true;
  }
  
  // If clearly struggling (0% on 3+), move on
  if (accuracy === 0 && questionsInCurrentSkill >= 3) {
    return true;
  }
  
  // Otherwise, continue until base questions
  return questionsInCurrentSkill >= BASE_QUESTIONS_PER_SKILL;
}

/**
 * Calculate skill result from responses
 */
function calculateSkillResult(
  skill: QuestionSkill,
  responses: AssessmentState['allResponses']
): SkillAssessmentResult {
  const skillResponses = responses.filter(r => r.skill === skill);
  const correct = skillResponses.filter(r => r.correct).length;
  const total = skillResponses.length;
  const accuracy = total > 0 ? correct / total : 0;
  
  // Determine level
  let estimatedLevel: 'below' | 'on' | 'above';
  if (accuracy >= 0.8) {
    estimatedLevel = 'above';
  } else if (accuracy >= 0.5) {
    estimatedLevel = 'on';
  } else {
    estimatedLevel = 'below';
  }
  
  // Determine confidence based on sample size
  let confidence = Math.min(100, total * 20);
  if (accuracy === 1 || accuracy === 0) {
    confidence = Math.min(confidence, 70); // Perfect scores are suspicious
  }
  
  // Determine starting difficulty
  let startingDifficulty: Difficulty;
  if (accuracy >= 0.7) {
    startingDifficulty = 'medium';
  } else {
    startingDifficulty = 'easy';
  }
  
  // Find specific weaknesses (questions they got wrong)
  const specificWeaknesses = skillResponses
    .filter(r => !r.correct)
    .map(r => r.question.prompt.replace('What is ', '').replace('?', ''))
    .slice(0, 3);
  
  return {
    skill,
    questionsAsked: total,
    correct,
    estimatedLevel,
    confidence,
    startingDifficulty,
    specificWeaknesses,
  };
}

/**
 * Process an answer and return updated state
 */
export function processAssessmentAnswer(
  state: AssessmentState,
  answerIndex: number,
  timeMs: number
): AssessmentState {
  if (state.isComplete || !state.currentQuestion) {
    return state;
  }
  
  const correct = answerIndex === state.currentQuestion.correctIndex;
  
  // Record response
  const newResponses = [
    ...state.allResponses,
    {
      skill: state.currentSkill,
      question: state.currentQuestion,
      correct,
      timeMs,
    },
  ];
  
  const newCorrectInSkill = state.correctInCurrentSkill + (correct ? 1 : 0);
  const newQuestionsInSkill = state.questionsInCurrentSkill + 1;
  
  // Check if we should move to next skill
  const tempState = {
    ...state,
    questionsInCurrentSkill: newQuestionsInSkill,
    correctInCurrentSkill: newCorrectInSkill,
  };
  
  if (shouldMoveToNextSkill(tempState)) {
    // Calculate result for current skill
    const skillResult = calculateSkillResult(state.currentSkill, newResponses);
    const newSkillResults = {
      ...state.skillResults,
      [state.currentSkill]: skillResult,
    };
    
    // Move to next skill or finish
    const nextSkillIndex = state.currentSkillIndex + 1;
    
    if (nextSkillIndex >= ASSESSMENT_ORDER.length) {
      // Assessment complete!
      return {
        ...state,
        allResponses: newResponses,
        skillResults: newSkillResults,
        isComplete: true,
        currentQuestion: null,
      };
    }
    
    // Start next skill
    const nextSkill = ASSESSMENT_ORDER[nextSkillIndex];
    return {
      ...state,
      currentSkill: nextSkill,
      currentSkillIndex: nextSkillIndex,
      questionsInCurrentSkill: 0,
      correctInCurrentSkill: 0,
      currentDifficulty: 'easy', // Always start skill at easy
      allResponses: newResponses,
      skillResults: newSkillResults,
      isComplete: false,
      currentQuestion: generateAssessmentQuestion(nextSkill, 'easy'),
    };
  }
  
  // Continue with current skill
  const nextDifficulty = getNextDifficulty(
    newCorrectInSkill,
    newQuestionsInSkill,
    state.currentDifficulty
  );
  
  return {
    ...state,
    questionsInCurrentSkill: newQuestionsInSkill,
    correctInCurrentSkill: newCorrectInSkill,
    currentDifficulty: nextDifficulty,
    allResponses: newResponses,
    currentQuestion: generateAssessmentQuestion(state.currentSkill, nextDifficulty),
  };
}

/**
 * Generate final diagnostic result
 */
export function generateDiagnosticResult(state: AssessmentState): DiagnosticResult {
  // Ensure all skills have results
  const skillResults: Record<QuestionSkill, SkillAssessmentResult> = {} as any;
  
  for (const skill of ASSESSMENT_ORDER) {
    if (state.skillResults[skill]) {
      skillResults[skill] = state.skillResults[skill]!;
    } else {
      // Calculate from responses if not already done
      skillResults[skill] = calculateSkillResult(skill, state.allResponses);
    }
  }
  
  // Calculate overall level
  const levels = Object.values(skillResults).map(r => r.estimatedLevel);
  const belowCount = levels.filter(l => l === 'below').length;
  const aboveCount = levels.filter(l => l === 'above').length;
  
  let overallLevel: 'below' | 'on' | 'above';
  if (belowCount >= 3) {
    overallLevel = 'below';
  } else if (aboveCount >= 3) {
    overallLevel = 'above';
  } else {
    overallLevel = 'on';
  }
  
  // Calculate confidence
  const confidences = Object.values(skillResults).map(r => r.confidence);
  const overallConfidence = Math.round(
    confidences.reduce((a, b) => a + b, 0) / confidences.length
  );
  
  // Estimate grade level (2.0 - 4.0 scale)
  const levelScores = { below: 2.0, on: 3.0, above: 4.0 };
  const avgScore = Object.values(skillResults)
    .map(r => levelScores[r.estimatedLevel])
    .reduce((a, b) => a + b, 0) / 5;
  const estimatedGradeLevel = Math.round(avgScore * 10) / 10;
  
  // Find weakest skill to recommend
  const sortedByStrength = Object.values(skillResults).sort((a, b) => {
    const scoreA = a.correct / Math.max(1, a.questionsAsked);
    const scoreB = b.correct / Math.max(1, b.questionsAsked);
    return scoreA - scoreB;
  });
  const recommendedPath = sortedByStrength[0].skill;
  
  // Recommend starting world
  let recommendedStartingWorld: string;
  if (overallLevel === 'below') {
    recommendedStartingWorld = 'world-school';
  } else if (overallLevel === 'on') {
    recommendedStartingWorld = 'world-school'; // Start at school, unlock forest quickly
  } else {
    recommendedStartingWorld = 'world-forest'; // Advanced students skip to forest
  }
  
  // Generate personalized message
  const personalizedMessage = generatePersonalizedMessage(skillResults, overallLevel);
  
  // Create pre-populated adaptive state
  const adaptiveState = createAdaptiveStateFromAssessment(state.allResponses, skillResults);
  
  return {
    overallLevel,
    overallConfidence,
    skillResults,
    recommendedStartingWorld,
    recommendedPath,
    personalizedMessage,
    estimatedGradeLevel,
    adaptiveState,
  };
}

/**
 * Generate encouraging personalized message
 */
function generatePersonalizedMessage(
  results: Record<QuestionSkill, SkillAssessmentResult>,
  overallLevel: 'below' | 'on' | 'above'
): string {
  const skillNames: Record<QuestionSkill, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    wordProblem: 'Word Problems',
  };
  
  // Find strongest skill
  const sorted = Object.values(results).sort((a, b) => 
    (b.correct / Math.max(1, b.questionsAsked)) - (a.correct / Math.max(1, a.questionsAsked))
  );
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];
  
  let message = '';
  
  if (overallLevel === 'above') {
    message = `🌟 Wow! You're a math superstar! `;
    message += `You're especially amazing at ${skillNames[strongest.skill]}! `;
    message += `Let's challenge you with some harder adventures!`;
  } else if (overallLevel === 'on') {
    message = `🎉 Great job! You know your 3rd grade math! `;
    message += `${skillNames[strongest.skill]} is your superpower! `;
    message += `Let's practice ${skillNames[weakest.skill]} to make you even stronger!`;
  } else {
    message = `💪 Good effort! Everyone starts somewhere! `;
    message += `You did well with ${skillNames[strongest.skill]}! `;
    message += `We'll practice together and you'll be a math hero in no time!`;
  }
  
  return message;
}

/**
 * Create adaptive state pre-populated from assessment
 */
function createAdaptiveStateFromAssessment(
  responses: AssessmentState['allResponses'],
  results: Record<QuestionSkill, SkillAssessmentResult>
): AdaptiveLearningState {
  const state = createInitialAdaptiveState();
  
  // Populate skill mastery from results
  for (const [skill, result] of Object.entries(results)) {
    const skillKey = skill as QuestionSkill;
    const mastery = state.skillMastery[skillKey];
    
    mastery.totalAttempts = result.questionsAsked;
    mastery.totalCorrect = result.correct;
    
    // Populate recent attempts
    const skillResponses = responses.filter(r => r.skill === skillKey);
    mastery.recentAttempts = skillResponses.map(r => r.correct ? 1 : 0);
    
    // Calculate mastery percentage
    mastery.currentMastery = Math.round((result.correct / Math.max(1, result.questionsAsked)) * 100);
    
    // Set trend
    if (result.estimatedLevel === 'above') {
      mastery.trend = 'stable'; // Already good
    } else if (result.estimatedLevel === 'below') {
      mastery.trend = 'struggling';
    } else {
      mastery.trend = 'stable';
    }
  }
  
  // Populate question history
  for (const response of responses) {
    state.questionHistory[response.question.id] = {
      questionId: response.question.id,
      attempts: 1,
      correct: response.correct ? 1 : 0,
      lastAttempted: Date.now(),
      lastCorrect: response.correct,
      averageTimeMs: response.timeMs,
    };
  }
  
  // Set initial difficulty based on overall performance
  const overallAccuracy = responses.filter(r => r.correct).length / responses.length;
  if (overallAccuracy >= 0.7) {
    state.currentDifficultyLevel = 'adaptive';
  } else {
    state.currentDifficultyLevel = 'easy';
  }
  
  return state;
}

/**
 * Get progress through assessment (for UI)
 */
export function getAssessmentProgress(state: AssessmentState): {
  currentSkillName: string;
  skillNumber: number;
  totalSkills: number;
  questionInSkill: number;
  overallProgress: number;
} {
  const skillNames: Record<QuestionSkill, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    wordProblem: 'Word Problems',
  };
  
  const completedSkills = state.currentSkillIndex;
  const progressInCurrentSkill = state.questionsInCurrentSkill / BASE_QUESTIONS_PER_SKILL;
  const overallProgress = (completedSkills + progressInCurrentSkill) / ASSESSMENT_ORDER.length;
  
  return {
    currentSkillName: skillNames[state.currentSkill],
    skillNumber: state.currentSkillIndex + 1,
    totalSkills: ASSESSMENT_ORDER.length,
    questionInSkill: state.questionsInCurrentSkill + 1,
    overallProgress: Math.round(overallProgress * 100),
  };
}

/**
 * Get encouraging message during assessment
 */
export function getAssessmentEncouragement(state: AssessmentState): string | null {
  const { questionsInCurrentSkill, correctInCurrentSkill, currentSkillIndex } = state;
  
  // After completing a skill
  if (questionsInCurrentSkill === 0 && currentSkillIndex > 0) {
    const messages = [
      '✨ Great job! On to the next challenge!',
      '🎯 Nice work! Keep it up!',
      '🚀 You\'re doing awesome!',
      '⭐ Fantastic! Let\'s keep going!',
    ];
    return messages[currentSkillIndex % messages.length];
  }
  
  // After getting multiple right in a row
  if (correctInCurrentSkill >= 3 && questionsInCurrentSkill === correctInCurrentSkill) {
    return '🔥 On fire! You really know this!';
  }
  
  // After getting one wrong (encouragement)
  if (questionsInCurrentSkill > 0 && correctInCurrentSkill < questionsInCurrentSkill) {
    const lastResponse = state.allResponses[state.allResponses.length - 1];
    if (lastResponse && !lastResponse.correct) {
      const messages = [
        '💪 Tricky one! Let\'s try another!',
        '🌟 Good try! You\'re learning!',
        '📚 That\'s okay, practice makes perfect!',
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
  }
  
  return null;
}
