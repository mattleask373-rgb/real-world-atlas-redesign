import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ChoiceRow, PageHead, fieldClass } from "@/components/bits";
import { getCity, sampleNeeds } from "@/data/atlas";
import { useAtlas } from "@/lib/store";
import { cn, nid } from "@/lib/utils";

export const Route = createFileRoute("/need")({ component: NeedPage });

const WHENS = ["Today", "This week", "Whenever"];

function NeedPage() {
  const cityId = useAtlas((state) => state.cityId);
  const city = getCity(cityId);
  const needs = useAtlas((state) => state.needs);
  const addNeed = useAtlas((state) => state.addNeed);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [when, setWhen] = useState(WHENS[1]);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const mine = needs.filter((need) => need.cityId === city.id);
  const recorded = sampleNeeds.filter((need) => need.cityId === city.id);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (title.trim().length < 3) {
      setError("Say what you need in plain words.");
      return;
    }
    addNeed({ id: nid(), cityId: city.id, title: title.trim(), note: note.trim(), when });
    setDone(true);
    setError("");
  }

  return (
    <div>
      <PageHead
        kicker={city.name}
        title="What do you need?"
        lede="A gardener. A second pair of hands. Say it plainly. If nothing's recorded, we'll say so."
      />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          {done ? (
            <div className="rounded-3xl border border-line bg-surface p-6">
              <h2 className="font-display text-3xl text-ink">Asked, on this device.</h2>
              <p className="mt-2 text-muted">
                Looking around never needs an account. Posting one, in the full network, does — so whoever helps knows who they're helping.
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
                Ask for something else
              </button>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="rounded-3xl border border-line bg-surface p-5">
              <label htmlFor="need-title" className="block text-sm font-semibold text-ink">
                What do you need?
              </label>
              <input
                id="need-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={cn(fieldClass, "mt-2")}
                placeholder="Someone to help move a table"
                maxLength={80}
              />
              <label htmlFor="need-note" className="mt-4 block text-sm font-semibold text-ink">
                The useful detail
              </label>
              <textarea
                id="need-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                className={cn(fieldClass, "mt-2 min-h-28 py-3")}
                placeholder="Where, roughly, and what the hour looks like."
              />
              <div className="mt-4">
                <ChoiceRow
                  label="When"
                  value={when}
                  onChange={setWhen}
                  options={WHENS.map((item) => ({ value: item, label: item }))}
                />
              </div>
              {error ? <p className="mt-3 text-sm font-medium text-ink">{error}</p> : null}
              <button type="submit" className="mt-5 h-12 rounded-full bg-primary px-6 font-semibold text-primary-fg">
                Ask
              </button>
            </form>
          )}
        </div>
        <section>
          <h2 className="font-display text-2xl text-ink">What people in {city.name} need</h2>
          <ul className="mt-4 space-y-5">
            {mine.map((need) => (
              <li key={need.id}>
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">On this device</p>
                <p className="mt-1 font-semibold text-ink">{need.title}</p>
                <p className="text-sm text-muted">{need.when}</p>
                {need.note ? <p className="mt-1 text-sm text-muted">{need.note}</p> : null}
              </li>
            ))}
            {recorded.map((need) => (
              <li key={need.id}>
                <p className="font-semibold text-ink">{need.title}</p>
                <p className="text-sm text-muted">
                  {need.from} · {need.when}
                </p>
                <p className="mt-1 text-sm text-muted">{need.detail}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
