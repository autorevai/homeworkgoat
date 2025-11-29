/**
 * Analytics Service
 * Comprehensive event tracking for understanding user behavior and monetization.
 *
 * Collections:
 * - game_sessions: Track each play session
 * - question_events: Log every question answered
 * - user_events: General engagement events
 */

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
  increment,
} from 'firebase/firestore';
import { logEvent, Analytics } from 'firebase/analytics';
import { db, initAnalytics } from './config';
import type { QuestionSkill, Difficulty } from '../learning/types';

// Collection names
const SESSIONS_COLLECTION = 'game_sessions';
const QUESTION_EVENTS_COLLECTION = 'question_events';
const USER_EVENTS_COLLECTION = 'user_events';
const DAILY_STATS_COLLECTION = 'daily_stats';

let analytics: Analytics | null = null;

// Initialize analytics on load
initAnalytics().then(a => {
  analytics = a;
});

// ============================================
// SESSION TRACKING
// ============================================

export interface GameSession {
  sessionId: string;
  userId: string;
  startedAt: Timestamp;
  endedAt?: Timestamp;
  durationSeconds?: number;
  questsAttempted: number;
  questsCompleted: number;
  questionsAnswered: number;
  questionsCorrect: number;
  xpEarned: number;
  deviceType: 'mobile' | 'tablet' | 'desktop';
  screenWidth: number;
  screenHeight: number;
  userAgent: string;
  referrer: string;
  isNewUser: boolean;
}

let currentSessionId: string | null = null;
let sessionStartTime: number = 0;

function getDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

/**
 * Start a new game session - call when user starts playing
 */
export async function startSession(userId: string, isNewUser: boolean = false): Promise<string> {
  sessionStartTime = Date.now();

  const sessionData = {
    userId,
    startedAt: serverTimestamp(),
    questsAttempted: 0,
    questsCompleted: 0,
    questionsAnswered: 0,
    questionsCorrect: 0,
    xpEarned: 0,
    deviceType: getDeviceType(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight,
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'direct',
    isNewUser,
  };

  const docRef = await addDoc(collection(db, SESSIONS_COLLECTION), sessionData);
  currentSessionId = docRef.id;

  // Also log to Firebase Analytics
  if (analytics) {
    logEvent(analytics, 'session_start', {
      user_id: userId,
      is_new_user: isNewUser,
      device_type: sessionData.deviceType,
    });
  }

  return currentSessionId;
}

/**
 * End the current session - call when user leaves or app closes
 */
export async function endSession(): Promise<void> {
  if (!currentSessionId) return;

  const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);

  await updateDoc(doc(db, SESSIONS_COLLECTION, currentSessionId), {
    endedAt: serverTimestamp(),
    durationSeconds,
  });

  if (analytics) {
    logEvent(analytics, 'session_end', {
      duration_seconds: durationSeconds,
    });
  }

  currentSessionId = null;
}

/**
 * Update session stats (call after quest/question events)
 */
export async function updateSessionStats(updates: {
  questsAttempted?: number;
  questsCompleted?: number;
  questionsAnswered?: number;
  questionsCorrect?: number;
  xpEarned?: number;
}): Promise<void> {
  if (!currentSessionId) return;

  const incrementUpdates: Record<string, ReturnType<typeof increment>> = {};

  if (updates.questsAttempted) incrementUpdates.questsAttempted = increment(updates.questsAttempted);
  if (updates.questsCompleted) incrementUpdates.questsCompleted = increment(updates.questsCompleted);
  if (updates.questionsAnswered) incrementUpdates.questionsAnswered = increment(updates.questionsAnswered);
  if (updates.questionsCorrect) incrementUpdates.questionsCorrect = increment(updates.questionsCorrect);
  if (updates.xpEarned) incrementUpdates.xpEarned = increment(updates.xpEarned);

  if (Object.keys(incrementUpdates).length > 0) {
    await updateDoc(doc(db, SESSIONS_COLLECTION, currentSessionId), incrementUpdates);
  }
}

// ============================================
// QUESTION EVENT TRACKING
// ============================================

export interface QuestionEvent {
  userId: string;
  sessionId: string;
  questId: string;
  questionId: string;
  skill: QuestionSkill;
  difficulty: Difficulty;
  isCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
  timeToAnswerMs: number;
  hintsUsed: number;
  attemptNumber: number; // 1st try, 2nd try, etc.
  timestamp: Timestamp;
}

/**
 * Log a question answer event - call every time a question is answered
 */
export async function logQuestionEvent(event: {
  userId: string;
  questId: string;
  questionId: string;
  skill: QuestionSkill;
  difficulty: Difficulty;
  isCorrect: boolean;
  selectedAnswer: number;
  correctAnswer: number;
  timeToAnswerMs: number;
  hintsUsed?: number;
  attemptNumber?: number;
}): Promise<void> {
  const eventData = {
    ...event,
    sessionId: currentSessionId || 'unknown',
    hintsUsed: event.hintsUsed || 0,
    attemptNumber: event.attemptNumber || 1,
    timestamp: serverTimestamp(),
  };

  await addDoc(collection(db, QUESTION_EVENTS_COLLECTION), eventData);

  // Update session stats
  await updateSessionStats({
    questionsAnswered: 1,
    questionsCorrect: event.isCorrect ? 1 : 0,
  });

  // Log to Firebase Analytics
  if (analytics) {
    logEvent(analytics, 'question_answered', {
      skill: event.skill,
      difficulty: event.difficulty,
      is_correct: event.isCorrect,
      time_to_answer_ms: event.timeToAnswerMs,
    });
  }

  // Update daily stats for aggregation
  await updateDailyStats(event.userId, event.skill, event.isCorrect);
}

// ============================================
// USER ENGAGEMENT EVENTS
// ============================================

export type UserEventType =
  | 'screen_view'
  | 'quest_started'
  | 'quest_completed'
  | 'quest_abandoned'
  | 'avatar_customized'
  | 'achievement_unlocked'
  | 'level_up'
  | 'hint_used'
  | 'tutorial_step'
  | 'settings_changed'
  | 'share_clicked'
  | 'premium_prompt_shown'
  | 'premium_prompt_clicked'
  | 'error_occurred';

export interface UserEvent {
  userId: string;
  sessionId: string;
  eventType: UserEventType;
  eventData: Record<string, unknown>;
  screenName?: string;
  timestamp: Timestamp;
}

/**
 * Log a general user event
 */
export async function logUserEvent(
  userId: string,
  eventType: UserEventType,
  eventData: Record<string, unknown> = {},
  screenName?: string
): Promise<void> {
  const event = {
    userId,
    sessionId: currentSessionId || 'unknown',
    eventType,
    eventData,
    screenName,
    timestamp: serverTimestamp(),
  };

  await addDoc(collection(db, USER_EVENTS_COLLECTION), event);

  // Log to Firebase Analytics
  if (analytics) {
    logEvent(analytics, eventType as string, {
      ...eventData,
      screen_name: screenName,
    });
  }
}

// Convenience methods for common events

export async function logScreenView(userId: string, screenName: string): Promise<void> {
  await logUserEvent(userId, 'screen_view', { screen_name: screenName }, screenName);
}

export async function logQuestStarted(userId: string, questId: string, questTitle: string): Promise<void> {
  await logUserEvent(userId, 'quest_started', { quest_id: questId, quest_title: questTitle });
  await updateSessionStats({ questsAttempted: 1 });
}

export async function logQuestCompleted(
  userId: string,
  questId: string,
  questTitle: string,
  score: number,
  totalQuestions: number,
  xpEarned: number,
  timeSpentSeconds: number
): Promise<void> {
  await logUserEvent(userId, 'quest_completed', {
    quest_id: questId,
    quest_title: questTitle,
    score,
    total_questions: totalQuestions,
    accuracy: totalQuestions > 0 ? (score / totalQuestions) * 100 : 0,
    xp_earned: xpEarned,
    time_spent_seconds: timeSpentSeconds,
  });
  await updateSessionStats({ questsCompleted: 1, xpEarned });
}

export async function logQuestAbandoned(
  userId: string,
  questId: string,
  questTitle: string,
  questionsAnswered: number,
  totalQuestions: number
): Promise<void> {
  await logUserEvent(userId, 'quest_abandoned', {
    quest_id: questId,
    quest_title: questTitle,
    questions_answered: questionsAnswered,
    total_questions: totalQuestions,
    completion_rate: totalQuestions > 0 ? (questionsAnswered / totalQuestions) * 100 : 0,
  });
}

export async function logAvatarCustomized(userId: string, changes: Record<string, unknown>): Promise<void> {
  await logUserEvent(userId, 'avatar_customized', changes);
}

export async function logLevelUp(userId: string, newLevel: number, totalXp: number): Promise<void> {
  await logUserEvent(userId, 'level_up', { new_level: newLevel, total_xp: totalXp });
}

export async function logHintUsed(userId: string, questId: string, questionId: string, skill: QuestionSkill): Promise<void> {
  await logUserEvent(userId, 'hint_used', { quest_id: questId, question_id: questionId, skill });
}

export async function logError(userId: string, errorType: string, errorMessage: string, context?: Record<string, unknown>): Promise<void> {
  await logUserEvent(userId, 'error_occurred', {
    error_type: errorType,
    error_message: errorMessage,
    ...context,
  });
}

// ============================================
// DAILY AGGREGATED STATS (for dashboards)
// ============================================

/**
 * Update daily aggregated stats - useful for dashboards and trend analysis
 */
async function updateDailyStats(_userId: string, skill: QuestionSkill, isCorrect: boolean): Promise<void> {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const dailyDocId = `${today}`;

  // Global daily stats
  try {
    const globalRef = doc(db, DAILY_STATS_COLLECTION, dailyDocId);
    await updateDoc(globalRef, {
      totalQuestions: increment(1),
      totalCorrect: increment(isCorrect ? 1 : 0),
      [`skills.${skill}.total`]: increment(1),
      [`skills.${skill}.correct`]: increment(isCorrect ? 1 : 0),
      uniqueUsers: increment(0), // Would need special handling for true unique count
    }).catch(async () => {
      // Document doesn't exist, create it
      const { setDoc } = await import('firebase/firestore');
      await setDoc(globalRef, {
        date: today,
        totalQuestions: 1,
        totalCorrect: isCorrect ? 1 : 0,
        skills: {
          [skill]: { total: 1, correct: isCorrect ? 1 : 0 },
        },
        uniqueUsers: 1,
      });
    });
  } catch (e) {
    console.error('Failed to update daily stats:', e);
  }
}

// ============================================
// MONETIZATION TRACKING
// ============================================

export async function logPremiumPromptShown(userId: string, promptType: string, context: string): Promise<void> {
  await logUserEvent(userId, 'premium_prompt_shown', {
    prompt_type: promptType,
    context,
  });
}

export async function logPremiumPromptClicked(userId: string, promptType: string, action: 'dismiss' | 'subscribe' | 'learn_more'): Promise<void> {
  await logUserEvent(userId, 'premium_prompt_clicked', {
    prompt_type: promptType,
    action,
  });
}

// ============================================
// SESSION LIFECYCLE HELPERS
// ============================================

/**
 * Set up automatic session end on page unload
 */
export function setupSessionLifecycle(): void {
  // End session when page is closed/navigated away
  window.addEventListener('beforeunload', () => {
    if (currentSessionId) {
      // Use sendBeacon for reliable delivery on page unload
      const durationSeconds = Math.floor((Date.now() - sessionStartTime) / 1000);
      navigator.sendBeacon(
        '/api/end-session', // You'd need a simple API endpoint for this
        JSON.stringify({ sessionId: currentSessionId, durationSeconds })
      );
    }
  });

  // Handle visibility changes (user switches tabs)
  document.addEventListener('visibilitychange', () => {
    if (analytics) {
      logEvent(analytics, 'visibility_change', {
        visible: document.visibilityState === 'visible',
      });
    }
  });
}

/**
 * Get current session ID
 */
export function getCurrentSessionId(): string | null {
  return currentSessionId;
}
