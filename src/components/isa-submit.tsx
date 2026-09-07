import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ISA_ASSIGNMENTS,
  QUICK_TOPICS,
  assignmentById,
  issuesForBatch,
  newFirefighter,
  sortRoster,
} from "@/lib/isa";
import { loadIsaHouse, requireIsaAdmin, saveHouseFirefighter, submitIsaHours } from "@/lib/isa-house";
import type { TrainingEvent } from "@/lib/training-data";
import { headlineFor, todayIso, topicFor } from "@/lib/training-data";
import { useTrainingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

function defaultTime(ev?: TrainingEvent): string {
  if (ev?.night) return "19:30";
  return "13:00";
}

export function IsaSubmit({ event }: { event?: TrainingEvent }) {
  const roster = useTrainingStore((s) => s.roster);
  const entries = useTrainingStore((s) => s.isaEntries);
  const meta = useTrainingStore((s) => s.isaMeta);
  const unlocked = useTrainingStore((s) => s.isaAdminUnlocked);
  const setStatus = useTrainingStore((s) => s.setStatus);
  const openIsa = useTrainingStore((s) => s.openIsa);
  const setIsaPane = useTrainingStore((s) => s.setIsaPane);

  const [date, setDate] = useState(() => event?.date ?? todayIso());
  const prior = entries.filter((e) =>
    event ? e.eventId === event.id : e.date === date,
  );
  const [picked, setPicked] = useState<string[]>([]);
  const [hours, setHours] = useState(() =>
    event ? Math.min(8, Math.max(0.5, topicFor(event).hours || 3)) : 1,
  );
  const [time, setTime] = useState(() => defaultTime(event));
  const [description, setDescription] = useState(() =>
    event ? headlineFor(event) : "",
  );
  const [topicChip, setTopicChip] = useState<string | null>(null);
  const [assignmentId, setAssignmentId] = useState(
    event?.topicKey === "evoc" ? "driver" : "company",
  );
  const [iorPresent, setIorPresent] = useState(true);
  const [shiftFilter, setShiftFilter] = useState<"all" | "A" | "B" | "C">(
    event?.shift ?? "all",
  );
  const [q, setQ] = useState("");
  const [adding, setAdding] = useState(false);
  const [newFirst, setNewFirst] = useState("");
  const [newLast, setNewLast] = useState("");
  const [newId, setNewId] = useState("");
  const [doneBatch, setDoneBatch] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void loadIsaHouse();
  }, []);

  const people = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return sortRoster(roster.filter((f) => f.active)).filter((f) => {
      if (shiftFilter !== "all" && f.shift && f.shift !== shiftFilter) return false;
      if (!needle) return true;
      return `${f.firstName} ${f.lastName} ${f.studentId}`.toLowerCase().includes(needle);
    });
  }, [roster, q, shiftFilter]);

  const drafts = picked.map((firefighterId) => ({
    firefighterId,
    date,
    time,
    hours,
    assignmentId,
    description,
  }));

  const issues = issuesForBatch(drafts, entries, roster, iorPresent);
  const blocks = issues.filter((i) => i.level === "block");

  function toggle(id: string) {
    setDoneBatch(null);
    setPicked((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function startAddPerson() {
    requireIsaAdmin(() => setAdding(true));
  }

  function addPerson() {
    const first = newFirst.trim();
    const last = newLast.trim();
    const studentId = newId.trim();
    if (!first || !last || !studentId) return;
    requireIsaAdmin(async (creds) => {
      const ff = newFirefighter({ firstName: first, lastName: last, studentId });
      const result = await saveHouseFirefighter(ff, creds);
      if (!result.ok) {
        setError(result.error ?? "Could not add that member.");
        return;
      }
      setPicked((cur) => [...cur, ff.id]);
      setNewFirst("");
      setNewLast("");
      setNewId("");
      setAdding(false);
    });
  }

  async function submit() {
    setError(null);
    if (!description.trim()) {
      setError("Add what you ran — ladders, hose, whatever it was.");
      return;
    }
    if (blocks.length) {
      setError(blocks[0].message);
      return;
    }
    setBusy(true);
    try {
      const result = await submitIsaHours({
        eventId: event?.id,
        iorPresent,
        drafts: drafts.map((d) => ({ ...d, description: d.description.trim() })),
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      if (event) setStatus(event.id, "done");
      setDoneBatch(result.batchId);
      setPicked([]);
    } catch {
      setError("Could not save to the house log. Try again.");
    } finally {
      setBusy(false);
    }
  }

  const asg = assignmentById(assignmentId);

  return (
    <section className="rounded-lg border border-navy/20 bg-surface-2 p-4">
      {event ? (
        <>
          <p className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
            Crafton Hills ISA
          </p>
          <h2 className="font-display text-2xl font-semibold text-navy">Submit hours</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            After the drill, tap who was there. Hours go on the shared house Excel — every
            phone sees them. One line per person — max 8 hours in a calendar day, no overlaps,
            nothing that runs past midnight.
          </p>
        </>
      ) : (
        <p className="text-sm leading-relaxed text-muted">
          Not on the company calendar? Still counts. Ladders, hose, SCBA, whatever you ran —
          pick the topic, hours, and who was there.
        </p>
      )}

      {prior.length ? (
        <p className="mt-3 rounded-sm bg-shift-c-bg px-3 py-2 text-sm text-shift-c">
          {prior.length} {prior.length === 1 ? "person" : "people"} already logged for this date.
          Add anyone who was missed, or{" "}
          <button
            type="button"
            className="font-semibold underline"
            onClick={() => {
              setIsaPane("sheet");
              openIsa(true);
            }}
          >
            open the sheet
          </button>
          .
        </p>
      ) : null}

      {!event ? (
        <>
          <p className="mt-4 text-xs font-medium tracking-wide text-muted uppercase">Topic</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {QUICK_TOPICS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => {
                  setTopicChip(name);
                  setDescription(name === "Other" ? "" : name);
                  setDoneBatch(null);
                }}
                className={cn(
                  "h-9 rounded-sm px-2.5 text-xs font-semibold",
                  topicChip === name ? "bg-navy text-cream" : "bg-surface text-navy",
                )}
              >
                {name}
              </button>
            ))}
          </div>
          <label className="mt-3 block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setDoneBatch(null);
              }}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            />
          </label>
        </>
      ) : null}

      <label className="mt-4 block">
        <span className="text-xs font-medium tracking-wide text-muted uppercase">Description</span>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setDoneBatch(null);
          }}
          rows={2}
          placeholder={event ? undefined : "What did you run? Ground ladders, 24' and 35' throws…"}
          className="mt-1 w-full rounded-md border border-line bg-surface p-3 text-sm text-ink placeholder:text-subtle focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
        />
      </label>

      <label className="mt-3 block">
        <span className="text-xs font-medium tracking-wide text-muted uppercase">
          Assignment
        </span>
        <select
          value={assignmentId}
          onChange={(e) => setAssignmentId(e.target.value)}
          className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
        >
          {ISA_ASSIGNMENTS.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <label className="block">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">Start</span>
          <input
            type="time"
            value={time}
            onChange={(e) => {
              setTime(e.target.value);
              setDoneBatch(null);
            }}
            className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
          />
        </label>
        <div>
          <span className="text-xs font-medium tracking-wide text-muted uppercase">Hours</span>
          <div className="mt-1 flex h-11 items-center gap-1 rounded-md border border-line bg-surface px-1">
            <button
              type="button"
              aria-label="Decrease hours"
              className="flex size-9 items-center justify-center text-navy"
              onClick={() => setHours((h) => Math.max(0.5, Math.round((h - 0.5) * 10) / 10))}
            >
              <Minus className="size-4" />
            </button>
            <input
              type="number"
              min={0.5}
              max={8}
              step={0.5}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="h-9 min-w-0 flex-1 bg-transparent text-center text-sm font-semibold text-navy tabular-nums"
            />
            <button
              type="button"
              aria-label="Increase hours"
              className="flex size-9 items-center justify-center text-navy"
              onClick={() => setHours((h) => Math.min(8, Math.round((h + 0.5) * 10) / 10))}
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">Who was there</p>
          <span className="text-xs font-semibold text-navy">{picked.length} selected</span>
        </div>
        <div className="mt-2 flex gap-1">
          {(["all", "A", "B", "C"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setShiftFilter(s)}
              className={cn(
                "h-9 flex-1 rounded-sm text-xs font-semibold",
                shiftFilter === s ? "bg-navy text-cream" : "bg-surface text-muted",
              )}
            >
              {s === "all" ? "All" : s}
            </button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or ID"
          className="mt-2 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink placeholder:text-subtle"
        />
        <ul className="mt-2 max-h-64 overflow-y-auto rounded-md border border-line">
          {people.map((ff) => {
            const on = picked.includes(ff.id);
            return (
              <li key={ff.id} className="border-b border-line last:border-b-0">
                <button
                  type="button"
                  onClick={() => toggle(ff.id)}
                  className={cn(
                    "flex min-h-11 w-full items-center gap-3 px-3 py-2 text-left",
                    on ? "bg-navy/5" : "bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-sm border",
                      on ? "border-navy bg-navy text-cream" : "border-line bg-surface-2",
                    )}
                  >
                    {on ? <Check className="size-3.5" strokeWidth={3} /> : null}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-navy">
                      {ff.lastName}, {ff.firstName}
                    </span>
                    <span className="text-xs text-muted">
                      ID {ff.studentId}
                      {ff.shift ? ` · ${ff.shift}-Shift` : ""}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {adding && unlocked ? (
          <div className="mt-2 grid grid-cols-2 gap-2 rounded-md border border-line bg-surface p-3">
            <input
              value={newFirst}
              onChange={(e) => setNewFirst(e.target.value)}
              placeholder="First"
              className="h-11 rounded-md border border-line bg-surface-2 px-3 text-sm"
            />
            <input
              value={newLast}
              onChange={(e) => setNewLast(e.target.value)}
              placeholder="Last"
              className="h-11 rounded-md border border-line bg-surface-2 px-3 text-sm"
            />
            <input
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              placeholder="Reimbursement ID"
              className="col-span-2 h-11 rounded-md border border-line bg-surface-2 px-3 text-sm"
            />
            <Button type="button" variant="navy" onClick={addPerson}>
              Add to roster
            </Button>
            <Button type="button" variant="outline" onClick={() => setAdding(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <button
            type="button"
            onClick={startAddPerson}
            className="mt-2 text-sm font-semibold text-navy"
          >
            + Someone new
          </button>
        )}
      </div>

      <label className="mt-4 flex min-h-11 items-start gap-3 rounded-md border border-line bg-surface p-3">
        <input
          type="checkbox"
          checked={iorPresent}
          onChange={(e) => setIorPresent(e.target.checked)}
          className="mt-1 size-4 accent-navy"
        />
        <span className="text-sm leading-relaxed text-ink">
          {meta.instructor} (Instructor of Record) was present for this instruction.
        </span>
      </label>

      {blocks.length ? (
        <ul className="mt-3 space-y-1.5 rounded-md border border-ember/30 bg-ember/5 p-3 text-sm text-ember">
          {blocks.slice(0, 4).map((b) => (
            <li key={b.message}>{b.message}</li>
          ))}
        </ul>
      ) : picked.length ? (
        <p className="mt-3 text-sm text-shift-c">
          Ready: {picked.length} × {hours} hr {asg.name}.
        </p>
      ) : null}

      {error ? <p className="mt-2 text-sm text-ember">{error}</p> : null}

      {doneBatch ? (
        <div className="mt-3 rounded-md border border-shift-c/30 bg-shift-c-bg p-3">
          <p className="text-sm font-semibold text-shift-c">Hours saved to the house log.</p>
          <p className="mt-1 text-sm text-ink">
            Everyone using this app can see them. Open the sheet to download Excel, print, or
            email Crafton.
          </p>
          <Button
            type="button"
            variant="navy"
            className="mt-3 w-full"
            onClick={() => {
              setIsaPane("sheet");
              openIsa(true);
            }}
          >
            Open the sheet
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="primary"
          className="mt-4 w-full"
          disabled={!picked.length || !description.trim() || blocks.length > 0 || busy}
          onClick={() => void submit()}
        >
          {busy ? "Saving…" : event ? "Submit ISA hours" : "Save training hours"}
        </Button>
      )}
    </section>
  );
}
