---
name: context-mode
description: |
  Context window optimization and session memory management. Reduces tool output overhead by 98%, sandboxes large terminal and search results, indexes file sessions into FTS5/BM25 storage, and prevents context compaction memory loss. Use when handling large files, long outputs, or multi-session memory retention.
---

# Context Mode Skill

Context window optimization and session memory management for AI coding assistants.

## Core Capabilities

1. **Output Compression & Sandboxing**: Keeps large tool output (logs, file listings, search results) out of prompt history.
2. **FTS5 / BM25 Search**: Indexes project files and session decisions so memory can be retrieved on demand instead of cluttering context.
3. **Session Continuity**: Retains file edits, error logs, and user decisions across session compacting.

## Recommended Workflows

- Run targeted terminal scripts or python commands instead of dumping raw file trees.
- Summarize long file contents and command logs before returning response to context.
- Maintain structured state files (`task.md`, `implementation_plan.md`) to preserve memory through long turns.
