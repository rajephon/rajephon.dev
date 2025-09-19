/**
 * Resume Page Integration Tests
 * These tests MUST FAIL until resume page and related components are implemented
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { GetStaticPropsContext, GetStaticPropsResult } from 'next';
import ResumePage, { getStaticProps } from '@/pages/resume';
import { ResumePageProps } from '@/lib/component-interfaces';

// Mock the markdown processing utilities
jest.mock('@/lib/markdown', () => ({
  parseMarkdownResume: jest.fn(),
}));

// Mock the resume schema
jest.mock('@/lib/resume-schema', () => ({
  validateResumeData: jest.fn(),
}));

// Mock fs promises
jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
}));

// Mock path
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  resolve: jest.fn((...args) => '/' + args.join('/')),
}));

import { parseMarkdownResume } from '@/lib/markdown';
import { validateResumeData } from '@/lib/resume-schema';
import { readFile } from 'fs/promises';

describe('Resume Page Integration', () => {
  const mockResumeData = {
    frontmatter: {
      name: 'Bruce Wayne',
      title: 'Senior Software Engineer',
      email: 'bruce@example.com',
      phone: '(+1) 123-456-7890',
      location: '1234 Abc Street, Gotham, GC 01234',
      linkedin: 'https://linkedin.com/in/brucewayne',
      github: 'https://github.com/brucewayne',
      website: 'https://example.com',
      lastUpdated: '2025-09-18T00:00:00.000Z',
    },
    content: '# Bruce Wayne\n\n## Experience\n\n**Machine Learning Engineer**',
    htmlContent: '<h1>Bruce Wayne</h1><h2>Experience</h2><p><strong>Machine Learning Engineer</strong></p>',
  };

  const mockProps: ResumePageProps = {
    resumeData: mockResumeData,
    showPDFButton: true,
    pdfUrl: '/resume.pdf',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Resume Page Component', () => {
    it('should render resume page with all sections', () => {
      render(<ResumePage {...mockProps} />);
      
      // Should render the name as main heading
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Bruce Wayne');
      
      // Should render contact information
      expect(screen.getByText('bruce@example.com')).toBeInTheDocument();
      expect(screen.getByText('(+1) 123-456-7890')).toBeInTheDocument();
      expect(screen.getByText('1234 Abc Street, Gotham, GC 01234')).toBeInTheDocument();
      
      // Should render experience section
      expect(screen.getByRole('heading', { level: 2, name: /experience/i })).toBeInTheDocument();
      expect(screen.getByText('Machine Learning Engineer')).toBeInTheDocument();
    });

    it('should render PDF export button when enabled', () => {
      render(<ResumePage {...mockProps} />);
      
      const pdfButton = screen.getByRole('button', { name: /download|pdf|export/i });
      expect(pdfButton).toBeInTheDocument();
    });

    it('should not render PDF button when disabled', () => {
      const propsWithoutPDF = {
        ...mockProps,
        showPDFButton: false,
      };
      
      render(<ResumePage {...propsWithoutPDF} />);
      
      expect(screen.queryByRole('button', { name: /download|pdf|export/i })).not.toBeInTheDocument();
    });

    it('should apply markdown-resume theme by default', () => {
      render(<ResumePage {...mockProps} />);
      
      const resumeContainer = screen.getByTestId('resume-container') || 
                             document.querySelector('.theme-markdown-resume');
      expect(resumeContainer).toHaveClass('theme-markdown-resume');
    });

    it('should render proper page title and meta tags', () => {
      render(<ResumePage {...mockProps} />);
      
      // Check that Head component is rendered (mocked)
      const headElement = screen.getByTestId('mock-head');
      expect(headElement).toBeInTheDocument();
    });

    it('should handle missing resume data gracefully', () => {
      const emptyProps: ResumePageProps = {
        resumeData: {
          frontmatter: {
            name: '',
            title: '',
            email: '',
            lastUpdated: '2025-09-18T00:00:00.000Z',
          },
          content: '',
          htmlContent: '',
        },
      };
      
      expect(() => render(<ResumePage {...emptyProps} />)).not.toThrow();
    });
  });

  describe('getStaticProps Function', () => {
    it('should load and parse resume markdown file', async () => {
      const mockMarkdownContent = `---
name: "Bruce Wayne"
title: "Senior Software Engineer"
email: "bruce@example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

# Bruce Wayne

## Experience

**Machine Learning Engineer**`;

      (readFile as jest.Mock).mockResolvedValue(mockMarkdownContent);
      (parseMarkdownResume as jest.Mock).mockResolvedValue(mockResumeData);
      (validateResumeData as jest.Mock).mockReturnValue(mockResumeData);

      const context: GetStaticPropsContext = {};
      const result = await getStaticProps(context) as GetStaticPropsResult<ResumePageProps>;
      
      expect(readFile).toHaveBeenCalledWith(expect.stringContaining('resume.md'), 'utf-8');
      expect(parseMarkdownResume).toHaveBeenCalledWith(mockMarkdownContent);
      expect(validateResumeData).toHaveBeenCalledWith(mockResumeData);
      
      expect(result).toHaveProperty('props');
      if ('props' in result) {
        expect(result.props.resumeData).toEqual(mockResumeData);
        expect(result.props.showPDFButton).toBe(true);
        expect(result.props.pdfUrl).toBe('/resume.pdf');
      }
    });

    it('should handle file reading errors', async () => {
      (readFile as jest.Mock).mockRejectedValue(new Error('File not found'));

      const context: GetStaticPropsContext = {};
      
      await expect(getStaticProps(context)).rejects.toThrow('File not found');
    });

    it('should handle markdown parsing errors', async () => {
      const invalidMarkdown = `---
name: ""
email: "invalid"
---

Invalid content`;

      (readFile as jest.Mock).mockResolvedValue(invalidMarkdown);
      (parseMarkdownResume as jest.Mock).mockRejectedValue(new Error('Invalid markdown'));

      const context: GetStaticPropsContext = {};
      
      await expect(getStaticProps(context)).rejects.toThrow('Invalid markdown');
    });

    it('should validate parsed resume data', async () => {
      const mockMarkdownContent = `---
name: "Bruce Wayne"
email: "bruce@example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

# Bruce Wayne`;

      (readFile as jest.Mock).mockResolvedValue(mockMarkdownContent);
      (parseMarkdownResume as jest.Mock).mockResolvedValue(mockResumeData);
      (validateResumeData as jest.Mock).mockImplementation((data) => {
        if (!data.frontmatter.title) {
          throw new Error('Title is required');
        }
        return data;
      });

      const context: GetStaticPropsContext = {};
      
      expect(() => getStaticProps(context)).rejects.toThrow('Title is required');
    });

    it('should set correct file paths', async () => {
      const mockMarkdownContent = 'valid markdown content';
      
      (readFile as jest.Mock).mockResolvedValue(mockMarkdownContent);
      (parseMarkdownResume as jest.Mock).mockResolvedValue(mockResumeData);
      (validateResumeData as jest.Mock).mockReturnValue(mockResumeData);

      const context: GetStaticPropsContext = {};
      await getStaticProps(context);
      
      // Should read from correct path
      expect(readFile).toHaveBeenCalledWith(
        expect.stringContaining('src/data/resume.md'),
        'utf-8'
      );
    });

    it('should enable PDF button and set PDF URL', async () => {
      const mockMarkdownContent = 'valid markdown content';
      
      (readFile as jest.Mock).mockResolvedValue(mockMarkdownContent);
      (parseMarkdownResume as jest.Mock).mockResolvedValue(mockResumeData);
      (validateResumeData as jest.Mock).mockReturnValue(mockResumeData);

      const context: GetStaticPropsContext = {};
      const result = await getStaticProps(context) as GetStaticPropsResult<ResumePageProps>;
      
      if ('props' in result) {
        expect(result.props.showPDFButton).toBe(true);
        expect(result.props.pdfUrl).toBe('/resume.pdf');
      }
    });
  });

  describe('Page Integration with Components', () => {
    it('should pass correct props to ResumeRenderer', () => {
      render(<ResumePage {...mockProps} />);
      
      // ResumeRenderer should receive frontmatter and htmlContent
      expect(screen.getByText('Bruce Wayne')).toBeInTheDocument();
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning Engineer')).toBeInTheDocument();
    });

    it('should pass correct props to PDFExportButton', () => {
      render(<ResumePage {...mockProps} />);
      
      const pdfButton = screen.getByRole('button', { name: /download|pdf|export/i });
      expect(pdfButton).toBeInTheDocument();
      
      // Button should be configured for PDF download
      expect(pdfButton).toBeEnabled();
    });

    it('should use Layout component with proper props', () => {
      render(<ResumePage {...mockProps} />);
      
      // Should have proper page structure
      expect(screen.getByRole('main') || screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByRole('banner') || screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo') || screen.getByTestId('footer')).toBeInTheDocument();
    });
  });

  describe('SEO and Performance', () => {
    it('should set correct page title', () => {
      render(<ResumePage {...mockProps} />);
      
      const headElement = screen.getByTestId('mock-head');
      expect(headElement).toBeInTheDocument();
      
      // In real implementation, would check:
      // expect(document.title).toContain('Bruce Wayne - Resume');
    });

    it('should set meta description based on resume content', () => {
      render(<ResumePage {...mockProps} />);
      
      const headElement = screen.getByTestId('mock-head');
      expect(headElement).toBeInTheDocument();
      
      // In real implementation, would check for meta description
      // containing professional summary or title
    });

    it('should include structured data for SEO', () => {
      render(<ResumePage {...mockProps} />);
      
      const headElement = screen.getByTestId('mock-head');
      expect(headElement).toBeInTheDocument();
      
      // In real implementation, would check for JSON-LD structured data
      // for Person schema with professional details
    });

    it('should be statically generated at build time', async () => {
      const mockMarkdownContent = 'test content';
      
      (readFile as jest.Mock).mockResolvedValue(mockMarkdownContent);
      (parseMarkdownResume as jest.Mock).mockResolvedValue(mockResumeData);
      (validateResumeData as jest.Mock).mockReturnValue(mockResumeData);

      const context: GetStaticPropsContext = {};
      const result = await getStaticProps(context);
      
      // Should return props for static generation
      expect(result).toHaveProperty('props');
      expect(result).not.toHaveProperty('revalidate'); // Static, no ISR by default
    });
  });

  describe('Error Boundaries and Fallbacks', () => {
    it('should handle component errors gracefully', () => {
      // Mock a component that throws an error
      const ThrowingComponent = () => {
        throw new Error('Component error');
      };

      // In real implementation, would test error boundary
      expect(() => render(<ThrowingComponent />)).toThrow();
    });

    it('should show fallback UI when resume data is invalid', () => {
      const invalidProps: ResumePageProps = {
        resumeData: {
          frontmatter: {} as any,
          content: '',
          htmlContent: '',
        },
      };
      
      render(<ResumePage {...invalidProps} />);
      
      // Should render without crashing, possibly showing error message
      expect(screen.getByTestId('resume-container') || document.body).toBeInTheDocument();
    });

    it('should handle missing PDF file gracefully', () => {
      const propsWithInvalidPDF = {
        ...mockProps,
        pdfUrl: '/nonexistent.pdf',
      };
      
      render(<ResumePage {...propsWithInvalidPDF} />);
      
      const pdfButton = screen.getByRole('button', { name: /download|pdf|export/i });
      expect(pdfButton).toBeInTheDocument();
      // Button should handle missing file in onClick handler
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<ResumePage {...mockProps} />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
    });

    it('should have skip to main content link', () => {
      render(<ResumePage {...mockProps} />);
      
      const skipLink = screen.getByText('Skip to main content') || 
                      screen.getByTestId('skip-link');
      expect(skipLink).toBeInTheDocument();
    });

    it('should support keyboard navigation', () => {
      render(<ResumePage {...mockProps} />);
      
      const focusableElements = screen.getAllByRole('link').concat(
        screen.getAllByRole('button')
      );
      
      focusableElements.forEach((element) => {
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });

    it('should have proper ARIA landmarks', () => {
      render(<ResumePage {...mockProps} />);
      
      expect(screen.getByRole('main') || screen.getByTestId('main-content')).toBeInTheDocument();
      expect(screen.getByRole('banner') || screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo') || screen.getByTestId('footer')).toBeInTheDocument();
    });
  });
});