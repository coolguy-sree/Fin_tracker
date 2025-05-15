import { useState, useEffect } from 'react';

interface ThemeReturn {
  isDarkMode: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'dark' | 'light') => void;
}

export const useTheme = (): ThemeReturn => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return savedTheme === 'dark' || (!savedTheme && prefersDark);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const setTheme = (theme: 'dark' | 'light') => {
    setIsDarkMode(theme === 'dark');
  };

  return { isDarkMode, toggleTheme, setTheme };
};