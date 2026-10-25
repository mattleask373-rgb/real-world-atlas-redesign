# Where the systems actually live

This repository is the visual reference. It is not the product and it is not the AI system.

The operating plan for a global merge is in the live app, on a review branch (not merged):

- Pull request: https://github.com/mattleask373-rgb/life-lived-network/pull/410
- Note: https://github.com/mattleask373-rgb/life-lived-network/blob/agent/grok/global-ai-architecture-merge/docs/ai/GLOBAL-MARKET-AI-AND-DESIGN-MERGE.md

Do not port `src/data/atlas.ts`, `src/lib/match.ts`, or `src/lib/store.ts` into the live app. Those are example data and a local toy matcher. Discovery stays `findSupply()` in `life-lived-network`. A model is only for language (drafts, and later questions about records that already exist). It does not generate places, people, or prices. Map browsing costs no AI tokens.
