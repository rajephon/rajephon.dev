/**
 * Markdown Processing Utilities
 *
 * Handles parsing of markdown resume files with frontmatter,
 * converts to HTML with proper styling and iconify support
 */

import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  ResumeData,
  ResumeFrontmatter,
  validateResumeData,
  MarkdownResumeStructure,
  validateMarkdownResumeStructure,
} from "./resume-schema";

export interface MarkdownProcessorOptions {
  gfm?: boolean;
  math?: boolean;
  headingIds?: boolean;
  iconifySupport?: boolean;
}

/**
 * Parse markdown resume file with frontmatter
 */
export async function parseMarkdownResume(
  markdownContent: string
): Promise<ResumeData> {
  const { frontmatter, content } = extractFrontmatter(markdownContent);
  const htmlContent = await processMarkdownToHtml(content);

  const resumeData: ResumeData = {
    frontmatter,
    content,
    htmlContent,
  };

  // Validate the parsed data
  return validateResumeData(resumeData);
}

/**
 * Parse multiple language versions of resume
 */
export async function parseMultiLanguageResume(
  contents: Record<string, string>
): Promise<Record<string, ResumeData>> {
  const results: Record<string, ResumeData> = {};

  for (const [language, markdownContent] of Object.entries(contents)) {
    try {
      results[language] = await parseMarkdownResume(markdownContent);
    } catch (error) {
      throw new Error(
        `Failed to parse resume for language '${language}': ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  return results;
}

/**
 * Extract frontmatter and content from markdown
 */
export function extractFrontmatter(markdownContent: string): {
  frontmatter: ResumeFrontmatter;
  content: string;
} {
  if (!markdownContent.trim().startsWith("---")) {
    throw new Error("Resume must start with frontmatter");
  }

  const parsed = matter(markdownContent);

  if (!parsed.data || Object.keys(parsed.data).length === 0) {
    if (!markdownContent.includes("---")) {
      throw new Error("Invalid frontmatter format");
    }
  }

  return {
    frontmatter: parsed.data as ResumeFrontmatter,
    content: parsed.content,
  };
}

/**
 * Convert markdown content to HTML using remark
 */
export async function processMarkdownToHtml(markdown: string): Promise<string> {
  const processor = remark()
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkMath) // LaTeX math support
    .use(remarkHtml, {
      sanitize: {
        // Allow iconify spans and other safe HTML
        tagNames: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "br",
          "strong",
          "em",
          "u",
          "del",
          "s",
          "ul",
          "ol",
          "li",
          "dl",
          "dt",
          "dd",
          "a",
          "img",
          "span",
          "div",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "blockquote",
          "pre",
          "code",
          "hr",
          "input", // For GFM task lists
        ],
        attributes: {
          "*": ["className", "class", "id"],
          span: ["className", "class", "dataIcon", "data-icon"],
          a: ["href", "title", "target", "rel"],
          img: ["src", "alt", "title", "width", "height"],
          input: ["type", "checked", "disabled"],
          th: ["align"],
          td: ["align"],
        },
      },
    });

  const result = await processor.process(markdown);
  let html = String(result);

  // Post-process to ensure iconify spans are preserved
  html = html.replace(/data-icon="([^"]+)"/g, 'data-icon="$1"');

  // Add special class to Side Projects section for PDF exclusion
  // Match both English and Korean versions
  html = html.replace(
    /(<h3[^>]*>(?:Side Projects|사이드 프로젝트)<\/h3>)/gi,
    '<div class="pdf-hide-section">$1'
  );

  // Find the next h2 or h3 after Side Projects to close the div
  // This regex finds content between Side Projects heading and next major heading
  html = html.replace(
    /(<div class="pdf-hide-section"><h3[^>]*>(?:Side Projects|사이드 프로젝트)<\/h3>[\s\S]*?)(<h[23][^>]*>)/gi,
    "$1</div>$2"
  );

  // If Side Projects is the last section, close div at the end
  if (
    html.includes('class="pdf-hide-section"') &&
    !html.match(/<\/div>[\s]*$/)
  ) {
    const lastSectionMatch = html.match(
      /(<div class="pdf-hide-section">[\s\S]+)$/
    );
    if (lastSectionMatch && !lastSectionMatch[0].includes("</div>")) {
      html = html.replace(
        /(<div class="pdf-hide-section">[\s\S]+)$/,
        "$1</div>"
      );
    }
  }

  return html;
}

/**
 * Markdown Processor Class
 */
export class MarkdownProcessor {
  private options: MarkdownProcessorOptions;
  private processor: any;

  constructor(options: MarkdownProcessorOptions = {}) {
    this.options = {
      gfm: true,
      math: true,
      headingIds: false,
      iconifySupport: true,
      ...options,
    };

    this.initializeProcessor();
  }

  private initializeProcessor() {
    this.processor = remark();

    if (this.options.gfm) {
      this.processor.use(remarkGfm);
    }

    if (this.options.math) {
      this.processor.use(remarkMath);
    }

    this.processor.use(remarkHtml, {
      sanitize: {
        tagNames: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "br",
          "strong",
          "em",
          "u",
          "del",
          "s",
          "ul",
          "ol",
          "li",
          "dl",
          "dt",
          "dd",
          "a",
          "img",
          "span",
          "div",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "blockquote",
          "pre",
          "code",
          "hr",
          "input",
        ],
        attributes: {
          "*": ["className", "class", "id"],
          span: ["className", "class", "dataIcon", "data-icon"],
          a: ["href", "title", "target", "rel"],
          img: ["src", "alt", "title", "width", "height"],
          input: ["type", "checked", "disabled"],
          th: ["align"],
          td: ["align"],
        },
      },
    });
  }

  async process(markdown: string): Promise<string> {
    const result = await this.processor.process(markdown);
    let html = String(result);

    // Preserve iconify data attributes
    if (this.options.iconifySupport) {
      html = html.replace(/data-icon="([^"]+)"/g, 'data-icon="$1"');
    }

    return html;
  }

  validateStructure(htmlContent: string): MarkdownResumeStructure {
    return validateMarkdownResumeStructure(htmlContent);
  }
}
