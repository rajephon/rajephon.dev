/**
 * Analytics Tracking Utilities
 *
 * Provides functions for tracking custom events in Google Analytics 4
 * with proper validation and error handling.
 */

import { hasValidConsent, isDNTEnabled } from "./consent";
import { siteConfig } from "./config";

// Event interfaces
export interface BaseEvent {
  eventName: string;
  eventCategory: string;
  timestamp: number;
  sessionId?: string;
  pageUrl: string;
}

export interface LanguageToggleEvent extends BaseEvent {
  eventName: "language_toggle";
  eventCategory: "user_preference";
  previousLanguage: "en" | "ko";
  newLanguage: "en" | "ko";
  toggleMethod: "button_click" | "keyboard_shortcut" | "url_parameter";
}

export interface PDFDownloadEvent extends BaseEvent {
  eventName: "file_download";
  eventCategory: "engagement";
  fileName: string;
  fileType: "pdf";
  language: "en" | "ko";
  fileSize?: number;
  downloadMethod: "direct_link" | "button_click" | "context_menu";
}

export interface PageViewEvent extends BaseEvent {
  eventName: "page_view";
  eventCategory: "navigation";
  pageTitle: string;
  pagePath: string;
  referrer?: string;
  currentLanguage: "en" | "ko";
}

export type AnalyticsEvent =
  | LanguageToggleEvent
  | PDFDownloadEvent
  | PageViewEvent;

/**
 * Check if analytics tracking is enabled and allowed
 */
export function isTrackingEnabled(): boolean {
  // Check if analytics is configured
  if (!siteConfig.analytics.enabled) {
    return false;
  }

  // Check if in development and not explicitly enabled
  if (
    process.env.NODE_ENV === "development" &&
    !siteConfig.analytics.enableInDevelopment
  ) {
    return false;
  }

  // Check user consent
  if (siteConfig.analytics.consentRequired && !hasValidConsent()) {
    return false;
  }

  // Check Do Not Track
  if (siteConfig.analytics.respectDNT && isDNTEnabled()) {
    return false;
  }

  // Check if gtag is available
  if (typeof window === "undefined" || !window.gtag) {
    return false;
  }

  return true;
}

/**
 * Track language toggle event
 */
export function trackLanguageToggle(
  previousLang: "en" | "ko",
  newLang: "en" | "ko",
  method:
    | "button_click"
    | "keyboard_shortcut"
    | "url_parameter" = "button_click"
): void {
  if (!isTrackingEnabled()) {
    return;
  }

  if (previousLang === newLang) {
    console.warn("Language toggle: previous and new language are the same");
    return;
  }

  try {
    window.gtag("event", "language_toggle", {
      event_category: "user_preference",
      previous_language: previousLang,
      new_language: newLang,
      toggle_method: method,
      custom_map: {
        custom_parameter_1: "language_preference_change",
      },
    });

    if (siteConfig.analytics.debugMode) {
      console.log("Analytics: Language toggle tracked", {
        previousLang,
        newLang,
        method,
      });
    }
  } catch (error) {
    console.error("Failed to track language toggle:", error);
  }
}

/**
 * Track PDF download event
 */
export function trackPDFDownload(
  fileName: string,
  language: "en" | "ko",
  method: "direct_link" | "button_click" | "context_menu" = "button_click",
  fileSize?: number
): void {
  if (!isTrackingEnabled()) {
    return;
  }

  try {
    const eventParams: Record<string, any> = {
      event_category: "engagement",
      file_name: fileName,
      file_type: "pdf",
      language: language,
      download_method: method,
    };

    if (fileSize && fileSize > 0) {
      eventParams.file_size = fileSize;
    }

    window.gtag("event", "file_download", eventParams);

    if (siteConfig.analytics.debugMode) {
      console.log("Analytics: PDF download tracked", {
        fileName,
        language,
        method,
        fileSize,
      });
    }
  } catch (error) {
    console.error("Failed to track PDF download:", error);
  }
}

/**
 * Track page view event
 */
export function trackPageView(
  pageTitle: string,
  pagePath: string,
  currentLanguage: "en" | "ko"
): void {
  if (!isTrackingEnabled()) {
    return;
  }

  try {
    window.gtag("event", "page_view", {
      page_title: pageTitle,
      page_location: window.location.href,
      page_path: pagePath,
      language: currentLanguage,
      custom_map: {
        custom_parameter_2: "page_navigation",
      },
    });

    if (siteConfig.analytics.debugMode) {
      console.log("Analytics: Page view tracked", {
        pageTitle,
        pagePath,
        currentLanguage,
      });
    }
  } catch (error) {
    console.error("Failed to track page view:", error);
  }
}

/**
 * Track custom event
 */
export function trackCustomEvent(
  eventName: string,
  eventCategory: string,
  parameters: Record<string, any> = {}
): void {
  if (!isTrackingEnabled()) {
    return;
  }

  try {
    window.gtag("event", eventName, {
      event_category: eventCategory,
      ...parameters,
    });

    if (siteConfig.analytics.debugMode) {
      console.log("Analytics: Custom event tracked", {
        eventName,
        eventCategory,
        parameters,
      });
    }
  } catch (error) {
    console.error("Failed to track custom event:", error);
  }
}

/**
 * Get current session ID if available
 */
export function getSessionId(): string | undefined {
  if (typeof window === "undefined" || !window.gtag) {
    return undefined;
  }

  try {
    // Try to get session ID from Google Analytics
    // This is implementation-specific and may not always be available
    const dataLayer = (window as any).dataLayer || [];
    const sessionData = dataLayer.find(
      (item: any) => item && typeof item === "object" && item.session_id
    );

    return sessionData?.session_id;
  } catch (error) {
    console.warn("Could not retrieve session ID:", error);
    return undefined;
  }
}

/**
 * Initialize analytics with tracking ID
 */
export function initializeAnalytics(): boolean {
  if (!siteConfig.analytics.enabled || !siteConfig.analytics.trackingId) {
    console.log("Analytics: Not initialized - tracking disabled or ID missing");
    return false;
  }

  if (typeof window === "undefined") {
    console.log("Analytics: Not initialized - server side");
    return false;
  }

  try {
    // Analytics will be initialized by @next/third-parties
    // This function serves as a validation point

    if (siteConfig.analytics.debugMode) {
      console.log(
        "Analytics: Initialized with tracking ID",
        siteConfig.analytics.trackingId
      );
    }

    return true;
  } catch (error) {
    console.error("Failed to initialize analytics:", error);
    return false;
  }
}

/**
 * Check if analytics is properly loaded
 */
export function isAnalyticsLoaded(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.gtag === "function" &&
    siteConfig.analytics.enabled
  );
}

/**
 * Set debug mode for analytics
 */
export function setDebugMode(enabled: boolean): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  try {
    window.gtag("config", siteConfig.analytics.trackingId!, {
      debug_mode: enabled,
    });

    if (enabled) {
      console.log("Analytics: Debug mode enabled");
    }
  } catch (error) {
    console.error("Failed to set debug mode:", error);
  }
}

/**
 * Validate event parameters
 */
export function validateEvent(event: Partial<AnalyticsEvent>): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!event.eventName) {
    errors.push("Event name is required");
  }

  if (!event.eventCategory) {
    errors.push("Event category is required");
  }

  // Validate specific event types
  if (event.eventName === "language_toggle") {
    const langEvent = event as Partial<LanguageToggleEvent>;

    if (
      !langEvent.previousLanguage ||
      !["en", "ko"].includes(langEvent.previousLanguage)
    ) {
      errors.push("Invalid previous language");
    }

    if (
      !langEvent.newLanguage ||
      !["en", "ko"].includes(langEvent.newLanguage)
    ) {
      errors.push("Invalid new language");
    }

    if (langEvent.previousLanguage === langEvent.newLanguage) {
      errors.push("Previous and new language must be different");
    }
  }

  if (event.eventName === "file_download") {
    const downloadEvent = event as Partial<PDFDownloadEvent>;

    if (!downloadEvent.fileName) {
      errors.push("File name is required for download events");
    }

    if (
      !downloadEvent.language ||
      !["en", "ko"].includes(downloadEvent.language)
    ) {
      errors.push("Invalid language for download event");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Create event with common properties
 */
export function createBaseEvent(
  eventName: string,
  eventCategory: string
): BaseEvent {
  return {
    eventName,
    eventCategory,
    timestamp: Date.now(),
    pageUrl: typeof window !== "undefined" ? window.location.href : "",
    sessionId: getSessionId(),
  };
}

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer?: any[];
  }
}
