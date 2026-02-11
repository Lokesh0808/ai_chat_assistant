import { useState, useCallback, useEffect, useRef } from 'react';
import { voiceService } from '../services/voiceService';

export const useVoiceRecognition = () => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const [completedText, setCompletedText] = useState('');
  const finalTranscriptRef = useRef('');

  const handleTranscript = useCallback((data) => {
    setInterimTranscript(data.interim);
    // Show both final and interim in the transcript display
    const displayText = data.final + (data.interim ? ' ' + data.interim : '');
    setTranscript(displayText);
    if (data.isFinal && data.final) {
      finalTranscriptRef.current = data.final;
    }
  }, []);

  const handleSilence = useCallback(() => {
    setCompletedText(finalTranscriptRef.current);
    finalTranscriptRef.current = '';
    setTranscript('');
  }, []);

  const handleError = useCallback((err, message) => {
    console.error('Voice recognition error:', err, message);
    
    // Map error codes to user-friendly messages
    const errorMessages = {
      'no-speech': 'No speech was detected. Please try again.',
      'audio-capture': 'No microphone found. Please check your device settings.',
      'not-allowed': 'Microphone permission denied. Please allow access in browser settings.',
      'network': 'Network error. Please check your connection.',
      'not-supported': 'Voice recognition is not supported in your browser. Please use Chrome, Edge, or Firefox.',
      'start-failed': 'Failed to start voice recognition. Please try again.',
      'bad-grammar': 'Grammar error. Please try again.',
      'service-not-allowed': 'Speech recognition service is not allowed. Check browser settings.'
    };
    
    const displayMessage = message || errorMessages[err] || `Voice recognition error: ${err}`;
    setError(displayMessage);
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setCompletedText('');
    setError(null);
    
    voiceService.startListening(
      handleTranscript,
      () => setIsListening(false),
      handleError,
      handleSilence
    );
    setIsListening(true);
  }, [handleTranscript, handleError, handleSilence]);

  const stopListening = useCallback(() => {
    voiceService.stopListening();
    setIsListening(false);
    if (finalTranscriptRef.current) {
      setCompletedText(finalTranscriptRef.current);
    }
  }, []);

  const reset = useCallback(() => {
    finalTranscriptRef.current = '';
    setTranscript('');
    setInterimTranscript('');
    setCompletedText('');
    setError(null);
  }, []);

  return {
    transcript,
    interimTranscript,
    isListening,
    error,
    completedText,
    startListening,
    stopListening,
    reset
  };
};
