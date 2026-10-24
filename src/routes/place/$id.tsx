import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Check, Heart } from "lucide-react";
import { useState } from "react";
import { AtlasBoard, Avatar, PlaceCard } from "@/components/bits";
import { cityListings, getCity, getListing } from "@/data/atlas";
import { useAtlas } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/place/$id")({ component: PlacePage });

function PlacePage() {
  const { id } = Route.useParams();
  const listing = getListing(id);
  const saved = useAtlas((state) => state.saved.includes(id));
  const toggleSaved = useAtlas((state) => state.toggleSaved);
  const [wayIndex, setWayIndex] = useState(0);

  if (!listing) {
    return (
      <div className="py-16">
        <h1 className="font-display text-4xl text-ink">That place isn't on the atlas.</h1>
        <Link to="/" className="mt-4 inline-flex h-11 items-center font-semibold text-primary">
          Back to what's recorded
        </Link>
      </div>
    );
  }

  const city = getCity(listing.cityId);
  const way = listing.ways[wayIndex] ?? listing.ways[0];
  const similar = cityListings(city.id).filter((item) => item.id !== listing.id);

  return (
    <div>
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-x-12">
        <div className="lg:col-start-1 lg:row-start-1">
          <Link to="/" className="inline-flex h-11 items-center gap-2 text-sm font-semibold text-ink">
            <ArrowLeft className="h-4 w-4" />
            All of {city.name}
          </Link>
          <div className="mt-3 overflow-hidden rounded-3xl bg-sand">
            <img src={listing.image} alt={listing.title} className="h-80 w-full object-cover sm:h-[28rem]" />
          </div>
          <p className="mt-5 text-xs font-semibold uppercase tracking-widest text-primary">
            {listing.category} · {listing.neighborhood}
          </p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-ink md:text-5xl">{listing.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-muted">{listing.summary}</p>
          <div className="mt-5 flex items-center gap-3">
            <Avatar initials={listing.host.initials} tone={listing.host.tone} />
            <div>
              <p className="font-semibold text-ink">{listing.host.name}</p>
              <p className="text-sm text-muted">{listing.host.role}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0">
          <div className="rounded-3xl border border-line bg-surface p-5 lg:sticky lg:top-20">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted">{listing.when}</p>
            <p className="mt-2 font-display text-2xl leading-snug text-ink">{way.terms}</p>
            <p className="mt-1 text-sm text-muted">{way.label}</p>
            {listing.ways.length > 1 ? (
              <div className="mt-4 grid gap-2">
                {listing.ways.map((item, index) => {
                  const on = index === wayIndex;
                  return (
                    <button
                      key={item.label}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setWayIndex(index)}
                      className={cn(
                        "rounded-2xl border px-3 py-3 text-left",
                        on ? "border-primary bg-sage" : "border-line bg-canvas",
                      )}
                    >
                      <span className="block text-sm font-semibold text-ink">{item.label}</span>
                      <span className="mt-1 block text-sm text-muted">{item.terms}</span>
                    </button>
                  );
                })}
              </div>
            ) : null}
            <ul className="mt-4 space-y-2">
              {listing.goodToKnow.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => toggleSaved(listing.id)}
              className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-fg"
            >
              <Heart className="h-5 w-5" fill={saved ? "currentColor" : "none"} />
              {saved ? "Kept in You" : "Keep this place"}
            </button>
            <p className="mt-3 text-xs text-muted">Keeping a place doesn't message anyone. Nothing here is scored.</p>
          </div>
        </div>

        <div className="mt-8 max-w-2xl lg:col-start-1 lg:row-start-2">
          <h2 className="font-display text-2xl text-ink">What it's actually like</h2>
          <p className="mt-3 text-lg leading-relaxed text-ink">{listing.story}</p>
          <h2 className="mt-8 font-display text-2xl text-ink">What's asked of you</h2>
          <p className="mt-3 text-muted">{listing.asked}</p>
          <h2 className="mt-8 font-display text-2xl text-ink">Where, roughly</h2>
          <AtlasBoard terrain={city.terrain} className="mt-3 h-56 rounded-3xl">
            <span
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-4 ring-surface"
              style={{ left: `${listing.x}%`, top: `${listing.y}%` }}
            />
            <p className="absolute right-3 bottom-3 left-3 text-xs text-ink">
              {city.coords}. Approximate — the exact spot stays private until you both agree.
            </p>
          </AtlasBoard>
          <blockquote className="mt-8 rounded-3xl bg-sand p-5">
            <p className="font-display text-xl leading-snug text-ink">“{listing.note.text}”</p>
            <footer className="mt-2 text-sm text-muted">{listing.note.by} · resident</footer>
          </blockquote>
        </div>
      </div>

      {similar.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-3xl text-ink">Also recorded in {city.name}</h2>
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((item) => (
              <PlaceCard key={item.id} listing={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
