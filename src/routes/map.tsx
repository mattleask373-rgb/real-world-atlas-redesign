import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AtlasBoard, EmptyState } from "@/components/bits";
import { FILTERS, cityListings, getCity, matchesFilter, type FilterName } from "@/data/atlas";
import { useAtlas } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({ component: MapPage });

function MapPage() {
  const cityId = useAtlas((state) => state.cityId);
  const city = getCity(cityId);
  const [filter, setFilter] = useState<FilterName>("All");
  const [selected, setSelected] = useState<string | null>(null);
  const shown = cityListings(city.id).filter((listing) => matchesFilter(listing, filter));
  const activeId = shown.some((listing) => listing.id === selected) ? selected : (shown[0]?.id ?? null);

  return (
    <div className="lg:grid lg:grid-cols-2">
      <div className="h-80 lg:sticky lg:top-16 lg:h-[calc(100svh-4rem)]">
        <AtlasBoard terrain={city.terrain} className="h-full">
          <span className="absolute top-4 right-4 font-display text-sm text-ink">N</span>
          {shown.map((listing) => {
            const on = listing.id === activeId;
            return (
              <div key={listing.id} className="absolute z-10" style={{ left: `${listing.x}%`, top: `${listing.y}%` }}>
                <button
                  type="button"
                  onClick={() => setSelected(listing.id)}
                  aria-label={listing.title}
                  className="flex -translate-x-1/2 -translate-y-full flex-col items-center"
                >
                  <span className={cn("h-11 w-11 overflow-hidden rounded-full border-2 bg-surface", on ? "border-primary" : "border-surface")}>
                    <img src={listing.image} alt="" className="h-full w-full object-cover" />
                  </span>
                </button>
                {on ? (
                  <Link
                    to="/place/$id"
                    params={{ id: listing.id }}
                    className="absolute top-1 left-1/2 max-w-40 -translate-x-1/2 truncate rounded-full bg-ink px-3 py-2 text-xs font-semibold text-surface"
                  >
                    {listing.title}
                  </Link>
                ) : null}
              </div>
            );
          })}
          <p className="pointer-events-none absolute right-4 bottom-4 left-4 max-w-sm rounded-2xl bg-surface/90 px-3 py-2 text-xs text-muted">
            {city.name} · {city.coords}
            <span className="mt-1 block text-ink">Pins are approximate. Exact locations are never on this map.</span>
          </p>
        </AtlasBoard>
      </div>
      <div className="px-4 py-4 pb-28 sm:px-6 lg:max-h-[calc(100svh-4rem)] lg:overflow-y-auto lg:pb-8">
        <h1 className="font-display text-3xl text-ink">{city.name}</h1>
        <p className="mt-1 text-sm text-muted">{city.blurb}</p>
        <div className="rail mt-4 flex gap-2 overflow-x-auto">
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
        {shown.length === 0 ? (
          <div className="mt-6">
            <EmptyState
              title={`No ${filter.toLowerCase()} recorded in ${city.name}`}
              body="We don't invent a pin to fill the map. Offer one if you know it's real."
              to="/give"
              action="Offer something"
            />
          </div>
        ) : (
          <ul className="mt-4 space-y-2">
            {shown.map((listing) => {
              const on = listing.id === activeId;
              const way = listing.ways[0];
              return (
                <li key={listing.id} id={`row-${listing.id}`} className={cn("flex items-center gap-2 rounded-2xl p-2", on && "bg-sage")}>
                  <button type="button" onClick={() => setSelected(listing.id)} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                    <img src={listing.image} alt="" className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-ink">{listing.title}</span>
                      <span className="block truncate text-sm text-muted">
                        {listing.neighborhood} · {way.terms}
                      </span>
                    </span>
                  </button>
                  <Link
                    to="/place/$id"
                    params={{ id: listing.id }}
                    className="inline-flex h-11 shrink-0 items-center px-2 text-sm font-semibold text-primary"
                  >
                    Open
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
