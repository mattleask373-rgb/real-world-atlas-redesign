# Agents — read this before touching either repository

This repository is a **visual reference**. The product you integrate into is:

**https://github.com/mattleask373-rgb/life-lived-network**

Lovable remains the primary place the live app is edited. Outside agents work through GitHub pull requests only.

## Hard rules

1. Do not push, force-push, rebase, or merge `life-lived-network` `main`. Branch name: `agent/grok/<task>-short-slug`. A human merges.
2. Do not copy this repo in as a second app. Do not deploy it. Do not point Lovable at it.
3. Do not import `src/data/atlas.ts`, `src/lib/store.ts`, or `src/lib/match.ts` into the live app. Those files are invented example data and a prototype matcher.
4. Do not create a second discovery engine. Extend `src/lib/supply-engine.ts`.
5. Do not edit generated or protected files: `src/integrations/supabase/*`, `src/routeTree.gen.ts`, `.env`, `supabase/config.toml`.
6. Do not add migrations that drop, rename, or weaken RLS. No secrets in either repo.
7. Do not invent people, places, prices, availability, dates, addresses, or scores. If the live data does not have it, the UI says so.
8. Do not turn private place memories into a public Moments feed. A remembered place is not presence, availability, or a service area.
9. Before editing a live file, check open PRs and commits from the last day. If Lovable just touched it, comment instead of editing.
10. Keep pull requests small. Explain what becomes possible. Do not weaken tests. CI (`.github/workflows/verify.yml`) must pass.

Also read, on the live repo:

- `docs/agents/EXTERNAL-COLLABORATORS.md`
- `docs/agents/INVARIANTS.md`
- `docs/design/GROK-REDESIGN-AGENT-HANDOFF.md`
- `docs/adr/001-canonical-supply-engine.md`

Screen-by-screen mapping lives in [INTEGRATION.md](./INTEGRATION.md).
