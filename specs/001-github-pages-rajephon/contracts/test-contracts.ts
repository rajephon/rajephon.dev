/**
 * Test Contracts and Interfaces
 * 
 * Defines the testing interfaces, mock data structures,
 * and test scenario contracts for consistent testing across the application
 */

import { ResumeData, ResumeFrontmatter } from './resume-schema';
import { SiteConfig } from './component-interfaces';

/**
 * Test Data Factories
 */
export interface TestDataFactory {
  createMockResumeFrontmatter(overrides?: Partial<ResumeFrontmatter>): ResumeFrontmatter;
  createMockResumeData(overrides?: Partial<ResumeData>): ResumeData;
  createMockSiteConfig(overrides?: Partial<SiteConfig>): SiteConfig;
}

/**
 * Component Test Scenarios
 */
export interface ComponentTestScenario {
  name: string;
  description: string;
  props: Record<string, any>;
  expectedBehavior: string[];
  mockData?: Record<string, any>;
}

/**
 * Integration Test Scenarios
 */
export interface IntegrationTestScenario {
  name: string;
  description: string;
  setup: () => Promise<void>;
  execute: () => Promise<void>;
  verify: () => Promise<void>;
  cleanup?: () => Promise<void>;
}

/**
 * E2E Test Scenarios
 */
export interface E2ETestScenario {
  name: string;
  description: string;
  url: string;
  actions: E2EAction[];
  assertions: E2EAssertion[];
}

export interface E2EAction {
  type: 'navigate' | 'click' | 'type' | 'wait' | 'scroll';
  selector?: string;
  value?: string;
  timeout?: number;
}

export interface E2EAssertion {
  type: 'visible' | 'text' | 'attribute' | 'url' | 'pdf-download';
  selector?: string;
  expected: string | RegExp;
  timeout?: number;
}

/**
 * Mock Resume Data
 */
export const MOCK_RESUME_FRONTMATTER: ResumeFrontmatter = {
  name: 'John Developer',
  title: 'Senior Software Engineer',
  email: 'john@rajephon.dev',
  phone: '+82-10-1234-5678',
  website: 'https://rajephon.dev',
  location: 'Seoul, South Korea',
  linkedin: 'https://linkedin.com/in/johndeveloper',
  github: 'https://github.com/johndeveloper',
  summary: 'Experienced software engineer with expertise in full-stack development.',
  lastUpdated: '2025-09-18T00:00:00.000Z',
};

export const MOCK_RESUME_CONTENT = `## Experience

### Senior Software Engineer - Tech Company
*2023 - Present*

- Led development of scalable web applications
- Mentored junior developers and conducted code reviews
- Implemented CI/CD pipelines and automated testing

### Software Engineer - Startup Inc
*2021 - 2023*

- Developed React-based frontend applications
- Built RESTful APIs using Node.js and Express
- Collaborated with design team on user experience

## Skills

### Programming Languages
- JavaScript/TypeScript
- Python
- Go
- SQL

### Frameworks & Libraries
- React/Next.js
- Node.js/Express
- FastAPI
- Tailwind CSS

### Tools & Technologies
- Git/GitHub
- Docker
- AWS
- PostgreSQL

## Education

### Bachelor of Science in Computer Science
*University of Technology, 2017-2021*

- Graduated Summa Cum Laude
- Relevant Coursework: Data Structures, Algorithms, Database Systems`;

export const MOCK_RESUME_DATA: ResumeData = {
  frontmatter: MOCK_RESUME_FRONTMATTER,
  content: MOCK_RESUME_CONTENT,
  htmlContent: '<div>Processed HTML content would go here</div>',
};

/**
 * Test Scenarios
 */
export const COMPONENT_TEST_SCENARIOS: ComponentTestScenario[] = [
  {
    name: 'ResumeRenderer - Valid Data',
    description: 'Renders resume content correctly with valid data',
    props: {
      frontmatter: MOCK_RESUME_FRONTMATTER,
      htmlContent: '<h2>Experience</h2><p>Content here</p>',
    },
    expectedBehavior: [
      'Displays name and title prominently',
      'Renders contact information',
      'Shows processed HTML content',
      'Applies proper CSS classes',
    ],
  },
  {
    name: 'PDFExportButton - Download Functionality',
    description: 'PDF download button works correctly',
    props: {
      pdfUrl: '/resume.pdf',
      fileName: 'john-developer-resume.pdf',
    },
    expectedBehavior: [
      'Button is visible and clickable',
      'Initiates download on click',
      'Uses correct filename',
      'Handles missing PDF gracefully',
    ],
  },
  {
    name: 'Layout - SEO Meta Tags',
    description: 'Layout component sets correct meta tags',
    props: {
      title: 'Resume - John Developer',
      description: 'Software engineer resume and portfolio',
    },
    expectedBehavior: [
      'Sets document title correctly',
      'Includes meta description',
      'Adds Open Graph tags',
      'Includes canonical URL',
    ],
  },
  {
    name: 'ResumeRenderer - Theme Switching',
    description: 'Resume renderer supports different themes',
    props: {
      frontmatter: MOCK_RESUME_FRONTMATTER,
      htmlContent: '<h2>Experience</h2><p>Content here</p>',
      theme: 'markdown-resume',
    },
    expectedBehavior: [
      'Applies theme-specific CSS classes',
      'Renders contact section with theme styling',
      'Uses theme typography and spacing',
      'Maintains print compatibility',
    ],
  },
  {
    name: 'ResumeRenderer - Print Optimization',
    description: 'Resume renders correctly for print/PDF',
    props: {
      frontmatter: MOCK_RESUME_FRONTMATTER,
      htmlContent: '<h2>Experience</h2><p>Content here</p>',
      printOptimized: true,
    },
    expectedBehavior: [
      'Removes interactive elements',
      'Applies print-specific styles',
      'Ensures proper page breaks',
      'Uses print-friendly fonts and colors',
    ],
  },
];

export const INTEGRATION_TEST_SCENARIOS: IntegrationTestScenario[] = [
  {
    name: 'Resume Page Rendering',
    description: 'Complete resume page renders with markdown processing',
    setup: async () => {
      // Setup mock resume file
    },
    execute: async () => {
      // Request resume page
    },
    verify: async () => {
      // Verify HTML output, PDF link, styling
    },
  },
  {
    name: 'PDF Generation Pipeline',
    description: 'PDF is generated correctly from HTML content',
    setup: async () => {
      // Setup test environment
    },
    execute: async () => {
      // Trigger PDF generation
    },
    verify: async () => {
      // Verify PDF file exists and content
    },
  },
];

export const E2E_TEST_SCENARIOS: E2ETestScenario[] = [
  {
    name: 'Homepage Navigation',
    description: 'User can navigate from homepage to resume page',
    url: '/',
    actions: [
      { type: 'navigate' },
      { type: 'click', selector: 'a[href="/resume"]' },
      { type: 'wait', timeout: 2000 },
    ],
    assertions: [
      { type: 'url', expected: '/resume' },
      { type: 'visible', selector: '[data-testid="resume-content"]' },
    ],
  },
  {
    name: 'PDF Download',
    description: 'User can download resume as PDF',
    url: '/resume',
    actions: [
      { type: 'navigate' },
      { type: 'click', selector: '[data-testid="pdf-download-button"]' },
    ],
    assertions: [
      { type: 'pdf-download', expected: 'resume.pdf' },
    ],
  },
  {
    name: 'Responsive Design',
    description: 'Site works correctly on mobile devices',
    url: '/resume',
    actions: [
      { type: 'navigate' },
    ],
    assertions: [
      { type: 'visible', selector: '.resume-content' },
      { type: 'attribute', selector: 'meta[name="viewport"]', expected: 'width=device-width' },
    ],
  },
];

/**
 * Test Utilities
 */
export interface TestUtils {
  renderWithProviders: (component: React.ReactElement) => any;
  createMockRouter: (path?: string) => any;
  waitForMarkdownProcessing: () => Promise<void>;
  mockPDFGeneration: () => void;
  setupTestEnvironment: () => Promise<void>;
  cleanupTestEnvironment: () => Promise<void>;
}

/**
 * Performance Test Benchmarks
 */
export interface PerformanceBenchmarks {
  pageLoadTime: number; // ms
  markdownProcessingTime: number; // ms
  pdfGenerationTime: number; // seconds
  buildTime: number; // seconds
  bundleSize: number; // KB
}

export const PERFORMANCE_TARGETS: PerformanceBenchmarks = {
  pageLoadTime: 3000, // 3 seconds
  markdownProcessingTime: 100, // 100ms
  pdfGenerationTime: 10, // 10 seconds
  buildTime: 60, // 1 minute
  bundleSize: 500, // 500KB
};

/**
 * Accessibility Test Requirements
 */
export interface AccessibilityRequirements {
  wcagLevel: 'AA' | 'AAA';
  colorContrastRatio: number;
  keyboardNavigation: boolean;
  screenReaderCompatibility: boolean;
  alternativeTextRequired: boolean;
}

export const ACCESSIBILITY_STANDARDS: AccessibilityRequirements = {
  wcagLevel: 'AA',
  colorContrastRatio: 4.5,
  keyboardNavigation: true,
  screenReaderCompatibility: true,
  alternativeTextRequired: true,
};