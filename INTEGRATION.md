# Integrating this redesign into the live app

Canonical repository: [mattleask373-rgb/life-lived-network](https://github.com/mattleask373-rgb/life-lived-network)

Live app: [life-lived-network.lovable.app](https://life-lived-network.lovable.app)

Port **how it looks and how a screen is organised**. Keep **what is true** on the live data: recorded supply, needs, journeys, trust, freshness, and empty states. The listings in this reference were written so a person could click the redesign. They are not listings.

## Screen map

| Reference | What the screen is for | Port the look into | Leave the behaviour on |
|---|---|---|---|
| [Explore](./src/routes/index.tsx) `/` | City, search, a featured place, then the rest. "What's actually happening." | `src/routes/index.tsx`, `src/components/entry-card.tsx`, `src/components/place-picker.tsx`, `src/components/place-search.tsx` | `src/lib/supply-engine.ts`, `src/lib/listings.ts`, existing empty/demo labels |
| [Map](./src/routes/map.tsx) `/map` | Same city, pins and a list, filters that do not cover the map | `src/components/living-map.tsx`, `src/lib/map-list-sync.ts`, the home map | Real coordinates and loaded records only. No invented pins |
| [Place](./src/routes/place/$id.tsx) `/place/$id` | One place, a way to keep it, nearby on the same ground | `src/components/entry-sheet.tsx`, `src/routes/$country.$place.tsx` | The real entry, source, and last-checked. No fake host |
| [Trip](./src/routes/journey.tsx) `/journey` | A few days, chosen from what is actually open | `src/routes/journey.tsx`, `src/routes/road-trip.tsx` | `src/lib/journey-engine.ts`. Do not port `planTrip()` |
| [Moments](./src/routes/moments.tsx) `/moments` | A short, quiet feed, then put the phone away | Visual rhythm only, if a public surface already exists | `src/routes/memories.tsx` stays private. Do not publish memories into discovery |
| [Give](./src/routes/give.tsx) `/give` | Offer a skill or an hour in the current place | `src/routes/give.tsx`, and `src/routes/earn.tsx` only where it is the same act | Existing give/earn writes. Sample offers here are not live |
| [Need](./src/routes/need.tsx) `/need` | Say what you need, see needs already recorded nearby | `src/routes/need.index.tsx`, `src/routes/need.$id.tsx` | `src/lib/needs.ts`. `sampleNeeds` are examples, not people |
| [You](./src/routes/you.tsx) `/you` | Your name, what you kept, what you offered | `src/routes/profile.tsx` | The signed-in profile. Do not replace it with browser-only state |

Navigation in [src/components/shell.tsx](./src/components/shell.tsx): wordmark, desktop links, a place switcher, and a phone bar (Explore, Map, Trip, Moments, You). On the live app, point those at the routes that already exist. Do not add a route just because this reference has one.

Give and Need are actions on Explore in this reference (they are not in the bottom bar). Keep that: they are things you do, not extra home tabs.

## Components worth lifting

From [src/components/bits.tsx](./src/components/bits.tsx):

- `CompassMark` — small mark beside the wordmark
- `PageHead` — kicker, display title, one line of lede
- `PlaceCard` and `FeaturedPlace` — photo, neighbourhood, what is asked, how long
- `EmptyState` — honest empty, not a fake suggestion
- `SearchField`, `ChoiceRow`, `AtlasBoard`
- `Avatar` — initials on a sage or sand ground. No star ratings

Restyle the live components. Do not fork a second card system that reads a different data shape.

## Visual system

Tokens live in [src/styles.css](./src/styles.css).

- Canvas `#F3F0E8`, surface `#FFFCF7`, ink `#1B1916`, muted `#6E675E`, line `#E4DED3`
- Primary `#0C6B56` on `#F3FBF8`, sage `#E3F2EB`, sand `#EFE6D6`
- Display: Fraunces. UI: Manrope
- Photos sit in large rounded frames. Buttons are pills. Touch targets stay at least 44px
- Focus is a 2px primary ring. No emoji as icons. No decorative star ratings
- Map chrome must not steal taps from the map (`pointer-events` stay on the controls only)

If `docs/design/grok-reference/` on the live repo already holds this palette, extend that. Do not invent a third token file.

## Photos

[public/media](./public/media) and [public/og.jpg](./public/og.jpg) are generated pictures for Lisbon, Kyoto, Oaxaca and Cape Town examples. [public/favicon.svg](./public/favicon.svg) is the compass mark.

Use them to judge crop, tone and layout. Do not upload them as a real place's photo, and do not imply a host or a vacancy. A live card uses the photo the record already has, or no photo.

## Suggested pull-request order

Keep each one reviewable. Stop if an open PR already owns the file.

1. Tokens and type in the live stylesheet, without deleting existing semantic colours that trust and layer chips depend on.
2. Entry card and featured place, still fed by current listing props.
3. Home hierarchy: place, search, one featured record, then the list. Keep map/list sync.
4. Place detail: clearer title, the real ask, a keep/save control wired to the real save.
5. Map filters and legend that do not cover pins.
6. Journey and road-trip styling only.
7. Give and Need form rhythm (choice rows, one primary action).
8. Profile: kept places and your offers, from real data.

## Pull-request checklist

- Base is current `main`. Branch is `agent/grok/<task>-short-slug`.
- No files from this reference's data, store, or match modules.
- No schema, RLS, auth, secrets, or generated Supabase types.
- Empty, loading, and error states still tell the truth.
- Checked around 375px and 1280px. Keyboard focus visible. No nested buttons. Reduced motion respected.
- Tests and `.github/workflows/verify.yml` pass on that commit.
- Description says what a person can now do, what was not changed, and anything a human still needs to decide.

## Do not

- Merge this repository into `life-lived-network`.
- Treat Lisbon, Kyoto, Oaxaca or Cape Town cards as launch content.
- Show a score, a made-up price, or a person who was not recorded.
- Rebuild discovery, matching, or auth beside the ones that already exist.
