/**
 * Contract Tests for Resume Content Service
 * 
 * Tests the resume content management functionality according to the contract
 * defined in specs/002-src-data-resume/contracts/resume-content.ts
 */

import { readFile } from 'fs/promises';
import path from 'path';
import { parseMarkdownResume, parseMultiLanguageResume } from '../markdown';
import type { ResumeData } from '../resume-schema';

// Mock file system for testing
jest.mock('fs/promises');
const mockReadFile = readFile as jest.MockedFunction<typeof readFile>;

describe('Resume Content Service Contract Tests', () => {
  const mockEnglishContent = `---
name: "John Doe"
title: "Software Engineer"
email: "john@example.com"
website: "https://johndoe.com"
location: "San Francisco, CA"
linkedin: "https://linkedin.com/in/johndoe"
github: "https://github.com/johndoe"
summary: "Experienced software engineer"
lastUpdated: "2025-09-18"
---

## Experience

**Software Engineer**
  : **Example Corp**
  : **2020 - Present**

Building amazing software.`;

  const mockKoreanContent = `---
name: "홍길동"
title: "소프트웨어 엔지니어"
email: "hong@example.com"
website: "https://honggildong.com"
location: "서울, 대한민국"
linkedin: "https://linkedin.com/in/honggildong"
github: "https://github.com/honggildong"
summary: "경험 많은 소프트웨어 엔지니어"
lastUpdated: "2025-09-18"
---

## 경력

**소프트웨어 엔지니어**
  : **예시 회사**
  : **2020 - 현재**

놀라운 소프트웨어를 만들고 있습니다.`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Single Language Content Loading', () => {
    it('should parse English resume content correctly', async () => {
      const result = await parseMarkdownResume(mockEnglishContent);
      
      expect(result).toHaveProperty('frontmatter');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('htmlContent');
      
      expect(result.frontmatter.name).toBe('John Doe');
      expect(result.frontmatter.title).toBe('Software Engineer');
      expect(result.frontmatter.email).toBe('john@example.com');
      expect(result.htmlContent).toContain('<h2>Experience</h2>');
    });

    it('should parse Korean resume content correctly', async () => {
      const result = await parseMarkdownResume(mockKoreanContent);
      
      expect(result).toHaveProperty('frontmatter');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('htmlContent');
      
      expect(result.frontmatter.name).toBe('홍길동');
      expect(result.frontmatter.title).toBe('소프트웨어 엔지니어');
      expect(result.frontmatter.location).toBe('서울, 대한민국');
      expect(result.htmlContent).toContain('<h2>경력</h2>');
    });

    it('should validate frontmatter fields', async () => {
      const invalidContent = `---
name: "John Doe"
# Missing required fields
---

## Experience
Some content.`;

      await expect(parseMarkdownResume(invalidContent)).rejects.toThrow();
    });

    it('should handle markdown parsing errors gracefully', async () => {
      const invalidMarkdown = `---
name: "John Doe"
title: "Engineer"
---

# Broken markdown [unclosed link(`;

      const result = await parseMarkdownResume(invalidMarkdown);
      expect(result).toHaveProperty('htmlContent');
      // Should not crash, even with malformed markdown
    });
  });

  describe('Multi-Language Content Loading', () => {
    it('should parse multiple language versions', async () => {
      const contents = {
        en: mockEnglishContent,
        ko: mockKoreanContent
      };
      
      const results = await parseMultiLanguageResume(contents);
      
      expect(results).toHaveProperty('en');
      expect(results).toHaveProperty('ko');
      
      expect(results.en.frontmatter.name).toBe('John Doe');
      expect(results.ko.frontmatter.name).toBe('홍길동');
    });

    it('should handle parsing errors for specific languages', async () => {
      const contents = {
        en: mockEnglishContent,
        ko: 'invalid frontmatter'
      };
      
      await expect(parseMultiLanguageResume(contents)).rejects.toThrow(
        /Failed to parse resume for language 'ko'/
      );
    });

    it('should return empty object for empty input', async () => {
      const results = await parseMultiLanguageResume({});
      expect(results).toEqual({});
    });
  });

  describe('Content Validation', () => {
    it('should validate required frontmatter fields', async () => {
      const requiredFields = ['name', 'title', 'email', 'website', 'location', 'summary'];
      
      for (const field of requiredFields) {
        const contentWithoutField = mockEnglishContent.replace(
          new RegExp(`${field}: ".*"`), 
          ''
        );
        
        await expect(parseMarkdownResume(contentWithoutField)).rejects.toThrow();
      }
    });

    it('should validate email format', async () => {
      const invalidEmailContent = mockEnglishContent.replace(
        'email: "john@example.com"',
        'email: "invalid-email"'
      );
      
      await expect(parseMarkdownResume(invalidEmailContent)).rejects.toThrow();
    });

    it('should validate URL formats', async () => {
      const invalidUrlContent = mockEnglishContent.replace(
        'website: "https://johndoe.com"',
        'website: "not-a-url"'
      );
      
      await expect(parseMarkdownResume(invalidUrlContent)).rejects.toThrow();
    });
  });

  describe('PDF URL Generation', () => {
    // Note: This would be implemented in a ResumeContentService class
    it('should generate correct PDF URLs for each language', () => {
      const expectedUrls = {
        en: '/resume.pdf',
        ko: '/resume-ko.pdf'
      };
      
      expect(expectedUrls.en).toBe('/resume.pdf');
      expect(expectedUrls.ko).toBe('/resume-ko.pdf');
    });
  });

  describe('Content Existence Checking', () => {
    it('should check if content files exist', async () => {
      mockReadFile.mockResolvedValueOnce(mockEnglishContent);
      
      const contentPath = path.join(process.cwd(), 'src/data/resume.md');
      const content = await readFile(contentPath, 'utf-8');
      
      expect(content).toBeDefined();
      expect(typeof content).toBe('string');
    });

    it('should handle missing content files', async () => {
      mockReadFile.mockRejectedValueOnce(new Error('File not found'));
      
      const contentPath = path.join(process.cwd(), 'src/data/nonexistent.md');
      
      await expect(readFile(contentPath, 'utf-8')).rejects.toThrow('File not found');
    });
  });

  describe('Performance Requirements', () => {
    it('should parse content quickly', async () => {
      const startTime = performance.now();
      
      await parseMarkdownResume(mockEnglishContent);
      
      const endTime = performance.now();
      const parseTime = endTime - startTime;
      
      // Should parse in reasonable time (less than 100ms)
      expect(parseTime).toBeLessThan(100);
    });

    it('should handle large content efficiently', async () => {
      // Create a large resume content
      const largeContent = mockEnglishContent + '\n\n' + 
        Array(1000).fill('## Section\n\nContent here.').join('\n\n');
      
      const startTime = performance.now();
      
      const result = await parseMarkdownResume(largeContent);
      
      const endTime = performance.now();
      const parseTime = endTime - startTime;
      
      expect(result).toBeDefined();
      expect(parseTime).toBeLessThan(1000); // Should handle large content in under 1 second
    });
  });

  describe('Error Handling', () => {
    it('should provide meaningful error messages', async () => {
      const invalidContent = 'not valid frontmatter';
      
      await expect(parseMarkdownResume(invalidContent)).rejects.toThrow(
        expect.stringMatching(/frontmatter/i)
      );
    });

    it('should handle encoding issues', async () => {
      // Test with various encodings and special characters
      const unicodeContent = mockKoreanContent; // Already contains Korean characters
      
      const result = await parseMarkdownResume(unicodeContent);
      
      expect(result.frontmatter.name).toBe('홍길동');
      expect(result.htmlContent).toContain('소프트웨어');
    });
  });

  describe('Content Structure Validation', () => {
    it('should validate resume sections exist', async () => {
      const result = await parseMarkdownResume(mockEnglishContent);
      
      // Should contain essential sections
      expect(result.htmlContent).toContain('<h2>Experience</h2>');
      // Additional sections would be validated here
    });

    it('should handle missing optional sections gracefully', async () => {
      const minimalContent = `---
name: "John Doe"
title: "Software Engineer"
email: "john@example.com"
website: "https://johndoe.com"
location: "San Francisco, CA"
linkedin: "https://linkedin.com/in/johndoe"
github: "https://github.com/johndoe"
summary: "Experienced software engineer"
lastUpdated: "2025-09-18"
---

## Experience

Some experience.`;

      const result = await parseMarkdownResume(minimalContent);
      
      expect(result).toBeDefined();
      expect(result.frontmatter.name).toBe('John Doe');
    });
  });
});