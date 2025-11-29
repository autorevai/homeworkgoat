# Homework GOAT - Game Design Document

**Version:** 2.4
**Last Updated:** November 29, 2024
**Status:** Sprint 3 Nearly Complete - Sound Effects Remaining

---

## Table of Contents

1. [Vision](#vision)
2. [Target Audience](#target-audience)
3. [Core Gameplay Loop](#core-gameplay-loop)
4. [Game Modes](#game-modes)
5. [World Design](#world-design)
6. [Implementation Status](#implementation-status)
7. [Detailed Mechanics](#detailed-mechanics)
8. [Engagement & Psychology](#engagement--psychology)
9. [Technical Architecture](#technical-architecture)
10. [Agent Testing Interface](#agent-testing-interface)

---

## Vision

Transform math learning from "walk up, answer quiz" into an **immersive adventure** where math is woven into exploration, building, storytelling, and combat. Kids should feel like they're playing a real game that happens to make them better at math.

**Core Philosophy:** Math is the magic system, not the homework.

---

## Target Audience

### Primary: Ages 7-12 (Grades 2-6)

| Grade | Age | Math Focus | Content Type |
|-------|-----|------------|--------------|
| 2nd | 7-8 | Single digit +/-, intro × | Easy mode |
| 3rd | 8-9 | Multi-digit, × ÷ tables | Default mode |
| 4th | 9-10 | Multi-step, fractions intro | Medium mode |
| 5th | 10-11 | Decimals, complex word problems | Hard mode |
| 6th | 11-12 | Ratios, pre-algebra | Expert mode |

**Adaptive System:** The game adjusts difficulty based on:
- Selected grade level at start
- Real-time performance tracking
- Mastery of specific skills (addition, subtraction, multiplication, division, word problems)

**Platform:** Web (tablet-friendly), future mobile app (iOS/Android via Capacitor)

---

## Core Gameplay Loop

```
┌─────────────────────────────────────────────────────────────────┐
│                     THE ADVENTURE LOOP                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   EXPLORE ──► DISCOVER ──► SOLVE ──► EARN ──► BUILD/GROW       │
│      │                                              │           │
│      └──────────────────────────────────────────────┘           │
│                                                                 │
│   - Explore: Wander 40x40 world, find secrets                  │
│   - Discover: Hidden crystals, chests, NPCs, bosses            │
│   - Solve: Math integrated into gameplay (speed matters!)      │
│   - Earn: XP, coins, cosmetics, creature XP, story progress    │
│   - Build/Grow: Construct things, evolve creatures, unlock     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Game Modes

### 1. EXPLORATION MODE (The World) ✅ IMPLEMENTED
> *Find secrets, solve environmental puzzles, collect treasures*

- **40x40 unit worlds** with trees, rocks, flowers, decorations
- **10 treasure chests** per world (common, rare, epic, legendary)
- **5 crystal shards** per world (collect all for secret reward)
- **4-6 NPCs** per world offering quests
- **1-2 bosses** per world

### 2. BATTLE MODE (Boss Fights) ✅ IMPLEMENTED
> *Real-time math combat with speed bonuses*

- **Speed Bonus System:** Faster answers = more damage
  - Under 3 seconds: 2x damage (LEGENDARY!)
  - Under 5 seconds: 1.5x damage (EPIC!)
  - Under 10 seconds: 1.25x damage (Great!)
  - Under 20 seconds: 1x damage (Good)
  - Over 20 seconds: 0.75x damage (Slow...)
- Visual feedback with animated timer bar
- Boss phases with unique dialogue

### 3. QUEST MODE ✅ IMPLEMENTED
> *NPC quests with better rewards and variety*

- Walk up to NPC, press E to interact
- Answer math questions
- Earn XP, unlock worlds

### 4. BUILDING MODE (Coming Soon)
> *Spend earned blocks to build structures*

### 5. STORY MODE (Coming Soon)
> *Branching narratives with math-based decisions*

---

## World Design

### World Size: 40x40 Units

Each world is a 40x40 unit playable area with:

```
┌────────────────────────────────────────┐
│  (-20,20)                    (20,20)   │
│     ┌─────────────────────────┐        │
│     │     EXPLORATION ZONE    │        │
│     │                         │        │
│     │  Chests ○  ○  ○        │        │
│     │       Shards 💎 💎      │        │
│     │    NPCs 👤 👤 👤 👤     │        │
│     │                         │        │
│     │       BOSS 👹           │        │
│     └─────────────────────────┘        │
│  (-20,-20)   SPAWN POINT    (20,-20)   │
└────────────────────────────────────────┘
```

### Content Per World

| Object Type | Count | Distribution |
|-------------|-------|--------------|
| Treasure Chests | 10 | Spread across map, rarity increases toward edges |
| Crystal Shards | 5 | Hidden in corners and far reaches |
| Quest NPCs | 4-6 | Scattered at key locations |
| Boss NPCs | 1-2 | Deep in the world (z = -18) |
| Trees | 20+ | Dense around edges, sparse in center |
| Rocks/Flowers | 10+ | Decorative elements |

### 5 Themed Worlds

1. **School Courtyard** (Level 1) - Beginner friendly
2. **Enchanted Forest** (Level 3) - Nature magic theme
3. **Kingdom of Numbers** (Level 5) - Castle and knights
4. **Space Station Alpha** (Level 8) - Sci-fi adventure
5. **Underwater Kingdom** (Level 12) - Ocean exploration

---

## Implementation Status

### Legend
- [ ] Not started
- [🔄] In progress
- [✅] Complete

---

### PHASE 1: Core Infrastructure ✅ COMPLETE
| Feature | Status | Notes |
|---------|--------|-------|
| Basic 3D world with player movement | ✅ | 40x40 worlds |
| NPC quest system | ✅ | Walk up, press E, answer questions |
| XP and leveling | ✅ | Working |
| Boss battles with speed bonus | ✅ | LEGENDARY/EPIC/GREAT tiers |
| Daily challenges | ✅ | Streak system working |
| AI world generation | ✅ | Backend API + UI complete |
| Save/load system | ✅ | localStorage + Firestore |
| Adaptive learning | ✅ | Tracks weak/strong skills |

---

### PHASE 2: Exploration & Discovery ✅ COMPLETE
| Feature | Status | Notes |
|---------|--------|-------|
| Treasure Chests | ✅ | 10 per world, 50 total, math lock puzzles |
| Crystal Shards | ✅ | 5 per world, 25 total, collection rewards |
| Larger Worlds | ✅ | Expanded from 20x25 to 40x40 |
| More NPCs | ✅ | 4-6 per world |
| Chest Rarity System | ✅ | Common, Rare, Epic, Legendary |
| Shard Collection Rewards | ✅ | Cosmetics + titles for completing sets |

#### Treasure Chest System ✅
- 10 chests per world (50 total)
- Rarity tiers with different rewards:
  - Common: 15-25 XP, 10-20 coins
  - Rare: 30-50 XP, 25-50 coins
  - Epic: 60-80 XP, 50-65 coins, chance for cosmetic
  - Legendary: 100-200 XP, 80-150 coins, guaranteed cosmetic
- Math puzzle difficulty scales with rarity

#### Crystal Shard System ✅
- 5 shards per world (25 total)
- Colors: Red, Blue, Green, Purple, Gold
- Gold shard is always the final piece
- Collecting all 5 unlocks secret reward:
  - Unique cosmetic
  - Special title
  - Bonus XP and coins

---

### PHASE 3: Building/Crafting System
| Feature | Status | Priority |
|---------|--------|----------|
| Block Currency | [ ] | HIGH |
| Homebase World | [ ] | HIGH |
| Building Grid | [ ] | HIGH |
| Structure Templates | [ ] | MEDIUM |
| Material Calculation | [ ] | HIGH |

---

### PHASE 4: Story Mode
| Feature | Status | Priority |
|---------|--------|----------|
| Branching Dialogue | [ ] | HIGH |
| Math-Based Decisions | [ ] | HIGH |
| Story Consequences | [ ] | MEDIUM |
| Multiple Endings | [ ] | MEDIUM |

---

### PHASE 5: Battle Creatures
| Feature | Status | Priority |
|---------|--------|----------|
| Creature Eggs | [ ] | MEDIUM |
| Creature Hatching | [ ] | MEDIUM |
| Creature Evolution | [ ] | MEDIUM |
| Skill Bonuses | [ ] | MEDIUM |

---

### PHASE 6: Polish & Social
| Feature | Status | Priority |
|---------|--------|----------|
| Grade Level Picker | [✅] | HIGH |
| Adaptive Difficulty | [✅] | HIGH |
| Achievement System | [✅] | MEDIUM |
| Sound Effects | [ ] | MEDIUM |
| Music | [ ] | MEDIUM |
| Tutorials | [✅] | HIGH |
| World Complete Popup | [✅] | MEDIUM |
| Error Boundaries | [✅] | HIGH |

---

## Detailed Mechanics

### Economy System

```
CURRENCIES:
┌─────────────┬──────────────────────────┬─────────────────────┐
│ Currency    │ Earned From              │ Spent On            │
├─────────────┼──────────────────────────┼─────────────────────┤
│ XP          │ All activities           │ Leveling up         │
│ Coins       │ Quests, chests, streaks  │ Cosmetics, hints    │
│ Blocks      │ Correct answers          │ Building (future)   │
│ Crystals    │ Shard collections        │ Special unlocks     │
│ Creature XP │ Battles (future)         │ Creature evolution  │
└─────────────┴──────────────────────────┴─────────────────────┘
```

### Difficulty Scaling

```
GRADE LEVEL → CONTENT DIFFICULTY

Grade 2: Single digit +/-, simple counting, intro ×
Grade 3: Multi-digit +/-, × tables (1-10), intro ÷
Grade 4: Large numbers, fractions intro, multi-step
Grade 5: Decimals, complex word problems, ratios intro
Grade 6: Pre-algebra, advanced ratios, negative numbers
```

### Reward Distribution

```
PER WORLD (40x40):
- 10 Treasure Chests
  - 4 Common (edges)
  - 3 Rare (mid-range)
  - 2 Epic (far corners)
  - 1 Legendary (hidden boss area)

- 5 Crystal Shards
  - 4 Regular (scattered)
  - 1 Gold (final piece, harder puzzle)

- 4-6 Quest NPCs
  - Each offers 4-5 questions
  - 20-50 XP per quest

- 1-2 Bosses
  - 50-200 XP per defeat
  - Unique cosmetic rewards
```

---

## Engagement & Psychology

### What Makes It Addictive (In a Good Way)

| Hook | Implementation | Status |
|------|---------------|--------|
| **Immediate Feedback** | Speed bonus shows damage multiplier instantly | ✅ |
| **Variable Rewards** | Chests have random loot, different rarities | ✅ |
| **Collection Drive** | Crystal shards, "3 more to unlock secret!" | ✅ |
| **Progression** | XP, levels, world unlocks | ✅ |
| **Streaks** | Daily challenges with combo bonuses | ✅ |
| **Near Misses** | "So close! The answer was..." | ✅ |
| **Ownership** | Avatar customization, cosmetics | ✅ |
| **Exploration** | Large 40x40 worlds with hidden content | ✅ |
| **Story Investment** | NPCs, world lore (expanding) | 🔄 |
| **Creature Bonding** | Pet creatures that evolve | [ ] |

### Learning Encouragement

- **Math UNLOCKS gameplay** - Can't open chest without solving
- **Speed matters** - Faster = more damage in boss battles
- **Mistakes have stakes** - Boss blocks attack, chest stays locked
- **Hints teach memory tricks** - Not just answers, but HOW to remember
- **Spaced repetition** - Weak skills appear more often

---

## Technical Architecture

### Key Files

```
src/
├── game/
│   ├── WorldScene.tsx      # Main 3D world (40x40)
│   ├── Ground.tsx          # World environment
│   ├── TreasureChest.tsx   # Chest 3D component ✅
│   ├── CrystalShard.tsx    # Shard 3D component ✅
│   ├── NPC.tsx             # Quest giver
│   ├── BossNPC.tsx         # Boss enemy
│   └── PlayerController.tsx
├── ui/
│   ├── BossBattle.tsx      # Battle UI with speed bonus ✅
│   ├── ChestPuzzle.tsx     # Chest unlock modal ✅
│   ├── ShardPuzzle.tsx     # Shard collection modal ✅
│   └── ...
├── exploration/
│   ├── treasureChests.ts   # 50 chest definitions ✅
│   └── crystalShards.ts    # 25 shard definitions ✅
└── persistence/
    └── types.ts            # SaveData with coins, shards, chests ✅
```

### State Management

```typescript
interface SaveData {
  // Core
  xp: number;
  coins: number;
  completedQuestIds: string[];
  defeatedBossIds: string[];

  // Exploration ✅
  openedChestIds: string[];
  collectedShardIds: string[];

  // Worlds
  currentWorldId: string;
  unlockedWorldIds: string[];

  // AI Generated
  generatedWorlds: GeneratedWorldData[];

  // ... more fields
}
```

---

## Agent Testing Interface

### Purpose
Enable Claude (or other AI agents) to programmatically test the game, verify functionality, and progress through content automatically.

### Proposed API

```typescript
// Agent testing interface (to be implemented)
interface GameTestAPI {
  // State queries
  getPlayerPosition(): { x: number, y: number, z: number };
  getPlayerLevel(): number;
  getPlayerXP(): number;
  getNearbyInteractables(): Interactable[];

  // Actions
  movePlayer(direction: 'north' | 'south' | 'east' | 'west', distance: number): void;
  interactWith(objectId: string): void;
  answerQuestion(answer: number): boolean;

  // Assertions
  assertChestOpened(chestId: string): boolean;
  assertShardCollected(shardId: string): boolean;
  assertBossDefeated(bossId: string): boolean;

  // Utilities
  teleportTo(x: number, z: number): void;
  setPlayerLevel(level: number): void;
  unlockAllWorlds(): void;
}
```

### Test Scenarios

```
1. EXPLORATION TEST
   - Spawn at world-school
   - Navigate to chest-school-1 at position (15, 0, 5)
   - Solve math puzzle
   - Verify chest opened and rewards granted

2. BOSS BATTLE TEST
   - Navigate to boss at (0, 0, -18)
   - Start battle
   - Answer all questions
   - Verify speed bonus applied correctly
   - Verify XP granted on victory

3. SHARD COLLECTION TEST
   - Collect all 5 shards in a world
   - Verify collection reward granted
   - Verify cosmetic unlocked
```

---

## Priority Order for Implementation

### Sprint 1: Core Exploration ✅ COMPLETE
1. [✅] Speed bonus in boss battles
2. [✅] Treasure chests with math locks (50 chests)
3. [✅] Crystal shard collection (25 shards)
4. [✅] Larger 40x40 worlds

### Sprint 2: Age Expansion ✅ COMPLETE
1. [✅] Grade level picker at start (2nd-6th grade)
2. [✅] Adaptive difficulty per grade (GRADE_CONFIGS)
3. [✅] Grade-aware question generators
4. [ ] Tutorial system (moved to Sprint 3)

### Sprint 3: Tutorial & Polish (Current)
1. [✅] Interactive tutorial system
2. [✅] Agent testing interface (window.gameTestAPI)
3. [✅] Error boundaries and crash recovery
4. [✅] Achievement system (35+ achievements)
5. [ ] Sound effects

### Sprint 4: Building Foundation
1. [ ] Block currency system
2. [ ] Simple homebase with grid building
3. [ ] Structure challenges ("build a 3x4 wall")

### Sprint 5: Story & Depth
1. [ ] Branching story system
2. [ ] Math-based story decisions
3. [ ] Story consequences

### Sprint 6: Creatures & Final Polish
1. [ ] Battle creatures
2. [ ] Creature evolution
3. [ ] Music and final touches

---

## Changelog

### v2.3 - November 29, 2024
- Implemented Interactive Tutorial System (9 steps, movement detection)
- Added Error Boundaries for crash recovery
- Added GameErrorBoundary for 3D rendering errors
- Modals now fail gracefully and return to game
- Auto-recovery from WebGL context loss
- Safe modal close on errors

### v2.2 - November 29, 2024
- Implemented Agent Testing Interface (window.gameTestAPI)
- Fixed map boundary issues - full 40x40 map now accessible
- Added TTS math symbol conversion (× → "times")
- Fixed tooltip overlay on puzzle modals

### v2.1 - November 29, 2024
- Added grade level picker (2nd-6th grade) to onboarding flow
- Implemented adaptive difficulty per grade with GRADE_CONFIGS
- Added grade-aware question generators (generateGradeQuestion)
- Updated onboarding flow: avatar -> name -> grade level -> world
- Sprint 2 complete

### v2.0 - November 29, 2024
- Expanded worlds from 20x25 to 40x40 units
- Implemented treasure chest system (50 chests total)
- Implemented crystal shard system (25 shards total)
- Added speed bonus system to boss battles
- Added coin currency system
- Repositioned all NPCs, bosses, chests, shards for larger worlds
- Updated target audience to ages 7-12 (grades 2-6)
- Added agent testing interface specification
- Complete game design document overhaul

### v1.0 - November 29, 2024
- Initial game design document created
- Defined 6 phases of development
- Outlined all major systems
- Created implementation checklists

---

*This is a living document. Update as features are implemented.*
