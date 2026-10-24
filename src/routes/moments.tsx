import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Avatar, PageHead, fieldClass } from "@/components/bits";
import { getCity, moments } from "@/data/atlas";
import { useAtlas } from "@/lib/store";
import { cn, initialsFrom, nid } from "@/lib/utils";

export const Route = createFileRoute("/moments")({ component: MomentsPage });

function MomentsPage() {
  const cityId = useAtlas((state) => state.cityId);
  const city = getCity(cityId);
  const yourName = useAtlas((state) => state.yourName);
  const userMoments = useAtlas((state) => state.moments);
  const addMoment = useAtlas((state) => state.addMoment);
  const liked = useAtlas((state) => state.liked);
  const toggleLike = useAtlas((state) => state.toggleLike);
  const [scope, setScope] = useState<"city" | "world">("city");
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");

  const mine = userMoments.filter((moment) => scope === "world" || moment.cityId === city.id);
  const recorded = moments.filter((moment) => scope === "world" || moment.cityId === city.id);

  function onPost(event: FormEvent) {
    event.preventDefault();
    const text = caption.trim();
    if (text.length < 4) {
      setError("Say what you actually did — a few words is enough.");
      return;
    }
    addMoment({ id: nid(), cityId: city.id, caption: text });
    setCaption("");
    setError("");
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHead
        kicker="Moments"
        title="A short feed. Then go outside."
        lede="What people recorded after they closed the app. Not a scoreboard."
      />
      <div className="mt-5 flex gap-2">
        <button
          type="button"
          aria-pressed={scope === "city"}
          onClick={() => setScope("city")}
          className={cn("h-11 rounded-full px-4 text-sm font-semibold", scope === "city" ? "bg-ink text-surface" : "bg-sand text-ink")}
        >
          {city.name}
        </button>
        <button
          type="button"
          aria-pressed={scope === "world"}
          onClick={() => setScope("world")}
          className={cn("h-11 rounded-full px-4 text-sm font-semibold", scope === "world" ? "bg-ink text-surface" : "bg-sand text-ink")}
        >
          Whole atlas
        </button>
      </div>

      <form onSubmit={onPost} className="mt-6 rounded-3xl border border-line bg-surface p-4">
        <label htmlFor="moment" className="text-sm font-semibold text-ink">
          What did you actually do?
        </label>
        <textarea
          id="moment"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="A real hour. Not a highlight."
          className={cn(fieldClass, "mt-2 min-h-28 py-3")}
        />
        {error ? <p className="mt-2 text-sm font-medium text-ink">{error}</p> : null}
        <button type="submit" className="mt-3 h-11 rounded-full bg-primary px-5 text-sm font-semibold text-primary-fg">
          Add to your moments
        </button>
        <p className="mt-2 text-xs text-muted">Kept on this device so you can feel the flow. It isn't sent to anyone yet.</p>
      </form>

      <div className="mt-6 space-y-6">
        {mine.map((moment) => {
          const place = getCity(moment.cityId);
          const on = liked.includes(moment.id);
          return (
            <article key={moment.id} className="rounded-3xl border border-line bg-surface p-5">
              <div className="flex items-center gap-3">
                <Avatar initials={initialsFrom(yourName)} tone="ink" />
                <div>
                  <p className="font-semibold text-ink">{yourName.trim() || "You"}</p>
                  <p className="text-sm text-muted">{place.name} · On this device</p>
                </div>
              </div>
              <p className="mt-4 font-display text-2xl leading-snug text-ink">{moment.caption}</p>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => toggleLike(moment.id)}
                className="mt-4 inline-flex h-11 items-center gap-2 text-sm font-semibold"
              >
                <Heart className={cn("h-5 w-5", on ? "fill-primary text-primary" : "text-ink")} fill={on ? "currentColor" : "none"} />
                {on ? "Kept" : "Keep"}
              </button>
            </article>
          );
        })}
        {recorded.map((moment) => {
          const on = liked.includes(moment.id);
          const place = getCity(moment.cityId);
          return (
            <article key={moment.id} className="overflow-hidden rounded-3xl border border-line bg-surface">
              <header className="flex items-center gap-3 p-4">
                <Avatar initials={moment.initials} tone={moment.tone} />
                <div>
                  <p className="font-semibold text-ink">{moment.author}</p>
                  <p className="text-sm text-muted">
                    {place.name} · {moment.place} · {moment.when}
                  </p>
                </div>
              </header>
              <img src={moment.image} alt="" className="aspect-[4/5] w-full object-cover" />
              <p className="px-4 pt-4 text-ink">{moment.caption}</p>
              <div className="flex items-center gap-4 px-4 py-3">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleLike(moment.id)}
                  className="inline-flex h-11 items-center gap-2 text-sm font-semibold"
                >
                  <Heart className={cn("h-5 w-5", on ? "fill-primary text-primary" : "text-ink")} fill={on ? "currentColor" : "none"} />
                  {on ? "Kept" : "Keep"}
                </button>
                <Link to="/place/$id" params={{ id: moment.listingId }} className="text-sm font-semibold text-primary">
                  See the place
                </Link>
              </div>
              <p className="px-4 pb-4 text-sm text-muted">{moment.reply}</p>
            </article>
          );
        })}
      </div>
    </div>
  );
}
