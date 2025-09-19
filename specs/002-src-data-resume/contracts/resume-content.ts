/**
 * Contract: Resume Content Management
 * 
 * This contract defines how resume content is loaded, validated, and served
 * in multiple languages.
 */

import { Language, ResumeFrontmatter } from './language-toggle';

/**
 * Resume Data Structure
 */
export interface ResumeData {
  frontmatter: ResumeFrontmatter;
  htmlContent: string;
  markdownContent: string;
  language: Language;
  lastParsed?: Date;
}

/**
 * Multi-language Resume Content
 */
export interface MultilingualResumeContent {
  en: ResumeData;
  ko: ResumeData;
}

/**
 * Resume Content Service Contract
 */
export interface ResumeContentService {
  /**
   * Load resume content for a specific language
   * @param language - Target language
   * @returns Resume data or null if not found
   */
  loadContent(language: Language): Promise<ResumeData | null>;

  /**
   * Load all available resume contents
   * @returns Object with all language versions
   */
  loadAllContent(): Promise<MultilingualResumeContent>;

  /**
   * Validate resume content against schema
   * @param data - Resume data to validate
   * @returns Validation result
   */
  validateContent(data: ResumeData): ValidationResult;

  /**
   * Get PDF URL for a specific language
   * @param language - Target language
   * @returns PDF file URL
   */
  getPdfUrl(language: Language): string;

  /**
   * Check if content exists for a language
   * @param language - Target language
   * @returns Existence status
   */
  contentExists(language: Language): Promise<boolean>;
}

/**
 * Validation Result
 */
export interface ValidationResult {
  isValid: boolean;
  errors?: ValidationError[];
  warnings?: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  field: string;
  message: string;
  severity: 'warning';
}

/**
 * File Paths Configuration
 */
export const CONTENT_PATHS = {
  en: 'src/data/resume.md',
  ko: 'src/data/resume-ko.md'
} as const;

/**
 * Required Frontmatter Fields
 */
export const REQUIRED_FIELDS: (keyof ResumeFrontmatter)[] = [
  'name',
  'title',
  'email',
  'website',
  'location',
  'summary'
];

/**
 * Content Parsing Options
 */
export interface ParseOptions {
  sanitizeHtml?: boolean;
  validateFrontmatter?: boolean;
  preserveMarkdown?: boolean;
}

/**
 * Build-time Static Props Contract
 */
export interface ResumePageStaticProps {
  resumeData: MultilingualResumeContent;
  defaultLanguage: Language;
  pdfUrls: Record<Language, string>;
  lastBuildTime: string;
}

/**
 * Resume Section Types (for parsing)
 */
export type ResumeSection = 
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'awards'
  | 'certifications'
  | 'publications';

/**
 * Section Validation Rules
 */
export const SECTION_RULES: Record<ResumeSection, { required: boolean; maxItems?: number }> = {
  experience: { required: true },
  education: { required: true },
  skills: { required: true },
  projects: { required: false },
  awards: { required: false },
  certifications: { required: false },
  publications: { required: false }
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  CONTENT_NOT_FOUND: (lang: Language) => `Resume content not found for language: ${lang}`,
  INVALID_FRONTMATTER: 'Resume frontmatter validation failed',
  MISSING_REQUIRED_FIELD: (field: string) => `Required field missing: ${field}`,
  PARSING_ERROR: 'Failed to parse markdown content',
  PDF_NOT_FOUND: (lang: Language) => `PDF file not found for language: ${lang}`
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  CONTENT_LOADED: (lang: Language) => `Resume content loaded successfully for language: ${lang}`,
  VALIDATION_PASSED: 'Resume content validation passed',
  PDF_GENERATED: (lang: Language) => `PDF generated successfully for language: ${lang}`
} as const;