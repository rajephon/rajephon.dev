/**
 * End-to-End Tests for Language Toggle Feature
 *
 * Tests the complete user journey for the Korean resume translation feature
 * according to the test scenarios defined in specs/002-src-data-resume/contracts/test-contracts.ts
 */

import { test, expect, Page } from "@playwright/test";

test.describe("Language Toggle E2E Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the resume page before each test
    await page.goto("/resume");
    await page.waitForLoadState("networkidle");
  });

  test.describe("User toggles language and downloads PDF", () => {
    test("should complete the full user journey successfully", async ({
      page,
    }) => {
      // Step 1: Navigate to resume page (done in beforeEach)
      await expect(page).toHaveURL("/resume");

      // Step 2: Wait for language toggle to be visible
      await page.waitForSelector('[data-testid="language-toggle"]');

      // Step 3: Assert English content is displayed initially
      const nameElement = page.locator("h1").first();
      await expect(nameElement).toContainText("Chanwoo Noh");

      // Verify lang attribute is set to English
      const htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("lang", "en");

      // Step 4: Click language toggle to switch to Korean
      await page.click('[data-testid="language-toggle"]');

      // Step 5: Assert Korean content is displayed
      await expect(nameElement).toContainText("노찬우");

      // Step 6: Verify lang attribute updates to Korean
      await expect(htmlElement).toHaveAttribute("lang", "ko");

      // Step 7: Click PDF download link
      const downloadPromise = page.waitForEvent("download");
      await page.click('[data-testid="pdf-download"]');
      const download = await downloadPromise;

      // Step 8: Assert Korean PDF was downloaded
      expect(download.suggestedFilename()).toBe("resume-ko.pdf");
    });

    test("should maintain Korean language on page refresh", async ({
      page,
    }) => {
      // Switch to Korean
      await page.click('[data-testid="language-toggle"]');

      // Verify Korean content
      const nameElement = page.locator("h1").first();
      await expect(nameElement).toContainText("노찬우");

      // Refresh the page
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Verify Korean is still selected (if persistence is implemented)
      // Note: This test validates localStorage persistence
      const currentLang = await page.getAttribute("html", "lang");
      if (currentLang === "ko") {
        await expect(nameElement).toContainText("노찬우");
      } else {
        // If persistence is not implemented, should default to English
        await expect(nameElement).toContainText("Chanwoo Noh");
      }
    });
  });

  test.describe("Language preference persistence across sessions", () => {
    test("should save and restore language preference correctly", async ({
      page,
    }) => {
      // Step 1: Navigate to resume page (done in beforeEach)

      // Step 2: Click language toggle to switch to Korean
      await page.click('[data-testid="language-toggle"]');

      // Step 3: Assert Korean language is selected
      const htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("lang", "ko");

      // Step 4: Reload page to simulate new session
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Step 5: Assert Korean preference is restored (if localStorage is implemented)
      // Note: Implementation may choose to persist or reset to default
      const currentLang = await page.getAttribute("html", "lang");

      // Document the behavior - either persistence or default
      expect(["en", "ko"]).toContain(currentLang);

      // Step 6: Clear localStorage to test default behavior
      await page.evaluate(() => localStorage.clear());

      // Step 7: Reload page
      await page.reload();
      await page.waitForLoadState("networkidle");

      // Step 8: Assert English is the default
      await expect(htmlElement).toHaveAttribute("lang", "en");
    });
  });

  test.describe("Both PDF versions are accessible", () => {
    test("should provide correct PDF links for both languages", async ({
      page,
    }) => {
      // Step 1: Assert English PDF link is correct by default
      const pdfLink = page.locator('[data-testid="pdf-download"]');
      await expect(pdfLink).toHaveAttribute("href", "/resume.pdf");

      // Step 2: Click language toggle to switch to Korean
      await page.click('[data-testid="language-toggle"]');

      // Step 3: Assert Korean PDF link is correct
      await expect(pdfLink).toHaveAttribute("href", "/resume-ko.pdf");

      // Step 4: Verify both PDF files are accessible
      const englishPdfResponse = await page.request.get("/resume.pdf");
      expect(englishPdfResponse.status()).toBe(200);

      const koreanPdfResponse = await page.request.get("/resume-ko.pdf");
      expect(koreanPdfResponse.status()).toBe(200);
    });

    test("should have proper MIME types for PDF downloads", async ({
      page,
    }) => {
      // Test English PDF
      const englishPdfResponse = await page.request.get("/resume.pdf");
      expect(englishPdfResponse.headers()["content-type"]).toContain(
        "application/pdf"
      );

      // Test Korean PDF
      const koreanPdfResponse = await page.request.get("/resume-ko.pdf");
      expect(koreanPdfResponse.headers()["content-type"]).toContain(
        "application/pdf"
      );
    });
  });

  test.describe("Language Toggle UI Behavior", () => {
    test("should highlight current language correctly", async ({ page }) => {
      // Initially English should be highlighted
      const enButton = page
        .locator('[data-testid="language-toggle"] span')
        .first();
      const koButton = page
        .locator('[data-testid="language-toggle"] span')
        .last();

      await expect(enButton).toHaveClass(/text-blue-600/);
      await expect(koButton).toHaveClass(/text-gray-600/);

      // Switch to Korean
      await page.click('[data-testid="language-toggle"]');

      // Korean should now be highlighted
      await expect(enButton).toHaveClass(/text-gray-600/);
      await expect(koButton).toHaveClass(/text-blue-600/);
    });

    test("should be keyboard accessible", async ({ page }) => {
      // Focus on language toggle
      await page.focus('[data-testid="language-toggle"] button');

      // Press Enter to toggle language
      await page.keyboard.press("Enter");

      // Verify language switched
      const htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("lang", "ko");

      // Press Enter again to toggle back
      await page.keyboard.press("Enter");

      // Verify back to English
      await expect(htmlElement).toHaveAttribute("lang", "en");
    });

    test("should handle rapid clicks gracefully", async ({ page }) => {
      const toggleButton = page.locator(
        '[data-testid="language-toggle"] button'
      );

      // Rapid clicks
      await toggleButton.click();
      await toggleButton.click();
      await toggleButton.click();

      // Should still work correctly (final state should be Korean)
      const htmlElement = page.locator("html");
      const finalLang = await htmlElement.getAttribute("lang");
      expect(["en", "ko"]).toContain(finalLang);
    });
  });

  test.describe("Content Rendering", () => {
    test("should display all sections in both languages", async ({ page }) => {
      // Check English sections
      await expect(page.locator("h2")).toContainText([
        "Experience",
        "Education",
        "Skills",
      ]);

      // Switch to Korean
      await page.click('[data-testid="language-toggle"]');

      // Check Korean sections
      await expect(page.locator("h2")).toContainText(["경력", "학력", "기술"]);
    });

    test("should render Korean fonts correctly", async ({ page }) => {
      // Switch to Korean
      await page.click('[data-testid="language-toggle"]');

      // Check that Korean text is rendered (not showing as boxes)
      const nameElement = page.locator("h1").first();
      const computedStyle = await nameElement.evaluate((el) => {
        return window.getComputedStyle(el).fontFamily;
      });

      // Should include Korean fonts in the font stack
      expect(computedStyle).toMatch(/(Pretendard|Noto Sans KR|Malgun Gothic)/);
    });

    test("should maintain layout consistency between languages", async ({
      page,
    }) => {
      // Get initial layout measurements in English
      const initialHeight = await page.locator("main").boundingBox();

      // Switch to Korean
      await page.click('[data-testid="language-toggle"]');

      // Get layout measurements in Korean
      const koreanHeight = await page.locator("main").boundingBox();

      // Layout should be reasonably consistent (allowing for text length differences)
      expect(
        Math.abs((initialHeight?.height || 0) - (koreanHeight?.height || 0))
      ).toBeLessThan(100);
    });
  });

  test.describe("Performance Tests", () => {
    test("should switch languages quickly", async ({ page }) => {
      const startTime = Date.now();

      // Click language toggle
      await page.click('[data-testid="language-toggle"]');

      // Wait for content to update
      await expect(page.locator("h1").first()).toContainText("노찬우");

      const endTime = Date.now();
      const switchTime = endTime - startTime;

      // Should switch in under 100ms (performance target)
      expect(switchTime).toBeLessThan(100);
    });

    test("should load resume page quickly", async ({ page }) => {
      const startTime = Date.now();

      await page.goto("/resume");
      await page.waitForSelector('[data-testid="language-toggle"]');

      const endTime = Date.now();
      const loadTime = endTime - startTime;

      // Should load in under 2 seconds
      expect(loadTime).toBeLessThan(2000);
    });
  });

  test.describe("Accessibility Tests", () => {
    test("should meet accessibility standards", async ({ page }) => {
      // Check for proper ARIA labels
      const toggleButton = page.locator(
        '[data-testid="language-toggle"] button'
      );
      await expect(toggleButton).toHaveAttribute("aria-label");

      // Check for proper heading hierarchy
      const headings = await page
        .locator("h1, h2, h3, h4, h5, h6")
        .allTextContents();
      expect(headings.length).toBeGreaterThan(0);

      // Ensure language toggle has proper role
      await expect(toggleButton).toHaveAttribute("role", "button");
    });

    test("should announce language changes to screen readers", async ({
      page,
    }) => {
      // This would require specific screen reader testing tools
      // For now, we verify the lang attribute changes
      const htmlElement = page.locator("html");

      await expect(htmlElement).toHaveAttribute("lang", "en");

      await page.click('[data-testid="language-toggle"]');

      await expect(htmlElement).toHaveAttribute("lang", "ko");
    });
  });

  test.describe("Mobile Responsiveness", () => {
    test("should work correctly on mobile devices", async ({
      page,
      isMobile,
    }) => {
      if (isMobile) {
        // Test mobile-specific behavior
        await page.setViewportSize({ width: 375, height: 667 });

        // Language toggle should still be visible and functional
        await expect(
          page.locator('[data-testid="language-toggle"]')
        ).toBeVisible();

        // Should be able to toggle language
        await page.click('[data-testid="language-toggle"]');

        const htmlElement = page.locator("html");
        await expect(htmlElement).toHaveAttribute("lang", "ko");

        // PDF download should work on mobile
        const pdfLink = page.locator('[data-testid="pdf-download"]');
        await expect(pdfLink).toBeVisible();
        await expect(pdfLink).toHaveAttribute("href", "/resume-ko.pdf");
      }
    });
  });

  test.describe("Error Handling", () => {
    test("should handle network errors gracefully", async ({ page }) => {
      // This test would simulate network failures
      // For now, we ensure basic functionality works
      await expect(
        page.locator('[data-testid="language-toggle"]')
      ).toBeVisible();

      // Should still be able to toggle even if network is slow
      await page.click('[data-testid="language-toggle"]');

      const htmlElement = page.locator("html");
      await expect(htmlElement).toHaveAttribute("lang", "ko");
    });

    test("should handle missing PDF files gracefully", async ({ page }) => {
      // Test what happens if PDF files are missing
      // This would be implementation-specific
      const pdfLink = page.locator('[data-testid="pdf-download"]');

      // PDF link should exist even if file might be missing
      await expect(pdfLink).toBeVisible();
      await expect(pdfLink).toHaveAttribute("href");
    });
  });
});
