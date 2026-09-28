# Hasty AI Gen1

Hasty is a Discord bot with moderation, utility, fun, tickets, and AI-powered
conversation features, plus a small health-check API service.

## Run & Operate

- `pnpm --filter @workspace/hasty-bot run dev` — run the Discord bot
- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/hasty-bot run deploy` — deploy slash commands
- Required secret env: `DISCORD_TOKEN`, `MISTRAL_API_KEY`, `FISH_AUDIO_API_KEY`
- Required non-secret env: `DISCORD_CLIENT_ID`
- Optional non-secret env: `DISCORD_GUILD_ID` for instant guild-only slash-command updates
- Runtime-managed env: `DATABASE_URL`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Discord bot: discord.js 14
- API: Express 5
- DB library: PostgreSQL + Drizzle ORM (the current bot persistence remains JSON-backed)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/hasty-bot/src/` — Discord bot source, commands, handlers, events, and AI integrations
- `artifacts/hasty-bot/data/` — JSON-backed bot settings, warnings, tickets, and permissions
- `artifacts/data/hasty-memory.json` — persistent Hasty memory, including the owner's long-form summary and uncapped conversation entries
- `artifacts/api-server/src/` — Express API server and health route
- `lib/db/` — Drizzle database package and schema source
- `lib/api-spec/openapi.yaml` — API contract source

## Architecture decisions

- The Discord bot keeps its existing JSON file persistence under `artifacts/hasty-bot/data/`.
- PostgreSQL is provisioned and connected through the runtime-managed `DATABASE_URL`.
- The shared API server is kept separate from the Discord gateway process.
- Slash command registration is global unless `DISCORD_GUILD_ID` is provided.

## Product

Hasty provides a general-purpose Discord community bot with moderation commands,
utility and fun commands, ticket handling, configurable guild settings, and
AI-powered responses with Mistral and Fish Audio.

## User preferences

- Keep the imported project structure intact unless a change is required to run it.

## Gotchas

- `DISCORD_TOKEN` and `DISCORD_CLIENT_ID` are checked during bot startup.
- Mistral and Fish Audio keys are required when their corresponding AI features are used.
- `DISCORD_GUILD_ID` is optional; without it, command deployment uses global registration.
- `pnpm --filter @workspace/db run push` currently reports no schema changes because the Drizzle schema is empty.
- Owner-only `s!memory` commands can inspect, search, append, summarize, edit, and delete long-term memory.
- Long-term owner memory has no application-level entry or character cap; only the excerpt sent to Mistral is limited to keep prompts usable.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
