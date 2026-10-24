import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChoiceRow, PageHead } from "@/components/bits";
import { getCity, type Feel } from "@/data/atlas";
import { planTrip, type DayPlan } from "@/lib/match";
import { useAtlas } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/journey")({ component: JourneyPage });

const FEELS: Feel[] = ["Work", "Experiences", "Music", "Food", "Nature", "Community", "Stays"];

function JourneyPage() {
  const cityId = useAtlas((state) => state.cityId);
  const city = getCity(cityId);
  const [days, setDays] = useState<3 | 7 | 14>(7);
  const [budget, setBudget] = useState<"free" | "low" | "any">("low");
  const [feels, setFeels] = useState<Feel[]>([]);
  const [plan, setPlan] = useState<DayPlan[] | null>(null);
  const [widened, setWidened] = useState(false);

  useEffect(() => {
    setPlan(null);
  }, [cityId]);

  function toggleFeel(feel: Feel) {
    setFeels((current) => (current.includes(feel) ? current.filter((item) => item !== feel) : [...current, feel]));
  }

  function arrange() {
    const result = planTrip({ cityId: city.id, days, budget, feels });
    setPlan(result.days);
    setWidened(result.widened);
  }

  function clearDay(day: number) {
    setPlan((current) =>
      current?.map((item) =>
        item.day === day
          ? { ...item, listing: null, line: city.openIdeas[(day - 1) % city.openIdeas.length] }
          : item,
      ) ?? null,
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHead
        kicker={city.name}
        title="What could your days here hold?"
        lede="We only arrange what's already recorded. Open days stay open — that's the point."
      />
      <div className="mt-8 grid gap-5 rounded-3xl border border-line bg-surface p-5 sm:p-7">
        <ChoiceRow
          label="Days"
          value={String(days)}
          onChange={(value) => setDays(Number(value) as 3 | 7 | 14)}
          options={[
            { value: "3", label: "3" },
            { value: "7", label: "7" },
            { value: "14", label: "14" },
          ]}
        />
        <ChoiceRow
          label="Money"
          value={budget}
          onChange={setBudget}
          options={[
            { value: "free", label: "Spend nothing" },
            { value: "low", label: "A little is fine" },
            { value: "any", label: "Keep it open" },
          ]}
        />
        <fieldset>
          <legend className="text-sm font-semibold text-ink">What you'd like to find</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {FEELS.map((feel) => {
              const on = feels.includes(feel);
              return (
                <button
                  key={feel}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleFeel(feel)}
                  className={cn("h-11 rounded-full px-4 text-sm font-semibold", on ? "bg-ink text-surface" : "bg-sand text-ink")}
                >
                  {feel}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-sm text-muted">Leave this blank and we'll use everything recorded here.</p>
        </fieldset>
        <button type="button" onClick={arrange} className="h-12 w-full rounded-full bg-primary font-semibold text-primary-fg sm:w-auto sm:px-6">
          Arrange these days
        </button>
      </div>

      {plan ? (
        <div className="mt-10">
          <h2 className="font-display text-3xl text-ink">
            {days === 3 ? "A few days" : days === 7 ? "A week" : "Two weeks"} in {city.name}
          </h2>
          {widened ? (
            <p className="mt-2 text-muted">Nothing recorded matched that mix. Here's what does exist.</p>
          ) : null}
          <ol className="mt-6 border-l border-line">
            {plan.map((item) => (
              <li key={item.day} className="relative mb-6 pl-6">
                <span className="absolute top-1.5 -left-1.5 h-3 w-3 rounded-full border-2 border-primary bg-canvas" />
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">Day {item.day}</p>
                {item.listing ? (
                  <div className="mt-2 flex gap-3">
                    <img src={item.listing.image} alt="" className="h-20 w-20 shrink-0 rounded-2xl object-cover" />
                    <div>
                      <p className="font-display text-xl leading-snug text-ink">{item.listing.title}</p>
                      <p className="mt-1 text-sm text-muted">{item.line}</p>
                      <div className="mt-2 flex gap-3">
                        <Link to="/place/$id" params={{ id: item.listing.id }} className="text-sm font-semibold text-primary">
                          Open
                        </Link>
                        <button type="button" onClick={() => clearDay(item.day)} className="text-sm font-semibold text-muted">
                          Leave it open
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="mt-2 font-display text-xl leading-snug text-ink italic">{item.line}</p>
                )}
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div>
  );
}
