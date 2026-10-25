# ChatGPT overview — build one life app, then scale it

**Who this is for:** ChatGPT working on Real World Atlas / The Living World.
**Canonical code:** https://github.com/mattleask373-rgb/life-lived-network (`main` `c48599ee574c275737df31b4db73ea50dec23ebb`, 24 Oct 2026).
**Live site:** https://life-lived-network.lovable.app — this is behind `main`. Checked 25 Oct 2026: home 200, `/explore` 404, `/sitemap.xml` 404, `robots.txt` is a blanket allow with no private-route rules and no sitemap.
**Visual reference only:** https://github.com/mattleask373-rgb/real-world-atlas-redesign
**Earlier notes:** pull requests #410 and #411. This file replaces #411 as the plan to follow.
**This file does not authorise a merge, a deploy, a scrape, a payment system, or a public model.**

Heartbeat: stop scrolling. One place, everything that is actually happening, organised so a person can act and put the phone away.

---

## 0. How ChatGPT must work

1. Read this file.
2. Read in the canonical repo: `docs/agents/EXTERNAL-COLLABORATORS.md`, `docs/agents/INVARIANTS.md`, `docs/adr/001-canonical-supply-engine.md`, both ADR 003s, `docs/ai/GROUNDED-ASSISTANT-AND-GLOBAL-INTEGRATION.md`.
3. Do the next unblocked task in section 12. One pull request. Stop.
4. Branch `agent/chatgpt/<short-task>`. Never push `main`. Never force-push. Never merge.
5. Do not edit `src/integrations/supabase/*`, `src/routeTree.gen.ts`, `.env`, `supabase/config.toml`.
6. Do not weaken RLS or tests.
7. If Lovable edited a file in the last day, comment, do not edit it.
8. Extend `findSupply()`. No second matcher, no vector database, no second app.
9. Unknown stays unknown. Quiet is a valid screen. Fixtures never become production data.
10. Do not scrape Deliveroo, Uber, Uber Eats, Just Eat, Indeed, Seek, Airbnb, Too Good To Go, Ticketmaster’s website, WWOOF, Workaway, or GetYourGuide. A new source needs a contract and a human yes.

---

## 1. Independent review — 25 October 2026

Reviewed from `main`, the open pull-request queue, and the public Lovable site. Not a guess.

### Ready as foundations (do not rebuild)

These are real code, with tests around them. They are the right base for global growth. They are **not** a live global product.

| Piece | Evidence | What it already gives you |
|---|---|---|
| One discovery engine | `src/lib/supply-engine.ts` | Bands with caveats: direct, local capability, open to opportunities, journey, community, contribution, skills exchange, related. |
| Geography | `src/lib/geo-scope.ts` | A person matches only if they declared a service area. Passing through is not being free. Unknown place fails closed. |
| Ranking | `src/lib/grounded-matching.ts` | `groundedMatch()`, `threeHours()`. Ranks records it is given. Empty stays empty. |
| Themes | `src/lib/explore-topics.ts` and `/explore` on `main` | Eight doors into the same map. Copy says a theme is not local stock. |
| Place pages | `src/routes/$country.$place*.tsx` | A locality URL, not a fake city page. |
| Ingest shape | `src/lib/ingest/contract.ts`, `normalise.ts`, `dedupe.ts`, `freshness.ts` | Source, provenance, expiry, dedupe. A failed refresh must not wipe a place. |
| Ticketmaster | `ticketmaster.ts` registered in `registry.ts`. Network only in `refresh.server.ts`. Cap 2 pages / 120 events. | What’s-on can be asked per locality without the city name baked into code. |
| Adzuna primitives | `src/lib/ingest/adzuna*.ts` | Turns a job-board payload into a staging record. The file itself says it does **not** call the network or publish. |
| Home, journey, road trip, give, need, make, profile, life list, conversations, memories, moderation | `src/routes/*` | The doors exist. Memories stay private. |
| Draft assist, dark | `draft-assist.server.ts` | Only billable model. 800 output tokens, 0 retries, 30s, kill switch. Quota is not a live control until #290. |
| Rules | ADRs, invariants, external-collaborator doc | Agents already have a way to work without destroying `main`. |

### Not ready for global growth

| Gap | Evidence | Why it blocks scale |
|---|---|---|
| The public site is a demo | Lovable home is “Lisbon, a demo place.” `/explore` 404. | Shipping the GitHub app is not the same as people using it. Lovable is behind `main`. |
| Search engines can see private paths | Live `robots.txt` allows everything. Sitemap 404. The repo’s robots file is stricter and is not what is deployed. | You cannot open the world until private routes stay private. |
| Jobs do not flow yet | Adzuna is **not** in `registry.ts`. Registry is only `ticketmaster-discovery` and `fixture-source`. | “Indeed/Seek-style work” is a staging library, not a feed. |
| Events are not a public live feed | Ticketmaster can be refreshed server-side. The site people open still shows demo pins. | A partner adapter on a branch is not a market. |
| No cached locality bundle | Reads are not shaped as “one document per place”. | At millions of opens you would hit the database and the partner for every phone. |
| Map is not the Airbnb interaction | Live map is an emoji grid under “What’s around you”, easy to miss. | The product has to be a map you can search, filter, and read as a list of the same pins. |
| Thirty open pull requests | Includes geography pagination (#396, #397, #406), global coordinates (#390), destinations directory (#394), GeoNames manifest (#395), ingest atomicity (#403, #407), unknown price vs free (#391, #402). | Global work is in draft. `main` has not absorbed it. Do not start a rival version of these. |
| Abuse controls | Issue #290. Draft quota migration not proven on a real database. | A public write form plus a model, without this, will be abused the week you are noticed. |
| No steward, no “this place is live” flag in production | Readiness list exists only as a document. | You cannot turn on a country. You turn on a place. |
| Payments, insurance, right-to-work, dispatch | Not built. | Delivery and removals cannot pretend to be Uber. |
| Design | Live UI is “The Living World”, flat, emoji, no photo language, no phone tab bar. Redesign is a separate repo. Owner has not signed the visual merge. | Do not restyle and re-platform in one PR. |
| Side repos | `real-world-atlas-agent-orchestration`, marketing, monetization, compliance are README-only. | They are not a running company system. |

### Verdict

The **engine** is ready to grow. The **market** is not. What you have is a honest skeleton: one matcher, one place model, one ingest pipe, a demo city, and a queue of scale fixes that are not merged. ChatGPT’s job is to finish that skeleton for one real city, on a map a person can actually use, and only then repeat it. Building Deliveroo, Uber, Indeed, and Too Good To Go as four new apps would throw away the only advantage you have.

---

## 2. The product, including the new work

One record. Many doors. The map is the home screen.

| Door | Person | First supply | Later | Never |
|---|---|---|---|---|
| What’s on | Tonight, this week | Ticketmaster, labelled | Venues and artists posting a night | A fake box office |
| Longer work | A listed job | Adzuna, once wired and rights-cleared. Other boards only under contract | Employers posting here | Scraping Indeed or Seek |
| Short work | A shift, a garden, a clean | A business or a neighbour posts it, with an expiry | Same | Calling someone a licensed tradesperson |
| Delivery, day one | “I landed today. What needs carrying?” | Shops and kitchens post “rider needed 12–3” with vehicle and area | Denser same-day posts | Live GPS dispatch, or pretending they are hired by Deliveroo |
| Removals and bigger work | A van, two people, a house | A household or a firm posts the job, the window, and what is not included | Repeat local firms | “Insured mover” unless a reviewed credential says so |
| Surplus food | Eat what would be wasted | A kitchen posts portions, a pickup window, and a price or “free” | Many kitchens in one city | Scraping Too Good To Go. Guessing allergens |
| Music | Artist, room, fans | API shows, labelled | Empty night + artist need | The app taking the door money in v1 |
| Projects | Weeks, a bed, real work | Hosts post in their own words | A region of projects | Scraping WWOOF or Workaway |
| With a local | A lesson, a crossing, a meal | A person offers hours | Confirm before travel | A checkout |
| People | Like-minded, around a thing | The gig, the night, the project | A conversation tied to that record | A follower feed |

**Day one in a new area** means: they set the place to where they are, say what they can do from today (walk, bike, car, van, hands), and see posts that are actually open. It does not mean the app employs them, insures them, or signs them into Uber. Those companies keep their own onboarding. You are the map that shows the work.

**Waste** means a real portion with a real clock. When the window ends, the card dies. That is the product. A model must not invent a bakery’s leftovers.

---

## 3. The map is the product (Airbnb’s lesson, not Airbnb’s business)

Airbnb works because the map and the list are the same search. Pins are easy to read. Filters are few. A card says the facts. Empty areas stay empty.

Build that interaction on the map you already have. Do not import Airbnb listings.

- One screen: map plus list. Selecting a pin selects the card. Moving the map asks “search this area” only within canonical places you already support. Do not draw a pin for a person.
- Filters are the themes plus time (now, today, this week) plus kind (event, job, gig, delivery, removal, surplus, project).
- A pin shows time and price **only when the record has them**. Unknown price is not free. There is open work on this (#391, #402). Finish that before you show prices.
- Pins are approximate. The exact door is shared after both sides agree.
- The list is short. “Happening now”, then “today”, then “this week”. Not an infinite scroll.
- Demo rows never appear on a place marked live.

The current emoji grid is the thing to replace, after the owner says so, and only as a presentation change over the same records.

---

## 4. How the information is organised

Perfect organisation is a schema, not a prettier feed.

Every public card is one record:

- Place id from the hierarchy. Not a live dot.
- Kind: event, longer work, short work, delivery, removal, surplus food, music night, project, session with a local.
- Who: partner feed or member.
- Source, rights, `last_checked_at`, `expires_at`.
- Start and end. Delivery and surplus are often hours, not days.
- Pay in minor units and a currency, or explicitly unknown.
- For delivery and removals: vehicle (none, bike, car, van), how many people, how heavy, what area they cover.
- For surplus: portions, pickup window, dietary notes **only if the kitchen typed them**.
- Band and caveat, rendered by the app, not rewritten by a model.
- Demo flag.

`findSupply` already knows how to separate “they posted this” from “they said they can” from “they are passing through”. Delivery uses the same bands. A rider who says they can deliver is `local_capability` until they accept a posted shift. Accepting is a conversation, not an automatic dispatch.

Regulated kinds stay harsh. Food for sale, transport of people, electrical, gas, and structural construction cannot look qualified. Delivery of prepared food shows the kitchen’s own allergen note or no note. Removals do not say “insured”.

---

## 5. Scale, from startup to global

You do not scale by launching every feature in every country. You scale by making one place fast and true, then repeating a checklist.

### The shape that holds millions of daily users

- **Reads are cached bundles.** One JSON document per place, per layer, per time window. CDN in front. A million people in one city cost one refresh.
- **Partner calls are per place, on a schedule,** inside the existing refresh worker. Cap pages. A dark partner leaves the last good bundle and a visible last-checked time.
- **Writes are small.** Posts, accepts, reports. Rate-limited. Moderated.
- **Models are off the read path.** On-device draft or explain only, from the bundle, on phones that already have a model. Server draft assist stays capped behind #290. No API keys from users. No vector brain.
- **Postgres stays the record.** Indexes on place, kind, time, expiry. The open geography PRs (#396, #397, #400, #406) exist because unbounded place scans will not survive growth. Land those fixes. Do not add a second geo stack.
- **A feature flag per place and per kind.** Delivery can be on in one city and off where the law has not been reviewed. Surplus food likewise.
- **One primary database** until a load test says otherwise. Replicas and a second region are earned, not drawn on a slide.

Illustrative, not a promise: 5 million people, 20 opens a day, is about 100 million reads. If 95% hit cache, origin stays ordinary. The bill that grows is moderation and partner refresh, not page views.

### The market sequence

1. **One wedge city the owner names.** Not demo Lisbon. Three live kinds only: sourced events, member short-work (including a delivery post and a removal post), and surplus food from kitchens who type it themselves. Map + list.
2. **Prove the cache** and a week of moderation with a named steward.
3. **Wire Adzuna** only after rights review, into the existing registry, still unpublished until the work-opportunity gate says yes.
4. **A second and third city in the same country** (same currency, same clock, same law). Same checklist. No new architecture.
5. **A second country** only with the readiness record: hierarchy, currency, timezone, taxonomy, rights, moderation, steward, indexability. Australia stays off until that record is approved.
6. **Density, not breadth.** A city graduates when member posts are fresher than the partner feed. Then add music nights and multi-day projects there. Not before.
7. **You take on the big companies by being the one map,** not by owning their fleets. Uber keeps the dispatch. Deliveroo keeps the rider contract. Ticketmaster keeps the ticket. Indeed keeps the apply-button until you choose otherwise. People open you because the garden, the van, the unsold meals, the empty venue, and the afternoon shift are in one calm place.

What you refuse, even under pressure: fake listings to look busy, a global “now live” banner, a courier GPS trace, a star rating, an infinite people feed.

---

## 6. AI

Unchanged, and stricter because delivery and food are time-critical.

- The map does not call a model to decide what is on.
- A phone model may explain a card or draft the user’s own post. It may not add a wage, a pickup time, an allergen, or a softer caveat.
- “Ask this place” stays off until citations, same-place isolation, and injection tests exist.
- Tokens are not how you get global data. Kitchens, venues, households, and licensed feeds are.

---

## 7. Design

The owner is art-directing from the current Living World screens before a visual merge. Wait for that.

When it starts: tokens and type, then cards, then the Airbnb-style map, then phone navigation. Facts only. No prototype photos as evidence. One surface per pull request. The redesign repo is a reference, not a runtime.

---

## 8. Safety and law

- Delivery and removals can involve roads, insurance, and the right to work. The card is an introduction. It is not employment, not a background check, and not cover.
- Surplus food is food for sale or gift. Show only what the kitchen wrote. Do not add “safe” or “healthy”.
- Exact addresses stay off the public map.
- Payments, escrow, and in-app tickets are a later project with the owner. Until then, say “not a booking”.
- New country, new steward, new flag. Agents do not flip the flag.

---

## 9. What to build, in order

Each item is one or more small pull requests. Do not skip.

### Phase 0 — land the scale fixes already in review

Do not rewrite them. Rebase, finish, and ask a human to merge, in an order that does not fight:

- Geography: no full-table scans, bounded pagination (#396, #397, #400, #406 and their stacks).
- Ingest: atomic provenance, fail closed, locality resolved before anything is public (#393, #403, #407).
- Price: unknown is not free (#391, #402).
- Leave the destinations directory (#394) and GeoNames manifest (#395) until the owner says that directory is in scope. Read them. Do not fork them.

**Done when:** `main` can resolve a locality and refresh a source without a 400-place scan and without wiping good rows on failure.

### Phase 1 — one real city on a real map

1. Owner names the city. Lisbon stays demo.
2. Trace Ticketmaster from registry to card. Turn it on for that city only if credentials and rights are already approved. If they are not, stop and ask.
3. Locality bundle: place + layer + window, cached. Second request must not call Ticketmaster. Test that.
4. Map + list of those rows. Approximate pins. Empty state if the feed is quiet.
5. Deploy story is a human decision. GitHub `main` and the Lovable site are not the same thing today. Do not claim the site updated until `/explore` and robots match the repo.

**Done when:** a stranger sees sourced, unexpired events, or an honest empty map. No demo rows.

### Phase 2 — short work, delivery, removals

On the existing make / give path. Not a new app.

- Kinds: short work, delivery, removal.
- Delivery fields: window (can be today), vehicle, area, pay or unknown, how many people.
- Removal fields: window, van or not, how many people, what is excluded. No “insured” or “licensed” unless a reviewed field exists.
- A person can say “I can do this in this place from today” without that sentence becoming a shift. The shift is a post they accept in conversation.
- Expiry is enforced. A lunchtime delivery disappears after the window.
- Construction and anything structural stay excluded or caveated. Test that.
- Rate-limit posts. Reports go to the existing moderation route.
- These rows join the same bundle, visually distinct from Ticketmaster.

**Done when:** a shop can post “bike needed 12–3” and someone who just set that city can see it today, and a regulated trade cannot look qualified.

### Phase 3 — surplus food

- A kitchen posts portions, pickup window, price or free or unknown, and optional notes they typed.
- Card dies at `expires_at`.
- Food-for-sale caveat is fixed copy from the app, not from a model.
- No Too Good To Go scrape, no logo, no implied partnership.
- Same bundle, kind `surplus`.

**Done when:** a quiet afternoon shows no fake meals, and a real post cannot outlive its window.

### Phase 4 — longer work

- Register Adzuna only after a human confirms the contract and the publication gate.
- Same dedupe and freshness as events.
- Apply stays on the source until the owner says otherwise.

### Phase 5 — music, projects, time with a local

As in the previous plan, still on this engine: venue night and artist need, no in-app ticket; multi-day projects with address hidden until both agree and a steward exists; a lesson or a local route that is not a checkout and not a live location.

### Phase 6 — look, then language, then the next cities

- Visual merge only after the owner’s notes on the current screens. Map interaction from section 3 is the priority.
- On-device language only after #290.
- Next city: repeat Phase 1’s checklist. Same country before a new country.

---

## 10. Definition of live

A place is live when:

- It is not marked demo.
- Every public row is member-posted or partner-sourced, with rights and last-checked.
- Expired delivery, surplus, and shifts are gone.
- The bundle is cached.
- The map and the list match.
- Empty layers say they are empty.
- Report, block, and a named steward work.
- Delivery and food do not claim employment, insurance, or safety they do not have.
- No model runs on the read path.
- The owner has said the place is live.

---

## 11. What every session reports

Pull-request body: base SHA, branch, files, phase, what you refused to build, tests and the real result, human decisions still open.

If the task needs a scrape, a dispatch tracker, a payment provider, a second matcher, or invented leftovers: stop and ask.

---

## 12. Start the next session here

1. Read section 1 so you do not rebuild the engine or ignore the open geography and ingest pull requests.
2. Do Phase 0 as review comments and rebases, not as a new design. If those pull requests are stale against `main`, say so and stop.
3. Do not start delivery, surplus, or a visual merge until Phase 1 has a named city and a cached sourced map.

The way you become the life app is not by cloning each corporation. It is by putting their kind of fact, and the facts only a local person knows, on one map that stays fast when millions of people open it, and then getting out of the way.
