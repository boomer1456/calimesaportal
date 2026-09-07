import { ExternalLink, ListPlus, Table2, Timer } from "lucide-react";
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

  return (
    <section
      aria-label="Today"
      className="mx-5 mt-5 rounded-lg bg-cream p-4 text-ink shadow-panel"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">Today</p>
          <h2 className="font-display text-3xl font-bold leading-none tracking-tight text-navy">
            {weekday}
          </h2>
          <p className="mt-1 text-sm text-muted">{shortDate}</p>
        </div>
        <span className={cn("rounded-sm px-2 py-1 text-xs font-bold", shiftChip(duty))}>
          {duty}-Shift
        </span>
      </div>

      {drills.length ? (
        <ul className="mt-4 flex flex-col gap-3">
          {drills.map((ev) => (
            <TodayDrill key={ev.id} ev={ev} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted">No company drill on the calendar today.</p>
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
      className="mt-4 flex min-h-11 items-center gap-3 rounded-md border border-line bg-surface-2 px-3 py-2.5"
    >
      <Timer className="size-4 shrink-0 text-navy" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
          6 Minutes for Safety
        </span>
        <span className="mt-0.5 block text-sm font-semibold leading-snug text-navy">
          {topic.title}
        </span>
      </span>
      <ExternalLink className="size-4 shrink-0 text-muted" aria-hidden />
    </a>
  );
}

function TodayDrill({ ev }: { ev: TrainingEvent }) {
  const openDrill = useTrainingStore((s) => s.openDrill);
  const openIsa = useTrainingStore((s) => s.openIsa);
  const entries = useTrainingStore((s) => s.isaEntries);
  const people = new Set(
    entries.filter((e) => e.date === ev.date).map((e) => e.firefighterId),
  ).size;
  const title = headlineFor(ev);

  return (
    <article>
      <p className="text-xs font-medium tracking-[0.16em] text-muted uppercase">Training</p>
      <button
        type="button"
        onClick={() => openDrill({ id: ev.id, year: ev.year, month: ev.month })}
        className="mt-1 w-full text-left"
      >
        <h3 className="font-display text-2xl font-bold leading-tight text-navy">
          {title}
          {ev.night ? " · Night" : ""}
        </h3>
        <p className="mt-1 text-sm leading-snug text-muted">Tap for skill sheet</p>
      </button>

      <div className="mt-3 flex items-center gap-2">
        <Table2 className="size-4 shrink-0 text-navy" aria-hidden />
        <p className="text-sm text-ink">
          ISA hours logged:{" "}
          {people ? `${people} ${people === 1 ? "person" : "people"}` : "none yet"}
        </p>
      </div>

      <button
        type="button"
        onClick={() => openIsa(true, ev.id)}
        className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-md bg-ember text-sm font-semibold text-ember-fg"
      >
        <ListPlus className="size-4 shrink-0" />
        Log this drill
      </button>
    </article>
  );
}
