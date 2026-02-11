import { useState, useEffect, useCallback } from 'react';

export const useThemeMode = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const newValue = !prev;
      localStorage.setItem('theme-mode', newValue ? 'dark' : 'light');
      return newValue;
    });
  }, []);

  return { isDark, toggleTheme };
};
