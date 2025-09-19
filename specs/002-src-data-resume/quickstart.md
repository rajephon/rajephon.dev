# Quickstart: Korean Resume Translation Feature

## Overview
This guide walks through setting up and testing the bilingual resume feature that allows visitors to toggle between English and Korean versions.

## Prerequisites
- Node.js 18+ and pnpm installed
- Existing Next.js project with resume page
- Korean translation of resume content ready

## Quick Setup (5 minutes)

### 1. Create Korean Resume Content
```bash
# Copy English resume as template
cp src/data/resume.md src/data/resume-ko.md

# Edit with Korean translations
# Update all content including frontmatter
```

### 2. Install Dependencies (if needed)
```bash
# Project already has required dependencies
pnpm install
```

### 3. Run Development Server
```bash
pnpm run dev
# Visit http://localhost:3000/resume
```

## Feature Verification Checklist

### ✅ Basic Functionality
- [ ] Resume page loads with English content by default
- [ ] Language toggle button visible at top of page
- [ ] Clicking toggle switches to Korean content
- [ ] All sections properly translated in Korean version
- [ ] PDF download link updates based on selected language

### ✅ Content Validation
- [ ] Korean resume frontmatter has all required fields
- [ ] Korean name and title display correctly
- [ ] Korean text renders with proper fonts
- [ ] No encoding issues in Korean content

### ✅ User Experience
- [ ] Language switch happens instantly (<10ms)
- [ ] No page reload during language toggle
- [ ] Scroll position maintained during toggle
- [ ] Language preference saved to browser

### ✅ PDF Generation
```bash
# Generate both PDFs
pnpm run generate-pdf

# Verify both files exist
ls public/resume.pdf public/resume-ko.pdf
```

## Testing the Implementation

### Manual Testing Flow
1. **Load Resume Page**
   - Navigate to `/resume`
   - Verify English content displays

2. **Test Language Toggle**
   - Click language toggle (EN | KO)
   - Verify content switches to Korean
   - Check all sections translated

3. **Test PDF Downloads**
   - In English mode, click PDF link
   - Verify `resume.pdf` downloads
   - Switch to Korean, click PDF link
   - Verify `resume-ko.pdf` downloads

4. **Test Persistence**
   - Set language to Korean
   - Refresh the page
   - Verify Korean still selected
   - Clear browser storage
   - Refresh and verify English default

### Automated Testing
```bash
# Run unit tests
pnpm test

# Run integration tests
pnpm test:integration

# Run E2E tests
pnpm test:e2e
```

## Common Issues & Solutions

### Issue: Korean text shows as boxes/questions marks
**Solution**: Ensure Korean fonts in CSS:
```css
font-family: 'Pretendard', 'Noto Sans KR', -apple-system, sans-serif;
```

### Issue: PDF generation fails for Korean
**Solution**: Install Korean fonts in CI environment:
```yaml
- name: Install Korean fonts
  run: |
    sudo apt-get update
    sudo apt-get install -y fonts-noto-cjk
```

### Issue: Language toggle not persisting
**Solution**: Check localStorage is enabled:
```javascript
// Should save to 'resume-language-preference' key
localStorage.setItem('resume-language-preference', 'ko');
```

## Development Workflow

### Adding/Updating Translations
1. Edit `src/data/resume-ko.md`
2. Save changes
3. Page hot-reloads with updates
4. Regenerate Korean PDF if needed

### Modifying Toggle Behavior
1. Edit language toggle component
2. Update toggle logic in resume page
3. Test both directions (EN→KO, KO→EN)

### Updating PDF Generation
1. Modify PDF generation script
2. Ensure Korean fonts loaded
3. Test both PDF outputs
4. Update GitHub Actions workflow

## Deployment Checklist

### Pre-deployment
- [ ] Both resume files committed (`resume.md`, `resume-ko.md`)
- [ ] Language toggle component tested
- [ ] Both PDFs generated successfully
- [ ] All tests passing

### GitHub Actions
- [ ] Workflow updated for dual PDF generation
- [ ] Korean fonts installed in CI
- [ ] Both PDFs included in deployment

### Post-deployment
- [ ] Visit live site and test toggle
- [ ] Download both PDF versions
- [ ] Verify persistence works
- [ ] Check mobile responsiveness

## Quick Commands Reference

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Build for production
pnpm start                  # Start production server

# PDF Generation
pnpm generate-pdf           # Generate both PDFs
pnpm generate-pdf:en        # English PDF only
pnpm generate-pdf:ko        # Korean PDF only

# Testing
pnpm test                   # All tests
pnpm test:unit             # Unit tests only
pnpm test:e2e              # E2E tests only

# Deployment
pnpm deploy                # Deploy to GitHub Pages
```

## Success Criteria

The feature is considered successfully implemented when:

1. ✅ Visitors can toggle between English and Korean resume versions
2. ✅ Language preference persists across page refreshes
3. ✅ Both PDF versions are generated and downloadable
4. ✅ Korean text displays correctly with proper fonts
5. ✅ No performance degradation (toggle < 10ms)
6. ✅ All automated tests pass
7. ✅ Feature works on mobile devices
8. ✅ SEO maintained for both language versions

## Next Steps

After successful implementation:
1. Monitor user engagement with language toggle
2. Consider adding more languages if needed
3. Optimize PDF file sizes if too large
4. Add analytics to track language preferences
5. Update regularly when resume content changes

## Support

For issues or questions:
- Check existing components in `src/components/`
- Review resume parsing in `lib/markdown.ts`
- Consult PDF generation scripts in `scripts/`
- Reference GitHub Actions in `.github/workflows/`