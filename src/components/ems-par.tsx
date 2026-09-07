import { useMemo, useState } from "react";
import { ExternalLink, Lock, Minus, Plus, RotateCcw, Search, Unlock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PAR_ITEMS,
  PAR_SECTIONS,
  stationMin,
  type ParItem,
} from "@/lib/par-3303";
import { houseMin, onHand, useParStore } from "@/lib/par-store";
import { changeHouseMin, changeHouseQty, loadParHouse, resetHouseMins, resetHouseQty } from "@/lib/par-house";
import { lockIsaAdmin, requireIsaAdmin } from "@/lib/isa-house";
import { useTrainingStore } from "@/lib/store";
import { cn } from "@/lib/utils";

export function EmsPar() {
  const level = useParStore((s) => s.level);
  const setLevel = useParStore((s) => s.setLevel);
  const qty = useParStore((s) => s.qty);
  const min = useParStore((s) => s.min);
  const status = useParStore((s) => s.status);
  const error = useParStore((s) => s.error);
  const unlocked = useTrainingStore((s) => s.isaAdminUnlocked);
  const [q, setQ] = useState("");
  const [onlyShort, setOnlyShort] = useState(false);

  function needOf(item: ParItem) {
    if (stationMin(item, level) == null) return null;
    return houseMin(item.id, level, min);
  }

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return PAR_ITEMS.filter((item) => {
      const p = needOf(item);
      if (p == null) return false;
      if (needle && !item.name.toLowerCase().includes(needle) && !item.section.toLowerCase().includes(needle)) {
        return false;
      }
      const have = onHand(item.id, qty, level);
      if (onlyShort && have >= p) return false;
      return true;
    });
  }, [level, q, onlyShort, qty, min]);

  const shortCount = useMemo(() => {
    return PAR_ITEMS.filter((item) => {
      const p = needOf(item);
      if (p == null) return false;
      return onHand(item.id, qty, level) < p;
    }).length;
  }, [level, qty, min]);

  const grouped = useMemo(() => {
    return PAR_SECTIONS.map((section) => ({
      section,
      items: rows.filter((r) => r.section === section),
    })).filter((g) => g.items.length);
  }, [rows]);

  return (
    <section className="flex flex-col gap-4 pb-8">
      <p className="text-sm leading-relaxed text-muted">
        Cabinet check for two ALS engines on duty, with a little extra if a 3rd is up.
        On-hand is the house count. Station min stays locked unless admin unlocks.
      </p>

      {unlocked ? (
        <button
          type="button"
          onClick={lockIsaAdmin}
          className="flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface-2 text-sm font-semibold text-navy"
        >
          <Lock className="size-4" />
          Lock station mins
        </button>
      ) : (
        <button
          type="button"
          onClick={() => requireIsaAdmin(() => undefined)}
          className="flex h-11 items-center justify-center gap-2 rounded-md bg-navy text-sm font-semibold text-cream"
        >
          <Unlock className="size-4" />
          Unlock to edit mins
        </button>
      )}

      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setLevel("bls")}
          className={cn(
            "h-10 flex-1 rounded-sm text-sm font-semibold",
            level === "bls" ? "bg-navy text-cream" : "bg-surface-2 text-muted",
          )}
        >
          BLS
        </button>
        <button
          type="button"
          onClick={() => setLevel("als")}
          className={cn(
            "h-10 flex-1 rounded-sm text-sm font-semibold",
            level === "als" ? "bg-navy text-cream" : "bg-surface-2 text-muted",
          )}
        >
          ALS
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOnlyShort(false)}
          className={cn(
            "h-10 flex-1 rounded-sm text-sm font-semibold",
            !onlyShort ? "bg-navy text-cream" : "bg-surface-2 text-muted",
          )}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setOnlyShort(true)}
          className={cn(
            "h-10 flex-1 rounded-sm text-sm font-semibold",
            onlyShort ? "bg-ember text-ember-fg" : "bg-surface-2 text-muted",
          )}
        >
          Short{shortCount ? ` · ${shortCount}` : ""}
        </button>
      </div>

      <label className="flex h-11 items-center gap-2 rounded-sm border border-line bg-surface-2 px-3">
        <Search className="size-4 text-muted" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search gauze, naloxone, i-gel…"
          className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
        />
      </label>

      <p className="text-xs text-muted">
        {level === "bls" ? "Station BLS" : "Station ALS"} · {rows.length} items
        {shortCount ? ` · ${shortCount} short` : ""}
        {unlocked ? " · mins unlocked" : ""}
        {status === "loading" ? " · syncing house" : ""}
        {status === "ready" ? " · house list" : ""}
      </p>
      {error ? (
        <p className="rounded-md border border-line bg-surface-2 p-3 text-sm text-ember">
          {error}{" "}
          <button type="button" className="font-semibold underline" onClick={() => void loadParHouse()}>
            Retry
          </button>
        </p>
      ) : null}

      {grouped.map((g) => (
        <details key={g.section} className="rounded-lg border border-line bg-surface-2">
          <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-navy">
            <span>{g.section}</span>
            <span className="text-xs font-medium text-muted">{g.items.length}</span>
          </summary>
          <ul className="divide-y divide-line border-t border-line">
            {g.items.map((item) => (
              <ParRow
                key={item.id}
                item={item}
                have={onHand(item.id, qty, level)}
                need={needOf(item) ?? 0}
                canEditMin={unlocked}
                onQty={(d) => void changeHouseQty(item.id, d)}
                onMin={(d) => changeHouseMin(item.id, d)}
              />
            ))}
          </ul>
        </details>
      ))}

      {!rows.length ? (
        <p className="rounded-md border border-line bg-surface-2 p-3 text-sm text-muted">
          Nothing matches. Clear search or show All.
        </p>
      ) : null}

      {unlocked ? (
        <>
          <Button type="button" variant="outline" onClick={() => resetHouseQty(level)}>
            <RotateCcw className="size-4" />
            Reset {level.toUpperCase()} on-hand
          </Button>
          <Button type="button" variant="outline" onClick={() => resetHouseMins(level)}>
            <RotateCcw className="size-4" />
            Reset mins to station defaults
          </Button>
        </>
      ) : null}
      <a
        href="/docs/remsa-3303.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex h-11 items-center justify-center gap-2 text-sm font-semibold text-navy"
      >
        Open REMSA 3303
        <ExternalLink className="size-4" />
      </a>
    </section>
  );
}

function ParRow({
  item,
  have,
  need,
  canEditMin,
  onQty,
  onMin,
}: {
  item: ParItem;
  have: number;
  need: number;
  canEditMin: boolean;
  onQty: (delta: number) => void;
  onMin: (delta: number) => void;
}) {
  const short = have < need;
  return (
    <li className={cn("px-3 py-2.5", short && "bg-ember/5")}>
      <p className={cn("text-sm font-semibold leading-snug", short ? "text-ember" : "text-ink")}>
        {item.name}
      </p>
      <div className={cn("mt-2 gap-3", canEditMin ? "grid grid-cols-2" : "flex items-end")}>
        <div className="flex-1">
          <Stepper label="On hand" value={have} warn={short} onDelta={onQty} />
        </div>
        {canEditMin ? (
          <Stepper label="Station min" value={need} warn={false} onDelta={onMin} />
        ) : (
          <div className="w-20 pb-1 text-right">
            <p className="text-[10px] font-medium tracking-wide text-muted uppercase">Station min</p>
            <p className="mt-2 text-base font-semibold tabular-nums text-navy">{need}</p>
          </div>
        )}
      </div>
    </li>
  );
}

function Stepper({
  label,
  value,
  warn,
  onDelta,
}: {
  label: string;
  value: number;
  warn: boolean;
  onDelta: (delta: number) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-wide text-muted uppercase">{label}</p>
      <div className="mt-1 flex items-center gap-1">
        <button
          type="button"
          aria-label={`Decrease ${label}`}
          onClick={() => onDelta(-1)}
          className="flex size-11 items-center justify-center rounded-md border border-line bg-surface text-navy"
        >
          <Minus className="size-4" />
        </button>
        <span
          className={cn(
            "min-w-8 flex-1 text-center text-base font-semibold tabular-nums",
            warn ? "text-ember" : "text-navy",
          )}
        >
          {value}
        </span>
        <button
          type="button"
          aria-label={`Increase ${label}`}
          onClick={() => onDelta(1)}
          className="flex size-11 items-center justify-center rounded-md border border-line bg-surface text-navy"
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  );
}


