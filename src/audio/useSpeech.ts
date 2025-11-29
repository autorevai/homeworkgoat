/**
 * React hook for text-to-speech functionality
 */

import { useState, useCallback } from 'react';
import { speak, stopSpeaking, isSpeaking } from './textToSpeech';

export function useSpeech() {
  const [speaking, setSpeaking] = useState(false);

  const speakText = useCallback(async (text: string) => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }

    await speak(
      text,
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
