/**
 * Learning System Types
 * Defines the core data structures for questions, quests, and player progress.
 */

export type QuestionSkill =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'wordProblem';

export type Difficulty = 'easy' | 'medium';

export interface Question {
  id: string;
  prompt: string;
  choices: number[];
  correctIndex: number;
  skill: QuestionSkill;
  difficulty: Difficulty;
  hint: string; // Pre-written hint for incorrect answers
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  npcName: string;
  npcIntro: string; // What the NPC says when starting the quest
  questionIds: string[]; // References to questions in the bank
  rewardXp: number;
  completionMessage: string;
}

export interface QuestProgress {
  questId: string;
  currentQuestionIndex: number;
  correctAnswers: number;
  incorrectAnswers: number;
  startedAt: number;
}

export interface LearningStats {
  totalQuestionsAnswered: number;
  totalCorrect: number;
  totalIncorrect: number;
  skillProgress: Record<QuestionSkill, { correct: number; total: number }>;
}
