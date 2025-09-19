/**
 * Component Interface Contracts - Simplified Design
 * 
 * Defines the props interfaces for simplified React components
 * Updated to support minimal, text-focused design approach:
 * - Navigation removal/optional
 * - Button to link conversions
 * - Flat design without shadows/backgrounds
 * - Text-based content focus
 */

import { ReactNode } from 'react';
import { ResumeData, ResumeFrontmatter } from './resume-schema';

/**
 * Layout Component Props - Simplified for minimal design
 */
export interface LayoutProps {
  /** Page content to be wrapped */
  children: ReactNode;
  
  /** Page title for SEO */
  title?: string;
  
  /** Page description for SEO */
  description?: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Whether to show navigation (default: false for simplified design) */
  showNavigation?: boolean;
}

/**
 * Home Page Props
 */
export interface HomePageProps {
  /** Site configuration */
  siteConfig: SiteConfig;
  
  /** Featured content (optional) */
  featuredContent?: {
    title: string;
    description: string;
    link: string;
  };
}

/**
 * Resume Page Props
 */
export interface ResumePageProps {
  /** Complete resume data */
  resumeData: ResumeData;
  
  /** Whether to show PDF download button */
  showPDFButton?: boolean;
  
  /** PDF file URL */
  pdfUrl?: string;
}

/**
 * Resume Renderer Props
 */
export interface ResumeRendererProps {
  /** Resume frontmatter metadata */
  frontmatter: ResumeFrontmatter;
  
  /** Processed HTML content */
  htmlContent: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Print optimization mode */
  printOptimized?: boolean;
  
  /** Render style theme */
  theme?: 'modern' | 'classic' | 'minimal' | 'markdown-resume';
}

/**
 * PDF Export Link Props - Simplified from button to subtle link
 */
export interface PDFExportLinkProps {
  /** URL to the PDF file */
  pdfUrl: string;
  
  /** Suggested filename for download */
  fileName?: string;
  
  /** Additional CSS classes for minimal styling */
  className?: string;
  
  /** Whether to display inline with content flow */
  inline?: boolean;
  
  /** Link text content */
  children?: ReactNode;
}

/**
 * Site Configuration
 */
export interface SiteConfig {
  /** Site title */
  title: string;
  
  /** Site description */
  description: string;
  
  /** Primary domain */
  domain: string;
  
  /** Site author */
  author: string;
  
  /** Social media links */
  socialLinks: SocialLinks;
  
  /** SEO configuration */
  seo: SEOConfig;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
  email?: string;
}

export interface SEOConfig {
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  openGraph: OpenGraphConfig;
}

export interface OpenGraphConfig {
  type: string;
  locale: string;
  url: string;
  siteName: string;
  images: Array<{
    url: string;
    width: number;
    height: number;
    alt: string;
  }>;
}

/**
 * PDF Configuration
 */
export interface PDFConfig {
  /** Output file path */
  outputPath: string;
  
  /** Page format */
  pageFormat: 'A4' | 'Letter';
  
  /** Page margins */
  margins: PDFMargins;
  
  /** Include background graphics */
  printBackground: boolean;
  
  /** Wait for specific selector before generating */
  waitForSelector?: string;
  
  /** Additional Puppeteer options */
  puppeteerOptions?: {
    timeout?: number;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle0' | 'networkidle2';
  };
}

export interface PDFMargins {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

/**
 * Navigation Component Props
 */
export interface NavigationProps {
  /** Current active page */
  currentPath: string;
  
  /** Navigation items */
  items: NavigationItem[];
  
  /** Mobile menu state */
  isMobileMenuOpen?: boolean;
  
  /** Mobile menu toggle handler */
  onMobileMenuToggle?: () => void;
}

export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * Error Boundary Props
 */
export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Markdown Renderer Props
 */
export interface MarkdownRendererProps {
  /** Raw markdown content */
  content: string;
  
  /** Additional CSS classes */
  className?: string;
  
  /** Markdown processing options */
  options?: MarkdownOptions;
}

export interface MarkdownOptions {
  /** Enable GitHub Flavored Markdown */
  gfm?: boolean;
  
  /** Enable syntax highlighting */
  syntaxHighlighting?: boolean;
  
  /** Custom heading ID generation */
  headingIds?: boolean;
}

/**
 * Build-time Data Props
 */
export interface StaticPropsContext {
  params?: { [key: string]: string | string[] };
  query?: { [key: string]: string | string[] };
  preview?: boolean;
  previewData?: any;
}

export interface GetStaticPropsResult<T> {
  props: T;
  revalidate?: number | boolean;
  notFound?: boolean;
  redirect?: {
    destination: string;
    permanent: boolean;
  };
}