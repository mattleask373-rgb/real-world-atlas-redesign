# Real World Atlas — UI redesign reference

This repository is a **design reference** for the Real World Atlas / Life Lived Network redesign. It is the screen, type, colour and photo language agents should port into the live app.

It is **not** the live product, **not** a second backend, and **not** something to deploy or merge over the current app.

| | |
|---|---|
| Live app | [life-lived-network.lovable.app](https://life-lived-network.lovable.app) |
| Canonical code | [mattleask373-rgb/life-lived-network](https://github.com/mattleask373-rgb/life-lived-network) |
| How to integrate | [INTEGRATION.md](./INTEGRATION.md) |
| Agent rules in this repo | [AGENTS.md](./AGENTS.md) |
| Agent rules on the live repo | [EXTERNAL-COLLABORATORS.md](https://github.com/mattleask373-rgb/life-lived-network/blob/main/docs/agents/EXTERNAL-COLLABORATORS.md) |

## What you can take

- Colour, type and layout tokens in [src/styles.css](./src/styles.css): canvas `#F3F0E8`, surface `#FFFCF7`, ink `#1B1916`, muted `#6E675E`, line `#E4DED3`, primary `#0C6B56`, sage `#E3F2EB`, sand `#EFE6D6`. Fraunces for display, Manrope for UI.
- Shell and components: [src/components/shell.tsx](./src/components/shell.tsx), [src/components/bits.tsx](./src/components/bits.tsx).
- Screen patterns under [src/routes](./src/routes): Explore, Map, Place, Trip, Moments, Give, Need, You.
- Screenshots in [docs/screenshots](./docs/screenshots).

## What you must not take

- [src/data/atlas.ts](./src/data/atlas.ts) — invented cities, hosts, places, hours and needs (Lisbon, Kyoto, Oaxaca, Cape Town). Example copy only.
- [src/lib/store.ts](./src/lib/store.ts) and [src/lib/match.ts](./src/lib/match.ts) — a preview-only memory and matcher. The live app already has a supply engine. Do not create another one.
- Photos in [public/media](./public/media) as if they were proof a real place, host or listing exists. They are generated pictures for this reference.
- Any idea of replacing Lovable, auth, Supabase, or `main` with this tree.

## How agents should work

1. Read [INTEGRATION.md](./INTEGRATION.md) and the live repo's `docs/agents/EXTERNAL-COLLABORATORS.md`.
2. Branch the **live** repo: `agent/grok/<task>-short-slug`. Never push its `main`.
3. Open a small pull request that changes presentation only, on top of current data.
4. A human merges. Do not merge it yourself.

This package is newer than the October 2026 `grok-workspace.zip` that was inventoried but never committed. Use this repository as the readable source. The notes already in `docs/design/grok-reference/` on the live repo still apply; this repo adds the actual screens.

## Systems merge

The live app, the AI rules, and the merge sequence are in [life-lived-network#410](https://github.com/mattleask373-rgb/life-lived-network/pull/410). This repo stays a design reference.
