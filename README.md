# Homework GOAT 🐐

A web-based educational math game for 3rd graders with a Minecraft/Roblox-inspired voxel aesthetic. Players explore a 3D school courtyard, interact with NPCs, complete math quests, and earn XP rewards!

![Homework GOAT](https://via.placeholder.com/800x400?text=Homework+GOAT+Screenshot)

## 🎮 Features

- **3D Voxel World**: Explore a charming school courtyard rendered in a low-poly, Minecraft-style aesthetic
- **Character Customization**: Create your hero with customizable hair, shirt, pants colors and accessories
- **Math Quests**: Complete quests by solving 3rd-grade math problems (addition, subtraction, multiplication, division, word problems)
- **XP & Leveling System**: Earn experience points and level up as you complete quests
- **Progress Persistence**: All progress is saved to localStorage - come back anytime!
- **Helpful Hints**: Get hints when you're stuck on a problem
- **Kid-Friendly UI**: Large buttons, bright colors, and encouraging feedback

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone or download the project
cd homework-goat

# Install dependencies
npm install

# Start development server
npm run dev
```

The game will open at `http://localhost:3000`

### Building for Production

```bash
npm run build
npm run preview
```

## 🎮 How to Play

1. **Create Your Character**: Choose your avatar's hair color, shirt, pants, and accessory
2. **Enter Your Name**: This is how NPCs will address you!
3. **Explore**: Use **WASD** or **Arrow Keys** to move around the school courtyard
4. **Talk to NPCs**: Walk up to characters with a ❗ above their head and press **E** or click to start a quest
5. **Solve Math Problems**: Answer multiple choice questions correctly to complete quests
6. **Earn Rewards**: Get XP and level up with each completed quest!

## 📁 Project Structure

```
homework-goat/
├── src/
│   ├── main.tsx              # App entry point
│   ├── App.tsx               # Main component & screen routing
│   │
│   ├── game/                 # 3D world & gameplay
│   │   ├── WorldScene.tsx    # Main 3D scene composition
│   │   ├── PlayerController.tsx  # Player movement & camera
│   │   ├── VoxelCharacter.tsx    # Blocky character renderer
│   │   ├── NPC.tsx           # NPC with interaction system
│   │   └── Ground.tsx        # Environment (trees, buildings, etc.)
│   │
│   ├── learning/             # Educational content
│   │   ├── types.ts          # Question, Quest, Stats types
│   │   ├── questions.ts      # Question bank (20 questions)
│   │   ├── quests.ts         # Quest definitions
│   │   └── learningEngine.ts # XP calculations, progress tracking
│   │
│   ├── ui/                   # User interface components
│   │   ├── MainMenu.tsx      # Title screen
│   │   ├── AvatarCustomization.tsx  # Character creator
│   │   ├── NameSetup.tsx     # Name entry screen
│   │   ├── Hud.tsx           # In-game HUD (XP bar, level)
│   │   ├── QuestDialog.tsx   # Quest interaction & questions
│   │   ├── QuestComplete.tsx # Reward screen
│   │   └── OptionsMenu.tsx   # Settings & stats
│   │
│   ├── persistence/          # Save system
│   │   ├── types.ts          # SaveData type definition
│   │   └── storage.ts        # localStorage utilities
│   │
│   ├── hooks/                # React hooks
│   │   ├── useGameState.ts   # Global state (Zustand)
│   │   └── useQuestRunner.ts # Active quest management
│   │
│   ├── ai/                   # Future AI integration
│   │   └── aiHooks.ts        # Placeholder hooks for AI features
│   │
│   └── styles/
│       └── global.css        # Global styles & animations
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## 📚 Adding New Content

### Adding a New Question

Edit `src/learning/questions.ts`:

```typescript
{
  id: 'add-005',  // Unique ID
  prompt: 'What is 123 + 456?',
  choices: [579, 589, 569, 479],  // 4 choices
  correctIndex: 0,  // Index of correct answer
  skill: 'addition',  // 'addition' | 'subtraction' | 'multiplication' | 'division' | 'wordProblem'
  difficulty: 'medium',  // 'easy' | 'medium'
  hint: 'Add the ones first, then tens, then hundreds!',
}
```

### Adding a New Quest

Edit `src/learning/quests.ts`:

```typescript
{
  id: 'quest-new-adventure',
  title: 'The New Adventure',
  description: 'Help someone with math!',
  npcName: 'New Character',
  npcIntro: `Hello adventurer!
  
I need your help with some math problems!

Are you ready?`,
  questionIds: ['add-001', 'mult-002', 'sub-003'],  // IDs from question bank
  rewardXp: 100,
  completionMessage: `Amazing work! You did it!`,
}
```

Then add the NPC position in `src/game/WorldScene.tsx`:

```typescript
const NPC_POSITIONS: Record<string, [number, number, number]> = {
  // ... existing NPCs
  'quest-new-adventure': [10, 0, 5],  // x, y, z coordinates
};
```

## 🤖 AI Integration Points

The game is designed for easy AI integration. See `src/ai/aiHooks.ts` for placeholder functions:

### `getHintForQuestion(question, attemptCount)`
Currently returns static hints. Replace with AI API call for personalized hints based on student's mistake patterns.

### `getSessionRecap(stats, questsCompleted, xpEarned)`
Currently returns a template string. Replace with AI API call for personalized session summaries and encouragement.

### `getEncouragementMessage(streakCount)`
Currently returns random pre-written messages. Replace with AI for more contextual positive reinforcement.

### Example AI Integration

```typescript
// In aiHooks.ts
export async function getHintForQuestion(
  question: Question, 
  attemptCount: number
): Promise<string> {
  const response = await fetch('/api/ai/hint', {
    method: 'POST',
    body: JSON.stringify({ question, attemptCount }),
  });
  return response.json().then(r => r.hint);
}
```

## 🛠 Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Three.js + React Three Fiber** - 3D graphics
- **@react-three/drei** - Useful R3F helpers
- **Zustand** - State management
- **localStorage** - Data persistence

## 📝 Development Notes

### Why Three.js/R3F over Babylon.js?
- Better React integration with R3F's component model
- Lighter bundle size for simple voxel graphics
- Drei provides excellent utility components
- More familiar to React developers

### Controls
- Movement: WASD or Arrow Keys
- Interact: E key or click on NPC prompt
- The camera follows the player in third-person view

### Save Data Structure
```typescript
interface SaveData {
  saveVersion: 1;
  playerName: string;
  avatarConfig: AvatarConfig;
  xp: number;
  completedQuestIds: string[];
  unlockedCosmetics: string[];
  learningStats: LearningStats;
  createdAt: number;
  lastPlayedAt: number;
}
```

## 🎯 Future Improvements

- [ ] More quests and NPCs
- [ ] Sound effects and music
- [ ] More avatar customization options
- [ ] Multiplayer support
- [ ] Backend for saving progress across devices
- [ ] AI-powered adaptive difficulty
- [ ] More question types (fractions, geometry)
- [ ] Achievement system

## 📄 License

MIT License - feel free to use this for educational purposes!

---

Made with ❤️ for young mathematicians everywhere 🐐
