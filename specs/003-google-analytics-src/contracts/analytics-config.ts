/**
 * Analytics Configuration Contract
 * 
 * Defines the interface for Google Analytics 4 configuration
 * that extends the existing site configuration.
 */

export interface AnalyticsConfig {
  /** 
   * Google Analytics 4 measurement ID (format: G-XXXXXXXXXX)
   * Optional - when not provided, analytics is disabled
   */
  trackingId?: string;
  
  /** 
   * Computed property - true if trackingId is present and valid
   */
  readonly enabled: boolean;
  
  /** 
   * Respect Do Not Track browser setting
   * @default true
   */
  respectDNT: boolean;
  
  /** 
   * Require explicit user consent before tracking
   * @default true
   */
  consentRequired: boolean;
  
  /** 
   * Enable analytics in development environment
   * @default false
   */
  enableInDevelopment: boolean;
  
  /** 
   * Enable Google Analytics debug mode
   * @default false
   */
  debugMode: boolean;
}

/**
 * Extended site configuration with analytics
 */
export interface SiteConfigWithAnalytics {
  /** Existing site configuration properties */
  title: string;
  description: string;
  domain: string;
  author: string;
  
  /** New analytics configuration */
  analytics: AnalyticsConfig;
}

/**
 * Environment variables contract for analytics
 */
export interface AnalyticsEnvironment {
  /** Google Analytics tracking ID from environment */
  NEXT_PUBLIC_GA_ID?: string;
  
  /** Node environment */
  NODE_ENV: 'development' | 'production' | 'test';
}

/**
 * Configuration validation result
 */
export interface ConfigValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Analytics configuration utility functions
 */
export interface AnalyticsConfigUtils {
  /**
   * Validate analytics configuration
   */
  validateConfig(config: AnalyticsConfig): ConfigValidationResult;
  
  /**
   * Check if analytics should be enabled based on configuration and environment
   */
  shouldEnableAnalytics(config: AnalyticsConfig, env: AnalyticsEnvironment): boolean;
  
  /**
   * Get tracking ID from configuration or environment
   */
  getTrackingId(config: AnalyticsConfig, env: AnalyticsEnvironment): string | undefined;
  
  /**
   * Create default analytics configuration
   */
  createDefaultConfig(): AnalyticsConfig;
}