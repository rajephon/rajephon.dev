# Implementation Plan: Google Analytics Integration

**Branch**: `003-google-analytics-src` | **Date**: 2025-09-22 | **Spec**: [specs/003-google-analytics-src/spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-google-analytics-src/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → SUCCESS: Feature spec loaded and analyzed
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → Detect Project Type from context (web=frontend+backend, mobile=app+api)
   → Set Structure Decision based on project type
3. Fill the Constitution Check section based on the content of the constitution document.
4. Evaluate Constitution Check section below
   → If violations exist: Document in Complexity Tracking
   → If no justification possible: ERROR "Simplify approach first"
   → Update Progress Tracking: Initial Constitution Check
5. Execute Phase 0 → research.md
   → If NEEDS CLARIFICATION remain: ERROR "Resolve unknowns"
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, agent-specific template file
7. Re-evaluate Constitution Check section
   → If new violations: Refactor design, return to Phase 1
   → Update Progress Tracking: Post-Design Constitution Check
8. Plan Phase 2 → Describe task generation approach (DO NOT create tasks.md)
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 7. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary
Add optional Google Analytics 4 (GA4) tracking to the personal website with conditional loading based on tracking ID configuration. When enabled, track page views, resume language toggles, and PDF downloads while respecting user privacy when disabled.

## Technical Context
**Language/Version**: TypeScript 5.x with Next.js 15+  
**Primary Dependencies**: Next.js, React, Tailwind CSS, remark/unified, Google Analytics 4  
**Storage**: Static files (configuration in TypeScript), localStorage for language preferences  
**Testing**: Jest + React Testing Library, Playwright (E2E)  
**Target Platform**: GitHub Pages with custom domain (SSG deployment)
**Project Type**: web - Single page application with static site generation  
**Performance Goals**: No impact on page load when disabled, <100ms additional load when enabled  
**Constraints**: Static site generation (no server-side runtime), privacy-first (optional tracking)  
**Scale/Scope**: Personal website with resume pages, minimal tracking scope

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Based on the constitution template (not specific principles defined), standard checks:
- **Simplicity**: ✅ Feature adds minimal complexity - configuration flag + conditional script loading
- **Privacy First**: ✅ Optional configuration respects user privacy preferences  
- **Performance**: ✅ Conditional loading ensures no impact when disabled
- **Maintainability**: ✅ Standard Google Analytics integration patterns

No constitutional violations identified.

## Project Structure

### Documentation (this feature)
```
specs/003-google-analytics-src/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
# Single project structure (current)
src/
├── lib/
│   ├── config.ts        # Extend with analytics config
│   └── analytics.ts     # New: GA4 integration utilities
├── components/
│   └── Analytics.tsx    # New: Analytics tracking component
└── hooks/
    └── useAnalytics.ts  # New: Analytics tracking hooks

pages/
├── _app.tsx            # Integrate Analytics component
├── _document.tsx       # Add GA4 scripts conditionally
└── resume.tsx          # Add language toggle and PDF download tracking

tests/
├── unit/
│   ├── analytics.test.ts
│   └── useAnalytics.test.ts
└── e2e/
    └── analytics.spec.ts
```

**Structure Decision**: Single project (Option 1) - matches current Next.js static site structure

## Phase 0: Outline & Research
1. **Extract unknowns from Technical Context** above:
   - Google Analytics 4 integration best practices for Next.js SSG
   - Privacy-compliant analytics implementation patterns
   - Event tracking for SPAs with language switching and file downloads
   - Testing strategies for analytics integration

2. **Generate and dispatch research agents**:
   ```
   Task: "Research Google Analytics 4 integration for Next.js static sites"
   Task: "Find best practices for conditional analytics loading in SSG"
   Task: "Research event tracking patterns for language toggles and file downloads"
   Task: "Find privacy-compliant analytics implementation approaches"
   ```

3. **Consolidate findings** in `research.md` using format:
   - Decision: [what was chosen]
   - Rationale: [why chosen]
   - Alternatives considered: [what else evaluated]

**Output**: research.md with all technical decisions documented

## Phase 1: Design & Contracts
*Prerequisites: research.md complete*

1. **Extract entities from feature spec** → `data-model.md`:
   - Analytics Configuration entity with optional tracking ID
   - Language Toggle Event entity for tracking language switches
   - PDF Download Event entity for tracking resume downloads

2. **Generate API contracts** from functional requirements:
   - Configuration interface for analytics settings
   - Event tracking interface for custom events
   - Hook interface for analytics functionality
   - Output TypeScript interfaces to `/contracts/`

3. **Generate contract tests** from contracts:
   - Configuration validation tests
   - Event tracking function tests  
   - Hook behavior tests
   - Tests must fail (no implementation yet)

4. **Extract test scenarios** from user stories:
   - Each acceptance scenario → integration test scenario
   - Quickstart test = analytics setup and verification steps

5. **Update agent file incrementally** (O(1) operation):
   - Run `.specify/scripts/bash/update-agent-context.sh claude` for Claude Code
   - Add Google Analytics 4 integration to tech stack
   - Update recent changes for analytics feature
   - Keep under 150 lines for token efficiency
   - Output to repository root CLAUDE.md

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
- Load `.specify/templates/tasks-template.md` as base
- Generate tasks from Phase 1 design docs (contracts, data model, quickstart)
- Each contract interface → TypeScript definition task [P]
- Analytics configuration → config extension task [P] 
- Each tracking event → event implementation task
- Component and hook creation tasks
- Integration tasks for _app.tsx and _document.tsx
- Test tasks to make contract tests pass

**Ordering Strategy**:
- TDD order: Tests before implementation 
- Dependency order: Config → Utilities → Components → Hooks → Integration
- Mark [P] for parallel execution (independent files)

**Estimated Output**: 15-20 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)  
**Phase 4**: Implementation (execute tasks.md following constitutional principles)  
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

No complexity violations identified. The feature follows standard patterns:
- Optional configuration flag
- Conditional script loading
- Standard event tracking patterns
- Existing test infrastructure

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented

---
*Based on Constitution template - See `.specify/memory/constitution.md`*