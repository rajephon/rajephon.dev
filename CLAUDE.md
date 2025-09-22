# Claude Context: GitHub Pages Personal Site

## Project Overview
Personal website and resume hosted on GitHub Pages at `rajephon.dev` with markdown-to-HTML rendering and PDF export capabilities.

## Current Technology Stack
- **Language/Version**: TypeScript 5.x with Next.js 15+
- **Primary Dependencies**: Next.js, React, Tailwind CSS, remark/unified, Puppeteer, @next/third-parties
- **Storage**: Static files (markdown resume, generated assets), localStorage for user preferences
- **Project Type**: web (static site generation)
- **Testing**: Jest + React Testing Library, Playwright (E2E)
- **Target Platform**: GitHub Pages with custom domain

## Recent Changes
1. Design simplification - converted to minimal, text-focused UI
2. **COMPLETE**: Korean Resume Translation Feature (002-src-data-resume)
   - Bilingual resume support (English/Korean)
   - Language toggle component for instant switching
   - Separate PDF generation for each language
   - localStorage persistence for language preference
3. **IN PROGRESS**: Google Analytics Integration (003-google-analytics-src)
   - Optional GA4 tracking with privacy-first approach
   - Conditional script loading based on configuration
   - Language toggle and PDF download event tracking
   - GDPR-compliant consent management

## Key File Locations
- Resume content: `src/data/resume.md` (English), `src/data/resume-ko.md` (Korean)
- Components: `src/components/`
- Pages: `pages/resume.tsx`
- Configuration: `src/lib/config.ts`
- Analytics: `src/lib/analytics.ts`, `src/hooks/useAnalytics.ts`
- Specifications: `specs/002-src-data-resume/`, `specs/003-google-analytics-src/`

## Development Commands
```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run deploy       # Deploy to GitHub Pages
pnpm run generate-pdf # Generate both English and Korean resume PDFs
pnpm run test         # Run tests
```

## Architecture Notes
- Static site generation with Next.js export
- Bilingual markdown resume processed at build time (EN/KO)
- Dual PDF generation via Puppeteer in GitHub Actions
- Tailwind CSS for styling with print optimizations
- GitHub Pages hosting with custom domain support
- Client-side language switching with localStorage persistence

## Current Phase
Google Analytics Integration Feature - Plan complete (Phase 0-1 done).

## Next Steps
Run `/tasks` command to generate detailed implementation tasks for the Google Analytics feature.