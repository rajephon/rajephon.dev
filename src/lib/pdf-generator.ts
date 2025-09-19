/**
 * PDF Generation Utilities
 *
 * Handles PDF generation from HTML resume content using Puppeteer
 * Used in GitHub Actions for automated PDF creation
 */

export interface PDFConfig {
  /** Output file path */
  outputPath: string;

  /** Page format */
  pageFormat: "A4" | "Letter";

  /** Page margins */
  margins: PDFMargins;

  /** Include background graphics */
  printBackground: boolean;

  /** Wait for specific selector before generating */
  waitForSelector?: string;

  /** Additional Puppeteer options */
  puppeteerOptions?: {
    timeout?: number;
    waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
  };
}

export interface PDFMargins {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

/**
 * Default PDF configuration
 */
export const defaultPDFConfig: PDFConfig = {
  outputPath: "./public/resume.pdf",
  pageFormat: "A4",
  margins: {
    top: "0.75in",
    right: "0.75in",
    bottom: "0.75in",
    left: "0.75in",
  },
  printBackground: true,
  waitForSelector: ".resume-container",
  puppeteerOptions: {
    timeout: 30000,
    waitUntil: "networkidle0",
  },
};

/**
 * Generate PDF from HTML content
 * This function is designed to run in Node.js environment (GitHub Actions)
 */
export async function generatePDFFromHtml(
  htmlContent: string,
  config: Partial<PDFConfig> = {}
): Promise<Buffer> {
  // This is a placeholder implementation
  // In the actual GitHub Actions script, this would use Puppeteer
  const finalConfig = { ...defaultPDFConfig, ...config };

  // Return mock buffer for now
  // Real implementation would be in scripts/generate-pdf.js
  return Buffer.from("PDF content placeholder");
}

/**
 * Generate PDF from URL
 * Used when the resume page is already deployed
 */
export async function generatePDFFromUrl(
  url: string,
  config: Partial<PDFConfig> = {}
): Promise<Buffer> {
  const finalConfig = { ...defaultPDFConfig, ...config };

  // This would use Puppeteer to navigate to the URL and generate PDF
  // Implementation will be in the GitHub Actions script
  return Buffer.from("PDF content from URL");
}

/**
 * Validate PDF configuration
 */
export function validatePDFConfig(config: PDFConfig): boolean {
  const requiredFields = ["outputPath", "pageFormat", "margins"];

  for (const field of requiredFields) {
    if (!config[field as keyof PDFConfig]) {
      return false;
    }
  }

  // Validate margins format
  const marginRegex = /^[\d.]+(?:in|cm|mm|px)$/;
  const margins = config.margins;

  return [margins.top, margins.right, margins.bottom, margins.left].every(
    (margin) => marginRegex.test(margin)
  );
}

/**
 * Get PDF filename from resume frontmatter
 */
export function getPDFFilename(name?: string): string {
  if (!name) {
    return "resume.pdf";
  }

  // Convert name to filename-safe format
  const safeName = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();

  return `${safeName}-resume.pdf`;
}

/**
 * Browser download utilities for client-side PDF download
 */
export class PDFDownloader {
  /**
   * Download PDF file from URL
   */
  static async downloadPDF(
    pdfUrl: string,
    fileName: string = "resume.pdf"
  ): Promise<void> {
    try {
      const response = await fetch(pdfUrl);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch PDF: ${response.status} ${response.statusText}`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create temporary download link
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);

      // Trigger download
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      throw error;
    }
  }

  /**
   * Check if PDF exists at given URL
   */
  static async checkPDFExists(pdfUrl: string): Promise<boolean> {
    try {
      const response = await fetch(pdfUrl, { method: "HEAD" });
      return response.ok;
    } catch (error) {
      console.error("Error checking PDF existence:", error);
      return false;
    }
  }

  /**
   * Get PDF file size
   */
  static async getPDFSize(pdfUrl: string): Promise<number | null> {
    try {
      const response = await fetch(pdfUrl, { method: "HEAD" });

      if (!response.ok) {
        return null;
      }

      const contentLength = response.headers.get("content-length");
      return contentLength ? parseInt(contentLength, 10) : null;
    } catch (error) {
      console.error("Error getting PDF size:", error);
      return null;
    }
  }
}

/**
 * PDF generation error types
 */
export class PDFGenerationError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "PDFGenerationError";
  }
}

export class PDFNotFoundError extends Error {
  constructor(pdfUrl: string) {
    super(`PDF not found at ${pdfUrl}`);
    this.name = "PDFNotFoundError";
  }
}

export class PDFDownloadError extends Error {
  constructor(
    message: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = "PDFDownloadError";
  }
}
