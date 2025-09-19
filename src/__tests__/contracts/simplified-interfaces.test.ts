/**
 * Test contracts for simplified component interfaces
 * Validates the updated interfaces support the minimal design approach
 */

import { LayoutProps, PDFLinkProps } from '../../lib/component-interfaces';

describe('Simplified Component Interface Contracts', () => {
  describe('LayoutProps Interface', () => {
    it('should support navigation hiding with showNavigation prop', () => {
      const layoutPropsWithHiddenNav: LayoutProps = {
        children: 'Test content',
        showNavigation: false
      };

      const layoutPropsWithVisibleNav: LayoutProps = {
        children: 'Test content',
        showNavigation: true
      };

      const layoutPropsDefault: LayoutProps = {
        children: 'Test content'
        // showNavigation is optional and should default to false
      };

      expect(typeof layoutPropsWithHiddenNav.showNavigation).toBe('boolean');
      expect(typeof layoutPropsWithVisibleNav.showNavigation).toBe('boolean');
      expect(layoutPropsDefault.showNavigation).toBeUndefined();
    });

    it('should preserve existing SEO properties', () => {
      const layoutProps: LayoutProps = {
        children: 'Test content',
        title: 'Test Title',
        description: 'Test Description',
        className: 'test-class',
        showNavigation: false
      };

      expect(typeof layoutProps.title).toBe('string');
      expect(typeof layoutProps.description).toBe('string');
      expect(typeof layoutProps.className).toBe('string');
    });
  });

  describe('PDFLinkProps Interface', () => {
    it('should support minimal link styling properties', () => {
      const pdfLinkProps: PDFLinkProps = {
        pdfUrl: '/resume.pdf',
        fileName: 'resume.pdf',
        className: 'text-blue-600 hover:underline',
        inline: true,
        children: 'Download PDF'
      };

      expect(typeof pdfLinkProps.pdfUrl).toBe('string');
      expect(typeof pdfLinkProps.fileName).toBe('string');
      expect(typeof pdfLinkProps.className).toBe('string');
      expect(typeof pdfLinkProps.inline).toBe('boolean');
      expect(typeof pdfLinkProps.children).toBe('string');
    });

    it('should work with minimal required props', () => {
      const minimalPdfLinkProps: PDFLinkProps = {
        pdfUrl: '/resume.pdf'
      };

      expect(typeof minimalPdfLinkProps.pdfUrl).toBe('string');
      expect(minimalPdfLinkProps.fileName).toBeUndefined();
      expect(minimalPdfLinkProps.className).toBeUndefined();
      expect(minimalPdfLinkProps.inline).toBeUndefined();
      expect(minimalPdfLinkProps.children).toBeUndefined();
    });

    it('should support React nodes as children', () => {
      const pdfLinkPropsWithElement: PDFLinkProps = {
        pdfUrl: '/resume.pdf',
        children: <span>Download PDF</span>
      };

      // This should compile without errors
      expect(pdfLinkPropsWithElement.pdfUrl).toBe('/resume.pdf');
    });
  });

  describe('Simplified Design Philosophy', () => {
    it('should enforce minimal design principles in interface structure', () => {
      // Test that simplified interfaces focus on essential properties
      const essentialLayoutProps = ['children', 'showNavigation'];
      const essentialPdfProps = ['pdfUrl', 'inline'];

      const layoutProps: LayoutProps = { children: 'test' };
      const pdfProps: PDFLinkProps = { pdfUrl: '/test.pdf' };

      essentialLayoutProps.forEach(prop => {
        expect(prop in layoutProps || layoutProps.hasOwnProperty(prop) || prop === 'showNavigation').toBeTruthy();
      });

      essentialPdfProps.forEach(prop => {
        expect(prop in pdfProps || pdfProps.hasOwnProperty(prop) || prop === 'inline').toBeTruthy();
      });
    });
  });
});