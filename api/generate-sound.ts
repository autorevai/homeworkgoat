/**
 * Vercel Serverless Function: Generate Sound Effect
 * Uses ElevenLabs API to generate sound effects from text descriptions
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/sound-generation';

// Predefined sound effect prompts for the game
const SOUND_PROMPTS: Record<string, string> = {
  // UI Sounds
  'button-click': 'Short soft click sound, UI button press, clean and satisfying',
  'menu-open': 'Gentle whoosh sound, menu appearing, soft and welcoming',
  'menu-close': 'Quick soft swoosh, menu closing, subtle',

  // Quest & Achievement
  'quest-start': 'Magical sparkle sound with rising tone, adventure beginning, enchanting',
  'quest-complete': 'Triumphant fanfare, short victory jingle, celebratory and happy',
  'achievement-unlock': 'Bright magical chime with sparkles, achievement unlocked, rewarding',
  'level-up': 'Ascending magical tones with shimmer, power gained, epic and satisfying',

  // Combat & Boss
  'correct-answer': 'Bright positive ding, correct answer feedback, cheerful',
  'wrong-answer': 'Soft low buzz, incorrect answer, gentle not harsh',
  'boss-damage': 'Impact thud with magical crack, boss taking damage, powerful',
  'boss-defeat': 'Epic victory fanfare with magical explosion, boss defeated, triumphant',
  'speed-bonus': 'Quick ascending whoosh, speed bonus achieved, exciting',

  // Exploration
  'chest-open': 'Wooden creak followed by magical sparkle, treasure chest opening, mysterious and rewarding',
  'shard-collect': 'Crystal chime with magical shimmer, collecting gem, satisfying',
  'footsteps': 'Soft footstep on grass, walking sound, natural',
  'npc-interact': 'Friendly pop sound, character interaction, inviting',

  // Ambient
  'coin-collect': 'Quick coin jingle, collecting currency, classic game sound',
  'xp-gain': 'Soft ascending sparkle, experience gained, subtle and pleasant',
  'error': 'Soft warning tone, something went wrong, not harsh',
  'notification': 'Gentle bell chime, attention needed, pleasant',
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check for API key
  if (!ELEVENLABS_API_KEY) {
    return res.status(500).json({ error: 'ElevenLabs API key not configured' });
  }

  try {
    const { soundId, customPrompt, duration } = req.body;

    // Get the prompt - either from predefined sounds or custom
    let prompt: string;
    if (soundId && SOUND_PROMPTS[soundId]) {
      prompt = SOUND_PROMPTS[soundId];
    } else if (customPrompt) {
      prompt = customPrompt;
    } else {
      return res.status(400).json({
        error: 'Missing soundId or customPrompt',
        availableSounds: Object.keys(SOUND_PROMPTS),
      });
    }

    // Call ElevenLabs API
    const response = await fetch(ELEVENLABS_API_URL, {
      method: 'POST',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        duration_seconds: duration || undefined, // Let API auto-determine if not specified
        prompt_influence: 0.4, // Moderate prompt adherence
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ElevenLabs API error:', errorText);
      return res.status(response.status).json({
        error: 'Sound generation failed',
        details: errorText,
      });
    }

    // Get the audio data
    const audioBuffer = await response.arrayBuffer();

    // Return the audio as base64 for easy client-side use
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return res.status(200).json({
      success: true,
      soundId: soundId || 'custom',
      audio: base64Audio,
      mimeType: 'audio/mpeg',
    });

  } catch (error) {
    console.error('Sound generation error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
