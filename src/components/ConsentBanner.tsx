/**
 * Consent Banner Component
 *
 * Displays a privacy-compliant consent banner for analytics tracking.
 * Allows users to grant or deny consent for data collection.
 */

"use client";

import React, { useState, useEffect } from "react";
import { siteConfig } from "@/lib/config";
import {
  hasValidConsent,
  grantConsent,
  revokeConsent,
  getConsent,
  type UserConsent,
  type ConsentPermissions,
} from "@/lib/consent";

interface ConsentBannerProps {
  /**
   * Custom title for the consent banner
   */
  title?: string;

  /**
   * Custom description for the consent banner
   */
  description?: string;

  /**
   * Show detailed preferences options
   */
  showPreferences?: boolean;

  /**
   * Position of the banner
   */
  position?: "top" | "bottom";

  /**
   * Auto-hide after consent is given
   */
  autoHide?: boolean;

  /**
   * Custom styling classes
   */
  className?: string;

  /**
   * Callback when consent is granted
   */
  onConsentGranted?: (consent: UserConsent) => void;

  /**
   * Callback when consent is revoked
   */
  onConsentRevoked?: () => void;
}

export default function ConsentBanner({
  title = "Cookie Consent",
  description = "We use analytics to improve your experience on our website. Your data is processed anonymously and helps us understand how visitors use our site.",
  showPreferences = false,
  position = "bottom",
  autoHide = true,
  className = "",
  onConsentGranted,
  onConsentRevoked,
}: ConsentBannerProps): JSX.Element | null {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [customPermissions, setCustomPermissions] = useState<
    Partial<ConsentPermissions>
  >({
    ip: true,
    userAgent: true,
    demographics: false,
    performance: true,
  });

  useEffect(() => {
    // Check if consent is required and not yet given
    const shouldShow =
      siteConfig.analytics.consentRequired &&
      siteConfig.analytics.enabled &&
      !hasValidConsent();

    setIsVisible(shouldShow);
  }, []);

  // Handle consent granted
  const handleAccept = async (useCustomPermissions = false) => {
    setIsLoading(true);

    try {
      const permissions = useCustomPermissions ? customPermissions : undefined;
      const consent = grantConsent(permissions);

      if (onConsentGranted) {
        onConsentGranted(consent);
      }

      if (autoHide) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Failed to grant consent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle consent denied
  const handleDecline = () => {
    setIsLoading(true);

    try {
      revokeConsent();

      if (onConsentRevoked) {
        onConsentRevoked();
      }

      if (autoHide) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error("Failed to revoke consent:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle permission changes
  const handlePermissionChange = (
    permission: keyof ConsentPermissions,
    value: boolean
  ) => {
    setCustomPermissions((prev) => ({
      ...prev,
      [permission]: value,
    }));
  };

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  const baseClasses = `
    fixed z-50 left-0 right-0 bg-white border-gray-200 shadow-lg border-t
    transition-transform duration-300 ease-in-out
    ${position === "top" ? "top-0 border-b border-t-0" : "bottom-0"}
    ${className}
  `;

  return (
    <div
      className={baseClasses}
      data-testid="consent-banner"
      role="banner"
      aria-label="Cookie consent banner"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {description}
            </p>

            {showPreferences && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 underline"
                data-testid="consent-preferences-toggle"
              >
                {showDetails ? "Hide details" : "Customize preferences"}
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:ml-6">
            <button
              onClick={handleDecline}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
              data-testid="consent-decline"
            >
              Decline
            </button>
            <button
              onClick={() => handleAccept(false)}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              data-testid="consent-accept"
            >
              {isLoading ? "Processing..." : "Accept"}
            </button>
          </div>
        </div>

        {/* Detailed preferences */}
        {showDetails && showPreferences && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">
              Customize your preferences
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customPermissions.ip || false}
                  onChange={(e) =>
                    handlePermissionChange("ip", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Anonymous IP tracking
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customPermissions.userAgent || false}
                  onChange={(e) =>
                    handlePermissionChange("userAgent", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Browser information
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customPermissions.demographics || false}
                  onChange={(e) =>
                    handlePermissionChange("demographics", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Demographics data
                </span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={customPermissions.performance || false}
                  onChange={(e) =>
                    handlePermissionChange("performance", e.target.checked)
                  }
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  Performance metrics
                </span>
              </label>
            </div>

            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleAccept(true)}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                data-testid="consent-accept-custom"
              >
                {isLoading ? "Processing..." : "Accept with preferences"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Simple consent status indicator
 */
export function ConsentStatus(): JSX.Element {
  const [consent, setConsent] = useState<UserConsent | null>(null);

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

  if (!consent) {
    return (
      <div className="text-sm text-gray-500">Analytics: Not consented</div>
    );
  }

  return (
    <div className="text-sm text-green-600">
      Analytics: Consented ({new Date(consent.timestamp).toLocaleDateString()})
    </div>
  );
}

/**
 * Consent management hook
 */
export function useConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      const consent = hasValidConsent();
      const shouldShow =
        siteConfig.analytics.consentRequired &&
        siteConfig.analytics.enabled &&
        !consent;

      setHasConsent(consent);
      setIsVisible(shouldShow);
    };

    checkConsent();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "analytics-consent-v1") {
        checkConsent();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const showBanner = () => setIsVisible(true);
  const hideBanner = () => setIsVisible(false);

  return {
    isVisible,
    hasConsent,
    showBanner,
    hideBanner,
  };
}
