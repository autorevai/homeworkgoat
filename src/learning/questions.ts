/**
 * Question Bank
 * Contains all math questions for the game, focused on 3rd-grade skills.
 */

import type { Question } from './types';

export const questionBank: Question[] = [
  // Addition questions
  {
    id: 'add-001',
    prompt: 'What is 247 + 156?',
    choices: [403, 393, 413, 303],
    correctIndex: 0,
    skill: 'addition',
    difficulty: 'easy',
    hint: 'Try adding the ones first (7+6), then the tens (40+50), then the hundreds (200+100)!',
  },
  {
    id: 'add-002',
    prompt: 'What is 389 + 245?',
    choices: [534, 624, 634, 644],
    correctIndex: 2,
    skill: 'addition',
    difficulty: 'medium',
    hint: 'Remember to carry over when digits add up to more than 9!',
  },
  {
    id: 'add-003',
    prompt: 'What is 512 + 298?',
    choices: [800, 810, 710, 820],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: '298 is close to 300. Try adding 512 + 300 first, then subtract 2!',
  },
  {
    id: 'add-004',
    prompt: 'What is 175 + 125?',
    choices: [200, 290, 300, 310],
    correctIndex: 2,
    skill: 'addition',
    difficulty: 'easy',
    hint: '175 + 125 is the same as 175 + 100 + 25. Can you solve it step by step?',
  },

  // Subtraction questions
  {
    id: 'sub-001',
    prompt: 'What is 500 - 237?',
    choices: [263, 273, 363, 253],
    correctIndex: 0,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'Try counting up from 237 to 500. How many do you need to add?',
  },
  {
    id: 'sub-002',
    prompt: 'What is 842 - 156?',
    choices: [686, 696, 676, 786],
    correctIndex: 0,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'Work from right to left. You may need to borrow from the next column!',
  },
  {
    id: 'sub-003',
    prompt: 'What is 400 - 125?',
    choices: [285, 275, 265, 375],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'easy',
    hint: 'Think of 400 as 3 hundreds + 9 tens + 10 ones to help you borrow.',
  },
  {
    id: 'sub-004',
    prompt: 'What is 725 - 250?',
    choices: [475, 485, 465, 575],
    correctIndex: 0,
    skill: 'subtraction',
    difficulty: 'easy',
    hint: '250 is the same as 200 + 50. Subtract 200 first, then subtract 50!',
  },

  // Multiplication questions
  {
    id: 'mult-001',
    prompt: 'What is 7 × 8?',
    choices: [54, 56, 58, 48],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: 'Try skip counting by 7s: 7, 14, 21, 28, 35, 42, 49, 56!',
  },
  {
    id: 'mult-002',
    prompt: 'What is 9 × 6?',
    choices: [56, 52, 54, 64],
    correctIndex: 2,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: '9 × 6 is the same as (10 × 6) - 6. Can you figure it out?',
  },
  {
    id: 'mult-003',
    prompt: 'What is 8 × 9?',
    choices: [72, 63, 81, 64],
    correctIndex: 0,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '8 × 9 is the same as 9 × 8. Use the trick: (10 × 8) - 8!',
  },
  {
    id: 'mult-004',
    prompt: 'What is 6 × 7?',
    choices: [48, 42, 36, 49],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: 'Think of 6 × 7 as (6 × 5) + (6 × 2). That\'s 30 + 12!',
  },

  // Division questions
  {
    id: 'div-001',
    prompt: 'What is 56 ÷ 8?',
    choices: [6, 7, 8, 9],
    correctIndex: 1,
    skill: 'division',
    difficulty: 'easy',
    hint: 'Think: What number times 8 equals 56?',
  },
  {
    id: 'div-002',
    prompt: 'What is 72 ÷ 9?',
    choices: [7, 8, 9, 6],
    correctIndex: 1,
    skill: 'division',
    difficulty: 'easy',
    hint: 'Division is the opposite of multiplication. 9 times what equals 72?',
  },
  {
    id: 'div-003',
    prompt: 'What is 63 ÷ 7?',
    choices: [8, 7, 9, 6],
    correctIndex: 2,
    skill: 'division',
    difficulty: 'easy',
    hint: 'Count by 7s until you reach 63: 7, 14, 21, 28, 35, 42, 49, 56, 63!',
  },
  {
    id: 'div-004',
    prompt: 'What is 81 ÷ 9?',
    choices: [8, 9, 7, 10],
    correctIndex: 1,
    skill: 'division',
    difficulty: 'medium',
    hint: '81 is a special number - it\'s 9 × 9!',
  },

  // Word problems
  {
    id: 'word-001',
    prompt: 'Sam has 345 stickers. He gets 178 more. How many stickers does Sam have now?',
    choices: [523, 513, 533, 423],
    correctIndex: 0,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: '"Gets more" means you need to add! Add 345 + 178.',
  },
  {
    id: 'word-002',
    prompt: 'A bookshelf has 8 shelves. Each shelf holds 7 books. How many books total?',
    choices: [54, 56, 15, 49],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'easy',
    hint: 'When you have equal groups, multiply! 8 shelves × 7 books each.',
  },
  {
    id: 'word-003',
    prompt: 'Maya had 500 coins. She spent 235 coins. How many coins does she have left?',
    choices: [275, 265, 365, 255],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: '"Spent" means she used some coins. Subtract 235 from 500!',
  },
  {
    id: 'word-004',
    prompt: '48 students need to split into 6 equal teams. How many students per team?',
    choices: [7, 9, 8, 6],
    correctIndex: 2,
    skill: 'wordProblem',
    difficulty: 'easy',
    hint: 'Splitting into equal groups means division! Divide 48 by 6.',
  },
];

/**
 * Get a question by its ID
 */
export function getQuestionById(id: string): Question | undefined {
  return questionBank.find((q) => q.id === id);
}

/**
 * Get multiple questions by their IDs
 */
export function getQuestionsByIds(ids: string[]): Question[] {
  return ids
    .map((id) => getQuestionById(id))
    .filter((q): q is Question => q !== undefined);
}

/**
 * Get questions by skill type
 */
export function getQuestionsBySkill(skill: Question['skill']): Question[] {
  return questionBank.filter((q) => q.skill === skill);
}
