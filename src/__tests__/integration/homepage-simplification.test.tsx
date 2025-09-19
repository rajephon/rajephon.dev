/**
 * Homepage Simplification Tests
 * Tests to verify text-only content and minimal styling
 * These tests MUST FAIL until homepage is simplified
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { GetStaticPropsResult } from 'next';
import Homepage from '@/pages/index';
import { HomePageProps } from '@/lib/component-interfaces';

// Mock Layout component to focus on homepage content
jest.mock('@/components/Layout', () => {
  return function MockLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Mock site config
const mockSiteConfig = {
  title: 'Test Site',
  description: 'Test Description',
  domain: 'test.dev',
  author: 'Test Author',
  socialLinks: {},
  seo: {
    defaultTitle: 'Test',
    titleTemplate: '%s | Test',
    description: 'Test site',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: 'https://test.dev',
      siteName: 'Test Site',
      images: []
    }
  }
};

describe('Homepage Simplification', () => {
  const defaultProps: HomePageProps = {
    siteConfig: mockSiteConfig
  };

  describe('Text-Only Content Validation', () => {
    it('should contain only essential text content', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should have basic text content
      expect(screen.getByText(/welcome|hello|home/i)).toBeInTheDocument();
      
      // Should not have complex visual elements
      const decorativeElements = document.querySelectorAll('.bg-gradient, .shadow, .rounded-lg, .border-2');
      expect(decorativeElements.length).toBe(0);
    });

    it('should have minimal styling classes', () => {
      render(<Homepage {...defaultProps} />);
      
      // Check that no decorative Tailwind classes are used
      const prohibitedClasses = [
        'shadow-lg', 'shadow-md', 'shadow-sm',
        'bg-gradient-to-r', 'bg-gradient-to-l', 'bg-gradient-to-b',
        'rounded-lg', 'rounded-xl', 'rounded-2xl',
        'border-2', 'border-4',
        'transform', 'hover:scale-'
      ];

      const bodyHtml = document.body.innerHTML;
      prohibitedClasses.forEach(className => {
        expect(bodyHtml).not.toContain(className);
      });
    });

    it('should use terminal-like aesthetic', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should have simple text-based layout
      const mainContent = screen.getByTestId('layout');
      const textElements = mainContent.querySelectorAll('p, h1, h2, h3, a');
      
      expect(textElements.length).toBeGreaterThan(0);
      
      // Text should be the primary content
      const textContent = mainContent.textContent || '';
      expect(textContent.length).toBeGreaterThan(50); // Should have substantial text
    });
  });

  describe('Essential Links Preservation', () => {
    it('should contain link to resume page', () => {
      render(<Homepage {...defaultProps} />);
      
      const resumeLink = screen.getByRole('link', { name: /resume/i });
      expect(resumeLink).toBeInTheDocument();
      expect(resumeLink).toHaveAttribute('href', '/resume');
    });

    it('should have simple link styling', () => {
      render(<Homepage {...defaultProps} />);
      
      const links = screen.getAllByRole('link');
      
      links.forEach(link => {
        // Links should have minimal styling
        const classes = link.className;
        expect(classes).not.toMatch(/bg-|shadow-|rounded-|border-2/);
      });
    });
  });

  describe('Layout Structure', () => {
    it('should have simple semantic HTML', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should use basic semantic elements
      const headings = document.querySelectorAll('h1, h2, h3');
      const paragraphs = document.querySelectorAll('p');
      const links = document.querySelectorAll('a');
      
      expect(headings.length).toBeGreaterThan(0);
      expect(paragraphs.length).toBeGreaterThan(0);
      expect(links.length).toBeGreaterThan(0);
    });

    it('should not have complex container structures', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should not have nested card/container structures
      const complexContainers = document.querySelectorAll('.card, .container, .wrapper, .panel');
      expect(complexContainers.length).toBeLessThanOrEqual(1); // Allow one main container
    });

    it('should maintain responsive design with simple classes', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should use basic responsive utilities only
      const bodyHtml = document.body.innerHTML;
      
      // Allow basic responsive classes but not complex ones
      const allowedResponsive = /md:|lg:|sm:/;
      const prohibitedComplex = /md:shadow-|lg:transform|sm:rounded-/;
      
      if (allowedResponsive.test(bodyHtml)) {
        expect(bodyHtml).not.toMatch(prohibitedComplex);
      }
    });
  });

  describe('Performance and Accessibility', () => {
    it('should be accessible without complex interactions', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should have proper heading hierarchy
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
      
      // Links should be keyboard accessible
      const links = screen.getAllByRole('link');
      links.forEach(link => {
        expect(link).toBeVisible();
        expect(link.tabIndex).not.toBe(-1);
      });
    });

    it('should have fast loading characteristics', () => {
      render(<Homepage {...defaultProps} />);
      
      // Minimal DOM structure for better performance
      const allElements = document.querySelectorAll('*');
      expect(allElements.length).toBeLessThan(50); // Keep DOM simple
    });
  });

  describe('Content Requirements', () => {
    it('should display author information', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should show basic info about the site owner
      expect(screen.getByText(mockSiteConfig.author) || 
             screen.getByText(/developer|engineer|designer/i)).toBeInTheDocument();
    });

    it('should have clear call-to-action for resume', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should have prominent but simple resume link
      const resumeCall = screen.getByRole('link', { name: /view resume|see resume|resume/i });
      expect(resumeCall).toBeInTheDocument();
    });

    it('should match terminal/plain-text aesthetic', () => {
      render(<Homepage {...defaultProps} />);
      
      // Should feel like a simple text document
      const bodyHtml = document.body.innerHTML;
      
      // Should not contain image elements (except icons)
      const images = document.querySelectorAll('img:not([class*="icon"])');
      expect(images.length).toBe(0);
      
      // Should not contain video or complex media
      const media = document.querySelectorAll('video, audio, canvas, svg:not([class*="icon"])');
      expect(media.length).toBe(0);
    });
  });
});

// Mock getStaticProps to ensure it returns proper structure
export const mockGetStaticProps = async (): Promise<GetStaticPropsResult<HomePageProps>> => {
  return {
    props: {
      siteConfig: mockSiteConfig
    }
  };
};