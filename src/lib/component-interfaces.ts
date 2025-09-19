/**
 * Component Interface Contracts
 * 
 * Defines the props interfaces for all React components
 * Ensures type safety and consistent API across the application
 */

import { ReactNode } from 'react';
import { ResumeData, ResumeFrontmatter } from './resume-schema';
import { SiteConfig, NavigationItem } from './config';

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
  
  /** PDF download URL (optional) */
  pdfUrl?: string;
}

/**
 * PDF Export Button Props
 */
export interface PDFExportButtonProps {
  /** URL to the PDF file */
  pdfUrl: string;
  
  /** Suggested filename for download */
  fileName?: string;
  
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline';
  
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  
  /** Additional CSS classes */
  className?: string;
}

/**
 * PDF Export Link Props - Simplified design alternative
 */
export interface PDFLinkProps {
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

// Re-export config types for convenience
export type { SiteConfig, NavigationItem, SEOConfig, OpenGraphConfig, SocialLinks } from './config';