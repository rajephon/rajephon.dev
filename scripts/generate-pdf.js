#!/usr/bin/env node

/**
 * PDF Generation Script
 *
 * Generates PDFs from the resume page using Puppeteer
 * Supports both English and Korean versions
 * Runs in GitHub Actions and locally
 */

const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs").promises;
const os = require("os");

const configs = {
  en: {
    url: process.env.RESUME_URL || "http://localhost:3000/resume",
    outputPath: path.join(__dirname, "../public/resume.pdf"),
    language: "en",
    filename: "resume.pdf",
  },
  ko: {
    url: process.env.RESUME_URL || "http://localhost:3000/resume",
    outputPath: path.join(__dirname, "../public/resume-ko.pdf"),
    language: "ko",
    filename: "resume-ko.pdf",
  },
};

const commonConfig = {
  format: "A4",
  margins: {
    top: "0.75in",
    right: "0.75in",
    bottom: "0.75in",
    left: "0.75in",
  },
  timeout: 30000,
  waitForSelector: ".resume-container",
};

async function generatePDF(language = null) {
  let browser = null;

  try {
    const languages = language ? [language] : ["en", "ko"];
    console.log(
      `Starting PDF generation for languages: ${languages.join(", ")}...`
    );

    // Try to find Chrome executable path
    let executablePath;
    if (process.platform === "darwin") {
      // Check for arm64 (M1/M2) Mac
      const homeDir = os.homedir();
      const possiblePaths = [
        path.join(
          homeDir,
          ".cache/puppeteer/chrome/mac_arm-140.0.7339.82/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
        ),
        path.join(
          homeDir,
          ".cache/puppeteer/chrome/mac-140.0.7339.82/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing"
        ),
      ];

      for (const chromePath of possiblePaths) {
        if (require("fs").existsSync(chromePath)) {
          executablePath = chromePath;
          console.log(`Using Chrome at: ${chromePath}`);
          break;
        }
      }
    }

    // Launch browser
    browser = await puppeteer.launch({
      headless: "new",
      executablePath,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--font-render-hinting=none", // Better Korean font rendering
        "--disable-font-subpixel-positioning",
      ],
    });

    const results = [];

    // Generate PDF for each language
    for (const lang of languages) {
      const config = configs[lang];
      if (!config) {
        console.warn(`⚠️ No configuration found for language: ${lang}`);
        continue;
      }

      console.log(`\n📄 Generating ${lang.toUpperCase()} PDF...`);

      const page = await browser.newPage();

      // Set viewport for consistent rendering
      await page.setViewport({
        width: 1200,
        height: 1600,
        deviceScaleFactor: 2,
      });

      // Navigate to resume page
      console.log(`Loading ${config.url}...`);
      await page.goto(config.url, {
        waitUntil: "networkidle0",
        timeout: commonConfig.timeout,
      });

      // Wait for resume container to load
      if (commonConfig.waitForSelector) {
        console.log(`Waiting for ${commonConfig.waitForSelector}...`);
        await page.waitForSelector(commonConfig.waitForSelector, {
          timeout: commonConfig.timeout,
        });
      }

      // Switch to the target language
      if (lang === "ko") {
        console.log("Switching to Korean language...");
        const languageToggle = await page.$('[data-testid="language-toggle"]');
        if (languageToggle) {
          await languageToggle.click();
          // Wait a bit for the language switch to complete
          await page.waitForTimeout(1000);
        } else {
          console.warn("⚠️ Language toggle not found, using default language");
        }
      }

      // Add print styles and Korean font support
      await page.addStyleTag({
        content: `
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap');
          
          @media print {
            .print-hide { display: none !important; }
            body { 
              background: white !important; 
              font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            }
            * { 
              color: black !important; 
            }
            .lang-ko {
              font-family: 'Noto Sans KR', 'Pretendard', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
            }
          }
          
          /* Ensure Korean fonts are loaded */
          .font-korean, .lang-ko {
            font-family: 'Noto Sans KR', 'Pretendard', 'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif !important;
          }
        `,
      });

      // Wait for fonts to load
      await page.waitForTimeout(2000);

      // Generate PDF
      console.log(`Generating ${config.filename}...`);
      const pdfBuffer = await page.pdf({
        path: config.outputPath,
        format: commonConfig.format,
        printBackground: true,
        margins: commonConfig.margins,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
      });

      // Verify file was created
      const stats = await fs.stat(config.outputPath);
      console.log(`✅ ${config.filename} generated successfully!`);
      console.log(`   File: ${config.outputPath}`);
      console.log(`   Size: ${(stats.size / 1024).toFixed(2)} KB`);

      results.push({
        language: lang,
        filename: config.filename,
        path: config.outputPath,
        size: stats.size,
        buffer: pdfBuffer,
      });

      await page.close();
    }

    return results;
  } catch (error) {
    console.error("❌ PDF generation failed:", error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// CLI usage
if (require.main === module) {
  const targetLanguage = process.argv[2]; // Optional language argument

  generatePDF(targetLanguage)
    .then((results) => {
      console.log("\n🎉 PDF generation completed successfully!");
      console.log("\nGenerated files:");
      results.forEach((result) => {
        console.log(
          `  📄 ${result.filename} (${result.language.toUpperCase()}) - ${(result.size / 1024).toFixed(2)} KB`
        );
      });
      process.exit(0);
    })
    .catch((error) => {
      console.error("PDF generation failed:", error);
      process.exit(1);
    });
}

module.exports = { generatePDF, configs, commonConfig };
