# Phase 0: Research Findings

**Feature**: Homepage Design Simplification  
**Date**: 2025-09-18

## Research Tasks Completed

### 1. Current Architecture Analysis

**Decision**: Analyze existing Next.js structure and components that need modification  
**Rationale**: Need to understand current implementation before making targeted changes  
**Alternatives considered**: Complete redesign vs targeted modifications - chose modifications for efficiency

**Current Structure Findings**:
- Layout component likely contains navigation bar structure
- Main pages: index.tsx (homepage), resume.tsx (resume page) 
- Styling via Tailwind CSS classes and custom CSS files
- PDF export functionality in PDFExportButton component
- Resume content rendered from markdown via ResumeRenderer

### 2. Navigation Removal Strategy

**Decision**: Remove or hide navigation elements in Layout component  
**Rationale**: User specifically requested removal of top menu bar for cleaner look  
**Alternatives considered**: 
- Conditional navigation based on page
- Minimal navigation vs complete removal
- Chose complete removal per user requirements

**Implementation Approach**:
- Locate navigation in Layout.tsx component
- Either conditionally render or remove entirely
- Ensure routing still works without navigation
- Consider adding subtle page indicators if needed

### 3. Main Page Simplification

**Decision**: Strip down homepage to minimal text-based content  
**Rationale**: User wants "거의 텍스트베이스 수준으로" (almost text-based level) simplicity  
**Alternatives considered**: 
- Keep some visual elements vs complete text focus
- Chose minimal approach as specifically requested

**Text-Based Design Principles**:
- Remove decorative elements, gradients, backgrounds
- Focus on typography hierarchy
- Use minimal spacing and clean layouts
- Preserve semantic HTML structure
- Remove or minimize images and graphics

### 4. Resume Page Visual Cleanup

**Decision**: Remove shadows, background contrasts, and visual separators  
**Rationale**: User wants clean, flat design without visual depth effects  
**Alternatives considered**: 
- Subtle shadows vs complete removal
- Different background colors vs flat design
- Chose flat design per requirements

**Flat Design Implementation**:
- Remove box-shadow properties from resume container
- Eliminate background color differences
- Remove gradient effects
- Use border: none or transparent borders
- Maintain readability through typography alone

### 5. PDF Download Link Transformation

**Decision**: Convert prominent button to subtle text link with natural placement  
**Rationale**: User wants reduced visual prominence and better content flow integration  
**Alternatives considered**: 
- Icon-only button vs text link
- Bottom placement vs inline placement  
- Different button styles vs link format
- Chose text link with natural placement as requested

**Link Design Strategy**:
- Simple text link styling (underline on hover)
- Natural placement within content flow
- Reduced visual weight (smaller font, subtle color)
- Remove button backgrounds, borders, padding
- Consider placement at end of content or in sidebar

## Technical Implementation Strategy

### Component Modifications Required:

1. **Layout.tsx**: Remove/hide navigation components
2. **index.tsx**: Simplify homepage to text-only content
3. **resume.tsx**: Remove visual styling elements  
4. **PDFExportButton.tsx**: Convert to simple link component
5. **CSS files**: Remove shadow/background styles

### CSS/Tailwind Changes:

**Remove/Replace Classes**:
- `shadow-*` → Remove shadows
- `bg-gradient-*` → Remove gradients
- `border-*` → Simplify or remove borders  
- `rounded-*` → Consider flat corners
- Button classes → Link classes

**Simplify Typography**:
- Reduce font size variations
- Minimize color palette
- Focus on font-weight for hierarchy
- Use simple margin/padding values

### Testing Considerations:

- Verify PDF generation still works after UI changes
- Check responsive design on simplified layout
- Validate print styles for resume page
- Test accessibility with removed navigation
- Ensure semantic HTML remains intact

## Risk Assessment

**Low Risk Changes**:
- UI simplification doesn't affect core functionality
- Existing markdown processing and PDF generation unchanged
- Static site generation process unaffected

**Potential Issues**:
- Navigation removal may affect user experience
- Over-simplification could reduce visual appeal
- PDF styling might need adjustment

**Mitigation Strategy**:
- Incremental changes with testing at each step
- Preserve essential functionality 
- Keep changes reversible through version control
- Test print functionality after each change

## Design Philosophy

**Minimalist Principles**:
- Content over decoration
- Function over form
- Readability over visual impact
- Simple over complex
- Text-based hierarchy over visual cues

**Inspiration**: Terminal-based interfaces, academic papers, plain text documents