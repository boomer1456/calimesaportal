import { eventsForYear, topicFor, evalLabel, headlineFor, todayIso } from "@/lib/training-data";
import { useTrainingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function UpcomingList() {
  const year = useTrainingStore((s) => s.year);
  const filter = useTrainingStore((s) => s.shiftFilter);
  const status = useTrainingStore((s) => s.status);
  const openEvent = useTrainingStore((s) => s.openEvent);
  const openIsa = useTrainingStore((s) => s.openIsa);
  const today = todayIso();

  const pool = eventsForYear(year).filter((ev) => {
    if (filter !== "all" && ev.shift !== filter) return false;
    return true;
  });

  const list = pool
    .filter((ev) => ev.date >= today && status[ev.id] !== "done")
    .slice(0, 18);

  const doneCount = pool.filter((ev) => status[ev.id] === "done").length;
  const total = pool.length;

  return (
    <section className="flex flex-col gap-4">
      <p className="text-sm text-muted">
        {doneCount} of {total} {year}{" "}
        {filter !== "all" ? `${filter}-Shift dates` : "training dates"} marked complete on this
        phone.
      </p>

      <button
        type="button"
        onClick={() => openIsa(true)}
        className="flex h-11 w-full items-center justify-center rounded-sm bg-navy text-sm font-semibold text-cream"
      >
        Log training
      </button>

      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-navy"
          style={{ width: `${total ? Math.round((doneCount / total) * 100) : 0}%` }}
        />
      </div>

      {list.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface-2 p-4 text-sm text-muted">
          No remaining {year} drills for this filter. Switch year or mark a date back to Scheduled.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {list.map((ev) => {
            const topic = topicFor(ev);
            const d = new Date(`${ev.date}T12:00:00`);
            return (
              <li key={ev.id}>
                <button
                  type="button"
                  onClick={() => openEvent(ev.id)}
                  className="flex w-full items-start gap-3 rounded-lg border border-line bg-surface-2 p-3 text-left shadow-panel"
                >
                  <div className="w-12 shrink-0 text-center">
                    <div className="text-[10px] font-medium tracking-wide text-muted uppercase">
                      {d.toLocaleDateString("en-US", { month: "short" })}
                    </div>
                    <div className="font-display text-2xl font-bold leading-none text-navy tabular-nums">
                      {ev.day}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {ev.shift ? (
                        <span
                          className={cn(
                            "rounded-xs px-1.5 py-0.5 text-[10px] font-bold",
                            ev.shift === "A"
                              ? "bg-shift-a-bg text-shift-a"
                              : ev.shift === "B"
                                ? "bg-shift-b-bg text-shift-b"
                                : "bg-shift-c-bg text-shift-c",
                          )}
                        >
                          {ev.shift}-Shift{ev.night ? " · Night" : ""}
                        </span>
                      ) : (
                        <span className="rounded-xs bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold text-navy">
                          {topic.short}
                          {ev.night ? " · Night" : ""}
                        </span>
                      )}
                      <span className="text-[10px] text-muted">
                        {evalLabel(ev.night ? "night" : topic.evalKind)}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-sm font-semibold text-ink">
                      {headlineFor(ev)}
                    </p>
                    <p className="text-xs text-muted">{topic.hours} hr · tap for the drill card</p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}


