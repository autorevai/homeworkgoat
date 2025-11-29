/**
 * React hook for text-to-speech functionality
 */

import { useState, useCallback } from 'react';
import { speak, stopSpeaking, isSpeaking } from './textToSpeech';

/**
 * Convert math symbols to spoken words for TTS
 */
function convertMathSymbolsToWords(text: string): string {
  return text
    .replace(/×/g, ' times ')
    .replace(/÷/g, ' divided by ')
    .replace(/\+/g, ' plus ')
    .replace(/-/g, ' minus ')
    .replace(/=/g, ' equals ')
    .replace(/\?/g, ' what?')
    .replace(/\s+/g, ' ') // Clean up extra spaces
    .trim();
}

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speakText = useCallback(async (text: string) => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    // Convert math symbols to spoken words
    const spokenText = convertMathSymbolsToWords(text);

    await speak(
      spokenText,
      'npc',
      () => setSpeaking(true),
      () => setSpeaking(false)
    );
  }, [speaking]);

  const stop = useCallback(() => {
    stopSpeaking();
    setSpeaking(false);
  }, []);

  return {
    speaking,
    speakText,
    stop,
    isSpeaking: () => isSpeaking(),
  };
}
