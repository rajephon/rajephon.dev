/**
 * Contract Tests for Component Interfaces
 * These tests verify TypeScript interfaces compile correctly
 * and validate expected component prop structures
 */

import { ReactNode } from 'react';
import {
  LayoutProps,
  HomePageProps,
  ResumePageProps,
  ResumeRendererProps,
  PDFExportButtonProps,
  SiteConfig,
  NavigationProps,
  MarkdownRendererProps,
} from '@/lib/component-interfaces';
import { ResumeFrontmatter, ResumeData } from '@/lib/resume-schema';

describe('Component Interface Contract Tests', () => {
  const mockResumeFrontmatter: ResumeFrontmatter = {
    name: 'Bruce Wayne',
    title: 'Senior Software Engineer',
    email: 'bruce@example.com',
    location: 'Gotham City',
    linkedin: 'https://linkedin.com/in/brucewayne',
    github: 'https://github.com/brucewayne',
    lastUpdated: '2025-09-18T00:00:00.000Z',
  };

  const mockResumeData: ResumeData = {
    frontmatter: mockResumeFrontmatter,
    content: '## Experience\n\n**Software Engineer**',
    htmlContent: '<h2>Experience</h2><p><strong>Software Engineer</strong></p>',
  };

  const mockSiteConfig: SiteConfig = {
    title: 'Bruce Wayne - Portfolio',
    description: 'Personal website and resume',
    domain: 'rajephon.dev',
    author: 'Bruce Wayne',
    socialLinks: {
      github: 'https://github.com/brucewayne',
      linkedin: 'https://linkedin.com/in/brucewayne',
      email: 'bruce@example.com',
    },
    seo: {
      defaultTitle: 'Bruce Wayne - Software Engineer',
      titleTemplate: '%s | Bruce Wayne',
      description: 'Personal website and resume',
      openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://rajephon.dev',
        siteName: 'Bruce Wayne',
        images: [
          {
            url: 'https://rajephon.dev/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Bruce Wayne - Software Engineer',
          },
        ],
      },
    },
  };

  describe('LayoutProps Interface', () => {
    it('should accept required children prop', () => {
      const props: LayoutProps = {
        children: 'Test content' as ReactNode,
      };
      expect(props.children).toBeDefined();
    });

    it('should accept optional props', () => {
      const props: LayoutProps = {
        children: 'Test content' as ReactNode,
        title: 'Test Page',
        description: 'Test description',
        className: 'custom-class',
      };
      expect(props.title).toBe('Test Page');
      expect(props.description).toBe('Test description');
      expect(props.className).toBe('custom-class');
    });

    it('should work with minimal props', () => {
      const minimalProps: LayoutProps = {
        children: null,
      };
      expect(minimalProps).toBeDefined();
    });
  });

  describe('HomePageProps Interface', () => {
    it('should accept required siteConfig', () => {
      const props: HomePageProps = {
        siteConfig: mockSiteConfig,
      };
      expect(props.siteConfig).toEqual(mockSiteConfig);
    });

    it('should accept optional featuredContent', () => {
      const props: HomePageProps = {
        siteConfig: mockSiteConfig,
        featuredContent: {
          title: 'Featured Project',
          description: 'Latest work showcase',
          link: '/projects/featured',
        },
      };
      expect(props.featuredContent?.title).toBe('Featured Project');
    });
  });

  describe('ResumePageProps Interface', () => {
    it('should accept required resumeData', () => {
      const props: ResumePageProps = {
        resumeData: mockResumeData,
      };
      expect(props.resumeData).toEqual(mockResumeData);
    });

    it('should accept optional props', () => {
      const props: ResumePageProps = {
        resumeData: mockResumeData,
        showPDFButton: true,
        pdfUrl: '/resume.pdf',
      };
      expect(props.showPDFButton).toBe(true);
      expect(props.pdfUrl).toBe('/resume.pdf');
    });
  });

  describe('ResumeRendererProps Interface', () => {
    it('should accept required props', () => {
      const props: ResumeRendererProps = {
        frontmatter: mockResumeFrontmatter,
        htmlContent: '<h1>Test</h1>',
      };
      expect(props.frontmatter).toEqual(mockResumeFrontmatter);
      expect(props.htmlContent).toBe('<h1>Test</h1>');
    });

    it('should accept theme options', () => {
      const themes: Array<'modern' | 'classic' | 'minimal' | 'markdown-resume'> = [
        'modern',
        'classic',
        'minimal',
        'markdown-resume',
      ];

      themes.forEach((theme) => {
        const props: ResumeRendererProps = {
          frontmatter: mockResumeFrontmatter,
          htmlContent: '<h1>Test</h1>',
          theme,
        };
        expect(props.theme).toBe(theme);
      });
    });

    it('should accept print optimization flag', () => {
      const props: ResumeRendererProps = {
        frontmatter: mockResumeFrontmatter,
        htmlContent: '<h1>Test</h1>',
        printOptimized: true,
        className: 'resume-container',
      };
      expect(props.printOptimized).toBe(true);
      expect(props.className).toBe('resume-container');
    });
  });

  describe('PDFExportButtonProps Interface', () => {
    it('should accept required pdfUrl', () => {
      const props: PDFExportButtonProps = {
        pdfUrl: '/resume.pdf',
      };
      expect(props.pdfUrl).toBe('/resume.pdf');
    });

    it('should accept all optional props', () => {
      const variants: Array<'primary' | 'secondary' | 'outline'> = ['primary', 'secondary', 'outline'];
      const sizes: Array<'sm' | 'md' | 'lg'> = ['sm', 'md', 'lg'];

      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const props: PDFExportButtonProps = {
            pdfUrl: '/resume.pdf',
            fileName: 'bruce-wayne-resume.pdf',
            variant,
            size,
            className: 'export-button',
          };
          expect(props.variant).toBe(variant);
          expect(props.size).toBe(size);
          expect(props.fileName).toBe('bruce-wayne-resume.pdf');
          expect(props.className).toBe('export-button');
        });
      });
    });
  });

  describe('SiteConfig Interface', () => {
    it('should accept complete configuration', () => {
      const config: SiteConfig = mockSiteConfig;
      expect(config.title).toBeDefined();
      expect(config.description).toBeDefined();
      expect(config.domain).toBeDefined();
      expect(config.author).toBeDefined();
      expect(config.socialLinks).toBeDefined();
      expect(config.seo).toBeDefined();
    });

    it('should validate social links structure', () => {
      const { socialLinks } = mockSiteConfig;
      expect(typeof socialLinks.github).toBe('string');
      expect(typeof socialLinks.linkedin).toBe('string');
      expect(typeof socialLinks.email).toBe('string');
    });

    it('should validate SEO configuration', () => {
      const { seo } = mockSiteConfig;
      expect(seo.defaultTitle).toBeDefined();
      expect(seo.titleTemplate).toBeDefined();
      expect(seo.description).toBeDefined();
      expect(seo.openGraph).toBeDefined();
      expect(seo.openGraph.images).toBeInstanceOf(Array);
      expect(seo.openGraph.images[0]).toHaveProperty('url');
      expect(seo.openGraph.images[0]).toHaveProperty('width');
      expect(seo.openGraph.images[0]).toHaveProperty('height');
      expect(seo.openGraph.images[0]).toHaveProperty('alt');
    });
  });

  describe('NavigationProps Interface', () => {
    it('should accept navigation configuration', () => {
      const props: NavigationProps = {
        currentPath: '/resume',
        items: [
          { label: 'Home', href: '/' },
          { label: 'Resume', href: '/resume' },
          { label: 'GitHub', href: 'https://github.com/brucewayne', external: true },
        ],
      };
      expect(props.currentPath).toBe('/resume');
      expect(props.items).toHaveLength(3);
      expect(props.items[2].external).toBe(true);
    });

    it('should accept mobile menu props', () => {
      const props: NavigationProps = {
        currentPath: '/',
        items: [],
        isMobileMenuOpen: true,
        onMobileMenuToggle: jest.fn(),
      };
      expect(props.isMobileMenuOpen).toBe(true);
      expect(typeof props.onMobileMenuToggle).toBe('function');
    });
  });

  describe('MarkdownRendererProps Interface', () => {
    it('should accept markdown content and options', () => {
      const props: MarkdownRendererProps = {
        content: '# Test Markdown',
        className: 'markdown-content',
        options: {
          gfm: true,
          syntaxHighlighting: true,
          headingIds: true,
        },
      };
      expect(props.content).toBe('# Test Markdown');
      expect(props.className).toBe('markdown-content');
      expect(props.options?.gfm).toBe(true);
      expect(props.options?.syntaxHighlighting).toBe(true);
      expect(props.options?.headingIds).toBe(true);
    });
  });

  describe('Type Compatibility', () => {
    it('should ensure ResumeData is compatible with ResumePageProps', () => {
      const pageProps: ResumePageProps = {
        resumeData: mockResumeData,
      };
      
      // Should be able to pass frontmatter to ResumeRenderer
      const rendererProps: ResumeRendererProps = {
        frontmatter: pageProps.resumeData.frontmatter,
        htmlContent: pageProps.resumeData.htmlContent || '',
      };
      
      expect(rendererProps.frontmatter).toEqual(mockResumeFrontmatter);
    });

    it('should ensure props can be spread correctly', () => {
      const baseLayoutProps = {
        children: 'content' as ReactNode,
        title: 'Base Title',
      };

      const extendedLayoutProps: LayoutProps = {
        ...baseLayoutProps,
        description: 'Extended description',
        className: 'extended-class',
      };

      expect(extendedLayoutProps.title).toBe('Base Title');
      expect(extendedLayoutProps.description).toBe('Extended description');
      expect(extendedLayoutProps.className).toBe('extended-class');
    });
  });
});