import { ExternalLink, ListPlus, Timer } from "lucide-react";
import { sixMinutesFor } from "@/lib/six-minutes";
import {
  headlineFor,
  eventsOn,
  shiftOn,
  stationYmd,
  todayIso,
  type Shift,
  type TrainingEvent,
} from "@/lib/training-data";
import { dueCopy } from "@/lib/timecard";
import { useTrainingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function shiftChip(shift?: Shift) {
  if (shift === "A") return "bg-shift-a-bg text-shift-a";
  if (shift === "B") return "bg-shift-b-bg text-shift-b";
  if (shift === "C") return "bg-shift-c-bg text-shift-c";
  return "bg-navy/10 text-navy";
}

export function HomeToday() {
  const openIsa = useTrainingStore((s) => s.openIsa);
  const openTimecard = useTrainingStore((s) => s.openTimecard);
  const now = new Date();
  const iso = todayIso(now);
  const duty = shiftOn(iso);
  const drills = eventsOn(iso);
  const { weekday } = stationYmd(now);
  const shortDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
  const due = dueCopy(iso);

  return (
    <section
      aria-label="Today"
      className="mx-5 mt-3 rounded-lg bg-cream p-3 text-ink shadow-panel"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-xl font-bold leading-none tracking-tight text-navy">
          {weekday}
          <span className="ml-2 text-sm font-medium text-muted">{shortDate}</span>
        </h2>
        <span className={cn("rounded-sm px-2 py-1 text-xs font-bold", shiftChip(duty))}>
          {duty}-Shift
        </span>
      </div>

      <button
        type="button"
        onClick={() => openTimecard()}
        className={cn(
          "mt-3 flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left",
          due.tone === "ok" ? "bg-navy text-cream" : "bg-ember text-ember-fg",
        )}
      >
        <span className="min-w-0">
          <span className="block text-sm font-semibold leading-tight">{due.line}</span>
          <span
            className={cn(
              "block text-xs",
              due.tone === "ok" ? "text-cream/70" : "text-ember-fg/80",
            )}
          >
            Tap to fill · {due.sub}
          </span>
        </span>
        <span className="shrink-0 font-display text-2xl font-bold tabular-nums leading-none">
          {due.days}
        </span>
      </button>

      {drills.length ? (
        <ul className="mt-3 flex flex-col gap-2">
          {drills.map((ev) => (
            <TodayDrill key={ev.id} ev={ev} />
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-muted">No company drill today.</p>
      )}

      <SixMinutesLink iso={iso} />

      <button
        type="button"
        onClick={() => openIsa(true)}
        className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 text-sm font-semibold text-navy"
      >
        <ListPlus className="size-4 shrink-0" />
        Log other training
      </button>
    </section>
  );
}

function SixMinutesLink({ iso }: { iso: string }) {
  const topic = sixMinutesFor(iso);
  return (
    <a
      href={topic.href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 flex min-h-11 items-center gap-3 rounded-md border border-line bg-surface-2 px-3"
    >
      <Timer className="size-4 shrink-0 text-navy" aria-hidden />
      <span className="min-w-0 flex-1 text-sm font-semibold leading-snug text-navy">
        6 Minutes · {topic.title}
      </span>
      <ExternalLink className="size-4 shrink-0 text-muted" aria-hidden />
    </a>
  );
}

function TodayDrill({ ev }: { ev: TrainingEvent }) {
  const openDrill = useTrainingStore((s) => s.openDrill);
  const openIsa = useTrainingStore((s) => s.openIsa);
  const entries = useTrainingStore((s) => s.isaEntries);
  const title = headlineFor(ev);
  const people = new Set(
    entries.filter((e) => e.date === ev.date).map((e) => e.firefighterId),
  ).size;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => openDrill({ id: ev.id, year: ev.year, month: ev.month })}
        className="min-h-11 min-w-0 flex-1 rounded-md bg-surface-2 px-3 py-2 text-left"
      >
        <p className="font-display text-lg font-bold leading-tight text-navy">
          {title}
          {ev.night ? " · Night" : ""}
        </p>
        <p className={cn("text-xs", people ? "font-semibold text-done" : "text-muted")}>
          {people ? `Logged · ${people} ${people === 1 ? "person" : "people"}` : "Not logged"}
        </p>
      </button>
      <button
        type="button"
        onClick={() => openIsa(true, ev.id)}
        className="flex h-11 shrink-0 items-center gap-1 rounded-md bg-ember px-3 text-sm font-semibold text-ember-fg"
      >
        <ListPlus className="size-4 shrink-0" />
        Log
      </button>
    </div>
  );
}
