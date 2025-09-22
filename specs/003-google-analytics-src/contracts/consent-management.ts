/**
 * Consent Management Contract
 * 
 * Defines interfaces for managing user consent for analytics tracking
 * in compliance with GDPR and privacy regulations.
 */

/**
 * User consent status for analytics
 */
export interface UserConsent {
  /** User has consented to analytics tracking */
  analyticsConsent: boolean;
  
  /** Timestamp when consent was given/updated */
  timestamp: number;
  
  /** Version of consent policy */
  version: string;
  
  /** Specific consent permissions */
  permissions: ConsentPermissions;
}

/**
 * Granular consent permissions
 */
export interface ConsentPermissions {
  /** Allow IP address collection (anonymized) */
  ip: boolean;
  
  /** Allow user agent string collection */
  userAgent: boolean;
  
  /** Allow demographic data collection */
  demographics: boolean;
  
  /** Allow performance measurement */
  performance: boolean;
}

/**
 * Consent storage interface
 */
export interface ConsentStorage {
  /**
   * Get current user consent
   */
  getConsent(): Promise<UserConsent | null>;
  
  /**
   * Save user consent
   */
  setConsent(consent: UserConsent): Promise<void>;
  
  /**
   * Remove user consent (revoke)
   */
  removeConsent(): Promise<void>;
  
  /**
   * Check if consent is valid (not expired)
   */
  isConsentValid(consent: UserConsent): boolean;
}

/**
 * Consent manager interface
 */
export interface ConsentManager {
  /**
   * Initialize consent management
   */
  initialize(): Promise<void>;
  
  /**
   * Check if user has given valid consent
   */
  hasValidConsent(): Promise<boolean>;
  
  /**
   * Request consent from user
   */
  requestConsent(): Promise<UserConsent>;
  
  /**
   * Grant consent with specified permissions
   */
  grantConsent(permissions?: Partial<ConsentPermissions>): Promise<UserConsent>;
  
  /**
   * Revoke consent
   */
  revokeConsent(): Promise<void>;
  
  /**
   * Update Google Analytics consent mode
   */
  updateGoogleConsent(consent: UserConsent): void;
  
  /**
   * Get current consent status
   */
  getCurrentConsent(): Promise<UserConsent | null>;
}

/**
 * Google Consent Mode parameters
 */
export interface GoogleConsentParams {
  /** Allow analytics storage */
  analytics_storage: 'granted' | 'denied';
  
  /** Allow ad storage */
  ad_storage: 'granted' | 'denied';
  
  /** Allow ad user data */
  ad_user_data: 'granted' | 'denied';
  
  /** Allow ad personalization */
  ad_personalization: 'granted' | 'denied';
}

/**
 * Consent UI interface
 */
export interface ConsentUI {
  /**
   * Show consent banner/modal
   */
  showConsentRequest(): Promise<boolean>;
  
  /**
   * Show consent preferences
   */
  showConsentPreferences(): Promise<UserConsent | null>;
  
  /**
   * Hide consent UI
   */
  hideConsentUI(): void;
  
  /**
   * Check if consent UI is currently visible
   */
  isVisible(): boolean;
}

/**
 * Consent events
 */
export interface ConsentEvents {
  /** Consent was granted */
  onConsentGranted: (consent: UserConsent) => void;
  
  /** Consent was revoked */
  onConsentRevoked: () => void;
  
  /** Consent was updated */
  onConsentUpdated: (consent: UserConsent) => void;
  
  /** Consent check failed */
  onConsentError: (error: Error) => void;
}

/**
 * Consent validation result
 */
export interface ConsentValidationResult {
  isValid: boolean;
  isExpired: boolean;
  needsUpdate: boolean;
  errors: string[];
}