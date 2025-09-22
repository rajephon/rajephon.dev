import type {
  BaseEvent,
  LanguageToggleEvent,
  PDFDownloadEvent,
  PageViewEvent,
  AnalyticsEvent,
} from "@/lib/analytics";

// Mock types for testing contract compliance
interface EventTracker {
  trackLanguageToggle(
    previousLang: "en" | "ko",
    newLang: "en" | "ko",
    method?: string
  ): Promise<void>;
  trackPDFDownload(
    fileName: string,
    language: "en" | "ko",
    method?: string,
    fileSize?: number
  ): Promise<void>;
  trackPageView(
    pageTitle: string,
    pagePath: string,
    currentLanguage: "en" | "ko"
  ): Promise<void>;
  trackCustomEvent(event: AnalyticsEvent): Promise<void>;
  isTrackingEnabled(): boolean;
}

interface EventValidator {
  validateLanguageToggle(event: LanguageToggleEvent): EventValidationResult;
  validatePDFDownload(event: PDFDownloadEvent): EventValidationResult;
  validateEvent(event: AnalyticsEvent): EventValidationResult;
}

interface EventValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface GtagFunction {
  (command: "config", targetId: string, config?: object): void;
  (command: "event", eventName: string, parameters?: object): void;
  (command: "consent", action: "default" | "update", parameters: object): void;
}

interface AnalyticsService {
  initialize(trackingId: string): Promise<void>;
  sendEvent(event: AnalyticsEvent): Promise<void>;
  isInitialized(): boolean;
  getSessionId(): string | undefined;
  setDebugMode(enabled: boolean): void;
}

interface EventQueue {
  enqueue(event: AnalyticsEvent): void;
  processQueue(): Promise<void>;
  clear(): void;
  size(): number;
}

describe("EventTracking Contract Tests", () => {
  describe("BaseEvent interface", () => {
    it("should define base event properties", () => {
      const baseEvent: BaseEvent = {
        eventName: "test_event",
        eventCategory: "test_category",
        timestamp: Date.now(),
        sessionId: "test-session-id",
        pageUrl: "https://test.com/page",
      };

      expect(typeof baseEvent.eventName).toBe("string");
      expect(typeof baseEvent.eventCategory).toBe("string");
      expect(typeof baseEvent.timestamp).toBe("number");
      expect(typeof baseEvent.sessionId).toBe("string");
      expect(typeof baseEvent.pageUrl).toBe("string");
    });
  });

  describe("LanguageToggleEvent interface", () => {
    it("should define language toggle event properties", () => {
      const event: LanguageToggleEvent = {
        eventName: "language_toggle",
        eventCategory: "user_preference",
        timestamp: Date.now(),
        sessionId: "test-session-id",
        pageUrl: "https://test.com/resume",
        previousLanguage: "en",
        newLanguage: "ko",
        toggleMethod: "button_click",
      };

      expect(event.eventName).toBe("language_toggle");
      expect(event.eventCategory).toBe("user_preference");
      expect(event.previousLanguage).toMatch(/^(en|ko)$/);
      expect(event.newLanguage).toMatch(/^(en|ko)$/);
      expect(event.toggleMethod).toMatch(
        /^(button_click|keyboard_shortcut|url_parameter)$/
      );
    });

    it("should enforce language constraints", () => {
      const event: LanguageToggleEvent = {
        eventName: "language_toggle",
        eventCategory: "user_preference",
        timestamp: Date.now(),
        pageUrl: "https://test.com/resume",
        previousLanguage: "en",
        newLanguage: "ko",
        toggleMethod: "button_click",
      };

      // TypeScript should enforce these constraints
      expect(["en", "ko"]).toContain(event.previousLanguage);
      expect(["en", "ko"]).toContain(event.newLanguage);
    });
  });

  describe("PDFDownloadEvent interface", () => {
    it("should define PDF download event properties", () => {
      const event: PDFDownloadEvent = {
        eventName: "file_download",
        eventCategory: "engagement",
        timestamp: Date.now(),
        sessionId: "test-session-id",
        pageUrl: "https://test.com/resume",
        fileName: "rajephon-resume-en.pdf",
        fileType: "pdf",
        language: "en",
        fileSize: 1024,
        downloadMethod: "button_click",
      };

      expect(event.eventName).toBe("file_download");
      expect(event.eventCategory).toBe("engagement");
      expect(event.fileType).toBe("pdf");
      expect(event.language).toMatch(/^(en|ko)$/);
      expect(event.downloadMethod).toMatch(
        /^(direct_link|button_click|context_menu)$/
      );
      expect(typeof event.fileSize).toBe("number");
    });
  });

  describe("PageViewEvent interface", () => {
    it("should define page view event properties", () => {
      const event: PageViewEvent = {
        eventName: "page_view",
        eventCategory: "navigation",
        timestamp: Date.now(),
        pageUrl: "https://test.com/resume",
        pageTitle: "Resume - Test Site",
        pagePath: "/resume",
        referrer: "https://google.com",
        currentLanguage: "en",
      };

      expect(event.eventName).toBe("page_view");
      expect(event.eventCategory).toBe("navigation");
      expect(typeof event.pageTitle).toBe("string");
      expect(typeof event.pagePath).toBe("string");
      expect(event.currentLanguage).toMatch(/^(en|ko)$/);
    });
  });

  describe("AnalyticsEvent union type", () => {
    it("should accept all event types", () => {
      const languageEvent: AnalyticsEvent = {
        eventName: "language_toggle",
        eventCategory: "user_preference",
        timestamp: Date.now(),
        pageUrl: "https://test.com",
        previousLanguage: "en",
        newLanguage: "ko",
        toggleMethod: "button_click",
      };

      const downloadEvent: AnalyticsEvent = {
        eventName: "file_download",
        eventCategory: "engagement",
        timestamp: Date.now(),
        pageUrl: "https://test.com",
        fileName: "test.pdf",
        fileType: "pdf",
        language: "en",
        downloadMethod: "button_click",
      };

      const pageEvent: AnalyticsEvent = {
        eventName: "page_view",
        eventCategory: "navigation",
        timestamp: Date.now(),
        pageUrl: "https://test.com",
        pageTitle: "Test",
        pagePath: "/test",
        currentLanguage: "en",
      };

      expect(languageEvent.eventName).toBe("language_toggle");
      expect(downloadEvent.eventName).toBe("file_download");
      expect(pageEvent.eventName).toBe("page_view");
    });
  });

  describe("EventTracker interface", () => {
    it("should define tracking methods", () => {
      const mockTracker: EventTracker = {
        trackLanguageToggle: jest.fn().mockResolvedValue(undefined),
        trackPDFDownload: jest.fn().mockResolvedValue(undefined),
        trackPageView: jest.fn().mockResolvedValue(undefined),
        trackCustomEvent: jest.fn().mockResolvedValue(undefined),
        isTrackingEnabled: jest.fn().mockReturnValue(true),
      };

      expect(typeof mockTracker.trackLanguageToggle).toBe("function");
      expect(typeof mockTracker.trackPDFDownload).toBe("function");
      expect(typeof mockTracker.trackPageView).toBe("function");
      expect(typeof mockTracker.trackCustomEvent).toBe("function");
      expect(typeof mockTracker.isTrackingEnabled).toBe("function");
    });
  });

  describe("EventValidator interface", () => {
    it("should define validation methods", () => {
      const mockValidator: EventValidator = {
        validateLanguageToggle: jest.fn().mockReturnValue({
          isValid: true,
          errors: [],
          warnings: [],
        }),
        validatePDFDownload: jest.fn().mockReturnValue({
          isValid: true,
          errors: [],
          warnings: [],
        }),
        validateEvent: jest.fn().mockReturnValue({
          isValid: true,
          errors: [],
          warnings: [],
        }),
      };

      expect(typeof mockValidator.validateLanguageToggle).toBe("function");
      expect(typeof mockValidator.validatePDFDownload).toBe("function");
      expect(typeof mockValidator.validateEvent).toBe("function");
    });
  });

  describe("EventValidationResult interface", () => {
    it("should define validation result structure", () => {
      const result: EventValidationResult = {
        isValid: true,
        errors: [],
        warnings: ["Minor warning"],
      };

      expect(typeof result.isValid).toBe("boolean");
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });
  });

  describe("GtagFunction interface", () => {
    it("should define gtag function overloads", () => {
      const mockGtag: GtagFunction = jest.fn();

      // Test different command types
      mockGtag("config", "G-XXXXXXXXXX", {});
      mockGtag("event", "test_event", {});
      mockGtag("consent", "default", {});

      expect(mockGtag).toHaveBeenCalledTimes(3);
    });
  });

  describe("AnalyticsService interface", () => {
    it("should define service methods", () => {
      const mockService: AnalyticsService = {
        initialize: jest.fn().mockResolvedValue(undefined),
        sendEvent: jest.fn().mockResolvedValue(undefined),
        isInitialized: jest.fn().mockReturnValue(false),
        getSessionId: jest.fn().mockReturnValue("test-session"),
        setDebugMode: jest.fn(),
      };

      expect(typeof mockService.initialize).toBe("function");
      expect(typeof mockService.sendEvent).toBe("function");
      expect(typeof mockService.isInitialized).toBe("function");
      expect(typeof mockService.getSessionId).toBe("function");
      expect(typeof mockService.setDebugMode).toBe("function");
    });
  });

  describe("EventQueue interface", () => {
    it("should define queue methods", () => {
      const mockQueue: EventQueue = {
        enqueue: jest.fn(),
        processQueue: jest.fn().mockResolvedValue(undefined),
        clear: jest.fn(),
        size: jest.fn().mockReturnValue(0),
      };

      expect(typeof mockQueue.enqueue).toBe("function");
      expect(typeof mockQueue.processQueue).toBe("function");
      expect(typeof mockQueue.clear).toBe("function");
      expect(typeof mockQueue.size).toBe("function");
    });
  });
});

// This test should PASS now that implementation is complete
describe("EventTracking Implementation", () => {
  it("should load analytics tracking utilities", () => {
    // This should now work
    expect(() => {
      require("@/lib/analytics");
    }).not.toThrow();
  });
});
