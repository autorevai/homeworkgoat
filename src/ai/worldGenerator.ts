/**
 * AI World Generator
 *
 * Generates new Worlds + Quests + Questions tailored to each player's learning needs.
 *
 * ARCHITECTURE:
 * - In production: Calls /api/generate-world (Vercel serverless function)
 * - Fallback: Direct OpenAI call for local development
 *
 * The backend API includes Common Core standards context for pedagogically-sound content.
 */

import type { World, WorldTheme } from '../worlds/types';
import type { Question, QuestionSkill, Quest } from '../learning/types';
import type { SaveData } from '../persistence/types';
import type { AdaptiveLearningState } from '../learning/adaptiveLearning';

/**
 * Minimal view of the player's learning state that the AI needs to adapt content.
 */
export interface PlayerProfile {
  level: number;
  totalXp: number;
  grade: number;
  weakSkills: QuestionSkill[];
  strongSkills: QuestionSkill[];
  preferredThemes?: WorldTheme[];
  averageMastery?: number; // 0-100, helps AI scale difficulty
}

/**
 * Convert player's save data + adaptive learning state into a PlayerProfile for AI generation.
 *
 * This bridges your existing learning system to the AI generator, so it knows:
 * - What skills the student struggles with (weakSkills)
 * - What skills they're good at (strongSkills)
 * - Their overall progress level
 * - How to scale difficulty appropriately
 */
export function createPlayerProfileFromGameState(
  saveData: SaveData,
  adaptiveState?: AdaptiveLearningState
): PlayerProfile {
  const level = Math.floor(saveData.xp / 100) + 1;
  const grade = 3; // Default for 3rd grade game

  let weakSkills: QuestionSkill[] = [];
  let strongSkills: QuestionSkill[] = [];
  let averageMastery = 50;

  if (adaptiveState) {
    const skills = Object.values(adaptiveState.skillMastery);
    const attemptedSkills = skills.filter(s => s.totalAttempts > 0);

    if (attemptedSkills.length > 0) {
      weakSkills = attemptedSkills
        .filter(s => s.currentMastery < 60)
        .map(s => s.skill);

      strongSkills = attemptedSkills
        .filter(s => s.currentMastery >= 75)
        .map(s => s.skill);

      averageMastery = attemptedSkills.reduce((sum, s) => sum + s.currentMastery, 0) / attemptedSkills.length;
    }
  } else {
    const stats = saveData.learningStats;
    const allSkills: QuestionSkill[] = ['addition', 'subtraction', 'multiplication', 'division', 'wordProblem'];

    allSkills.forEach(skill => {
      const progress = stats.skillProgress[skill];
      if (progress.total > 0) {
        const accuracy = (progress.correct / progress.total) * 100;
        if (accuracy < 60) {
          weakSkills.push(skill);
        } else if (accuracy >= 75) {
          strongSkills.push(skill);
        }
        averageMastery = (averageMastery + accuracy) / 2;
      }
    });
  }

  if (weakSkills.length === 0) {
    weakSkills = ['division']; // Default to hardest skill
  }

  return {
    level,
    totalXp: saveData.xp,
    grade,
    weakSkills,
    strongSkills,
    averageMastery,
    preferredThemes: undefined,
  };
}

export interface GeneratedWorldBundle {
  world: World;
  quests: Quest[];
  questions: Question[];
}

/**
 * Generate a new world + quests + questions tailored to the player.
 *
 * Uses the backend API in production (secure, Common Core aligned).
 * Falls back to client-side generation for local development.
 */
export async function generateWorldForPlayer(profile: PlayerProfile): Promise<GeneratedWorldBundle> {
  // Try backend API first (production)
  try {
    const response = await fetch('/api/generate-world', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profile),
    });

    if (response.ok) {
      const bundle = await response.json();
      console.log('Generated world via backend API (Common Core aligned)');
      return bundle as GeneratedWorldBundle;
    }

    // If 404, API route doesn't exist (local dev without Vercel)
    if (response.status === 404) {
      console.log('Backend API not available, falling back to client-side generation');
      return generateWorldClientSide(profile);
    }

    // Other errors
    const errorText = await response.text();
    throw new Error(`API error: ${response.status} - ${errorText}`);
  } catch (error) {
    // Network error or API unavailable - fall back to client-side
    if (error instanceof TypeError && error.message.includes('fetch')) {
      console.log('Network error, falling back to client-side generation');
      return generateWorldClientSide(profile);
    }
    throw error;
  }
}

/**
 * Client-side fallback for local development.
 * Uses VITE_OPENAI_API_KEY directly (less secure, for dev only).
 */
async function generateWorldClientSide(profile: PlayerProfile): Promise<GeneratedWorldBundle> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error(
      'No API available. Either deploy to Vercel or add VITE_OPENAI_API_KEY to .env.local for local development.',
    );
  }

  const { level, totalXp, grade, weakSkills, strongSkills, preferredThemes, averageMastery = 50 } = profile;
  const baseDifficulty = averageMastery > 70 && level > 5 ? 'medium' : 'easy';
  const shouldIncludeHarder = averageMastery > 60 && level > 3;

  const prompt = `
Create ONE new world, 2-3 quests, and 8-12 multiple-choice math questions for a kid-friendly educational 3D game.

PLAYER PROFILE:
- Grade: ${grade}
- Level: ${level}
- Total XP: ${totalXp}
- Average skill mastery: ${Math.round(averageMastery)}%
- Weak skills (focus 60-70% of questions here): ${weakSkills.join(', ') || 'none'}
- Strong skills (use 20-30% for confidence): ${strongSkills.join(', ') || 'none'}
- Preferred themes: ${preferredThemes?.join(', ') || 'any'}

DIFFICULTY: ${baseDifficulty} (${shouldIncludeHarder ? 'include some medium' : 'keep easy'})

Return STRICT JSON:
{
  "world": {
    "id": "string",
    "name": "string",
    "description": "string",
    "theme": "school" | "forest" | "castle" | "space" | "underwater",
    "unlockRequirement": { "type": "level" | "quests" | "xp", "value": number },
    "questIds": ["string"]
  },
  "quests": [{
    "id": "string",
    "title": "string",
    "description": "string",
    "npcName": "string",
    "npcIntro": "string",
    "questionIds": ["string"],
    "rewardXp": number,
    "completionMessage": "string"
  }],
  "questions": [{
    "id": "string",
    "prompt": "string",
    "choices": [number, number, number, number],
    "correctIndex": 0-3,
    "skill": "addition" | "subtraction" | "multiplication" | "division" | "wordProblem",
    "difficulty": "easy" | "medium",
    "hint": "string"
  }]
}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      max_tokens: 2000,
      messages: [
        {
          role: 'system',
          content: 'You are a game content designer for an educational kids math game. Respond with STRICT JSON only.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${text}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI returned no content');
  }

  const parsed = JSON.parse(content);

  // Transform to our types
  const world: World = {
    id: parsed.world.id || `ai-world-${Date.now()}`,
    name: parsed.world.name,
    description: parsed.world.description,
    theme: parsed.world.theme,
    unlockRequirement: parsed.world.unlockRequirement,
    questIds: parsed.world.questIds,
    skyColor: getThemeColors(parsed.world.theme).sky,
    groundColor: getThemeColors(parsed.world.theme).ground,
    ambientColor: '#ffffff',
    spawnPoint: [0, 0, 8],
  };

  const quests: Quest[] = parsed.quests.map((q: Quest) => ({
    id: q.id,
    title: q.title,
    description: q.description,
    npcName: q.npcName,
    npcIntro: q.npcIntro,
    questionIds: q.questionIds,
    rewardXp: q.rewardXp,
    completionMessage: q.completionMessage,
  }));

  const questions: Question[] = parsed.questions
    .map((q: Question) => ({
      id: q.id,
      prompt: q.prompt,
      choices: q.choices,
      correctIndex: q.correctIndex,
      skill: q.skill,
      difficulty: q.difficulty,
      hint: q.hint,
    }))
    .filter((q: Question) => validateMathQuestion(q));

  return { world, quests, questions };
}

// Theme-based colors
function getThemeColors(theme: WorldTheme): { sky: string; ground: string } {
  const colors: Record<WorldTheme, { sky: string; ground: string }> = {
    school: { sky: '#87CEEB', ground: '#90EE90' },
    forest: { sky: '#228B22', ground: '#2E8B57' },
    castle: { sky: '#4B0082', ground: '#808080' },
    space: { sky: '#0a0a2e', ground: '#1a1a3e' },
    underwater: { sky: '#006994', ground: '#20B2AA' },
  };
  return colors[theme] || colors.school;
}

// Validate math correctness
function validateMathQuestion(question: Question): boolean {
  const { prompt, choices, correctIndex, skill } = question;

  if (correctIndex < 0 || correctIndex >= choices.length) {
    console.warn(`Invalid correctIndex for question ${question.id}`);
    return false;
  }

  const correctAnswer = choices[correctIndex];

  const addPattern = /(\d+)\s*[\+]\s*(\d+)/;
  const subPattern = /(\d+)\s*[\-\−]\s*(\d+)/;
  const mulPattern = /(\d+)\s*[×\*x]\s*(\d+)/i;
  const divPattern = /(\d+)\s*[÷\/]\s*(\d+)/;

  let expected: number | null = null;

  if (skill === 'addition') {
    const match = prompt.match(addPattern);
    if (match) expected = parseInt(match[1]) + parseInt(match[2]);
  } else if (skill === 'subtraction') {
    const match = prompt.match(subPattern);
    if (match) expected = parseInt(match[1]) - parseInt(match[2]);
  } else if (skill === 'multiplication') {
    const match = prompt.match(mulPattern);
    if (match) expected = parseInt(match[1]) * parseInt(match[2]);
  } else if (skill === 'division') {
    const match = prompt.match(divPattern);
    if (match) expected = parseInt(match[1]) / parseInt(match[2]);
  }

  if (expected !== null && Math.abs(correctAnswer - expected) > 0.001) {
    console.warn(`Math error in question ${question.id}: expected ${expected}, got ${correctAnswer}`);
    return false;
  }

  return true;
}
