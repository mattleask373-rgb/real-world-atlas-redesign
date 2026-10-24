import { Link, useRouterState } from "@tanstack/react-router";
import { Check, Compass, Image as ImageIcon, Map, Route, User } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { cities, getCity } from "@/data/atlas";
import { useAtlas } from "@/lib/store";
import { cn } from "@/lib/utils";
import { CompassMark } from "@/components/bits";

const LINKS = [
  { to: "/", label: "Explore", icon: Compass },
  { to: "/map", label: "Map", icon: Map },
  { to: "/journey", label: "Trip", icon: Route },
  { to: "/moments", label: "Moments", icon: ImageIcon },
  { to: "/you", label: "You", icon: User },
] as const;

function isOn(path: string, to: string) {
  if (to === "/") return path === "/" || path.startsWith("/place");
  return path === to || path.startsWith(`${to}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const cityId = useAtlas((state) => state.cityId);
  const setCity = useAtlas((state) => state.setCity);
  const city = getCity(cityId);
  const [open, setOpen] = useState(false);
  const map = pathname === "/map";

  useEffect(() => {
    void useAtlas.persist.rehydrate();
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex min-h-screen flex-col bg-canvas text-ink">
      {open ? (
        <button type="button" aria-label="Close places" className="fixed inset-0 z-30 cursor-default" onClick={() => setOpen(false)} />
      ) : null}
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <CompassMark />
            <span className="leading-none">
              <span className="block text-xs font-semibold uppercase tracking-widest text-muted">Real World</span>
              <span className="block font-display text-xl leading-none italic">Atlas</span>
            </span>
          </Link>
          <nav className="ml-4 hidden items-center gap-1 lg:flex">
            {LINKS.map((item) => {
              const on = isOn(pathname, item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={on ? "page" : undefined}
                  className={cn(
                    "inline-flex h-11 items-center rounded-full px-3 text-sm font-semibold",
                    on ? "bg-sage text-primary" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            aria-expanded={open}
            aria-label={`Change place, currently ${city.name}`}
            onClick={() => setOpen((value) => !value)}
            className="ml-auto inline-flex h-11 items-center gap-2 rounded-full border border-line bg-surface px-4 text-sm font-semibold"
          >
            {city.name}
            <span className="hidden text-muted sm:inline">·</span>
            <span className="hidden text-muted sm:inline">{city.country}</span>
          </button>
          {open ? (
            <div className="absolute top-full right-4 z-40 mt-2 w-[min(100vw-2rem,24rem)] overflow-hidden rounded-3xl border border-line bg-surface p-2 shadow-sm sm:right-6">
              <p className="px-3 pt-2 pb-1 text-xs font-semibold uppercase tracking-widest text-muted">Choose a place</p>
              {cities.map((item) => {
                const on = item.id === city.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCity(item.id);
                      setOpen(false);
                    }}
                    className={cn("flex w-full items-center gap-3 rounded-2xl p-2 text-left", on && "bg-sage")}
                  >
                    <img src={item.hero} alt="" className="h-14 w-14 rounded-xl object-cover" />
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{item.name}</span>
                      <span className="block truncate text-sm text-muted">{item.blurb}</span>
                    </span>
                    {on ? <Check className="ml-auto h-4 w-4 shrink-0 text-primary" /> : null}
                  </button>
                );
              })}
            </div>
          ) : null}
        </div>
      </header>
      <main className={map ? "min-w-0 flex-1" : "mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 pt-5 pb-28 sm:px-6 lg:pt-8 lg:pb-12"}>
        {children}
      </main>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-line bg-canvas/95 backdrop-blur-md lg:hidden">
        {LINKS.map((item) => {
          const on = isOn(pathname, item.to);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              aria-current={on ? "page" : undefined}
              className={cn("flex h-14 flex-col items-center justify-center gap-0.5 text-xs font-semibold", on ? "text-primary" : "text-muted")}
            >
              <Icon className="h-5 w-5" strokeWidth={on ? 2.4 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
