/**
 * Abilities System
 * Special powers that students unlock as they level up.
 */

export type AbilityEffect = 
  | 'hint'        // Shows a helpful hint
  | 'skip'        // Skip question without penalty
  | 'double-xp'   // Double XP for next N correct answers
  | 'time-freeze' // Pause timer in boss battles
  | 'fifty-fifty' // Remove two wrong answers
  | 'second-chance'; // Get another try on wrong answer

export interface Ability {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockLevel: number;
  cooldown: number; // Questions between uses
  effect: AbilityEffect;
  effectValue?: number; // For effects that need a value (e.g., double-xp duration)
}

export interface AbilityState {
  abilityId: string;
  isUnlocked: boolean;
  currentCooldown: number; // Questions until available again
  timesUsed: number;
}

export const abilities: Ability[] = [
  // =====================================================
  // TIER 1 - Early Game (Level 1-3)
  // =====================================================
  {
    id: 'ability-hint',
    name: 'Wisdom Whisper',
    description: 'Get a helpful hint for the current question',
    icon: '💡',
    unlockLevel: 1, // Available from start
    cooldown: 3,
    effect: 'hint',
  },

  // =====================================================
  // TIER 2 - Beginner (Level 4-6)
  // =====================================================
  {
    id: 'ability-fifty-fifty',
    name: 'Split Decision',
    description: 'Remove two wrong answers, leaving just two choices',
    icon: '✂️',
    unlockLevel: 4,
    cooldown: 5,
    effect: 'fifty-fifty',
  },
  {
    id: 'ability-second-chance',
    name: 'Do-Over',
    description: 'If you answer wrong, get one more try!',
    icon: '🔄',
    unlockLevel: 5,
    cooldown: 6,
    effect: 'second-chance',
  },

  // =====================================================
  // TIER 3 - Intermediate (Level 7-9)
  // =====================================================
  {
    id: 'ability-skip',
    name: 'Tactical Retreat',
    description: 'Skip this question without losing progress',
    icon: '⏭️',
    unlockLevel: 7,
    cooldown: 8,
    effect: 'skip',
  },
  {
    id: 'ability-time-freeze',
    name: 'Time Stop',
    description: 'Pause the timer for 30 seconds in boss battles',
    icon: '⏸️',
    unlockLevel: 8,
    cooldown: 10,
    effect: 'time-freeze',
    effectValue: 30, // seconds
  },

  // =====================================================
  // TIER 4 - Advanced (Level 10+)
  // =====================================================
  {
    id: 'ability-double-xp',
    name: 'XP Surge',
    description: 'Double XP for your next 3 correct answers',
    icon: '⚡',
    unlockLevel: 10,
    cooldown: 12,
    effect: 'double-xp',
    effectValue: 3, // number of answers affected
  },
];

/**
 * Get ability by ID
 */
export function getAbilityById(id: string): Ability | undefined {
  return abilities.find((a) => a.id === id);
}

/**
 * Get all abilities unlocked at a certain level
 */
export function getUnlockedAbilities(level: number): Ability[] {
  return abilities.filter((a) => a.unlockLevel <= level);
}

/**
 * Get next ability to unlock
 */
export function getNextAbilityToUnlock(level: number): Ability | null {
  const locked = abilities.filter((a) => a.unlockLevel > level);
  if (locked.length === 0) return null;
  return locked.reduce((min, curr) => 
    curr.unlockLevel < min.unlockLevel ? curr : min
  );
}

/**
 * Check if an ability is ready to use (not on cooldown)
 */
export function isAbilityReady(state: AbilityState): boolean {
  return state.isUnlocked && state.currentCooldown === 0;
}

/**
 * Alias for isAbilityReady for clearer API
 */
export function canUseAbility(state: AbilityState): boolean {
  return isAbilityReady(state);
}

/**
 * Create initial ability states for a player
 */
export function createInitialAbilityStates(level: number): Record<string, AbilityState> {
  const states: Record<string, AbilityState> = {};

  for (const ability of abilities) {
    states[ability.id] = {
      abilityId: ability.id,
      isUnlocked: ability.unlockLevel <= level,
      currentCooldown: 0,
      timesUsed: 0,
    };
  }

  return states;
}

/**
 * Use an ability and start its cooldown
 */
export function useAbility(
  states: Record<string, AbilityState>,
  abilityId: string
): Record<string, AbilityState> {
  const ability = getAbilityById(abilityId);
  if (!ability) return states;

  const state = states[abilityId];
  if (!state || !state.isUnlocked || state.currentCooldown > 0) {
    return states;
  }

  return {
    ...states,
    [abilityId]: {
      ...state,
      currentCooldown: ability.cooldown,
      timesUsed: state.timesUsed + 1,
    },
  };
}

/**
 * Tick cooldowns after answering a question
 */
export function tickCooldowns(states: Record<string, AbilityState>): Record<string, AbilityState> {
  const newStates: Record<string, AbilityState> = {};

  for (const [id, state] of Object.entries(states)) {
    newStates[id] = {
      ...state,
      currentCooldown: Math.max(0, state.currentCooldown - 1),
    };
  }

  return newStates;
}

/**
 * Update unlocked abilities when player levels up
 */
export function updateUnlockedAbilities(
  states: Record<string, AbilityState>,
  newLevel: number
): { states: Record<string, AbilityState>; newlyUnlocked: Ability[] } {
  const newStates: Record<string, AbilityState> = { ...states };
  const newlyUnlocked: Ability[] = [];

  for (const ability of abilities) {
    if (ability.unlockLevel <= newLevel && !states[ability.id]?.isUnlocked) {
      newStates[ability.id] = {
        abilityId: ability.id,
        isUnlocked: true,
        currentCooldown: 0,
        timesUsed: 0,
      };
      newlyUnlocked.push(ability);
    }
  }

  return { states: newStates, newlyUnlocked };
}

/**
 * Get effect description for UI
 */
export function getEffectDescription(effect: AbilityEffect): string {
  switch (effect) {
    case 'hint':
      return 'Shows a helpful hint';
    case 'skip':
      return 'Skip without penalty';
    case 'double-xp':
      return 'Doubles XP earned';
    case 'time-freeze':
      return 'Pauses boss timer';
    case 'fifty-fifty':
      return 'Removes 2 wrong answers';
    case 'second-chance':
      return 'Try again if wrong';
    default:
      return 'Special effect';
  }
}
