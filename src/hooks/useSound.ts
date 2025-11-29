/**
 * useSound Hook
 * React hook for playing sound effects in components.
 */

import { useCallback, useEffect } from 'react';
import { useGameState } from './useGameState';
import {
  playSound as playSoundEffect,
  initAudio,
  setSoundEnabled,
  type SoundId,
} from '../audio/soundManager';

/**
 * Hook for playing sound effects
 * Automatically syncs with the game's audio settings
 */
export function useSound() {
  const { saveData } = useGameState();

  // Sync sound enabled state with game settings
  useEffect(() => {
    setSoundEnabled(saveData.audioEnabled);
  }, [saveData.audioEnabled]);

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudio();
      // Remove listeners after first interaction
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('keydown', handleInteraction);

    return () => {
      document.removeEventListener('click', handleInteraction);
      document.removeEventListener('keydown', handleInteraction);
    };
  }, []);

  /**
   * Play a sound effect
   * @param soundId The sound to play
   * @param volume Optional volume (0-1)
   */
  const playSound = useCallback((soundId: SoundId, volume?: number) => {
    // Try ElevenLabs API first, automatically falls back to Web Audio API synthesized sounds
    playSoundEffect(soundId, { volume });
  }, []);

  return { playSound };
}

/**
 * Common sound effect triggers
 * Use these in components for consistent sound usage
 */
export const SoundTriggers = {
  // UI interactions
  buttonClick: 'button-click' as SoundId,
  menuOpen: 'menu-open' as SoundId,
  menuClose: 'menu-close' as SoundId,

  // Quest & Achievement
  questStart: 'quest-start' as SoundId,
  questComplete: 'quest-complete' as SoundId,
  achievementUnlock: 'achievement-unlock' as SoundId,
  levelUp: 'level-up' as SoundId,

  // Combat & Answers
  correctAnswer: 'correct-answer' as SoundId,
  wrongAnswer: 'wrong-answer' as SoundId,
  bossDamage: 'boss-damage' as SoundId,
  bossDefeat: 'boss-defeat' as SoundId,
  speedBonus: 'speed-bonus' as SoundId,

  // Exploration
  chestOpen: 'chest-open' as SoundId,
  shardCollect: 'shard-collect' as SoundId,
  npcInteract: 'npc-interact' as SoundId,

  // Rewards
  coinCollect: 'coin-collect' as SoundId,
  xpGain: 'xp-gain' as SoundId,

  // Feedback
  error: 'error' as SoundId,
  notification: 'notification' as SoundId,
};
