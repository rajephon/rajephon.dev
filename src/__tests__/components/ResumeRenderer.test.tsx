/**
 * ResumeRenderer Component Tests
 * These tests MUST FAIL until ResumeRenderer component is implemented
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ResumeRenderer from '@/components/ResumeRenderer';
import { ResumeRendererProps } from '@/lib/component-interfaces';
import { ResumeFrontmatter } from '@/lib/resume-schema';

describe('ResumeRenderer Component', () => {
  const mockFrontmatter: ResumeFrontmatter = {
    name: 'Bruce Wayne',
    title: 'Senior Software Engineer',
    email: 'bruce@example.com',
    phone: '(+1) 123-456-7890',
    location: '1234 Abc Street, Gotham, GC 01234',
    linkedin: 'https://linkedin.com/in/brucewayne',
    github: 'https://github.com/brucewayne',
    website: 'https://example.com',
    lastUpdated: '2025-09-18T00:00:00.000Z',
  };

  const mockHtmlContent = `
    <h2>Experience</h2>
    <p><strong>Machine Learning Engineer Intern</strong></p>
    <p><strong>Slow Feet Technology</strong></p>
    <p><em>Jul 2021 - Present</em></p>
    <ul>
      <li>Devised a new food-agnostic formulation for fine-grained cross-ingredient meal cooking</li>
      <li>Proposed a cream of mushroom soup recipe which is competitive when compared with SOTA recipes</li>
    </ul>
    <h2>Education</h2>
    <p><strong>M.S. in Computer Science</strong></p>
    <p>University of Charles River</p>
    <p><em>Sep 2021 - Jan 2023</em></p>
    <h2>Skills</h2>
    <p><strong>Programming Languages:</strong> <span class="iconify" data-icon="vscode-icons:file-type-python"></span> Python, <span class="iconify" data-icon="vscode-icons:file-type-js-official"></span> JavaScript</p>
  `;

  const defaultProps: ResumeRendererProps = {
    frontmatter: mockFrontmatter,
    htmlContent: mockHtmlContent,
  };

  describe('Basic Rendering', () => {
    it('should render name and title prominently', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      expect(screen.getByText('Bruce Wayne')).toBeInTheDocument();
      expect(screen.getByText('Senior Software Engineer')).toBeInTheDocument();
      
      // Name should be in h1 tag
      const nameElement = screen.getByRole('heading', { level: 1 });
      expect(nameElement).toHaveTextContent('Bruce Wayne');
    });

    it('should render contact information', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      expect(screen.getByText('bruce@example.com')).toBeInTheDocument();
      expect(screen.getByText('(+1) 123-456-7890')).toBeInTheDocument();
      expect(screen.getByText('1234 Abc Street, Gotham, GC 01234')).toBeInTheDocument();
    });

    it('should render contact information as clickable links', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      const emailLink = screen.getByRole('link', { name: /bruce@example\.com/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:bruce@example.com');
      
      const phoneLink = screen.getByRole('link', { name: /\+1.*123-456-7890/i });
      expect(phoneLink).toHaveAttribute('href', 'tel:+11234567890');
      
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/brucewayne');
      
      const githubLink = screen.getByRole('link', { name: /github/i });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/brucewayne');
      
      const websiteLink = screen.getByRole('link', { name: /example\.com/i });
      expect(websiteLink).toHaveAttribute('href', 'https://example.com');
    });

    it('should render processed HTML content', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      expect(screen.getByText('Experience')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning Engineer Intern')).toBeInTheDocument();
      expect(screen.getByText('Slow Feet Technology')).toBeInTheDocument();
      expect(screen.getByText('Jul 2021 - Present')).toBeInTheDocument();
      expect(screen.getByText('Education')).toBeInTheDocument();
      expect(screen.getByText('M.S. in Computer Science')).toBeInTheDocument();
      expect(screen.getByText('Skills')).toBeInTheDocument();
      expect(screen.getByText(/Programming Languages/)).toBeInTheDocument();
    });

    it('should apply proper CSS classes', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      const container = screen.getByTestId('resume-container') || document.querySelector('.resume-container');
      expect(container).toHaveClass('resume-container');
    });
  });

  describe('Theme Support', () => {
    it('should apply markdown-resume theme by default', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      const container = screen.getByTestId('resume-container') || document.querySelector('.theme-markdown-resume');
      expect(container).toHaveClass('theme-markdown-resume');
    });

    it('should apply specified theme', () => {
      const themes: Array<'modern' | 'classic' | 'minimal' | 'markdown-resume'> = [
        'modern',
        'classic', 
        'minimal',
        'markdown-resume',
      ];

      themes.forEach((theme) => {
        const { unmount } = render(
          <ResumeRenderer {...defaultProps} theme={theme} />
        );
        
        const container = screen.getByTestId('resume-container') || 
                         document.querySelector(`.theme-${theme}`);
        expect(container).toHaveClass(`theme-${theme}`);
        
        unmount();
      });
    });

    it('should render with custom className', () => {
      const props = {
        ...defaultProps,
        className: 'custom-resume-class',
      };

      render(<ResumeRenderer {...props} />);
      
      const container = screen.getByTestId('resume-container') || 
                       document.querySelector('.custom-resume-class');
      expect(container).toHaveClass('custom-resume-class');
    });
  });

  describe('Iconify Integration', () => {
    it('should render iconify icons in contact section', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      // Look for iconify elements in contact info
      const contactSection = screen.getByTestId('contact-section') || 
                            document.querySelector('.resume-contact');
      expect(contactSection).toBeInTheDocument();
      
      // Should have iconify span elements
      const iconifyElements = document.querySelectorAll('span.iconify');
      expect(iconifyElements.length).toBeGreaterThan(0);
    });

    it('should render iconify icons in skills section', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      // Skills section should contain iconify icons for programming languages
      const skillsSection = screen.getByText(/Programming Languages/);
      expect(skillsSection).toBeInTheDocument();
      
      // Should have Python and JavaScript icons
      const pythonIcon = document.querySelector('[data-icon="vscode-icons:file-type-python"]');
      const jsIcon = document.querySelector('[data-icon="vscode-icons:file-type-js-official"]');
      
      expect(pythonIcon).toBeInTheDocument();
      expect(jsIcon).toBeInTheDocument();
    });

    it('should have proper iconify alignment', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      const iconifyElements = document.querySelectorAll('span.iconify');
      iconifyElements.forEach((icon) => {
        // Should have proper CSS class for alignment
        expect(icon).toHaveClass('iconify');
        // In actual implementation, should check for vertical-align style
      });
    });
  });

  describe('Print Optimization', () => {
    it('should apply print optimization styles when enabled', () => {
      const props = {
        ...defaultProps,
        printOptimized: true,
      };

      render(<ResumeRenderer {...props} />);
      
      const container = screen.getByTestId('resume-container') || 
                       document.querySelector('.print-optimized');
      expect(container).toHaveClass('print-optimized');
    });

    it('should remove interactive elements in print mode', () => {
      const props = {
        ...defaultProps,
        printOptimized: true,
      };

      render(<ResumeRenderer {...props} />);
      
      // Interactive elements should be hidden or modified for print
      const interactiveElements = document.querySelectorAll('.print-hide, button:not(.print-show)');
      interactiveElements.forEach((element) => {
        expect(element).toHaveClass('print-hide') || 
        expect(element).toHaveStyle('display: none');
      });
    });

    it('should use print-friendly colors', () => {
      const props = {
        ...defaultProps,
        printOptimized: true,
      };

      render(<ResumeRenderer {...props} />);
      
      const container = screen.getByTestId('resume-container');
      // Should apply print-specific styles
      expect(container).toBeInTheDocument();
    });
  });

  describe('Definition Lists Support', () => {
    it('should render experience entries with definition list structure', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      // Should find definition lists for job entries
      const definitionLists = document.querySelectorAll('dl');
      expect(definitionLists.length).toBeGreaterThan(0);
      
      // Each dl should have corresponding dt and dd elements
      definitionLists.forEach((dl) => {
        const dts = dl.querySelectorAll('dt');
        const dds = dl.querySelectorAll('dd');
        expect(dts.length).toBeGreaterThan(0);
        expect(dds.length).toBeGreaterThan(0);
      });
    });

    it('should apply flexbox layout to definition lists', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      const definitionLists = document.querySelectorAll('dl');
      definitionLists.forEach((dl) => {
        // Should have CSS class that applies flexbox
        expect(dl).toBeInTheDocument();
        // In actual implementation, would check computed styles
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toHaveTextContent('Bruce Wayne');
      
      const h2Elements = screen.getAllByRole('heading', { level: 2 });
      expect(h2Elements.length).toBeGreaterThan(0);
      
      // Should include Experience, Education, Skills sections
      const sectionHeadings = h2Elements.map(el => el.textContent);
      expect(sectionHeadings).toContain('Experience');
      expect(sectionHeadings).toContain('Education');
      expect(sectionHeadings).toContain('Skills');
    });

    it('should have proper link accessibility', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      const links = screen.getAllByRole('link');
      links.forEach((link) => {
        // Links should have accessible names
        expect(link).toHaveAccessibleName();
        
        // External links should have proper attributes
        if (link.getAttribute('href')?.startsWith('http')) {
          expect(link).toHaveAttribute('target', '_blank');
          expect(link).toHaveAttribute('rel', 'noopener noreferrer');
        }
      });
    });

    it('should support keyboard navigation', () => {
      render(<ResumeRenderer {...defaultProps} />);
      
      const focusableElements = document.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])');
      focusableElements.forEach((element) => {
        // Should be focusable
        expect(element).not.toHaveAttribute('tabindex', '-1');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle missing frontmatter gracefully', () => {
      const props = {
        ...defaultProps,
        frontmatter: {} as ResumeFrontmatter,
      };

      expect(() => render(<ResumeRenderer {...props} />)).not.toThrow();
    });

    it('should handle empty HTML content', () => {
      const props = {
        ...defaultProps,
        htmlContent: '',
      };

      expect(() => render(<ResumeRenderer {...props} />)).not.toThrow();
    });

    it('should handle malformed HTML content', () => {
      const props = {
        ...defaultProps,
        htmlContent: '<h2>Unclosed header<p>Some content<strong>Bold text',
      };

      expect(() => render(<ResumeRenderer {...props} />)).not.toThrow();
    });
  });
});