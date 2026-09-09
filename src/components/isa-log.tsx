import { useEffect, useMemo, useState } from "react";
import { Download, Lock, LockOpen, Mail, Printer, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { IsaSubmit } from "@/components/isa-submit";
import {
  formatTimeLong,
  isaFilename,
  isaSummary,
  isaWorkbook,
  newFirefighter,
  rosterName,
  sortEntries,
  sortRoster,
  type IsaFirefighter,
  type IsaMeta,
} from "@/lib/isa";
import {
  deleteHouseEntry,
  deleteHouseFirefighter,
  loadIsaHouse,
  lockIsaAdmin,
  requireIsaAdmin,
  saveHouseFirefighter,
  saveHouseMeta,
} from "@/lib/isa-house";
import { downloadBlob } from "@/lib/xlsx-simple";
import { EVENTS_BY_ID } from "@/lib/training-data";
import { useTrainingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function IsaLog() {
  const roster = useTrainingStore((s) => s.roster);
  const entries = useTrainingStore((s) => s.isaEntries);
  const houseStatus = useTrainingStore((s) => s.houseStatus);
  const houseError = useTrainingStore((s) => s.houseError);
  const pane = useTrainingStore((s) => s.isaPane);
  const setPane = useTrainingStore((s) => s.setIsaPane);
  const isaEventId = useTrainingStore((s) => s.isaEventId);
  const logEvent = isaEventId ? EVENTS_BY_ID[isaEventId] : undefined;

  useEffect(() => {
    void loadIsaHouse();
  }, []);

  return (
    <section className="flex flex-col gap-4 pb-8">
      <p className="text-sm leading-relaxed text-muted">
        Same house log as the ISA Excel. Throw ladders on your own, run a company drill,
        or catch a hydrant — pick who was there and save the hours.
      </p>
      {houseStatus === "error" ? (
        <div className="rounded-md border border-ember/30 bg-ember/5 p-3 text-sm text-ember">
          {houseError ?? "Could not load the house log."}{" "}
          <button type="button" className="font-semibold underline" onClick={() => void loadIsaHouse()}>
            Retry
          </button>
        </div>
      ) : null}
      <div className="no-print flex gap-1">
        {(
          [
            ["log", "Log"],
            ["sheet", "Sheet"],
            ["roster", "Roster"],
            ["course", "Course"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setPane(id)}
            className={cn(
              "h-10 flex-1 rounded-sm text-sm font-semibold",
              pane === id ? "bg-navy text-cream" : "bg-surface-2 text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {pane === "log" ? (
        <IsaSubmit key={logEvent?.id ?? "adhoc"} event={logEvent} />
      ) : pane === "sheet" ? (
        <SheetPane entriesLen={entries.length} roster={roster} />
      ) : pane === "roster" ? (
        <RosterPane />
      ) : (
        <CoursePane />
      )}
    </section>
  );
}

function prettyDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function groupByDate(entries: ReturnType<typeof sortEntries>) {
  const map = new Map<string, typeof entries>();
  for (const e of entries) {
    const list = map.get(e.date) ?? [];
    list.push(e);
    map.set(e.date, list);
  }
  return [...map.entries()].sort((a, b) => b[0].localeCompare(a[0]));
}

function SheetPane({
  entriesLen,
  roster,
}: {
  entriesLen: number;
  roster: IsaFirefighter[];
}) {
  const entries = useTrainingStore((s) => s.isaEntries);
  const meta = useTrainingStore((s) => s.isaMeta);
  const unlocked = useTrainingStore((s) => s.isaAdminUnlocked);
  const sorted = useMemo(() => sortEntries(entries, roster), [entries, roster]);
  const byId = useMemo(() => new Map(roster.map((f) => [f.id, f])), [roster]);
  const total = sorted.reduce((n, e) => n + e.hours, 0);
  const dates = useMemo(() => groupByDate(sorted), [sorted]);
  const personnel = useMemo(() => {
    const hours = new Map<string, number>();
    for (const e of sorted) {
      hours.set(e.firefighterId, (hours.get(e.firefighterId) ?? 0) + e.hours);
    }
    return sortRoster(roster.filter((f) => hours.has(f.id))).map((f) => ({
      ff: f,
      hours: Math.round((hours.get(f.id) ?? 0) * 100) / 100,
    }));
  }, [sorted, roster]);
  const [busy, setBusy] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  async function file() {
    return {
      blob: isaWorkbook(sorted, roster, meta),
      name: isaFilename(meta),
      text: isaSummary(sorted, roster, meta),
    };
  }

  async function download() {
    setBusy("download");
    setNote(null);
    try {
      const { blob, name } = await file();
      downloadBlob(blob, name);
      setNote("Excel saved to Downloads. This is the shared house file — same hours everyone sees.");
    } finally {
      setBusy(null);
    }
  }

  async function share() {
    setBusy("share");
    setNote(null);
    try {
      const { blob, name, text } = await file();
      const shareFile = new File([blob], name, {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      if (navigator.share && navigator.canShare?.({ files: [shareFile] })) {
        await navigator.share({ files: [shareFile], title: name, text });
        return;
      }
      downloadBlob(blob, name);
      window.location.href = `mailto:?subject=${encodeURIComponent(`${meta.agency} ISA hours ${meta.term}`)}&body=${encodeURIComponent(`${text}\n\nExcel downloaded — attach ${name} from Files.`)}`;
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setNote("Share canceled or not available. Download Excel and attach it in Mail.");
      }
    } finally {
      setBusy(null);
    }
  }

  function printSheet() {
    window.print();
  }

  function removeLine(id: string) {
    requireIsaAdmin(async (creds) => {
      const result = await deleteHouseEntry(id, creds);
      if (!result.ok) setNote(result.error ?? "Could not delete that line.");
    });
  }

  if (!entriesLen) {
    return (
      <p className="rounded-lg border border-line bg-surface-2 p-4 text-sm leading-relaxed text-muted">
        Nothing in the house log yet. Tap Log, pick a topic (ladders, hose, a
        company drill), who was there, and save. It shows up here for everyone.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="no-print grid grid-cols-3 gap-2">
        <Button type="button" variant="primary" disabled={!!busy} onClick={() => void download()}>
          <Download className="size-4" />
          Excel
        </Button>
        <Button type="button" variant="navy" disabled={!!busy} onClick={printSheet}>
          <Printer className="size-4" />
          Print
        </Button>
        <Button type="button" variant="outline" disabled={!!busy} onClick={() => void share()}>
          <Mail className="size-4" />
          Email
        </Button>
      </div>
      {note ? <p className="no-print text-sm text-muted">{note}</p> : null}

      <div className="rounded-lg border border-line bg-surface-2 p-3 text-sm">
        <p className="font-semibold text-navy">
          {sorted.length} lines · {Math.round(total * 100) / 100} hours
        </p>
        <p className="mt-1 text-xs text-muted">
          {meta.course} · SYN {meta.syn} · {meta.instructor} · {meta.term}
        </p>
        <p className="mt-1 text-xs text-shift-c">Shared file — every user sees these hours.</p>
      </div>

      <details
        open
        className="no-print rounded-lg border border-line bg-surface-2"
      >
        <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-navy">
          <span>Personnel hours</span>
          <span className="text-xs font-medium text-muted">
            {personnel.length} {personnel.length === 1 ? "person" : "people"}
          </span>
        </summary>
        <ul className="divide-y divide-line border-t border-line">
          {personnel.map(({ ff, hours }) => (
            <li key={ff.id} className="flex items-baseline justify-between gap-3 px-3 py-2.5">
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-ink">
                  {rosterName(ff)}
                </span>
                <span className="block text-xs tabular-nums text-muted">{ff.studentId}</span>
              </span>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-navy">
                {hours} {hours === 1 ? "hr" : "hrs"}
              </span>
            </li>
          ))}
        </ul>
      </details>

      <div className="no-print flex flex-col gap-2">
        {dates.map(([date, rows], i) => {
          const hours = Math.round(rows.reduce((n, e) => n + e.hours, 0) * 100) / 100;
          return (
            <details
              key={date}
              open={i === 0}
              className="rounded-lg border border-line bg-surface-2"
            >
              <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-navy">
                <span>{prettyDate(date)}</span>
                <span className="text-xs font-medium text-muted">
                  {rows.length} {rows.length === 1 ? "line" : "lines"} · {hours} hrs
                </span>
              </summary>
              <EntryTable
                rows={rows}
                byId={byId}
                unlocked={unlocked}
                onRemove={removeLine}
              />
            </details>
          );
        })}
      </div>

      <div className="print-only isa-print-sheet overflow-x-auto rounded-lg border border-line bg-surface-2">
        <EntryTable rows={sorted} byId={byId} unlocked={false} onRemove={removeLine} />
      </div>
    </div>
  );
}

function EntryTable({
  rows,
  byId,
  unlocked,
  onRemove,
}: {
  rows: ReturnType<typeof sortEntries>;
  byId: Map<string, IsaFirefighter>;
  unlocked: boolean;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="overflow-x-auto border-t border-line">
      <table className="w-full min-w-[36rem] text-left text-xs">
        <thead className="bg-navy text-cream">
          <tr>
            <th className="px-2 py-2 font-semibold">Last</th>
            <th className="px-2 py-2 font-semibold">First</th>
            <th className="px-2 py-2 font-semibold">ID</th>
            <th className="px-2 py-2 font-semibold">Date</th>
            <th className="px-2 py-2 font-semibold">Time</th>
            <th className="px-2 py-2 font-semibold">Hrs</th>
            <th className="px-2 py-2 font-semibold">Description</th>
            <th className="no-print px-2 py-2 font-semibold" />
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => {
            const ff = byId.get(e.firefighterId);
            return (
              <tr key={e.id} className="border-t border-line">
                <td className="px-2 py-2 font-medium text-navy">{ff?.lastName ?? "—"}</td>
                <td className="px-2 py-2 text-ink">{ff?.firstName ?? "—"}</td>
                <td className="px-2 py-2 tabular-nums text-muted">{ff?.studentId ?? "—"}</td>
                <td className="px-2 py-2 tabular-nums">{e.date}</td>
                <td className="px-2 py-2 tabular-nums">{formatTimeLong(e.time)}</td>
                <td className="px-2 py-2 tabular-nums">{e.hours}</td>
                <td className="px-2 py-2 text-ink">{e.description}</td>
                <td className="no-print px-1 py-1">
                  <button
                    type="button"
                    aria-label={unlocked ? "Remove line" : "Unlock to remove line"}
                    className="flex size-9 items-center justify-center text-muted"
                    onClick={() => onRemove(e.id)}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function RosterPane() {
  const roster = useTrainingStore((s) => s.roster);
  const entries = useTrainingStore((s) => s.isaEntries);
  const unlocked = useTrainingStore((s) => s.isaAdminUnlocked);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [sid, setSid] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function add() {
    if (!first.trim() || !last.trim() || !sid.trim()) return;
    requireIsaAdmin(async (creds) => {
      setBusy(true);
      setNote(null);
      const result = await saveHouseFirefighter(
        newFirefighter({ firstName: first, lastName: last, studentId: sid }),
        creds,
      );
      setBusy(false);
      if (!result.ok) {
        setNote(result.error ?? "Could not add that member.");
        return;
      }
      setFirst("");
      setLast("");
      setSid("");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-muted">
        Reimbursement IDs from last term’s Vector export. Everyone can see the roster.
        Adding, editing, or removing people requires the personnel password.
      </p>
      {unlocked ? (
        <button
          type="button"
          onClick={lockIsaAdmin}
          className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-md border border-line bg-surface-2 px-3 text-sm font-semibold text-navy"
        >
          <LockOpen className="size-4" />
          Lock personnel
        </button>
      ) : (
        <button
          type="button"
          onClick={() => requireIsaAdmin(() => undefined)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-navy px-3 text-sm font-semibold text-cream"
        >
          <Lock className="size-4" />
          Unlock to add or remove people
        </button>
      )}
      {unlocked ? (
        <div className="grid grid-cols-2 gap-2 rounded-lg border border-line bg-surface-2 p-3">
          <input
            value={first}
            onChange={(e) => setFirst(e.target.value)}
            placeholder="First"
            className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
          />
          <input
            value={last}
            onChange={(e) => setLast(e.target.value)}
            placeholder="Last"
            className="h-11 rounded-md border border-line bg-surface px-3 text-sm"
          />
          <input
            value={sid}
            onChange={(e) => setSid(e.target.value)}
            placeholder="Crafton student ID"
            className="col-span-2 h-11 rounded-md border border-line bg-surface px-3 text-sm"
          />
          <Button
            type="button"
            variant="navy"
            className="col-span-2"
            disabled={busy || !first.trim() || !last.trim() || !sid.trim()}
            onClick={add}
          >
            Add member
          </Button>
        </div>
      ) : null}
      {note ? <p className="text-sm text-ember">{note}</p> : null}
      <ul className="flex flex-col gap-2">
        {sortRoster(roster).map((ff) => (
          <RosterRow
            key={ff.id}
            ff={ff}
            used={entries.some((e) => e.firefighterId === ff.id)}
            unlocked={unlocked}
            onNote={setNote}
          />
        ))}
      </ul>
    </div>
  );
}

function RosterRow({
  ff,
  used,
  unlocked,
  onNote,
}: {
  ff: IsaFirefighter;
  used: boolean;
  unlocked: boolean;
  onNote: (msg: string | null) => void;
}) {
  const [sid, setSid] = useState(ff.studentId);

  useEffect(() => {
    setSid(ff.studentId);
  }, [ff.studentId]);

  function save(next: IsaFirefighter) {
    requireIsaAdmin(async (creds) => {
      const result = await saveHouseFirefighter(next, creds);
      if (!result.ok) onNote(result.error ?? "Could not save.");
      else onNote(null);
    });
  }

  function remove() {
    requireIsaAdmin(async (creds) => {
      const result = await deleteHouseFirefighter(ff.id, creds);
      if (!result.ok) onNote(result.error ?? "Could not remove.");
      else onNote(null);
    });
  }

  return (
    <li className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-navy">{rosterName(ff)}</p>
        <button
          type="button"
          className={cn(
            "h-8 rounded-sm px-2 text-xs font-semibold",
            ff.active ? "bg-shift-c-bg text-shift-c" : "bg-surface text-muted",
          )}
          onClick={() => save({ ...ff, active: !ff.active })}
        >
          {ff.active ? "Active" : "Hidden"}
        </button>
      </div>
      <label className="mt-2 block text-xs text-muted">
        Reimbursement ID
        <input
          value={unlocked ? sid : ff.studentId}
          readOnly={!unlocked}
          onChange={(e) => setSid(e.target.value)}
          onBlur={() => {
            if (unlocked && sid.trim() && sid.trim() !== ff.studentId) {
              save({ ...ff, studentId: sid.trim() });
            }
          }}
          className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
        />
      </label>
      <div className="mt-2 flex gap-1">
        {(["A", "B", "C"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => save({ ...ff, shift: ff.shift === s ? undefined : s })}
            className={cn(
              "h-9 flex-1 rounded-sm text-xs font-semibold",
              ff.shift === s ? "bg-navy text-cream" : "bg-surface text-muted",
            )}
          >
            {s}
          </button>
        ))}
      </div>
      {!used ? (
        <button
          type="button"
          className="mt-2 text-xs font-semibold text-ember"
          onClick={remove}
        >
          Remove
        </button>
      ) : null}
    </li>
  );
}

function CoursePane() {
  const meta = useTrainingStore((s) => s.isaMeta);
  const unlocked = useTrainingStore((s) => s.isaAdminUnlocked);
  const [draft, setDraft] = useState<IsaMeta>(meta);
  const [note, setNote] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setDraft(meta);
  }, [meta]);

  const fields: Array<[keyof IsaMeta, string]> = [
    ["instructor", "Instructor of Record"],
    ["course", "Course"],
    ["syn", "SYN / reference"],
    ["term", "Term"],
    ["college", "College"],
    ["agency", "Agency"],
    ["reimbursementStatus", "Reimbursement status"],
  ];

  function save() {
    requireIsaAdmin(async (creds) => {
      setBusy(true);
      setNote(null);
      const result = await saveHouseMeta(draft, creds);
      setBusy(false);
      if (!result.ok) setNote(result.error ?? "Could not save course header.");
    });
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-muted">
        Prints on every Excel header. Vega is the Instructor of Record on the current packet
        (Fall 2026–Spring 2027). Changing it requires the personnel lock.
      </p>
      {!unlocked ? (
        <button
          type="button"
          onClick={() => requireIsaAdmin(() => undefined)}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-navy px-3 text-sm font-semibold text-cream"
        >
          <Lock className="size-4" />
          Unlock to edit course
        </button>
      ) : null}
      {fields.map(([key, label]) => (
        <label key={key} className="block">
          <span className="text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
          <input
            value={draft[key]}
            readOnly={!unlocked}
            onChange={(e) => setDraft((m) => ({ ...m, [key]: e.target.value }))}
            className="mt-1 h-11 w-full rounded-md border border-line bg-surface-2 px-3 text-sm text-ink"
          />
        </label>
      ))}
      {unlocked ? (
        <Button type="button" variant="navy" disabled={busy} onClick={save}>
          Save course header
        </Button>
      ) : null}
      {note ? <p className="text-sm text-ember">{note}</p> : null}
    </div>
  );
}


