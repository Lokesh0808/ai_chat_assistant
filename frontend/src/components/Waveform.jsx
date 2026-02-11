import React from 'react';

export const Waveform = ({ isActive }) => {
  if (!isActive) return null;

  return (
    <div className="flex items-center justify-center gap-0.5 h-4">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="waveform-bar w-0.5 bg-blue-400 rounded-full"
        />
      ))}
    </div>
  );
};
