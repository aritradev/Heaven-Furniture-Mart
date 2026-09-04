---
name: get-shit-done
description: |
  Autonomous end-to-end task execution workflow (GSD): multi-phase research, spec-driven architecture, iterative execution checkpoints, and automated validation. Use when executing complex multi-step features or overnight batch tasks.
---

# Get Shit Done (GSD) Workflow Skill

Autonomous task execution framework with multi-model routing, spec verification, and step-by-step progress tracking.

## Core Phases

### Phase 1: Spec & Requirement Capture
- Identify core goals, non-negotiable architectural rules, and technical constraints.
- Inspect workspace context and relevant KIs before formulating implementation strategy.

### Phase 2: Execution Planning
- Deconstruct requirements into modular, independently testable phases.
- Maintain active `implementation_plan.md` and live progress checklist in `task.md`.

### Phase 3: Autonomous Execution
- Apply code modifications incrementally without skipping verification steps.
- Resolve any intermediate build errors immediately before proceeding to subsequent modules.

### Phase 4: System Verification & Walkthrough
- Execute tests, type-checks, and build scripts to validate completeness.
- Document final architecture changes, verification output, and file diffs in `walkthrough.md`.
