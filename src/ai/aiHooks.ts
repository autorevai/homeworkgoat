/**
 * AI Integration Hooks
 * 
 * These are placeholder functions that currently return static content.
 * They are designed to be easily replaced with AI API calls in the future.
 * 
 * Future integration:
 * - Replace the static returns with fetch() calls to your AI API endpoints
 * - The interfaces will remain the same, making integration seamless
 */

import type { Question, LearningStats, QuestionSkill } from '../learning/types';

/**
 * Get a hint for a specific question
 * 
 * Future: This could call Claude/GPT to generate a personalized hint
 * based on the student's previous attempts and learning history.
 * 
 * @param question - The question the student is struggling with
 * @param attemptCount - How many times they've tried (for future AI context)
 * @returns A hint string
 */
export function getHintForQuestion(question: Question, _attemptCount: number = 1): string {
  // Currently returns the pre-written hint from the question
  // Future: Call AI API for personalized hints
  return question.hint;
}

/**
 * Generate a session recap summarizing the student's performance
 * 
 * Future: This could call Claude/GPT to generate encouraging,
 * personalized feedback about the session.
 * 
 * @param stats - The learning statistics from the session
 * @param questsCompleted - Number of quests completed this session
 * @param xpEarned - Total XP earned this session
 * @returns A recap message
 */
export function getSessionRecap(
  stats: LearningStats,
  questsCompleted: number,
  xpEarned: number
): string {
  // Calculate accuracy
  const accuracy = stats.totalQuestionsAnswered > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestionsAnswered) * 100)
    : 0;

  // Find strongest and weakest skills
  let strongestSkill: QuestionSkill | null = null;
  let weakestSkill: QuestionSkill | null = null;
  let highestAccuracy = -1;
  let lowestAccuracy = 101;

  const skills: QuestionSkill[] = ['addition', 'subtraction', 'multiplication', 'division', 'wordProblem'];
  
  for (const skill of skills) {
    const progress = stats.skillProgress[skill];
    if (progress.total > 0) {
      const skillAccuracy = (progress.correct / progress.total) * 100;
      if (skillAccuracy > highestAccuracy) {
        highestAccuracy = skillAccuracy;
        strongestSkill = skill;
      }
      if (skillAccuracy < lowestAccuracy) {
        lowestAccuracy = skillAccuracy;
        weakestSkill = skill;
      }
    }
  }

  const skillNames: Record<QuestionSkill, string> = {
    addition: 'Addition',
    subtraction: 'Subtraction',
    multiplication: 'Multiplication',
    division: 'Division',
    wordProblem: 'Word Problems',
  };

  // Build static recap message
  let recap = `🎮 Session Complete!\n\n`;
  recap += `📊 You answered ${stats.totalQuestionsAnswered} questions with ${accuracy}% accuracy!\n`;
  recap += `✅ Correct: ${stats.totalCorrect} | ❌ Incorrect: ${stats.totalIncorrect}\n\n`;

  if (questsCompleted > 0) {
    recap += `🏆 Quests Completed: ${questsCompleted}\n`;
    recap += `⭐ XP Earned: ${xpEarned}\n\n`;
  }

  if (strongestSkill && highestAccuracy >= 80) {
    recap += `💪 Great job with ${skillNames[strongestSkill]}!\n`;
  }

  if (weakestSkill && lowestAccuracy < 70 && weakestSkill !== strongestSkill) {
    recap += `📚 Keep practicing ${skillNames[weakestSkill]} - you're getting better!\n`;
  }

  recap += `\nKeep up the great work, Math Hero! 🦸‍♂️`;

  return recap;
}

/**
 * Generate an encouraging message after answering correctly
 * 
 * Future: This could provide personalized encouragement based on
 * the student's streak, improvement, or specific achievements.
 * 
 * @param streakCount - Current correct answer streak
 * @returns An encouragement message
 */
export function getEncouragementMessage(streakCount: number): string {
  const messages = [
    "Excellent work! 🌟",
    "You're on fire! 🔥",
    "Math superstar! ⭐",
    "Brilliant! 💫",
    "You've got this! 💪",
    "Amazing job! 🎉",
    "Keep it up! 🚀",
    "Fantastic! 🌈",
  ];

  if (streakCount >= 5) {
    return `🔥 ${streakCount} in a row! You're unstoppable! 🔥`;
  } else if (streakCount >= 3) {
    return `⭐ ${streakCount} correct in a row! Amazing! ⭐`;
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate a message after an incorrect answer
 * 
 * Future: This could provide personalized guidance based on
 * the specific mistake pattern detected.
 * 
 * @returns A supportive message
 */
export function getMistakeMessage(): string {
  const messages = [
    "Not quite, but don't give up! 💪",
    "Good try! Check the hint for help. 🤔",
    "Almost there! Give it another shot. 🎯",
    "Learning happens through mistakes! Try again. 📚",
    "You're doing great! This one's tricky. 🧩",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
