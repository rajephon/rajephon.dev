/**
 * Consent Management Utilities
 *
 * Handles user consent for analytics tracking in compliance with GDPR
 * and privacy regulations.
 */

export interface UserConsent {
  analyticsConsent: boolean;
  timestamp: number;
  version: string;
  permissions: ConsentPermissions;
}

export interface ConsentPermissions {
  ip: boolean;
  userAgent: boolean;
  demographics: boolean;
  performance: boolean;
}

export interface ConsentValidationResult {
  isValid: boolean;
  isExpired: boolean;
  needsUpdate: boolean;
  errors: string[];
}

// Storage key for consent data
const CONSENT_STORAGE_KEY = "analytics-consent-v1";

// Consent expires after 365 days
const CONSENT_EXPIRY_DAYS = 365;

// Current consent policy version
const CONSENT_VERSION = "1.0.0";

/**
 * Get current user consent from localStorage
 */
export function getConsent(): UserConsent | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const consent = JSON.parse(stored) as UserConsent;

    // Validate consent structure
    const validation = validateConsent(consent);
    if (!validation.isValid || validation.isExpired) {
      // Remove invalid or expired consent
      removeConsent();
      return null;
    }

    return consent;
  } catch (error) {
    console.warn("Failed to parse stored consent:", error);
    // Remove corrupted consent data
    removeConsent();
    return null;
  }
}

/**
 * Set user consent in localStorage
 */
export function setConsent(
  analyticsConsent: boolean,
  customPermissions?: Partial<ConsentPermissions>
): UserConsent {
  if (typeof window === "undefined") {
    throw new Error("Cannot set consent on server side");
  }

  const defaultPermissions: ConsentPermissions = {
    ip: true,
    userAgent: true,
    demographics: false,
    performance: true,
  };

  const permissions = { ...defaultPermissions, ...customPermissions };

  const consent: UserConsent = {
    analyticsConsent,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
    permissions,
  };

  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consent));

    // Update Google Consent Mode if gtag is available
    updateGoogleConsentMode(consent);

    return consent;
  } catch (error) {
    console.error("Failed to store consent:", error);
    throw new Error("Failed to save consent preferences");
  }
}

/**
 * Remove user consent from localStorage
 */
export function removeConsent(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);

    // Update Google Consent Mode to denied
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
    }
  } catch (error) {
    console.warn("Failed to remove consent:", error);
  }
}

/**
 * Validate consent data structure and expiration
 */
export function validateConsent(consent: UserConsent): ConsentValidationResult {
  const errors: string[] = [];
  let isValid = true;
  let isExpired = false;
  let needsUpdate = false;

  // Check required properties
  if (typeof consent.analyticsConsent !== "boolean") {
    errors.push("Invalid analyticsConsent value");
    isValid = false;
  }

  if (typeof consent.timestamp !== "number" || consent.timestamp <= 0) {
    errors.push("Invalid timestamp");
    isValid = false;
  }

  if (typeof consent.version !== "string" || !consent.version) {
    errors.push("Invalid version");
    isValid = false;
  }

  // Check permissions structure
  if (!consent.permissions || typeof consent.permissions !== "object") {
    errors.push("Missing or invalid permissions");
    isValid = false;
  } else {
    const { permissions } = consent;
    const requiredPermissions = [
      "ip",
      "userAgent",
      "demographics",
      "performance",
    ];

    for (const perm of requiredPermissions) {
      if (typeof permissions[perm as keyof ConsentPermissions] !== "boolean") {
        errors.push(`Invalid permission: ${perm}`);
        isValid = false;
      }
    }
  }

  // Check expiration (365 days)
  if (isValid && consent.timestamp) {
    const expiryTime =
      consent.timestamp + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
    isExpired = Date.now() > expiryTime;

    if (isExpired) {
      errors.push("Consent has expired");
    }
  }

  // Check if version needs update
  if (isValid && consent.version !== CONSENT_VERSION) {
    needsUpdate = true;
    errors.push("Consent version is outdated");
  }

  return {
    isValid: isValid && !isExpired,
    isExpired,
    needsUpdate,
    errors,
  };
}

/**
 * Check if user has valid consent for analytics
 */
export function hasValidConsent(): boolean {
  const consent = getConsent();
  return consent?.analyticsConsent === true;
}

/**
 * Check if consent is required based on configuration
 */
export function isConsentRequired(): boolean {
  // Always require consent for GDPR compliance
  return true;
}

/**
 * Update Google Consent Mode based on user consent
 */
export function updateGoogleConsentMode(consent: UserConsent): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  const { analyticsConsent, permissions } = consent;

  // Update consent mode parameters
  window.gtag("consent", "update", {
    analytics_storage: analyticsConsent ? "granted" : "denied",
    ad_storage: "denied", // We don't use advertising features
    ad_user_data: "denied",
    ad_personalization: "denied",
  });

  // Set additional parameters based on permissions
  if (analyticsConsent) {
    const consentParams: Record<string, string> = {};

    if (!permissions.ip) {
      consentParams.anonymize_ip = "true";
    }

    if (permissions.demographics) {
      consentParams.allow_google_signals = "true";
    }

    // Apply additional consent parameters
    if (Object.keys(consentParams).length > 0) {
      window.gtag("config", "GA_MEASUREMENT_ID", consentParams);
    }
  }
}

/**
 * Initialize Google Consent Mode with default denied state
 */
export function initializeGoogleConsentMode(): void {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  // Set default consent to denied
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500, // Wait 500ms for consent update
  });
}

/**
 * Grant consent with default or custom permissions
 */
export function grantConsent(
  customPermissions?: Partial<ConsentPermissions>
): UserConsent {
  return setConsent(true, customPermissions);
}

/**
 * Revoke consent
 */
export function revokeConsent(): void {
  removeConsent();
}

/**
 * Check if Do Not Track is enabled in browser
 */
export function isDNTEnabled(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  return (
    navigator.doNotTrack === "1" ||
    (window as any).doNotTrack === "1" ||
    (navigator as any).msDoNotTrack === "1"
  );
}

/**
 * Should respect Do Not Track setting
 */
export function shouldRespectDNT(): boolean {
  return isDNTEnabled();
}

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
