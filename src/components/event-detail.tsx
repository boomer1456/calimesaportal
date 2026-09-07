import { Clock, MapPin, Shield, Wrench } from "lucide-react";
import { IsaSubmit } from "@/components/isa-submit";
import { Button } from "@/components/ui/button";
import { useBackStack } from "@/components/back-stack";
import { guideFor } from "@/lib/guides";
import {
  EVENTS_BY_ID,
  HOLIDAYS,
  assignmentFor,
  headlineFor,
  evalLabel,
  topicFor,
  type EventStatus,
} from "@/lib/training-data";
import { useTrainingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS: Array<{ value: EventStatus; label: string }> = [
  { value: "open", label: "Scheduled" },
  { value: "done", label: "Completed" },
  { value: "missed", label: "Missed" },
  { value: "makeup", label: "Make-up" },
];

export function EventDetail({ id }: { id: string }) {
  const { go } = useBackStack();
  const status = useTrainingStore((s) => s.status[id] ?? "open");
  const setStatus = useTrainingStore((s) => s.setStatus);
  const note = useTrainingStore((s) => s.notes[id] ?? "");
  const setNote = useTrainingStore((s) => s.setNote);
  const ev = EVENTS_BY_ID[id];

  if (!ev) {
    return (
      <div className="p-6">
        <p className="text-muted">That drill is not on the calendar.</p>
        <Button className="mt-4" variant="outline" onClick={() => go()}>
          Back to calendar
        </Button>
      </div>
    );
  }

  const topic = topicFor(ev);
  const guide = guideFor(ev.topicKey);
  const date = new Date(`${ev.date}T12:00:00`);
  const holiday = HOLIDAYS[ev.date];
  const when = date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const show1410 =
    ev.topicKey === "nfpa1410" || (ev.extra ?? "").toLowerCase().includes("1410");
  const assignment = assignmentFor(ev);
  const headline = headlineFor(ev);
  const same = assignment.trim().toLowerCase() === headline.trim().toLowerCase();

  return (
    <article className="flex flex-col gap-4 pb-8">
      <header className="rounded-lg border border-line bg-navy p-4 text-cream shadow-panel">
        <p className="text-xs font-medium tracking-[0.16em] text-cream/70 uppercase">
          {ev.year}
          {ev.shift ? ` · ${ev.shift}-Shift` : ""} · {evalLabel(ev.night ? "night" : topic.evalKind)}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight">
          {headline}{ev.night ? " · Night" : ""}
        </h1>
        <p className="mt-2 text-sm text-cream/85">{when}</p>
        {holiday ? (
          <p className="mt-1 text-xs text-cream/70">
            Also {holiday} — confirm staffing before you lock this date.
          </p>
        ) : null}
      </header>

      {!same ? (
        <section className="rounded-lg border border-line bg-surface-2 p-4">
          <h2 className="text-[11px] font-medium tracking-wide text-muted uppercase">
            Today's assignment
          </h2>
          <p className="mt-1 text-sm font-semibold leading-relaxed text-ink">{assignment}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">{topic.objective}</p>
        </section>
      ) : null}

      <dl className="grid grid-cols-1 gap-2">
        <Meta icon={Clock} label="Duration" value={`${topic.hours} hours (record actual time)`} />
        <Meta icon={MapPin} label="Location" value={topic.location} />
        <Meta icon={Wrench} label="Equipment" value={topic.equipment} />
        <Meta
          icon={Shield}
          label="Authority"
          value={
            show1410
              ? "NFPA 1410-style company evolution · CFD skill sheets"
              : "CFD Master Program · current skill sheet"
          }
        />
      </dl>

      <section className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">How to run it</h2>
        <ol className="mt-3 space-y-2">
          {guide.how.map((step, i) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-cream">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {show1410 ? (
        <section className="rounded-lg border border-ember/30 bg-ember/5 p-4">
          <h2 className="font-display text-xl font-semibold text-navy">NFPA 1410 company example</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink">
            Treat this like a first-due fire, not a skill station. One officer owns command. The
            engine establishes a supply, stretches, charges, and flows. The truck throws the
            assigned ladder or starts search only when command calls for it. Run it once for
            technique, reset, then run it on the clock. If anyone is lost or off the line, freeze
            and convert to Mayday / RIC.
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-ink">
            <li>Water at the nozzle before anyone commits interior.</li>
            <li>Ladder tip in the intended window or roof edge — not “close enough.”</li>
            <li>PAR at the end. A fast stretch with a missing name is a fail.</li>
          </ul>
        </section>
      ) : null}

      <section className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">Company standard</h2>
        <ul className="mt-3 space-y-2">
          {guide.standard.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-ink">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">Coaching</h2>
        <ul className="mt-3 space-y-2">
          {guide.coaching.map((item) => (
            <li key={item} className="text-sm leading-relaxed text-ink">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-display text-xl font-semibold text-navy">Status</h2>
        <p className="mt-1 text-sm text-muted">
          Saved on this phone. Canceled drills are rescheduled — never dropped. Make-up target is
          30 days.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setStatus(id, opt.value)}
              className={cn(
                "h-11 rounded-md border text-sm font-medium",
                status === opt.value
                  ? "border-navy bg-navy text-cream"
                  : "border-line bg-surface-2 text-ink",
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      <label className="block">
        <span className="text-sm font-medium text-navy">Company notes</span>
        <textarea
          value={note}
          onChange={(e) => setNote(id, e.target.value)}
          rows={4}
          placeholder="Who ran it, props used, make-up plan…"
          className="mt-1 w-full rounded-md border border-line bg-surface-2 p-3 text-sm text-ink placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        />
      </label>

      <IsaSubmit event={ev} />
    </article>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-md border border-line bg-surface-2 p-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-navy" />
      <div>
        <dt className="text-[11px] font-medium tracking-wide text-muted uppercase">{label}</dt>
        <dd className="text-sm text-ink">{value}</dd>
      </div>
    </div>
  );
}


