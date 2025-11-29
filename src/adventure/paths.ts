/**
 * Adventure Path System
 * Skill-based progression paths that give players long-term goals.
 */

import type { QuestionSkill } from '../learning/types';

export interface AdventureLevel {
  level: number;
  name: string;
  requiredMastery: number; // Percentage accuracy needed
  requiredQuestions: number; // Minimum questions answered
  reward: {
    xp: number;
    cosmetic?: string;
    title?: string;
  };
}

export interface AdventurePath {
  id: string;
  name: string;
  skill: QuestionSkill;
  icon: string;
  color: string;
  description: string;
  levels: AdventureLevel[];
}

export interface AdventureProgress {
  pathId: string;
  currentLevel: number;
  questionsAnswered: number;
  correctAnswers: number;
  mastery: number; // Percentage
}

export const adventurePaths: AdventurePath[] = [
  // =====================================================
  // ADDITION PATH
  // =====================================================
  {
    id: 'path-addition',
    name: 'Addition Adventurer',
    skill: 'addition',
    icon: '➕',
    color: '#4CAF50',
    description: 'Master the art of adding numbers together!',
    levels: [
      {
        level: 1,
        name: 'Number Novice',
        requiredMastery: 50,
        requiredQuestions: 10,
        reward: { xp: 100 },
      },
      {
        level: 2,
        name: 'Sum Seeker',
        requiredMastery: 60,
        requiredQuestions: 25,
        reward: { xp: 200, title: 'Adder' },
      },
      {
        level: 3,
        name: 'Addition Ace',
        requiredMastery: 70,
        requiredQuestions: 50,
        reward: { xp: 300, cosmetic: 'plus-cap' },
      },
      {
        level: 4,
        name: 'Sum Sorcerer',
        requiredMastery: 80,
        requiredQuestions: 100,
        reward: { xp: 500, title: 'Grandmaster of Addition' },
      },
      {
        level: 5,
        name: 'Addition Legend',
        requiredMastery: 90,
        requiredQuestions: 200,
        reward: { xp: 1000, cosmetic: 'golden-plus', title: 'The Calculator' },
      },
    ],
  },

  // =====================================================
  // SUBTRACTION PATH
  // =====================================================
  {
    id: 'path-subtraction',
    name: 'Subtraction Specialist',
    skill: 'subtraction',
    icon: '➖',
    color: '#2196F3',
    description: 'Become a master of taking away!',
    levels: [
      {
        level: 1,
        name: 'Difference Discoverer',
        requiredMastery: 50,
        requiredQuestions: 10,
        reward: { xp: 100 },
      },
      {
        level: 2,
        name: 'Minus Master',
        requiredMastery: 60,
        requiredQuestions: 25,
        reward: { xp: 200, title: 'Subtractor' },
      },
      {
        level: 3,
        name: 'Borrowing Boss',
        requiredMastery: 70,
        requiredQuestions: 50,
        reward: { xp: 300, cosmetic: 'minus-badge' },
      },
      {
        level: 4,
        name: 'Subtraction Sage',
        requiredMastery: 80,
        requiredQuestions: 100,
        reward: { xp: 500, title: 'Grandmaster of Subtraction' },
      },
      {
        level: 5,
        name: 'Subtraction Legend',
        requiredMastery: 90,
        requiredQuestions: 200,
        reward: { xp: 1000, cosmetic: 'silver-minus', title: 'The Reducer' },
      },
    ],
  },

  // =====================================================
  // MULTIPLICATION PATH
  // =====================================================
  {
    id: 'path-multiplication',
    name: 'Multiplication Master',
    skill: 'multiplication',
    icon: '✖️',
    color: '#FF9800',
    description: 'Multiply your knowledge and power!',
    levels: [
      {
        level: 1,
        name: 'Times Trainee',
        requiredMastery: 50,
        requiredQuestions: 10,
        reward: { xp: 100 },
      },
      {
        level: 2,
        name: 'Product Pro',
        requiredMastery: 60,
        requiredQuestions: 25,
        reward: { xp: 200, title: 'Multiplier' },
      },
      {
        level: 3,
        name: 'Table Titan',
        requiredMastery: 70,
        requiredQuestions: 50,
        reward: { xp: 300, cosmetic: 'times-crown' },
      },
      {
        level: 4,
        name: 'Multiplication Mage',
        requiredMastery: 80,
        requiredQuestions: 100,
        reward: { xp: 500, title: 'Grandmaster of Multiplication' },
      },
      {
        level: 5,
        name: 'Multiplication Legend',
        requiredMastery: 90,
        requiredQuestions: 200,
        reward: { xp: 1000, cosmetic: 'golden-x', title: 'The Exponentiator' },
      },
    ],
  },

  // =====================================================
  // DIVISION PATH
  // =====================================================
  {
    id: 'path-division',
    name: 'Division Detective',
    skill: 'division',
    icon: '➗',
    color: '#9C27B0',
    description: 'Divide and conquer every problem!',
    levels: [
      {
        level: 1,
        name: 'Quotient Quest',
        requiredMastery: 50,
        requiredQuestions: 10,
        reward: { xp: 100 },
      },
      {
        level: 2,
        name: 'Sharing Scholar',
        requiredMastery: 60,
        requiredQuestions: 25,
        reward: { xp: 200, title: 'Divider' },
      },
      {
        level: 3,
        name: 'Division Dynamo',
        requiredMastery: 70,
        requiredQuestions: 50,
        reward: { xp: 300, cosmetic: 'divide-shield' },
      },
      {
        level: 4,
        name: 'Division Druid',
        requiredMastery: 80,
        requiredQuestions: 100,
        reward: { xp: 500, title: 'Grandmaster of Division' },
      },
      {
        level: 5,
        name: 'Division Legend',
        requiredMastery: 90,
        requiredQuestions: 200,
        reward: { xp: 1000, cosmetic: 'platinum-divide', title: 'The Fractionator' },
      },
    ],
  },

  // =====================================================
  // WORD PROBLEMS PATH
  // =====================================================
  {
    id: 'path-wordProblem',
    name: 'Word Wizard',
    skill: 'wordProblem',
    icon: '📖',
    color: '#E91E63',
    description: 'Turn stories into solutions!',
    levels: [
      {
        level: 1,
        name: 'Story Starter',
        requiredMastery: 50,
        requiredQuestions: 10,
        reward: { xp: 100 },
      },
      {
        level: 2,
        name: 'Problem Puzzler',
        requiredMastery: 60,
        requiredQuestions: 25,
        reward: { xp: 200, title: 'Story Solver' },
      },
      {
        level: 3,
        name: 'Word Warrior',
        requiredMastery: 70,
        requiredQuestions: 50,
        reward: { xp: 300, cosmetic: 'story-scroll' },
      },
      {
        level: 4,
        name: 'Word Wizard',
        requiredMastery: 80,
        requiredQuestions: 100,
        reward: { xp: 500, title: 'Grandmaster of Word Problems' },
      },
      {
        level: 5,
        name: 'Word Legend',
        requiredMastery: 90,
        requiredQuestions: 200,
        reward: { xp: 1000, cosmetic: 'legendary-book', title: 'The Narrator' },
      },
    ],
  },
];

/**
 * Get adventure path by ID
 */
export function getAdventurePathById(id: string): AdventurePath | undefined {
  return adventurePaths.find((p) => p.id === id);
}

/**
 * Get adventure path by skill
 */
export function getAdventurePathBySkill(skill: QuestionSkill): AdventurePath | undefined {
  return adventurePaths.find((p) => p.skill === skill);
}

/**
 * Calculate current level based on progress
 */
export function calculateAdventureLevel(
  path: AdventurePath,
  questionsAnswered: number,
  correctAnswers: number
): number {
  const mastery = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

  for (let i = path.levels.length - 1; i >= 0; i--) {
    const level = path.levels[i];
    if (questionsAnswered >= level.requiredQuestions && mastery >= level.requiredMastery) {
      return level.level;
    }
  }

  return 0; // Not yet level 1
}

/**
 * Get progress to next level
 */
export function getProgressToNextLevel(
  path: AdventurePath,
  questionsAnswered: number,
  correctAnswers: number
): { 
  currentLevel: number;
  nextLevel: AdventureLevel | null;
  questionProgress: number;
  masteryProgress: number;
} {
  const currentLevel = calculateAdventureLevel(path, questionsAnswered, correctAnswers);
  const mastery = questionsAnswered > 0 ? (correctAnswers / questionsAnswered) * 100 : 0;

  if (currentLevel >= path.levels.length) {
    return {
      currentLevel,
      nextLevel: null,
      questionProgress: 100,
      masteryProgress: 100,
    };
  }

  const nextLevel = path.levels[currentLevel]; // levels are 0-indexed array, currentLevel is 1-indexed
  
  const prevRequiredQuestions = currentLevel > 0 ? path.levels[currentLevel - 1].requiredQuestions : 0;
  const questionProgress = Math.min(100, 
    ((questionsAnswered - prevRequiredQuestions) / (nextLevel.requiredQuestions - prevRequiredQuestions)) * 100
  );

  const masteryProgress = Math.min(100, (mastery / nextLevel.requiredMastery) * 100);

  return {
    currentLevel,
    nextLevel,
    questionProgress: Math.max(0, questionProgress),
    masteryProgress: Math.max(0, masteryProgress),
  };
}

/**
 * Create initial adventure progress for all paths
 */
export function createInitialAdventureProgress(): Record<string, AdventureProgress> {
  const progress: Record<string, AdventureProgress> = {};

  for (const path of adventurePaths) {
    progress[path.id] = {
      pathId: path.id,
      currentLevel: 0,
      questionsAnswered: 0,
      correctAnswers: 0,
      mastery: 0,
    };
  }

  return progress;
}
