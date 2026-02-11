import React, { useState } from 'react';
import { Trash2, ChevronRight } from 'lucide-react';

export const ConversationHistory = ({ history, onClear, isDark, onSelectItem }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  // Group messages into Q&A pairs
  const qaHistory = [];
  for (let i = 0; i < history.length; i += 2) {
    if (history[i]?.role === 'user') {
      qaHistory.push({
        question: history[i]?.content || '',
        answer: history[i + 1]?.content || '',
        timestamp: history[i]?.timestamp || Date.now()
      });
    }
  }

  return (
    <div className={`w-full h-screen max-w-xs ${isDark ? 'bg-gray-900' : 'bg-gray-100'} glass flex flex-col border-r border-gray-700 overflow-hidden`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
        <h2 className="text-lg font-bold text-white">History</h2>
        <button
          onClick={onClear}
          className="p-1.5 hover:bg-red-500 hover:bg-opacity-20 rounded transition-colors"
          title="Clear history"
        >
          <Trash2 size={18} className="text-red-400" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {qaHistory.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-8">
            No conversations yet
          </div>
        ) : (
          qaHistory.map((qa, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedIndex(selectedIndex === idx ? null : idx);
                onSelectItem?.(selectedIndex === idx ? null : qa);
              }}
              className={`p-3 rounded-lg cursor-pointer transition-all ${
                selectedIndex === idx
                  ? 'bg-blue-500 bg-opacity-30 border border-blue-500 border-opacity-50'
                  : 'bg-gray-700 bg-opacity-30 hover:bg-opacity-50 border border-gray-600'
              }`}
            >
              {/* Question */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="font-semibold text-xs text-blue-300 mb-1">Q:</div>
                  <div className="text-white text-sm line-clamp-2">{qa.question}</div>
                </div>
                <ChevronRight size={16} className={`text-gray-400 mt-1 flex-shrink-0 transition-transform ${selectedIndex === idx ? 'rotate-90' : ''}`} />
              </div>

              {/* Answer - Show only when expanded */}
              {selectedIndex === idx && qa.answer && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="font-semibold text-xs text-green-300 mb-1">A:</div>
                  <div className="text-gray-200 text-sm leading-relaxed max-h-32 overflow-y-auto">
                    {qa.answer}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
