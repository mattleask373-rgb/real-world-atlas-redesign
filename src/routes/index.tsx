import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Map, Route as RouteIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import {
  ChoiceRow,
  EmptyState,
  FeaturedPlace,
  PlaceCard,
  SearchField,
  Avatar,
} from "@/components/bits";
import {
  FILTERS,
  cityListings,
  getCity,
  matchesFilter,
  moments,
  sampleNeeds,
  cities,
  type Category,
  type FilterName,
} from "@/data/atlas";
import { suggestHours } from "@/lib/match";
import { useAtlas } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

const DOORS = [
  { to: "/need", title: "I need something", body: "Ask for a hand, a skill, or work.", icon: Search },
  { to: "/give", title: "I can help", body: "Say what you can do. No schedule promised.", icon: Heart },
  { to: "/journey", title: "I'm travelling", body: "Arrange real days from what's already here.", icon: RouteIcon },
  { to: "/map", title: "Show me the map", body: "Approximate pins. Never an exact address.", icon: Map },
] as const;

function Home() {
  const cityId = useAtlas((state) => state.cityId);
  const setCity = useAtlas((state) => state.setCity);
  const query = useAtlas((state) => state.query);
  const setQuery = useAtlas((state) => state.setQuery);
  const city = getCity(cityId);
  const [filter, setFilter] = useState<FilterName>("All");
  const [time, setTime] = useState<1 | 2 | 3 | 5>(2);
  const [spend, setSpend] = useState<"free" | "low" | "any">("free");
  const [company, setCompany] = useState<"solo" | "few" | "lively">("few");
  const [outdoors, setOutdoors] = useState<"yes" | "any">("any");
  const [feel, setFeel] = useState<Category | "All">("All");
  const [picked, setPicked] = useState(false);

  useEffect(() => {
    setPicked(false);
  }, [cityId]);

  const q = query.trim().toLowerCase();
  const focused = q.length > 0 || filter !== "All";
  const filtered = cityListings(city.id).filter((listing) => {
    if (!matchesFilter(listing, filter)) return false;
    if (!q) return true;
    const blob = `${listing.title} ${listing.summary} ${listing.neighborhood} ${listing.category} ${listing.host.name}`.toLowerCase();
    return blob.includes(q);
  });
  const featured = filtered.find((listing) => listing.featured) ?? filtered[0];
  const rest = featured ? filtered.filter((listing) => listing.id !== featured.id) : filtered;
  const here = cityListings(city.id);
  const needs = sampleNeeds.filter((need) => need.cityId === city.id);
  const shots = moments.filter((moment) => moment.cityId === city.id);
  const suggestion = picked
    ? suggestHours({ cityId: city.id, time, spend, company, outdoors, feel })
    : null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{city.country}</p>
      <h1 className="mt-2 max-w-3xl font-display text-4xl leading-tight text-ink md:text-6xl">
        What's actually happening in <span className="italic text-primary">{city.name}</span>
      </h1>
      <p className="mt-3 max-w-xl text-lg text-muted">Real work, tables, music, and hours. Then put the phone away.</p>
      <div className="mt-6 max-w-3xl" id="search">
        <SearchField value={query} onChange={setQuery} placeholder="Search a wall, a meal, a song, a bed…" />
      </div>

      <div className="rail -mx-4 mt-6 flex gap-3 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
        {cities.map((item) => {
          const on = item.id === city.id;
          return (
            <button key={item.id} type="button" onClick={() => setCity(item.id)} className="w-36 shrink-0 text-left">
              <img
                src={item.hero}
                alt=""
                className={cn("h-20 w-full rounded-2xl object-cover", on && "ring-2 ring-primary ring-offset-2 ring-offset-canvas")}
              />
              <span className={cn("mt-2 block text-sm font-semibold", on ? "text-primary" : "text-ink")}>{item.name}</span>
              <span className="block text-xs text-muted">{item.country}</span>
            </button>
          );
        })}
      </div>

      <div className="rail mt-5 flex gap-2 overflow-x-auto">
        {FILTERS.map((item) => {
          const on = filter === item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(item)}
              className={cn(
                "h-11 shrink-0 rounded-full px-4 text-sm font-semibold",
                on ? "bg-ink text-surface" : "border border-line bg-surface text-ink",
              )}
            >
              {item === "All" ? "Everything" : item}
            </button>
          );
        })}
      </div>

      {focused ? (
        <section className="mt-8">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="font-display text-3xl text-ink">
              {filtered.length === 0 ? "Nothing recorded for that" : "What matches"}
            </h2>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFilter("All");
              }}
              className="h-11 shrink-0 text-sm font-semibold text-primary"
            >
              Clear
            </button>
          </div>
          {filtered.length === 0 ? (
            <EmptyState
              title={`Nothing in ${filter === "All" ? "that search" : filter} yet`}
              body={`If it isn't recorded in ${city.name}, it isn't here. You can be the one who puts it on.`}
              to="/give"
              action="Offer something here"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((listing) => (
                <PlaceCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="mt-8">
            {featured ? <FeaturedPlace listing={featured} /> : null}
            {rest.length > 0 ? (
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((listing) => (
                  <PlaceCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : null}
          </section>

          <section className="mt-14">
            <h2 className="font-display text-3xl text-ink">Here this week</h2>
            <p className="mt-1 text-muted">People, not profiles with scores.</p>
            <div className="rail -mx-4 mt-4 flex gap-5 overflow-x-auto px-4">
              {here.map((listing) => (
                <Link key={listing.id} to="/place/$id" params={{ id: listing.id }} className="w-28 shrink-0 text-center">
                  <span className="inline-flex rounded-full ring-2 ring-primary ring-offset-2 ring-offset-canvas">
                    <Avatar initials={listing.host.initials} tone={listing.host.tone} className="h-16 w-16 text-base" />
                  </span>
                  <span className="mt-2 block text-sm font-semibold text-ink">{listing.host.name.split(" ")[0]}</span>
                  <span className="block text-xs text-muted">{listing.category}</span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-14 rounded-3xl border border-line bg-surface p-5 sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">A few hours</p>
            <h2 className="mt-2 font-display text-3xl text-ink">Tell us roughly. We'll show three things.</h2>
            <p className="mt-2 max-w-xl text-muted">Not a hundred. Only what is actually recorded in {city.name}.</p>
            <div className="mt-6 grid gap-5">
              <ChoiceRow
                label="Time"
                value={String(time)}
                onChange={(value) => setTime(Number(value) as 1 | 2 | 3 | 5)}
                options={[
                  { value: "1", label: "1 hr" },
                  { value: "2", label: "2 hr" },
                  { value: "3", label: "3 hr" },
                  { value: "5", label: "5 hr" },
                ]}
              />
              <ChoiceRow
                label="Spend"
                value={spend}
                onChange={setSpend}
                options={[
                  { value: "free", label: "Nothing" },
                  { value: "low", label: "A little" },
                  { value: "any", label: "Don't mind" },
                ]}
              />
              <ChoiceRow
                label="Company"
                value={company}
                onChange={setCompany}
                options={[
                  { value: "solo", label: "On my own" },
                  { value: "few", label: "A few people" },
                  { value: "lively", label: "Somewhere lively" },
                ]}
              />
              <ChoiceRow
                label="Outside"
                value={outdoors}
                onChange={setOutdoors}
                options={[
                  { value: "yes", label: "Outdoors" },
                  { value: "any", label: "Don't mind" },
                ]}
              />
              <ChoiceRow
                label="Feels like"
                value={feel}
                onChange={setFeel}
                options={[
                  { value: "All", label: "Anything" },
                  { value: "Work", label: "Work" },
                  { value: "Experiences", label: "Experiences" },
                  { value: "Music", label: "Music" },
                  { value: "Food", label: "Food" },
                  { value: "Nature", label: "Nature" },
                  { value: "Community", label: "Community" },
                ]}
              />
            </div>
            <button
              type="button"
              onClick={() => setPicked(true)}
              className="mt-6 h-12 rounded-full bg-primary px-6 font-semibold text-primary-fg"
            >
              Show three
            </button>
            {suggestion ? (
              <div className="mt-6">
                <h3 className="font-display text-2xl text-ink">
                  {suggestion.items.length === 0
                    ? "Nothing recorded here fits that."
                    : suggestion.items.length < 3
                      ? "This is all that fits."
                      : suggestion.exact >= 3
                        ? "Three things. Not a hundred."
                        : "The closest three that exist."}
                </h3>
                {suggestion.items.length === 0 ? (
                  <p className="mt-2 text-muted">Loosen one filter, or be the person who records the first hour.</p>
                ) : (
                  <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {suggestion.items.map((listing) => (
                      <PlaceCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </section>

          <section className="mt-14">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-display text-3xl text-ink">Asked for nearby</h2>
              <Link to="/need" className="h-11 text-sm font-semibold text-primary">
                Ask
              </Link>
            </div>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {needs.map((need) => (
                <li key={need.id} className="py-4">
                  <p className="font-semibold text-ink">{need.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {need.from} · {need.when}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-14">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-display text-3xl text-ink">Seen around {city.name}</h2>
              <Link to="/moments" className="text-sm font-semibold text-primary">
                Moments
              </Link>
            </div>
            <div className="rail -mx-4 mt-4 flex gap-3 overflow-x-auto px-4">
              {shots.map((moment) => (
                <Link key={moment.id} to="/moments" className="w-44 shrink-0">
                  <img src={moment.image} alt="" className="aspect-[3/4] w-full rounded-3xl object-cover" />
                  <p className="mt-2 line-clamp-3 text-sm text-ink">{moment.caption}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {DOORS.map((door) => {
              const Icon = door.icon;
              return (
                <Link key={door.title} to={door.to} className="flex min-h-36 flex-col rounded-3xl border border-line bg-surface p-4">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="mt-4 font-semibold text-ink">{door.title}</span>
                  <span className="mt-1 text-sm text-muted">{door.body}</span>
                </Link>
              );
            })}
          </section>

          <footer className="mt-16 border-t border-line pt-10 text-center">
            <p className="font-display text-3xl text-ink italic md:text-4xl">Put the phone away. Go live it.</p>
            <p className="mx-auto mt-3 max-w-md text-sm text-muted">
              Places are approximate. Exact addresses stay between you and the person you're meeting.
            </p>
          </footer>
        </>
      )}
    </div>
  );
}
