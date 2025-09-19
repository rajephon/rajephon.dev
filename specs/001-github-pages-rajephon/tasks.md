# Tasks: Homepage Design Simplification

**Input**: Design documents from `/specs/001-github-pages-rajephon/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md

## Execution Summary

Based on analysis of the design documents, this feature involves UI simplification of an existing Next.js website:
- **Tech Stack**: TypeScript 5.x, Next.js 15+, React, Tailwind CSS
- **Scope**: Remove navigation, simplify homepage, flatten resume page design, convert PDF button to link  
- **Components**: Layout, Homepage (index.tsx), Resume page, PDFExportButton
- **Approach**: Modify existing components rather than creating new architecture

## Phase 3.1: Setup & Preparation

- [ ] **T001** [P] Update component interface contracts in `/Users/chanwoo/Documents/resume/rajephon-dev/src/lib/component-interfaces.ts` to add showNavigation prop and PDFLinkProps

- [ ] **T002** [P] Create test contracts for simplified components in `/Users/chanwoo/Documents/resume/rajephon-dev/src/__tests__/contracts/simplified-interfaces.test.ts`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] **T003** [P] Test Layout component navigation hiding in `/Users/chanwoo/Documents/resume/rajephon-dev/src/__tests__/components/Layout.test.tsx` - update existing tests to verify showNavigation prop behavior

- [ ] **T004** [P] Test homepage simplification in `/Users/chanwoo/Documents/resume/rajephon-dev/src/__tests__/integration/homepage-simplification.test.tsx` - verify text-only content and minimal styling

- [ ] **T005** [P] Test resume page flat design in `/Users/chanwoo/Documents/resume/rajephon-dev/src/__tests__/integration/resume-flat-design.test.tsx` - verify no shadows/backgrounds

- [ ] **T006** [P] Test PDF link conversion in `/Users/chanwoo/Documents/resume/rajephon-dev/src/__tests__/components/PDFExportButton.test.tsx` - update existing tests for link functionality

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Component Modifications

- [ ] **T007** Modify Layout component to hide navigation in `/Users/chanwoo/Documents/resume/rajephon-dev/src/components/Layout.tsx` - add showNavigation prop with default false, conditionally render navigation

- [ ] **T008** Simplify homepage to text-only content in `/Users/chanwoo/Documents/resume/rajephon-dev/src/pages/index.tsx` - remove decorative elements, keep essential text and links

- [ ] **T009** Remove visual elements from resume page in `/Users/chanwoo/Documents/resume/rajephon-dev/src/pages/resume.tsx` - flatten design, remove containers with shadows/backgrounds

- [ ] **T010** Convert PDF button to subtle link in `/Users/chanwoo/Documents/resume/rajephon-dev/src/components/PDFExportButton.tsx` - replace button element with styled anchor tag

### Styling Updates

- [ ] **T011** [P] Update global styles to remove shadows/gradients in `/Users/chanwoo/Documents/resume/rajephon-dev/src/styles/globals.css` - remove or comment out decorative CSS classes

- [ ] **T012** [P] Simplify resume-specific styles in `/Users/chanwoo/Documents/resume/rajephon-dev/src/styles/resume-base.css` - remove box-shadow, background styling

- [ ] **T013** [P] Update print styles for flat design in `/Users/chanwoo/Documents/resume/rajephon-dev/src/styles/print.css` - ensure print compatibility maintained

## Phase 3.4: Integration & Validation

- [ ] **T014** Test responsive design across device sizes - manual testing on mobile, tablet, desktop

- [ ] **T015** Validate PDF generation still works after component changes - run generate-pdf script and verify output

- [ ] **T016** Check accessibility compliance with hidden navigation - verify keyboard navigation still works

- [ ] **T017** Verify print functionality remains intact - test print preview and actual printing

## Phase 3.5: Polish & Optimization

- [ ] **T018** [P] Update component documentation in `/Users/chanwoo/Documents/resume/rajephon-dev/README.md` - document new simplified design approach

- [ ] **T019** [P] Remove unused CSS classes from stylesheets - clean up shadow/gradient classes no longer used

- [ ] **T020** [P] Optimize CSS bundle size by removing unused Tailwind classes - configure purge settings if needed

- [ ] **T021** Run lighthouse audit to confirm performance improvements - verify faster load times with simplified design

- [ ] **T022** Create before/after screenshots for documentation - capture design changes for reference

## Dependencies

**Strict Ordering**:
1. Setup tasks (T001-T002) must complete first
2. All test tasks (T003-T006) before any implementation tasks
3. Core implementation (T007-T010) before styling updates (T011-T013)  
4. Integration testing (T014-T017) before polish phase
5. T015 (PDF test) depends on T010 (PDF component changes)
6. T016 (accessibility) depends on T007 (Layout changes)

**Parallel Execution Groups**:
- T001-T002 (different files, setup phase)
- T003-T006 (different test files, no shared dependencies)
- T011-T013 (different CSS files)
- T018-T020 (different documentation/optimization tasks)

## Parallel Execution Examples

### Tests Phase (T003-T006)
```bash
# Launch all test tasks together:
Task: "Test Layout component navigation hiding in src/__tests__/components/Layout.test.tsx"
Task: "Test homepage simplification in src/__tests__/integration/homepage-simplification.test.tsx"  
Task: "Test resume page flat design in src/__tests__/integration/resume-flat-design.test.tsx"
Task: "Test PDF link conversion in src/__tests__/components/PDFExportButton.test.tsx"
```

### Styling Updates (T011-T013)
```bash
# Launch styling tasks together:
Task: "Update global styles to remove shadows/gradients in src/styles/globals.css"
Task: "Simplify resume-specific styles in src/styles/resume-base.css"
Task: "Update print styles for flat design in src/styles/print.css"
```

## Task Details

### T001: Update Component Interfaces
**Objective**: Add showNavigation prop to LayoutProps, create PDFLinkProps interface
**Files**: `src/lib/component-interfaces.ts`
**Expected Changes**: 
- Add `showNavigation?: boolean` to LayoutProps (default false)
- Replace PDFExportButtonProps with PDFLinkProps
- Update interface documentation for simplified design

### T003: Layout Navigation Test  
**Objective**: Test that navigation is hidden by default and can be conditionally shown
**Files**: `src/__tests__/components/Layout.test.tsx` 
**Expected Behavior**: 
- Navigation hidden when showNavigation=false or undefined
- Navigation shown when showNavigation=true
- SEO meta tags preserved regardless of navigation state

### T007: Modify Layout Component
**Objective**: Hide navigation by default, add showNavigation prop
**Files**: `src/components/Layout.tsx`
**Expected Changes**:
- Add showNavigation prop with default false
- Conditionally render navigation elements
- Maintain all existing SEO and head functionality

### T008: Simplify Homepage
**Objective**: Convert homepage to minimal, text-only content
**Files**: `src/pages/index.tsx`
**Expected Changes**:
- Remove decorative elements (gradients, shadows, cards)
- Keep only text content and essential links
- Target terminal/plain-text aesthetic
- Maintain responsive layout

### T010: PDF Button to Link
**Objective**: Convert prominent PDF button to subtle text link
**Files**: `src/components/PDFExportButton.tsx`
**Expected Changes**:
- Replace button element with anchor tag
- Remove button styling (backgrounds, borders, padding)
- Add subtle text link styling (hover underline)
- Maintain download functionality

## Quality Gates

### Completion Criteria
- [ ] All navigation elements hidden on both homepage and resume page
- [ ] Homepage appears minimal/text-focused (like terminal interface)
- [ ] Resume page has flat design (no shadows, backgrounds, depth effects)
- [ ] PDF download works via subtle text link
- [ ] All existing functionality preserved (routing, PDF generation, SEO)
- [ ] Responsive design maintained across device sizes
- [ ] Print styles unaffected
- [ ] Lighthouse performance score improved or maintained

### Testing Validation
- [ ] All new tests pass
- [ ] No existing tests broken
- [ ] Manual testing scenarios from quickstart.md completed
- [ ] Cross-browser compatibility verified
- [ ] Mobile responsiveness confirmed

## Notes
- **[P] tasks** = different files, no dependencies, can run in parallel
- **Non-[P] tasks** = sequential execution required (shared files or dependencies)
- Verify tests fail before implementing (TDD approach)
- Commit after each task completion
- Focus on preserving functionality while simplifying appearance
- Target aesthetic: terminal/academic paper/plain text document

## Task Generation Rules Applied

1. **From Contracts**: Updated existing component interfaces for simplified design
2. **From Data Model**: Component state changes for navigation hiding and flat design
3. **From User Stories**: Specific requirements for navigation removal, homepage simplification, resume flattening, PDF link conversion
4. **Ordering Applied**: Setup → Tests → Implementation → Integration → Polish

## Validation Checklist

- [x] All modified components have corresponding tests
- [x] All implementation tasks come after test tasks (TDD)
- [x] Parallel tasks are truly independent (different files)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Design simplification requirements addressed
- [x] Existing functionality preservation ensured