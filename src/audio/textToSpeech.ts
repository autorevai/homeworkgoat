/**
 * Text-to-Speech Service using ElevenLabs
 * Provides audio support for students who need help reading.
 */

import { logger } from '../utils/logger';

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

// Friendly voice IDs from ElevenLabs (using pre-made voices)
export const VOICES = {
  // Rachel - calm, friendly female voice (good for NPC/teacher)
  npc: '21m00Tcm4TlvDq8ikWAM',
  // Josh - friendly male voice (alternative)
  narrator: 'TxGEqnHWrfWFTfGW9XjX',
} as const;

type VoiceType = keyof typeof VOICES;

// Cache for audio to avoid re-fetching the same text
const audioCache = new Map<string, HTMLAudioElement>();

// Current playing audio
let currentAudio: HTMLAudioElement | null = null;

/**
 * Speaks the given text using ElevenLabs TTS
 */
export async function speak(
  text: string,
  voiceType: VoiceType = 'npc',
  onStart?: () => void,
  onEnd?: () => void
): Promise<void> {
  if (!ELEVENLABS_API_KEY) {
    logger.warn('audio', 'elevenlabs_api_key_missing');
    return;
  }

  logger.audio.ttsStarted(text.length, voiceType);

  // Stop any currently playing audio
  stopSpeaking();

  const cacheKey = `${voiceType}:${text}`;

  // Check cache first
  if (audioCache.has(cacheKey)) {
    logger.audio.ttsCacheHit();
    const cachedAudio = audioCache.get(cacheKey)!;
    currentAudio = cachedAudio;
    cachedAudio.currentTime = 0;

    if (onStart) onStart();
    cachedAudio.onended = () => {
      currentAudio = null;
      logger.audio.ttsCompleted(text.length);
      if (onEnd) onEnd();
    };

    await cachedAudio.play();
    return;
  }

  try {
    const voiceId = VOICES[voiceType];
    const startTime = performance.now();

    const response = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.75,
          similarity_boost: 0.75,
          style: 0.5,
          use_speaker_boost: true,
        },
      }),
    });

    const latency = Math.round(performance.now() - startTime);
    logger.performance.apiLatency('elevenlabs_tts', latency);

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Cache the audio
    audioCache.set(cacheKey, audio);
    currentAudio = audio;

    if (onStart) onStart();
    audio.onended = () => {
      currentAudio = null;
      logger.audio.ttsCompleted(text.length);
      if (onEnd) onEnd();
    };

    await audio.play();
  } catch (error) {
    logger.audio.ttsError(error instanceof Error ? error.message : 'Unknown error');
    currentAudio = null;
    if (onEnd) onEnd();
  }
}

/**
 * Stops any currently playing speech
 */
export function stopSpeaking(): void {
  if (currentAudio) {
    logger.audio.ttsStopped();
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

/**
 * Checks if audio is currently playing
 */
export function isSpeaking(): boolean {
  return currentAudio !== null && !currentAudio.paused;
}

/**
 * Clears the audio cache (useful for memory management)
 */
export function clearAudioCache(): void {
  audioCache.forEach((audio) => {
    URL.revokeObjectURL(audio.src);
  });
  audioCache.clear();
}
