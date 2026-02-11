import React from 'react';
import { Mic, Square, AlertCircle } from 'lucide-react';

export const MicrophoneButton = ({ isListening, isSpeaking, onClick, disabled, hasError }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={disabled ? 'Microphone not available' : 'Click to speak'}
      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 font-semibold ${
        hasError
          ? 'bg-red-500 hover:bg-red-600'
          : isListening
          ? 'animate-pulse-active bg-blue-500 hover:bg-blue-600'
          : isSpeaking
          ? 'bg-green-500 hover:bg-green-600'
          : 'glass hover:bg-opacity-30'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {hasError ? (
        <AlertCircle size={16} className="text-white" />
      ) : isListening || isSpeaking ? (
        <Square size={16} className="text-white fill-white" />
      ) : (
        <Mic size={16} className="text-white" />
      )}
    </button>
  );
};
