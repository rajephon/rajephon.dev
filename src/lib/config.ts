/**
 * Site Configuration
 * 
 * Central configuration for the rajephon.dev personal website
 */

export interface SiteConfig {
  title: string;
  description: string;
  domain: string;
  author: string;
  socialLinks: SocialLinks;
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

export const siteConfig: SiteConfig = {
  title: 'Rajephon - Software Engineer',
  description: 'Personal website and resume of a passionate software engineer specializing in full-stack development.',
  domain: 'rajephon.dev',
  author: 'Rajephon',
  
  socialLinks: {
    github: 'https://github.com/rajephon',
    linkedin: 'https://linkedin.com/in/rajephon',
    email: 'contact@rajephon.dev',
  },
  
  seo: {
    defaultTitle: 'Rajephon - Software Engineer',
    titleTemplate: '%s | Rajephon',
    description: 'Personal website and resume of a passionate software engineer specializing in full-stack development, web technologies, and modern frameworks.',
    
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://rajephon.dev',
      siteName: 'Rajephon',
      images: [
        {
          url: 'https://rajephon.dev/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Rajephon - Software Engineer',
        },
      ],
    },
  },
};

/**
 * Navigation configuration
 */
export interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

export const navigationItems: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Resume',
    href: '/resume',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/rajephon',
    external: true,
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/rajephon',
    external: true,
  },
];

/**
 * Theme configuration
 */
export type ResumeTheme = 'modern' | 'classic' | 'minimal' | 'markdown-resume';

export const themeConfig = {
  defaultTheme: 'markdown-resume' as ResumeTheme,
  availableThemes: ['modern', 'classic', 'minimal', 'markdown-resume'] as ResumeTheme[],
};

/**
 * PDF configuration
 */
export const pdfConfig = {
  outputPath: '/resume.pdf',
  fileName: 'rajephon-resume.pdf',
  pageFormat: 'A4' as const,
  margins: {
    top: '0.75in',
    right: '0.75in',
    bottom: '0.75in',
    left: '0.75in',
  },
  printBackground: true,
  waitForSelector: '.resume-container',
  puppeteerOptions: {
    timeout: 30000,
    waitUntil: 'networkidle0' as const,
  },
};

/**
 * Development configuration
 */
export const devConfig = {
  port: 3000,
  host: 'localhost',
  enableHotReload: true,
  showDebugInfo: process.env.NODE_ENV === 'development',
};

/**
 * Build configuration
 */
export const buildConfig = {
  outputDir: 'out',
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  generateSitemap: true,
  generateRobots: true,
  optimizeImages: true,
};

/**
 * Utility functions for configuration
 */
export function getPageTitle(pageTitle?: string): string {
  if (!pageTitle) {
    return siteConfig.seo.defaultTitle;
  }
  return siteConfig.seo.titleTemplate.replace('%s', pageTitle);
}

export function getPageUrl(path: string): string {
  const baseUrl = `https://${siteConfig.domain}`;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}

export function getOGImageUrl(path?: string): string {
  const baseUrl = `https://${siteConfig.domain}`;
  return path ? `${baseUrl}${path}` : siteConfig.seo.openGraph.images[0].url;
}