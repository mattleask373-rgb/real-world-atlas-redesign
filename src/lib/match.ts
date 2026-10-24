/**
 * PROTOTYPE MATCHING ONLY. suggestHours() and planTrip() rank the invented
 * listings in src/data/atlas.ts. Do not add a second matcher in
 * life-lived-network. Extend src/lib/supply-engine.ts and the existing
 * journey engine instead. Copy the screen layout, not these functions.
 */

import { getCity, listings, type Category, type Feel, type Listing } from "@/data/atlas";

export type HoursPref = {
  cityId: string;
  time: 1 | 2 | 3 | 5;
  spend: "free" | "low" | "any";
  company: "solo" | "few" | "lively";
  outdoors: "yes" | "any";
  feel: Category | "All";
};

function spendOk(listing: Listing, spend: HoursPref["spend"]) {
  if (spend === "any") return true;
  if (spend === "low") return listing.spend !== "paid";
  return listing.spend === "free";
}

export function suggestHours(pref: HoursPref) {
  const pool = listings.filter(
    (listing) => listing.cityId === pref.cityId && listing.dropIn && listing.hours > 0 && listing.hours <= pref.time,
  );
  const exact = pool.filter(
    (listing) =>
      spendOk(listing, pref.spend) &&
      listing.company === pref.company &&
      (pref.outdoors === "any" || listing.outdoors) &&
      (pref.feel === "All" || listing.category === pref.feel),
  );
  const near = pool.filter(
    (listing) => !exact.includes(listing) && spendOk(listing, pref.spend) && (pref.feel === "All" || listing.category === pref.feel),
  );
  const rest = pool.filter((listing) => !exact.includes(listing) && !near.includes(listing));
  const items = [...exact, ...near, ...rest].slice(0, 3);
  return { items, exact: exact.length };
}

export type DayPlan = {
  day: number;
  listing: Listing | null;
  line: string;
};

export function planTrip(opts: { cityId: string; days: number; budget: "free" | "low" | "any"; feels: Feel[] }) {
  const city = getCity(opts.cityId);
  const feelOk = (listing: Listing) => {
    if (opts.feels.length === 0) return true;
    const stay = listing.ways.some((way) => way.kind === "stay");
    if (opts.feels.includes("Stays") && stay) return true;
    return opts.feels.includes(listing.category);
  };
  const budgetOk = (listing: Listing) => {
    if (opts.budget === "any") return true;
    const stay = listing.ways.some((way) => way.kind === "stay");
    if (opts.budget === "free") return listing.spend === "free" || stay;
    return listing.spend !== "paid" || stay;
  };
  const inCity = listings.filter((listing) => listing.cityId === opts.cityId);
  let pool = inCity.filter((listing) => feelOk(listing) && budgetOk(listing));
  const widened = pool.length === 0;
  if (widened) pool = inCity;
  const used = new Set<string>();
  const days: DayPlan[] = [];
  for (let day = 1; day <= opts.days; day += 1) {
    const next = pool.find((listing) => !used.has(listing.id));
    if (!next) {
      days.push({ day, listing: null, line: city.openIdeas[(day - 1) % city.openIdeas.length] });
      continue;
    }
    used.add(next.id);
    const way = next.ways[0];
    days.push({ day, listing: next, line: `${next.when} · ${way.terms}` });
  }
  return { days, widened };
}
