# Tasks: Korean Resume Translation with Language Toggle

**Input**: Design documents from `/specs/002-src-data-resume/`
**Prerequisites**: plan.md (✓), research.md (✓), data-model.md (✓), contracts/ (✓)

## Execution Flow (main)
```
1. Load plan.md from feature directory ✓
   → Tech stack: TypeScript, Next.js, React, Tailwind CSS, Puppeteer
   → Structure: Next.js web application with existing structure
2. Load optional design documents: ✓
   → data-model.md: 5 entities (ResumeContent, LanguagePreference, etc.)
   → contracts/: 3 contract files → contract test tasks
   → research.md: Technical decisions → setup tasks
3. Generate tasks by category:
   → Content: Korean translation, dual markdown files
   → Components: Language toggle, bilingual support
   → Integration: PDF generation, page updates
   → Tests: Component, integration, E2E
   → Polish: Performance, documentation
4. Apply task rules:
   → Different components = mark [P] for parallel
   → Same files = sequential (no [P])
   → Tests alongside implementation (TDD)
5. Number tasks sequentially (T001, T002...) ✓
6. Generate dependency graph ✓
7. Create parallel execution examples ✓
8. Validate task completeness: ✓
   → All contracts have tests? ✓
   → All entities have implementations? ✓
   → All user stories covered? ✓
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Next.js project**: Root structure with `pages/`, `src/`, existing file paths
- **Components**: `src/components/`
- **Data**: `src/data/`
- **Tests**: `__tests__/` or `*.test.tsx` files co-located

## Phase 3.1: Content Creation
- [ ] T001 Create Korean resume markdown file `src/data/resume-ko.md` with full translation
- [ ] T002 [P] Update resume parsing to handle multiple languages in `src/lib/markdown.ts`
- [ ] T003 [P] Add Korean font configuration to `tailwind.config.js`

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T004 [P] Language toggle contract test in `src/components/__tests__/LanguageToggle.test.tsx`
- [ ] T005 [P] Resume content service contract test in `src/lib/__tests__/resume-content.test.ts`
- [ ] T006 [P] Bilingual resume page integration test in `pages/__tests__/resume.test.tsx`
- [ ] T007 [P] E2E language toggle test in `e2e/language-toggle.spec.ts`

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T008 [P] Create language toggle hook in `src/hooks/useLanguageToggle.ts`
- [ ] T009 [P] Create LanguageToggle component in `src/components/LanguageToggle.tsx`
- [ ] T010 Update ResumeRenderer component for language support in `src/components/ResumeRenderer.tsx`
- [ ] T011 Update Resume page for bilingual content in `pages/resume.tsx`
- [ ] T012 Update getStaticProps to load both language versions in `pages/resume.tsx`

## Phase 3.4: PDF Generation
- [ ] T013 Update PDF generation script for Korean support in `scripts/generate-pdf.js`
- [ ] T014 Add Korean fonts to PDF generation environment
- [ ] T015 Update GitHub Actions workflow in `.github/workflows/deploy.yml`
- [ ] T016 [P] Generate both PDF files (`public/resume.pdf`, `public/resume-ko.pdf`)

## Phase 3.5: Integration & Features
- [ ] T017 Add language persistence to localStorage in `src/hooks/useLanguageToggle.ts`
- [ ] T018 Update SEO meta tags for language switching in `pages/resume.tsx`
- [ ] T019 [P] Add proper Korean typography styles to `src/styles/globals.css`
- [ ] T020 [P] Update PDF download links based on selected language

## Phase 3.6: Polish & Validation
- [ ] T021 [P] Performance test for language toggle (<10ms) in `e2e/performance.spec.ts`
- [ ] T022 [P] Accessibility test for language toggle in `e2e/a11y.spec.ts`
- [ ] T023 [P] Visual regression test for Korean text rendering
- [ ] T024 [P] Update TypeScript interfaces in `src/lib/component-interfaces.ts`
- [ ] T025 Run complete quickstart validation checklist
- [ ] T026 [P] Update documentation in `README.md` and `CLAUDE.md`

## Dependencies
- Content (T001) must complete before implementation (T008-T012)
- Tests (T004-T007) must be written and failing before implementation (T008-T012)
- T008 (language hook) blocks T009 (component), T011 (page updates)
- T009 (LanguageToggle) blocks T010 (ResumeRenderer updates)
- T001 (Korean content) blocks T012 (getStaticProps updates)
- PDF tasks (T013-T016) can run in parallel after core implementation
- Polish tasks (T021-T026) require all implementation complete

## Parallel Execution Examples

### Phase 3.2 - Write All Tests Together:
```bash
# Launch T004-T007 together (different test files):
Task: "Language toggle contract test in src/components/__tests__/LanguageToggle.test.tsx"
Task: "Resume content service contract test in src/lib/__tests__/resume-content.test.ts" 
Task: "Bilingual resume page integration test in pages/__tests__/resume.test.tsx"
Task: "E2E language toggle test in e2e/language-toggle.spec.ts"
```

### Phase 3.3 - Core Components in Parallel:
```bash
# Launch T008-T009 together (different component files):
Task: "Create language toggle hook in src/hooks/useLanguageToggle.ts"
Task: "Create LanguageToggle component in src/components/LanguageToggle.tsx"
```

### Phase 3.4 - PDF Generation Setup:
```bash
# Launch T014, T016 together (different concerns):
Task: "Add Korean fonts to PDF generation environment"
Task: "Generate both PDF files (public/resume.pdf, public/resume-ko.pdf)"
```

### Phase 3.6 - Polish Tasks in Parallel:
```bash
# Launch T021-T024 together (different test files):
Task: "Performance test for language toggle (<10ms) in e2e/performance.spec.ts"
Task: "Accessibility test for language toggle in e2e/a11y.spec.ts"
Task: "Visual regression test for Korean text rendering"
Task: "Update TypeScript interfaces in src/lib/component-interfaces.ts"
```

## Contract Implementation Status
- [x] `language-toggle.ts` → T004, T008, T009 (contract test, hook, component)
- [x] `resume-content.ts` → T005, T002, T012 (service test, parser, page props)
- [x] `test-contracts.ts` → T006, T007 (integration and E2E tests)

## Entity Implementation Status
- [x] `ResumeContent` → T001, T002 (Korean content, parser updates)
- [x] `LanguagePreference` → T008, T017 (hook with localStorage)
- [x] `PDFDocument` → T013-T016 (dual PDF generation)
- [x] `LanguageToggleState` → T008, T009 (hook and component)
- [x] Component Props → T010, T011, T024 (interfaces)

## Notes
- [P] tasks = different files, can run in parallel
- Verify all tests fail before implementing (T008-T012)
- Korean translation (T001) is critical path - high quality required
- PDF generation requires Korean font setup in CI environment
- Performance target: Language toggle <10ms response time
- All Korean text must render properly without encoding issues

## Completion Criteria
✅ Both English and Korean resume versions display correctly  
✅ Language toggle works instantly without page reload  
✅ Both PDF versions generate and download correctly  
✅ Language preference persists across browser sessions  
✅ All tests pass (unit, integration, E2E)  
✅ Korean fonts render properly in both web and PDF  
✅ SEO attributes update correctly for each language  
✅ Accessibility standards met for language toggle  
✅ Performance targets achieved (<10ms toggle time)  
✅ Quickstart guide validation passes completely