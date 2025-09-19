/**
 * Contract Tests for Resume Schema Validation
 * These tests MUST FAIL until resume schema implementation is complete
 */

import {
  ResumeFrontmatter,
  ResumeData,
  ResumeFrontmatterSchema,
  ResumeDataSchema,
  isValidResumeFrontmatter,
  isValidResumeData,
  validateResumeData,
  MarkdownResumeStructure,
  validateMarkdownResumeStructure,
} from '@/lib/resume-schema';

describe('Resume Schema Contract Tests', () => {
  const validFrontmatter: ResumeFrontmatter = {
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

  const validResumeData: ResumeData = {
    frontmatter: validFrontmatter,
    content: '## Experience\n\n**Machine Learning Engineer**',
    htmlContent: '<h2>Experience</h2><p><strong>Machine Learning Engineer</strong></p>',
  };

  const markdownWithIcons = `
    <h1>Bruce Wayne</h1>
    <p><span class="iconify" data-icon="charm:person"></span> <a href="https://example.com/">example.com</a></p>
    <p><span class="iconify" data-icon="tabler:mail"></span> <a href="mailto:bruce@example.com">bruce@example.com</a></p>
    <h2>Experience</h2>
    <p><strong>Machine Learning Engineer</strong></p>
    <h2>Education</h2>
    <p>M.S. in Computer Science</p>
    <h2>Skills</h2>
    <p>JavaScript, TypeScript</p>
  `;

  describe('ResumeFrontmatter Schema Validation', () => {
    it('should validate valid frontmatter data', () => {
      expect(() => ResumeFrontmatterSchema.parse(validFrontmatter)).not.toThrow();
      expect(isValidResumeFrontmatter(validFrontmatter)).toBe(true);
    });

    it('should require name field', () => {
      const invalid = { ...validFrontmatter, name: '' };
      expect(() => ResumeFrontmatterSchema.parse(invalid)).toThrow();
      expect(isValidResumeFrontmatter(invalid)).toBe(false);
    });

    it('should require title field', () => {
      const invalid = { ...validFrontmatter, title: '' };
      expect(() => ResumeFrontmatterSchema.parse(invalid)).toThrow();
      expect(isValidResumeFrontmatter(invalid)).toBe(false);
    });

    it('should require valid email format', () => {
      const invalid = { ...validFrontmatter, email: 'invalid-email' };
      expect(() => ResumeFrontmatterSchema.parse(invalid)).toThrow();
      expect(isValidResumeFrontmatter(invalid)).toBe(false);
    });

    it('should validate URL fields when provided', () => {
      const invalidWebsite = { ...validFrontmatter, website: 'not-a-url' };
      expect(() => ResumeFrontmatterSchema.parse(invalidWebsite)).toThrow();
      
      const invalidLinkedIn = { ...validFrontmatter, linkedin: 'not-a-url' };
      expect(() => ResumeFrontmatterSchema.parse(invalidLinkedIn)).toThrow();
      
      const invalidGitHub = { ...validFrontmatter, github: 'not-a-url' };
      expect(() => ResumeFrontmatterSchema.parse(invalidGitHub)).toThrow();
    });

    it('should allow empty string for optional URL fields', () => {
      const withEmptyUrls = {
        ...validFrontmatter,
        website: '',
        linkedin: '',
        github: '',
      };
      expect(() => ResumeFrontmatterSchema.parse(withEmptyUrls)).not.toThrow();
    });

    it('should require valid ISO date for lastUpdated', () => {
      const invalid = { ...validFrontmatter, lastUpdated: 'invalid-date' };
      expect(() => ResumeFrontmatterSchema.parse(invalid)).toThrow();
      expect(isValidResumeFrontmatter(invalid)).toBe(false);
    });
  });

  describe('ResumeData Schema Validation', () => {
    it('should validate valid resume data', () => {
      expect(() => ResumeDataSchema.parse(validResumeData)).not.toThrow();
      expect(isValidResumeData(validResumeData)).toBe(true);
    });

    it('should require non-empty content', () => {
      const invalid = { ...validResumeData, content: '' };
      expect(() => ResumeDataSchema.parse(invalid)).toThrow();
      expect(isValidResumeData(invalid)).toBe(false);
    });

    it('should allow optional htmlContent', () => {
      const withoutHtml = { ...validResumeData };
      delete withoutHtml.htmlContent;
      expect(() => ResumeDataSchema.parse(withoutHtml)).not.toThrow();
    });
  });

  describe('validateResumeData Helper', () => {
    it('should return parsed data for valid input', () => {
      const result = validateResumeData(validResumeData);
      expect(result).toEqual(validResumeData);
    });

    it('should throw for invalid data', () => {
      const invalid = { ...validResumeData, frontmatter: { name: '' } };
      expect(() => validateResumeData(invalid)).toThrow();
    });
  });

  describe('Markdown-Resume Structure Validation', () => {
    it('should validate markdown-resume structure with icons', () => {
      const structure = validateMarkdownResumeStructure(markdownWithIcons);
      
      expect(structure.hasNameHeader).toBe(true);
      expect(structure.hasContactSection).toBe(true);
      expect(structure.hasExperienceSection).toBe(true);
      expect(structure.hasEducationSection).toBe(true);
      expect(structure.hasSkillsSection).toBe(true);
      expect(structure.optionalSections).toEqual([]);
    });

    it('should detect missing required sections', () => {
      const incompleteHtml = '<h1>Name</h1><p>Contact info</p>';
      const structure = validateMarkdownResumeStructure(incompleteHtml);
      
      expect(structure.hasNameHeader).toBe(true);
      expect(structure.hasExperienceSection).toBe(false);
      expect(structure.hasEducationSection).toBe(false);
      expect(structure.hasSkillsSection).toBe(false);
    });

    it('should detect iconify icons in contact section', () => {
      const withoutIcons = '<h1>Name</h1><p>No icons here</p>';
      const structure = validateMarkdownResumeStructure(withoutIcons);
      
      expect(structure.hasContactSection).toBe(false);
    });

    it('should identify optional sections', () => {
      const withOptionalSections = markdownWithIcons + 
        '<h2>Awards and Honors</h2><p>Gold Medal</p>' +
        '<h2>Publications</h2><p>Research Paper</p>';
      
      const structure = validateMarkdownResumeStructure(withOptionalSections);
      
      expect(structure.optionalSections).toContain('Awards and Honors');
      expect(structure.optionalSections).toContain('Publications');
    });
  });

  describe('Type Guards', () => {
    it('should correctly identify valid ResumeFrontmatter', () => {
      expect(isValidResumeFrontmatter(validFrontmatter)).toBe(true);
      expect(isValidResumeFrontmatter({ name: 'Test' })).toBe(false);
      expect(isValidResumeFrontmatter(null)).toBe(false);
      expect(isValidResumeFrontmatter(undefined)).toBe(false);
    });

    it('should correctly identify valid ResumeData', () => {
      expect(isValidResumeData(validResumeData)).toBe(true);
      expect(isValidResumeData({ frontmatter: validFrontmatter })).toBe(false);
      expect(isValidResumeData(null)).toBe(false);
      expect(isValidResumeData(undefined)).toBe(false);
    });
  });
});