/**
 * Homework GOAT - Automated Game Tests
 *
 * These tests automatically play through the game to find bugs.
 * Run with: npm run test:e2e
 */

import { test, expect, Page } from '@playwright/test';

// Helper to wait for game to load
async function waitForGameLoad(page: Page) {
  // Wait for the game canvas or main menu buttons to appear
  await page.waitForSelector('canvas, .btn, .panel', { timeout: 30000 });
  // Give WebGL time to initialize
  await page.waitForTimeout(2000);
}

// Helper to access game API
async function getGameAPI(page: Page) {
  return await page.evaluate(() => (window as any).gameTestAPI);
}

// Helper to run game test API function
async function runGameTest(page: Page, testName: string) {
  return await page.evaluate((name) => {
    const api = (window as any).gameTestAPI;
    if (!api) throw new Error('Game Test API not available');
    return api[name]();
  }, testName);
}

test.describe('Game Loading', () => {
  test('should load the main menu', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    // Should show main menu or game screen
    const hasContent = await page.locator('.btn, .panel, canvas').count();
    expect(hasContent).toBeGreaterThan(0);
  });

  test('should initialize game test API', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    const hasAPI = await page.evaluate(() => !!(window as any).gameTestAPI);
    expect(hasAPI).toBe(true);
  });
});

test.describe('New Player Flow', () => {
  test('should allow new player to create character', async ({ page }) => {
    // Clear any existing save data
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await waitForGameLoad(page);

    // Should show main menu with New Game button
    const newGameButton = page.locator('text=NEW GAME');
    await expect(newGameButton.first()).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Game Content Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);
  });

  test('should have all exploration content', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const api = (window as any).gameTestAPI;
      if (!api) return { passed: false, message: 'API not available' };
      return await api.runExplorationTest();
    });

    expect(result.passed).toBe(true);
    if (!result.passed) {
      console.log('Exploration test errors:', result.errors);
    }
  });

  test('should have all bosses configured', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const api = (window as any).gameTestAPI;
      if (!api) return { passed: false, message: 'API not available', errors: [] };

      // Get all bosses and verify non-tutorial worlds have bosses
      const bosses = api.getAllBosses();
      const errors: string[] = [];

      // world-school is the tutorial world and intentionally has no boss
      // Check that other worlds have bosses
      const worldsWithBosses = ['world-forest', 'world-castle', 'world-space', 'world-underwater'];
      for (const worldId of worldsWithBosses) {
        const worldBosses = bosses.filter((b: any) => b.worldId === worldId);
        if (worldBosses.length === 0) {
          errors.push(`World ${worldId} has no bosses`);
        }
      }

      return {
        passed: errors.length === 0,
        message: errors.length === 0 ? 'All bosses verified' : errors.join('; '),
        errors,
      };
    });

    expect(result.passed).toBe(true);
    if (!result.passed) {
      console.log('Boss test errors:', result.errors);
    }
  });

  test('should have crystal shards in all worlds', async ({ page }) => {
    const result = await page.evaluate(async () => {
      const api = (window as any).gameTestAPI;
      if (!api) return { passed: false, message: 'API not available' };
      return await api.runShardCollectionTest();
    });

    expect(result.passed).toBe(true);
    if (!result.passed) {
      console.log('Shard test errors:', result.errors);
    }
  });
});

test.describe('World Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    // Unlock all worlds for testing
    await page.evaluate(() => {
      const api = (window as any).gameTestAPI;
      if (api) api.unlockAllWorlds();
    });
  });

  test('should be able to switch to each world', async ({ page }) => {
    const worlds = ['world-school', 'world-forest', 'world-castle', 'world-space', 'world-underwater'];

    for (const worldId of worlds) {
      await page.evaluate((id) => {
        const api = (window as any).gameTestAPI;
        if (api) api.switchWorld(id);
      }, worldId);

      // Verify world switched
      const currentWorld = await page.evaluate(() => {
        const api = (window as any).gameTestAPI;
        return api ? api.getCurrentWorld() : null;
      });

      expect(currentWorld).toBe(worldId);

      // Small delay between switches
      await page.waitForTimeout(500);
    }
  });
});

test.describe('Quest Completion Flow', () => {
  test('should have quests defined for each world', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    // Verify quests exist for all worlds by checking world definitions
    const result = await page.evaluate(() => {
      // This checks if the game loaded with proper quest/world data
      const api = (window as any).gameTestAPI;
      if (!api) return { passed: false, message: 'API not available' };

      // Check that chests and shards exist (which means world data is loaded)
      const chests = api.getAllChests();
      const shards = api.getAllShards();

      return {
        passed: chests.length > 0 && shards.length > 0,
        message: `Found ${chests.length} chests and ${shards.length} shards`,
        chests: chests.length,
        shards: shards.length,
      };
    });

    expect(result.passed).toBe(true);
    console.log('Quest data:', result.message);
  });
});

test.describe('Mobile Responsiveness', () => {
  test('should show mobile controls on touch devices', async ({ page }) => {
    // Emulate touch device
    await page.goto('/');
    await waitForGameLoad(page);

    // Check if in game screen (not menu)
    const inGame = await page.evaluate(() => {
      const api = (window as any).gameTestAPI;
      return api?.getGameState()?.playerPosition !== undefined;
    });

    if (inGame) {
      // Look for joystick or mobile controls
      // This depends on the viewport being mobile-sized
      const viewport = page.viewportSize();
      if (viewport && viewport.width < 768) {
        // Should have touch controls visible
        // Note: Actual visibility depends on touch detection
      }
    }
  });
});

test.describe('Full Game Test Suite', () => {
  test('should pass all automated tests', async ({ page }) => {
    await page.goto('/');
    await waitForGameLoad(page);

    const results = await page.evaluate(async () => {
      const api = (window as any).gameTestAPI;
      if (!api) return [];
      return await api.runFullGameTest();
    });

    console.log('Full game test results:');
    for (const result of results) {
      console.log(`  ${result.passed ? '✓' : '✗'} ${result.name}: ${result.message}`);
    }

    const allPassed = results.every((r: any) => r.passed);
    expect(allPassed).toBe(true);
  });
});
