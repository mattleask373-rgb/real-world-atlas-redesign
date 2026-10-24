import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Avatar, ChoiceRow, PageHead, fieldClass } from "@/components/bits";
import { cityListings, getCity } from "@/data/atlas";
import { useAtlas } from "@/lib/store";
import { cn, nid } from "@/lib/utils";

type GiveSearch = { mode?: "hour" };

export const Route = createFileRoute("/give")({
  validateSearch: (search: Record<string, unknown>): GiveSearch => ({
    mode: search.mode === "hour" ? "hour" : undefined,
  }),
  component: GivePage,
});

const WHENS = ["This week", "Mornings", "Not sure yet"];

function GivePage() {
  const initial = Route.useSearch().mode === "hour" ? "hour" : "skill";
  const cityId = useAtlas((state) => state.cityId);
  const city = getCity(cityId);
  const offers = useAtlas((state) => state.offers);
  const addOffer = useAtlas((state) => state.addOffer);
  const [kind, setKind] = useState<"skill" | "hour">(initial);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [when, setWhen] = useState(WHENS[0]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const recorded = cityListings(city.id);
  const mine = offers.filter((offer) => offer.cityId === city.id);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (title.trim().length < 3) {
      setError("Say it plainly — a few words is enough.");
      return;
    }
    addOffer({ id: nid(), cityId: city.id, kind, title: title.trim(), note: note.trim(), when });
    setDone(true);
    setError("");
  }

  return (
    <div>
      <PageHead
        kicker={city.name}
        title="What can you give?"
        lede="An hour, a skill, a pair of hands. This is an offer, not a promise that you'll be free."
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          {done ? (
            <div className="rounded-3xl border border-line bg-surface p-6">
              <h2 className="font-display text-3xl text-ink">Recorded on this device.</h2>
              <p className="mt-2 text-muted">
                In the full network this would carry your name to people in {city.name}. Here it stays with you, so you can feel the shape of it.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  setTitle("");
                  setNote("");
                }}
                className="mt-5 h-11 rounded-full bg-ink px-5 text-sm font-semibold text-surface"
              >
                Offer something else
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-surface p-5">
              <ChoiceRow
                label="Kind of offer"
                value={kind}
                onChange={setKind}
                options={[
                  { value: "skill", label: "A skill" },
                  { value: "hour", label: "An hour" },
                ]}
              />
              <label htmlFor="offer-title" className="mt-5 block text-sm font-semibold text-ink">
                {kind === "hour" ? "An hour of what?" : "What can you do?"}
              </label>
              <input
                id="offer-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={cn(fieldClass, "mt-2")}
                placeholder={kind === "hour" ? "An hour of weeding" : "I can repair a door"}
                maxLength={80}
              />
              <label htmlFor="offer-note" className="mt-4 block text-sm font-semibold text-ink">
                Anything they should know
              </label>
              <textarea
                id="offer-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className={cn(fieldClass, "mt-2 min-h-28 py-3")}
                placeholder="No promises. Just the shape of it."
              />
              <div className="mt-4">
                <ChoiceRow
                  label="Roughly when"
                  value={when}
                  onChange={setWhen}
                  options={WHENS.map((item) => ({ value: item, label: item }))}
                />
              </div>
              {error ? <p className="mt-3 text-sm font-medium text-ink">{error}</p> : null}
              <button type="submit" className="mt-5 h-12 rounded-full bg-primary px-6 font-semibold text-primary-fg">
                Record this offer
              </button>
            </form>
          )}
        </div>
        <section>
          <h2 className="font-display text-2xl text-ink">Already offered in {city.name}</h2>
          <ul className="mt-4 space-y-4">
            {mine.map((offer) => (
              <li key={offer.id} className="flex gap-3">
                <Avatar initials="You" tone="ink" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">On this device</p>
                  <p className="font-semibold text-ink">{offer.title}</p>
                  <p className="text-sm text-muted">
                    {offer.kind === "hour" ? "An hour" : "A skill"} · {offer.when}
                  </p>
                  {offer.note ? <p className="mt-1 text-sm text-muted">{offer.note}</p> : null}
                </div>
              </li>
            ))}
            {recorded.map((listing) => (
              <li key={listing.id} className="flex gap-3">
                <Avatar initials={listing.host.initials} tone={listing.host.tone} />
                <div>
                  <p className="font-semibold text-ink">{listing.host.name}</p>
                  <p className="text-sm text-ink">{listing.ways[0].label}</p>
                  <p className="text-sm text-muted">{listing.ways[0].terms}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
