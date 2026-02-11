import React from 'react';
import { Loader, Mic } from 'lucide-react';

export const TranscriptDisplay = ({ transcript, interimTranscript, isListening, isLoading }) => {
  const displayText = (transcript || interimTranscript || '').trim();

  return (
    <div className="glass p-2 rounded space-y-1">
      <div className="flex items-center gap-1.5">
        <Mic size={12} className={`${isListening ? 'text-blue-400 animate-pulse' : 'text-gray-400'}`} />
        <div className="text-xs font-semibold text-gray-300">
          {isLoading ? (
            <span className="flex items-center gap-1 text-blue-400">
              <Loader size={10} className="animate-spin" />
              Processing...
            </span>
          ) : isListening ? (
            <span className="text-blue-400">Listening...</span>
          ) : (
            <span className="text-gray-400">Ready</span>
          )}
        </div>
      </div>
      <div className="text-white text-xs min-h-6 max-h-16 overflow-y-auto leading-relaxed bg-black bg-opacity-20 p-1.5 rounded border border-gray-700 break-words">
        {displayText || (
          <span className="text-gray-500 italic text-xs">
            {isListening ? 'Speak...' : 'Click mic'}
          </span>
        )}
      </div>
    </div>
  );
};
