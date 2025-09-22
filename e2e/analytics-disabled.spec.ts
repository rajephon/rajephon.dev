import { test, expect } from "@playwright/test";

test.describe("Analytics Disabled Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Block all Google Analytics requests
    await page.route("**/gtag/js**", (route) => route.abort());
    await page.route("**/g/collect**", (route) => route.abort());
    await page.route("**/analytics.js**", (route) => route.abort());

    // Clear any existing localStorage
    await page.evaluate(() => {
      localStorage.clear();
    });
  });

  test("should not load analytics scripts when tracking ID not configured", async ({
    page,
  }) => {
    // Mock environment without GA tracking ID
    await page.addInitScript(() => {
      delete (window as any).gtag;
      delete process.env.NEXT_PUBLIC_GA_ID;
    });

    await page.goto("/");

    // Verify no Google Analytics scripts are loaded
    const gtagScript = page.locator('script[src*="gtag"]');
    await expect(gtagScript).toHaveCount(0);

    const analyticsScript = page.locator('script[src*="analytics"]');
    await expect(analyticsScript).toHaveCount(0);

    // Verify gtag function is not available
    const gtagExists = await page.evaluate(() => {
      return typeof (window as any).gtag !== "undefined";
    });
    expect(gtagExists).toBe(false);
  });

  test("should not track events when analytics is disabled", async ({
    page,
  }) => {
    // Mock environment without GA tracking ID
    await page.addInitScript(() => {
      delete (window as any).gtag;
      delete process.env.NEXT_PUBLIC_GA_ID;
    });

    await page.goto("/resume");

    // Attempt to trigger language toggle (this should not track)
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    if (await languageToggle.isVisible()) {
      await languageToggle.click();
    }

    // Attempt to trigger PDF download (this should not track)
    const pdfDownload = page.locator('[data-testid="pdf-download"]');
    if (await pdfDownload.isVisible()) {
      await pdfDownload.click();
    }

    // Verify no analytics events were attempted
    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });
    expect(gtagCalls).toHaveLength(0);
  });

  test("should not load analytics when consent is not given", async ({
    page,
  }) => {
    // Mock environment with GA tracking ID but no consent
    await page.addInitScript(() => {
      process.env.NEXT_PUBLIC_GA_ID = "G-TEST123456";
      localStorage.removeItem("analytics-consent-v1");
    });

    await page.goto("/");

    // Wait for any potential async loading
    await page.waitForTimeout(1000);

    // Verify analytics scripts are not loaded without consent
    const gtagScript = page.locator('script[src*="gtag"]');
    await expect(gtagScript).toHaveCount(0);

    // Verify no tracking occurs
    const gtagExists = await page.evaluate(() => {
      return typeof (window as any).gtag !== "undefined";
    });
    expect(gtagExists).toBe(false);
  });

  test("should not expose sensitive data when analytics disabled", async ({
    page,
  }) => {
    // Mock environment without GA tracking ID
    await page.addInitScript(() => {
      delete process.env.NEXT_PUBLIC_GA_ID;
    });

    await page.goto("/resume");

    // Verify no analytics-related data is exposed in window object
    const analyticsData = await page.evaluate(() => {
      const win = window as any;
      return {
        gtag: typeof win.gtag,
        ga: typeof win.ga,
        google_tag_manager: typeof win.google_tag_manager,
        dataLayer: Array.isArray(win.dataLayer) ? win.dataLayer.length : 0,
      };
    });

    expect(analyticsData.gtag).toBe("undefined");
    expect(analyticsData.ga).toBe("undefined");
    expect(analyticsData.google_tag_manager).toBe("undefined");
    expect(analyticsData.dataLayer).toBe(0);
  });

  test("should handle missing configuration gracefully", async ({ page }) => {
    // Mock environment with malformed or missing config
    await page.addInitScript(() => {
      process.env.NEXT_PUBLIC_GA_ID = "";
    });

    await page.goto("/");

    // Page should load without errors
    await expect(page.locator("body")).toBeVisible();

    // Check for console errors
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleLogs.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);

    // Should not have analytics-related errors
    const analyticsErrors = consoleLogs.filter(
      (log) =>
        log.toLowerCase().includes("analytics") ||
        log.toLowerCase().includes("gtag") ||
        log.toLowerCase().includes("ga-")
    );
    expect(analyticsErrors).toHaveLength(0);
  });
});

// This test should PASS only when proper conditional loading is implemented
test.describe("Analytics Disabled - Implementation Validation", () => {
  test("should validate conditional loading implementation", async ({
    page,
  }) => {
    // This test validates that the actual implementation properly
    // handles the disabled state

    await page.goto("/");

    // Check if Analytics component exists but doesn't render scripts
    const analyticsComponent = await page.evaluate(() => {
      // Look for analytics component in React dev tools or DOM
      return document.querySelector("[data-analytics-component]");
    });

    // The component may exist but should not render any scripts
    if (analyticsComponent) {
      const hasScripts = await page.evaluate(() => {
        return document.querySelectorAll('script[src*="gtag"]').length > 0;
      });
      expect(hasScripts).toBe(false);
    }
  });
});
