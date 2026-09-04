---
name: claude-mem
description: |
  Persistent cross-session memory management. Captures session activity, compresses long trajectories, and automatically retrieves historical project decisions and context. Use when working across multiple user conversations or retrieving past conversation history.
---

# Claude Mem Skill

Persistent session memory and AI-assisted context compression across agent conversations.

## Key Functions

1. **Automatic Context Capture**: Log session steps, decisions, user preferences, and architectural choices.
2. **Context Compression**: Compress raw trajectory logs into structured knowledge summaries.
3. **Session Retrieval**: Search past conversation transcripts and Knowledge Items (KIs) before starting research or execution.

## Usage Guidelines

- Review KI summaries and past conversation logs in `<appDataDir>/brain/<conversation-id>/.system_generated/logs/transcript.jsonl` when tracing past decisions.
- Save persistent findings to Knowledge Items or artifacts so future sessions can reuse established patterns.
