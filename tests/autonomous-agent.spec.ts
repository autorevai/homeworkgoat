/**
 * Autonomous Agent Test Suite
 *
 * Runs the AI agent to autonomously test the game.
 * This is a long-running test that explores the game looking for bugs.
 */

import { test, expect } from '@playwright/test';

// Configure longer timeout for autonomous testing
test.setTimeout(120000); // 2 minutes

test.describe('Autonomous Agent Testing', () => {
  test('should run completionist agent and find no critical errors', async ({ page }) => {
    await page.goto('/');

    // Wait for game to load
    await page.waitForSelector('canvas, .btn, .panel', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Click "New Game" to enter the game
    const newGameBtn = page.locator('text=NEW GAME');
    if (await newGameBtn.isVisible()) {
      await newGameBtn.click();
      await page.waitForTimeout(1000);
    }

    // If we see avatar customization, set it up quickly
    const continueBtn = page.locator('text=Continue');
    if (await continueBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await continueBtn.click();
      await page.waitForTimeout(500);
    }

    // If we see name setup, enter a name
    const nameInput = page.locator('input[placeholder*="name"], input[type="text"]');
    if (await nameInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await nameInput.fill('TestAgent');
      const startBtn = page.locator('text=Start Adventure, text=Continue, text=Start');
      if (await startBtn.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        await startBtn.first().click();
      }
      await page.waitForTimeout(500);
    }

    // If we see grade picker, select one
    const gradeBtn = page.locator('text=3rd Grade');
    if (await gradeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await gradeBtn.click();
      await page.waitForTimeout(500);
      const confirmBtn = page.locator('text=Start Learning, text=Continue');
      if (await confirmBtn.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        await confirmBtn.first().click();
      }
      await page.waitForTimeout(500);
    }

    // Wait for game world to load
    await page.waitForTimeout(3000);

    // Start the autonomous agent
    console.log('Starting autonomous agent...');

    await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      if (agent) {
        agent.start('completionist');
      }
    });

    // Let it run for 60 seconds
    console.log('Agent running for 60 seconds...');
    await page.waitForTimeout(60000);

    // Stop and get report
    const report = await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      if (agent) {
        agent.stop();
        return agent.getReport();
      }
      return null;
    });

    console.log('Agent Report:', JSON.stringify(report, null, 2));

    // Verify agent ran successfully
    expect(report).not.toBeNull();
    expect(report.actionsPerformed).toBeGreaterThan(50);

    // Check for critical errors (bugs/errors, not stuck states which are expected)
    const criticalErrors = report.errorsFound.filter(
      (e: any) => e.type === 'bug' || e.type === 'error'
    );

    if (criticalErrors.length > 0) {
      console.log('Critical errors found:', criticalErrors);
    }

    expect(criticalErrors.length).toBe(0);
  });

  test('should run explorer agent across multiple worlds', async ({ page }) => {
    await page.goto('/');

    // Wait for game to load
    await page.waitForSelector('canvas, .btn, .panel', { timeout: 30000 });
    await page.waitForTimeout(3000);

    // Unlock all worlds first
    await page.evaluate(() => {
      const api = (window as any).gameTestAPI;
      if (api) {
        api.unlockAllWorlds();
      }
    });

    // Start the explorer agent
    await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      if (agent) {
        agent.start('explorer');
      }
    });

    // Let it run for 45 seconds
    await page.waitForTimeout(45000);

    // Stop and get report
    const report = await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      if (agent) {
        agent.stop();
        return agent.getReport();
      }
      return null;
    });

    console.log('Explorer Report:', JSON.stringify(report, null, 2));

    expect(report).not.toBeNull();
    expect(report.worldsExplored.length).toBeGreaterThan(0);
  });

  test('should run chaos agent without crashing', async ({ page }) => {
    await page.goto('/');

    // Wait for game to load
    await page.waitForSelector('canvas, .btn, .panel', { timeout: 30000 });
    await page.waitForTimeout(3000);

    // Unlock all worlds
    await page.evaluate(() => {
      const api = (window as any).gameTestAPI;
      if (api) {
        api.unlockAllWorlds();
      }
    });

    // Start chaos agent
    await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      if (agent) {
        agent.start('chaos');
      }
    });

    // Let it run for 30 seconds
    await page.waitForTimeout(30000);

    // Stop and check no crashes occurred
    const report = await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      if (agent) {
        agent.stop();
        return agent.getReport();
      }
      return null;
    });

    console.log('Chaos Report:', JSON.stringify(report, null, 2));

    expect(report).not.toBeNull();
    expect(report.actionsPerformed).toBeGreaterThan(30);

    // Verify game didn't crash (page is still responsive)
    const isResponsive = await page.evaluate(() => {
      return typeof window !== 'undefined';
    });

    expect(isResponsive).toBe(true);
  });
});

test.describe('Quick Agent Validation', () => {
  test('agent should initialize correctly', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas, .btn, .panel', { timeout: 30000 });
    await page.waitForTimeout(2000);

    const hasAgent = await page.evaluate(() => {
      return !!(window as any).gameAgent;
    });

    expect(hasAgent).toBe(true);
  });

  test('agent should report status', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas, .btn, .panel', { timeout: 30000 });
    await page.waitForTimeout(2000);

    const status = await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      return agent ? agent.getStatus() : null;
    });

    expect(status).not.toBeNull();
    expect(status.isRunning).toBe(false);
  });

  test('agent can start and stop', async ({ page }) => {
    await page.goto('/');
    await page.waitForSelector('canvas, .btn, .panel', { timeout: 30000 });
    await page.waitForTimeout(2000);

    // Start agent
    await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      if (agent) agent.start('explorer');
    });

    await page.waitForTimeout(2000);

    // Check it's running
    const runningStatus = await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      return agent ? agent.getStatus() : null;
    });

    expect(runningStatus.isRunning).toBe(true);
    expect(runningStatus.actionsPerformed).toBeGreaterThan(0);

    // Stop agent
    await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      if (agent) agent.stop();
    });

    // Check it stopped
    const stoppedStatus = await page.evaluate(() => {
      const agent = (window as any).gameAgent;
      return agent ? agent.getStatus() : null;
    });

    expect(stoppedStatus.isRunning).toBe(false);
  });
});
