---
name: Long-form owner memory
description: Durable design rule for Hasty's persistent owner memory and prompt recall.
---

Owner memory is intentionally uncapped at the storage layer so the bot can retain full conversation records, notes, and long summaries. AI prompts must use selective, relevant excerpts rather than injecting the entire memory document.

**Why:** The owner asked for a very long memory that Hasty can inspect and update whenever needed, while unrestricted prompt injection would eventually exceed model context limits and make responses unreliable.

**How to apply:** Preserve owner-only read/write controls, keep secret-storage safeguards, and treat any future storage migration as an implementation change that must preserve the same search, summary, edit, delete, and selective-recall behavior.