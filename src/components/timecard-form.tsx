import { useEffect, useMemo, useState } from "react";
import { Download, Loader2, Printer, Share } from "lucide-react";
import {
  REG_HOURS,
  buildTimeCardPdf,
  cardTotals,
  dueCopy,
  formatMd,
  formatMdy,
  loadCardDraft,
  saveCardDraft,
  printPdf,
  withPayrollTotals,
  type TimeCard,
  type TimeDay,
} from "@/lib/timecard";
import { fillTimeCardXlsx, shareBlob } from "@/lib/fill-timecard-xlsx";
import { useBackLayer } from "@/components/back-stack";
import { cn } from "@/lib/utils";

type SheetFile = { blob: Blob; name: string; url: string; pdfUrl: string; pdfBlob: Blob };

export function TimecardForm() {
  const [card, setCard] = useState<TimeCard>(() => withPayrollTotals(loadCardDraft()));
  const [sheet, setSheet] = useState<SheetFile | null>(null);
  const [building, setBuilding] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<"share" | null>(null);
  const [open, setOpen] = useState(false);
  const [pendingPrint, setPendingPrint] = useState(false);
  const totals = useMemo(() => cardTotals(card), [card]);
  const due = dueCopy();
  useBackLayer(open, () => setOpen(false));

  useEffect(() => {
    let cancelled = false;
    setBuilding(true);
    const timer = window.setTimeout(() => {
      void Promise.all([
        fillTimeCardXlsx(withPayrollTotals(card)),
        buildTimeCardPdf(withPayrollTotals(card)),
      ])
        .then(([xlsx, pdf]) => {
          if (cancelled) return;
          const url = URL.createObjectURL(xlsx.blob);
          const pdfUrl = URL.createObjectURL(pdf.blob);
          setSheet((prev) => {
            if (prev) {
              URL.revokeObjectURL(prev.url);
              URL.revokeObjectURL(prev.pdfUrl);
            }
            return { blob: xlsx.blob, name: xlsx.name, url, pdfUrl, pdfBlob: pdf.blob };
          });
          setError(null);
          setBuilding(false);
        })
        .catch((err: unknown) => {
          if (cancelled) return;
          setError(err instanceof Error ? err.message : "Could not build the spreadsheet.");
          setBuilding(false);
        });
    }, 200);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [card]);

  function commit(next: TimeCard) {
    const merged = withPayrollTotals(next);
    saveCardDraft(merged);
    setCard(merged);
  }

  function patch(next: Partial<TimeCard>) {
    commit({ ...card, ...next });
  }

  function patchDay(i: number, next: Partial<TimeDay>) {
    commit({
      ...card,
      days: card.days.map((d, idx) => (idx === i ? { ...d, ...next } : d)),
    });
  }

  async function onShare() {
    setOpen(true);
    if (!sheet) return;
    setBusy("share");
    setError(null);
    try {
      const result = await shareBlob(sheet.blob, sheet.name, "C.F.D. time card");
      if (result === "download") clickDownload(sheet);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not share.");
    } finally {
      setBusy(null);
    }
  }

  function onDownload() {
    setOpen(true);
    if (sheet) clickDownload(sheet);
  }

  function onPrint() {
    setOpen(true);
    setPendingPrint(true);
  }

  if (open) {
    return (
      <SheetView
        card={card}
        sheet={sheet}
        building={building}
        busy={busy}
        error={error}
        autoPrint={pendingPrint}
        onPrinted={() => setPendingPrint(false)}
        onShare={() => void onShare()}
        onDownload={onDownload}
      />
    );
  }

  return (
    <section className="flex flex-col gap-3 pb-6">
      <header className="rounded-lg bg-navy p-3 text-cream shadow-panel print:hidden">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
          Payroll · biweekly
        </p>
        <h1 className="mt-0.5 font-display text-2xl font-bold leading-tight">C.F.D. time card</h1>
        <p className="mt-1 text-xs leading-relaxed text-cream/80">
          {formatMd(card.periodStart)}–{formatMd(card.periodEnd)}. Due Thursday ({due.sub}). First{" "}
          {REG_HOURS} hours = regular, rest = OT.
        </p>
      </header>

      <label className="flex flex-col gap-1 print:hidden">
        <span className="text-xs font-semibold text-navy">Name</span>
        <input
          value={card.name}
          onChange={(e) => patch({ name: e.target.value, employeeSig: e.target.value })}
          className="h-11 rounded-sm border border-line bg-surface-2 px-3 text-sm"
          autoCapitalize="words"
        />
      </label>

      <div className="overflow-hidden rounded-md border border-line bg-surface-2 print:hidden">
        <div className="flex items-center gap-1.5 border-b border-line px-2 py-1.5 text-[10px] font-semibold tracking-wide text-muted uppercase">
          <span className="w-20">Day</span>
          <span className="w-14 text-center">Hrs</span>
          <span className="w-12 text-center">Vac</span>
          <span className="w-12 text-center">Sick</span>
          <span className="w-9 text-center">Ptl</span>
          <span className="min-w-0 flex-1">Detail</span>
        </div>
        <ul>
          {card.days.map((day, i) => (
            <li key={day.iso} className="flex items-center gap-1.5 border-b border-line px-2 py-1 last:border-b-0">
              <span className="w-20 shrink-0 leading-tight">
                <span className="block font-display text-base font-bold text-navy">{day.label}</span>
                <span className="block text-sm font-semibold tabular-nums text-navy/80">{formatMd(day.iso)}</span>
              </span>
              <span className="w-14 shrink-0">
                <TinyNum
                  label={`Hours ${day.label}`}
                  value={day.hours}
                  onChange={(v) => patchDay(i, { hours: v })}
                />
              </span>
              <span className="w-12 shrink-0">
                <TinyNum
                  label={`Vacation ${day.label}`}
                  value={day.vacation}
                  onChange={(v) => patchDay(i, { vacation: v })}
                />
              </span>
              <span className="w-12 shrink-0">
                <TinyNum
                  label={`Sick ${day.label}`}
                  value={day.sick}
                  onChange={(v) => patchDay(i, { sick: v })}
                />
              </span>
              <label className="flex w-9 shrink-0 items-center justify-center">
                <span className="sr-only">Patrol operator {day.label}</span>
                <input
                  type="checkbox"
                  checked={day.ptl}
                  onChange={(e) => patchDay(i, { ptl: e.target.checked })}
                  className="size-4"
                />
              </label>
              <input
                value={day.description}
                onChange={(e) => patchDay(i, { description: e.target.value })}
                placeholder="REGULAR / COVER / #"
                aria-label={`Description ${day.label}`}
                className="h-11 min-w-0 flex-1 rounded-sm border border-line bg-surface px-2 text-xs"
              />
            </li>
          ))}
        </ul>
      </div>

      <article className="rounded-lg bg-navy p-3 text-cream print:hidden">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
          Payroll totals
        </p>
        <div className="mt-2 grid grid-cols-2 gap-1.5 text-sm">
          <Total label="Hours worked" value={totals.hours} />
          <Total label="Ptl. op." value={totals.ptl} />
          <Total label="Vacation" value={totals.vacation} />
          <Total label="Sick" value={totals.sick} />
          <Total label="Regular" value={totals.reg} accent />
          <Total label="Overtime" value={totals.ot} accent />
        </div>
        <p className="mt-2 text-xs text-cream/70">
          Regular fills first, up to {REG_HOURS}. Hours over that go to overtime.
        </p>
      </article>

      <div className="grid grid-cols-2 gap-2 print:hidden">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-navy">Supervisor</span>
          <input
            value={card.supervisor}
            onChange={(e) => patch({ supervisor: e.target.value })}
            className="h-11 rounded-sm border border-line bg-surface-2 px-3 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-navy">City Manager</span>
          <input
            value={card.cityManager}
            onChange={(e) => patch({ cityManager: e.target.value })}
            className="h-11 rounded-sm border border-line bg-surface-2 px-3 text-sm"
          />
        </label>
      </div>

      {error ? <p className="text-sm text-ember print:hidden">{error}</p> : null}

      <div className="h-36 print:hidden" />
      <ActionBar
        sheet={sheet}
        building={building}
        busy={busy}
        onShare={() => void onShare()}
        onDownload={onDownload}
        onPrint={onPrint}
      />
    </section>
  );
}

function clickDownload(sheet: SheetFile) {
  const a = document.createElement("a");
  a.href = sheet.url;
  a.download = sheet.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function ActionBar({
  sheet,
  building,
  busy,
  onShare,
  onDownload,
  onPrint,
}: {
  sheet: SheetFile | null;
  building: boolean;
  busy: "share" | null;
  onShare: () => void;
  onDownload: () => void;
  onPrint: () => void;
}) {
  const wait = building || !sheet;
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 print:hidden">
      <div className="mx-auto max-w-lg border-t border-line bg-bg px-4 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={onShare}
          disabled={wait || Boolean(busy)}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-sm bg-navy text-sm font-semibold text-cream disabled:opacity-60"
        >
          {busy === "share" || wait ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Share className="size-4" />
          )}
          Email / share Excel
        </button>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onDownload}
            disabled={wait}
            className="flex h-11 items-center justify-center gap-2 rounded-sm bg-surface-2 text-sm font-semibold text-navy disabled:opacity-60"
          >
            {wait ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Download Excel
          </button>
          <button
            type="button"
            onClick={onPrint}
            className="flex h-11 items-center justify-center gap-2 rounded-sm bg-surface-2 text-sm font-semibold text-navy"
          >
            <Printer className="size-4" />
            Print
          </button>
        </div>
      </div>
    </div>
  );
}

function SheetView({
  card,
  sheet,
  building,
  busy,
  error,
  autoPrint,
  onPrinted,
  onShare,
  onDownload,
}: {
  card: TimeCard;
  sheet: SheetFile | null;
  building: boolean;
  busy: "share" | null;
  error: string | null;
  autoPrint: boolean;
  onPrinted: () => void;
  onShare: () => void;
  onDownload: () => void;
}) {
  useEffect(() => {
    document.documentElement.setAttribute("data-print", "timecard");
    const style = document.createElement("style");
    style.id = "cfd-timecard-print";
    style.textContent = "@page { size: landscape letter; margin: 0.25in; }";
    document.head.appendChild(style);
    return () => {
      document.documentElement.removeAttribute("data-print");
      style.remove();
    };
  }, []);

  useEffect(() => {
    if (!autoPrint || !sheet?.pdfBlob) return;
    const t = window.setTimeout(() => {
      printPdf(sheet.pdfBlob);
      onPrinted();
    }, 250);
    return () => window.clearTimeout(t);
  }, [autoPrint, sheet, onPrinted]);

  function printSheet() {
    if (sheet?.pdfBlob) printPdf(sheet.pdfBlob);
  }

  return (
    <section className="flex flex-col gap-3 pb-36">
      <p className="print:hidden text-xs leading-relaxed text-muted">
        {sheet?.name ?? "Building the C.F.D. time card…"} Numbers are written onto the house
        spreadsheet. Print comes out landscape, same as payroll’s sheet.
      </p>

      {error ? <p className="text-sm text-ember print:hidden">{error}</p> : null}

      {sheet?.pdfUrl ? (
        <iframe
          title="C.F.D. time card"
          src={`${sheet.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
          className="h-[32rem] w-full rounded-md border border-line bg-cream print:hidden"
        />
      ) : (
        <div className="flex h-[32rem] items-center justify-center rounded-md border border-line bg-surface-2 text-sm text-muted print:hidden">
          <Loader2 className="mr-2 size-4 animate-spin" />
          Putting hours on the spreadsheet…
        </div>
      )}

      <LandscapePrint card={card} />

      <ActionBar
        sheet={sheet}
        building={building}
        busy={busy}
        onShare={onShare}
        onDownload={onDownload}
        onPrint={printSheet}
      />
    </section>
  );
}

function LandscapePrint({ card }: { card: TimeCard }) {
  const totals = cardTotals(card);
  return (
    <div className="timecard-print-sheet hidden bg-white text-black">
      <div className="flex items-start justify-between gap-4">
        <img src="/cfd-time-card-logo.png" alt="" className="h-16 w-auto" />
        <div className="flex-1">
          <div className="flex justify-between gap-4 text-sm">
            <p>
              <strong>NAME</strong>{" "}
              <span className="inline-block min-w-48 border border-black px-2 py-0.5">{card.name}</span>
            </p>
            <p>
              <strong>PAY PERIOD STARTS</strong>{" "}
              <span className="inline-block border border-black px-2 py-0.5">{card.periodStart}</span>
            </p>
          </div>
          <h1 className="mt-2 text-center text-2xl font-bold">C.F.D. Time Card</h1>
        </div>
      </div>
      <div className="mt-2 flex gap-3">
        <table className="w-[72%] border-collapse border border-black text-[11px]">
          <thead>
            <tr className="bg-neutral-200">
              <th className="border border-black px-1 py-1" rowSpan={2}>
                DATE
              </th>
              <th className="border border-black px-1 py-1" colSpan={2}>
                REGULAR SHIFT
              </th>
              <th className="border border-black px-1 py-1" colSpan={2}>
                SPECIAL SHIFT
              </th>
              <th className="border border-black px-1 py-1" rowSpan={2}>
                Description
              </th>
            </tr>
            <tr className="bg-neutral-200">
              <th className="border border-black px-1 py-1">Hours Worked</th>
              <th className="border border-black px-1 py-1">PTL OP</th>
              <th className="border border-black px-1 py-1">VACATION</th>
              <th className="border border-black px-1 py-1">SICK</th>
            </tr>
          </thead>
          <tbody>
            {card.days.map((d) => (
              <tr key={d.iso}>
                <td className="border border-black px-1 py-0.5">
                  <strong>{d.label}</strong> {formatMdy(d.iso)}
                </td>
                <td className="border border-black px-1 py-0.5 text-center tabular-nums">{d.hours}</td>
                <td className="border border-black px-1 py-0.5 text-center">{d.ptl ? "YES" : ""}</td>
                <td className="border border-black px-1 py-0.5 text-center tabular-nums">{d.vacation}</td>
                <td className="border border-black px-1 py-0.5 text-center tabular-nums">{d.sick}</td>
                <td className="border border-black px-1 py-0.5">{d.description}</td>
              </tr>
            ))}
            <tr className="bg-neutral-200 font-bold">
              <td className="border border-black px-1 py-1">TOTAL</td>
              <td className="border border-black px-1 py-1 text-center tabular-nums">{totals.hours}</td>
              <td className="border border-black px-1 py-1 text-center tabular-nums">{totals.ptl}</td>
              <td className="border border-black px-1 py-1 text-center tabular-nums">{totals.vacation}</td>
              <td className="border border-black px-1 py-1 text-center tabular-nums">{totals.sick}</td>
              <td className="border border-black px-1 py-1" />
            </tr>
          </tbody>
        </table>
        <table className="h-fit w-[28%] border-collapse border border-black text-[11px]">
          <tbody>
            {(
              [
                ["REG Hours", card.regHours || totals.reg],
                ["Overtime Hours", card.otHours || totals.ot],
                ["Vacation Hours", totals.vacation],
                ["Sick Hours", totals.sick],
                ["Ptl. Op. Shifts", totals.ptl],
              ] as const
            ).map(([label, value]) => (
              <tr key={label}>
                <th
                  className={cn(
                    "border border-black bg-neutral-200 px-2 py-1 text-left font-semibold",
                    label === "Overtime Hours" && "text-red-700",
                  )}
                >
                  {label}
                </th>
                <td
                  className={cn(
                    "border border-black px-2 py-1 text-center tabular-nums font-bold",
                    label === "Overtime Hours" && "text-red-700",
                  )}
                >
                  {value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-sm font-semibold">Shift Detail Must be Filled Out</p>
      <div className="mt-3 flex flex-wrap gap-6 text-sm">
        <p>
          <strong>Signatures</strong> Employee ________________ {card.employeeSig || card.name}
        </p>
        <p>Supervisor ________________ {card.supervisor}</p>
        <p>City Manager ________________ {card.cityManager}</p>
      </div>
      <p className="mt-4 text-[10px]">Revised 08/18/26 PM</p>
    </div>
  );
}

function Total({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <p
      className={cn(
        "flex justify-between rounded-sm px-2.5 py-2",
        accent ? "bg-cream text-navy" : "bg-navy-2 text-cream",
      )}
    >
      <span className={accent ? "text-navy/70" : "text-cream/80"}>{label}</span>
      <span className="font-semibold tabular-nums">{value || 0}</span>
    </p>
  );
}

function TinyNum({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <input
      inputMode="decimal"
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value.replace(/[^\d.]/g, ""))}
      className="h-11 w-full rounded-sm border border-line bg-surface px-1 text-center text-sm tabular-nums"
    />
  );
}
