/**
 * Expanded Question Bank
 * Contains 80+ math questions for 3rd-grade skills with varying difficulty.
 * 
 * Skills covered:
 * - Addition (20 questions)
 * - Subtraction (15 questions)
 * - Multiplication (20 questions)
 * - Division (15 questions)
 * - Word Problems (15 questions)
 */

import type { Question } from './types';

export const questionBank: Question[] = [
  // =====================================================
  // ADDITION QUESTIONS (20)
  // =====================================================
  
  // Easy Addition
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
    prompt: 'What is 175 + 125?',
    choices: [200, 290, 300, 310],
    correctIndex: 2,
    skill: 'addition',
    difficulty: 'easy',
    hint: '175 + 125 is the same as 175 + 100 + 25. Can you solve it step by step?',
  },
  {
    id: 'add-003',
    prompt: 'What is 50 + 75?',
    choices: [115, 125, 135, 145],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'easy',
    hint: '50 + 50 = 100, so 50 + 75 is 25 more than 100!',
  },
  {
    id: 'add-004',
    prompt: 'What is 234 + 111?',
    choices: [335, 345, 355, 445],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'easy',
    hint: 'Add each column: 4+1, 3+1, 2+1. Easy pattern!',
  },
  {
    id: 'add-005',
    prompt: 'What is 99 + 99?',
    choices: [188, 198, 189, 199],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'easy',
    hint: '99 + 99 is the same as 100 + 100 - 2!',
  },
  {
    id: 'add-006',
    prompt: 'What is 150 + 250?',
    choices: [300, 350, 400, 450],
    correctIndex: 2,
    skill: 'addition',
    difficulty: 'easy',
    hint: '150 + 250 = 150 + 250. Think of it as 15 + 25 = 40, then add the zero!',
  },
  {
    id: 'add-007',
    prompt: 'What is 88 + 12?',
    choices: [90, 100, 110, 98],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'easy',
    hint: '88 needs 12 more to make 100. Perfect pair!',
  },

  // Medium Addition
  {
    id: 'add-008',
    prompt: 'What is 389 + 245?',
    choices: [534, 624, 634, 644],
    correctIndex: 2,
    skill: 'addition',
    difficulty: 'medium',
    hint: 'Remember to carry over when digits add up to more than 9!',
  },
  {
    id: 'add-009',
    prompt: 'What is 512 + 298?',
    choices: [800, 810, 710, 820],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: '298 is close to 300. Try adding 512 + 300 first, then subtract 2!',
  },
  {
    id: 'add-010',
    prompt: 'What is 456 + 367?',
    choices: [813, 823, 833, 723],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: 'Start from the ones: 6+7=13, carry the 1!',
  },
  {
    id: 'add-011',
    prompt: 'What is 678 + 199?',
    choices: [877, 867, 887, 777],
    correctIndex: 0,
    skill: 'addition',
    difficulty: 'medium',
    hint: '199 is almost 200. Add 200, then subtract 1!',
  },
  {
    id: 'add-012',
    prompt: 'What is 445 + 278?',
    choices: [713, 723, 733, 623],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: 'Break it up: 445 + 278 = 445 + 200 + 78',
  },
  {
    id: 'add-013',
    prompt: 'What is 357 + 486?',
    choices: [843, 833, 853, 743],
    correctIndex: 0,
    skill: 'addition',
    difficulty: 'medium',
    hint: 'Careful with carrying! 7+6=13, 5+8+1=14, 3+4+1=8',
  },
  {
    id: 'add-014',
    prompt: 'What is 599 + 234?',
    choices: [823, 833, 843, 733],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: '599 + 1 = 600. So add 600 + 234, then subtract 1!',
  },
  {
    id: 'add-015',
    prompt: 'What is 276 + 549?',
    choices: [815, 825, 835, 725],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: 'Add the hundreds first: 200 + 500 = 700. Then add the rest!',
  },
  {
    id: 'add-016',
    prompt: 'What is 183 + 467?',
    choices: [640, 650, 660, 550],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: '183 + 467 = 180 + 470 = 650. Rounding helps!',
  },
  {
    id: 'add-017',
    prompt: 'What is 294 + 318?',
    choices: [602, 612, 622, 512],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: '294 is close to 300. Add 300 + 318 = 618, then subtract 6!',
  },
  {
    id: 'add-018',
    prompt: 'What is 425 + 399?',
    choices: [814, 824, 834, 724],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: '399 is almost 400! Add 400 to 425, then subtract 1.',
  },
  {
    id: 'add-019',
    prompt: 'What is 567 + 258?',
    choices: [815, 825, 835, 725],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: 'Work through each column carefully with carrying!',
  },
  {
    id: 'add-020',
    prompt: 'What is 648 + 275?',
    choices: [913, 923, 933, 823],
    correctIndex: 1,
    skill: 'addition',
    difficulty: 'medium',
    hint: '648 + 275 = 648 + 300 - 25 = 948 - 25 = 923',
  },

  // =====================================================
  // SUBTRACTION QUESTIONS (15)
  // =====================================================

  // Easy Subtraction
  {
    id: 'sub-001',
    prompt: 'What is 400 - 125?',
    choices: [285, 275, 265, 375],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'easy',
    hint: 'Think of 400 as 3 hundreds + 9 tens + 10 ones to help you borrow.',
  },
  {
    id: 'sub-002',
    prompt: 'What is 725 - 250?',
    choices: [475, 485, 465, 575],
    correctIndex: 0,
    skill: 'subtraction',
    difficulty: 'easy',
    hint: '250 is the same as 200 + 50. Subtract 200 first, then subtract 50!',
  },
  {
    id: 'sub-003',
    prompt: 'What is 100 - 37?',
    choices: [73, 63, 53, 67],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'easy',
    hint: 'Count up from 37 to 100: 37 + 3 = 40, 40 + 60 = 100. So 3 + 60 = 63!',
  },
  {
    id: 'sub-004',
    prompt: 'What is 250 - 75?',
    choices: [165, 175, 185, 195],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'easy',
    hint: '250 - 50 = 200, then 200 - 25 = 175',
  },
  {
    id: 'sub-005',
    prompt: 'What is 90 - 45?',
    choices: [35, 45, 55, 40],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'easy',
    hint: '45 + 45 = 90, so 90 - 45 = 45. It splits in half!',
  },
  {
    id: 'sub-006',
    prompt: 'What is 300 - 156?',
    choices: [134, 144, 154, 164],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'easy',
    hint: 'Count up: 156 + 44 = 200, 200 + 100 = 300. So 44 + 100 = 144!',
  },

  // Medium Subtraction
  {
    id: 'sub-007',
    prompt: 'What is 500 - 237?',
    choices: [263, 273, 363, 253],
    correctIndex: 0,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'Try counting up from 237 to 500. How many do you need to add?',
  },
  {
    id: 'sub-008',
    prompt: 'What is 842 - 156?',
    choices: [686, 696, 676, 786],
    correctIndex: 0,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'Work from right to left. You may need to borrow from the next column!',
  },
  {
    id: 'sub-009',
    prompt: 'What is 613 - 278?',
    choices: [325, 335, 345, 435],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'You\'ll need to borrow twice! Take it step by step.',
  },
  {
    id: 'sub-010',
    prompt: 'What is 700 - 348?',
    choices: [342, 352, 362, 452],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: '700 - 348 = 700 - 350 + 2 = 350 + 2 = 352',
  },
  {
    id: 'sub-011',
    prompt: 'What is 925 - 467?',
    choices: [448, 458, 468, 558],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'Start with the ones: 5-7 needs borrowing! 15-7=8',
  },
  {
    id: 'sub-012',
    prompt: 'What is 1000 - 463?',
    choices: [527, 537, 547, 637],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'Think: 463 + ? = 1000. Add up from 463!',
  },
  {
    id: 'sub-013',
    prompt: 'What is 804 - 356?',
    choices: [438, 448, 458, 548],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'The zero in the middle makes borrowing tricky. Borrow from 8!',
  },
  {
    id: 'sub-014',
    prompt: 'What is 672 - 295?',
    choices: [367, 377, 387, 477],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: '295 is close to 300. Subtract 300, then add back 5!',
  },
  {
    id: 'sub-015',
    prompt: 'What is 531 - 184?',
    choices: [337, 347, 357, 447],
    correctIndex: 1,
    skill: 'subtraction',
    difficulty: 'medium',
    hint: 'Check each column carefully. 1-4 needs borrowing!',
  },

  // =====================================================
  // MULTIPLICATION QUESTIONS (20)
  // =====================================================

  // Easy Multiplication (Single digit × Single digit)
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
    prompt: 'What is 6 × 7?',
    choices: [48, 42, 36, 49],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: 'Think of 6 × 7 as (6 × 5) + (6 × 2). That\'s 30 + 12!',
  },
  {
    id: 'mult-004',
    prompt: 'What is 4 × 9?',
    choices: [32, 36, 40, 45],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: '4 × 9 = 4 × 10 - 4 = 40 - 4 = 36',
  },
  {
    id: 'mult-005',
    prompt: 'What is 5 × 8?',
    choices: [35, 40, 45, 48],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: 'Count by 5s eight times, or count by 8s five times!',
  },
  {
    id: 'mult-006',
    prompt: 'What is 3 × 9?',
    choices: [24, 27, 30, 21],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: '3 × 9 = 3 × 10 - 3 = 30 - 3 = 27',
  },
  {
    id: 'mult-007',
    prompt: 'What is 8 × 8?',
    choices: [56, 64, 72, 48],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: '8 × 8 is a perfect square! Think of an 8×8 checkerboard.',
  },
  {
    id: 'mult-008',
    prompt: 'What is 7 × 6?',
    choices: [36, 42, 48, 35],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: '7 × 6 = 6 × 7. Either way, it\'s 42!',
  },
  {
    id: 'mult-009',
    prompt: 'What is 9 × 9?',
    choices: [72, 81, 90, 63],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: '9 × 9 is almost 10 × 9. It\'s 90 - 9 = 81!',
  },
  {
    id: 'mult-010',
    prompt: 'What is 6 × 8?',
    choices: [42, 48, 54, 56],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'easy',
    hint: '6 × 8 = (6 × 4) × 2 = 24 × 2 = 48',
  },

  // Medium Multiplication (With tens)
  {
    id: 'mult-011',
    prompt: 'What is 8 × 9?',
    choices: [72, 63, 81, 64],
    correctIndex: 0,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '8 × 9 is the same as 9 × 8. Use the trick: (10 × 8) - 8!',
  },
  {
    id: 'mult-012',
    prompt: 'What is 12 × 5?',
    choices: [50, 55, 60, 65],
    correctIndex: 2,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '12 × 5 = (10 × 5) + (2 × 5) = 50 + 10 = 60',
  },
  {
    id: 'mult-013',
    prompt: 'What is 11 × 7?',
    choices: [70, 77, 84, 66],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '11 × 7 = (10 × 7) + (1 × 7) = 70 + 7 = 77',
  },
  {
    id: 'mult-014',
    prompt: 'What is 15 × 4?',
    choices: [50, 55, 60, 65],
    correctIndex: 2,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '15 × 4 = (15 × 2) × 2 = 30 × 2 = 60',
  },
  {
    id: 'mult-015',
    prompt: 'What is 9 × 12?',
    choices: [98, 108, 118, 99],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '9 × 12 = (9 × 10) + (9 × 2) = 90 + 18 = 108',
  },
  {
    id: 'mult-016',
    prompt: 'What is 7 × 11?',
    choices: [66, 77, 88, 70],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: 'When multiplying by 11, the answer often has a pattern! 7 × 11 = 77',
  },
  {
    id: 'mult-017',
    prompt: 'What is 8 × 12?',
    choices: [86, 96, 106, 88],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '8 × 12 = 8 × 10 + 8 × 2 = 80 + 16 = 96',
  },
  {
    id: 'mult-018',
    prompt: 'What is 6 × 15?',
    choices: [80, 90, 100, 85],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '6 × 15 = 6 × 10 + 6 × 5 = 60 + 30 = 90',
  },
  {
    id: 'mult-019',
    prompt: 'What is 25 × 4?',
    choices: [90, 100, 110, 80],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '25 × 4 = 100. Four quarters make a dollar!',
  },
  {
    id: 'mult-020',
    prompt: 'What is 50 × 3?',
    choices: [140, 150, 160, 130],
    correctIndex: 1,
    skill: 'multiplication',
    difficulty: 'medium',
    hint: '50 × 3 = 50 + 50 + 50 = 150',
  },

  // =====================================================
  // DIVISION QUESTIONS (15)
  // =====================================================

  // Easy Division
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
    prompt: 'What is 45 ÷ 5?',
    choices: [7, 8, 9, 10],
    correctIndex: 2,
    skill: 'division',
    difficulty: 'easy',
    hint: 'Count by 5s: 5, 10, 15, 20, 25, 30, 35, 40, 45. That\'s 9 fives!',
  },
  {
    id: 'div-005',
    prompt: 'What is 36 ÷ 6?',
    choices: [5, 6, 7, 8],
    correctIndex: 1,
    skill: 'division',
    difficulty: 'easy',
    hint: '6 × 6 = 36, so 36 ÷ 6 = 6!',
  },
  {
    id: 'div-006',
    prompt: 'What is 48 ÷ 8?',
    choices: [5, 6, 7, 8],
    correctIndex: 1,
    skill: 'division',
    difficulty: 'easy',
    hint: '8 × 6 = 48. Division undoes multiplication!',
  },
  {
    id: 'div-007',
    prompt: 'What is 32 ÷ 4?',
    choices: [6, 7, 8, 9],
    correctIndex: 2,
    skill: 'division',
    difficulty: 'easy',
    hint: 'How many groups of 4 make 32? Count by 4s!',
  },

  // Medium Division
  {
    id: 'div-008',
    prompt: 'What is 81 ÷ 9?',
    choices: [8, 9, 7, 10],
    correctIndex: 1,
    skill: 'division',
    difficulty: 'medium',
    hint: '81 is a special number - it\'s 9 × 9!',
  },
  {
    id: 'div-009',
    prompt: 'What is 96 ÷ 8?',
    choices: [10, 11, 12, 13],
    correctIndex: 2,
    skill: 'division',
    difficulty: 'medium',
    hint: '8 × 12 = 96. Think: 8 × 10 = 80, need 16 more, 8 × 2 = 16',
  },
  {
    id: 'div-010',
    prompt: 'What is 84 ÷ 7?',
    choices: [11, 12, 13, 14],
    correctIndex: 1,
    skill: 'division',
    difficulty: 'medium',
    hint: '7 × 12 = 84. Or think: 7 × 10 = 70, 84 - 70 = 14, 14 ÷ 7 = 2, so 10 + 2 = 12',
  },
  {
    id: 'div-011',
    prompt: 'What is 108 ÷ 9?',
    choices: [10, 11, 12, 13],
    correctIndex: 2,
    skill: 'division',
    difficulty: 'medium',
    hint: '9 × 12 = 108. Use: 9 × 10 = 90, 9 × 2 = 18, 90 + 18 = 108',
  },
  {
    id: 'div-012',
    prompt: 'What is 100 ÷ 4?',
    choices: [20, 25, 30, 24],
    correctIndex: 1,
    skill: 'division',
    difficulty: 'medium',
    hint: 'How many quarters in a dollar? 4 × 25 = 100!',
  },
  {
    id: 'div-013',
    prompt: 'What is 144 ÷ 12?',
    choices: [10, 11, 12, 13],
    correctIndex: 2,
    skill: 'division',
    difficulty: 'medium',
    hint: '12 × 12 = 144. It\'s a perfect square!',
  },
  {
    id: 'div-014',
    prompt: 'What is 75 ÷ 5?',
    choices: [13, 14, 15, 16],
    correctIndex: 2,
    skill: 'division',
    difficulty: 'medium',
    hint: '5 × 15 = 75. Count by 5s: 5, 10, 15... keep going to 75!',
  },
  {
    id: 'div-015',
    prompt: 'What is 64 ÷ 8?',
    choices: [6, 7, 8, 9],
    correctIndex: 2,
    skill: 'division',
    difficulty: 'medium',
    hint: '8 × 8 = 64. Another perfect square!',
  },

  // =====================================================
  // WORD PROBLEMS (15)
  // =====================================================

  // Easy Word Problems
  {
    id: 'word-001',
    prompt: 'A bookshelf has 8 shelves. Each shelf holds 7 books. How many books total?',
    choices: [54, 56, 15, 49],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'easy',
    hint: 'When you have equal groups, multiply! 8 shelves × 7 books each.',
  },
  {
    id: 'word-002',
    prompt: '48 students need to split into 6 equal teams. How many students per team?',
    choices: [7, 9, 8, 6],
    correctIndex: 2,
    skill: 'wordProblem',
    difficulty: 'easy',
    hint: 'Splitting into equal groups means division! Divide 48 by 6.',
  },
  {
    id: 'word-003',
    prompt: 'Mia has 125 stickers. She gives away 48. How many does she have left?',
    choices: [67, 77, 87, 97],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'easy',
    hint: '"Gives away" means subtract. 125 - 48 = ?',
  },
  {
    id: 'word-004',
    prompt: 'There are 9 rows of desks with 6 desks in each row. How many desks in total?',
    choices: [45, 54, 63, 48],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'easy',
    hint: 'Rows and items per row = multiplication! 9 × 6 = ?',
  },
  {
    id: 'word-005',
    prompt: 'Jake collected 234 coins. His sister collected 189. How many coins together?',
    choices: [413, 423, 433, 323],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'easy',
    hint: '"Together" means add! 234 + 189 = ?',
  },

  // Medium Word Problems
  {
    id: 'word-006',
    prompt: 'Sam has 345 stickers. He gets 178 more. How many stickers does Sam have now?',
    choices: [523, 513, 533, 423],
    correctIndex: 0,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: '"Gets more" means you need to add! Add 345 + 178.',
  },
  {
    id: 'word-007',
    prompt: 'Maya had 500 coins. She spent 235 coins. How many coins does she have left?',
    choices: [275, 265, 365, 255],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: '"Spent" means she used some coins. Subtract 235 from 500!',
  },
  {
    id: 'word-008',
    prompt: 'A bakery makes 12 muffins per batch. They made 8 batches. How many muffins?',
    choices: [86, 96, 106, 88],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: 'Batches × muffins per batch = total muffins. 12 × 8 = ?',
  },
  {
    id: 'word-009',
    prompt: '72 candies are shared equally among 9 friends. How many does each friend get?',
    choices: [6, 7, 8, 9],
    correctIndex: 2,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: '"Shared equally" means divide! 72 ÷ 9 = ?',
  },
  {
    id: 'word-010',
    prompt: 'A train has 7 cars. Each car seats 45 people. How many people can ride?',
    choices: [305, 315, 325, 295],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: '7 × 45 = 7 × 40 + 7 × 5 = 280 + 35 = 315',
  },
  {
    id: 'word-011',
    prompt: 'Emma read 45 pages on Monday and 67 on Tuesday. How many pages total?',
    choices: [102, 112, 122, 132],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: 'Add the pages from both days! 45 + 67 = ?',
  },
  {
    id: 'word-012',
    prompt: 'A pizza has 8 slices. How many slices in 11 pizzas?',
    choices: [78, 88, 98, 108],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: '11 × 8 = 10 × 8 + 1 × 8 = 80 + 8 = 88',
  },
  {
    id: 'word-013',
    prompt: 'A farmer has 156 apples. He packs them into boxes of 12. How many boxes?',
    choices: [11, 12, 13, 14],
    correctIndex: 2,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: 'Packing into equal groups = division. 156 ÷ 12 = ?',
  },
  {
    id: 'word-014',
    prompt: 'A library has 847 books. 392 are checked out. How many are still there?',
    choices: [445, 455, 465, 555],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: 'Books "checked out" are gone. Subtract! 847 - 392 = ?',
  },
  {
    id: 'word-015',
    prompt: 'There are 25 students. Each needs 4 pencils. How many pencils needed?',
    choices: [90, 100, 110, 80],
    correctIndex: 1,
    skill: 'wordProblem',
    difficulty: 'medium',
    hint: '25 × 4 = 100. Four quarters = one dollar, 25 × 4 = 100!',
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

/**
 * Get questions by difficulty
 */
export function getQuestionsByDifficulty(difficulty: Question['difficulty']): Question[] {
  return questionBank.filter((q) => q.difficulty === difficulty);
}

/**
 * Get random questions for a skill
 */
export function getRandomQuestionsForSkill(
  skill: Question['skill'],
  count: number,
  excludeIds: string[] = []
): Question[] {
  const available = questionBank.filter(
    (q) => q.skill === skill && !excludeIds.includes(q.id)
  );
  
  // Shuffle and take count
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
