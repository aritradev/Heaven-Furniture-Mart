---
name: superpowers
description: |
  Core developer workflow superpowers: test-driven development (TDD), systematic debugging, architectural decision records (ADR), root cause analysis, structured problem solving, and effective subagent/tool orchestration. Use when starting complex tasks, debugging hard issues, or enforcing engineering rigor.
---

# Superpowers Workflow Skill

Comprehensive engineering workflows for plan-driven development, testing, debugging, and decision making.

## Core Engineering Principles

1. **Test-Driven Development (TDD)**: Write failing tests first, confirm failure, implement minimal code to pass, and refactor.
2. **Systematic Debugging**: Reproduce issues deterministically, collect empirical tracebacks, formulate testable hypotheses, and verify root-cause fixes.
3. **Structured Design & Planning**: Create technical implementation plans, resolve design ambiguities upfront, and obtain verification before heavy execution.
4. **Architectural Discipline**: Maintain decoupled components, preserve API contracts, and document system architecture decisions.

## Primary Workflows

### 1. Plan-First Execution
- Analyze codebase and dependencies before modifying files.
- Document proposed changes, component breakdown, and verification steps in `implementation_plan.md`.
- Track sub-task completion in `task.md`.

### 2. Empirical Error Diagnosis
- Read full error logs and stack traces before making code modifications.
- Avoid superficial patches, silent try/catch blocks, or fallback dummy values.
- Verify resolution by executing automated build and test suites.

### 3. Incremental Refactoring
- Keep diffs focused and readable.
- Ensure backwards compatibility and update invocation sites across the workspace.
