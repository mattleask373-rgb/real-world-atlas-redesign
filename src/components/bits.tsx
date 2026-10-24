import { Link } from "@tanstack/react-router";
import { Check, Heart, Search, X } from "lucide-react";
import type { ReactNode } from "react";
import type { Listing, Tone } from "@/data/atlas";
import { useAtlas } from "@/lib/store";
import { cn } from "@/lib/utils";

export const fieldClass = "h-12 w-full rounded-2xl border border-line bg-canvas px-4 text-base text-ink outline-none";

export function Avatar({ initials, tone, className }: { initials: string; tone: Tone; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
        tone === "sage" && "bg-sage text-primary",
        tone === "sand" && "bg-sand text-ink",
        tone === "ink" && "bg-ink text-surface",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function CompassMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 36" className={cn("h-9 w-9", className)} aria-hidden="true">
      <circle cx="18" cy="18" r="16" fill="none" stroke="var(--color-ink)" strokeWidth="1.4" />
      <path d="M18 6.2 L21.2 18 L18 16.2 L14.8 18 Z" fill="var(--color-primary)" />
      <path d="M18 29.8 L14.8 18 L18 19.8 L21.2 18 Z" fill="var(--color-ink)" />
      <circle cx="18" cy="18" r="1.5" fill="var(--color-primary)" />
    </svg>
  );
}

export function PageHead({ kicker, title, lede }: { kicker: string; title: string; lede?: string }) {
  return (
    <header className="max-w-2xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-primary">{kicker}</p>
      <h1 className="mt-2 font-display text-4xl leading-tight text-ink md:text-5xl">{title}</h1>
      {lede ? <p className="mt-3 text-lg text-muted">{lede}</p> : null}
    </header>
  );
}

export function EmptyState({
  title,
  body,
  to,
  action,
}: {
  title: string;
  body: string;
  to?: "/" | "/give" | "/need" | "/map" | "/moments" | "/journey" | "/you";
  action?: string;
}) {
  return (
    <div className="rounded-3xl border border-line bg-surface px-6 py-12 text-center">
      <h3 className="font-display text-2xl text-ink">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-muted">{body}</p>
      {to && action ? (
        <Link to={to} className="mt-5 inline-flex h-11 items-center rounded-full bg-primary px-5 font-semibold text-primary-fg">
          {action}
        </Link>
      ) : null}
    </div>
  );
}

export function SaveButton({ id, className }: { id: string; className?: string }) {
  const on = useAtlas((state) => state.saved.includes(id));
  const toggle = useAtlas((state) => state.toggleSaved);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove from saved" : "Save this place"}
      onClick={() => toggle(id)}
      className={cn("flex h-11 w-11 items-center justify-center rounded-full bg-surface shadow-sm", className)}
    >
      <Heart className={cn("h-5 w-5", on ? "fill-primary text-primary" : "text-ink")} fill={on ? "currentColor" : "none"} />
    </button>
  );
}

export function PlaceCard({ listing }: { listing: Listing }) {
  const drop = listing.ways.find((way) => way.kind === "dropin") ?? listing.ways[0];
  const stay = listing.ways.find((way) => way.kind === "stay");
  return (
    <article className="relative">
      <Link to="/place/$id" params={{ id: listing.id }} className="group block">
        <div className="overflow-hidden rounded-3xl bg-sand">
          <img src={listing.image} alt={listing.title} loading="lazy" className="card-media aspect-[4/3] w-full object-cover" />
        </div>
        <div className="px-1 pt-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">
            {listing.category} · {listing.neighborhood}
          </p>
          <h3 className="mt-1 font-display text-xl leading-snug text-ink">{listing.title}</h3>
          <p className="mt-1 text-sm text-ink">{drop.terms}</p>
          {stay ? <p className="mt-1 text-sm text-muted">Also a stay · {stay.terms}</p> : null}
          <p className="mt-1 text-sm text-muted">{listing.when}</p>
        </div>
      </Link>
      <SaveButton id={listing.id} className="absolute right-3 top-3" />
    </article>
  );
}

export function FeaturedPlace({ listing }: { listing: Listing }) {
  const drop = listing.ways.find((way) => way.kind === "dropin") ?? listing.ways[0];
  return (
    <article className="relative">
      <Link
        to="/place/$id"
        params={{ id: listing.id }}
        className="group grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-5"
      >
        <div className="overflow-hidden bg-sand lg:col-span-3">
          <img
            src={listing.image}
            alt={listing.title}
            fetchPriority="high"
            className="card-media h-72 w-full object-cover lg:h-full lg:min-h-96"
          />
        </div>
        <div className="flex flex-col justify-end p-5 lg:col-span-2 lg:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {listing.category} · {listing.neighborhood}
          </p>
          <h2 className="mt-2 font-display text-3xl leading-tight text-ink md:text-4xl">{listing.title}</h2>
          <p className="mt-3 text-muted">{listing.summary}</p>
          <div className="mt-6 flex items-center gap-3">
            <Avatar initials={listing.host.initials} tone={listing.host.tone} />
            <div>
              <p className="font-semibold text-ink">{listing.host.name}</p>
              <p className="text-sm text-muted">{listing.host.role}</p>
            </div>
          </div>
          <p className="mt-6 text-sm font-semibold text-ink">{drop.terms}</p>
          <p className="mt-1 text-sm text-muted">{listing.when}</p>
        </div>
      </Link>
      <SaveButton id={listing.id} className="absolute right-4 top-4" />
    </article>
  );
}

export function AtlasBoard({
  terrain,
  className,
  children,
}: {
  terrain: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn("relative overflow-hidden", terrain, className)}>
      <div className="atlas-grid pointer-events-none absolute inset-0" />
      {children}
    </div>
  );
}

export function ChoiceRow<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink">{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const on = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={on}
              onClick={() => onChange(option.value)}
              className={cn(
                "h-11 rounded-full px-4 text-sm font-semibold",
                on ? "bg-ink text-surface" : "bg-sand text-ink",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder,
  id,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  id?: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
      <input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search what's recorded"
        className="h-14 w-full rounded-full border border-line bg-surface pr-14 pl-12 text-base text-ink outline-none"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ink"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </div>
  );
}

export function KeptLine({ saved }: { saved: boolean }) {
  return saved ? (
    <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-primary">
      <Check className="h-4 w-4" />
      Kept — find it in You
    </p>
  ) : null;
}
