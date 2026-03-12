'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { dictionaries, Dictionary } from '@/lib/i18n/dictionaries';

type Language = 'en' | 'hi' | 'bn';

interface SettingsContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  dict: Dictionary;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const value = {
    language,
    setLanguage,
    dict: dictionaries[language],
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
