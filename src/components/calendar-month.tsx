import { ChevronLeft, ChevronRight, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EVENTS_BY_DATE,
  HOLIDAYS,
  MONTHS,
  isoDate,
  monthFocus,
  monthGrid,
  topicFor,
  type TrainingEvent,
} from "@/lib/training-data";
import { cn } from "@/lib/utils";
import { useTrainingStore, type ShiftFilter } from "@/lib/store";

const DOW = ["S", "M", "T", "W", "T", "F", "S"];

function chipClass(ev: TrainingEvent) {
  if (ev.shift === "A") return "bg-shift-a-bg text-shift-a";
  if (ev.shift === "B") return "bg-shift-b-bg text-shift-b";
  if (ev.shift === "C") return "bg-shift-c-bg text-shift-c";
  return "bg-navy/10 text-navy";
}

function barClass(ev: TrainingEvent) {
  if (ev.shift === "A") return "bg-shift-a";
  if (ev.shift === "B") return "bg-shift-b";
  if (ev.shift === "C") return "bg-shift-c";
  return "bg-navy";
}

function visibleEvents(date: string, filter: ShiftFilter, year: number) {
  const list = (EVENTS_BY_DATE[date] ?? []).filter((e) => e.year === year);
  if (filter !== "all") return list.filter((e) => e.shift === filter);
  return list;
}

export function CalendarMonth() {
  const year = useTrainingStore((s) => s.year);
  const month = useTrainingStore((s) => s.month);
  const setMonth = useTrainingStore((s) => s.setMonth);
  const filter = useTrainingStore((s) => s.shiftFilter);
  const openEvent = useTrainingStore((s) => s.openEvent);
  const openIsa = useTrainingStore((s) => s.openIsa);
  const status = useTrainingStore((s) => s.status);
  const weeks = monthGrid(year, month);
  const focus = monthFocus(year, month);

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-bold leading-none tracking-tight text-navy">
          {MONTHS[month - 1]}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            aria-label="Previous month"
            onClick={() => setMonth(month === 1 ? 12 : month - 1)}
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Next month"
            onClick={() => setMonth(month === 12 ? 1 : month + 1)}
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      <button
        type="button"
        onClick={() => openIsa(true)}
        className="flex h-11 w-full items-center justify-center rounded-sm bg-navy text-sm font-semibold text-cream"
      >
        Log training
      </button>

      <div className="rounded-lg border border-line bg-surface-2 p-3 shadow-panel">
        <p className="text-[11px] font-medium tracking-wide text-muted uppercase">Focus</p>
        <p className="mt-0.5 text-sm font-semibold text-ink">{focus.primary}</p>
        <p className="mt-2 text-sm text-ink">{focus.secondary}</p>
        {focus.night ? (
          <p className="mt-2 inline-flex items-center gap-1 rounded-sm bg-night-bg px-2 py-1 text-xs font-medium text-night">
            <Moon className="size-3.5" /> {focus.night}-Shift night ops this month
          </p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-lg border border-line bg-surface-2 shadow-panel">
        <div className="grid grid-cols-7 bg-navy">
          {DOW.map((d, i) => (
            <div
              key={`${d}-${i}`}
              className="py-2 text-center text-[11px] font-semibold tracking-wide text-cream"
            >
              {d}
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 border-t border-line">
            {week.map((day, di) => {
              if (!day) {
                return <div key={`${wi}-${di}`} className="min-h-16 bg-bg/60" />;
              }
              const date = isoDate(year, month, day);
              const events = visibleEvents(date, filter, year);
              const holiday = HOLIDAYS[date];
              const weekend = di === 0 || di === 6;
              return (
                <div
                  key={date}
                  className={cn(
                    "min-h-16 border-l border-line first:border-l-0 p-1",
                    weekend && events.length === 0 ? "bg-bg/50" : "bg-surface-2",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="tabular-nums text-xs font-semibold text-navy">{day}</span>
                    {holiday ? (
                      <span className="max-w-10 truncate text-[9px] text-night">{holiday}</span>
                    ) : null}
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    {events.map((ev) => (
                      <DayChip
                        key={ev.id}
                        ev={ev}
                        done={status[ev.id] === "done"}
                        onClick={() => openEvent(ev.id)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </section>
  );
}

function DayChip({
  ev,
  done,
  onClick,
}: {
  ev: TrainingEvent;
  done: boolean;
  onClick: () => void;
}) {
  const topic = topicFor(ev);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${topic.short}${ev.night ? ", night" : ""}${ev.shift ? `, ${ev.shift}-Shift` : ""}`}
      className={cn(
        "relative flex min-h-11 w-full items-center gap-0.5 overflow-hidden rounded-xs py-1 pl-2 pr-1 text-left",
        chipClass(ev),
        done && "opacity-55",
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-0.5", barClass(ev))} />
      {ev.night ? <Moon className="size-3 shrink-0" aria-hidden /> : null}
      <span className="min-w-0 truncate text-xs font-semibold leading-tight">{topic.short}</span>
    </button>
  );
}


