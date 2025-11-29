/**
 * Vercel Serverless Function: Generate AI World
 *
 * This moves the OpenAI API call server-side so API keys are never exposed to the client.
 * The function receives a player profile and returns a generated world bundle.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

// Common Core 3rd Grade Math Standards Reference
// This gives the AI educational context for generating aligned questions
const COMMON_CORE_STANDARDS = `
## Common Core 3rd Grade Math Standards

### Operations & Algebraic Thinking (3.OA)
- **3.OA.A.1**: Interpret products of whole numbers (e.g., 5 × 7 as 5 groups of 7)
- **3.OA.A.2**: Interpret quotients of whole numbers (e.g., 56 ÷ 8 as objects in 8 equal groups)
- **3.OA.A.3**: Use multiplication and division within 100 to solve word problems
- **3.OA.A.4**: Determine unknown whole number in multiplication/division equation
- **3.OA.B.5**: Apply properties of operations (commutative, associative, distributive)
- **3.OA.B.6**: Understand division as unknown-factor problem (32 ÷ 8 = ? because 8 × ? = 32)
- **3.OA.C.7**: Fluently multiply and divide within 100 (know all products of two one-digit numbers)
- **3.OA.D.8**: Solve two-step word problems using the four operations
- **3.OA.D.9**: Identify arithmetic patterns and explain them using properties of operations

### Number & Operations in Base Ten (3.NBT)
- **3.NBT.A.1**: Use place value understanding to round whole numbers to nearest 10 or 100
- **3.NBT.A.2**: Fluently add and subtract within 1000 using strategies and algorithms
- **3.NBT.A.3**: Multiply one-digit numbers by multiples of 10 (e.g., 9 × 80, 5 × 60)

### Number & Operations—Fractions (3.NF)
- **3.NF.A.1**: Understand fractions as parts of a whole divided into equal parts
- **3.NF.A.2**: Understand fractions on a number line
- **3.NF.A.3**: Explain equivalence and compare fractions

### Measurement & Data (3.MD)
- **3.MD.A.1**: Tell and write time to the nearest minute; solve time interval problems
- **3.MD.A.2**: Measure and estimate liquid volumes and masses (grams, kilograms, liters)
- **3.MD.B.3**: Draw scaled picture graphs and bar graphs; solve problems using data
- **3.MD.C.7**: Relate area to multiplication and addition
- **3.MD.D.8**: Solve perimeter problems

### Geometry (3.G)
- **3.G.A.1**: Understand shapes with shared attributes; identify quadrilaterals
- **3.G.A.2**: Partition shapes into parts with equal areas; express as fractions

---

## MEMORY & LEARNING SCIENCE (Apply These!)

### Spaced Repetition & Retrieval Practice
- Questions should reinforce previously learned concepts
- Mix in review of foundational skills within new content
- Repeated exposure with slight variations builds long-term memory

### Cognitive Load Theory
- One concept per question (don't combine too many steps)
- Build complexity gradually within a quest
- First question = warm-up, last question = challenge

### Emotional Engagement & Fun
- Use silly, memorable characters (talking pizza, superhero robots, wizard cats)
- Add humor to word problems ("The dragon ate 7 pizzas...")
- Create mini-narratives that kids want to complete
- Celebrate small wins with enthusiastic NPC responses

### Memory Techniques to Use in Hints
- **Chunking**: "Break 247 into 200 + 40 + 7"
- **Patterns**: "Notice 9 × anything = one less ten, plus complement"
- **Mnemonics**: "King Henry Died By Drinking Chocolate Milk" for metric
- **Visual imagery**: "Imagine 6 groups of 8 cookies on plates"
- **Rhymes**: "6 and 8 went on a date, came back as 48!"
- **Stories**: "7 ate 9, so 7×9=63... 7 ATE(8) something!"
- **Anchor numbers**: "Start from 5×8=40, then add one more 8"

### Hint Guidelines (CRITICAL FOR LEARNING)
Hints should:
1. **Teach a STRATEGY**, not just help with this one problem
2. **Be memorable** - use rhymes, visuals, or silly associations
3. **Connect to prior knowledge** - "Remember how we did 5×5? This is similar!"
4. **Encourage self-discovery** - "What if you broke this into two easier problems?"
5. **Use kid-friendly language** - No jargon, simple sentences

BAD hint: "Multiply the numbers together"
GOOD hint: "8 × 7 is tricky! Try 8 × 5 = 40, then add 8 × 2 = 16 more. 40 + 16 = ?"

BAD hint: "Apply the distributive property"
GOOD hint: "Split 7 into 5 + 2! So 7 × 6 = (5 × 6) + (2 × 6) = 30 + 12!"

### NPC Personality Guidelines
- Each NPC should have a distinct, fun personality
- NPCs should be encouraging and never make kids feel bad
- Use exclamations: "Wow!", "Amazing!", "You're getting it!"
- Add character quirks: robot that speaks in beeps, forgetful wizard, excited scientist
- NPCs celebrate mistakes as learning: "Oops! That's okay, let's figure it out together!"

### Word Problem Contexts Kids Love
- Video games and gaming references
- Sports (soccer goals, basketball points)
- Food (pizza slices, candy, cookies)
- Animals (especially pets, dinosaurs, dragons)
- Space and rockets
- Superheroes and magic
- Building and creating things
- Parties and celebrations

### TRENDING THEMES KIDS ARE OBSESSED WITH (Use These!)
Use references and vibes from things kids currently love:

**Gaming & YouTube Culture:**
- Challenge-style scenarios ("Can you solve all 5 before time runs out?")
- "Epic" and "legendary" rewards language
- Collecting and crafting themes
- Building and survival scenarios (like Minecraft)
- Speedrun energy ("How fast can you solve this?")

**Character Archetypes Kids Love:**
- Generous gift-giver characters (like MrBeast style - "I'm giving away 1000 coins!")
- Cute creature collectors (Pokemon-style - "Gotta catch 'em all!")
- Block-building architects
- Battle royale champions
- Streaming/content creator personas

**Modern Kid Vocabulary (use naturally):**
- "Epic", "legendary", "sus", "clutch", "GG"
- "Let's gooo!", "No way!", "That's crazy!"
- "You're cracked at math!" (means really good)
- "W" for win, celebration energy

**Scenario Ideas:**
- "A generous wizard is giving away gold coins to everyone who solves math puzzles!"
- "Help build the ultimate treehouse - calculate the blocks needed!"
- "Your pet dragon evolved! How much stronger is it now?"
- "The math tournament finals - can you clutch this?"
- "Collect all the rare gems by solving division puzzles!"

**NPCs Could Be:**
- "DJ Calculator" - hype energy, celebrates every answer
- "Coach Victory" - sports motivation style
- "Professor Pixel" - retro gaming references
- "Captain Coins" - generous reward giver
- "Crafty the Builder" - building/creating themes
`;

// Type definitions (mirroring the client-side types)
type QuestionSkill = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'wordProblem';
type Difficulty = 'easy' | 'medium';
type WorldTheme = 'school' | 'forest' | 'castle' | 'space' | 'underwater';

interface PlayerProfile {
  level: number;
  totalXp: number;
  grade: number;
  weakSkills: QuestionSkill[];
  strongSkills: QuestionSkill[];
  preferredThemes?: WorldTheme[];
  averageMastery?: number;
}

interface GeneratedQuestion {
  id: string;
  prompt: string;
  choices: number[];
  correctIndex: number;
  skill: QuestionSkill;
  difficulty: Difficulty;
  hint: string;
  commonCoreStandard: string;
}

interface GeneratedQuest {
  id: string;
  title: string;
  description: string;
  npcName: string;
  npcIntro: string;
  questionIds: string[];
  rewardXp: number;
  completionMessage: string;
}

interface GeneratedWorld {
  id: string;
  name: string;
  description: string;
  theme: WorldTheme;
  unlockRequirement: {
    type: 'level' | 'quests' | 'xp';
    value: number;
  };
  questIds: string[];
  skyColor: string;
  groundColor: string;
  ambientColor: string;
  spawnPoint: [number, number, number];
}

interface GeneratedWorldBundle {
  world: GeneratedWorld;
  quests: GeneratedQuest[];
  questions: GeneratedQuestion[];
}

// Map skills to relevant Common Core standards
const SKILL_TO_STANDARDS: Record<QuestionSkill, string[]> = {
  addition: ['3.NBT.A.2', '3.OA.D.8'],
  subtraction: ['3.NBT.A.2', '3.OA.D.8'],
  multiplication: ['3.OA.A.1', '3.OA.C.7', '3.NBT.A.3', '3.OA.A.3'],
  division: ['3.OA.A.2', '3.OA.B.6', '3.OA.C.7', '3.OA.A.3'],
  wordProblem: ['3.OA.A.3', '3.OA.D.8', '3.MD.A.1', '3.MD.A.2'],
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get API key from server-side environment (NOT exposed to client)
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    console.error('OPENAI_API_KEY not configured in Vercel environment');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const profile: PlayerProfile = req.body;

    // Validate input
    if (!profile || typeof profile.level !== 'number') {
      return res.status(400).json({ error: 'Invalid player profile' });
    }

    const { level, totalXp, grade = 3, weakSkills = [], strongSkills = [], averageMastery = 50 } = profile;

    // Determine difficulty scaling
    const baseDifficulty = averageMastery > 70 && level > 5 ? 'medium' : 'easy';
    const shouldIncludeHarder = averageMastery > 60 && level > 3;

    // Get relevant standards for weak skills
    const relevantStandards = weakSkills
      .flatMap(skill => SKILL_TO_STANDARDS[skill] || [])
      .filter((v, i, a) => a.indexOf(v) === i) // unique
      .join(', ');

    const prompt = `
You are an expert educational content designer creating math questions aligned with Common Core standards.

${COMMON_CORE_STANDARDS}

---

Create ONE new world, 2-3 quests, and 8-12 multiple-choice math questions for a kid-friendly educational 3D game.

PLAYER PROFILE:
- Grade: ${grade}
- Level: ${level}
- Total XP: ${totalXp}
- Average skill mastery: ${Math.round(averageMastery)}% (0-100 scale)
- Weak skills (NEED MORE PRACTICE - focus 60-70% of questions here): ${weakSkills.join(', ') || 'none'}
- Strong skills (use 20-30% for confidence): ${strongSkills.join(', ') || 'none'}
- Relevant Common Core standards to target: ${relevantStandards || '3.OA.C.7, 3.NBT.A.2'}

DIFFICULTY SCALING:
- Base difficulty: ${baseDifficulty}
- Player is ${shouldIncludeHarder ? 'ready for' : 'not ready for'} harder challenges
- ${baseDifficulty === 'easy' ? 'Keep numbers smaller (within 100 for multiplication, within 1000 for addition/subtraction)' : 'Use larger numbers and multi-step problems'}

WORLD RULES:
- World theme must be one of: "school", "forest", "castle", "space", "underwater"
- World text should be fun, positive, and age-appropriate for ages 8-12
- "unlockRequirement" type: "level" | "quests" | "xp", value: reasonable for player level

QUEST RULES:
- Create 2 or 3 quests with kid-friendly NPCs
- Each quest has 3-5 questions
- "rewardXp" between 75 and 250

QUESTION RULES (CRITICAL - FOLLOW EXACTLY):
- Each question MUST include "commonCoreStandard" field with the appropriate standard code
- "skill" must be one of: "addition", "subtraction", "multiplication", "division", "wordProblem"
- "difficulty" must be "easy" or "medium"
- "choices" must be array of 4 numeric options
- "correctIndex" must be valid index (0-3) pointing to the CORRECT answer
- VERIFY YOUR MATH: The choice at correctIndex MUST be the actual correct answer

HINT RULES (CRITICAL FOR MEMORY & LEARNING):
- Hints must teach a REUSABLE STRATEGY, not just solve this problem
- Use memory techniques: rhymes, chunking, visual imagery, anchor numbers
- Keep hints SHORT (1-2 sentences max) and KID-FRIENDLY (no math jargon)
- Examples of GREAT hints:
  - "8×7 is tricky! Start with 8×5=40, add 8×2=16 more!"
  - "99 is almost 100! Add 100, then take away 1."
  - "6 and 8 went on a date, came back as 48!"
  - "Break 347 into 300 + 40 + 7, then add each part!"
  - "Count by 5s! 5, 10, 15, 20... that's 5 × 4!"

WORD PROBLEM RULES (MAKE THEM FUN):
- Use exciting contexts: dragons, pizza parties, space missions, video games
- Give characters funny names: "Chef Pepperoni", "Captain Cosmos", "Sir Snacks-a-Lot"
- Make the story engaging but the math clear
- Example: "A hungry dragon ate 6 pizzas on Monday and 8 more on Tuesday. How many pizzas did the dragon eat in total?"

SKILL-TO-STANDARD MAPPING:
- addition/subtraction → 3.NBT.A.2 (fluency within 1000) or 3.OA.D.8 (word problems)
- multiplication → 3.OA.C.7 (fluency within 100), 3.OA.A.1 (interpret products), 3.NBT.A.3 (multiples of 10)
- division → 3.OA.C.7 (fluency), 3.OA.A.2 (interpret quotients), 3.OA.B.6 (unknown factor)
- wordProblem → 3.OA.A.3 (word problems), 3.OA.D.8 (two-step), 3.MD.A.1 (time), 3.MD.A.2 (measurement)

RESPONSE FORMAT:
Return STRICT JSON matching this schema:
{
  "world": {
    "id": "string (unique, like 'ai-world-timestamp')",
    "name": "string",
    "description": "string",
    "theme": "school" | "forest" | "castle" | "space" | "underwater",
    "unlockRequirement": { "type": "level" | "quests" | "xp", "value": number },
    "questIds": ["string array matching quest ids"]
  },
  "quests": [{
    "id": "string",
    "title": "string (max 6 words)",
    "description": "string (max 20 words)",
    "npcName": "string",
    "npcIntro": "string (1-3 paragraphs, kid-friendly dialog)",
    "questionIds": ["string array matching question ids"],
    "rewardXp": number,
    "completionMessage": "string"
  }],
  "questions": [{
    "id": "string",
    "prompt": "string",
    "choices": [number, number, number, number],
    "correctIndex": 0 | 1 | 2 | 3,
    "skill": "addition" | "subtraction" | "multiplication" | "division" | "wordProblem",
    "difficulty": "easy" | "medium",
    "hint": "string",
    "commonCoreStandard": "string (e.g., '3.OA.C.7')"
  }]
}
`;

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
            content:
              'You are an expert educational game designer specializing in Common Core aligned math curriculum for elementary students. ' +
              'You create engaging, age-appropriate content that is both fun and pedagogically sound. ' +
              'You MUST respond with STRICT JSON matching the requested schema. Double-check all math answers are correct.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      return res.status(502).json({ error: 'AI generation failed', details: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return res.status(502).json({ error: 'AI returned empty response' });
    }

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error('Failed to parse AI response:', content);
      return res.status(502).json({ error: 'AI returned invalid JSON' });
    }

    // Validate and transform the response
    const bundle: GeneratedWorldBundle = {
      world: {
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
      },
      quests: parsed.quests.map((q: GeneratedQuest) => ({
        id: q.id,
        title: q.title,
        description: q.description,
        npcName: q.npcName,
        npcIntro: q.npcIntro,
        questionIds: q.questionIds,
        rewardXp: q.rewardXp,
        completionMessage: q.completionMessage,
      })),
      questions: parsed.questions
        .map((q: GeneratedQuestion) => ({
          id: q.id,
          prompt: q.prompt,
          choices: q.choices,
          correctIndex: q.correctIndex,
          skill: q.skill,
          difficulty: q.difficulty,
          hint: q.hint,
          commonCoreStandard: q.commonCoreStandard || inferStandard(q.skill),
        }))
        .filter((q: GeneratedQuestion) => validateMathQuestion(q)),
    };

    return res.status(200).json(bundle);
  } catch (error) {
    console.error('World generation error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Theme-based colors for generated worlds
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

// Infer standard if AI didn't provide one
function inferStandard(skill: QuestionSkill): string {
  const defaults: Record<QuestionSkill, string> = {
    addition: '3.NBT.A.2',
    subtraction: '3.NBT.A.2',
    multiplication: '3.OA.C.7',
    division: '3.OA.C.7',
    wordProblem: '3.OA.D.8',
  };
  return defaults[skill];
}

// Validate math correctness
function validateMathQuestion(question: GeneratedQuestion): boolean {
  const { prompt, choices, correctIndex, skill } = question;

  if (correctIndex < 0 || correctIndex >= choices.length) {
    console.warn(`Invalid correctIndex for question ${question.id}`);
    return false;
  }

  const correctAnswer = choices[correctIndex];

  // Extract numbers and validate
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
