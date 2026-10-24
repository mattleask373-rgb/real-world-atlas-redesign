import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Avatar, EmptyState, PageHead, PlaceCard, fieldClass } from "@/components/bits";
import { getCity, getListing, type Listing } from "@/data/atlas";
import { useAtlas } from "@/lib/store";
import { cn, initialsFrom } from "@/lib/utils";

export const Route = createFileRoute("/you")({ component: YouPage });

function YouPage() {
  const city = getCity(useAtlas((state) => state.cityId));
  const yourName = useAtlas((state) => state.yourName);
  const setYourName = useAtlas((state) => state.setYourName);
  const savedIds = useAtlas((state) => state.saved);
  const offers = useAtlas((state) => state.offers);
  const needs = useAtlas((state) => state.needs);
  const [draft, setDraft] = useState(yourName);

  useEffect(() => {
    setDraft(yourName);
  }, [yourName]);

  const saved = savedIds.map((id) => getListing(id)).filter((listing): listing is Listing => Boolean(listing));

  return (
    <div>
      <PageHead
        kicker="You"
        title={yourName.trim() ? yourName.trim() : "What should people call you?"}
        lede="No follower count. People nearby see what you offered, not a score."
      />
      <form
        className="mt-6 flex max-w-xl flex-col gap-3 sm:flex-row sm:items-end"
        onSubmit={(event) => {
          event.preventDefault();
          setYourName(draft.trim());
        }}
      >
        <div className="flex-1">
          <label htmlFor="your-name" className="text-sm font-semibold text-ink">
            Your name
          </label>
          <input
            id="your-name"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className={cn(fieldClass, "mt-2")}
            placeholder="The name you'd actually say"
            maxLength={40}
          />
        </div>
        <button type="submit" className="h-12 rounded-full bg-ink px-5 font-semibold text-surface">
          Save name
        </button>
      </form>
      <div className="mt-4 flex items-center gap-3">
        <Avatar initials={initialsFrom(yourName)} tone="sage" />
        <p className="text-sm text-muted">Looking around {city.name}. Offers you add stay on this device.</p>
      </div>

      <section className="mt-12">
        <h2 className="font-display text-3xl text-ink">Kept</h2>
        {saved.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Nothing kept yet"
              body="Tap the heart on a place you might actually go to."
              to="/"
              action="See what's recorded"
            />
          </div>
        ) : (
          <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((listing) => (
              <PlaceCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">Offers</h2>
            <Link to="/give" className="text-sm font-semibold text-primary">
              Add
            </Link>
          </div>
          {offers.length === 0 ? (
            <p className="mt-3 text-muted">You haven't offered an hour or a skill yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {offers.map((offer) => (
                <li key={offer.id}>
                  <p className="font-semibold text-ink">{offer.title}</p>
                  <p className="text-sm text-muted">
                    {getCity(offer.cityId).name} · {offer.when}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-3xl text-ink">Needs</h2>
            <Link to="/need" className="text-sm font-semibold text-primary">
              Ask
            </Link>
          </div>
          {needs.length === 0 ? (
            <p className="mt-3 text-muted">Nothing asked yet.</p>
          ) : (
            <ul className="mt-4 space-y-4">
              {needs.map((need) => (
                <li key={need.id}>
                  <p className="font-semibold text-ink">{need.title}</p>
                  <p className="text-sm text-muted">
                    {getCity(need.cityId).name} · {need.when}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
