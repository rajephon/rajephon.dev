/**
 * Contract: Language Toggle Component
 * 
 * This contract defines the interface for the language toggle functionality
 * that allows users to switch between English and Korean resume versions.
 */

export type Language = 'en' | 'ko';

export interface LanguageToggleContract {
  /**
   * Get the current language setting
   * @returns Current language code
   */
  getCurrentLanguage(): Language;

  /**
   * Set the language to a specific value
   * @param language - Target language code
   * @returns Success status
   */
  setLanguage(language: Language): boolean;

  /**
   * Toggle between available languages
   * @returns New language after toggle
   */
  toggleLanguage(): Language;

  /**
   * Get list of available languages
   * @returns Array of language codes
   */
  getAvailableLanguages(): Language[];

  /**
   * Persist language preference to storage
   * @param language - Language to persist
   * @returns Success status
   */
  persistPreference(language: Language): boolean;

  /**
   * Retrieve saved language preference
   * @returns Saved language or null if not found
   */
  getPersistedPreference(): Language | null;
}

/**
 * React Hook Contract for Language Toggle
 */
export interface useLanguageToggle {
  currentLanguage: Language;
  availableLanguages: Language[];
  isLoading: boolean;
  toggleLanguage: () => void;
  setLanguage: (language: Language) => void;
}

/**
 * Component Props Contract
 */
export interface LanguageToggleProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
  className?: string;
  variant?: 'text' | 'button';
}

/**
 * Language Content Contract
 */
export interface LanguageContent {
  language: Language;
  label: {
    en: string;
    ko: string;
  };
  content: {
    frontmatter: ResumeFrontmatter;
    htmlContent: string;
    markdownContent: string;
  };
  pdfUrl: string;
}

/**
 * Resume Frontmatter Contract (shared between languages)
 */
export interface ResumeFrontmatter {
  name: string;
  title: string;
  email: string;
  phone?: string;
  website: string;
  location: string;
  linkedin: string;
  github: string;
  summary: string;
  lastUpdated: string;
}

/**
 * Storage Key Constants
 */
export const STORAGE_KEYS = {
  LANGUAGE_PREFERENCE: 'resume-language-preference'
} as const;

/**
 * Language Labels for UI
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
} as const;

/**
 * PDF File Paths
 */
export const PDF_PATHS: Record<Language, string> = {
  en: '/resume.pdf',
  ko: '/resume-ko.pdf'
} as const;

/**
 * Test Scenarios
 */
export const TEST_SCENARIOS = {
  defaultLanguage: 'en' as Language,
  toggleSequence: ['en', 'ko', 'en'] as Language[],
  invalidLanguage: 'fr' as any,
  storageKey: STORAGE_KEYS.LANGUAGE_PREFERENCE
};