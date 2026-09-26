import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext(null);

export function AccessibilityProvider({ children }) {
  // Font size: 'sm', 'base', 'lg'
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('ss_font_size') || 'base');
  // High contrast mode
  const [highContrast, setHighContrast] = useState(() => localStorage.getItem('ss_high_contrast') === 'true');
  // Language: 'en' | 'hi'
  const [language, setLanguage] = useState(() => localStorage.getItem('ss_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('ss_font_size', fontSize);
    const root = document.documentElement;
    if (fontSize === 'sm') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'lg') {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem('ss_high_contrast', String(highContrast));
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    localStorage.setItem('ss_lang', language);
  }, [language]);

  const toggleContrast = () => setHighContrast(prev => !prev);
  const increaseFont = () => setFontSize('lg');
  const resetFont = () => setFontSize('base');
  const decreaseFont = () => setFontSize('sm');

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        increaseFont,
        resetFont,
        decreaseFont,
        highContrast,
        toggleContrast,
        language,
        setLanguage,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const ctx = useContext(AccessibilityContext);
  if (!ctx) throw new Error('useAccessibility must be used inside AccessibilityProvider');
  return ctx;
}
