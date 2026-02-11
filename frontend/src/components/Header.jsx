import React from 'react';
import { Moon, Sun } from 'lucide-react';

export const Header = ({ isDark, onThemeToggle }) => {
  return (
    <div className="glass p-4 md:p-6 rounded-lg flex justify-between items-center">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-white">Parakeet AI</h1>
        <p className="text-smtext-gray-300">Voice Conversational Assistant</p>
      </div>
      <button
        onClick={onThemeToggle}
        className="p-2 glass rounded-full hover:bg-opacity-30 transition-all hover:scale-110"
        title="Toggle theme"
      >
        {isDark ? (
          <Sun size={20} className="text-yellow-300" />
        ) : (
          <Moon size={20} className="text-blue-300" />
        )}
      </button>
    </div>
  );
};
