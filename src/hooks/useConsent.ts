/**
 * Consent Management Hook
 *
 * Provides a dedicated React hook for managing user consent
 * for analytics tracking with full GDPR compliance.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { siteConfig } from "@/lib/config";
import {
  hasValidConsent,
  grantConsent,
  revokeConsent,
  getConsent,
  validateConsent,
  type UserConsent,
  type ConsentPermissions,
  type ConsentValidationResult,
} from "@/lib/consent";

export interface UseConsentReturn {
  // Current consent state
  consent: UserConsent | null;
  hasConsent: boolean;
  isLoading: boolean;

  // Consent validity
  isValid: boolean;
  isExpired: boolean;
  needsUpdate: boolean;
  validationErrors: string[];

  // Consent management
  grantConsent: (
    permissions?: Partial<ConsentPermissions>
  ) => Promise<UserConsent>;
  revokeConsent: () => void;
  updateConsent: (
    permissions: Partial<ConsentPermissions>
  ) => Promise<UserConsent>;

  // UI state management
  showConsentModal: boolean;
  setShowConsentModal: (show: boolean) => void;

  // Configuration
  isConsentRequired: boolean;
  consentVersion: string;

  // Utilities
  refreshConsent: () => void;
}

export interface UseConsentOptions {
  /**
   * Automatically show consent modal if consent is required but not given
   */
  autoShow?: boolean;

  /**
   * Auto-hide modal after consent is granted
   */
  autoHide?: boolean;

  /**
   * Enable debug logging
   */
  debug?: boolean;

  /**
   * Default permissions when granting consent
   */
  defaultPermissions?: Partial<ConsentPermissions>;

  /**
   * Callback when consent is granted
   */
  onConsentGranted?: (consent: UserConsent) => void;

  /**
   * Callback when consent is revoked
   */
  onConsentRevoked?: () => void;

  /**
   * Callback when consent needs update
   */
  onConsentNeedsUpdate?: (consent: UserConsent) => void;
}

/**
 * Main consent management hook
 */
export function useConsent(options: UseConsentOptions = {}): UseConsentReturn {
  const {
    autoShow = false,
    autoHide = true,
    debug = false,
    defaultPermissions,
    onConsentGranted,
    onConsentRevoked,
    onConsentNeedsUpdate,
  } = options;

  // State
  const [consent, setConsent] = useState<UserConsent | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [validation, setValidation] = useState<ConsentValidationResult>({
    isValid: false,
    isExpired: false,
    needsUpdate: false,
    errors: [],
  });

  // Load and validate consent
  const loadConsent = useCallback(() => {
    try {
      const currentConsent = getConsent();
      setConsent(currentConsent);

      if (currentConsent) {
        const validationResult = validateConsent(currentConsent);
        setValidation(validationResult);

        if (validationResult.needsUpdate && onConsentNeedsUpdate) {
          onConsentNeedsUpdate(currentConsent);
        }

        if (debug) {
          console.log("Consent validation:", validationResult);
        }
      } else {
        setValidation({
          isValid: false,
          isExpired: false,
          needsUpdate: false,
          errors: [],
        });
      }
    } catch (error) {
      console.error("Failed to load consent:", error);
      setConsent(null);
      setValidation({
        isValid: false,
        isExpired: false,
        needsUpdate: false,
        errors: ["Failed to load consent data"],
      });
    }
  }, [debug, onConsentNeedsUpdate]);

  // Initialize consent on mount
  useEffect(() => {
    loadConsent();
  }, [loadConsent]);

  // Auto-show modal if needed
  useEffect(() => {
    if (
      autoShow &&
      siteConfig.analytics.consentRequired &&
      siteConfig.analytics.enabled &&
      !hasValidConsent()
    ) {
      setShowConsentModal(true);
    }
  }, [autoShow]);

  // Listen for consent changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "analytics-consent-v1") {
        loadConsent();

        if (debug) {
          console.log("Consent changed in another tab");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadConsent, debug]);

  // Grant consent function
  const handleGrantConsent = useCallback(
    async (permissions?: Partial<ConsentPermissions>): Promise<UserConsent> => {
      setIsLoading(true);

      try {
        const effectivePermissions = { ...defaultPermissions, ...permissions };
        const newConsent = grantConsent(effectivePermissions);

        setConsent(newConsent);
        setValidation({
          isValid: true,
          isExpired: false,
          needsUpdate: false,
          errors: [],
        });

        if (autoHide) {
          setShowConsentModal(false);
        }

        if (onConsentGranted) {
          onConsentGranted(newConsent);
        }

        if (debug) {
          console.log("Consent granted:", newConsent);
        }

        return newConsent;
      } catch (error) {
        console.error("Failed to grant consent:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [defaultPermissions, autoHide, onConsentGranted, debug]
  );

  // Revoke consent function
  const handleRevokeConsent = useCallback(() => {
    setIsLoading(true);

    try {
      revokeConsent();
      setConsent(null);
      setValidation({
        isValid: false,
        isExpired: false,
        needsUpdate: false,
        errors: [],
      });

      if (onConsentRevoked) {
        onConsentRevoked();
      }

      if (debug) {
        console.log("Consent revoked");
      }
    } catch (error) {
      console.error("Failed to revoke consent:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [onConsentRevoked, debug]);

  // Update consent with new permissions
  const handleUpdateConsent = useCallback(
    async (permissions: Partial<ConsentPermissions>): Promise<UserConsent> => {
      setIsLoading(true);

      try {
        // Get current consent and merge permissions
        const currentConsent = getConsent();
        const currentPermissions = currentConsent?.permissions || {
          ip: true,
          userAgent: true,
          demographics: false,
          performance: true,
        };

        const updatedPermissions = { ...currentPermissions, ...permissions };
        const newConsent = grantConsent(updatedPermissions);

        setConsent(newConsent);
        setValidation({
          isValid: true,
          isExpired: false,
          needsUpdate: false,
          errors: [],
        });

        if (debug) {
          console.log("Consent updated:", newConsent);
        }

        return newConsent;
      } catch (error) {
        console.error("Failed to update consent:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [debug]
  );

  return {
    // Current state
    consent,
    hasConsent: consent?.analyticsConsent === true,
    isLoading,

    // Validation
    isValid: validation.isValid,
    isExpired: validation.isExpired,
    needsUpdate: validation.needsUpdate,
    validationErrors: validation.errors,

    // Management functions
    grantConsent: handleGrantConsent,
    revokeConsent: handleRevokeConsent,
    updateConsent: handleUpdateConsent,

    // UI state
    showConsentModal,
    setShowConsentModal,

    // Configuration
    isConsentRequired: siteConfig.analytics.consentRequired,
    consentVersion: consent?.version || "1.0.0",

    // Utilities
    refreshConsent: loadConsent,
  };
}

/**
 * Simplified hook for consent status only
 */
export function useConsentStatus() {
  const [hasConsent, setHasConsent] = useState(false);
  const [isRequired, setIsRequired] = useState(false);

  useEffect(() => {
    const checkConsent = () => {
      setHasConsent(hasValidConsent());
      setIsRequired(siteConfig.analytics.consentRequired);
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

  return {
    hasConsent,
    isRequired,
    needsConsent: isRequired && !hasConsent,
  };
}

/**
 * Hook for managing consent modal visibility
 */
export function useConsentModal() {
  const [isVisible, setIsVisible] = useState(false);
  const { hasConsent, isRequired: isConsentRequired } = useConsentStatus();

  useEffect(() => {
    // Show modal if consent is required but not given
    if (isConsentRequired && !hasConsent) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isConsentRequired, hasConsent]);

  const showModal = useCallback(() => setIsVisible(true), []);
  const hideModal = useCallback(() => setIsVisible(false), []);

  return {
    isVisible,
    showModal,
    hideModal,
  };
}

/**
 * Hook for consent preferences management
 */
export function useConsentPreferences() {
  const [preferences, setPreferences] = useState<ConsentPermissions>({
    ip: true,
    userAgent: true,
    demographics: false,
    performance: true,
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load current preferences from consent
  useEffect(() => {
    const currentConsent = getConsent();
    if (currentConsent?.permissions) {
      setPreferences(currentConsent.permissions);
    }
  }, []);

  const updatePreference = useCallback(
    (key: keyof ConsentPermissions, value: boolean) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const savePreferences = useCallback(async () => {
    try {
      const newConsent = grantConsent(preferences);
      setHasUnsavedChanges(false);
      return newConsent;
    } catch (error) {
      console.error("Failed to save preferences:", error);
      throw error;
    }
  }, [preferences]);

  const resetPreferences = useCallback(() => {
    const currentConsent = getConsent();
    if (currentConsent?.permissions) {
      setPreferences(currentConsent.permissions);
    } else {
      setPreferences({
        ip: true,
        userAgent: true,
        demographics: false,
        performance: true,
      });
    }
    setHasUnsavedChanges(false);
  }, []);

  return {
    preferences,
    hasUnsavedChanges,
    updatePreference,
    savePreferences,
    resetPreferences,
  };
}
