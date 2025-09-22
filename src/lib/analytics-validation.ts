/**
 * Analytics Validation Utilities
 *
 * Provides validation functions for analytics configuration and events
 * to ensure data integrity and proper tracking.
 */

import type { AnalyticsConfig } from "./config";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ConfigValidationResult extends ValidationResult {
  recommendedChanges?: string[];
}

/**
 * Validate Google Analytics 4 tracking ID format
 */
export function validateTrackingId(trackingId: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!trackingId) {
    errors.push("Tracking ID is required");
    return { isValid: false, errors, warnings };
  }

  // GA4 format: G-XXXXXXXXXX (G- followed by 10 alphanumeric characters)
  const ga4Pattern = /^G-[A-Z0-9]{10}$/;

  if (!ga4Pattern.test(trackingId)) {
    errors.push(
      "Invalid GA4 tracking ID format. Expected format: G-XXXXXXXXXX"
    );
  }

  // Check for common mistakes
  if (trackingId.startsWith("UA-")) {
    errors.push(
      "Universal Analytics (UA-) tracking IDs are not supported. Please use GA4 (G-) tracking ID"
    );
  }

  if (trackingId.includes(" ")) {
    errors.push("Tracking ID cannot contain spaces");
  }

  if (trackingId.toLowerCase() !== trackingId.toUpperCase()) {
    warnings.push("Tracking ID should be uppercase");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate analytics configuration
 */
export function validateAnalyticsConfig(
  config: AnalyticsConfig
): ConfigValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const recommendedChanges: string[] = [];

  // Validate tracking ID if provided
  if (config.trackingId) {
    const trackingValidation = validateTrackingId(config.trackingId);
    errors.push(...trackingValidation.errors);
    warnings.push(...trackingValidation.warnings);
  }

  // Validate enabled state consistency
  if (config.enabled && !config.trackingId) {
    errors.push("Analytics cannot be enabled without a tracking ID");
  }

  if (!config.enabled && config.trackingId) {
    warnings.push("Analytics is disabled despite having a tracking ID");
  }

  // Validate boolean properties
  const booleanProps = [
    "enabled",
    "respectDNT",
    "consentRequired",
    "enableInDevelopment",
    "debugMode",
  ] as const;

  for (const prop of booleanProps) {
    if (typeof config[prop] !== "boolean") {
      errors.push(`${prop} must be a boolean value`);
    }
  }

  // Privacy and compliance recommendations
  if (!config.consentRequired) {
    warnings.push("Consider requiring user consent for GDPR compliance");
    recommendedChanges.push(
      "Set consentRequired to true for better privacy compliance"
    );
  }

  if (!config.respectDNT) {
    warnings.push("Consider respecting Do Not Track browser settings");
    recommendedChanges.push(
      "Set respectDNT to true to respect user privacy preferences"
    );
  }

  // Development environment recommendations
  if (config.enableInDevelopment) {
    warnings.push("Analytics is enabled in development environment");
    recommendedChanges.push(
      "Disable analytics in development to avoid test data pollution"
    );
  }

  // Production environment recommendations
  if (process.env.NODE_ENV === "production") {
    if (config.debugMode) {
      warnings.push("Debug mode is enabled in production");
      recommendedChanges.push(
        "Disable debug mode in production for better performance"
      );
    }

    if (!config.trackingId) {
      warnings.push("No tracking ID configured for production environment");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    recommendedChanges,
  };
}

/**
 * Validate language parameter
 */
export function validateLanguage(language: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!language) {
    errors.push("Language is required");
    return { isValid: false, errors, warnings };
  }

  const supportedLanguages = ["en", "ko"];

  if (!supportedLanguages.includes(language)) {
    errors.push(
      `Unsupported language: ${language}. Supported languages: ${supportedLanguages.join(", ")}`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate file name for download events
 */
export function validateFileName(fileName: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!fileName) {
    errors.push("File name is required");
    return { isValid: false, errors, warnings };
  }

  // Check for valid PDF file names
  if (!fileName.endsWith(".pdf")) {
    errors.push("File name must end with .pdf extension");
  }

  // Check for expected resume file name pattern
  const resumePattern = /^rajephon-resume(-ko)?\.pdf$/;
  if (!resumePattern.test(fileName)) {
    warnings.push(
      "File name doesn't match expected resume pattern (rajephon-resume.pdf or rajephon-resume-ko.pdf)"
    );
  }

  // Check for unsafe characters
  const unsafeChars = /[<>:"/\\|?*]/;
  if (unsafeChars.test(fileName)) {
    errors.push("File name contains unsafe characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate event parameters
 */
export function validateEventParameters(
  eventName: string,
  parameters: Record<string, any>
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!eventName) {
    errors.push("Event name is required");
    return { isValid: false, errors, warnings };
  }

  // Validate event name format
  if (!/^[a-z_][a-z0-9_]*$/.test(eventName)) {
    errors.push(
      "Event name must contain only lowercase letters, numbers, and underscores, starting with a letter or underscore"
    );
  }

  // Check parameter count (GA4 limit)
  const parameterCount = Object.keys(parameters).length;
  if (parameterCount > 25) {
    errors.push(
      `Too many parameters (${parameterCount}). GA4 supports maximum 25 custom parameters per event`
    );
  }

  // Validate parameter names
  for (const [key, value] of Object.entries(parameters)) {
    // Parameter name validation
    if (!/^[a-z_][a-z0-9_]*$/.test(key)) {
      errors.push(
        `Invalid parameter name: ${key}. Must contain only lowercase letters, numbers, and underscores`
      );
    }

    // Parameter name length
    if (key.length > 40) {
      errors.push(
        `Parameter name too long: ${key}. Maximum 40 characters allowed`
      );
    }

    // Parameter value validation
    if (typeof value === "string" && value.length > 100) {
      warnings.push(
        `Parameter value for '${key}' is very long (${value.length} characters). Consider shortening for better performance`
      );
    }

    // Check for reserved parameter names
    const reservedNames = [
      "client_id",
      "session_id",
      "engagement_time_msec",
      "page_location",
      "page_referrer",
      "page_title",
      "screen_resolution",
      "language",
      "currency",
      "value",
    ];

    if (reservedNames.includes(key)) {
      warnings.push(`Parameter name '${key}' is reserved by Google Analytics`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate language toggle event
 */
export function validateLanguageToggleEvent(
  previousLanguage: string,
  newLanguage: string,
  method?: string
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate languages
  const prevLangValidation = validateLanguage(previousLanguage);
  const newLangValidation = validateLanguage(newLanguage);

  errors.push(...prevLangValidation.errors, ...newLangValidation.errors);
  warnings.push(...prevLangValidation.warnings, ...newLangValidation.warnings);

  // Validate language change
  if (previousLanguage === newLanguage) {
    errors.push("Previous and new language must be different");
  }

  // Validate toggle method
  if (method) {
    const validMethods = ["button_click", "keyboard_shortcut", "url_parameter"];
    if (!validMethods.includes(method)) {
      errors.push(
        `Invalid toggle method: ${method}. Valid methods: ${validMethods.join(", ")}`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate PDF download event
 */
export function validatePDFDownloadEvent(
  fileName: string,
  language: string,
  method?: string,
  fileSize?: number
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate file name
  const fileValidation = validateFileName(fileName);
  errors.push(...fileValidation.errors);
  warnings.push(...fileValidation.warnings);

  // Validate language
  const langValidation = validateLanguage(language);
  errors.push(...langValidation.errors);
  warnings.push(...langValidation.warnings);

  // Validate download method
  if (method) {
    const validMethods = ["direct_link", "button_click", "context_menu"];
    if (!validMethods.includes(method)) {
      errors.push(
        `Invalid download method: ${method}. Valid methods: ${validMethods.join(", ")}`
      );
    }
  }

  // Validate file size
  if (fileSize !== undefined) {
    if (typeof fileSize !== "number" || fileSize < 0) {
      errors.push("File size must be a non-negative number");
    }

    if (fileSize === 0) {
      warnings.push("File size is 0, which may indicate an error");
    }

    if (fileSize > 10 * 1024 * 1024) {
      // 10MB
      warnings.push("File size is unusually large for a resume PDF");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (gaId) {
    const trackingValidation = validateTrackingId(gaId);
    errors.push(...trackingValidation.errors);
    warnings.push(...trackingValidation.warnings);
  }

  // Check environment consistency
  if (process.env.NODE_ENV === "production" && !gaId) {
    warnings.push("No Google Analytics tracking ID configured for production");
  }

  if (process.env.NODE_ENV === "development" && gaId) {
    warnings.push(
      "Google Analytics tracking ID configured in development (may send test data)"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get validation summary for all analytics components
 */
export function getValidationSummary(config: AnalyticsConfig): {
  overallValid: boolean;
  configValidation: ConfigValidationResult;
  environmentValidation: ValidationResult;
  recommendations: string[];
} {
  const configValidation = validateAnalyticsConfig(config);
  const environmentValidation = validateEnvironment();

  const overallValid =
    configValidation.isValid && environmentValidation.isValid;

  const recommendations: string[] = [];

  // Add config recommendations
  if (configValidation.recommendedChanges) {
    recommendations.push(...configValidation.recommendedChanges);
  }

  // Add general recommendations
  if (!overallValid) {
    recommendations.push("Fix validation errors before enabling analytics");
  }

  if (config.enabled && overallValid) {
    recommendations.push("Analytics configuration is valid and ready for use");
  }

  return {
    overallValid,
    configValidation,
    environmentValidation,
    recommendations,
  };
}
