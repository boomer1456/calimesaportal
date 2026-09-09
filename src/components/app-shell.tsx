import { ArrowLeft, Loader2 } from "lucide-react";
import { lazy, Suspense, useEffect } from "react";
import { BackStackProvider, useBackLayer, useBackStack } from "@/components/back-stack";
import { Home } from "@/components/home";
import { IsaAdminDialog } from "@/components/isa-admin-dialog";
import { getAdminCreds, loadIsaHouse } from "@/lib/isa-house";
import { loadParHouse } from "@/lib/par-house";
import type { AppYear } from "@/lib/training-data";
import { useTrainingStore, type ShiftFilter, type Tab } from "@/lib/store";
import { cn } from "@/lib/utils";

const CalendarMonth = lazy(() =>
  import("@/components/calendar-month").then((m) => ({ default: m.CalendarMonth })),
);
const UpcomingList = lazy(() =>
  import("@/components/upcoming-list").then((m) => ({ default: m.UpcomingList })),
);
const EventDetail = lazy(() =>
  import("@/components/event-detail").then((m) => ({ default: m.EventDetail })),
);
const CityMap = lazy(() =>
  import("@/components/city-map").then((m) => ({ default: m.CityMap })),
);
const EmsPar = lazy(() =>
  import("@/components/ems-par").then((m) => ({ default: m.EmsPar })),
);
const IsaLog = lazy(() =>
  import("@/components/isa-log").then((m) => ({ default: m.IsaLog })),
);
const Policy = lazy(() =>
  import("@/components/policy").then((m) => ({ default: m.Policy })),
);
const Remsa = lazy(() =>
  import("@/components/remsa").then((m) => ({ default: m.Remsa })),
);
const Rookie = lazy(() =>
  import("@/components/rookie").then((m) => ({ default: m.Rookie })),
);
const Skills = lazy(() =>
  import("@/components/skills").then((m) => ({ default: m.Skills })),
);
const Weather = lazy(() =>
  import("@/components/weather").then((m) => ({ default: m.Weather })),
);
const StrikeTeam = lazy(() =>
  import("@/components/strike-team").then((m) => ({ default: m.StrikeTeam })),
);

const YEARS: AppYear[] = [2026, 2027];
const SHIFTS: ShiftFilter[] = ["all", "A", "B", "C"];

const TITLES: Record<Exclude<Tab, "home">, string> = {
  calendar: "Training & Calendar",
  skills: "Skills",
  remsa: "REMSA",
  ems: "Station PAR",
  rookie: "Station",
  map: "Map",
  policy: "Binder",
  isa: "Log training",
  weather: "Weather",
  strike: "Strike team",
};

export function AppShell() {
  return (
    <BackStackProvider>
      <Shell />
    </BackStackProvider>
  );
}

function Shell() {
  const tab = useTrainingStore((s) => s.tab);
  const year = useTrainingStore((s) => s.year);
  const setYear = useTrainingStore((s) => s.setYear);
  const filter = useTrainingStore((s) => s.shiftFilter);
  const setShiftFilter = useTrainingStore((s) => s.setShiftFilter);
  const calendarView = useTrainingStore((s) => s.calendarView);
  const setCalendarView = useTrainingStore((s) => s.setCalendarView);
  const selected = useTrainingStore((s) => s.selectedEventId);
  const openEvent = useTrainingStore((s) => s.openEvent);
  const policyPane = useTrainingStore((s) => s.policyPane);
  const formFillId = useTrainingStore((s) => s.formFillId);
  const { go } = useBackStack();
  useBackLayer(Boolean(selected), () => openEvent(null));

  useEffect(() => {
    void useTrainingStore.persist.rehydrate();
    useTrainingStore.getState().setIsaAdminUnlocked(Boolean(getAdminCreds()));
    void loadIsaHouse();
    void loadParHouse();
    function onVis() {
      if (document.visibilityState === "visible") {
        void loadIsaHouse();
        void loadParHouse();
      }
    }
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.shell = tab === "home" ? "home" : "page";
  }, [tab]);

  const title = selected
    ? "Drill"
    : formFillId?.startsWith("P-Card")
      ? "P-card"
      : formFillId === "Time-card"
        ? "Time card"
        : tab === "policy"
        ? policyPane === "forms"
          ? "Forms"
          : policyPane === "radio"
            ? "Radio"
            : "Binder"
        : tab === "home"
          ? "Home"
          : TITLES[tab];
  const showCalFilters = tab === "calendar" && !selected;
  const isHome = tab === "home";

  return (
    <div className={cn("app-scroll", isHome ? "bg-navy" : "bg-bg")}>
      {isHome ? (
        <div className="mx-auto min-h-full w-full max-w-lg">
          <Home />
        </div>
      ) : (
        <div className="mx-auto flex min-h-full w-full max-w-lg flex-col bg-bg">
          <header className="sticky top-0 z-20 border-b border-navy-2 bg-navy pt-[env(safe-area-inset-top)] text-cream">
            <div className="flex items-center gap-1 px-2 py-2">
              <button
                type="button"
                onClick={() => go()}
                className="flex size-11 shrink-0 items-center justify-center rounded-sm text-cream"
                aria-label="Back"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div className="min-w-0 flex-1">
                <p className="font-display text-lg font-bold leading-none">{title}</p>
              </div>
            </div>
            {showCalFilters ? (
              <div className="flex flex-col gap-2 px-4 pb-3">
                <div className="flex gap-1">
                  {YEARS.map((y) => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setYear(y)}
                      className={cn(
                        "h-10 flex-1 rounded-sm text-sm font-semibold",
                        year === y ? "bg-cream text-navy" : "bg-navy-2 text-cream/80",
                      )}
                    >
                      {y}
                    </button>
                  ))}
                  {(
                    [
                      ["month", "Month"],
                      ["list", "List"],
                    ] as const
                  ).map(([id, label]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setCalendarView(id)}
                      className={cn(
                        "h-10 flex-1 rounded-sm text-sm font-semibold",
                        calendarView === id ? "bg-cream text-navy" : "bg-navy-2 text-cream/80",
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-1">
                  {SHIFTS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setShiftFilter(s)}
                      className={cn(
                        "h-9 flex-1 rounded-sm text-xs font-semibold",
                        s === "all" &&
                          (filter === s ? "bg-cream text-navy" : "bg-navy-2 text-cream/80"),
                        s === "A" &&
                          (filter === s ? "bg-shift-a text-cream" : "bg-navy-2 text-[#f0c4c0]"),
                        s === "B" &&
                          (filter === s ? "bg-shift-b text-cream" : "bg-navy-2 text-[#b7cce0]"),
                        s === "C" &&
                          (filter === s ? "bg-shift-c text-cream" : "bg-navy-2 text-[#b7dccb]"),
                      )}
                    >
                      {s === "all" ? "All" : `${s}-Shift`}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </header>

          <main className="flex-1 px-4 py-4 pb-[max(2rem,env(safe-area-inset-bottom))]">
            <Suspense fallback={<TabLoading label={title} />}>
              {selected ? (
                <EventDetail id={selected} />
              ) : tab === "calendar" ? (
                calendarView === "list" ? (
                  <UpcomingList />
                ) : (
                  <CalendarMonth />
                )
              ) : tab === "skills" ? (
                <Skills />
              ) : tab === "remsa" ? (
                <Remsa />
              ) : tab === "ems" ? (
                <EmsPar />
              ) : tab === "rookie" ? (
                <Rookie />
              ) : tab === "map" ? (
                <CityMap />
              ) : tab === "isa" ? (
                <IsaLog />
              ) : tab === "weather" ? (
                <Weather />
              ) : tab === "strike" ? (
                <StrikeTeam />
              ) : (
                <Policy />
              )}
            </Suspense>
          </main>
        </div>
      )}
      <IsaAdminDialog />
    </div>
  );
}

function TabLoading({ label }: { label: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <Loader2 className="size-8 animate-spin text-navy" aria-hidden />
      <p className="font-display text-xl font-semibold text-navy">Loading {label}</p>
    </div>
  );
}
