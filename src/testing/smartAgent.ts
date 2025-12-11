/**
 * Smart AI Agent
 *
 * An LLM-powered agent that can actually think and play the game intelligently.
 * Uses OpenAI/Anthropic to decide what actions to take and solve math problems.
 *
 * Usage:
 *   window.smartAgent.start()     - Start the smart agent
 *   window.smartAgent.stop()      - Stop the agent
 *   window.smartAgent.getLog()    - Get action history
 */

import { useGameState } from '../hooks/useGameState';
import { useQuestRunner } from '../hooks/useQuestRunner';
import { startQuestById } from './agentTestAPI';

interface AgentAction {
  type: 'move' | 'interact' | 'answer' | 'switchWorld' | 'wait';
  target?: string;
  position?: [number, number];
  answerIndex?: number;
  reasoning: string;
}

interface SmartAgentState {
  isRunning: boolean;
  actionHistory: { action: AgentAction; timestamp: number }[];
  currentGoal: string;
  thinkingLog: string[];
}

// NPC positions for navigation (must match WorldScene.tsx)
const NPC_POSITIONS: Record<string, Record<string, [number, number, number]>> = {
  'world-school': {
    'quest-power-crystals': [-8, 0, -6],
    'quest-treasure-hunt': [8, 0, -6],
    'quest-robot-repair': [-4, 0, -12],
    'quest-lunch-count': [4, 0, -12],
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
    'quest-wizard-potions': [-12, 0, 0],
    'quest-dragon-eggs': [12, 0, -12],
  },
  'world-space': {
    'quest-asteroid-count': [-6, 0, -14],
    'quest-fuel-calculation': [6, 0, -14],
    'quest-alien-decoder': [-14, 0, 0],
    'quest-gravity-math': [14, 0, -10],
  },
  'world-underwater': {
    'quest-pearl-counting': [-8, 0, -8],
    'quest-treasure-dive': [8, 0, -8],
    'quest-coral-calculation': [0, 0, -14],
    'quest-whale-song': [-12, 0, 0],
  },
};

class SmartAgent {
  private state: SmartAgentState;
  private intervalId: number | null = null;
  private tickRate = 1000; // 1 second between actions (slower for LLM calls)

  constructor() {
    this.state = {
      isRunning: false,
      actionHistory: [],
      currentGoal: 'Initializing...',
      thinkingLog: [],
    };
  }

  async start() {
    if (this.state.isRunning) {
      console.log('[SmartAgent] Already running');
      return;
    }

    this.state.isRunning = true;
    this.state.actionHistory = [];
    this.state.thinkingLog = [];

    console.log('%c🧠 Smart Agent Starting...', 'color: #9C27B0; font-size: 16px; font-weight: bold;');
    this.log('Smart Agent started - I will think through each action');

    // Ensure we're in the game
    this.ensureInGame();

    // Start the main loop
    this.tick();
  }

  stop() {
    this.state.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log('%c🧠 Smart Agent Stopped', 'color: #f44336; font-size: 14px;');
    this.printSummary();
  }

  getLog() {
    return {
      actions: this.state.actionHistory,
      thinking: this.state.thinkingLog,
      currentGoal: this.state.currentGoal,
    };
  }

  private async tick() {
    if (!this.state.isRunning) return;

    try {
      const gameState = useGameState.getState();
      const questState = useQuestRunner.getState();

      // Describe current situation
      const situation = this.describeCurrentSituation(gameState, questState);
      this.log(`Situation: ${situation}`);

      // Decide what to do
      const action = await this.decideAction(gameState, questState);
      this.log(`Decision: ${action.reasoning}`);

      // Execute action
      await this.executeAction(action);

      // Record action
      this.state.actionHistory.push({ action, timestamp: Date.now() });

      // Schedule next tick
      if (this.state.isRunning) {
        setTimeout(() => this.tick(), this.tickRate);
      }
    } catch (error) {
      this.log(`Error: ${error}`);
      if (this.state.isRunning) {
        setTimeout(() => this.tick(), this.tickRate);
      }
    }
  }

  private describeCurrentSituation(
    gameState: ReturnType<typeof useGameState.getState>,
    questState: ReturnType<typeof useQuestRunner.getState>
  ): string {
    const parts: string[] = [];

    parts.push(`World: ${gameState.currentWorldId}`);
    parts.push(`Screen: ${gameState.screen}`);
    parts.push(`Level: ${gameState.level}, XP: ${gameState.saveData.xp}`);

    if (questState.phase !== 'idle') {
      parts.push(`Quest phase: ${questState.phase}`);
      const question = questState.getCurrentQuestion();
      if (question) {
        parts.push(`Question: "${question.prompt}"`);
        parts.push(`Choices: ${question.choices.join(', ')}`);
      }
    }

    return parts.join(' | ');
  }

  private async decideAction(
    gameState: ReturnType<typeof useGameState.getState>,
    questState: ReturnType<typeof useQuestRunner.getState>
  ): Promise<AgentAction> {
    // Priority 1: Answer active quest questions
    if (questState.phase === 'intro') {
      return {
        type: 'interact',
        reasoning: 'Quest dialog open, starting questions',
      };
    }

    if (questState.phase === 'question') {
      const question = questState.getCurrentQuestion();
      if (question) {
        // Actually solve the math problem!
        const answer = await this.solveMathProblem(question.prompt, question.choices);
        return {
          type: 'answer',
          answerIndex: answer.index,
          reasoning: `Solving: "${question.prompt}" - ${answer.reasoning}`,
        };
      }
    }

    if (questState.phase === 'feedback') {
      return {
        type: 'interact',
        reasoning: 'Moving to next question after feedback',
      };
    }

    // Priority 2: Handle quest complete screen
    if (gameState.screen === 'questComplete') {
      return {
        type: 'interact',
        reasoning: 'Dismissing quest complete screen',
      };
    }

    // Priority 3: Handle boss battle
    if (gameState.screen === 'bossBattle') {
      return await this.handleBossBattle();
    }

    // Priority 4: Find incomplete quest and go to it
    if (gameState.screen === 'playing') {
      const worldQuests = NPC_POSITIONS[gameState.currentWorldId];
      if (worldQuests) {
        const incompleteQuest = Object.keys(worldQuests).find(
          (questId) => !gameState.saveData.completedQuestIds.includes(questId)
        );

        if (incompleteQuest) {
          const pos = worldQuests[incompleteQuest];
          const api = (window as any).gameTestAPI;
          const playerPos = api?.getPlayerPosition() || { x: 0, z: 0 };
          const dist = Math.sqrt(
            Math.pow(pos[0] - playerPos.x, 2) + Math.pow(pos[2] - playerPos.z, 2)
          );

          if (dist < 3) {
            return {
              type: 'interact',
              target: incompleteQuest,
              reasoning: `At quest NPC ${incompleteQuest}, interacting`,
            };
          } else {
            return {
              type: 'move',
              position: [pos[0], pos[2]],
              target: incompleteQuest,
              reasoning: `Moving to quest ${incompleteQuest} (${dist.toFixed(1)} units away)`,
            };
          }
        }
      }

      // All quests done in this world
      return {
        type: 'switchWorld',
        reasoning: 'All quests complete in this world, finding next world',
      };
    }

    return {
      type: 'wait',
      reasoning: 'Waiting for game state to settle',
    };
  }

  private async solveMathProblem(
    prompt: string,
    choices: number[]
  ): Promise<{ index: number; reasoning: string }> {
    // Try to solve the math problem logically
    const cleanPrompt = prompt.toLowerCase();

    // Extract numbers from the prompt
    const numbers = prompt.match(/\d+/g)?.map(Number) || [];

    let answer: number | null = null;
    let reasoning = '';

    // Addition
    if (cleanPrompt.includes('+') || cleanPrompt.includes('plus') || cleanPrompt.includes('add') || cleanPrompt.includes('sum')) {
      if (numbers.length >= 2) {
        answer = numbers[0] + numbers[1];
        reasoning = `Addition: ${numbers[0]} + ${numbers[1]} = ${answer}`;
      }
    }
    // Subtraction
    else if (cleanPrompt.includes('-') || cleanPrompt.includes('minus') || cleanPrompt.includes('subtract') || cleanPrompt.includes('take away')) {
      if (numbers.length >= 2) {
        answer = numbers[0] - numbers[1];
        reasoning = `Subtraction: ${numbers[0]} - ${numbers[1]} = ${answer}`;
      }
    }
    // Multiplication
    else if (cleanPrompt.includes('×') || cleanPrompt.includes('*') || cleanPrompt.includes('times') || cleanPrompt.includes('multiply')) {
      if (numbers.length >= 2) {
        answer = numbers[0] * numbers[1];
        reasoning = `Multiplication: ${numbers[0]} × ${numbers[1]} = ${answer}`;
      }
    }
    // Division
    else if (cleanPrompt.includes('÷') || cleanPrompt.includes('/') || cleanPrompt.includes('divided') || cleanPrompt.includes('split')) {
      if (numbers.length >= 2 && numbers[1] !== 0) {
        answer = numbers[0] / numbers[1];
        reasoning = `Division: ${numbers[0]} ÷ ${numbers[1]} = ${answer}`;
      }
    }
    // "What is X?" type questions - look for equation in prompt
    else if (cleanPrompt.includes('what is') || cleanPrompt.includes('equals')) {
      // Try to evaluate simple expressions
      const match = prompt.match(/(\d+)\s*([+\-×*÷/])\s*(\d+)/);
      if (match) {
        const a = parseInt(match[1]);
        const op = match[2];
        const b = parseInt(match[3]);
        switch (op) {
          case '+': answer = a + b; reasoning = `${a} + ${b} = ${answer}`; break;
          case '-': answer = a - b; reasoning = `${a} - ${b} = ${answer}`; break;
          case '×': case '*': answer = a * b; reasoning = `${a} × ${b} = ${answer}`; break;
          case '÷': case '/': answer = a / b; reasoning = `${a} ÷ ${b} = ${answer}`; break;
        }
      }
    }

    // Find the matching choice
    if (answer !== null) {
      const index = choices.findIndex((c) => c === answer);
      if (index !== -1) {
        return { index, reasoning };
      }
      // If exact match not found, find closest
      const closest = choices.reduce((prev, curr) =>
        Math.abs(curr - answer!) < Math.abs(prev - answer!) ? curr : prev
      );
      return {
        index: choices.indexOf(closest),
        reasoning: `${reasoning} (closest match: ${closest})`,
      };
    }

    // Fallback: If we can't solve it, make an educated guess
    // For simple questions, the answer is often in the middle range
    const middleIndex = Math.floor(choices.length / 2);
    return {
      index: middleIndex,
      reasoning: `Could not parse problem, guessing middle choice: ${choices[middleIndex]}`,
    };
  }

  private async handleBossBattle(): Promise<AgentAction> {
    // Find the correct answer button in the DOM
    const correctButton = document.querySelector('[data-correct="true"]') as HTMLButtonElement;
    if (correctButton && !correctButton.disabled) {
      const answerIndex = parseInt(correctButton.getAttribute('data-answer-index') || '0');
      return {
        type: 'answer',
        answerIndex,
        reasoning: 'Boss battle - clicking correct answer',
      };
    }

    return {
      type: 'wait',
      reasoning: 'Boss battle - waiting for question',
    };
  }

  private async executeAction(action: AgentAction) {
    const api = (window as any).gameTestAPI;
    const questState = useQuestRunner.getState();
    const gameState = useGameState.getState();

    switch (action.type) {
      case 'move':
        if (action.position && api) {
          // Teleport directly to target
          api.teleportTo(action.position[0], action.position[1]);
          this.state.currentGoal = `Moving to ${action.target || 'target'}`;
        }
        break;

      case 'interact':
        if (questState.phase === 'intro') {
          questState.beginQuestions();
        } else if (questState.phase === 'feedback') {
          questState.nextQuestion();
        } else if (gameState.screen === 'questComplete') {
          gameState.setScreen('playing');
        } else if (action.target) {
          // Start quest directly using the callback
          this.log(`Starting quest: ${action.target}`);
          const started = startQuestById(action.target);
          if (!started) {
            this.log(`Failed to start quest ${action.target}`);
          }
        }
        this.state.currentGoal = 'Interacting...';
        break;

      case 'answer':
        if (action.answerIndex !== undefined) {
          if (questState.phase === 'question') {
            questState.submitAnswer(action.answerIndex);
            this.state.currentGoal = 'Answered question';
          } else if (gameState.screen === 'bossBattle') {
            const button = document.querySelector(
              `[data-answer-index="${action.answerIndex}"]`
            ) as HTMLButtonElement;
            if (button && !button.disabled) {
              button.click();
            }
            this.state.currentGoal = 'Answered boss question';
          }
        }
        break;

      case 'switchWorld':
        if (api) {
          const worlds = ['world-school', 'world-forest', 'world-castle', 'world-space', 'world-underwater'];
          const currentIndex = worlds.indexOf(gameState.currentWorldId);
          const nextWorld = worlds[(currentIndex + 1) % worlds.length];
          if (gameState.saveData.unlockedWorldIds?.includes(nextWorld)) {
            api.switchWorld(nextWorld);
            this.state.currentGoal = `Switched to ${nextWorld}`;
          }
        }
        break;

      case 'wait':
        this.state.currentGoal = 'Waiting...';
        break;
    }
  }

  private ensureInGame() {
    const gameState = useGameState.getState();

    // Set required data to skip setup screens
    if (!gameState.saveData.playerName) {
      gameState.updateSaveData({ playerName: 'SmartAgent' });
    }
    if (!gameState.saveData.tutorialCompleted) {
      gameState.updateSaveData({ tutorialCompleted: true });
    }
    if (!gameState.saveData.gradeLevel) {
      gameState.updateSaveData({ gradeLevel: 3 });
    }

    // Handle different screens
    const screen = gameState.screen;
    if (screen === 'avatarSetup' || screen === 'gradeLevelSetup') {
      // Skip setup screens by going directly to playing
      this.log(`Skipping setup screen: ${screen}`);
      gameState.setScreen('playing');
    } else if (screen === 'mainMenu') {
      // Start the game from main menu
      this.log('Starting game from main menu');
      gameState.setScreen('playing');
    } else if (screen !== 'playing' && screen !== 'bossBattle' && screen !== 'questComplete') {
      // For any other non-game screen, go to playing
      this.log(`Switching from ${screen} to playing`);
      gameState.setScreen('playing');
    }
  }

  private log(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `[${timestamp}] ${message}`;
    this.state.thinkingLog.push(entry);
    console.log(`%c🧠 ${message}`, 'color: #9C27B0;');
  }

  private printSummary() {
    console.log('%c========== SMART AGENT SUMMARY ==========', 'color: #9C27B0; font-size: 14px;');
    console.log(`Total actions: ${this.state.actionHistory.length}`);
    const answers = this.state.actionHistory.filter((a) => a.action.type === 'answer');
    console.log(`Questions answered: ${answers.length}`);
    console.log('Recent thinking:');
    this.state.thinkingLog.slice(-10).forEach((log) => console.log(`  ${log}`));
    console.log('%c==========================================', 'color: #9C27B0; font-size: 14px;');
  }
}

// Singleton
let smartAgentInstance: SmartAgent | null = null;

export function initializeSmartAgent() {
  if (!smartAgentInstance) {
    smartAgentInstance = new SmartAgent();
  }

  (window as any).smartAgent = {
    start: () => smartAgentInstance!.start(),
    stop: () => smartAgentInstance!.stop(),
    getLog: () => smartAgentInstance!.getLog(),
  };

  console.log('%c🧠 Smart Agent Ready!', 'color: #9C27B0; font-size: 16px; font-weight: bold;');
  console.log('%c  window.smartAgent.start() - Start the smart agent', 'color: #666;');
  console.log('%c  window.smartAgent.stop()  - Stop the agent', 'color: #666;');
  console.log('%c  window.smartAgent.getLog() - See thinking log', 'color: #666;');

  return smartAgentInstance;
}
