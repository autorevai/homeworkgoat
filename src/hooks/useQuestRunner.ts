/**
 * Quest Runner Store
 * Manages the state and logic for running an active quest.
 * Uses Zustand for global state accessible outside React components.
 */

import { create } from 'zustand';
import type { Quest, Question } from '../learning/types';
import { getQuestQuestions } from '../learning/learningEngine';
import { getHintForQuestion, getEncouragementMessage, getMistakeMessage } from '../ai/aiHooks';
import { useGameState } from './useGameState';
import { logger } from '../utils/logger';
import { getUserId } from '../firebase/authService';
import {
  logQuestStarted,
  logQuestCompleted,
  logQuestAbandoned,
  logQuestionEvent,
  logHintUsed,
} from '../firebase/analyticsService';

export type QuestPhase = 'idle' | 'intro' | 'question' | 'feedback' | 'complete';

interface QuestRunnerState {
  quest: Quest | null;
  questions: Question[];
  currentQuestionIndex: number;
  phase: QuestPhase;
  selectedAnswer: number | null;
  isCorrect: boolean | null;
  showHint: boolean;
  correctCount: number;
  incorrectCount: number;
  feedbackMessage: string;
  streak: number;
  questionStartTime: number;
  questStartTime: number;
  hintsUsedForCurrentQuestion: number;
}

interface QuestRunnerActions {
  startQuest: (quest: Quest) => void;
  beginQuestions: () => void;
  submitAnswer: (answerIndex: number) => void;
  showHintAction: () => void;
  nextQuestion: () => void;
  endQuest: () => void;
  getCurrentQuestion: () => Question | null;
  getHint: () => string;
}

const initialState: QuestRunnerState = {
  quest: null,
  questions: [],
  currentQuestionIndex: 0,
  phase: 'idle',
  selectedAnswer: null,
  isCorrect: null,
  showHint: false,
  correctCount: 0,
  incorrectCount: 0,
  feedbackMessage: '',
  streak: 0,
  questionStartTime: Date.now(),
  questStartTime: Date.now(),
  hintsUsedForCurrentQuestion: 0,
};

export const useQuestRunner = create<QuestRunnerState & QuestRunnerActions>((set, get) => ({
  ...initialState,

  startQuest: (quest: Quest) => {
    logger.quest.started(quest.id, quest.title);
    const questions = getQuestQuestions(quest);
    logger.debug('quest', 'questions_generated', { questId: quest.id, count: questions.length });

    // Analytics: track quest start
    const userId = getUserId();
    if (userId) {
      logQuestStarted(userId, quest.id, quest.title).catch(console.error);
    }

    set({
      quest,
      questions,
      currentQuestionIndex: 0,
      phase: 'intro',
      selectedAnswer: null,
      isCorrect: null,
      showHint: false,
      correctCount: 0,
      incorrectCount: 0,
      feedbackMessage: '',
      streak: 0,
      questStartTime: Date.now(),
      questionStartTime: Date.now(),
      hintsUsedForCurrentQuestion: 0,
    });
  },

  beginQuestions: () => {
    logger.debug('quest', 'questions_phase_started');
    set({
      phase: 'question',
      questionStartTime: Date.now(),
      hintsUsedForCurrentQuestion: 0,
    });
  },

  submitAnswer: (answerIndex: number) => {
    const state = get();
    if (!state.quest || state.phase !== 'question') return;

    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCorrect = answerIndex === currentQuestion.correctIndex;
    const timeToAnswerMs = Date.now() - state.questionStartTime;

    // Log the answer
    logger.quest.questionAnswered(
      state.quest.id,
      state.currentQuestionIndex,
      isCorrect,
      currentQuestion.skill
    );

    // Analytics: log detailed question event
    const userId = getUserId();
    if (userId) {
      logQuestionEvent({
        userId,
        questId: state.quest.id,
        questionId: currentQuestion.id,
        skill: currentQuestion.skill,
        difficulty: currentQuestion.difficulty,
        isCorrect,
        selectedAnswer: answerIndex,
        correctAnswer: currentQuestion.correctIndex,
        timeToAnswerMs,
        hintsUsed: state.hintsUsedForCurrentQuestion,
        attemptNumber: 1,
      }).catch(console.error);
    }

    // Record the answer in game state
    useGameState.getState().recordAnswer(currentQuestion.skill, isCorrect);

    const newStreak = isCorrect ? state.streak + 1 : 0;
    const feedbackMessage = isCorrect
      ? getEncouragementMessage(newStreak)
      : getMistakeMessage();

    set({
      selectedAnswer: answerIndex,
      isCorrect,
      phase: 'feedback',
      correctCount: state.correctCount + (isCorrect ? 1 : 0),
      incorrectCount: state.incorrectCount + (isCorrect ? 0 : 1),
      feedbackMessage,
      streak: newStreak,
    });
  },

  showHintAction: () => {
    const state = get();
    if (state.quest) {
      logger.quest.hintUsed(state.quest.id, state.currentQuestionIndex);

      // Analytics: track hint usage
      const userId = getUserId();
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (userId && currentQuestion) {
        logHintUsed(userId, state.quest.id, currentQuestion.id, currentQuestion.skill).catch(console.error);
      }
    }
    set({
      showHint: true,
      hintsUsedForCurrentQuestion: state.hintsUsedForCurrentQuestion + 1,
    });
  },

  nextQuestion: () => {
    const state = get();
    if (!state.quest) return;

    const nextIndex = state.currentQuestionIndex + 1;

    // Check if quest is complete
    if (nextIndex >= state.questions.length) {
      // Analytics: log quest completion
      const timeSpentSeconds = Math.floor((Date.now() - state.questStartTime) / 1000);
      const userId = getUserId();
      if (userId) {
        logQuestCompleted(
          userId,
          state.quest.id,
          state.quest.title,
          state.correctCount,
          state.questions.length,
          state.quest.rewardXp,
          timeSpentSeconds
        ).catch(console.error);
      }

      // Complete the quest
      useGameState.getState().completeQuest(
        state.quest.id,
        state.quest.rewardXp,
        state.correctCount,
        state.questions.length,
        state.quest.title
      );

      set({ phase: 'complete' });
      return;
    }

    // Move to next question
    set({
      currentQuestionIndex: nextIndex,
      phase: 'question',
      selectedAnswer: null,
      isCorrect: null,
      showHint: false,
      feedbackMessage: '',
      questionStartTime: Date.now(),
      hintsUsedForCurrentQuestion: 0,
    });
  },

  endQuest: () => {
    const state = get();
    if (state.quest && state.phase !== 'complete' && state.phase !== 'idle') {
      logger.quest.abandoned(state.quest.id, state.currentQuestionIndex);

      // Analytics: log quest abandoned
      const userId = getUserId();
      if (userId) {
        logQuestAbandoned(
          userId,
          state.quest.id,
          state.quest.title,
          state.currentQuestionIndex,
          state.questions.length
        ).catch(console.error);
      }
    }
    set(initialState);
  },

  getCurrentQuestion: (): Question | null => {
    const state = get();
    if (!state.quest || state.currentQuestionIndex >= state.questions.length) {
      return null;
    }
    return state.questions[state.currentQuestionIndex];
  },

  getHint: (): string => {
    const question = get().getCurrentQuestion();
    if (!question) return '';
    return getHintForQuestion(question, 1);
  },
}));

// Selector for getting current question (for convenience in components)
export const selectCurrentQuestion = (state: QuestRunnerState & QuestRunnerActions) =>
  state.getCurrentQuestion();

// Legacy hook interface for backwards compatibility
export function useQuestRunnerLegacy() {
  const state = useQuestRunner();

  return {
    // State
    quest: state.quest,
    phase: state.phase,
    currentQuestion: state.getCurrentQuestion(),
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: state.questions.length,
    selectedAnswer: state.selectedAnswer,
    isCorrect: state.isCorrect,
    showHint: state.showHint,
    correctCount: state.correctCount,
    incorrectCount: state.incorrectCount,
    feedbackMessage: state.feedbackMessage,
    streak: state.streak,
    isActive: state.quest !== null && state.phase !== 'idle',

    // Actions
    startQuest: state.startQuest,
    beginQuestions: state.beginQuestions,
    submitAnswer: state.submitAnswer,
    showHintAction: state.showHintAction,
    nextQuestion: state.nextQuestion,
    endQuest: state.endQuest,
    getHint: state.getHint,
  };
}
