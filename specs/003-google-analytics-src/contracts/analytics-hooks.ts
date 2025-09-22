/**
 * Analytics Hooks Contract
 * 
 * Defines React hooks interfaces for analytics functionality,
 * providing a clean API for components to interact with analytics.
 */

import { AnalyticsConfig } from './analytics-config';
import { UserConsent } from './consent-management';
import { AnalyticsEvent } from './event-tracking';

/**
 * Analytics hook return interface
 */
export interface UseAnalyticsReturn {
  /** Whether analytics tracking is currently enabled */
  isEnabled: boolean;
  
  /** Whether analytics is initialized */
  isInitialized: boolean;
  
  /** Whether user has given consent */
  hasConsent: boolean;
  
  /** Current analytics configuration */
  config: AnalyticsConfig | null;
  
  /** Track a language toggle event */
  trackLanguageToggle: (previousLang: 'en' | 'ko', newLang: 'en' | 'ko') => Promise<void>;
  
  /** Track a PDF download event */
  trackPDFDownload: (fileName: string, language: 'en' | 'ko') => Promise<void>;
  
  /** Track a custom event */
  trackEvent: (event: AnalyticsEvent) => Promise<void>;
  
  /** Grant analytics consent */
  grantConsent: () => Promise<void>;
  
  /** Revoke analytics consent */
  revokeConsent: () => Promise<void>;
}

/**
 * Consent management hook return interface
 */
export interface UseConsentReturn {
  /** Current consent status */
  consent: UserConsent | null;
  
  /** Whether consent is loading */
  isLoading: boolean;
  
  /** Whether consent modal should be shown */
  showConsentModal: boolean;
  
  /** Grant consent with optional permissions */
  grantConsent: (permissions?: Partial<UserConsent['permissions']>) => Promise<void>;
  
  /** Revoke consent */
  revokeConsent: () => Promise<void>;
  
  /** Show consent preferences */
  showPreferences: () => void;
  
  /** Hide consent modal */
  hideModal: () => void;
  
  /** Check if consent is required */
  isConsentRequired: boolean;
}

/**
 * Analytics configuration hook return interface
 */
export interface UseAnalyticsConfigReturn {
  /** Current analytics configuration */
  config: AnalyticsConfig;
  
  /** Whether configuration is loading */
  isLoading: boolean;
  
  /** Configuration validation errors */
  errors: string[];
  
  /** Whether analytics should be enabled based on config */
  shouldEnable: boolean;
  
  /** Update configuration */
  updateConfig: (newConfig: Partial<AnalyticsConfig>) => void;
  
  /** Reset to default configuration */
  resetConfig: () => void;
}

/**
 * Event tracking hook return interface
 */
export interface UseEventTrackingReturn {
  /** Whether event tracking is enabled */
  isEnabled: boolean;
  
  /** Track a language toggle */
  trackLanguageToggle: (previousLang: 'en' | 'ko', newLang: 'en' | 'ko') => Promise<void>;
  
  /** Track a PDF download */
  trackPDFDownload: (fileName: string, language: 'en' | 'ko') => Promise<void>;
  
  /** Track a page view */
  trackPageView: (pageTitle: string, pagePath: string) => Promise<void>;
  
  /** Track any custom event */
  trackCustomEvent: (event: AnalyticsEvent) => Promise<void>;
  
  /** Get current session ID */
  getSessionId: () => string | undefined;
}

/**
 * Analytics initialization hook return interface
 */
export interface UseAnalyticsInitReturn {
  /** Whether analytics is initialized */
  isInitialized: boolean;
  
  /** Whether initialization is in progress */
  isInitializing: boolean;
  
  /** Initialization error if any */
  error: Error | null;
  
  /** Initialize analytics manually */
  initialize: () => Promise<void>;
  
  /** Reset initialization state */
  reset: () => void;
}

/**
 * Analytics hook options
 */
export interface AnalyticsHookOptions {
  /** Enable debug mode */
  debug?: boolean;
  
  /** Auto-initialize on mount */
  autoInit?: boolean;
  
  /** Require consent before any tracking */
  requireConsent?: boolean;
  
  /** Track page views automatically */
  autoTrackPageViews?: boolean;
}

/**
 * Consent hook options
 */
export interface ConsentHookOptions {
  /** Auto-show consent modal if needed */
  autoShow?: boolean;
  
  /** Consent modal configuration */
  modalConfig?: {
    title?: string;
    description?: string;
    showPreferences?: boolean;
  };
  
  /** Default consent permissions */
  defaultPermissions?: Partial<UserConsent['permissions']>;
}

/**
 * Event tracking hook options
 */
export interface EventTrackingOptions {
  /** Validate events before sending */
  validate?: boolean;
  
  /** Queue events when offline */
  queueOfflineEvents?: boolean;
  
  /** Debounce rapid events */
  debounceMs?: number;
  
  /** Include additional context data */
  includeContext?: boolean;
}

/**
 * Hook factory interface for creating custom analytics hooks
 */
export interface AnalyticsHookFactory {
  /**
   * Create a custom analytics hook
   */
  createAnalyticsHook: (options?: AnalyticsHookOptions) => () => UseAnalyticsReturn;
  
  /**
   * Create a custom consent hook
   */
  createConsentHook: (options?: ConsentHookOptions) => () => UseConsentReturn;
  
  /**
   * Create a custom event tracking hook
   */
  createEventTrackingHook: (options?: EventTrackingOptions) => () => UseEventTrackingReturn;
}