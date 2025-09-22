# Tasks: Google Analytics Integration

**Input**: Design documents from `/specs/003-google-analytics-src/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → SUCCESS: Implementation plan loaded, tech stack identified
   → Extract: TypeScript 5.x, Next.js 15+, @next/third-parties
2. Load optional design documents:
   → data-model.md: Extract entities → model tasks  
   → contracts/: 4 files → contract test tasks
   → research.md: Extract decisions → setup tasks
3. Generate tasks by category:
   → Setup: dependencies, configuration, linting
   → Tests: contract tests, integration tests
   → Core: utilities, components, hooks
   → Integration: pages, consent management
   → Polish: unit tests, E2E tests, docs
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests before implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → All contracts have tests? ✅
   → All entities have utilities? ✅
   → All integrations covered? ✅
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Single project**: `src/`, `tests/` at repository root
- Paths assume Next.js project structure per plan.md

## Phase 3.1: Setup

- [ ] T001 Install @next/third-parties dependency and configure TypeScript types
- [ ] T002 [P] Add Google Analytics environment variable to .env.local template
- [ ] T003 [P] Configure ESLint and Prettier rules for new analytics files

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (Based on contracts/ directory)
- [ ] T004 [P] Contract test for AnalyticsConfig interface in tests/unit/analytics-config.test.ts
- [ ] T005 [P] Contract test for ConsentManager interface in tests/unit/consent-management.test.ts
- [ ] T006 [P] Contract test for EventTracker interface in tests/unit/event-tracking.test.ts
- [ ] T007 [P] Contract test for useAnalytics hook interface in tests/unit/analytics-hooks.test.ts

### Integration Tests (Based on user scenarios from spec.md)
- [ ] T008 [P] Integration test: No tracking when ID not configured in tests/e2e/analytics-disabled.spec.ts
- [ ] T009 [P] Integration test: GA4 tracking with valid ID and consent in tests/e2e/analytics-enabled.spec.ts
- [ ] T010 [P] Integration test: Language toggle event tracking in tests/e2e/language-toggle.spec.ts
- [ ] T011 [P] Integration test: PDF download event tracking in tests/e2e/pdf-download.spec.ts
- [ ] T012 [P] Integration test: Consent management flow in tests/e2e/consent-flow.spec.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Configuration Extension (Based on data-model.md)
- [ ] T013 Extend src/lib/config.ts with AnalyticsConfig interface and siteConfig.analytics

### Core Utilities (Based on research.md decisions)
- [ ] T014 [P] Create consent management utilities in src/lib/consent.ts
- [ ] T015 [P] Create analytics tracking utilities in src/lib/analytics.ts
- [ ] T016 [P] Create analytics validation utilities in src/lib/analytics-validation.ts

### React Components
- [ ] T017 [P] Create Analytics component with conditional loading in src/components/Analytics.tsx
- [ ] T018 [P] Create ConsentBanner component for user consent in src/components/ConsentBanner.tsx

### React Hooks
- [ ] T019 [P] Create useAnalytics hook for tracking functions in src/hooks/useAnalytics.ts
- [ ] T020 [P] Create useConsent hook for consent management in src/hooks/useConsent.ts

## Phase 3.4: Integration

### Page Integrations
- [ ] T021 Integrate Analytics component in pages/_app.tsx
- [ ] T022 Add language toggle tracking to existing Resume page component
- [ ] T023 Add PDF download tracking to existing Resume page component

### Consent Management Integration  
- [ ] T024 Initialize Google Consent Mode in src/lib/analytics.ts
- [ ] T025 Add consent banner integration to main layout

## Phase 3.5: Polish

### Unit Tests (Make contract tests pass)
- [ ] T026 [P] Unit tests for consent utilities in tests/unit/consent.test.ts
- [ ] T027 [P] Unit tests for analytics utilities in tests/unit/analytics.test.ts
- [ ] T028 [P] Unit tests for validation utilities in tests/unit/analytics-validation.test.ts
- [ ] T029 [P] Unit tests for Analytics component in tests/unit/Analytics.test.tsx
- [ ] T030 [P] Unit tests for useAnalytics hook in tests/unit/useAnalytics.test.ts

### Performance & Optimization
- [ ] T031 Verify no performance impact when analytics disabled (<0ms added load)
- [ ] T032 Verify analytics load time meets performance budget (<100ms when enabled)
- [ ] T033 Test static site generation compatibility with next export

### Validation & Documentation
- [ ] T034 Run functional requirements validation checklist from quickstart.md
- [ ] T035 [P] Update CLAUDE.md with completed analytics implementation
- [ ] T036 Manual testing with real GA4 property using quickstart.md guide

## Dependencies

### Critical Dependencies (Must be completed in order)
- **Setup before everything**: T001 → T002, T003
- **Tests before implementation**: T004-T012 → T013-T025 
- **Config before utilities**: T013 → T014, T015, T016
- **Utilities before components**: T014, T015 → T017, T018
- **Utilities before hooks**: T014, T015 → T019, T020
- **Components before integration**: T017 → T021, T025
- **Hooks before integration**: T019, T020 → T022, T023
- **Core before polish**: T013-T025 → T026-T036

### Parallel Execution Blocks
```
Block 1 (Setup): T002, T003 after T001
Block 2 (Contract Tests): T004, T005, T006, T007 parallel  
Block 3 (Integration Tests): T008, T009, T010, T011, T012 parallel
Block 4 (Core Utilities): T014, T015, T016 parallel after T013
Block 5 (React Code): T017, T018, T019, T020 parallel after Block 4
Block 6 (Unit Tests): T026, T027, T028, T029, T030 parallel
```

## Parallel Example

### Contract Tests Phase (Run simultaneously)
```bash
# Launch T004-T007 together:
Task: "Contract test for AnalyticsConfig interface in tests/unit/analytics-config.test.ts"
Task: "Contract test for ConsentManager interface in tests/unit/consent-management.test.ts"  
Task: "Contract test for EventTracker interface in tests/unit/event-tracking.test.ts"
Task: "Contract test for useAnalytics hook interface in tests/unit/analytics-hooks.test.ts"
```

### Integration Tests Phase (Run simultaneously)
```bash
# Launch T008-T012 together:
Task: "Integration test: No tracking when ID not configured in tests/e2e/analytics-disabled.spec.ts"
Task: "Integration test: GA4 tracking with valid ID and consent in tests/e2e/analytics-enabled.spec.ts"
Task: "Integration test: Language toggle event tracking in tests/e2e/language-toggle.spec.ts"
Task: "Integration test: PDF download event tracking in tests/e2e/pdf-download.spec.ts"
Task: "Integration test: Consent management flow in tests/e2e/consent-flow.spec.ts"
```

### Core Utilities Phase (Run simultaneously)
```bash
# Launch T014-T016 together after T013:
Task: "Create consent management utilities in src/lib/consent.ts"
Task: "Create analytics tracking utilities in src/lib/analytics.ts"
Task: "Create analytics validation utilities in src/lib/analytics-validation.ts"
```

## File-Specific Task Mapping

### Configuration Files
- `src/lib/config.ts`: T013 (sequential)
- `.env.local`: T002 [P]

### Utility Files  
- `src/lib/consent.ts`: T014 [P], T026 [P]
- `src/lib/analytics.ts`: T015 [P], T024, T027 [P]
- `src/lib/analytics-validation.ts`: T016 [P], T028 [P]

### Component Files
- `src/components/Analytics.tsx`: T017 [P], T029 [P]  
- `src/components/ConsentBanner.tsx`: T018 [P]

### Hook Files
- `src/hooks/useAnalytics.ts`: T019 [P], T030 [P]
- `src/hooks/useConsent.ts`: T020 [P]

### Page Files
- `pages/_app.tsx`: T021 (sequential)
- `pages/resume.tsx`: T022, T023 (sequential - same file)

### Test Files (All [P] within their phases)
- Contract tests: T004-T007 [P]
- E2E tests: T008-T012 [P]  
- Unit tests: T026-T030 [P]

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task or logical group
- Manual testing requires real GA4 property setup
- Performance validation uses browser dev tools
- Follow TDD: Red (failing tests) → Green (implementation) → Refactor

## Task Generation Rules
*Applied during main() execution*

1. **From Contracts**:
   - 4 contract files → 4 contract test tasks [P] (T004-T007)
   - Interfaces → implementation tasks for utilities/hooks
   
2. **From Data Model**:
   - 5 entities → utility creation tasks [P] (T014-T016)
   - Relationships → integration tasks (T021-T025)
   
3. **From User Stories**:
   - 5 acceptance scenarios → 5 integration tests [P] (T008-T012)
   - Quickstart scenarios → validation tasks (T034-T036)

4. **Ordering**:
   - Setup → Tests → Config → Utilities → Components/Hooks → Integration → Polish
   - Dependencies block parallel execution within phases

## Validation Checklist
*GATE: Checked during execution*

- [x] All contracts have corresponding tests (T004-T007)
- [x] All entities have utility tasks (T014-T016) 
- [x] All tests come before implementation (T004-T012 before T013+)
- [x] Parallel tasks truly independent (different files verified)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task
- [x] Integration scenarios covered (T008-T012)
- [x] Performance requirements addressed (T031-T032)
- [x] Manual validation included (T034-T036)

## Success Criteria
Upon completion of all tasks:
1. ✅ Optional GA4 tracking working with conditional loading
2. ✅ Privacy-compliant consent management implemented  
3. ✅ Language toggle and PDF download events tracked
4. ✅ All functional requirements validated (FR-001 to FR-011)
5. ✅ No performance impact when disabled
6. ✅ <100ms additional load when enabled
7. ✅ Static site generation compatibility maintained
8. ✅ Test coverage for all critical paths