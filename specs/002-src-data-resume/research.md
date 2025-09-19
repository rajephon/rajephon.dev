# Research Notes: Korean Resume Translation Feature

## Technical Decisions

### 1. Internationalization Approach
**Decision**: Client-side language switching with React state management  
**Rationale**: 
- Instant switching without page reload improves UX
- Maintains single page URL structure 
- Simpler than Next.js i18n routing for a bilingual site
**Alternatives considered**:
- Next.js i18n with `/en` and `/ko` routes - Rejected due to URL complexity for simple bilingual feature
- Server-side rendering per language - Unnecessary overhead for static content

### 2. Korean Resume Content Storage
**Decision**: Separate markdown file (`resume-ko.md`) alongside existing `resume.md`  
**Rationale**:
- Clear separation of content
- Easy to maintain and update independently
- Consistent with existing markdown-based architecture
**Alternatives considered**:
- Single file with language markers - Would complicate parsing
- JSON/YAML translation files - Less readable for content maintenance

### 3. Language Toggle UI Pattern
**Decision**: Simple text-based toggle button at top of resume page  
**Rationale**:
- Minimal design aligns with existing flat UI
- Clear "EN | KO" or "English | 한국어" text
- Accessible without complex UI components
**Alternatives considered**:
- Flag icons - Can be politically sensitive
- Dropdown menu - Overkill for two languages

### 4. PDF Generation Strategy
**Decision**: Pre-generate both PDF versions during build process  
**Rationale**:
- No runtime generation overhead
- Consistent with current static generation approach
- Both PDFs available immediately
**Alternatives considered**:
- Runtime generation - Would require server infrastructure
- Single multilingual PDF - Poor UX for document sharing

### 5. Korean Font Support
**Decision**: Use system fonts with Korean fallbacks in CSS  
**Rationale**:
- Best performance and compatibility
- Native font rendering quality
- No additional font loading
**Font stack**: `'Pretendard', 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### 6. State Persistence
**Decision**: localStorage for language preference  
**Rationale**:
- Simple implementation
- Persists across sessions
- No backend required
**Alternatives considered**:
- Cookies - Unnecessary for client-only preference
- URL parameter - Complicates sharing

### 7. SEO Considerations
**Decision**: Use `lang` attribute and proper meta tags  
**Rationale**:
- Search engines understand content language
- Proper indexing for both versions
- Accessibility compliance
**Implementation**: Dynamic `lang` attribute on HTML element based on selected language

## Dependencies Analysis

### Existing Dependencies (No changes needed)
- **Next.js**: Already handles static generation
- **React**: State management for language toggle
- **Tailwind CSS**: Styling consistency
- **remark/unified**: Parse Korean markdown same as English
- **Puppeteer**: Generate Korean PDF with font support

### New Requirements
- **Korean translation content**: Professional translation of resume
- **Font configuration**: Ensure Puppeteer includes Korean fonts for PDF

## Integration Points

### 1. Resume Page Component
- Add language state management
- Conditionally load English or Korean content
- Update PDF download link based on language

### 2. Build Process
- Generate both English and Korean PDFs
- Update GitHub Actions to handle dual PDF generation
- Ensure Korean fonts available in CI environment

### 3. Resume Renderer Component
- Accept language prop
- No changes to rendering logic (markdown handles both)
- Ensure proper text direction (LTR for both English and Korean)

## Performance Considerations

### Language Switching
- Both language contents loaded at build time
- Switching is pure client-side state change
- No network requests required
- Target: <10ms switch time

### Bundle Size Impact
- Korean content adds ~15-20KB to page bundle
- Acceptable for improved UX
- Both contents in single page load

### PDF Generation
- Build time increases by ~5-10 seconds for second PDF
- No runtime performance impact
- Both PDFs served as static assets

## Accessibility

### Screen Reader Support
- Proper `lang` attributes for content sections
- Announce language change to screen readers
- Toggle button with clear ARIA labels

### Keyboard Navigation
- Toggle accessible via keyboard
- Focus management on language switch
- Maintain scroll position during toggle

## Testing Strategy

### Unit Tests
- Language toggle component behavior
- localStorage persistence
- PDF URL switching logic

### Integration Tests
- Full resume rendering in both languages
- Language switch preserves page state
- PDF downloads correct version

### E2E Tests
- User flow: Load page → Toggle language → Download PDF
- Persistence: Toggle → Refresh → Check language
- Both PDF files accessible and valid

## Risk Mitigation

### Translation Quality
- Professional translation or native speaker review required
- Maintain consistent terminology between versions
- Regular updates when English version changes

### Font Rendering Issues
- Test PDF generation on CI environment
- Fallback fonts if primary unavailable
- Visual regression testing for PDFs

### Build Complexity
- Document dual PDF generation process
- Clear error messages if one PDF fails
- Independent generation (one failure doesn't block other)

## Implementation Order

1. Create Korean translation markdown file
2. Implement language toggle state management
3. Update Resume page component for bilingual support
4. Modify PDF generation for both languages
5. Update GitHub Actions workflow
6. Add comprehensive tests
7. Document maintenance process

## Resolved Clarifications

All technical aspects are clear based on:
- Existing Next.js architecture
- Current PDF generation setup with Puppeteer
- Established markdown-based content system
- Flat, minimal UI design pattern

No remaining NEEDS CLARIFICATION items.