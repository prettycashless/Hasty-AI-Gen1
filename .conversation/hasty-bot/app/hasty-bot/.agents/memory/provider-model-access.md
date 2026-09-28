---
name: Provider model access
description: Model IDs available to an API key can differ from public documentation or defaults.
---

Check the provider's live models endpoint before selecting a model for this bot.

**Why:** A publicly documented Groq model was unavailable to the configured key, causing runtime 404 errors.

**How to apply:** Query the provider's model list without exposing credentials, then configure only an ID returned for the active key.