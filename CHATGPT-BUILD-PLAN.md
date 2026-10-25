# ChatGPT build plan — one real-world ecosystem, ready for millions

**Who this is for:** ChatGPT (or any coding agent) working on Real World Atlas / The Living World.
**Canonical code:** https://github.com/mattleask373-rgb/life-lived-network
**Live site today:** https://life-lived-network.lovable.app (it lags `main`. `/explore` is 404 there. Do not treat the site as the source of truth.)
**Visual reference only:** https://github.com/mattleask373-rgb/real-world-atlas-redesign
**Prior architecture note:** https://github.com/mattleask373-rgb/life-lived-network/pull/410
**Status of this file:** execution plan. It does not authorise a merge, a deploy, a new database, or a public model.

The owner’s brief, in one line: stop scrolling and become part of a global community of like-minded people, with the useful parts of daily life in one ecosystem.

---

## 0. How to use this document

1. Read this file once before any edit.
2. Then read, in the canonical repo: `docs/agents/EXTERNAL-COLLABORATORS.md`, `docs/agents/INVARIANTS.md`, `docs/adr/001-canonical-supply-engine.md`, both ADR 003s, `docs/ai/GROUNDED-ASSISTANT-AND-GLOBAL-INTEGRATION.md`, `docs/ai/grounded-matching.md`.
3. Do the **next unblocked task** in section 15. One pull request. Stop.
4. Do not invent a parallel app, a parallel matcher, or sample people to make a city look alive.

Working rules:

- Branch: `agent/chatgpt/<short-task>`. Never push `main`. Never force-push. Never merge. A human merges.
- Do not edit `src/integrations/supabase/*`, `src/routeTree.gen.ts`, `.env`, `supabase/config.toml`.
- Do not add a migration that drops, renames, or weakens RLS.
- If Lovable touched a file in the last day, comment, do not edit it.
- CI in `.github/workflows/verify.yml` must pass. Do not weaken a test.
- Extend `src/lib/supply-engine.ts`. Do not create a second discovery engine, a vector database, or a recommendation graph.
- Unknown stays unknown. Quiet is a valid result. Fixtures never become production data.

---

## 1. Product

People open the app to leave it. The session ends in the real world: a shift, a gig, a room with music, a garden that needs hands, a week on a project, an afternoon learning something with a local.

It is one ecosystem, not five startups glued together:

| Door | What the person feels | First supply | Later supply |
|---|---|---|---|
| What’s happening here | Tonight and this week, near me | Licensed event APIs | Venues, artists, and neighbours posting a real night |
| Work, longer | A job that is actually listed | Adzuna adapter already in the repo. Add another board only with a contract | Employers posting here |
| Work, short | Cleaning, gardening, a day’s labour, a pair of hands | Member offers, with hours and an expiry | Repeat hosts, still not a score |
| Music | A room, a band, a fan, a venue, without a promoter in the middle | Ticketed shows from an API, clearly sourced | Artist + venue agree a night inside the app |
| Community projects | Weeks, not gigs. Somewhere to stay and something to do. In the spirit of WWOOF and Workaway. Do not use their names in the product | Member-hosted projects | A density of projects in a region |
| With a local | Learn a language, cross a set of islands, cook a meal. In the spirit of GetYourGuide, hosted by a person | Member-hosted sessions | The same, with confirm-before-you-pay |
| People like you | You meet because of the thing, not because of a feed | The record you both showed up for | A life list and a conversation, still not a follower graph |

The heartbeat is the opposite of a doom scroll. No infinite ranked feed. No global star rating. No “people you may know” built from surveillance. Three honest things, then an action.

---

## 2. What is already built — do not rebuild it

Repository `mattleask373-rgb/life-lived-network`, `main` at or after `c48599ee574c275737df31b4db73ea50dec23ebb`.

| Already there | Where | Use it for |
|---|---|---|
| The only discovery engine | `src/lib/supply-engine.ts` `findSupply()` | Every door above. Bands: direct, local capability, open to opportunities, journey, community, contribution, skills exchange, related. Each band has a heading and a caveat. |
| Geography | `src/lib/geo-scope.ts` | A need covers a place and what is inside it. A person matches only if they **declared** a service area. Passing through is not being available. Unknown place fails closed. |
| Ranking | `src/lib/grounded-matching.ts` `groundedMatch()`, `threeHours()` | “I have a few hours.” Ranks records it is given. Does not fetch. Does not invent. |
| Themes | `src/lib/explore-topics.ts`, `/explore`, `/explore/$topic` | Work, experiences, music, art, community, people, nature, food. A theme opens the same map. It is not proof the theme exists in that town. |
| Place pages | `src/routes/$country.$place.tsx` and `$service` | The public face of a locality. |
| Home, journey, road trip, give, need, make, profile, life list, conversations, memories, moderation | `src/routes/*` | The doors. Memories stay private and out of discovery. |
| Jobs ingest | `src/lib/ingest/adzuna*.ts` | Longer-term work, with provenance. |
| Events ingest | `src/lib/ingest/ticketmaster.ts` | What’s on, with provenance. |
| Ingest contract | `src/lib/ingest/contract.ts`, `dedupe.ts`, `freshness.ts`, `normalise.ts`, `registry.ts`, `refresh.server.ts` | Every new source. |
| Taxonomy | `src/lib/service-taxonomy.ts` | Categories. Extend it. Do not fork it. |
| Hours | `src/lib/hours.ts` | Time bounds. |
| Journey | `src/lib/journey-engine.ts` | A trip made of recorded things. |
| Needs | `src/lib/needs.ts` | Someone asking. |
| Draft assist | `src/lib/draft-assist.server.ts` | The only billable model. Lovable gateway, model id `openai/gpt-6-astra`, 800 output tokens, 0 retries, 30s. Kill switch `DRAFT_ASSIST_DISABLED=true`. Quota (5/hour, 20/day) is **not live** until issue #290 is proven. |
| World records | `src/lib/world-data.ts`, `src/lib/listings.ts` | The public record shape. |

The redesign repo is look-and-feel only. Do not import `src/data/atlas.ts`, `src/lib/match.ts`, `src/lib/store.ts`, or `public/media/*` from it. Those are example cities and a toy matcher.

The live Lovable site is a **demo of Lisbon**. It says so. Leave that label until a row has a real source.

---

## 3. One record, many doors

Every door reads and writes the same public record. A new feature is a new way in, not a new database of “gigs” or “concerts” or “experiences”.

A public record needs, at minimum:

- Canonical place id (from the existing place hierarchy), never a raw GPS pin of a person.
- Kind: event, longer work, short work, project, session with a local, community hour.
- Who posted it, and whether they are a partner feed or a member.
- Source name, licence or rights note, and `last_checked_at` for anything ingested.
- When it starts, when it ends, and when the offer expires.
- What is known about pay, in integer minor units and an explicit currency. Missing pay stays missing.
- What the person is offering to do, distinct from whether they are free, distinct from whether they are qualified.
- A supply band, so the screen can say the caveat in plain language.
- Demo flag. Demo never counts as supply.

Matching rules that are already law:

- Capability is not willingness. Willingness is not availability.
- A journey is not availability and not a live location.
- Living in a place is not serving that place. Selecting a place is not travelling through it.
- Skill is not a role and not a qualification.
- Regulated work (construction, electrical, gas, food for sale, transport of people, childcare, health, legal, financial) is never shown as “qualified” unless the record itself carries a checked qualification. If it does not, exclude it or show the caveat. Do not let a model upgrade it.

---

## 4. Heartbeat — stop scrolling

Design every screen so a session has an end.

- Open on a place, not on a global feed.
- Show a handful of things that are recorded. Three is the default for “today” and “a few hours”.
- Each card is a real next step: go, ask, offer, save. Not a like.
- No infinite scroll of suggested strangers. No follower counts. No streak.
- “People like you” means people gathered around the same real thing: this gig, this night, this project, this lesson.
- After they commit, the app should feel finished. A short confirmation, then nothing left to browse.
- Empty is designed, not shameful: “Nothing recorded here yet. Be the one who puts it on.”
- Photography and type may follow the redesign reference. Behaviour follows this file.

The current public UI (The Living World) already has the bones: place, eight layers, a rough map, happening soon, do something today, a few hours, journey, give an hour. The redesign is the calmer, more photographic version of those bones. Merge the look later, in small PRs, after the owner has said which parts of the current screens to keep. Do not restyle and re-platform in the same PR.

---

## 5. Scale shape for millions of daily users

Millions of daily users is a **read** problem if the product is built correctly. It is a disaster if every open calls a model or a partner API.

Illustrative load, so the shape is obvious, not a promise:

- 5 million daily people, 20 opens each = 100 million reads a day. Average a bit over 1,000 reads a second. Peaks several times that.
- Those reads must be a **cached bundle for a place**, not a fresh query per phone.
- 95% from a CDN or edge cache. Origin and Postgres then see a few hundred reads a second. That is ordinary.
- Partner calls are per place, not per person. Ten thousand active places, refreshed on a schedule, is hundreds of thousands of calls a day, deduped. A million people in one city still cost one refresh.
- Member writes are the small stream. Even if 2% post once a day, that is on the order of 100,000 writes a day.
- Model calls on the read path: **zero.**

Architecture:

1. **Stateless app servers.** The web app already deploys as a server-rendered app. Keep discovery pure and testable in `findSupply` / `groundedMatch`. No global in-memory feed.
2. **Postgres (the existing Supabase project) is the system of record.** Index by canonical place id, kind, time window, and expiry. Do not add a graph database or a vector index for discovery. ADR 001 forbids it.
3. **Locality bundle.** For each place and layer, a JSON document of the eligible public records, small, with a hash and a generated-at time. Cache it. Invalidate it when a record in that place changes or a refresh lands. The phone downloads the bundle and renders it.
4. **Ingest workers, separate from the web process.** One queue. Each job is “refresh source X for place Y”. Idempotent. Backoff. A failed partner does not blank the last good bundle; it shows the last-checked time and ages out when `expires_at` passes.
5. **Reads scale out. Writes stay simple.** One primary database until a measured bottleneck. Read replicas and a second region only after a load test says so. Do not start with multi-region complexity.
6. **A place is the tenant of the cache, not the user.** Personalisation is a filter on the bundle (hours, spend, company, outdoors, theme). It is not a private ranking model.
7. **Feature flag per locality.** One city can be live. The rest of the world stays honest and quiet. This is how you go global without faking global.
8. **Abuse and moderation scale with posts, not with page views.** Budget for a report queue, rate limits on `make` / `give` / `need`, and a human steward per live city. Issue #290 (durable abuse controls) is a launch blocker for anything that calls a model or accepts anonymous floods.
9. **Target, once a city is real:** a cached home in the low hundreds of milliseconds, a bundle measured in tens of kilobytes, and a test that a quiet place returns an empty list rather than filler.

What will actually hurt at millions: trust, stale jobs, duplicate events, and moderation. Not the web server. Build for those.

---

## 6. Outsourced first, then members

Order is fixed.

**Stage A — labelled outside supply**

- Events: finish the Ticketmaster path through `src/lib/ingest/` so a real place can show shows that are actually on sale. Every card says the source and when it was checked. It links onward for tickets. This app is not the ticket seller yet.
- Longer work: Adzuna is the first board. Indeed and Seek are the same *shape*, but only after a written contract and a licence field. Do not scrape them. Do not put their logos up as if there were a partnership.
- Dedupe with the existing dedupe module. A job that appears on two boards is one row with two sources, or it is suppressed. Never two cards for one shift.
- Expiry and cancellation are part of the adapter, not a later cleanup.
- Raw partner JSON is never what the UI reads. Normalise, then `findSupply`.

**Stage B — members post the things feeds will never have**

- A short gig. “Kitchen hands Saturday, paid the same day.”
- A venue holding an empty night.
- An artist who needs that night.
- A project that needs people for two weeks and has a bed.
- A person who will spend a morning teaching a language.
- A neighbour who needs a garden dug.

These are the same record, source = member, band = direct or contribution or skills exchange, with an expiry. Draft assist may help them write. It may not add a wage, a date, or an address they did not type. Nothing publishes itself.

**Stage C — density**

A city graduates from “mostly sourced” to “mostly ours” when member rows outnumber partner rows and a steward can keep them fresh. Do not flip a global switch. Flip a place.

Never fill a gap with a model. A gap is the invitation.

---

## 7. Work

Two products inside one engine.

**Longer work (Indeed / Seek kind).**
Ingested `WorkOpportunity` rows. Show title, place, pay if the source gave it, contract type if the source gave it, source, last checked. Applying goes to the source until the owner decides this app takes applications. Do not imply the job is still open if `last_checked_at` is old. The work-opportunity presentation module is the UI seam. Keep the publication gate: sourced jobs stay unpublished until rights and review say otherwise. That gate is already the rule. Do not quietly open it.

**Short work (a day or a week).**
Cleaning a flat, a garden, a market stall, a pair of hands on a site. Member-posted. Fields: task, place, window, hours, pay or “pay not stated”, tools, and whether it is physically hard. Expires when the window ends.

Construction is on the regulated list. A card may say “they asked for labour on a build”. It must not say “builder”, “licensed”, or “safe” unless a qualification review exists. Electrical, gas, and anything structural stay out until that review exists. Gardening and ordinary cleaning can ship earlier.

Airbnb the company is not integrated. “Cleaning a short-stay flat” is just a short-work record a host posts. Do not use Airbnb’s brand, and do not pull their private calendars.

Matching: the person says the places they will work and the work they will do. `geo-scope` decides reach. The band caveat stays on the card. “I can garden” is not “I am free Tuesday”.

---

## 8. Music — artists, fans, venues, without the middle

Purpose: a new artist can find a room, a venue can fill an empty night, a fan can see it because it was recorded here. Big ticketing companies are a *source* for shows that already exist, not the only way a night can happen.

**From APIs.** Ticketmaster (and later other licensed event APIs) for announced shows. Label them. Do not copy their inventory into a fake box office.

**From people.** Three roles, all members, all optional:

- Venue: “We have Tuesday from 8, 80 people, door take or a small fee, you bring the sound.” Capacity and terms are theirs.
- Artist: “We need a room this month, 45 minutes, we can bring 30 people.”
- Fan: save the night, or say they will come. A save is not a ticket and not a promise of a crowd.

`findSupply` connects an artist’s need to a venue’s offer in the same place and overlapping dates. The screen shows the two records and the caveats. The people confirm with each other in the existing conversations path. The app does not invent a booking.

**Not in the first music release:** taking payment, issuing tickets, holding deposits, streaming recorded music, or replacing a performing-rights licence. Say plainly when a night is “agreed between artist and venue” versus “listed by Ticketmaster”. A pop-up in a kitchen is allowed. Pretending it is a permitted public concert is not.

Growth of this door is how the community starts to feel like a scene: repeat nights, the same room, new names. Still no follower feed. The history of a room is a list of nights that happened, written by the people who were there, and private memories stay private.

---

## 9. Community projects — the WWOOF / Workaway kind

A project is not a gig and not a job.

Fields: place, what the work actually is, how many hours a day, how many days, whether there is a bed or a meal, who else is there, what it costs (often nothing, sometimes a contribution), and what the host will not pretend to offer.

Band: contribution or skills exchange, not “paid role”, unless money is really offered.

Rules:

- A bed is not availability of the host, and not consent to anything off the page.
- The host’s exact address is shared only after both sides agree, never on the public map.
- “Like-minded” is the project’s own description (a farm, a rebuild, a kitchen, a festival build), not a personality score.
- No scraping of WWOOF, Workaway, or HelpX. People who want those visitors post the project here, in their own words.
- Safety: report, block, and a steward. Stays of more than a few days are a higher moderation bar than a two-hour gig. Ship the short gig first.

---

## 10. With a local — the GetYourGuide kind, without the marketplace tax

A visitor wants a person, not a package. Learn Spanish in a city in South America. Island-hop with someone who lives in Indonesia. Cook, walk, fish, rehearse.

This is an experience record:

- Place, language, size of group, hours, what you will actually do, what it costs or that cost is unstated, what the guest must be able to do.
- The host confirms before anyone travels or pays. The card says “not a booking” until a real booking system exists. Do not build payments in the same PR as the form.
- Suggestions never outrank an empty truth. If nobody in that town has offered to teach, the page says so.
- The host sets the area they will meet people in. The visitor’s holiday route is a journey (`journey-engine`, `road-trip`). A journey is not the host’s live location.

Do not scrape GetYourGuide, Viator, or Airbnb Experiences. Do not show their prices as if they were ours.

---

## 11. Like-minded people, without a social network

Connection is a side effect of a true plan.

- You see someone because they posted the thing, or they are in the same project, or they answered.
- Conversations already exist as a route. They stay tied to a record.
- Life list is personal plans, not a broadcast.
- Memories are owner-only and must not enter `findSupply`, sitemaps, or “people near you”.
- No contact graph import. No “people who viewed you”. No ranking of humans.
- Block and report apply everywhere a person is visible.

The community ecosystem is the sum of rooms, projects, gigs, and lessons in a place over time. It is not a feed.

---

## 12. AI, and who pays for tokens

The model is not the product. The records are.

- Map, theme, search, journey, and “what’s on” call **no** model.
- A phone that has an on-device model (Apple’s on-device model, Gemini Nano) may draft or explain **from the bundle already downloaded**. The company pays no token. The model may not add facts, and it may not rewrite the band caveat.
- Phones without a local model still get the full product. The cards are enough.
- Server draft assist is the fallback only, behind `DRAFT_ASSIST_DISABLED`, the unproven quota, and issue #290. Do not raise limits to “feel global”.
- Do not ask members for their own API keys.
- “Ask this place” stays off until the grounded-assistant document’s gates are met: eligible records only, citations, same-place isolation, prompt-injection tests, no writes, no retention by default.
- Do not add a vector brain to get smarter at millions of users. It would invent neighbours and bill every open. Extend `findSupply`.

---

## 13. Design

The owner is art-directing from the **current** public app before a visual merge. Do not start a redesign PR until they say which of these to change: photography and type, the map, the phone navigation, the demo label.

When they do:

- Port tokens, type, and card layout from the redesign reference onto existing components (`entry-card`, home, explore, map).
- Keep canonical props and data. A card shows only supplied facts.
- One token set. Fraunces and Manrope are the intended faces. No second theme.
- Map pins stay approximate.
- Do not import prototype photos as evidence of a real place.
- Check 375px and 1280px, keyboard, focus, and empty states.
- One surface per PR.

---

## 14. Safety, law, and money

- Addresses: public map is place-level. The exact door is shared after both people agree.
- Payments, escrow, deposits, and ticketing are a separate, owner-approved project. Until then, every card that could be mistaken for a checkout says it is not one.
- Employment law, insurance, and visas for multi-week stays differ by country. The card must not say “legal”, “insured”, or “visa-friendly” unless a reviewed source says so.
- Partner terms of service are a human decision. An agent may not open a new source.
- A market is not live because a pin exists. The readiness list in `docs/ai/GROUNDED-ASSISTANT-AND-GLOBAL-INTEGRATION.md` still applies: hierarchy, currency, timezone, taxonomy, rights, moderation, steward, indexability. Australia stays not live until that record is approved.
- Demo Lisbon stays labelled demo.

---

## 15. Phased work — do these in order

Each phase is several small PRs. Do not skip ahead because the later phase is more exciting.

### Phase 0 — already done

Engine, geography, ranking, themes, ingest seams, draft assist (dark), home, journey, give, need, make. Confirm by reading, not by rewriting.

### Phase 1 — one real city, still honest

**Goal:** a single non-demo locality can show sourced events and sourced longer-work, or an honest empty state, from a cached bundle.

Tasks:

1. Pick the locality with the owner. Do not assume Lisbon. Lisbon on the public site is demo.
2. Trace Ticketmaster and Adzuna from adapter to a public card. Document what is still fixture, what is unpublishable, and what the rights gate blocks. Write that in the PR. Change only what is needed to make the gate explicit.
3. Add the locality bundle (place + layer + time window) as a read model in front of existing queries. Cache it. Test that a second request does not call the partner.
4. Empty, stale, and duplicate tests. A dead partner leaves the last good bundle and a visible last-checked time.
5. Load-test the cached read of that one place. Record the number. Do not tune before you have it.

**Done when:** a stranger can open that place and see only sourced, unexpired rows, each with a source, or a quiet page. Demo data is not in the list.

### Phase 2 — short work from members

**Goal:** a person can post a gig that expires, and another person in that service area can find it through `findSupply`.

Tasks:

1. Extend the existing make/give flow. Do not add a new “gigs app”.
2. Required fields: task, place, window, expiry, pay-or-unstated. Optional tools and how hard it is.
3. Construction and other regulated kinds: either excluded or forced through the caveat. Add a test that an unqualified construction post cannot read as a licensed trade.
4. Rate-limit posting. Wire reports to the existing moderation route.
5. The gig appears in the same bundle as Phase 1, band direct, source member, visually distinct from Adzuna.

**Done when:** the poster can see their own expiry, a neighbour can find it, and a regulated post cannot look qualified.

### Phase 3 — music nights between people

**Goal:** a venue can post an empty night, an artist can post a need, both show up through the engine, and a fan can save the night.

Tasks:

1. Two forms on the existing make path, not a new product.
2. Match on place and overlapping dates only. Show both records. Do not auto-book.
3. Ticketmaster rows remain visibly “from the source”.
4. Conversation deep-link from the pair of records, using the existing conversations route.
5. Copy test: nothing on this screen says the app sold a ticket.

**Done when:** an artist and a venue in the same city can find each other, and a fan can save that night, with no payment code added.

### Phase 4 — projects and time with a local

**Goal:** multi-day projects and “spend a few hours with someone who lives here” use the same record and the journey engine.

Tasks:

1. Project fields from section 9. Session fields from section 10.
2. Exact address hidden until both agree. Test this.
3. Journey and road-trip can include these records. A journey never marks the host as “here now”.
4. Steward flag for the locality before projects of more than a weekend can be public. If there is no steward, the form says so and does not publish.

**Done when:** a short project and a short lesson can be posted, found, and clearly distinguished from a job and from a ticketed event.

### Phase 5 — the heartbeat UI

**Goal:** the owner’s chosen visual changes, on the existing screens, after they have directed the design.

Tasks:

1. Wait for the owner’s notes on the current Living World screens.
2. Tokens and type first.
3. Cards second, facts only.
4. Map third.
5. Phone navigation last.
6. No prototype data in any of these PRs.

### Phase 6 — language on the phone, still not a brain

**Goal:** where the phone has a local model, draft and explain run there. Where it does not, the cards stand, and server draft assist remains capped.

Tasks:

1. Do not start until #290 is done and the owner has turned the fallback on.
2. Feature-detect. No model download of multiple gigabytes inside the site.
3. Prompt fixture tests: the model cannot add a wage, a date, a qualification, or a softer caveat.
4. Measure server draft volume. If it grows with page views, you have wired it wrong.

### Phase 7 — many places

**Goal:** repeat Phase 1’s checklist per locality. A country is a set of ready places, not a launch banner.

Tasks:

1. Locality readiness record, from the grounded-assistant doc, filled in for real.
2. Turn the flag on for that place only.
3. Steward named. Moderation queue watched for a week before the next place.
4. Add a new partner source only with a contract, as a new file under `src/lib/ingest/`, registered in the existing registry.

**Done when:** ten places can be busy or quiet independently, and the cache still absorbs the reads.

---

## 16. Definition of “live”

A place is live when all of these are true:

- Its page is not marked demo.
- Every public row is member-posted or partner-sourced, with rights and a last-checked time.
- Expired rows are gone.
- The bundle is cached.
- Empty layers say they are empty.
- Report, block, and a named steward work.
- Regulated work cannot look qualified.
- No model is on the read path.
- The owner has said the place is live.

The world is not “live” as a single switch. The app is global because the same system runs everywhere, and only ready places speak.

---

## 17. What every ChatGPT session must report

In the PR body:

- Base SHA, branch name, files touched.
- Which phase and task.
- What you refused to build.
- Tests run and the actual result.
- Whether a human still owes a decision (source contract, steward, design, payments, turning a place live).

If a task needs a new matcher, a scrape, a payment provider, a vector index, a second app, or a model that fills empty cities: stop and write the question. Do not improvise.

---

## 18. Start here, next session

1. Read the files in section 0 and section 2.
2. Do Phase 1, task 2 only: a written trace of Ticketmaster and Adzuna from adapter to card, as a docs or test PR, no behaviour change unless you find they can already show a sourced row and the test is missing.
3. Stop. Wait for the owner on which city is first, and on the visual direction from the current Living World screens.

The product grows by adding doors onto one engine, one place at a time. That is how it becomes large without becoming fake. The point of the size is not the size. The point is that someone, anywhere the place is ready, can find a real thing to do with a real person, and then put the phone away.
