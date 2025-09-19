/**
 * Language Toggle Hook
 * 
 * Manages language state and persistence for the bilingual resume feature
 * Implements the contract defined in specs/002-src-data-resume/contracts/language-toggle.ts
 */

import { useState, useEffect, useCallback } from 'react';

export type Language = 'en' | 'ko';

export interface UseLanguageToggleReturn {
  currentLanguage: Language;
  availableLanguages: Language[];
  isLoading: boolean;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
}

const STORAGE_KEY = 'resume-language-preference';
const DEFAULT_LANGUAGE: Language = 'en';
const AVAILABLE_LANGUAGES: Language[] = ['en', 'ko'];

/**
 * Custom hook for managing language toggle functionality
 */
export function useLanguageToggle(initialLanguage?: Language): UseLanguageToggleReturn {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(
    initialLanguage || DEFAULT_LANGUAGE
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load persisted language preference on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const persistedLanguage = getPersistedPreference();
      if (persistedLanguage && persistedLanguage !== currentLanguage) {
        setCurrentLanguage(persistedLanguage);
      }
    }
  }, []);

  // Update document lang attribute when language changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = currentLanguage;
    }
  }, [currentLanguage]);

  /**
   * Get persisted language preference from localStorage
   */
  const getPersistedPreference = (): Language | null => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && AVAILABLE_LANGUAGES.includes(stored as Language)) {
        return stored as Language;
      }
    } catch (error) {
      console.warn('Failed to read language preference from localStorage:', error);
    }
    return null;
  };

  /**
   * Persist language preference to localStorage
   */
  const persistPreference = useCallback((language: Language): boolean => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
      return true;
    } catch (error) {
      console.warn('Failed to save language preference to localStorage:', error);
      return false;
    }
  }, []);

  /**
   * Set language to a specific value
   */
  const setLanguage = useCallback((language: Language) => {
    if (!AVAILABLE_LANGUAGES.includes(language)) {
      console.warn(`Invalid language: ${language}. Falling back to default.`);
      language = DEFAULT_LANGUAGE;
    }

    setIsLoading(true);
    
    // Use setTimeout to simulate async operation and show loading state
    setTimeout(() => {
      setCurrentLanguage(language);
      persistPreference(language);
      setIsLoading(false);
    }, 0);
  }, [persistPreference]);

  /**
   * Toggle between available languages
   */
  const toggleLanguage = useCallback(() => {
    const currentIndex = AVAILABLE_LANGUAGES.indexOf(currentLanguage);
    const nextIndex = (currentIndex + 1) % AVAILABLE_LANGUAGES.length;
    const nextLanguage = AVAILABLE_LANGUAGES[nextIndex];
    
    setLanguage(nextLanguage);
  }, [currentLanguage, setLanguage]);

  return {
    currentLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
    isLoading,
    toggleLanguage,
    setLanguage,
  };
}

/**
 * Language labels for UI display
 */
export const LANGUAGE_LABELS: Record<Language, { short: string; full: string }> = {
  en: {
    short: 'EN',
    full: 'English'
  },
  ko: {
    short: 'KO',
    full: '한국어'
  }
};

/**
 * PDF file paths for each language
 */
export const PDF_PATHS: Record<Language, string> = {
  en: '/resume.pdf',
  ko: '/resume-ko.pdf'
};

/**
 * Utility function to get PDF URL for current language
 */
export function getPdfUrl(language: Language): string {
  return PDF_PATHS[language] || PDF_PATHS.en;
}

/**
 * Utility function to get language label
 */
export function getLanguageLabel(language: Language, type: 'short' | 'full' = 'short'): string {
  return LANGUAGE_LABELS[language]?.[type] || LANGUAGE_LABELS.en[type];
}