# Quickstart: Google Analytics Integration

**Feature**: Google Analytics Integration  
**Target Audience**: Developers implementing the feature  
**Prerequisites**: Next.js 15+ project, TypeScript, existing site configuration

## Overview

This quickstart guide provides step-by-step instructions to implement Google Analytics 4 tracking with optional consent management for the personal website. The implementation supports conditional loading, event tracking, and privacy compliance.

## Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
# Add Google Analytics integration
pnpm add @next/third-parties

# Development dependencies (if not already installed)
pnpm add -D @types/gtag
```

### 2. Environment Configuration

```bash
# Add to .env.local
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Your GA4 measurement ID
```

### 3. Extend Site Configuration

```typescript
// src/lib/config.ts (extend existing file)
export interface AnalyticsConfig {
  trackingId?: string;
  enabled: boolean;
  respectDNT: boolean;
  consentRequired: boolean;
  enableInDevelopment: boolean;
  debugMode: boolean;
}

// Add to existing siteConfig
export const siteConfig = {
  // ... existing config
  analytics: {
    trackingId: process.env.NEXT_PUBLIC_GA_ID,
    enabled: !!process.env.NEXT_PUBLIC_GA_ID,
    respectDNT: true,
    consentRequired: true,
    enableInDevelopment: false,
    debugMode: process.env.NODE_ENV === 'development',
  },
};
```

### 4. Add Analytics Component

```typescript
// src/components/Analytics.tsx
'use client'
import { GoogleAnalytics } from '@next/third-parties/google'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'

export default function Analytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('analytics-consent')
    setHasConsent(consent === 'true')
  }, [])

  if (!siteConfig.analytics.enabled || !hasConsent) {
    return null
  }

  return <GoogleAnalytics gaId={siteConfig.analytics.trackingId!} />
}
```

### 5. Integrate in App

```typescript
// pages/_app.tsx (or app/layout.tsx for App Router)
import Analytics from '@/components/Analytics'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
```

## Complete Implementation (30 minutes)

### Step 1: Analytics Utilities

```typescript
// src/lib/analytics.ts
declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export const trackLanguageToggle = (previousLang: string, newLang: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'language_toggle', {
      event_category: 'user_preference',
      previous_language: previousLang,
      new_language: newLang,
    })
  }
}

export const trackPDFDownload = (fileName: string, language: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'file_download', {
      event_category: 'engagement',
      file_name: fileName,
      file_type: 'pdf',
      language: language,
    })
  }
}
```

### Step 2: Consent Management

```typescript
// src/lib/consent.ts
export interface UserConsent {
  analyticsConsent: boolean
  timestamp: number
  version: string
}

export const getConsent = (): UserConsent | null => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('analytics-consent-v1')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export const setConsent = (consent: boolean): void => {
  if (typeof window === 'undefined') return
  
  const consentData: UserConsent = {
    analyticsConsent: consent,
    timestamp: Date.now(),
    version: '1.0.0',
  }
  
  localStorage.setItem('analytics-consent-v1', JSON.stringify(consentData))
  
  // Update Google Consent Mode
  if (window.gtag) {
    window.gtag('consent', 'update', {
      analytics_storage: consent ? 'granted' : 'denied',
    })
  }
}
```

### Step 3: Analytics Hook

```typescript
// src/hooks/useAnalytics.ts
import { useEffect, useState } from 'react'
import { siteConfig } from '@/lib/config'
import { getConsent, setConsent } from '@/lib/consent'
import { trackLanguageToggle, trackPDFDownload } from '@/lib/analytics'

export const useAnalytics = () => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const consent = getConsent()
    const enabled = siteConfig.analytics.enabled && 
                    (consent?.analyticsConsent || false)
    
    setHasConsent(consent?.analyticsConsent || false)
    setIsEnabled(enabled)
  }, [])

  const grantConsent = () => {
    setConsent(true)
    setHasConsent(true)
    setIsEnabled(siteConfig.analytics.enabled)
  }

  const revokeConsent = () => {
    setConsent(false)
    setHasConsent(false)
    setIsEnabled(false)
  }

  return {
    isEnabled,
    hasConsent,
    grantConsent,
    revokeConsent,
    trackLanguageToggle,
    trackPDFDownload,
  }
}
```

### Step 4: Update Resume Page

```typescript
// pages/resume.tsx (add to existing component)
import { useAnalytics } from '@/hooks/useAnalytics'

export default function Resume() {
  const { trackLanguageToggle, trackPDFDownload } = useAnalytics()
  
  const handleLanguageToggle = (newLang: 'en' | 'ko') => {
    const previousLang = currentLang // Get from your state
    trackLanguageToggle(previousLang, newLang)
    // Your existing language toggle logic
  }
  
  const handlePDFDownload = (language: 'en' | 'ko') => {
    const fileName = `rajephon-resume-${language}.pdf`
    trackPDFDownload(fileName, language)
    // Your existing download logic
  }
  
  // Rest of component...
}
```

## Testing the Implementation

### 1. Development Testing

```bash
# Start development server
pnpm dev

# Check browser console for:
# - No analytics scripts loaded (no consent)
# - Analytics scripts loaded after consent
# - Event tracking in console
```

### 2. Production Testing

```bash
# Build and test
pnpm build
pnpm start

# Use Google Analytics DebugView:
# - Enable debug mode in config
# - Check real-time events in GA4
```

### 3. Privacy Testing

```typescript
// Test consent management
localStorage.removeItem('analytics-consent-v1') // Should disable analytics
localStorage.setItem('analytics-consent-v1', JSON.stringify({
  analyticsConsent: true,
  timestamp: Date.now(),
  version: '1.0.0'
})) // Should enable analytics
```

## Validation Checklist

### Functional Requirements Validation

- [ ] **FR-001**: Analytics ID configurable in `src/lib/config.ts`
- [ ] **FR-002**: Scripts load only when tracking ID present
- [ ] **FR-003**: Page views tracked automatically
- [ ] **FR-004**: Invalid tracking IDs handled gracefully
- [ ] **FR-005**: No tracking when analytics disabled
- [ ] **FR-006**: Enable/disable via configuration
- [ ] **FR-007**: GA4 integration working
- [ ] **FR-008**: Language toggle events tracked
- [ ] **FR-009**: PDF download events tracked
- [ ] **FR-010**: Language included in toggle events
- [ ] **FR-011**: Language version in download events

### User Scenarios Validation

1. **No Tracking ID Configured**:
   ```bash
   # Remove NEXT_PUBLIC_GA_ID from .env.local
   # Verify: No analytics scripts in page source
   ```

2. **Valid Tracking ID + Consent**:
   ```bash
   # Add tracking ID and grant consent
   # Verify: Page views appear in GA4 real-time
   ```

3. **Language Toggle Tracking**:
   ```javascript
   // Switch language and check GA4 DebugView for:
   // Event: language_toggle
   // Parameters: previous_language, new_language
   ```

4. **PDF Download Tracking**:
   ```javascript
   // Download resume and check GA4 DebugView for:
   // Event: file_download
   // Parameters: file_name, language, file_type
   ```

### Privacy Compliance Validation

- [ ] No scripts loaded without consent
- [ ] Consent persisted in localStorage
- [ ] Google Consent Mode configured correctly
- [ ] Do Not Track header respected (if configured)
- [ ] Easy consent withdrawal

## Troubleshooting

### Common Issues

1. **Analytics not loading**:
   - Check `NEXT_PUBLIC_GA_ID` environment variable
   - Verify consent is granted in localStorage
   - Check browser console for errors

2. **Events not tracking**:
   - Verify `window.gtag` is available
   - Check GA4 property configuration
   - Use GA4 DebugView for real-time validation

3. **Development vs Production**:
   - Analytics disabled in development by default
   - Set `enableInDevelopment: true` for dev testing
   - Use different GA4 properties for dev/prod

### Debug Commands

```bash
# Check current consent
localStorage.getItem('analytics-consent-v1')

# Force enable analytics (dev only)
localStorage.setItem('analytics-consent-v1', JSON.stringify({
  analyticsConsent: true,
  timestamp: Date.now(),
  version: '1.0.0'
}))

# Check if gtag is loaded
typeof window.gtag !== 'undefined'
```

## Next Steps

1. **Deploy to GitHub Pages**: Configure `NEXT_PUBLIC_GA_ID` in GitHub Actions secrets
2. **Monitor Analytics**: Set up GA4 reports for language preferences and download patterns
3. **Privacy Banner**: Implement consent UI for better user experience
4. **Performance**: Monitor impact on Core Web Vitals

## Support

- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **Next.js Third Parties**: https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries
- **Consent Mode**: https://developers.google.com/tag-platform/security/concepts/consent-mode