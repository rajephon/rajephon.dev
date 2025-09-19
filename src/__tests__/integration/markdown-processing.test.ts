/**
 * Markdown Processing Integration Tests
 * These tests MUST FAIL until markdown processing utilities are implemented
 */

import {
  parseMarkdownResume,
  processMarkdownToHtml,
  extractFrontmatter,
  MarkdownProcessor,
} from '@/lib/markdown';
import { validateResumeData, MarkdownResumeStructure } from '@/lib/resume-schema';

describe('Markdown Processing Integration', () => {
  const sampleMarkdownResume = `---
name: "Bruce Wayne"
title: "Senior Software Engineer"
email: "bruce@example.com"
phone: "(+1) 123-456-7890"
location: "1234 Abc Street, Gotham, GC 01234"
linkedin: "https://linkedin.com/in/brucewayne"
github: "https://github.com/brucewayne"
website: "https://example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

# Bruce Wayne

<span class="iconify" data-icon="charm:person"></span> [example.com](https://example.com/)
  : <span class="iconify" data-icon="tabler:brand-github"></span> [github.com/brucewayne](https://github.com/brucewayne)
  : <span class="iconify" data-icon="tabler:phone"></span> [(+1) 123-456-7890](tel:+11234567890)

<span class="iconify" data-icon="ic:outline-location-on"></span> 1234 Abc Street, Gotham, GC 01234
  : <span class="iconify" data-icon="tabler:brand-linkedin"></span> [linkedin.com/in/brucewayne](https://linkedin.com/in/brucewayne/)
  : <span class="iconify" data-icon="tabler:mail"></span> [bruce@example.com](mailto:bruce@example.com)

## Experience

**Machine Learning Engineer Intern**
  : **Slow Feet Technology**
  : **Jul 2021 - Present**

- Devised a new food-agnostic formulation for fine-grained cross-ingredient meal cooking
- Proposed a cream of mushroom soup recipe which is competitive when compared with SOTA recipes
- Developed a pan for meal cooking which is benefiting the group members' research work

**Research Intern**
  : **Paddling University**
  : **Aug 2020 - Present**

- Designed an efficient method for mapo tofu quality estimation via thermometer
- Proposed a fast stir frying algorithm for tofu cooking problems
- Outperformed SOTA methods while cooking much more efficient in experiments

## Education

**M.S. in Computer Science**
  : **Sep 2021 - Jan 2023**

University of Charles River
  : Boston, MA

**B.Eng. in Software Engineering**
  : **Sep 2016 - Jul 2020**

Huangdu Institute of Technology
  : Shanghai, China

## Skills

**Programming Languages:** <span class="iconify" data-icon="vscode-icons:file-type-python"></span> Python, <span class="iconify" data-icon="vscode-icons:file-type-js-official"></span> JavaScript / <span class="iconify" data-icon="vscode-icons:file-type-typescript-official"></span> TypeScript

**Tools and Frameworks:** Git, PyTorch, Keras, scikit-learn, Linux, Vue, React, Django, $\\LaTeX$

**Languages:** English (proficient), Korean (native)

## Awards and Honors

**Gold**, International Collegiate Programming Contest (ICPC)
  : 2018

**First Prize**, Korea National Scholarship for Outstanding Students
  : 2017, 2018

## Publications

[~P1]: **Deep Learning for Web Development**

    <u>Bruce Wayne</u>, Clark Kent

    *Conference on Neural Information Processing Systems (NeurIPS), 2024*

[~P2]: **You Only Code Once: Unified, Real-Time Web Application Framework**

    <u>Bruce Wayne</u>, Clark Kent, Diana Prince

    *International Conference on Software Engineering (ICSE), 2023 **(Best Paper Award)***`;

  const invalidMarkdown = `---
name: ""
email: "invalid-email"
---

# Invalid Resume

No proper structure here.`;

  const markdownWithMath = `---
name: "Math Expert"
title: "Research Scientist"
email: "math@example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

# Math Expert

## Research

My research focuses on $E = mc^2$ and other equations.

$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$

The complexity is $O(n \\log n)$ for the best case.`;

  describe('parseMarkdownResume Function', () => {
    it('should parse valid markdown resume completely', async () => {
      const result = await parseMarkdownResume(sampleMarkdownResume);
      
      expect(result).toBeDefined();
      expect(result.frontmatter).toBeDefined();
      expect(result.content).toBeDefined();
      expect(result.htmlContent).toBeDefined();
      
      // Validate frontmatter
      expect(result.frontmatter.name).toBe('Bruce Wayne');
      expect(result.frontmatter.title).toBe('Senior Software Engineer');
      expect(result.frontmatter.email).toBe('bruce@example.com');
      expect(result.frontmatter.phone).toBe('(+1) 123-456-7890');
      expect(result.frontmatter.linkedin).toBe('https://linkedin.com/in/brucewayne');
      
      // Validate content
      expect(result.content).toContain('# Bruce Wayne');
      expect(result.content).toContain('## Experience');
      expect(result.content).toContain('Machine Learning Engineer Intern');
      
      // Validate HTML content
      expect(result.htmlContent).toContain('<h1>Bruce Wayne</h1>');
      expect(result.htmlContent).toContain('<h2>Experience</h2>');
      expect(result.htmlContent).toContain('iconify');
    });

    it('should validate parsed data against schema', async () => {
      const result = await parseMarkdownResume(sampleMarkdownResume);
      
      expect(() => validateResumeData(result)).not.toThrow();
    });

    it('should handle invalid frontmatter gracefully', async () => {
      await expect(parseMarkdownResume(invalidMarkdown)).rejects.toThrow();
    });

    it('should handle markdown without frontmatter', async () => {
      const markdownOnly = '# Simple Resume\n\nNo frontmatter here.';
      
      await expect(parseMarkdownResume(markdownOnly)).rejects.toThrow();
    });
  });

  describe('extractFrontmatter Function', () => {
    it('should extract frontmatter and content separately', () => {
      const { frontmatter, content } = extractFrontmatter(sampleMarkdownResume);
      
      expect(frontmatter).toBeDefined();
      expect(frontmatter.name).toBe('Bruce Wayne');
      expect(frontmatter.title).toBe('Senior Software Engineer');
      
      expect(content).toBeDefined();
      expect(content).not.toContain('---');
      expect(content).toContain('# Bruce Wayne');
      expect(content).toContain('## Experience');
    });

    it('should handle missing frontmatter', () => {
      const markdownOnly = '# Simple Resume\n\nNo frontmatter here.';
      
      expect(() => extractFrontmatter(markdownOnly)).toThrow();
    });

    it('should handle empty frontmatter', () => {
      const emptyFrontmatter = '---\n---\n\n# Resume\n\nContent here.';
      
      const { frontmatter, content } = extractFrontmatter(emptyFrontmatter);
      expect(frontmatter).toEqual({});
      expect(content).toContain('# Resume');
    });
  });

  describe('processMarkdownToHtml Function', () => {
    it('should convert markdown to HTML with remark plugins', async () => {
      const markdown = `# Test Resume

## Experience

**Senior Engineer**
  : **Tech Company**
  : **2020 - Present**

- Built amazing applications
- Led technical teams

## Skills

**Languages:** <span class="iconify" data-icon="vscode-icons:file-type-python"></span> Python`;

      const html = await processMarkdownToHtml(markdown);
      
      expect(html).toContain('<h1>Test Resume</h1>');
      expect(html).toContain('<h2>Experience</h2>');
      expect(html).toContain('<strong>Senior Engineer</strong>');
      expect(html).toContain('<ul>');
      expect(html).toContain('<li>Built amazing applications</li>');
      expect(html).toContain('iconify');
      expect(html).toContain('data-icon="vscode-icons:file-type-python"');
    });

    it('should process definition lists correctly', async () => {
      const markdownWithDL = `**Job Title**
  : **Company Name**
  : **Date Range**`;

      const html = await processMarkdownToHtml(markdownWithDL);
      
      // Should contain definition list elements
      expect(html).toContain('<dl>') || expect(html).toContain('<dt>') || expect(html).toContain('<dd>');
    });

    it('should handle GitHub Flavored Markdown', async () => {
      const gfmMarkdown = `## Task List

- [x] Completed task
- [ ] Pending task

## Table

| Name | Role |
|------|------|
| Bruce | Engineer |

## Strikethrough

~~Old information~~

## Autolinks

Visit https://github.com/brucewayne automatically.`;

      const html = await processMarkdownToHtml(gfmMarkdown);
      
      expect(html).toContain('<input') || expect(html).toContain('checked');
      expect(html).toContain('<table>');
      expect(html).toContain('<del>') || expect(html).toContain('~~');
      expect(html).toContain('<a href="https://github.com/brucewayne"');
    });

    it('should preserve iconify span elements', async () => {
      const markdownWithIcons = `Contact: <span class="iconify" data-icon="tabler:mail"></span> [email@example.com](mailto:email@example.com)

Skills: <span class="iconify" data-icon="vscode-icons:file-type-js-official"></span> JavaScript`;

      const html = await processMarkdownToHtml(markdownWithIcons);
      
      expect(html).toContain('<span class="iconify" data-icon="tabler:mail"></span>');
      expect(html).toContain('<span class="iconify" data-icon="vscode-icons:file-type-js-official"></span>');
    });
  });

  describe('Math Expression Support', () => {
    it('should process LaTeX math expressions', async () => {
      const result = await parseMarkdownResume(markdownWithMath);
      
      expect(result.htmlContent).toContain('$E = mc^2$') || 
      expect(result.htmlContent).toContain('<math') ||
      expect(result.htmlContent).toContain('katex');
      
      // Should process display math
      expect(result.htmlContent).toContain('\\int_{-\\infty}^{\\infty}') ||
      expect(result.htmlContent).toContain('katex-display');
      
      // Should process inline math
      expect(result.htmlContent).toContain('O(n \\log n)') ||
      expect(result.htmlContent).toContain('katex');
    });

    it('should handle invalid math expressions gracefully', async () => {
      const invalidMath = `---
name: "Test"
email: "test@example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

# Test

Invalid math: $\\invalid{syntax here$

Valid math: $x = y + z$`;

      const result = await parseMarkdownResume(invalidMath);
      
      // Should not throw, might render as-is or with error indication
      expect(result.htmlContent).toBeDefined();
    });
  });

  describe('MarkdownProcessor Class', () => {
    it('should create processor with custom options', () => {
      const processor = new MarkdownProcessor({
        gfm: true,
        math: true,
        headingIds: true,
        iconifySupport: true,
      });
      
      expect(processor).toBeDefined();
    });

    it('should process markdown with configured options', async () => {
      const processor = new MarkdownProcessor({
        gfm: true,
        math: true,
        headingIds: true,
      });
      
      const markdown = `# Test Heading

- [x] Task with GFM
- Math: $E = mc^2$`;

      const html = await processor.process(markdown);
      
      expect(html).toContain('<h1 id="test-heading">') || expect(html).toContain('<h1>');
      expect(html).toContain('<input') || expect(html).toContain('checked');
      expect(html).toContain('$E = mc^2$') || expect(html).toContain('katex');
    });

    it('should validate processed content structure', async () => {
      const processor = new MarkdownProcessor();
      const html = await processor.process(sampleMarkdownResume.split('---')[2]); // Content after frontmatter
      
      const structure = processor.validateStructure(html);
      
      expect(structure.hasNameHeader).toBe(true);
      expect(structure.hasContactSection).toBe(true);
      expect(structure.hasExperienceSection).toBe(true);
      expect(structure.hasEducationSection).toBe(true);
      expect(structure.hasSkillsSection).toBe(true);
      expect(structure.optionalSections).toContain('Awards and Honors');
      expect(structure.optionalSections).toContain('Publications');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    it('should handle empty markdown input', async () => {
      const emptyMarkdown = `---
name: "Empty"
email: "empty@example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

`;

      const result = await parseMarkdownResume(emptyMarkdown);
      
      expect(result.content).toBe('');
      expect(result.htmlContent).toBe('');
      expect(result.frontmatter.name).toBe('Empty');
    });

    it('should handle malformed markdown gracefully', async () => {
      const malformedMarkdown = `---
name: "Test"
email: "test@example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

# Unclosed Header
**Unclosed bold
[Unclosed link(incomplete

## Valid Section

This should still work.`;

      const result = await parseMarkdownResume(malformedMarkdown);
      
      expect(result).toBeDefined();
      expect(result.htmlContent).toContain('Valid Section');
    });

    it('should handle very large markdown files', async () => {
      const largeContent = Array(1000).fill('- This is a large list item with lots of content').join('\n');
      const largeMarkdown = `---
name: "Large Resume"
email: "large@example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

# Large Resume

## Experience

${largeContent}`;

      const result = await parseMarkdownResume(largeMarkdown);
      
      expect(result).toBeDefined();
      expect(result.htmlContent.length).toBeGreaterThan(1000);
    });

    it('should sanitize potentially dangerous HTML', async () => {
      const dangerousMarkdown = `---
name: "Security Test"
email: "security@example.com"
lastUpdated: "2025-09-18T00:00:00.000Z"
---

# Security Test

<script>alert('xss')</script>

<img src="x" onerror="alert('xss')">

Normal content should be preserved.`;

      const result = await parseMarkdownResume(dangerousMarkdown);
      
      // Should remove or escape dangerous HTML
      expect(result.htmlContent).not.toContain('<script>');
      expect(result.htmlContent).not.toContain('onerror=');
      expect(result.htmlContent).toContain('Normal content should be preserved');
    });
  });
});