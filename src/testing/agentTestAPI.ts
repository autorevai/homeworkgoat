/**
 * Agent Testing Interface
 *
 * Exposes a global API for AI agents (like Claude) to programmatically
 * test the game, verify functionality, and find bugs.
 *
 * Usage: Access via window.gameTestAPI in browser console or automated tests
 */

import { useGameState } from '../hooks/useGameState';
import { CRYSTAL_SHARDS } from '../exploration/crystalShards';
import { TREASURE_CHESTS } from '../exploration/treasureChests';
import { worlds } from '../worlds/worldDefinitions';
import { getBossesForWorld } from '../conquest/bosses';

export interface Interactable {
  id: string;
  type: 'chest' | 'shard' | 'npc' | 'boss';
  position: [number, number, number];
  distance: number;
  status: 'available' | 'completed' | 'locked';
}

export interface GameState {
  playerPosition: { x: number; y: number; z: number };
  playerLevel: number;
  playerXP: number;
  currentWorld: string;
  coins: number;
  completedQuests: string[];
  openedChests: string[];
  collectedShards: string[];
  defeatedBosses: string[];
  unlockedWorlds: string[];
}

export interface GameTestAPI {
  // State queries
  getGameState(): GameState;
  getPlayerPosition(): { x: number; y: number; z: number };
  getPlayerLevel(): number;
  getPlayerXP(): number;
  getCurrentWorld(): string;
  getNearbyInteractables(radius?: number): Interactable[];
  getAllChests(): { id: string; position: [number, number, number]; worldId: string; opened: boolean }[];
  getAllShards(): { id: string; position: [number, number, number]; worldId: string; collected: boolean }[];
  getAllBosses(): { id: string; worldId: string; defeated: boolean }[];

  // Actions
  teleportTo(x: number, z: number): void;
  setScreen(screen: string): void;
  switchWorld(worldId: string): void;

  // Assertions
  assertChestOpened(chestId: string): boolean;
  assertShardCollected(shardId: string): boolean;
  assertBossDefeated(bossId: string): boolean;
  assertWorldUnlocked(worldId: string): boolean;

  // Debug utilities
  unlockAllWorlds(): void;
  setPlayerXP(xp: number): void;
  addCoins(amount: number): void;
  resetProgress(): void;
  getLogs(): string[];

  // Testing helpers
  runExplorationTest(): Promise<TestResult>;
  runBossTest(): Promise<TestResult>;
  runShardCollectionTest(): Promise<TestResult>;
  runFullGameTest(): Promise<TestResult[]>;
}

export interface TestResult {
  name: string;
  passed: boolean;
  message: string;
  duration: number;
  errors: string[];
}

// Store for player position updates (set by WorldScene)
let currentPlayerPosition = { x: 0, y: 0, z: 8 };
let teleportCallback: ((x: number, z: number) => void) | null = null;
const logs: string[] = [];

function log(message: string) {
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${message}`;
  logs.push(entry);
  console.log(`[GameTestAPI] ${message}`);
  // Keep only last 1000 logs
  if (logs.length > 1000) logs.shift();
}

/**
 * Create the Game Test API instance
 */
export function createGameTestAPI(): GameTestAPI {
  const api: GameTestAPI = {
    getGameState(): GameState {
      const state = useGameState.getState();
      return {
        playerPosition: currentPlayerPosition,
        playerLevel: state.level,
        playerXP: state.saveData.xp,
        currentWorld: state.currentWorldId,
        coins: state.saveData.coins || 0,
        completedQuests: state.saveData.completedQuestIds,
        openedChests: state.saveData.openedChestIds || [],
        collectedShards: state.saveData.collectedShardIds || [],
        defeatedBosses: state.saveData.defeatedBossIds || [],
        unlockedWorlds: state.saveData.unlockedWorldIds || ['world-school'],
      };
    },

    getPlayerPosition() {
      log(`Getting player position: (${currentPlayerPosition.x.toFixed(2)}, ${currentPlayerPosition.y.toFixed(2)}, ${currentPlayerPosition.z.toFixed(2)})`);
      return { ...currentPlayerPosition };
    },

    getPlayerLevel() {
      const level = useGameState.getState().level;
      log(`Player level: ${level}`);
      return level;
    },

    getPlayerXP() {
      const xp = useGameState.getState().saveData.xp;
      log(`Player XP: ${xp}`);
      return xp;
    },

    getCurrentWorld() {
      const world = useGameState.getState().currentWorldId;
      log(`Current world: ${world}`);
      return world;
    },

    getNearbyInteractables(radius = 5): Interactable[] {
      const state = useGameState.getState();
      const pos = currentPlayerPosition;
      const nearby: Interactable[] = [];

      // Check chests
      const worldChests = TREASURE_CHESTS.filter((c) => c.worldId === state.currentWorldId);
      for (const chest of worldChests) {
        const dx = chest.position[0] - pos.x;
        const dz = chest.position[2] - pos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        if (distance <= radius) {
          nearby.push({
            id: chest.id,
            type: 'chest',
            position: chest.position,
            distance,
            status: state.saveData.openedChestIds?.includes(chest.id) ? 'completed' : 'available',
          });
        }
      }

      // Check shards
      const worldShards = CRYSTAL_SHARDS.filter((s) => s.worldId === state.currentWorldId);
      for (const shard of worldShards) {
        const dx = shard.position[0] - pos.x;
        const dz = shard.position[2] - pos.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        if (distance <= radius) {
          nearby.push({
            id: shard.id,
            type: 'shard',
            position: shard.position,
            distance,
            status: state.saveData.collectedShardIds?.includes(shard.id) ? 'completed' : 'available',
          });
        }
      }

      log(`Found ${nearby.length} interactables within ${radius} units`);
      return nearby.sort((a, b) => a.distance - b.distance);
    },

    getAllChests() {
      const state = useGameState.getState();
      const opened = state.saveData.openedChestIds || [];
      const chests = TREASURE_CHESTS.map((c) => ({
        id: c.id,
        position: c.position,
        worldId: c.worldId,
        opened: opened.includes(c.id),
      }));
      log(`Total chests: ${chests.length}, Opened: ${opened.length}`);
      return chests;
    },

    getAllShards() {
      const state = useGameState.getState();
      const collected = state.saveData.collectedShardIds || [];
      const shards = CRYSTAL_SHARDS.map((s) => ({
        id: s.id,
        position: s.position,
        worldId: s.worldId,
        collected: collected.includes(s.id),
      }));
      log(`Total shards: ${shards.length}, Collected: ${collected.length}`);
      return shards;
    },

    getAllBosses() {
      const state = useGameState.getState();
      const defeated = state.saveData.defeatedBossIds || [];
      const allBosses: { id: string; worldId: string; defeated: boolean }[] = [];

      for (const world of worlds) {
        const bosses = getBossesForWorld(world.id);
        for (const boss of bosses) {
          allBosses.push({
            id: boss.id,
            worldId: world.id,
            defeated: defeated.includes(boss.id),
          });
        }
      }
      log(`Total bosses: ${allBosses.length}, Defeated: ${defeated.length}`);
      return allBosses;
    },

    teleportTo(x: number, z: number) {
      log(`Teleporting to (${x}, ${z})`);
      if (teleportCallback) {
        teleportCallback(x, z);
      } else {
        log('WARNING: Teleport callback not set. Make sure game is running.');
      }
    },

    setScreen(screen: string) {
      log(`Setting screen to: ${screen}`);
      useGameState.getState().setScreen(screen as any);
    },

    switchWorld(worldId: string) {
      log(`Switching to world: ${worldId}`);
      const state = useGameState.getState();
      if (state.saveData.unlockedWorldIds?.includes(worldId) || worldId === 'world-school') {
        state.updateSaveData({ currentWorldId: worldId });
        state.setScreen('playing');
      } else {
        log(`ERROR: World ${worldId} is not unlocked`);
      }
    },

    assertChestOpened(chestId: string): boolean {
      const opened = useGameState.getState().saveData.openedChestIds?.includes(chestId) || false;
      log(`Assert chest ${chestId} opened: ${opened}`);
      return opened;
    },

    assertShardCollected(shardId: string): boolean {
      const collected = useGameState.getState().saveData.collectedShardIds?.includes(shardId) || false;
      log(`Assert shard ${shardId} collected: ${collected}`);
      return collected;
    },

    assertBossDefeated(bossId: string): boolean {
      const defeated = useGameState.getState().saveData.defeatedBossIds?.includes(bossId) || false;
      log(`Assert boss ${bossId} defeated: ${defeated}`);
      return defeated;
    },

    assertWorldUnlocked(worldId: string): boolean {
      const unlocked = useGameState.getState().saveData.unlockedWorldIds?.includes(worldId) || worldId === 'world-school';
      log(`Assert world ${worldId} unlocked: ${unlocked}`);
      return unlocked;
    },

    unlockAllWorlds() {
      log('Unlocking all worlds...');
      const allWorldIds = worlds.map((w) => w.id);
      useGameState.getState().updateSaveData({ unlockedWorldIds: allWorldIds });
      log(`Unlocked ${allWorldIds.length} worlds`);
    },

    setPlayerXP(xp: number) {
      log(`Setting player XP to ${xp}`);
      useGameState.getState().updateSaveData({ xp });
    },

    addCoins(amount: number) {
      log(`Adding ${amount} coins`);
      const state = useGameState.getState();
      state.updateSaveData({ coins: (state.saveData.coins || 0) + amount });
    },

    resetProgress() {
      log('Resetting all progress...');
      localStorage.removeItem('homeworkGoatSave');
      window.location.reload();
    },

    getLogs(): string[] {
      return [...logs];
    },

    async runExplorationTest(): Promise<TestResult> {
      const startTime = Date.now();
      const errors: string[] = [];
      log('=== Starting Exploration Test ===');

      try {
        // Check that chests exist
        const chests = this.getAllChests();
        if (chests.length === 0) {
          errors.push('No chests found in game');
        }

        // Check that shards exist
        const shards = this.getAllShards();
        if (shards.length === 0) {
          errors.push('No shards found in game');
        }

        // Verify world-school has expected content
        const schoolChests = chests.filter((c) => c.worldId === 'world-school');
        const schoolShards = shards.filter((s) => s.worldId === 'world-school');

        if (schoolChests.length !== 10) {
          errors.push(`Expected 10 chests in world-school, found ${schoolChests.length}`);
        }
        if (schoolShards.length !== 5) {
          errors.push(`Expected 5 shards in world-school, found ${schoolShards.length}`);
        }

        log(`Exploration test complete. Errors: ${errors.length}`);
      } catch (e) {
        errors.push(`Exception: ${e}`);
      }

      return {
        name: 'Exploration Test',
        passed: errors.length === 0,
        message: errors.length === 0 ? 'All exploration content verified' : errors.join('; '),
        duration: Date.now() - startTime,
        errors,
      };
    },

    async runBossTest(): Promise<TestResult> {
      const startTime = Date.now();
      const errors: string[] = [];
      log('=== Starting Boss Test ===');

      try {
        const bosses = this.getAllBosses();
        if (bosses.length === 0) {
          errors.push('No bosses found in game');
        }

        // Check each world has at least one boss
        for (const world of worlds) {
          const worldBosses = bosses.filter((b) => b.worldId === world.id);
          if (worldBosses.length === 0) {
            errors.push(`World ${world.id} has no bosses`);
          }
        }

        log(`Boss test complete. Found ${bosses.length} bosses. Errors: ${errors.length}`);
      } catch (e) {
        errors.push(`Exception: ${e}`);
      }

      return {
        name: 'Boss Test',
        passed: errors.length === 0,
        message: errors.length === 0 ? 'All bosses verified' : errors.join('; '),
        duration: Date.now() - startTime,
        errors,
      };
    },

    async runShardCollectionTest(): Promise<TestResult> {
      const startTime = Date.now();
      const errors: string[] = [];
      log('=== Starting Shard Collection Test ===');

      try {
        const shards = this.getAllShards();

        // Verify 5 shards per world
        for (const world of worlds) {
          const worldShards = shards.filter((s) => s.worldId === world.id);
          if (worldShards.length !== 5) {
            errors.push(`Expected 5 shards in ${world.id}, found ${worldShards.length}`);
          }

          // Check for gold shard (secret area unlock)
          const goldShard = CRYSTAL_SHARDS.find((s) => s.worldId === world.id && s.color === 'gold');
          if (!goldShard) {
            errors.push(`No gold shard found in ${world.id}`);
          }
        }

        log(`Shard test complete. Errors: ${errors.length}`);
      } catch (e) {
        errors.push(`Exception: ${e}`);
      }

      return {
        name: 'Shard Collection Test',
        passed: errors.length === 0,
        message: errors.length === 0 ? 'All shard collections verified' : errors.join('; '),
        duration: Date.now() - startTime,
        errors,
      };
    },

    async runFullGameTest(): Promise<TestResult[]> {
      log('=== Starting Full Game Test Suite ===');
      const results: TestResult[] = [];

      results.push(await this.runExplorationTest());
      results.push(await this.runBossTest());
      results.push(await this.runShardCollectionTest());

      const passed = results.filter((r) => r.passed).length;
      log(`=== Full Game Test Complete: ${passed}/${results.length} passed ===`);

      return results;
    },
  };

  return api;
}

/**
 * Update player position (called by WorldScene)
 */
export function updatePlayerPosition(x: number, y: number, z: number) {
  currentPlayerPosition = { x, y, z };
}

/**
 * Set teleport callback (called by PlayerController)
 */
export function setTeleportCallback(callback: (x: number, z: number) => void) {
  teleportCallback = callback;
}

/**
 * Initialize and expose the API globally
 */
export function initializeGameTestAPI() {
  const api = createGameTestAPI();
  (window as any).gameTestAPI = api;
  log('Game Test API initialized. Access via window.gameTestAPI');
  console.log('%c🎮 Game Test API Ready!', 'color: #4CAF50; font-size: 16px; font-weight: bold;');
  console.log('%cAccess via: window.gameTestAPI', 'color: #2196F3; font-size: 12px;');
  console.log('%cRun tests: window.gameTestAPI.runFullGameTest()', 'color: #FF9800; font-size: 12px;');
  return api;
}
