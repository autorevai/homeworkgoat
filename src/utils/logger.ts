/**
 * Logger Utility
 * Comprehensive logging system for debugging and analytics.
 * - Console logging with levels (debug, info, warn, error)
 * - Vercel Analytics integration for production tracking
 * - Session-based log storage for review
 */

import { track } from '@vercel/analytics';

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

// Event categories for organization
export type EventCategory =
  | 'auth'
  | 'game'
  | 'quest'
  | 'ui'
  | 'storage'
  | 'firebase'
  | 'audio'
  | 'navigation'
  | 'error'
  | 'performance';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: EventCategory;
  event: string;
  data?: Record<string, unknown>;
  sessionId: string;
}

// Generate a unique session ID
const SESSION_ID = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// In-memory log storage for the session
const sessionLogs: LogEntry[] = [];
const MAX_SESSION_LOGS = 1000;

// Check if we're in development mode
const isDev = import.meta.env.DEV;

// Check if debug mode is enabled via URL param or localStorage
const isDebugEnabled = (): boolean => {
  if (isDev) return true;
  if (typeof window === 'undefined') return false;

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('debug') === 'true') {
    localStorage.setItem('homework_goat_debug', 'true');
    return true;
  }
  return localStorage.getItem('homework_goat_debug') === 'true';
};

// Color coding for console logs
const levelColors: Record<LogLevel, string> = {
  debug: '#9E9E9E',
  info: '#2196F3',
  warn: '#FF9800',
  error: '#F44336',
};

const categoryColors: Record<EventCategory, string> = {
  auth: '#9C27B0',
  game: '#4CAF50',
  quest: '#FF5722',
  ui: '#00BCD4',
  storage: '#795548',
  firebase: '#FFC107',
  audio: '#E91E63',
  navigation: '#3F51B5',
  error: '#F44336',
  performance: '#607D8B',
};

/**
 * Core logging function
 */
function log(
  level: LogLevel,
  category: EventCategory,
  event: string,
  data?: Record<string, unknown>
): void {
  const timestamp = new Date().toISOString();

  const entry: LogEntry = {
    timestamp,
    level,
    category,
    event,
    data,
    sessionId: SESSION_ID,
  };

  // Store in session logs
  sessionLogs.push(entry);
  if (sessionLogs.length > MAX_SESSION_LOGS) {
    sessionLogs.shift();
  }

  // Console logging (always in dev, or if debug enabled in prod)
  if (isDev || isDebugEnabled() || level === 'error' || level === 'warn') {
    const levelColor = levelColors[level];
    const catColor = categoryColors[category];

    const prefix = `%c[${level.toUpperCase()}]%c [${category}]%c ${event}`;
    const styles = [
      `color: ${levelColor}; font-weight: bold;`,
      `color: ${catColor}; font-weight: bold;`,
      'color: inherit;',
    ];

    if (data && Object.keys(data).length > 0) {
      console.groupCollapsed(prefix, ...styles);
      console.log('Timestamp:', timestamp);
      console.log('Session:', SESSION_ID);
      console.log('Data:', data);
      console.groupEnd();
    } else {
      console.log(prefix, ...styles);
    }
  }

  // Track important events in Vercel Analytics (production only)
  if (!isDev && (level === 'info' || level === 'error')) {
    try {
      // Vercel Analytics event names should be noun_verb format
      const eventName = `${category}_${event.toLowerCase().replace(/\s+/g, '_')}`;

      // Filter out sensitive data and limit payload size
      const safeData = data ? sanitizeForAnalytics(data) : undefined;

      track(eventName, {
        ...safeData,
        level,
        sessionId: SESSION_ID,
      });
    } catch (e) {
      // Don't let analytics errors break the app
      console.error('Analytics tracking failed:', e);
    }
  }
}

/**
 * Sanitize data for analytics (remove PII, limit size)
 */
function sanitizeForAnalytics(data: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  const sensitiveKeys = ['password', 'email', 'token', 'apiKey', 'secret'];

  for (const [key, value] of Object.entries(data)) {
    // Skip sensitive keys
    if (sensitiveKeys.some(k => key.toLowerCase().includes(k))) {
      continue;
    }

    // Convert complex objects to strings
    if (typeof value === 'object' && value !== null) {
      sanitized[key] = JSON.stringify(value).slice(0, 100);
    } else if (typeof value === 'string') {
      sanitized[key] = value.slice(0, 100);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

// =============================================================================
// Public API - Organized by category
// =============================================================================

export const logger = {
  // Session info
  getSessionId: () => SESSION_ID,
  getSessionLogs: () => [...sessionLogs],

  // Export logs for debugging
  exportLogs: (): string => {
    return JSON.stringify(sessionLogs, null, 2);
  },

  // Download logs as file
  downloadLogs: (): void => {
    const blob = new Blob([logger.exportLogs()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `homework-goat-logs-${SESSION_ID}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },

  // Generic logging methods
  debug: (category: EventCategory, event: string, data?: Record<string, unknown>) =>
    log('debug', category, event, data),

  info: (category: EventCategory, event: string, data?: Record<string, unknown>) =>
    log('info', category, event, data),

  warn: (category: EventCategory, event: string, data?: Record<string, unknown>) =>
    log('warn', category, event, data),

  error: (category: EventCategory, event: string, data?: Record<string, unknown>) =>
    log('error', category, event, data),

  // ==========================================================================
  // Auth events
  // ==========================================================================
  auth: {
    signInStarted: () =>
      log('info', 'auth', 'sign_in_started'),

    signInSuccess: (userId: string, isAnonymous: boolean) =>
      log('info', 'auth', 'sign_in_success', { userId: userId.slice(0, 8) + '...', isAnonymous }),

    signInError: (error: string) =>
      log('error', 'auth', 'sign_in_error', { error }),

    signOut: () =>
      log('info', 'auth', 'sign_out'),

    sessionRestored: (userId: string) =>
      log('info', 'auth', 'session_restored', { userId: userId.slice(0, 8) + '...' }),
  },

  // ==========================================================================
  // Game state events
  // ==========================================================================
  game: {
    initialized: (isNewPlayer: boolean) =>
      log('info', 'game', 'initialized', { isNewPlayer }),

    screenChanged: (from: string, to: string) =>
      log('info', 'navigation', 'screen_changed', { from, to }),

    xpGained: (amount: number, newTotal: number, source: string) =>
      log('info', 'game', 'xp_gained', { amount, newTotal, source }),

    levelUp: (newLevel: number) =>
      log('info', 'game', 'level_up', { newLevel }),

    progressReset: () =>
      log('info', 'game', 'progress_reset'),
  },

  // ==========================================================================
  // Quest events
  // ==========================================================================
  quest: {
    started: (questId: string, questTitle: string) =>
      log('info', 'quest', 'started', { questId, questTitle }),

    questionAnswered: (questId: string, questionIndex: number, isCorrect: boolean, skill: string) =>
      log('info', 'quest', 'question_answered', { questId, questionIndex, isCorrect, skill }),

    hintUsed: (questId: string, questionIndex: number) =>
      log('debug', 'quest', 'hint_used', { questId, questionIndex }),

    completed: (questId: string, correctCount: number, totalQuestions: number, xpEarned: number) =>
      log('info', 'quest', 'completed', { questId, correctCount, totalQuestions, xpEarned, accuracy: Math.round((correctCount / totalQuestions) * 100) }),

    abandoned: (questId: string, questionIndex: number) =>
      log('info', 'quest', 'abandoned', { questId, questionIndex }),

    npcInteraction: (npcId: string, npcName: string) =>
      log('debug', 'quest', 'npc_interaction', { npcId, npcName }),
  },

  // ==========================================================================
  // UI events
  // ==========================================================================
  ui: {
    buttonClicked: (buttonId: string, context?: string) =>
      log('debug', 'ui', 'button_clicked', { buttonId, context }),

    menuOpened: (menuName: string) =>
      log('debug', 'ui', 'menu_opened', { menuName }),

    menuClosed: (menuName: string) =>
      log('debug', 'ui', 'menu_closed', { menuName }),

    avatarCustomized: (changes: Record<string, string>) =>
      log('info', 'ui', 'avatar_customized', changes),

    nameSet: (nameLength: number) =>
      log('info', 'ui', 'name_set', { nameLength }),

    dialogOpened: (dialogType: string) =>
      log('debug', 'ui', 'dialog_opened', { dialogType }),

    dialogClosed: (dialogType: string) =>
      log('debug', 'ui', 'dialog_closed', { dialogType }),
  },

  // ==========================================================================
  // Storage events
  // ==========================================================================
  storage: {
    localSaveStarted: () =>
      log('debug', 'storage', 'local_save_started'),

    localSaveSuccess: () =>
      log('debug', 'storage', 'local_save_success'),

    localSaveError: (error: string) =>
      log('error', 'storage', 'local_save_error', { error }),

    localLoadStarted: () =>
      log('debug', 'storage', 'local_load_started'),

    localLoadSuccess: (hasExistingData: boolean) =>
      log('debug', 'storage', 'local_load_success', { hasExistingData }),

    localLoadError: (error: string) =>
      log('error', 'storage', 'local_load_error', { error }),

    cloudSyncStarted: () =>
      log('debug', 'firebase', 'cloud_sync_started'),

    cloudSyncSuccess: () =>
      log('info', 'firebase', 'cloud_sync_success'),

    cloudSyncError: (error: string) =>
      log('error', 'firebase', 'cloud_sync_error', { error }),

    cloudLoadStarted: () =>
      log('debug', 'firebase', 'cloud_load_started'),

    cloudLoadSuccess: (hasData: boolean) =>
      log('info', 'firebase', 'cloud_load_success', { hasData }),

    cloudLoadError: (error: string) =>
      log('error', 'firebase', 'cloud_load_error', { error }),
  },

  // ==========================================================================
  // Audio events
  // ==========================================================================
  audio: {
    ttsStarted: (textLength: number, voiceType: string) =>
      log('debug', 'audio', 'tts_started', { textLength, voiceType }),

    ttsCompleted: (textLength: number) =>
      log('debug', 'audio', 'tts_completed', { textLength }),

    ttsError: (error: string) =>
      log('error', 'audio', 'tts_error', { error }),

    ttsStopped: () =>
      log('debug', 'audio', 'tts_stopped'),

    ttsCacheHit: () =>
      log('debug', 'audio', 'tts_cache_hit'),
  },

  // ==========================================================================
  // Performance events
  // ==========================================================================
  performance: {
    appLoaded: (loadTimeMs: number) =>
      log('info', 'performance', 'app_loaded', { loadTimeMs }),

    sceneRendered: (fps: number) =>
      log('debug', 'performance', 'scene_rendered', { fps }),

    apiLatency: (endpoint: string, latencyMs: number) =>
      log('debug', 'performance', 'api_latency', { endpoint, latencyMs }),
  },

  // ==========================================================================
  // Error tracking
  // ==========================================================================
  trackError: (error: Error, context?: string) => {
    log('error', 'error', 'unhandled_error', {
      message: error.message,
      stack: error.stack?.slice(0, 500),
      context,
    });
  },
};

// Global error handler
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    logger.trackError(event.error, 'window_error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    logger.error('error', 'unhandled_promise_rejection', {
      reason: String(event.reason).slice(0, 500),
    });
  });
}

// Log app start
logger.info('game', 'app_session_started', {
  userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
  url: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
  isDev,
});

// Make logger available globally for debugging in console
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).homeworkGoatLogger = logger;
}

export default logger;
