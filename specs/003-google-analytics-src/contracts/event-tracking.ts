/**
 * Event Tracking Contract
 * 
 * Defines interfaces for tracking custom events in Google Analytics 4,
 * specifically for language toggles and PDF downloads.
 */

/**
 * Base event interface for all analytics events
 */
export interface BaseEvent {
  /** Event name as defined in GA4 */
  eventName: string;
  
  /** Event category for organization */
  eventCategory: string;
  
  /** Timestamp when event occurred */
  timestamp: number;
  
  /** GA4 session identifier */
  sessionId?: string;
  
  /** Page URL where event occurred */
  pageUrl: string;
}

/**
 * Language toggle event
 */
export interface LanguageToggleEvent extends BaseEvent {
  eventName: 'language_toggle';
  eventCategory: 'user_preference';
  
  /** Previous language setting */
  previousLanguage: 'en' | 'ko';
  
  /** New language setting */
  newLanguage: 'en' | 'ko';
  
  /** Method used to toggle language */
  toggleMethod: 'button_click' | 'keyboard_shortcut' | 'url_parameter';
}

/**
 * PDF download event
 */
export interface PDFDownloadEvent extends BaseEvent {
  eventName: 'file_download';
  eventCategory: 'engagement';
  
  /** Downloaded file name */
  fileName: string;
  
  /** File type (always 'pdf' for this use case) */
  fileType: 'pdf';
  
  /** Language version of the downloaded resume */
  language: 'en' | 'ko';
  
  /** File size in bytes */
  fileSize?: number;
  
  /** How the download was initiated */
  downloadMethod: 'direct_link' | 'button_click' | 'context_menu';
}

/**
 * Page view event (enhanced)
 */
export interface PageViewEvent extends BaseEvent {
  eventName: 'page_view';
  eventCategory: 'navigation';
  
  /** Page title */
  pageTitle: string;
  
  /** Page path */
  pagePath: string;
  
  /** Referrer URL */
  referrer?: string;
  
  /** Current language setting */
  currentLanguage: 'en' | 'ko';
}

/**
 * Union type for all trackable events
 */
export type AnalyticsEvent = LanguageToggleEvent | PDFDownloadEvent | PageViewEvent;

/**
 * Event tracker interface
 */
export interface EventTracker {
  /**
   * Track a language toggle event
   */
  trackLanguageToggle(
    previousLang: 'en' | 'ko',
    newLang: 'en' | 'ko',
    method?: 'button_click' | 'keyboard_shortcut' | 'url_parameter'
  ): Promise<void>;
  
  /**
   * Track a PDF download event
   */
  trackPDFDownload(
    fileName: string,
    language: 'en' | 'ko',
    method?: 'direct_link' | 'button_click' | 'context_menu',
    fileSize?: number
  ): Promise<void>;
  
  /**
   * Track a page view event
   */
  trackPageView(
    pageTitle: string,
    pagePath: string,
    currentLanguage: 'en' | 'ko'
  ): Promise<void>;
  
  /**
   * Track a custom event
   */
  trackCustomEvent(event: AnalyticsEvent): Promise<void>;
  
  /**
   * Check if tracking is currently enabled
   */
  isTrackingEnabled(): boolean;
}

/**
 * Event validation interface
 */
export interface EventValidator {
  /**
   * Validate a language toggle event
   */
  validateLanguageToggle(event: LanguageToggleEvent): EventValidationResult;
  
  /**
   * Validate a PDF download event
   */
  validatePDFDownload(event: PDFDownloadEvent): EventValidationResult;
  
  /**
   * Validate any analytics event
   */
  validateEvent(event: AnalyticsEvent): EventValidationResult;
}

/**
 * Event validation result
 */
export interface EventValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Google Analytics gtag function interface
 */
export interface GtagFunction {
  (command: 'config', targetId: string, config?: object): void;
  (command: 'event', eventName: string, parameters?: object): void;
  (command: 'consent', action: 'default' | 'update', parameters: object): void;
}

/**
 * Analytics service interface
 */
export interface AnalyticsService {
  /**
   * Initialize the analytics service
   */
  initialize(trackingId: string): Promise<void>;
  
  /**
   * Send event to Google Analytics
   */
  sendEvent(event: AnalyticsEvent): Promise<void>;
  
  /**
   * Check if service is initialized
   */
  isInitialized(): boolean;
  
  /**
   * Get current session ID
   */
  getSessionId(): string | undefined;
  
  /**
   * Enable/disable debug mode
   */
  setDebugMode(enabled: boolean): void;
}

/**
 * Event queue interface for offline support
 */
export interface EventQueue {
  /**
   * Add event to queue
   */
  enqueue(event: AnalyticsEvent): void;
  
  /**
   * Process queued events
   */
  processQueue(): Promise<void>;
  
  /**
   * Clear the queue
   */
  clear(): void;
  
  /**
   * Get queue size
   */
  size(): number;
}