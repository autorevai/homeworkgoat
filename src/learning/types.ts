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

/**
 * Common Core Math Standards for 3rd Grade
 * Reference: https://www.corestandards.org/Math/Content/3/
 */
export type CommonCoreStandard =
  // Operations & Algebraic Thinking
  | '3.OA.A.1' // Interpret products of whole numbers
  | '3.OA.A.2' // Interpret quotients of whole numbers
  | '3.OA.A.3' // Use multiplication/division to solve word problems
  | '3.OA.A.4' // Determine unknown in multiplication/division equation
  | '3.OA.B.5' // Apply properties of operations
  | '3.OA.B.6' // Understand division as unknown-factor problem
  | '3.OA.C.7' // Fluently multiply and divide within 100
  | '3.OA.D.8' // Solve two-step word problems
  | '3.OA.D.9' // Identify arithmetic patterns
  // Number & Operations in Base Ten
  | '3.NBT.A.1' // Round to nearest 10 or 100
  | '3.NBT.A.2' // Fluently add and subtract within 1000
  | '3.NBT.A.3' // Multiply one-digit by multiples of 10
  // Number & Operations—Fractions
  | '3.NF.A.1' // Understand fractions as parts of a whole
  | '3.NF.A.2' // Understand fractions on a number line
  | '3.NF.A.3' // Explain equivalence and compare fractions
  // Measurement & Data
  | '3.MD.A.1' // Tell time, solve time interval problems
  | '3.MD.A.2' // Measure liquid volumes and masses
  | '3.MD.B.3' // Draw and interpret graphs
  | '3.MD.C.7' // Relate area to multiplication
  | '3.MD.D.8' // Solve perimeter problems
  // Geometry
  | '3.G.A.1' // Understand shapes with shared attributes
  | '3.G.A.2'; // Partition shapes into equal parts

export interface Question {
  id: string;
  prompt: string;
  choices: number[];
  correctIndex: number;
  skill: QuestionSkill;
  difficulty: Difficulty;
  hint: string; // Pre-written hint for incorrect answers
  commonCoreStandard?: CommonCoreStandard; // Optional for backward compatibility with existing questions
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
