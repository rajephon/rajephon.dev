/**
 * Resume Schema and Validation
 *
 * Defines the structure and validation rules for resume content
 * Used for build-time validation and TypeScript type checking
 */

import { z } from "zod";

export interface ResumeFrontmatter {
  /** Full name of the person */
  name: string;

  /** Professional title or position */
  title: string;

  /** Email address (required for contact) */
  email: string;

  /** Phone number (optional) */
  phone?: string;

  /** Personal website URL (optional) */
  website?: string;

  /** Location/Address (optional) */
  location?: string;

  /** LinkedIn profile URL (optional) */
  linkedin?: string;

  /** GitHub profile URL (optional) */
  github?: string;

  /** Professional summary (optional) */
  summary?: string;

  /** Last updated date in ISO format */
  lastUpdated: string;

  /** Additional custom fields */
  [key: string]: unknown;
}

export interface ResumeData {
  /** Parsed frontmatter metadata */
  frontmatter: ResumeFrontmatter;

  /** Raw markdown content (without frontmatter) */
  content: string;

  /** Processed HTML content */
  htmlContent?: string;
}

/**
 * Zod Schema for Runtime Validation
 */
export const ResumeFrontmatterSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional(),
    website: z.string().url().optional().or(z.literal("")),
    location: z.string().optional(),
    linkedin: z.string().url().optional().or(z.literal("")),
    github: z.string().url().optional().or(z.literal("")),
    summary: z.string().optional(),
    lastUpdated: z.string().datetime("Last updated must be valid ISO date"),
  })
  .passthrough(); // Allow additional fields

export const ResumeDataSchema = z.object({
  frontmatter: ResumeFrontmatterSchema,
  content: z.string().min(0, "Resume content cannot be empty"), // Allow empty content
  htmlContent: z.string().optional(),
});

/**
 * Type Guards
 */
export function isValidResumeFrontmatter(
  data: unknown
): data is ResumeFrontmatter {
  return ResumeFrontmatterSchema.safeParse(data).success;
}

export function isValidResumeData(data: unknown): data is ResumeData {
  return ResumeDataSchema.safeParse(data).success;
}

/**
 * Validation Helper
 */
export function validateResumeData(data: unknown): ResumeData {
  const result = ResumeDataSchema.parse(data);
  return result;
}

/**
 * Markdown-Resume Specific Validation
 */
export interface MarkdownResumeStructure {
  /** Header with name and contact info using iconify and definition lists */
  hasNameHeader: boolean;
  /** Contact information with iconify icons */
  hasContactSection: boolean;
  /** Experience section with job/company/date structure */
  hasExperienceSection: boolean;
  /** Education section with degree/school/date structure */
  hasEducationSection: boolean;
  /** Skills section with categorized lists */
  hasSkillsSection: boolean;
  /** Optional sections (Awards, Publications, etc.) */
  optionalSections: string[];
}

export function validateMarkdownResumeStructure(
  htmlContent: string
): MarkdownResumeStructure {
  return {
    hasNameHeader: /<h1.*?>.*?<\/h1>/i.test(htmlContent),
    hasContactSection:
      /iconify.*?(charm:person|tabler:mail|tabler:phone|ic:outline-location-on|tabler:brand-github|tabler:brand-linkedin)/i.test(
        htmlContent
      ),
    hasExperienceSection: /## Experience/i.test(htmlContent),
    hasEducationSection: /## Education/i.test(htmlContent),
    hasSkillsSection: /## Skills/i.test(htmlContent),
    optionalSections: extractOptionalSections(htmlContent),
  };
}

function extractOptionalSections(htmlContent: string): string[] {
  const sections: string[] = [];
  const sectionMatches = htmlContent.match(/<h2.*?>(.*?)<\/h2>/gi) || [];

  sectionMatches.forEach((match) => {
    const sectionName = match.replace(/<\/?h2.*?>/gi, "").trim();
    const normalizedName = sectionName.toLowerCase();

    if (!["experience", "education", "skills"].includes(normalizedName)) {
      sections.push(sectionName);
    }
  });

  return sections;
}
