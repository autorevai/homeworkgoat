/**
 * Procedural Question Generator
 * 
 * Generates unlimited questions dynamically so we never run out!
 * This is how Prodigy does it - they don't have a fixed question bank.
 * 
 * Grade Level: 3rd Grade (adjustable)
 * - Addition: up to 1,000
 * - Subtraction: up to 1,000 with regrouping
 * - Multiplication: 0-12 tables
 * - Division: 0-12 tables
 * - Word Problems: Real-world contexts
 */

import type { Question, QuestionSkill, Difficulty } from './types';

// Helper to shuffle array
function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate wrong answers that are plausible (not obviously wrong)
function generateWrongAnswers(correct: number, count: number = 3): number[] {
  const wrong: Set<number> = new Set();
  
  // Common mistake patterns
  const offsets = [1, -1, 10, -10, 2, -2, 5, -5, 11, -11, 9, -9];
  
  // Add some offset-based wrong answers
  for (const offset of shuffle(offsets)) {
    if (wrong.size >= count) break;
    const val = correct + offset;
    if (val > 0 && val !== correct) {
      wrong.add(val);
    }
  }
  
  // Fill remaining with random close values
  while (wrong.size < count) {
    const offset = Math.floor(Math.random() * 20) - 10;
    const val = correct + offset;
    if (val > 0 && val !== correct) {
      wrong.add(val);
    }
  }
  
  return Array.from(wrong).slice(0, count);
}

// =====================================================
// ADDITION GENERATORS
// =====================================================

export function generateAdditionQuestion(difficulty: Difficulty): Question {
  let a: number, b: number, hint: string;
  
  if (difficulty === 'easy') {
    // Easy: Two 2-digit numbers, no carrying or simple carrying
    a = Math.floor(Math.random() * 50) + 10; // 10-59
    b = Math.floor(Math.random() * 50) + 10; // 10-59
    hint = `Try adding the ones first (${a % 10} + ${b % 10}), then add the tens!`;
  } else {
    // Medium: Three-digit numbers with carrying
    a = Math.floor(Math.random() * 500) + 100; // 100-599
    b = Math.floor(Math.random() * 400) + 100; // 100-499
    hint = `Break it down: ${a} + ${Math.round(b / 100) * 100} = ${a + Math.round(b / 100) * 100}, then add the rest!`;
  }
  
  const correct = a + b;
  const wrong = generateWrongAnswers(correct);
  const choices = shuffle([correct, ...wrong]);
  
  return {
    id: `gen-add-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt: `What is ${a} + ${b}?`,
    choices,
    correctIndex: choices.indexOf(correct),
    skill: 'addition',
    difficulty,
    hint,
  };
}

// =====================================================
// SUBTRACTION GENERATORS
// =====================================================

export function generateSubtractionQuestion(difficulty: Difficulty): Question {
  let a: number, b: number, hint: string;
  
  if (difficulty === 'easy') {
    // Easy: Result is positive, minimal borrowing
    a = Math.floor(Math.random() * 50) + 50; // 50-99
    b = Math.floor(Math.random() * 30) + 10; // 10-39
    hint = `Count up from ${b} to ${a}. How many steps?`;
  } else {
    // Medium: Three-digit with borrowing
    a = Math.floor(Math.random() * 500) + 300; // 300-799
    b = Math.floor(Math.random() * 250) + 100; // 100-349
    hint = `${a} - ${Math.round(b / 100) * 100} = ${a - Math.round(b / 100) * 100}, then subtract the rest!`;
  }
  
  // Ensure a > b
  if (b >= a) {
    [a, b] = [a + 100, b];
  }
  
  const correct = a - b;
  const wrong = generateWrongAnswers(correct);
  const choices = shuffle([correct, ...wrong]);
  
  return {
    id: `gen-sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt: `What is ${a} - ${b}?`,
    choices,
    correctIndex: choices.indexOf(correct),
    skill: 'subtraction',
    difficulty,
    hint,
  };
}

// =====================================================
// MULTIPLICATION GENERATORS
// =====================================================

export function generateMultiplicationQuestion(difficulty: Difficulty): Question {
  let a: number, b: number, hint: string;
  
  if (difficulty === 'easy') {
    // Easy: Single digits, focus on common facts
    const easyPairs = [
      [2, 3], [2, 4], [2, 5], [3, 3], [3, 4], [4, 4], [5, 5],
      [2, 6], [3, 5], [4, 5], [2, 7], [3, 6], [5, 6],
    ];
    [a, b] = easyPairs[Math.floor(Math.random() * easyPairs.length)];
    hint = `Skip count by ${a}: ${Array.from({length: b}, (_, i) => a * (i + 1)).join(', ')}`;
  } else {
    // Medium: Harder facts including 7, 8, 9, 11, 12
    a = Math.floor(Math.random() * 6) + 6; // 6-11
    b = Math.floor(Math.random() * 6) + 6; // 6-11
    hint = `${a} × ${b} = (${a} × ${Math.floor(b / 2) * 2}) + (${a} × ${b % 2 === 0 ? 0 : 1}) if that helps!`;
    
    // Better hints for specific facts
    if (a === 9 || b === 9) {
      const other = a === 9 ? b : a;
      hint = `9 × ${other} = 10 × ${other} - ${other} = ${10 * other} - ${other}`;
    }
  }
  
  const correct = a * b;
  const wrong = generateWrongAnswers(correct);
  const choices = shuffle([correct, ...wrong]);
  
  return {
    id: `gen-mult-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt: `What is ${a} × ${b}?`,
    choices,
    correctIndex: choices.indexOf(correct),
    skill: 'multiplication',
    difficulty,
    hint,
  };
}

// =====================================================
// DIVISION GENERATORS
// =====================================================

export function generateDivisionQuestion(difficulty: Difficulty): Question {
  let divisor: number, quotient: number, hint: string;
  
  if (difficulty === 'easy') {
    // Easy: Small divisors, clean division
    divisor = Math.floor(Math.random() * 5) + 2; // 2-6
    quotient = Math.floor(Math.random() * 8) + 2; // 2-9
    hint = `Think: What times ${divisor} equals ${divisor * quotient}?`;
  } else {
    // Medium: Larger numbers
    divisor = Math.floor(Math.random() * 6) + 5; // 5-10
    quotient = Math.floor(Math.random() * 8) + 5; // 5-12
    hint = `${divisor} × ? = ${divisor * quotient}. Count by ${divisor}s!`;
  }
  
  const dividend = divisor * quotient;
  const correct = quotient;
  const wrong = generateWrongAnswers(correct);
  const choices = shuffle([correct, ...wrong]);
  
  return {
    id: `gen-div-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt: `What is ${dividend} ÷ ${divisor}?`,
    choices,
    correctIndex: choices.indexOf(correct),
    skill: 'division',
    difficulty,
    hint,
  };
}

// =====================================================
// WORD PROBLEM GENERATORS
// =====================================================

interface WordProblemTemplate {
  template: string;
  operation: 'add' | 'subtract' | 'multiply' | 'divide';
  generateNumbers: (difficulty: Difficulty) => { a: number; b: number };
  hintTemplate: string;
}

const wordProblemTemplates: WordProblemTemplate[] = [
  // Addition
  {
    template: '{name} has {a} stickers. {name2} gives them {b} more. How many stickers does {name} have now?',
    operation: 'add',
    generateNumbers: (d) => ({
      a: d === 'easy' ? Math.floor(Math.random() * 50) + 20 : Math.floor(Math.random() * 300) + 100,
      b: d === 'easy' ? Math.floor(Math.random() * 30) + 10 : Math.floor(Math.random() * 200) + 50,
    }),
    hintTemplate: '"Gives more" means add! {a} + {b} = ?',
  },
  {
    template: 'A bakery made {a} muffins in the morning and {b} in the afternoon. How many muffins total?',
    operation: 'add',
    generateNumbers: (d) => ({
      a: d === 'easy' ? Math.floor(Math.random() * 40) + 20 : Math.floor(Math.random() * 200) + 100,
      b: d === 'easy' ? Math.floor(Math.random() * 40) + 20 : Math.floor(Math.random() * 200) + 100,
    }),
    hintTemplate: '"Total" means add them together!',
  },
  // Subtraction
  {
    template: '{name} had {a} coins. {name} spent {b} coins at the store. How many coins are left?',
    operation: 'subtract',
    generateNumbers: (d) => {
      const a = d === 'easy' ? Math.floor(Math.random() * 50) + 50 : Math.floor(Math.random() * 400) + 200;
      const b = Math.floor(a * 0.4) + Math.floor(Math.random() * (a * 0.3));
      return { a, b };
    },
    hintTemplate: '"Spent" means it\'s gone! Subtract {b} from {a}.',
  },
  {
    template: 'The library has {a} books. Students borrowed {b} books. How many books are still in the library?',
    operation: 'subtract',
    generateNumbers: (d) => {
      const a = d === 'easy' ? Math.floor(Math.random() * 100) + 100 : Math.floor(Math.random() * 500) + 300;
      const b = Math.floor(a * 0.3) + Math.floor(Math.random() * (a * 0.3));
      return { a, b };
    },
    hintTemplate: '"Borrowed" means taken away. {a} - {b} = ?',
  },
  // Multiplication
  {
    template: 'There are {a} rows of desks. Each row has {b} desks. How many desks in total?',
    operation: 'multiply',
    generateNumbers: (d) => ({
      a: d === 'easy' ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 5) + 6,
      b: d === 'easy' ? Math.floor(Math.random() * 5) + 3 : Math.floor(Math.random() * 5) + 6,
    }),
    hintTemplate: 'Rows × desks per row = total desks. {a} × {b} = ?',
  },
  {
    template: '{name} bought {a} packs of pencils. Each pack has {b} pencils. How many pencils in all?',
    operation: 'multiply',
    generateNumbers: (d) => ({
      a: d === 'easy' ? Math.floor(Math.random() * 6) + 2 : Math.floor(Math.random() * 6) + 5,
      b: d === 'easy' ? Math.floor(Math.random() * 6) + 4 : Math.floor(Math.random() * 6) + 6,
    }),
    hintTemplate: 'Packs × pencils per pack = total. Multiply!',
  },
  // Division
  {
    template: '{a} students need to form {b} equal teams. How many students per team?',
    operation: 'divide',
    generateNumbers: (d) => {
      const b = d === 'easy' ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 5) + 5;
      const quotient = d === 'easy' ? Math.floor(Math.random() * 6) + 4 : Math.floor(Math.random() * 6) + 6;
      return { a: b * quotient, b };
    },
    hintTemplate: '"Equal teams" means divide! {a} ÷ {b} = ?',
  },
  {
    template: '{name} has {a} cookies to share equally among {b} friends. How many cookies does each friend get?',
    operation: 'divide',
    generateNumbers: (d) => {
      const b = d === 'easy' ? Math.floor(Math.random() * 4) + 2 : Math.floor(Math.random() * 5) + 4;
      const quotient = d === 'easy' ? Math.floor(Math.random() * 6) + 3 : Math.floor(Math.random() * 6) + 5;
      return { a: b * quotient, b };
    },
    hintTemplate: '"Share equally" = divide. {a} ÷ {b} = ?',
  },
];

const names = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'James', 'Sophia', 'Lucas', 'Mia', 'Ethan', 'Beckham'];
const names2 = ['their friend', 'their teacher', 'their mom', 'their dad', 'their sister', 'their brother'];

export function generateWordProblem(difficulty: Difficulty): Question {
  const template = wordProblemTemplates[Math.floor(Math.random() * wordProblemTemplates.length)];
  const { a, b } = template.generateNumbers(difficulty);
  const name = names[Math.floor(Math.random() * names.length)];
  const name2 = names2[Math.floor(Math.random() * names2.length)];
  
  let correct: number;
  switch (template.operation) {
    case 'add': correct = a + b; break;
    case 'subtract': correct = a - b; break;
    case 'multiply': correct = a * b; break;
    case 'divide': correct = a / b; break;
  }
  
  const prompt = template.template
    .replace(/{name}/g, name)
    .replace(/{name2}/g, name2)
    .replace(/{a}/g, a.toString())
    .replace(/{b}/g, b.toString());
  
  const hint = template.hintTemplate
    .replace(/{a}/g, a.toString())
    .replace(/{b}/g, b.toString());
  
  const wrong = generateWrongAnswers(correct);
  const choices = shuffle([correct, ...wrong]);
  
  return {
    id: `gen-word-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    prompt,
    choices,
    correctIndex: choices.indexOf(correct),
    skill: 'wordProblem',
    difficulty,
    hint,
  };
}

// =====================================================
// MAIN GENERATOR
// =====================================================

export function generateQuestion(skill: QuestionSkill, difficulty: Difficulty): Question {
  switch (skill) {
    case 'addition': return generateAdditionQuestion(difficulty);
    case 'subtraction': return generateSubtractionQuestion(difficulty);
    case 'multiplication': return generateMultiplicationQuestion(difficulty);
    case 'division': return generateDivisionQuestion(difficulty);
    case 'wordProblem': return generateWordProblem(difficulty);
    default: return generateAdditionQuestion(difficulty);
  }
}

/**
 * Generate a batch of questions for a quest
 */
export function generateQuestQuestions(
  count: number,
  skills: QuestionSkill[] = ['addition', 'subtraction', 'multiplication', 'division', 'wordProblem'],
  difficulty: Difficulty | 'mixed' = 'mixed'
): Question[] {
  const questions: Question[] = [];
  
  for (let i = 0; i < count; i++) {
    const skill = skills[i % skills.length];
    const diff = difficulty === 'mixed' 
      ? (Math.random() < 0.6 ? 'easy' : 'medium') 
      : difficulty;
    questions.push(generateQuestion(skill, diff));
  }
  
  return shuffle(questions);
}
