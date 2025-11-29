/**
 * Quest Runner Hook
 * Manages the state and logic for running an active quest.
 */

import { useState, useCallback } from 'react';
import type { Quest, Question } from '../learning/types';
import { getQuestQuestions } from '../learning/learningEngine';
import { getHintForQuestion, getEncouragementMessage, getMistakeMessage } from '../ai/aiHooks';
import { useGameState } from './useGameState';
import { logger } from '../utils/logger';

export type QuestPhase = 'intro' | 'question' | 'feedback' | 'complete';

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
}

export function useQuestRunner() {
  const { recordAnswer, completeQuest } = useGameState();
  
  const [state, setState] = useState<QuestRunnerState>({
    quest: null,
    questions: [],
    currentQuestionIndex: 0,
    phase: 'intro',
    selectedAnswer: null,
    isCorrect: null,
    showHint: false,
    correctCount: 0,
    incorrectCount: 0,
    feedbackMessage: '',
    streak: 0,
  });

  const startQuest = useCallback((quest: Quest) => {
    logger.quest.started(quest.id, quest.title);
    const questions = getQuestQuestions(quest);
    logger.debug('quest', 'questions_generated', { questId: quest.id, count: questions.length });
    setState({
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
    });
  }, []);

  const beginQuestions = useCallback(() => {
    logger.debug('quest', 'questions_phase_started');
    setState(prev => ({ ...prev, phase: 'question' }));
  }, []);

  const submitAnswer = useCallback((answerIndex: number) => {
    setState(prev => {
      if (!prev.quest || prev.phase !== 'question') return prev;

      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      const isCorrect = answerIndex === currentQuestion.correctIndex;

      // Log the answer
      logger.quest.questionAnswered(
        prev.quest.id,
        prev.currentQuestionIndex,
        isCorrect,
        currentQuestion.skill
      );

      // Record the answer in game state
      recordAnswer(currentQuestion.skill, isCorrect);

      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const feedbackMessage = isCorrect
        ? getEncouragementMessage(newStreak)
        : getMistakeMessage();

      return {
        ...prev,
        selectedAnswer: answerIndex,
        isCorrect,
        phase: 'feedback',
        correctCount: prev.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: prev.incorrectCount + (isCorrect ? 0 : 1),
        feedbackMessage,
        streak: newStreak,
      };
    });
  }, [recordAnswer]);

  const showHint = useCallback(() => {
    setState(prev => {
      if (prev.quest) {
        logger.quest.hintUsed(prev.quest.id, prev.currentQuestionIndex);
      }
      return { ...prev, showHint: true };
    });
  }, []);

  const nextQuestion = useCallback(() => {
    setState(prev => {
      if (!prev.quest) return prev;

      const nextIndex = prev.currentQuestionIndex + 1;
      
      // Check if quest is complete
      if (nextIndex >= prev.questions.length) {
        // Complete the quest
        completeQuest(
          prev.quest.id,
          prev.quest.rewardXp,
          prev.correctCount,
          prev.questions.length,
          prev.quest.title
        );
        
        return {
          ...prev,
          phase: 'complete',
        };
      }

      // Move to next question
      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        phase: 'question',
        selectedAnswer: null,
        isCorrect: null,
        showHint: false,
        feedbackMessage: '',
      };
    });
  }, [completeQuest]);

  const endQuest = useCallback(() => {
    setState(prev => {
      if (prev.quest && prev.phase !== 'complete') {
        logger.quest.abandoned(prev.quest.id, prev.currentQuestionIndex);
      }
      return {
        quest: null,
        questions: [],
        currentQuestionIndex: 0,
        phase: 'intro',
        selectedAnswer: null,
        isCorrect: null,
        showHint: false,
        correctCount: 0,
        incorrectCount: 0,
        feedbackMessage: '',
        streak: 0,
      };
    });
  }, []);

  const getCurrentQuestion = useCallback((): Question | null => {
    if (!state.quest || state.currentQuestionIndex >= state.questions.length) {
      return null;
    }
    return state.questions[state.currentQuestionIndex];
  }, [state.quest, state.currentQuestionIndex, state.questions]);

  const getHint = useCallback((): string => {
    const question = getCurrentQuestion();
    if (!question) return '';
    return getHintForQuestion(question, 1);
  }, [getCurrentQuestion]);

  return {
    // State
    quest: state.quest,
    phase: state.phase,
    currentQuestion: getCurrentQuestion(),
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: state.questions.length,
    selectedAnswer: state.selectedAnswer,
    isCorrect: state.isCorrect,
    showHint: state.showHint,
    correctCount: state.correctCount,
    incorrectCount: state.incorrectCount,
    feedbackMessage: state.feedbackMessage,
    streak: state.streak,
    isActive: state.quest !== null,

    // Actions
    startQuest,
    beginQuestions,
    submitAnswer,
    showHintAction: showHint,
    nextQuestion,
    endQuest,
    getHint,
  };
}
