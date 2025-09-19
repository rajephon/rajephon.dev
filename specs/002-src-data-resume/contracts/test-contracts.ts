/**
 * Contract: Test Specifications
 * 
 * This contract defines the test scenarios and expectations for the
 * Korean resume translation feature.
 */

import { Language } from './language-toggle';

/**
 * Component Test Contracts
 */
export interface LanguageToggleTestContract {
  /**
   * Test: Default language on initial load
   * Expected: Should display English (en) by default
   */
  testDefaultLanguage(): void;

  /**
   * Test: Language toggle functionality
   * Expected: Should switch from en to ko and back
   */
  testLanguageToggle(): void;

  /**
   * Test: Language persistence
   * Expected: Should save and restore language preference
   */
  testLanguagePersistence(): void;

  /**
   * Test: Invalid language handling
   * Expected: Should fallback to default on invalid language
   */
  testInvalidLanguage(): void;

  /**
   * Test: UI label updates
   * Expected: Should update labels based on current language
   */
  testLabelUpdates(): void;
}

/**
 * Integration Test Contracts
 */
export interface ResumePageTestContract {
  /**
   * Test: Load both language contents
   * Expected: Should have both en and ko content available
   */
  testContentLoading(): void;

  /**
   * Test: Content switching on toggle
   * Expected: Should display correct content for selected language
   */
  testContentSwitching(): void;

  /**
   * Test: PDF link updates
   * Expected: Should provide correct PDF URL for selected language
   */
  testPdfLinkUpdate(): void;

  /**
   * Test: SEO attributes
   * Expected: Should update lang attribute on language change
   */
  testSeoAttributes(): void;

  /**
   * Test: Error handling
   * Expected: Should handle missing content gracefully
   */
  testErrorHandling(): void;
}

/**
 * E2E Test Scenarios
 */
export interface E2ETestScenarios {
  scenarios: E2EScenario[];
}

export interface E2EScenario {
  name: string;
  steps: TestStep[];
  expectedOutcome: string;
}

export interface TestStep {
  action: string;
  target?: string;
  value?: any;
  assertion?: string;
}

/**
 * E2E Test Scenarios Definition
 */
export const E2E_SCENARIOS: E2EScenario[] = [
  {
    name: 'User toggles language and downloads PDF',
    steps: [
      { action: 'navigate', target: '/resume' },
      { action: 'waitForElement', target: '[data-testid="language-toggle"]' },
      { action: 'assertText', target: 'h1', assertion: 'contains English name' },
      { action: 'click', target: '[data-testid="language-toggle"]' },
      { action: 'assertText', target: 'h1', assertion: 'contains Korean name' },
      { action: 'assertAttribute', target: 'html', assertion: 'lang="ko"' },
      { action: 'click', target: '[data-testid="pdf-download"]' },
      { action: 'assertDownload', assertion: 'resume-ko.pdf' }
    ],
    expectedOutcome: 'Korean PDF downloaded successfully'
  },
  {
    name: 'Language preference persists across sessions',
    steps: [
      { action: 'navigate', target: '/resume' },
      { action: 'click', target: '[data-testid="language-toggle"]' },
      { action: 'assertLanguage', assertion: 'ko' },
      { action: 'reload' },
      { action: 'waitForElement', target: '[data-testid="language-toggle"]' },
      { action: 'assertLanguage', assertion: 'ko' },
      { action: 'clearLocalStorage' },
      { action: 'reload' },
      { action: 'assertLanguage', assertion: 'en' }
    ],
    expectedOutcome: 'Language preference saved and restored correctly'
  },
  {
    name: 'Both PDF versions are accessible',
    steps: [
      { action: 'navigate', target: '/resume' },
      { action: 'assertLink', target: '[data-testid="pdf-download"]', assertion: 'href="/resume.pdf"' },
      { action: 'click', target: '[data-testid="language-toggle"]' },
      { action: 'assertLink', target: '[data-testid="pdf-download"]', assertion: 'href="/resume-ko.pdf"' },
      { action: 'fetch', target: '/resume.pdf', assertion: 'status=200' },
      { action: 'fetch', target: '/resume-ko.pdf', assertion: 'status=200' }
    ],
    expectedOutcome: 'Both PDF files exist and are accessible'
  }
];

/**
 * Unit Test Fixtures
 */
export const TEST_FIXTURES = {
  mockEnglishFrontmatter: {
    name: 'John Doe',
    title: 'Software Engineer',
    email: 'john@example.com',
    website: 'https://johndoe.com',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
    summary: 'Experienced software engineer',
    lastUpdated: '2025-09-18'
  },
  mockKoreanFrontmatter: {
    name: '홍길동',
    title: '소프트웨어 엔지니어',
    email: 'hong@example.com',
    website: 'https://honggildong.com',
    location: '서울, 대한민국',
    linkedin: 'https://linkedin.com/in/honggildong',
    github: 'https://github.com/honggildong',
    summary: '경험 많은 소프트웨어 엔지니어',
    lastUpdated: '2025-09-18'
  },
  mockHtmlContent: '<h2>Experience</h2><p>Software Engineer at Example Corp</p>',
  mockMarkdownContent: '## Experience\n\nSoftware Engineer at Example Corp'
};

/**
 * Performance Test Contracts
 */
export interface PerformanceTestContract {
  /**
   * Language switch response time
   * Expected: < 10ms
   */
  languageSwitchTime: number;

  /**
   * Content render time after switch
   * Expected: < 50ms
   */
  contentRenderTime: number;

  /**
   * localStorage access time
   * Expected: < 5ms
   */
  storageAccessTime: number;

  /**
   * Page load time with both languages
   * Expected: < 1000ms
   */
  pageLoadTime: number;
}

/**
 * Accessibility Test Requirements
 */
export const A11Y_REQUIREMENTS = {
  languageToggle: {
    ariaLabel: 'Toggle language between English and Korean',
    role: 'button',
    keyboardAccessible: true,
    focusVisible: true
  },
  contentLanguage: {
    htmlLangAttribute: true,
    properTextDirection: true,
    screenReaderAnnouncement: true
  },
  pdfDownload: {
    descriptiveText: true,
    keyboardAccessible: true,
    announceLanguage: true
  }
};