# Quickstart Guide: Homepage Design Simplification

**Feature**: Homepage Design Simplification  
**Date**: 2025-09-18

## Overview

This guide covers implementing simplified, text-focused design changes to the existing GitHub Pages personal website. The goal is to create a minimal, almost terminal-like aesthetic.

## Changes Summary

1. Remove/hide top navigation bar
2. Simplify homepage to text-only content
3. Remove shadows/backgrounds from resume page
4. Convert PDF button to subtle link

## Implementation Steps

### 1. Remove Navigation Bar

**File**: `src/components/Layout.tsx`

```typescript
// Add showNavigation prop with default false
interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean; // Default: false
}

// Conditionally render navigation
{showNavigation && <Navigation />}
```

**Testing**: Visit homepage and resume page - navigation should be hidden

### 2. Simplify Homepage

**File**: `src/pages/index.tsx`

Remove decorative elements:
- Background gradients
- Card components with shadows
- Complex layouts
- Image elements (if any)

Keep only:
- Simple text content
- Basic typography
- Essential links

**Target Style**: Terminal/plain text aesthetic

### 3. Flatten Resume Page Design

**File**: `src/pages/resume.tsx` and styling files

Remove:
```css
/* Remove these classes/properties */
.shadow-lg
.shadow-md  
.bg-gradient-*
.border-2
.rounded-lg
```

Replace with:
```css
/* Flat design approach */
.border-none
.bg-white (or transparent)
.shadow-none
```

**Testing**: Resume should appear flat against page background

### 4. Convert PDF Button to Link

**File**: `src/components/PDFExportButton.tsx`

Transform from:
```jsx
<button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded shadow">
  Download PDF
</button>
```

To:
```jsx
<a href="/resume.pdf" className="text-blue-600 hover:underline text-sm">
  PDF version
</a>
```

**Placement**: Integrate naturally within content, avoid prominent positioning

## Development Workflow

### Local Testing

```bash
# Start development server
pnpm run dev

# Check changes at:
# http://localhost:3000 (homepage)
# http://localhost:3000/resume (resume page)
```

### Validation Checklist

- [ ] Navigation bar is hidden on all pages
- [ ] Homepage looks minimal/text-focused
- [ ] Resume page has no shadows or backgrounds
- [ ] PDF link is subtle and naturally placed
- [ ] All functionality still works (PDF download, routing)
- [ ] Responsive design maintained
- [ ] Print styles unaffected

### CSS Class Audit

Remove these Tailwind classes:
```
shadow-sm, shadow-md, shadow-lg, shadow-xl
bg-gradient-to-*, bg-gradient-from-*, bg-gradient-via-*, bg-gradient-to-*
border-2, border-4, rounded-lg, rounded-xl
hover:transform, hover:scale-*, transition-all
```

Keep these minimal classes:
```
text-*, font-*, leading-*, tracking-*
mb-*, mt-*, px-*, py-* (minimal spacing)
block, inline, flex (basic layout)
```

## Design Philosophy

### Minimalist Principles

1. **Content over decoration**: Focus on readable text
2. **Function over form**: Prioritize usability  
3. **Flat over dimensional**: No shadows, gradients, 3D effects
4. **Simple over complex**: Reduce visual complexity
5. **Text-based hierarchy**: Use typography for structure

### Inspiration

- Terminal interfaces (green text on black)
- Academic papers (minimal formatting)
- Plain text documents
- Early web design (HTML-only aesthetic)

## Quality Assurance

### Before/After Comparison

**Before** (Current Design):
- Navigation bar with multiple menu items
- Homepage with cards, shadows, gradients
- Resume in container with background/shadow
- Prominent blue PDF download button

**After** (Simplified Design):
- No visible navigation
- Homepage with plain text and simple links
- Resume displayed flat against page
- Subtle text link for PDF download

### Testing Scenarios

1. **Homepage Load**: Should appear almost like a plain text document
2. **Resume Page**: Should look like printed resume on white paper
3. **PDF Download**: Link should be discoverable but not dominant
4. **Mobile View**: Simplified design should work well on small screens
5. **Print Test**: Resume should print cleanly without design artifacts

### Performance Impact

**Expected Improvements**:
- Reduced CSS payload (fewer utility classes)
- Faster rendering (less complex layouts)
- Better print performance (simpler styles)

**No Impact On**:
- Static site generation
- PDF generation process
- SEO functionality
- Core site features

## Rollback Plan

If changes need to be reverted:

1. Git revert commits for design changes
2. Restore original component files
3. Re-add navigation rendering
4. Restore button component styling
5. Test all functionality works as before

## Next Steps

After implementing simplification:

1. Test across different browsers/devices
2. Validate print functionality
3. Check accessibility (contrast, navigation)
4. Consider adding subtle hover effects for links
5. Optimize font loading for better performance
6. Document final design decisions for future reference