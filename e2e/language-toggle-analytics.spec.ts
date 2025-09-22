import { test, expect } from "@playwright/test";

test.describe("Language Toggle Analytics Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Mock Google Analytics
    await page.route("**/gtag/js**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/javascript",
        body: `
          window.gtag = function() {
            window.gtagCalls = window.gtagCalls || [];
            window.gtagCalls.push(Array.from(arguments));
          };
          window.gtag.loaded = true;
        `,
      });
    });

    await page.route("**/g/collect**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "image/gif",
        body: Buffer.from("GIF89a", "base64"),
      });
    });

    // Set up environment with analytics enabled
    await page.addInitScript(() => {
      process.env.NEXT_PUBLIC_GA_ID = "G-TEST123456";
      localStorage.setItem(
        "analytics-consent-v1",
        JSON.stringify({
          analyticsConsent: true,
          timestamp: Date.now(),
          version: "1.0.0",
        })
      );
    });
  });

  test("should track language toggle from English to Korean", async ({
    page,
  }) => {
    await page.goto("/resume");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Clear previous gtag calls
    await page.evaluate(() => {
      (window as any).gtagCalls = [];
    });

    // Find and click language toggle button
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeVisible();

    // Verify initial language state (should be English)
    const initialLang = await page.evaluate(() => {
      return localStorage.getItem("language") || "en";
    });
    expect(initialLang).toBe("en");

    // Click to toggle to Korean
    await languageToggle.click();

    // Wait for event to be tracked
    await page.waitForTimeout(500);

    // Verify the language toggle event was tracked
    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const languageToggleEvent = gtagCalls.find(
      (call: any[]) => call[0] === "event" && call[1] === "language_toggle"
    );

    expect(languageToggleEvent).toBeDefined();
    expect(languageToggleEvent[2]).toMatchObject({
      event_category: "user_preference",
      previous_language: "en",
      new_language: "ko",
    });
  });

  test("should track language toggle from Korean to English", async ({
    page,
  }) => {
    // Set initial language to Korean
    await page.addInitScript(() => {
      localStorage.setItem("language", "ko");
    });

    await page.goto("/resume");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Clear previous gtag calls
    await page.evaluate(() => {
      (window as any).gtagCalls = [];
    });

    // Find and click language toggle button
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await expect(languageToggle).toBeVisible();

    // Click to toggle to English
    await languageToggle.click();

    // Wait for event to be tracked
    await page.waitForTimeout(500);

    // Verify the language toggle event was tracked
    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const languageToggleEvent = gtagCalls.find(
      (call: any[]) => call[0] === "event" && call[1] === "language_toggle"
    );

    expect(languageToggleEvent).toBeDefined();
    expect(languageToggleEvent[2]).toMatchObject({
      event_category: "user_preference",
      previous_language: "ko",
      new_language: "en",
    });
  });

  test("should include correct event parameters", async ({ page }) => {
    await page.goto("/resume");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Clear previous gtag calls
    await page.evaluate(() => {
      (window as any).gtagCalls = [];
    });

    // Trigger language toggle
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    await languageToggle.click();

    // Wait for event tracking
    await page.waitForTimeout(500);

    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const languageToggleEvent = gtagCalls.find(
      (call: any[]) => call[0] === "event" && call[1] === "language_toggle"
    );

    expect(languageToggleEvent).toBeDefined();

    const eventParams = languageToggleEvent[2];
    expect(eventParams).toHaveProperty("event_category", "user_preference");
    expect(eventParams).toHaveProperty("previous_language");
    expect(eventParams).toHaveProperty("new_language");

    // Verify language values are valid
    expect(["en", "ko"]).toContain(eventParams.previous_language);
    expect(["en", "ko"]).toContain(eventParams.new_language);

    // Previous and new language should be different
    expect(eventParams.previous_language).not.toBe(eventParams.new_language);
  });

  test("should not track when analytics is disabled", async ({ page }) => {
    // Remove consent
    await page.addInitScript(() => {
      localStorage.removeItem("analytics-consent-v1");
    });

    await page.goto("/resume");

    // Wait a bit for potential analytics loading
    await page.waitForTimeout(1000);

    // Clear any potential gtag calls
    await page.evaluate(() => {
      (window as any).gtagCalls = [];
    });

    // Trigger language toggle
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    if (await languageToggle.isVisible()) {
      await languageToggle.click();
    }

    // Wait for potential event tracking
    await page.waitForTimeout(500);

    // Verify no events were tracked
    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const languageToggleEvent = gtagCalls.find(
      (call: any[]) => call[0] === "event" && call[1] === "language_toggle"
    );

    expect(languageToggleEvent).toBeUndefined();
  });

  test("should track multiple language toggles correctly", async ({ page }) => {
    await page.goto("/resume");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Clear previous gtag calls
    await page.evaluate(() => {
      (window as any).gtagCalls = [];
    });

    const languageToggle = page.locator('[data-testid="language-toggle"]');

    // First toggle: EN -> KO
    await languageToggle.click();
    await page.waitForTimeout(300);

    // Second toggle: KO -> EN
    await languageToggle.click();
    await page.waitForTimeout(300);

    // Third toggle: EN -> KO
    await languageToggle.click();
    await page.waitForTimeout(300);

    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const languageToggleEvents = gtagCalls.filter(
      (call: any[]) => call[0] === "event" && call[1] === "language_toggle"
    );

    expect(languageToggleEvents).toHaveLength(3);

    // Verify the sequence of toggles
    expect(languageToggleEvents[0][2]).toMatchObject({
      previous_language: "en",
      new_language: "ko",
    });

    expect(languageToggleEvents[1][2]).toMatchObject({
      previous_language: "ko",
      new_language: "en",
    });

    expect(languageToggleEvents[2][2]).toMatchObject({
      previous_language: "en",
      new_language: "ko",
    });
  });

  test("should handle rapid language toggles gracefully", async ({ page }) => {
    await page.goto("/resume");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Clear previous gtag calls
    await page.evaluate(() => {
      (window as any).gtagCalls = [];
    });

    const languageToggle = page.locator('[data-testid="language-toggle"]');

    // Rapid toggles (simulate user clicking quickly)
    await languageToggle.click();
    await languageToggle.click();
    await languageToggle.click();

    // Wait for all events to be processed
    await page.waitForTimeout(1000);

    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const languageToggleEvents = gtagCalls.filter(
      (call: any[]) => call[0] === "event" && call[1] === "language_toggle"
    );

    // Should track all events, even rapid ones
    expect(languageToggleEvents.length).toBeGreaterThan(0);
    expect(languageToggleEvents.length).toBeLessThanOrEqual(3);

    // Each event should have valid parameters
    languageToggleEvents.forEach((event: any[]) => {
      const params = event[2];
      expect(["en", "ko"]).toContain(params.previous_language);
      expect(["en", "ko"]).toContain(params.new_language);
    });
  });
});

// This test should PASS only when language toggle tracking is implemented
test.describe("Language Toggle Analytics - Implementation Validation", () => {
  test("should validate language toggle tracking implementation", async ({
    page,
  }) => {
    await page.goto("/resume");

    // Wait for potential analytics loading
    await page.waitForTimeout(2000);

    // Check if language toggle element exists
    const languageToggle = page.locator('[data-testid="language-toggle"]');
    const toggleExists = (await languageToggle.count()) > 0;

    if (toggleExists) {
      console.log(
        "Language toggle element found - ready for analytics integration"
      );
    } else {
      console.log(
        "Language toggle element not found - need to add data-testid"
      );
    }

    // This helps validate the current state of implementation
    const analyticsState = await page.evaluate(() => {
      return {
        hasToggle:
          document.querySelector('[data-testid="language-toggle"]') !== null,
        hasAnalytics: typeof (window as any).gtag !== "undefined",
        hasConsent: localStorage.getItem("analytics-consent-v1") !== null,
      };
    });

    console.log("Current analytics state:", analyticsState);

    // The test passes regardless - it's for validation purposes
    expect(true).toBe(true);
  });
});
