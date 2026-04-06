'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'elder' | 'sister' | 'brother';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('elder');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 从 localStorage 读取主题
    const savedTheme = localStorage.getItem('peace-maker-theme') as Theme;
    if (savedTheme && ['elder', 'sister', 'brother'].includes(savedTheme)) {
      setThemeState(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // 移除所有主题类
    document.documentElement.classList.remove('theme-elder', 'theme-sister', 'theme-brother');

    // 添加当前主题类
    document.documentElement.classList.add(`theme-${theme}`);

    // 保存到 localStorage
    localStorage.setItem('peace-maker-theme', theme);
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
