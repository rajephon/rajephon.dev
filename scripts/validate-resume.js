#!/usr/bin/env node

/**
 * Resume Validation Script
 *
 * Validates the resume markdown file against the schema
 */

const path = require("path");
const fs = require("fs").promises;

async function validateResume() {
  try {
    console.log("Validating resume...");

    const resumePath = path.join(__dirname, "../src/data/resume.md");
    const content = await fs.readFile(resumePath, "utf-8");

    // Basic validation
    if (!content.includes("---")) {
      throw new Error("Resume must have frontmatter");
    }

    if (!content.includes("name:")) {
      throw new Error("Resume must have name field");
    }

    if (!content.includes("email:")) {
      throw new Error("Resume must have email field");
    }

    if (!content.includes("## Experience")) {
      console.warn("⚠️  Warning: No Experience section found");
    }

    if (!content.includes("## Education")) {
      console.warn("⚠️  Warning: No Education section found");
    }

    if (!content.includes("## Skills")) {
      console.warn("⚠️  Warning: No Skills section found");
    }

    // Check for iconify icons
    const iconCount = (content.match(/iconify/g) || []).length;
    if (iconCount === 0) {
      console.warn("⚠️  Warning: No iconify icons found");
    } else {
      console.log(`✅ Found ${iconCount} iconify icons`);
    }

    console.log("✅ Resume validation completed successfully!");
  } catch (error) {
    console.error("❌ Resume validation failed:", error.message);
    process.exit(1);
  }
}

// CLI usage
if (require.main === module) {
  validateResume();
}

module.exports = { validateResume };
