import React from 'react';
import { Volume2, Loader, MessageCircle } from 'lucide-react';

export const ResponseDisplay = ({ response, isSpeaking, isLoading }) => {
  return (
    <div className="glass p-6 rounded-lg min-h-40 space-y-3 flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle size={18} className="text-green-400" />
          <div className="text-sm font-semibold text-gray-300">Assistant Response</div>
        </div>
        {isSpeaking && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500 bg-opacity-20 border border-green-500 border-opacity-50 rounded-full">
            <Volume2 size={14} className="text-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">Speaking</span>
          </div>
        )}
        {isLoading && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-blue-500 bg-opacity-20 border border-blue-500 border-opacity-50 rounded-full">
            <Loader size={14} className="animate-spin text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">Processing</span>
          </div>
        )}
      </div>
      
      <div className="flex-1 text-white text-base leading-relaxed overflow-y-auto pr-3 min-h-24 max-h-96">
        {response ? (
          <p className="whitespace-pre-wrap break-words">{response}</p>
        ) : (
          <p className="text-gray-400 italic">
            {isLoading ? 'Generating response...' : 'Ask me something to get started...'}
          </p>
        )}
      </div>
    </div>
  );
};
