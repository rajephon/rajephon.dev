/**
 * Type definitions for the Korean Resume Translation feature
 */

export type Language = 'en' | 'ko';

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

export interface ResumeData {
  frontmatter: ResumeFrontmatter;
  content: string;
  htmlContent: string;
}

export interface MultiLanguageResumeData {
  en: ResumeData;
  ko: ResumeData;
}

export interface LanguageToggleState {
  currentLanguage: Language;
  availableLanguages: Language[];
  isLoading: boolean;
}

export interface PDFUrls {
  en: string;
  ko: string;
}