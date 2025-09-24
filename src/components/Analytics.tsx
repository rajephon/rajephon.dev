/**
 * Analytics Component
 *
 * Conditionally loads Google Analytics 4 based on user consent and configuration.
 * Uses @next/third-parties for optimized script loading.
 */

"use client";

import React, { useEffect, useState } from "react";
import { siteConfig } from "@/lib/config";
import { hasValidConsent, initializeGoogleConsentMode } from "@/lib/consent";
import { initializeAnalytics, isTrackingEnabled } from "@/lib/analytics";

interface AnalyticsProps {
  /**
   * Override tracking ID (optional)
   */
  trackingId?: string;

  /**
   * Force disable analytics regardless of configuration
   */
  disabled?: boolean;

  /**
   * Enable debug mode
   */
  debug?: boolean;
}

export default function Analytics({
  trackingId,
  disabled = false,
  debug = false,
}: AnalyticsProps): JSX.Element | null {
  const [shouldLoadAnalytics, setShouldLoadAnalytics] = useState(false);

  // Use provided tracking ID or fall back to site config
  const effectiveTrackingId = trackingId || siteConfig.analytics.trackingId;
  const isDebugMode = debug || siteConfig.analytics.debugMode;

  useEffect(() => {
    // Don't load if explicitly disabled
    if (disabled) {
      setShouldLoadAnalytics(false);
      return;
    }

    // Don't load if no tracking ID
    if (!effectiveTrackingId) {
      if (isDebugMode) {
        console.log("Analytics: No tracking ID configured");
      }
      setShouldLoadAnalytics(false);
      return;
    }

    // Check if tracking should be enabled
    const trackingEnabled = isTrackingEnabled();

    if (isDebugMode) {
      console.log("Analytics: Tracking enabled:", trackingEnabled);
      console.log("Analytics: Has consent:", hasValidConsent());
      console.log("Analytics: Config enabled:", siteConfig.analytics.enabled);
    }

    setShouldLoadAnalytics(trackingEnabled);

    if (trackingEnabled) {
      // Initialize Google Consent Mode
      initializeGoogleConsentMode();

      // Initialize analytics utilities
      initializeAnalytics();

      if (isDebugMode) {
        console.log("Analytics: Initialized");
      }
    }
  }, [effectiveTrackingId, disabled, isDebugMode]);

  // Re-check consent changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "analytics-consent-v1") {
        const trackingEnabled = isTrackingEnabled();
        setShouldLoadAnalytics(
          trackingEnabled && !disabled && !!effectiveTrackingId
        );

        if (isDebugMode) {
          console.log(
            "Analytics: Consent changed, tracking enabled:",
            trackingEnabled
          );
        }
      }
    };

    // Listen for consent changes
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [effectiveTrackingId, disabled, isDebugMode]);

  // Don't render anything if analytics shouldn't load
  if (!shouldLoadAnalytics || !effectiveTrackingId) {
    return null;
  }

  return (
    <>
      {/* Google Analytics 직접 구현 */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${effectiveTrackingId}`}
      />
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag("js", new Date());
            gtag("config", "${effectiveTrackingId}", {
              anonymize_ip: true,
              cookie_flags: "max-age=7200;secure;samesite=none"
            });
            ${isDebugMode ? `console.log("Google Analytics loaded with ID: ${effectiveTrackingId}");` : ""}
          `,
        }}
      />
    </>
  );
}

/**
 * Analytics provider component for wrapping the app
 */
export function AnalyticsProvider({
  children,
  ...analyticsProps
}: {
  children: React.ReactNode;
} & AnalyticsProps): JSX.Element {
  return (
    <>
      {children}
      <Analytics {...analyticsProps} />
    </>
  );
}

/**
 * Hook to check if analytics is currently loaded
 */
export function useAnalyticsStatus() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    const checkStatus = () => {
      const loaded =
        typeof window !== "undefined" && typeof window.gtag === "function";
      const enabled = isTrackingEnabled();

      setIsLoaded(loaded);
      setIsEnabled(enabled);
    };

    // Check immediately
    checkStatus();

    // Check periodically (for delayed loading)
    const interval = setInterval(checkStatus, 1000);

    // Listen for consent changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "analytics-consent-v1") {
        checkStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { isLoaded, isEnabled };
}
