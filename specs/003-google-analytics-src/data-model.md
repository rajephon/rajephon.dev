# Data Model: Google Analytics Integration

**Feature**: Google Analytics Integration  
**Version**: 1.0  
**Date**: 2025-09-22

## Entity Overview

This document defines the data entities and their relationships for the Google Analytics 4 integration feature.

## 1. Analytics Configuration Entity

**Purpose**: Central configuration for Google Analytics tracking settings  
**Location**: `src/lib/config.ts` (extension)

```typescript
interface AnalyticsConfig {
  // Core Configuration
  trackingId?: string;          // GA4 measurement ID (G-XXXXXXXXXX)
  enabled: boolean;             // Computed from trackingId presence
  
  // Privacy Settings
  respectDNT: boolean;          // Respect Do Not Track header
  consentRequired: boolean;     // Require explicit user consent
  
  // Environment Settings  
  enableInDevelopment: boolean; // Track in development mode
  debugMode: boolean;           // Enable GA4 debug mode
}
```

**Validation Rules**:
- `trackingId` format: Must match pattern `G-[A-Z0-9]{10}` if provided
- `enabled` is computed: `true` if `trackingId` is present and valid
- `respectDNT` defaults to `true` for privacy compliance
- `consentRequired` defaults to `true` for GDPR compliance
- `enableInDevelopment` defaults to `false` to prevent test data pollution

**State Transitions**:
- Disabled → Enabled: When valid tracking ID is configured
- Enabled → Disabled: When tracking ID is removed or invalidated

## 2. User Consent Entity

**Purpose**: Track user consent status for analytics data collection  
**Storage**: Browser localStorage

```typescript
interface UserConsent {
  // Consent Status
  analyticsConsent: boolean;    // User has consented to analytics
  timestamp: number;            // When consent was given/revoked
  version: string;              // Consent policy version
  
  // Consent Details
  ip: boolean;                  // IP address collection consent
  userAgent: boolean;           // User agent collection consent
  demographics: boolean;        // Demographic data consent
}
```

**Validation Rules**:
- `timestamp` must be valid Unix timestamp
- `version` follows semver format (e.g., "1.0.0")
- All boolean flags default to `false` (explicit opt-in required)
- Consent expires after 365 days (requires re-confirmation)

**Storage Key**: `analytics-consent-v1`

## 3. Language Toggle Event Entity

**Purpose**: Track user language preference changes  
**Event Type**: Custom GA4 event

```typescript
interface LanguageToggleEvent {
  // Event Identification
  eventName: 'language_toggle';
  eventCategory: 'user_preference';
  
  // Event Parameters
  previousLanguage: 'en' | 'ko';   // Previous language setting
  newLanguage: 'en' | 'ko';        // New language setting
  timestamp: number;               // Event timestamp
  sessionId: string;               // GA4 session identifier
  
  // Context Information
  pageUrl: string;                 // Page where toggle occurred
  userAgent: string;               // Browser information
}
```

**Validation Rules**:
- `previousLanguage` and `newLanguage` must be different
- Both language values must be supported ('en' or 'ko')
- `timestamp` must be current Unix timestamp
- `pageUrl` must be valid URL within site domain

## 4. PDF Download Event Entity

**Purpose**: Track resume PDF download actions  
**Event Type**: Custom GA4 event

```typescript
interface PDFDownloadEvent {
  // Event Identification
  eventName: 'file_download';
  eventCategory: 'engagement';
  
  // Download Parameters
  fileName: string;                // PDF file name
  fileType: 'pdf';                 // Always 'pdf' for this use case
  language: 'en' | 'ko';           // Language version downloaded
  fileSize: number;                // File size in bytes
  
  // User Context
  timestamp: number;               // Download timestamp
  sessionId: string;               // GA4 session identifier
  pageUrl: string;                 // Page where download initiated
  downloadMethod: 'direct_link' | 'button_click'; // How download was triggered
}
```

**Validation Rules**:
- `fileName` must match expected pattern: `rajephon-resume-{lang}.pdf`
- `language` must match available resume languages
- `fileSize` must be positive integer
- `downloadMethod` must be valid trigger type
- `pageUrl` must be resume page or related page

## 5. Analytics Session Entity

**Purpose**: Track analytics session state and configuration  
**Scope**: Runtime in-memory state

```typescript
interface AnalyticsSession {
  // Session State
  initialized: boolean;            // GA4 scripts loaded
  consentGiven: boolean;          // User has provided consent
  trackingActive: boolean;        // Currently tracking events
  
  // Configuration State
  trackingId: string | null;      // Active tracking ID
  debugMode: boolean;             // Debug mode status
  
  // Session Metadata
  sessionStart: number;           // Session start timestamp
  pageViews: number;              // Page views in session
  events: number;                 // Custom events fired
  lastActivity: number;           // Last activity timestamp
}
```

**Validation Rules**:
- `initialized` can only be `true` if valid tracking ID exists
- `trackingActive` requires both `initialized` and `consentGiven` to be `true`
- `sessionStart` must be before `lastActivity`
- Counters (`pageViews`, `events`) must be non-negative integers

## Entity Relationships

```
AnalyticsConfig (1) ──→ (0..1) AnalyticsSession
    │
    │ (influences)
    ▼
UserConsent (1) ──→ (0..*) LanguageToggleEvent
    │                         │
    │                         ▼
    └──→ (0..*) PDFDownloadEvent
```

**Relationship Rules**:
1. **AnalyticsConfig → AnalyticsSession**: Configuration drives session initialization
2. **UserConsent → Events**: Events only fire when consent is granted
3. **AnalyticsSession → Events**: Events require active tracking session

## Data Flow

### Initialization Flow
1. `AnalyticsConfig` loaded from site configuration
2. `UserConsent` checked from localStorage
3. `AnalyticsSession` initialized if config valid and consent given
4. GA4 scripts loaded and tracking begins

### Event Flow  
1. User action triggers event (language toggle or PDF download)
2. `AnalyticsSession` validates tracking is active
3. Event entity created with required parameters
4. Event sent to GA4 via gtag function
5. Session counters updated

### Consent Flow
1. User provides/revokes consent via UI
2. `UserConsent` entity updated in localStorage
3. `AnalyticsSession` tracking state updated
4. GA4 consent mode updated accordingly

## Privacy Considerations

### Data Minimization
- Only collect data necessary for analytics goals
- No personally identifiable information stored
- Session data expires with browser session

### Consent Management
- Explicit opt-in required for all tracking
- Granular consent options available
- Easy consent withdrawal mechanism

### Data Retention
- Browser localStorage: User controlled
- GA4 data: Follows Google's retention policies
- No server-side data storage required

## Integration Points

### Configuration Integration
- Extends existing `src/lib/config.ts` file
- Maintains compatibility with current configuration pattern
- Environment variable integration for tracking ID

### Component Integration
- Resume page language toggle component
- PDF download links and buttons
- Analytics consent management UI

### Testing Integration
- Mock implementations for all entities
- Test data isolation from production analytics
- Validation testing for all entity rules