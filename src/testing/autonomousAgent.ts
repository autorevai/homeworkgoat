/**
 * Autonomous AI Test Agent
 *
 * An AI agent that plays the game autonomously to find bugs,
 * test gameplay, and validate all content works correctly.
 *
 * Inspired by EA's FIFA testing agents and industry best practices.
 *
 * Usage:
 *   window.gameAgent.start()        - Start the agent
 *   window.gameAgent.stop()         - Stop the agent
 *   window.gameAgent.getReport()    - Get bug/issue report
 *   window.gameAgent.setPersonality('explorer') - Change behavior
 */

import { useGameState } from '../hooks/useGameState';
import { quests } from '../learning/quests';
import { TREASURE_CHESTS } from '../exploration/treasureChests';
import { CRYSTAL_SHARDS } from '../exploration/crystalShards';
import { getBossesForWorld } from '../conquest/bosses';
import { worlds } from '../worlds/worldDefinitions';

// Agent personality types (like EA's player archetypes)
export type AgentPersonality = 'explorer' | 'speedrunner' | 'completionist' | 'chaos';

interface AgentState {
  isRunning: boolean;
  personality: AgentPersonality;
  currentGoal: string;
  actionsPerformed: number;
  errorsFound: AgentError[];
  stuckCount: number;
  lastPosition: { x: number; z: number };
  visitedPositions: Set<string>;
  startTime: number;
  worldsExplored: Set<string>;
  questsAttempted: Set<string>;
  chestsOpened: Set<string>;
  shardsCollected: Set<string>;
}

interface AgentError {
  type: 'bug' | 'stuck' | 'error' | 'inconsistency' | 'performance';
  message: string;
  location: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

interface AgentReport {
  duration: number;
  actionsPerformed: number;
  worldsExplored: string[];
  questsAttempted: string[];
  chestsOpened: string[];
  shardsCollected: string[];
  errorsFound: AgentError[];
  coverage: {
    worldCoverage: number;
    questCoverage: number;
    chestCoverage: number;
    shardCoverage: number;
  };
}


// NPC positions for each world (from WorldScene)
const NPC_POSITIONS: Record<string, Record<string, [number, number, number]>> = {
  'world-school': {
    'quest-number-hunt': [-8, 0, -6],
    'quest-addition-adventure': [8, 0, -6],
    'quest-subtraction-quest': [-6, 0, -12],
    'quest-times-tables': [6, 0, -12],
  },
  'world-forest': {
    'quest-fairy-lights': [-10, 0, -5],
    'quest-owl-wisdom': [10, 0, -5],
    'quest-mushroom-math': [0, 0, -10],
    'quest-forest-guardian': [0, 0, -16],
  },
  'world-castle': {
    'quest-royal-vault': [-8, 0, -8],
    'quest-knight-training': [8, 0, -8],
    'quest-wizard-potions': [0, 0, -12],
    'quest-dragon-eggs': [0, 0, -18],
  },
  'world-space': {
    'quest-asteroid-count': [-10, 0, -6],
    'quest-fuel-calculation': [10, 0, -6],
    'quest-alien-decoder': [0, 0, -12],
    'quest-black-hole-math': [0, 0, -18],
  },
  'world-underwater': {
    'quest-pearl-counting': [-8, 0, -6],
    'quest-treasure-dive': [8, 0, -6],
    'quest-coral-calculation': [0, 0, -12],
    'quest-kraken-challenge': [0, 0, -18],
  },
};

class AutonomousAgent {
  private state: AgentState;
  private intervalId: number | null = null;
  private tickRate = 500; // ms between actions

  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): AgentState {
    return {
      isRunning: false,
      personality: 'completionist',
      currentGoal: 'Starting up...',
      actionsPerformed: 0,
      errorsFound: [],
      stuckCount: 0,
      lastPosition: { x: 0, z: 8 },
      visitedPositions: new Set(),
      startTime: 0,
      worldsExplored: new Set(),
      questsAttempted: new Set(),
      chestsOpened: new Set(),
      shardsCollected: new Set(),
    };
  }

  /**
   * Start the autonomous agent
   */
  start(personality: AgentPersonality = 'completionist') {
    if (this.state.isRunning) {
      console.log('[Agent] Already running');
      return;
    }

    this.state = this.createInitialState();
    this.state.isRunning = true;
    this.state.personality = personality;
    this.state.startTime = Date.now();

    console.log(`%c[Agent] Starting with ${personality} personality`, 'color: #4CAF50; font-weight: bold;');
    this.log(`Agent started with ${personality} personality`);

    // Ensure we're in the game
    this.ensureInGame();

    // Start the main loop
    this.intervalId = window.setInterval(() => this.tick(), this.tickRate);
  }

  /**
   * Stop the autonomous agent
   */
  stop() {
    if (!this.state.isRunning) {
      console.log('[Agent] Not running');
      return;
    }

    this.state.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    console.log(`%c[Agent] Stopped after ${this.state.actionsPerformed} actions`, 'color: #f44336; font-weight: bold;');
    this.printReport();
  }

  /**
   * Set agent personality
   */
  setPersonality(personality: AgentPersonality) {
    this.state.personality = personality;
    this.log(`Personality changed to ${personality}`);
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      isRunning: this.state.isRunning,
      personality: this.state.personality,
      currentGoal: this.state.currentGoal,
      actionsPerformed: this.state.actionsPerformed,
      errorsFound: this.state.errorsFound.length,
      runtime: this.state.isRunning ? Date.now() - this.state.startTime : 0,
    };
  }

  /**
   * Get full report
   */
  getReport(): AgentReport {
    const gameState = useGameState.getState();
    const totalWorlds = worlds.length;
    const totalQuests = Object.keys(quests).length;
    const totalChests = TREASURE_CHESTS.length;
    const totalShards = CRYSTAL_SHARDS.length;

    return {
      duration: Date.now() - this.state.startTime,
      actionsPerformed: this.state.actionsPerformed,
      worldsExplored: Array.from(this.state.worldsExplored),
      questsAttempted: Array.from(this.state.questsAttempted),
      chestsOpened: Array.from(this.state.chestsOpened),
      shardsCollected: Array.from(this.state.shardsCollected),
      errorsFound: this.state.errorsFound,
      coverage: {
        worldCoverage: (this.state.worldsExplored.size / totalWorlds) * 100,
        questCoverage: (gameState.saveData.completedQuestIds.length / totalQuests) * 100,
        chestCoverage: ((gameState.saveData.openedChestIds?.length || 0) / totalChests) * 100,
        shardCoverage: ((gameState.saveData.collectedShardIds?.length || 0) / totalShards) * 100,
      },
    };
  }

  /**
   * Main tick - called every tickRate ms
   */
  private tick() {
    if (!this.state.isRunning) return;

    try {
      this.state.actionsPerformed++;

      // Ensure we're in the game first
      const gameState = useGameState.getState();
      if (gameState.screen !== 'playing' && gameState.screen !== 'questComplete') {
        this.ensureInGame();
        return; // Wait for next tick after setting screen
      }

      // Check for stuck state
      const api = (window as any).gameTestAPI;
      if (api) {
        const pos = api.getPlayerPosition();
        const posKey = `${Math.round(pos.x)},${Math.round(pos.z)}`;

        if (posKey === `${Math.round(this.state.lastPosition.x)},${Math.round(this.state.lastPosition.z)}`) {
          this.state.stuckCount++;
          if (this.state.stuckCount > 20) {
            this.reportError('stuck', 'Agent appears to be stuck', `Position: ${posKey}`);
            this.state.stuckCount = 0;
            this.unstuck();
          }
        } else {
          this.state.stuckCount = 0;
          this.state.lastPosition = { x: pos.x, z: pos.z };
          this.state.visitedPositions.add(posKey);
        }
      }

      // Execute behavior based on personality
      switch (this.state.personality) {
        case 'explorer':
          this.explorerBehavior();
          break;
        case 'speedrunner':
          this.speedrunnerBehavior();
          break;
        case 'completionist':
          this.completionistBehavior();
          break;
        case 'chaos':
          this.chaosBehavior();
          break;
      }

    } catch (error) {
      this.reportError('error', `Tick error: ${error}`, 'tick loop');
    }
  }

  /**
   * Explorer personality - wanders everywhere, touches everything
   */
  private explorerBehavior() {
    const api = (window as any).gameTestAPI;
    if (!api) return;

    const gameState = useGameState.getState();
    this.state.worldsExplored.add(gameState.currentWorldId);

    // Check for nearby interactables
    const nearby = api.getNearbyInteractables(8);

    if (nearby.length > 0 && Math.random() > 0.3) {
      // Move toward nearest interactable
      const target = nearby[0];
      this.state.currentGoal = `Exploring toward ${target.type}: ${target.id}`;
      this.moveToward(target.position[0], target.position[2]);
    } else {
      // Random exploration
      this.state.currentGoal = 'Wandering...';
      this.randomMove();
    }

    // Occasionally switch worlds
    if (Math.random() < 0.01) {
      this.switchToRandomWorld();
    }
  }

  /**
   * Speedrunner personality - tries to complete quests as fast as possible
   */
  private speedrunnerBehavior() {
    const api = (window as any).gameTestAPI;
    if (!api) return;

    const gameState = useGameState.getState();
    this.state.worldsExplored.add(gameState.currentWorldId);

    // Find incomplete quest in current world
    const worldQuests = NPC_POSITIONS[gameState.currentWorldId];
    if (!worldQuests) {
      this.switchToRandomWorld();
      return;
    }

    const incompleteQuest = Object.keys(worldQuests).find(
      questId => !gameState.saveData.completedQuestIds.includes(questId)
    );

    if (incompleteQuest) {
      const pos = worldQuests[incompleteQuest];
      this.state.currentGoal = `Rushing to quest: ${incompleteQuest}`;
      this.moveToward(pos[0], pos[2]);
      this.state.questsAttempted.add(incompleteQuest);
    } else {
      // All quests done in this world, move to next
      this.state.currentGoal = 'World complete, moving on...';
      this.switchToNextWorld();
    }
  }

  /**
   * Completionist personality - methodically clears everything
   */
  private completionistBehavior() {
    const api = (window as any).gameTestAPI;
    if (!api) return;

    const gameState = useGameState.getState();
    this.state.worldsExplored.add(gameState.currentWorldId);

    // Priority 1: Complete quests
    const worldQuests = NPC_POSITIONS[gameState.currentWorldId];
    if (worldQuests) {
      const incompleteQuest = Object.keys(worldQuests).find(
        questId => !gameState.saveData.completedQuestIds.includes(questId)
      );

      if (incompleteQuest) {
        const pos = worldQuests[incompleteQuest];
        this.state.currentGoal = `Completing quest: ${incompleteQuest}`;
        this.moveToward(pos[0], pos[2]);
        this.state.questsAttempted.add(incompleteQuest);
        return;
      }
    }

    // Priority 2: Open chests
    const worldChests = TREASURE_CHESTS.filter(c => c.worldId === gameState.currentWorldId);
    const unopenedChest = worldChests.find(
      c => !gameState.saveData.openedChestIds?.includes(c.id)
    );

    if (unopenedChest) {
      this.state.currentGoal = `Opening chest: ${unopenedChest.id}`;
      this.moveToward(unopenedChest.position[0], unopenedChest.position[2]);
      this.state.chestsOpened.add(unopenedChest.id);
      return;
    }

    // Priority 3: Collect shards
    const worldShards = CRYSTAL_SHARDS.filter(s => s.worldId === gameState.currentWorldId);
    const uncollectedShard = worldShards.find(
      s => !gameState.saveData.collectedShardIds?.includes(s.id)
    );

    if (uncollectedShard) {
      this.state.currentGoal = `Collecting shard: ${uncollectedShard.id}`;
      this.moveToward(uncollectedShard.position[0], uncollectedShard.position[2]);
      this.state.shardsCollected.add(uncollectedShard.id);
      return;
    }

    // Priority 4: Fight boss (if available)
    const worldBosses = getBossesForWorld(gameState.currentWorldId);
    const undefeatedBoss = worldBosses.find(
      b => !gameState.saveData.defeatedBossIds?.includes(b.id)
    );

    if (undefeatedBoss) {
      this.state.currentGoal = `Boss available: ${undefeatedBoss.name}`;
      // Boss position is typically at the end of the world
      this.moveToward(0, -20);
      return;
    }

    // World complete! Move to next
    this.state.currentGoal = 'World 100% complete! Moving to next...';
    this.switchToNextWorld();
  }

  /**
   * Chaos personality - random actions to find edge cases
   */
  private chaosBehavior() {
    const api = (window as any).gameTestAPI;
    if (!api) return;

    const gameState = useGameState.getState();
    this.state.worldsExplored.add(gameState.currentWorldId);

    const action = Math.random();

    if (action < 0.4) {
      // Random movement
      this.state.currentGoal = 'Chaos: Random movement';
      this.randomMove();
    } else if (action < 0.6) {
      // Rapid teleport
      this.state.currentGoal = 'Chaos: Random teleport';
      const x = (Math.random() - 0.5) * 40;
      const z = (Math.random() - 0.5) * 40;
      api.teleportTo(x, z);
    } else if (action < 0.8) {
      // World switch
      this.state.currentGoal = 'Chaos: World switch';
      this.switchToRandomWorld();
    } else {
      // Screen switch
      this.state.currentGoal = 'Chaos: Screen switch';
      const screens = ['mainMenu', 'options', 'worldSelector', 'playing'];
      const screen = screens[Math.floor(Math.random() * screens.length)];
      api.setScreen(screen);
    }
  }

  /**
   * Move toward a target position using keyboard simulation
   */
  private moveToward(targetX: number, targetZ: number) {
    const api = (window as any).gameTestAPI;
    if (!api) return;

    const pos = api.getPlayerPosition();
    const dx = targetX - pos.x;
    const dz = targetZ - pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);

    if (dist < 2) {
      // Close enough, try to interact
      this.simulateKeyPress('e');
      return;
    }

    // Determine which keys to press based on direction
    // Forward is -Z, backward is +Z, left is -X, right is +X
    if (dz < -1) {
      this.simulateKeyPress('w'); // Move forward
    } else if (dz > 1) {
      this.simulateKeyPress('s'); // Move backward
    }

    if (dx < -1) {
      this.simulateKeyPress('a'); // Turn/move left
    } else if (dx > 1) {
      this.simulateKeyPress('d'); // Turn/move right
    }
  }

  /**
   * Simulate a key press
   */
  private simulateKeyPress(key: string) {
    const keydownEvent = new KeyboardEvent('keydown', {
      key: key,
      code: `Key${key.toUpperCase()}`,
      bubbles: true,
      cancelable: true,
    });

    const keyupEvent = new KeyboardEvent('keyup', {
      key: key,
      code: `Key${key.toUpperCase()}`,
      bubbles: true,
      cancelable: true,
    });

    document.dispatchEvent(keydownEvent);

    // Release key after a short delay
    setTimeout(() => {
      document.dispatchEvent(keyupEvent);
    }, 100);
  }

  /**
   * Random movement using keyboard
   */
  private randomMove() {
    const keys = ['w', 'a', 's', 'd'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    this.simulateKeyPress(randomKey);
  }

  /**
   * Unstuck logic - try random movement
   */
  private unstuck() {
    this.log('Attempting to unstuck...');

    // Press random keys rapidly to try to get unstuck
    const keys = ['w', 'a', 's', 'd'];
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        this.simulateKeyPress(randomKey);
      }, i * 100);
    }
  }

  /**
   * Switch to next unlocked world
   */
  private switchToNextWorld() {
    const api = (window as any).gameTestAPI;
    if (!api) return;

    const gameState = useGameState.getState();
    const currentIndex = worlds.findIndex(w => w.id === gameState.currentWorldId);

    // Find next unlocked world
    for (let i = 1; i < worlds.length; i++) {
      const nextIndex = (currentIndex + i) % worlds.length;
      const nextWorld = worlds[nextIndex];

      if (gameState.saveData.unlockedWorldIds?.includes(nextWorld.id)) {
        api.switchWorld(nextWorld.id);
        this.log(`Switched to world: ${nextWorld.id}`);
        return;
      }
    }

    this.log('No other unlocked worlds available');
  }

  /**
   * Switch to random unlocked world
   */
  private switchToRandomWorld() {
    const api = (window as any).gameTestAPI;
    if (!api) return;

    const gameState = useGameState.getState();
    const unlockedWorlds = gameState.saveData.unlockedWorldIds || ['world-school'];
    const randomWorld = unlockedWorlds[Math.floor(Math.random() * unlockedWorlds.length)];

    if (randomWorld !== gameState.currentWorldId) {
      api.switchWorld(randomWorld);
      this.log(`Switched to random world: ${randomWorld}`);
    }
  }

  /**
   * Ensure we're in the game (not menu)
   */
  private ensureInGame() {
    const api = (window as any).gameTestAPI;
    if (!api) return;

    const gameState = useGameState.getState();

    // If player doesn't have a name, set one up for testing
    if (!gameState.saveData.playerName) {
      gameState.updateSaveData({ playerName: 'TestAgent' });
      this.log('Set test player name');
    }

    // If tutorial not completed, mark as complete
    if (!gameState.saveData.tutorialCompleted) {
      gameState.updateSaveData({ tutorialCompleted: true });
      this.log('Skipped tutorial');
    }

    if (gameState.screen !== 'playing') {
      api.setScreen('playing');
      this.log('Switched to playing screen');
    }
  }

  /**
   * Report an error/bug found
   */
  private reportError(type: AgentError['type'], message: string, location: string, details?: Record<string, unknown>) {
    const error: AgentError = {
      type,
      message,
      location,
      timestamp: Date.now(),
      details,
    };

    this.state.errorsFound.push(error);
    console.warn(`%c[Agent] ${type.toUpperCase()}: ${message}`, 'color: #f44336;', { location, details });
  }

  /**
   * Log agent action
   */
  private log(message: string) {
    console.log(`%c[Agent] ${message}`, 'color: #2196F3;');
  }

  /**
   * Print final report
   */
  private printReport() {
    const report = this.getReport();

    console.log('%c========== AGENT REPORT ==========', 'color: #FFD700; font-size: 14px; font-weight: bold;');
    console.log(`Duration: ${Math.round(report.duration / 1000)}s`);
    console.log(`Actions Performed: ${report.actionsPerformed}`);
    console.log(`Worlds Explored: ${report.worldsExplored.join(', ')}`);
    console.log(`Quests Attempted: ${report.questsAttempted.length}`);
    console.log(`Coverage:`);
    console.log(`  - Worlds: ${report.coverage.worldCoverage.toFixed(1)}%`);
    console.log(`  - Quests: ${report.coverage.questCoverage.toFixed(1)}%`);
    console.log(`  - Chests: ${report.coverage.chestCoverage.toFixed(1)}%`);
    console.log(`  - Shards: ${report.coverage.shardCoverage.toFixed(1)}%`);

    if (report.errorsFound.length > 0) {
      console.log(`%cErrors Found: ${report.errorsFound.length}`, 'color: #f44336;');
      report.errorsFound.forEach((err, i) => {
        console.log(`  ${i + 1}. [${err.type}] ${err.message} @ ${err.location}`);
      });
    } else {
      console.log('%cNo errors found!', 'color: #4CAF50;');
    }

    console.log('%c==================================', 'color: #FFD700; font-size: 14px; font-weight: bold;');
  }
}

// Singleton instance
let agentInstance: AutonomousAgent | null = null;

/**
 * Initialize and expose the autonomous agent globally
 */
export function initializeAutonomousAgent() {
  if (!agentInstance) {
    agentInstance = new AutonomousAgent();
  }

  (window as any).gameAgent = {
    start: (personality?: AgentPersonality) => agentInstance!.start(personality),
    stop: () => agentInstance!.stop(),
    getStatus: () => agentInstance!.getStatus(),
    getReport: () => agentInstance!.getReport(),
    setPersonality: (p: AgentPersonality) => agentInstance!.setPersonality(p),
  };

  console.log('%c🤖 Autonomous Agent Ready!', 'color: #9C27B0; font-size: 16px; font-weight: bold;');
  console.log('%cCommands:', 'color: #9C27B0; font-size: 12px;');
  console.log('%c  window.gameAgent.start()              - Start with default (completionist)', 'color: #666;');
  console.log('%c  window.gameAgent.start("explorer")    - Start as explorer', 'color: #666;');
  console.log('%c  window.gameAgent.start("speedrunner") - Start as speedrunner', 'color: #666;');
  console.log('%c  window.gameAgent.start("chaos")       - Start chaos monkey', 'color: #666;');
  console.log('%c  window.gameAgent.stop()               - Stop the agent', 'color: #666;');
  console.log('%c  window.gameAgent.getReport()          - Get bug report', 'color: #666;');

  return agentInstance;
}

export { AutonomousAgent };
