/**
 * AI Hooks
 * Helper functions for generating hints, encouragement, and feedback messages.
 */

import type { Question } from '../learning/types';

/**
 * Generate a hint for the current question
 */
export function getHintForQuestion(question: Question, _level: number): string {
  // Use the question's built-in hint if available
  if (question.hint) {
    return question.hint;
  }

  // Generate a generic hint based on skill
  switch (question.skill) {
    case 'addition':
      return 'Try breaking the numbers into smaller parts to add them together.';
    case 'subtraction':
      return 'Think about counting down or finding the difference between numbers.';
    case 'multiplication':
      return 'Remember, multiplication is like adding the same number multiple times.';
    case 'division':
      return 'Division is splitting a number into equal groups. How many groups can you make?';
    case 'wordProblem':
      return 'Read the problem carefully and identify what operation you need to use.';
    default:
      return 'Take your time and think through each step carefully.';
  }
}

/**
 * Get an encouragement message for correct answers
 */
export function getEncouragementMessage(streak: number): string {
  const messages: string[] = [
    'Great job!',
    'Excellent work!',
    'You got it!',
    'Perfect!',
    'Well done!',
    'Amazing!',
    'Fantastic!',
    'Keep it up!',
    'You\'re on fire!',
    'Brilliant!',
  ];

  // Bonus messages for streaks
  if (streak >= 5) {
    return `Incredible! ${streak} in a row! 🔥`;
  }
  if (streak >= 3) {
    return `${streak} streak! You're doing amazing! ⭐`;
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Get a message for incorrect answers
 */
export function getMistakeMessage(): string {
  const messages: string[] = [
    'Not quite, but keep trying!',
    'Almost there! Let\'s see the correct answer.',
    'Good effort! Learning from mistakes makes us stronger.',
    'That\'s okay! Every mistake is a chance to learn.',
    'Don\'t give up! You\'ll get the next one.',
    'Nice try! Let\'s see how to solve this one.',
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}
