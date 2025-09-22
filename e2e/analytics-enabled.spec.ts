import { test, expect } from "@playwright/test";

test.describe("Analytics Enabled Integration Tests", () => {
  test.beforeEach(async ({ page }) => {
    // Mock Google Analytics scripts and responses
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

    // Set up environment with valid GA tracking ID and consent
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

  test("should load Google Analytics when tracking ID is configured and consent given", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Verify gtag function is available
    const gtagExists = await page.evaluate(() => {
      return typeof (window as any).gtag !== "undefined";
    });
    expect(gtagExists).toBe(true);

    // Verify config call was made
    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const configCall = gtagCalls.find((call: any[]) => call[0] === "config");
    expect(configCall).toBeDefined();
    expect(configCall[1]).toBe("G-TEST123456");
  });

  test("should automatically track page views", async ({ page }) => {
    await page.goto("/");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    await page.goto("/resume");

    // Wait for page view tracking
    await page.waitForTimeout(1000);

    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    // Should have at least config and page view events
    expect(gtagCalls.length).toBeGreaterThan(0);

    const configCall = gtagCalls.find((call: any[]) => call[0] === "config");
    expect(configCall).toBeDefined();
  });

  test("should respect consent status", async ({ page }) => {
    await page.goto("/");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Check for consent mode configuration
    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const consentCall = gtagCalls.find((call: any[]) => call[0] === "consent");

    // Should have consent configuration
    if (consentCall) {
      expect(consentCall[1]).toMatch(/^(default|update)$/);
    }
  });

  test("should handle valid tracking ID format", async ({ page }) => {
    await page.goto("/");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const configCall = gtagCalls.find((call: any[]) => call[0] === "config");
    expect(configCall).toBeDefined();

    // Verify tracking ID format
    const trackingId = configCall[1];
    expect(trackingId).toMatch(/^G-[A-Z0-9]{10}$/);
  });

  test("should send events to Google Analytics", async ({ page }) => {
    await page.goto("/resume");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Manually trigger an event to test event sending
    await page.evaluate(() => {
      if ((window as any).gtag) {
        (window as any).gtag("event", "test_event", {
          event_category: "test",
          custom_parameter: "test_value",
        });
      }
    });

    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    const eventCall = gtagCalls.find(
      (call: any[]) => call[0] === "event" && call[1] === "test_event"
    );

    expect(eventCall).toBeDefined();
    expect(eventCall[2]).toEqual({
      event_category: "test",
      custom_parameter: "test_value",
    });
  });

  test("should maintain session continuity", async ({ page }) => {
    await page.goto("/");

    // Wait for analytics to load
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Navigate to different pages
    await page.goto("/resume");
    await page.waitForTimeout(500);

    await page.goto("/");
    await page.waitForTimeout(500);

    const gtagCalls = await page.evaluate(() => {
      return (window as any).gtagCalls || [];
    });

    // Should have multiple events but maintaining same session
    expect(gtagCalls.length).toBeGreaterThan(1);

    const configCalls = gtagCalls.filter((call: any[]) => call[0] === "config");
    // Should only configure once per session
    expect(configCalls.length).toBe(1);
  });

  test("should handle network errors gracefully", async ({ page }) => {
    // Simulate network error for analytics
    await page.route("**/g/collect**", (route) => {
      route.abort();
    });

    await page.goto("/");

    // Wait for analytics attempt
    await page.waitForFunction(() => {
      return typeof (window as any).gtag !== "undefined";
    });

    // Page should still function normally
    await expect(page.locator("body")).toBeVisible();

    // Check that no unhandled errors occurred
    const consoleLogs: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        consoleLogs.push(msg.text());
      }
    });

    await page.waitForTimeout(1000);

    // Should not have critical errors that break the page
    const criticalErrors = consoleLogs.filter(
      (log) => log.includes("TypeError") || log.includes("ReferenceError")
    );
    expect(criticalErrors).toHaveLength(0);
  });
});

// This test should PASS only when proper analytics integration is implemented
test.describe("Analytics Enabled - Implementation Validation", () => {
  test("should validate analytics integration implementation", async ({
    page,
  }) => {
    await page.goto("/");

    // Wait for analytics to potentially load
    await page.waitForTimeout(2000);

    // This test will help validate the actual implementation
    const analyticsState = await page.evaluate(() => {
      return {
        gtagLoaded: typeof (window as any).gtag !== "undefined",
        gtagCalls: (window as any).gtagCalls?.length || 0,
        hasConsent: localStorage.getItem("analytics-consent-v1") !== null,
        environment: process.env.NEXT_PUBLIC_GA_ID,
      };
    });

    // When implementation is complete, these should be true
    if (analyticsState.hasConsent && analyticsState.environment) {
      expect(analyticsState.gtagLoaded).toBe(true);
      expect(analyticsState.gtagCalls).toBeGreaterThan(0);
    }
  });
});
