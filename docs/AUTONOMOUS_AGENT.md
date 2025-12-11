# Autonomous AI Agent System

This document describes the autonomous AI agent system for Homework GOAT that can play the game, complete quests, and find bugs automatically.

## Overview

There are two agent systems available:

### 1. Basic Autonomous Agent (`window.gameAgent`)
A rule-based agent with different personality profiles for testing.

### 2. Smart Agent (`window.smartAgent`)
An intelligent agent that can solve math problems and make strategic decisions.

---

## Basic Autonomous Agent

### Location
`src/testing/autonomousAgent.ts`

### Features

| Feature | Status | Description |
|---------|--------|-------------|
| Movement | ✅ Working | Teleports to NPC/chest/shard positions |
| World Switching | ✅ Working | Can switch between unlocked worlds |
| Quest Attempts | ✅ Working | Navigates to quest NPCs |
| Quest Solving | ⚠️ Limited | Can start quests but uses correct index (not actual math) |
| Boss Battles | ✅ Working | Clicks correct answer via DOM |
| Error Detection | ✅ Working | Reports stuck states and errors |
| Coverage Tracking | ✅ Working | Tracks worlds/quests/chests/shards visited |

### Personalities

| Personality | Behavior |
|-------------|----------|
| `completionist` | Methodically completes all quests, chests, shards, then bosses |
| `explorer` | Wanders randomly, interacts with nearby objects |
| `speedrunner` | Rushes through quests as fast as possible |
| `chaos` | Random actions to find edge cases and bugs |

### Usage

```javascript
// Start with default personality (completionist)
window.gameAgent.start()

// Start with specific personality
window.gameAgent.start('explorer')
window.gameAgent.start('speedrunner')
window.gameAgent.start('chaos')

// Stop the agent
window.gameAgent.stop()

// Get current status
window.gameAgent.getStatus()

// Get full report
window.gameAgent.getReport()
```

### Report Output

```javascript
{
  duration: 60000,           // ms running
  actionsPerformed: 120,     // total actions taken
  worldsExplored: ['world-school', 'world-forest'],
  questsAttempted: ['quest-number-hunt'],
  chestsOpened: ['chest-1'],
  shardsCollected: ['shard-1'],
  errorsFound: [],
  coverage: {
    worldCoverage: 40,       // % of worlds explored
    questCoverage: 25,       // % of quests completed
    chestCoverage: 10,       // % of chests opened
    shardCoverage: 5         // % of shards collected
  }
}
```

---

## Smart Agent

### Location
`src/testing/smartAgent.ts`

### Features

| Feature | Status | Description |
|---------|--------|-------------|
| Movement | ✅ Working | Teleports directly to targets |
| Quest Starting | ✅ Working | Directly starts quests via state |
| Math Solving | ✅ Working | Parses and solves addition, subtraction, multiplication, division |
| Answer Selection | ✅ Working | Finds correct answer in choices |
| Strategic Planning | ✅ Working | Prioritizes incomplete quests |
| Reasoning Log | ✅ Working | Logs all decisions with explanations |

### Math Problem Solving

The smart agent can solve:
- Addition: `5 + 3`, `add 5 and 3`, `sum of 5 and 3`
- Subtraction: `10 - 4`, `subtract 4 from 10`
- Multiplication: `6 × 7`, `6 times 7`, `multiply 6 by 7`
- Division: `20 ÷ 4`, `20 divided by 4`

### Usage

```javascript
// Start smart agent
window.smartAgent.start()

// Stop
window.smartAgent.stop()

// Get thinking log
window.smartAgent.getLog()
```

### Log Output

```javascript
{
  actions: [
    { action: { type: 'move', position: [-8, -6], reasoning: '...' }, timestamp: 123 },
    { action: { type: 'answer', answerIndex: 2, reasoning: '5 + 3 = 8' }, timestamp: 124 }
  ],
  thinking: [
    '[5:00:00 PM] Situation: World: world-school | Level: 1',
    '[5:00:01 PM] Decision: Moving to quest-number-hunt',
    '[5:00:02 PM] Solving: "5 + 3 = ?" - Addition: 5 + 3 = 8'
  ],
  currentGoal: 'Answering question'
}
```

---

## Testing API

### Location
`src/testing/agentTestAPI.ts`

### Available via `window.gameTestAPI`

```javascript
// State queries
getGameState()           // Full game state
getPlayerPosition()      // { x, y, z }
getPlayerLevel()         // Current level
getPlayerXP()            // Current XP
getCurrentWorld()        // World ID
getNearbyInteractables() // Objects within radius
getAllChests()           // All chests with open status
getAllShards()           // All shards with collected status
getAllBosses()           // All bosses with defeated status

// Actions
teleportTo(x, z)         // Move player to position
setScreen(screen)        // Change game screen
switchWorld(worldId)     // Switch to different world

// Debug utilities
unlockAllWorlds()        // Unlock all worlds
setPlayerXP(xp)          // Set XP directly
addCoins(amount)         // Add coins
resetProgress()          // Reset all progress
getLogs()                // Get API logs

// Automated tests
runExplorationTest()     // Test all exploration content
runBossTest()            // Test all bosses exist
runShardCollectionTest() // Test shards in each world
runFullGameTest()        // Run all tests
```

---

## Architecture

### State Management
- Uses Zustand stores (`useGameState`, `useQuestRunner`) for reactive state
- Agents access state via `.getState()` for non-React contexts

### Movement System
- `teleportState` in PlayerController handles agent teleportation
- Agent sets `teleportState.pending = true` with target coordinates
- PlayerController picks up and applies teleport in next frame

### Quest System
- Agent can directly call `questState.startQuest(quest)` to begin quests
- Answer submission via `questState.submitAnswer(index)`
- Progress through phases: `idle` → `intro` → `question` → `feedback` → `complete`

---

## Playwright Tests

### Location
`tests/autonomous-agent.spec.ts`

### Available Tests

```bash
# Run all agent tests
npx playwright test autonomous-agent.spec.ts

# Run specific test
npx playwright test -g "completionist agent"
npx playwright test -g "explorer agent"
npx playwright test -g "chaos agent"

# Run in headed mode (visible browser)
npx playwright test --headed -g "agent can start"
```

---

## Limitations & Known Issues

### Current Limitations
1. **Navigation Accuracy**: Teleportation is instantaneous, not smooth movement
2. **NPC Interaction**: Sometimes needs multiple attempts to trigger quest dialog
3. **3D Collision**: No collision detection during teleportation
4. **AI Integration**: Smart agent uses rule-based math, not LLM API calls

### Future Improvements
- [ ] Integrate OpenAI/Anthropic API for true LLM-powered decisions
- [ ] Add visual replay of agent actions
- [ ] Implement smooth movement instead of teleportation
- [ ] Add screenshot capture on errors
- [ ] Create agent dashboard UI

---

## Files

| File | Purpose |
|------|---------|
| `src/testing/autonomousAgent.ts` | Basic rule-based agent |
| `src/testing/smartAgent.ts` | Intelligent math-solving agent |
| `src/testing/agentTestAPI.ts` | Testing API exposed to window |
| `src/game/PlayerController.tsx` | Has `teleportState` for movement |
| `tests/autonomous-agent.spec.ts` | Playwright test suite |
