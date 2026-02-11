import { useState, useCallback } from 'react';
import { voiceService } from '../services/voiceService';

export const useVoiceSynthesis = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);

  const speak = useCallback(async (text) => {
    try {
      setError(null);
      setIsSpeaking(true);
      await voiceService.speak(text);
      setIsSpeaking(false);
    } catch (err) {
      setError(err.message);
      setIsSpeaking(false);
    }
  }, []);

  const stop = useCallback(() => {
    voiceService.stopSpeaking();
    setIsSpeaking(false);
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    error
  };
};
