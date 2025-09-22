/**
 * Analytics Hook
 *
 * Provides a React hook for analytics functionality including
 * event tracking, consent management, and configuration.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { siteConfig, type AnalyticsConfig } from "@/lib/config";
import {
  hasValidConsent,
  grantConsent,
  revokeConsent,
  getConsent,
  type UserConsent,
  type ConsentPermissions,
} from "@/lib/consent";
import {
  isTrackingEnabled,
  trackLanguageToggle,
  trackPDFDownload,
  trackPageView,
  trackCustomEvent,
  getSessionId,
  isAnalyticsLoaded,
  type AnalyticsEvent,
} from "@/lib/analytics";

export interface UseAnalyticsReturn {
  // Status
  isEnabled: boolean;
  isInitialized: boolean;
  hasConsent: boolean;
  config: AnalyticsConfig;

  // Event tracking functions
  trackLanguageToggle: (
    previousLang: "en" | "ko",
    newLang: "en" | "ko"
  ) => void;
  trackPDFDownload: (fileName: string, language: "en" | "ko") => void;
  trackPageView: (
    pageTitle: string,
    pagePath: string,
    currentLanguage: "en" | "ko"
  ) => void;
  trackEvent: (event: AnalyticsEvent) => void;

  // Consent management functions
  grantConsent: (
    permissions?: Partial<ConsentPermissions>
  ) => Promise<UserConsent>;
  revokeConsent: () => void;

  // Utility functions
  getSessionId: () => string | undefined;
  refreshStatus: () => void;
}

export interface UseAnalyticsOptions {
  /**
   * Enable debug logging
   */
  debug?: boolean;

  /**
   * Auto-track page views on mount
   */
  autoTrackPageView?: boolean;

  /**
   * Page title for auto-tracking
   */
  pageTitle?: string;

  /**
   * Page path for auto-tracking
   */
  pagePath?: string;

  /**
   * Current language for auto-tracking
   */
  currentLanguage?: "en" | "ko";
}

/**
 * Main analytics hook
 */
export function useAnalytics(
  options: UseAnalyticsOptions = {}
): UseAnalyticsReturn {
  const {
    debug = false,
    autoTrackPageView = false,
    pageTitle,
    pagePath,
    currentLanguage = "en",
  } = options;

  // State
  const [isEnabled, setIsEnabled] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  // Update status function
  const updateStatus = useCallback(() => {
    const enabled = isTrackingEnabled();
    const initialized = isAnalyticsLoaded();
    const consent = hasValidConsent();

    setIsEnabled(enabled);
    setIsInitialized(initialized);
    setHasConsent(consent);

    if (debug) {
      console.log("Analytics status:", { enabled, initialized, consent });
    }
  }, [debug]);

  // Initialize and set up listeners
  useEffect(() => {
    updateStatus();

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "analytics-consent-v1") {
        updateStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Check status periodically (for delayed loading)
    const interval = setInterval(updateStatus, 2000);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [updateStatus]);

  // Auto-track page view
  useEffect(() => {
    if (autoTrackPageView && isEnabled && pageTitle && pagePath) {
      trackPageView(pageTitle, pagePath, currentLanguage);
    }
  }, [autoTrackPageView, isEnabled, pageTitle, pagePath, currentLanguage]);

  // Event tracking functions
  const handleTrackLanguageToggle = useCallback(
    (previousLang: "en" | "ko", newLang: "en" | "ko") => {
      if (!isEnabled) {
        if (debug) {
          console.log(
            "Analytics: Language toggle not tracked - analytics disabled"
          );
        }
        return;
      }

      trackLanguageToggle(previousLang, newLang);

      if (debug) {
        console.log("Analytics: Language toggle tracked", {
          previousLang,
          newLang,
        });
      }
    },
    [isEnabled, debug]
  );

  const handleTrackPDFDownload = useCallback(
    (fileName: string, language: "en" | "ko") => {
      if (!isEnabled) {
        if (debug) {
          console.log(
            "Analytics: PDF download not tracked - analytics disabled"
          );
        }
        return;
      }

      trackPDFDownload(fileName, language);

      if (debug) {
        console.log("Analytics: PDF download tracked", { fileName, language });
      }
    },
    [isEnabled, debug]
  );

  const handleTrackPageView = useCallback(
    (pageTitle: string, pagePath: string, currentLanguage: "en" | "ko") => {
      if (!isEnabled) {
        if (debug) {
          console.log("Analytics: Page view not tracked - analytics disabled");
        }
        return;
      }

      trackPageView(pageTitle, pagePath, currentLanguage);

      if (debug) {
        console.log("Analytics: Page view tracked", {
          pageTitle,
          pagePath,
          currentLanguage,
        });
      }
    },
    [isEnabled, debug]
  );

  const handleTrackEvent = useCallback(
    (event: AnalyticsEvent) => {
      if (!isEnabled) {
        if (debug) {
          console.log(
            "Analytics: Custom event not tracked - analytics disabled"
          );
        }
        return;
      }

      trackCustomEvent(event.eventName, event.eventCategory, event);

      if (debug) {
        console.log("Analytics: Custom event tracked", event);
      }
    },
    [isEnabled, debug]
  );

  // Consent management functions
  const handleGrantConsent = useCallback(
    async (permissions?: Partial<ConsentPermissions>): Promise<UserConsent> => {
      try {
        const consent = grantConsent(permissions);
        updateStatus(); // Refresh status after consent change

        if (debug) {
          console.log("Analytics: Consent granted", consent);
        }

        return consent;
      } catch (error) {
        console.error("Failed to grant consent:", error);
        throw error;
      }
    },
    [updateStatus, debug]
  );

  const handleRevokeConsent = useCallback(() => {
    try {
      revokeConsent();
      updateStatus(); // Refresh status after consent change

      if (debug) {
        console.log("Analytics: Consent revoked");
      }
    } catch (error) {
      console.error("Failed to revoke consent:", error);
      throw error;
    }
  }, [updateStatus, debug]);

  return {
    // Status
    isEnabled,
    isInitialized,
    hasConsent,
    config: siteConfig.analytics,

    // Event tracking
    trackLanguageToggle: handleTrackLanguageToggle,
    trackPDFDownload: handleTrackPDFDownload,
    trackPageView: handleTrackPageView,
    trackEvent: handleTrackEvent,

    // Consent management
    grantConsent: handleGrantConsent,
    revokeConsent: handleRevokeConsent,

    // Utilities
    getSessionId,
    refreshStatus: updateStatus,
  };
}

/**
 * Simplified hook for basic event tracking
 */
export function useEventTracking() {
  const analytics = useAnalytics();

  return {
    trackLanguageToggle: analytics.trackLanguageToggle,
    trackPDFDownload: analytics.trackPDFDownload,
    trackPageView: analytics.trackPageView,
    isEnabled: analytics.isEnabled,
  };
}

/**
 * Hook specifically for consent management
 */
export function useConsent() {
  const [consent, setConsent] = useState<UserConsent | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setConsent(getConsent());

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "analytics-consent-v1") {
        setConsent(getConsent());
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleGrantConsent = useCallback(
    async (permissions?: Partial<ConsentPermissions>) => {
      setIsLoading(true);
      try {
        const newConsent = grantConsent(permissions);
        setConsent(newConsent);
        return newConsent;
      } catch (error) {
        console.error("Failed to grant consent:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleRevokeConsent = useCallback(() => {
    setIsLoading(true);
    try {
      revokeConsent();
      setConsent(null);
    } catch (error) {
      console.error("Failed to revoke consent:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    consent,
    isLoading,
    hasConsent: !!consent?.analyticsConsent,
    isConsentRequired: siteConfig.analytics.consentRequired,
    grantConsent: handleGrantConsent,
    revokeConsent: handleRevokeConsent,
  };
}

/**
 * Hook for analytics configuration management
 */
export function useAnalyticsConfig() {
  const [config] = useState<AnalyticsConfig>(siteConfig.analytics);
  const [isLoading] = useState(false);

  // For this implementation, config is read-only from siteConfig
  // In a more complex setup, this could be dynamic

  return {
    config,
    isLoading,
    errors: [], // No validation errors in this simple implementation
    shouldEnable: config.enabled && !!config.trackingId,
  };
}

/**
 * Hook for checking analytics initialization status
 */
export function useAnalyticsInit() {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkInitialization = () => {
      const initialized = isAnalyticsLoaded();
      setIsInitialized(initialized);
    };

    checkInitialization();

    const interval = setInterval(checkInitialization, 1000);

    return () => clearInterval(interval);
  }, []);

  const initialize = useCallback(async () => {
    if (isInitialized) {
      return;
    }

    setIsInitializing(true);
    setError(null);

    try {
      // Analytics initialization is handled by the Analytics component
      // This is mainly for status checking
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const initialized = isAnalyticsLoaded();
      setIsInitialized(initialized);

      if (!initialized) {
        throw new Error("Analytics failed to initialize");
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsInitializing(false);
    }
  }, [isInitialized]);

  const reset = useCallback(() => {
    setIsInitialized(false);
    setIsInitializing(false);
    setError(null);
  }, []);

  return {
    isInitialized,
    isInitializing,
    error,
    initialize,
    reset,
  };
}
