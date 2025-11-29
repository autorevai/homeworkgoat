/**
 * Sound Manager
 * Handles sound effect playback with caching and generation via ElevenLabs API.
 * Falls back to Web Audio API synthesized sounds if API is unavailable.
 */

// Sound IDs available in the game
export type SoundId =
  | 'button-click'
  | 'menu-open'
  | 'menu-close'
  | 'quest-start'
  | 'quest-complete'
  | 'achievement-unlock'
  | 'level-up'
  | 'correct-answer'
  | 'wrong-answer'
  | 'boss-damage'
  | 'boss-defeat'
  | 'speed-bonus'
  | 'chest-open'
  | 'shard-collect'
  | 'footsteps'
  | 'npc-interact'
  | 'coin-collect'
  | 'xp-gain'
  | 'error'
  | 'notification';

// Cache for generated audio
const audioCache: Map<string, HTMLAudioElement> = new Map();

// Audio context for fallback synthesized sounds
let audioContext: AudioContext | null = null;

// Sound enabled state
let soundEnabled = true;

// Loading state
const loadingPromises: Map<string, Promise<HTMLAudioElement | null>> = new Map();

/**
 * Initialize the audio context (must be called after user interaction)
 */
export function initAudio(): void {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
}

/**
 * Set whether sounds are enabled
 */
export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

/**
 * Check if sounds are enabled
 */
export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Generate a sound from the API and cache it
 */
async function generateSound(soundId: SoundId): Promise<HTMLAudioElement | null> {
  try {
    const response = await fetch('/api/generate-sound', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ soundId }),
    });

    if (!response.ok) {
      console.warn(`Failed to generate sound ${soundId}:`, await response.text());
      return null;
    }

    const data = await response.json();
    if (!data.success || !data.audio) {
      return null;
    }

    // Create audio element from base64
    const audio = new Audio(`data:${data.mimeType};base64,${data.audio}`);
    audio.preload = 'auto';

    // Wait for it to load
    await new Promise<void>((resolve, reject) => {
      audio.oncanplaythrough = () => resolve();
      audio.onerror = () => reject(new Error('Failed to load audio'));
      // Timeout after 5 seconds
      setTimeout(() => resolve(), 5000);
    });

    return audio;

  } catch (error) {
    console.warn(`Error generating sound ${soundId}:`, error);
    return null;
  }
}

/**
 * Get or generate a sound
 */
async function getSound(soundId: SoundId): Promise<HTMLAudioElement | null> {
  // Check cache first
  if (audioCache.has(soundId)) {
    return audioCache.get(soundId)!;
  }

  // Check if already loading
  if (loadingPromises.has(soundId)) {
    return loadingPromises.get(soundId)!;
  }

  // Start loading
  const loadPromise = generateSound(soundId);
  loadingPromises.set(soundId, loadPromise);

  const audio = await loadPromise;
  loadingPromises.delete(soundId);

  if (audio) {
    audioCache.set(soundId, audio);
  }

  return audio;
}

/**
 * Play a synthesized fallback sound using Web Audio API
 */
function playFallbackSound(soundId: SoundId): void {
  if (!audioContext) {
    initAudio();
  }
  if (!audioContext) return;

  const ctx = audioContext;
  const now = ctx.currentTime;

  // Create oscillator for simple tones
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  // Configure based on sound type
  switch (soundId) {
    case 'button-click':
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.05);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
      break;

    case 'correct-answer':
      oscillator.frequency.value = 523.25; // C5
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.15, now);
      oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;

    case 'wrong-answer':
      oscillator.frequency.value = 200;
      oscillator.type = 'sawtooth';
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
      break;

    case 'quest-complete':
    case 'achievement-unlock':
      // Play a short ascending arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.12, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.1 + 0.15);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.15);
      });
      return; // Don't use the default oscillator

    case 'level-up':
      oscillator.frequency.value = 440;
      oscillator.type = 'sine';
      oscillator.frequency.exponentialRampToValueAtTime(880, now + 0.3);
      gainNode.gain.setValueAtTime(0.15, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;

    case 'coin-collect':
    case 'xp-gain':
      oscillator.frequency.value = 1200;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.1, now);
      oscillator.frequency.exponentialRampToValueAtTime(1800, now + 0.08);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;

    case 'chest-open':
    case 'shard-collect':
      oscillator.frequency.value = 600;
      oscillator.type = 'triangle';
      oscillator.frequency.exponentialRampToValueAtTime(1200, now + 0.2);
      gainNode.gain.setValueAtTime(0.12, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.3);
      oscillator.start(now);
      oscillator.stop(now + 0.3);
      break;

    case 'boss-damage':
      oscillator.frequency.value = 150;
      oscillator.type = 'square';
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.1);
      oscillator.start(now);
      oscillator.stop(now + 0.1);
      break;

    case 'boss-defeat':
      // Play victory sound
      const victoryNotes = [392, 523.25, 659.25, 783.99]; // G4, C5, E5, G5
      victoryNotes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.15, now + i * 0.15);
        gain.gain.linearRampToValueAtTime(0.01, now + i * 0.15 + 0.2);
        osc.start(now + i * 0.15);
        osc.stop(now + i * 0.15 + 0.2);
      });
      return;

    default:
      // Default soft click
      oscillator.frequency.value = 600;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.08, now);
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.05);
      oscillator.start(now);
      oscillator.stop(now + 0.05);
  }
}

/**
 * Play a sound effect
 * @param soundId The sound to play
 * @param options Optional configuration
 */
export async function playSound(
  soundId: SoundId,
  options: { volume?: number; fallbackOnly?: boolean } = {}
): Promise<void> {
  if (!soundEnabled) return;

  const { volume = 1.0, fallbackOnly = false } = options;

  // Initialize audio context on first play (requires user interaction)
  if (!audioContext) {
    initAudio();
  }

  // If fallbackOnly, just play synthesized sound
  if (fallbackOnly) {
    playFallbackSound(soundId);
    return;
  }

  // Try to get cached/generated sound
  const audio = await getSound(soundId);

  if (audio) {
    // Clone the audio element for overlapping plays
    const clone = audio.cloneNode() as HTMLAudioElement;
    clone.volume = Math.max(0, Math.min(1, volume));

    try {
      await clone.play();
    } catch (error) {
      // If autoplay blocked, fall back to synthesized
      console.warn('Autoplay blocked, using fallback sound');
      playFallbackSound(soundId);
    }
  } else {
    // Fall back to synthesized sound
    playFallbackSound(soundId);
  }
}

/**
 * Preload a set of sounds for faster playback
 */
export async function preloadSounds(soundIds: SoundId[]): Promise<void> {
  await Promise.all(soundIds.map(id => getSound(id)));
}

/**
 * Clear the audio cache
 */
export function clearAudioCache(): void {
  audioCache.clear();
}

// Export the sound list for reference
export const AVAILABLE_SOUNDS: SoundId[] = [
  'button-click',
  'menu-open',
  'menu-close',
  'quest-start',
  'quest-complete',
  'achievement-unlock',
  'level-up',
  'correct-answer',
  'wrong-answer',
  'boss-damage',
  'boss-defeat',
  'speed-bonus',
  'chest-open',
  'shard-collect',
  'footsteps',
  'npc-interact',
  'coin-collect',
  'xp-gain',
  'error',
  'notification',
];
