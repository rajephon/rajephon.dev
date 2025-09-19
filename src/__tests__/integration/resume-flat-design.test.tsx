/**
 * Resume Page Flat Design Tests
 * Tests to verify no shadows/backgrounds and flat design
 * These tests MUST FAIL until resume page is flattened
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { GetStaticPropsResult } from 'next';
import ResumePage from '@/pages/resume';
import { ResumePageProps } from '@/lib/component-interfaces';
import { ResumeData } from '@/lib/resume-schema';

// Mock Layout component
jest.mock('@/components/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock ResumeRenderer component
jest.mock('@/components/ResumeRenderer', () => {
  return function MockResumeRenderer() {
    return <div data-testid="resume-content">Resume Content</div>;
  };
});

// Mock PDFExportButton component
jest.mock('@/components/PDFExportButton', () => {
  return function MockPDFExportButton() {
    return <a data-testid="pdf-link" href="/resume.pdf">PDF</a>;
  };
});

// Mock resume data
const mockResumeData: ResumeData = {
  frontmatter: {
    name: 'Test User',
    title: 'Software Engineer',
    email: 'test@example.com',
    lastUpdated: '2025-09-18'
  },
  content: '# Test Resume\n\nTest content'
};

describe('Resume Page Flat Design', () => {
  const defaultProps: ResumePageProps = {
    resumeData: mockResumeData,
    showPDFButton: true,
    pdfUrl: '/resume.pdf'
  };

  describe('Visual Elements Removal', () => {
    it('should not have any shadow effects', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Check that no shadow classes are present
      const shadowClasses = [
        'shadow-sm', 'shadow', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl',
        'drop-shadow', 'drop-shadow-sm', 'drop-shadow-md', 'drop-shadow-lg'
      ];
      
      const bodyHtml = document.body.innerHTML;
      shadowClasses.forEach(shadowClass => {
        expect(bodyHtml).not.toContain(shadowClass);
      });
    });

    it('should not have background color differences', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Should not have background color variations that create visual separation
      const backgroundClasses = [
        'bg-gray-50', 'bg-gray-100', 'bg-white', 'bg-slate-50',
        'bg-opacity-', 'bg-gradient-'
      ];
      
      const bodyHtml = document.body.innerHTML;
      const problematicBgClasses = backgroundClasses.filter(bgClass => 
        bodyHtml.includes(bgClass) && !bgClass.startsWith('bg-white')
      );
      
      expect(problematicBgClasses.length).toBe(0);
    });

    it('should not have visual separators or borders creating depth', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Check for border classes that create visual separation
      const borderClasses = [
        'border-2', 'border-4', 'border-8',
        'border-gray-200', 'border-gray-300', 'border-slate-200'
      ];
      
      const bodyHtml = document.body.innerHTML;
      borderClasses.forEach(borderClass => {
        expect(bodyHtml).not.toContain(borderClass);
      });
    });

    it('should not have rounded corners creating card-like appearance', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Should not have rounded corners that make content look like cards
      const roundedClasses = [
        'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl'
      ];
      
      const bodyHtml = document.body.innerHTML;
      roundedClasses.forEach(roundedClass => {
        expect(bodyHtml).not.toContain(roundedClass);
      });
    });
  });

  describe('Flat Design Implementation', () => {
    it('should appear flat against page background', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Resume content should not be contained in elevated containers
      const containers = document.querySelectorAll('[class*="container"], [class*="card"], [class*="panel"]');
      
      containers.forEach(container => {
        const classes = container.className;
        expect(classes).not.toMatch(/shadow|bg-(?!white|transparent)|border-[2-9]/);
      });
    });

    it('should use typography for hierarchy instead of visual elements', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Should rely on text styling rather than containers for structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const textElements = document.querySelectorAll('p, span, div');
      
      expect(headings.length).toBeGreaterThan(0);
      
      // Headings should provide hierarchy
      headings.forEach(heading => {
        const computedStyle = window.getComputedStyle(heading);
        // Should have different font sizes for hierarchy, not containers
        expect(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(heading.tagName.toLowerCase())).toBe(true);
      });
    });

    it('should maintain readability without visual aids', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Content should be readable through typography alone
      const resumeContent = screen.getByTestId('resume-content');
      expect(resumeContent).toBeInTheDocument();
      expect(resumeContent.textContent).toBeTruthy();
    });
  });

  describe('Layout Structure', () => {
    it('should have simple, flat layout structure', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Should not have nested container structures
      const nestedContainers = document.querySelectorAll('div > div > div > div');
      expect(nestedContainers.length).toBeLessThan(5); // Allow minimal nesting
    });

    it('should not use spacing that creates visual grouping beyond typography', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Should use consistent, minimal spacing
      const bodyHtml = document.body.innerHTML;
      
      // Avoid large spacing that creates visual cards
      const prohibitedSpacing = ['p-8', 'p-12', 'm-8', 'm-12', 'gap-8', 'gap-12'];
      prohibitedSpacing.forEach(spacing => {
        expect(bodyHtml).not.toContain(spacing);
      });
    });

    it('should maintain print-friendly flat design', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Flat design should work well for printing
      const allElements = document.querySelectorAll('*');
      
      // Check that elements don't have print-problematic styling
      allElements.forEach(element => {
        const classes = element.className;
        if (classes) {
          expect(classes).not.toMatch(/shadow|rounded-lg|border-2|bg-gradient/);
        }
      });
    });
  });

  describe('Content Presentation', () => {
    it('should display resume content without visual containers', () => {
      render(<ResumePage {...defaultProps} />);
      
      const resumeContent = screen.getByTestId('resume-content');
      expect(resumeContent).toBeInTheDocument();
      
      // Content should be present without being wrapped in cards
      const parent = resumeContent.parentElement;
      if (parent) {
        expect(parent.className).not.toMatch(/shadow|border-2|rounded-lg|bg-(?!white|transparent)/);
      }
    });

    it('should integrate PDF link naturally without prominence', () => {
      render(<ResumePage {...defaultProps} />);
      
      const pdfLink = screen.getByTestId('pdf-link');
      expect(pdfLink).toBeInTheDocument();
      
      // PDF link should not have button-like styling
      expect(pdfLink.className).not.toMatch(/bg-blue|shadow|rounded|border-2|px-4|py-2/);
    });

    it('should look like printed resume on white paper', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Overall appearance should be flat like printed document
      const bodyHtml = document.body.innerHTML;
      
      // Should not have visual effects that create depth
      const depthEffects = [
        'transform', 'rotate', 'scale', 'translate',
        'hover:shadow', 'hover:bg-', 'transition-all'
      ];
      
      depthEffects.forEach(effect => {
        expect(bodyHtml).not.toContain(effect);
      });
    });
  });

  describe('Accessibility and Performance', () => {
    it('should maintain accessibility without visual cues', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Should use semantic HTML for structure
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      expect(headings.length).toBeGreaterThan(0);
      
      // Content should be in logical reading order
      const resumeContent = screen.getByTestId('resume-content');
      expect(resumeContent).toBeInTheDocument();
    });

    it('should have improved performance with simplified styling', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Fewer DOM elements due to flat design
      const allElements = document.querySelectorAll('*');
      expect(allElements.length).toBeLessThan(100); // Should be lightweight
    });

    it('should work well on all screen sizes without visual complexity', () => {
      render(<ResumePage {...defaultProps} />);
      
      // Should use simple responsive design
      const bodyHtml = document.body.innerHTML;
      
      // Allow basic responsive classes but not complex visual ones
      if (bodyHtml.includes('md:') || bodyHtml.includes('lg:')) {
        expect(bodyHtml).not.toMatch(/md:shadow|lg:rounded|sm:border-2/);
      }
    });
  });
});

// Mock getStaticProps for resume page
export const mockGetStaticProps = async (): Promise<GetStaticPropsResult<ResumePageProps>> => {
  return {
    props: {
      resumeData: mockResumeData,
      showPDFButton: true,
      pdfUrl: '/resume.pdf'
    }
  };
};