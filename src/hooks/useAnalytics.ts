/**
 * Analytics Hook
 * React hook for easy analytics integration throughout the app.
 */

import { useCallback, useRef, useEffect } from 'react';
import { getUserId } from '../firebase/authService';
import {
  startSession,
  endSession,
  logQuestionEvent,
  logScreenView,
  logQuestStarted,
  logQuestCompleted,
  logQuestAbandoned,
  logAvatarCustomized,
  logLevelUp,
  logHintUsed,
  logUserEvent,
  logError,
  setupSessionLifecycle,
  getCurrentSessionId,
} from '../firebase/analyticsService';
import type { QuestionSkill, Difficulty } from '../learning/types';

export function useAnalytics() {
  const questionStartTime = useRef<number>(0);
  const questStartTime = useRef<number>(0);
  const sessionStarted = useRef<boolean>(false);

  // Set up session lifecycle on mount
  useEffect(() => {
    setupSessionLifecycle();
  }, []);

  const getUserIdSafe = useCallback((): string => {
    return getUserId() || 'anonymous';
  }, []);

  // Session management
  const startGameSession = useCallback(async (isNewUser: boolean = false) => {
    if (sessionStarted.current) return;
    const userId = getUserIdSafe();
    try {
      await startSession(userId, isNewUser);
      sessionStarted.current = true;
    } catch (e) {
      console.error('Failed to start analytics session:', e);
    }
  }, [getUserIdSafe]);

  const endGameSession = useCallback(async () => {
    if (!sessionStarted.current) return;
    try {
      await endSession();
      sessionStarted.current = false;
    } catch (e) {
      console.error('Failed to end analytics session:', e);
    }
  }, []);

  // Screen tracking
  const trackScreenView = useCallback(async (screenName: string) => {
    const userId = getUserIdSafe();
    try {
      await logScreenView(userId, screenName);
    } catch (e) {
      console.error('Failed to log screen view:', e);
    }
  }, [getUserIdSafe]);

  // Quest tracking
  const trackQuestStart = useCallback(async (questId: string, questTitle: string) => {
    const userId = getUserIdSafe();
    questStartTime.current = Date.now();
    try {
      await logQuestStarted(userId, questId, questTitle);
    } catch (e) {
      console.error('Failed to log quest start:', e);
    }
  }, [getUserIdSafe]);

  const trackQuestComplete = useCallback(async (
    questId: string,
    questTitle: string,
    correctAnswers: number,
    totalQuestions: number,
    xpEarned: number
  ) => {
    const userId = getUserIdSafe();
    const timeSpentSeconds = Math.floor((Date.now() - questStartTime.current) / 1000);
    try {
      await logQuestCompleted(
        userId,
        questId,
        questTitle,
        correctAnswers,
        totalQuestions,
        xpEarned,
        timeSpentSeconds
      );
    } catch (e) {
      console.error('Failed to log quest completion:', e);
    }
  }, [getUserIdSafe]);

  const trackQuestAbandoned = useCallback(async (
    questId: string,
    questTitle: string,
    questionsAnswered: number,
    totalQuestions: number
  ) => {
    const userId = getUserIdSafe();
    try {
      await logQuestAbandoned(userId, questId, questTitle, questionsAnswered, totalQuestions);
    } catch (e) {
      console.error('Failed to log quest abandoned:', e);
    }
  }, [getUserIdSafe]);

  // Question tracking
  const startQuestionTimer = useCallback(() => {
    questionStartTime.current = Date.now();
  }, []);

  const trackQuestionAnswer = useCallback(async (
    questId: string,
    questionId: string,
    skill: QuestionSkill,
    difficulty: Difficulty,
    isCorrect: boolean,
    selectedAnswer: number,
    correctAnswer: number,
    hintsUsed: number = 0,
    attemptNumber: number = 1
  ) => {
    const userId = getUserIdSafe();
    const timeToAnswerMs = Date.now() - questionStartTime.current;
    try {
      await logQuestionEvent({
        userId,
        questId,
        questionId,
        skill,
        difficulty,
        isCorrect,
        selectedAnswer,
        correctAnswer,
        timeToAnswerMs,
        hintsUsed,
        attemptNumber,
      });
    } catch (e) {
      console.error('Failed to log question answer:', e);
    }
  }, [getUserIdSafe]);

  // Hint tracking
  const trackHintUsed = useCallback(async (questId: string, questionId: string, skill: QuestionSkill) => {
    const userId = getUserIdSafe();
    try {
      await logHintUsed(userId, questId, questionId, skill);
    } catch (e) {
      console.error('Failed to log hint used:', e);
    }
  }, [getUserIdSafe]);

  // Avatar customization
  const trackAvatarChange = useCallback(async (changes: Record<string, unknown>) => {
    const userId = getUserIdSafe();
    try {
      await logAvatarCustomized(userId, changes);
    } catch (e) {
      console.error('Failed to log avatar customization:', e);
    }
  }, [getUserIdSafe]);

  // Level up
  const trackLevelUp = useCallback(async (newLevel: number, totalXp: number) => {
    const userId = getUserIdSafe();
    try {
      await logLevelUp(userId, newLevel, totalXp);
    } catch (e) {
      console.error('Failed to log level up:', e);
    }
  }, [getUserIdSafe]);

  // Generic event
  const trackEvent = useCallback(async (
    eventType: Parameters<typeof logUserEvent>[1],
    eventData: Record<string, unknown> = {},
    screenName?: string
  ) => {
    const userId = getUserIdSafe();
    try {
      await logUserEvent(userId, eventType, eventData, screenName);
    } catch (e) {
      console.error('Failed to log event:', e);
    }
  }, [getUserIdSafe]);

  // Error tracking
  const trackError = useCallback(async (errorType: string, errorMessage: string, context?: Record<string, unknown>) => {
    const userId = getUserIdSafe();
    try {
      await logError(userId, errorType, errorMessage, context);
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }, [getUserIdSafe]);

  return {
    // Session
    startGameSession,
    endGameSession,
    hasActiveSession: () => getCurrentSessionId() !== null,

    // Screens
    trackScreenView,

    // Quests
    trackQuestStart,
    trackQuestComplete,
    trackQuestAbandoned,

    // Questions
    startQuestionTimer,
    trackQuestionAnswer,

    // Other events
    trackHintUsed,
    trackAvatarChange,
    trackLevelUp,
    trackEvent,
    trackError,
  };
}
