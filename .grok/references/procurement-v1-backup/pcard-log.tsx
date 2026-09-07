import { useEffect, useState } from "react";
import { deletePcard, listPcards } from "@/lib/procurement-api";
import type { PcardSummary } from "@/lib/pcard";

function prettyDate(iso: string) {
  if (!iso) return "No date";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function PcardLog({
  query,
  onOpen,
}: {
  query: string;
  onOpen: (id: string) => void;
}) {
  const [rows, setRows] = useState<PcardSummary[] | null>(null);
  const [pending, setPending] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    void listPcards()
      .then((list) => {
        if (live) setRows(list);
      })
      .catch(() => {
        if (live) setRows([]);
      });
    return () => {
      live = false;
    };
  }, []);

  async function remove(id: string) {
    setBusy(id);
    try {
      await deletePcard({ data: { id } });
      setRows((cur) => (cur ?? []).filter((row) => row.id !== id));
      setPending(null);
    } catch {
      setPending(null);
    } finally {
      setBusy(null);
    }
  }

  const needle = query.trim().toLowerCase();
  const shown = (rows ?? []).filter((row) => {
    if (!needle) return true;
    return [row.vendor, row.who, row.amount, row.date, row.coding, row.card]
      .join(" ")
      .toLowerCase()
      .includes(needle);
  });

  if (rows === null) {
    return <p className="text-sm text-muted">Loading archived receipts…</p>;
  }

  if (!rows.length) {
    return (
      <p className="text-sm leading-relaxed text-muted">
        Nothing archived yet. Save a procurement card and it lands here.
      </p>
    );
  }

  if (!shown.length) {
    return <p className="text-sm text-muted">No receipts match that search.</p>;
  }

  return (
    <ul className="divide-y divide-line rounded-md border border-line bg-surface-2">
      {shown.map((row) => (
        <li key={row.id} className="flex items-stretch">
          <button
            type="button"
            onClick={() => onOpen(row.id)}
            className="min-h-14 min-w-0 flex-1 px-3 py-2.5 text-left"
          >
            <span className="block truncate text-sm font-semibold text-ink">
              {row.vendor || "Receipt"}
              {row.amount ? ` · ${row.amount}` : ""}
            </span>
            <span className="block truncate text-xs text-muted">
              {prettyDate(row.date)}
              {row.who ? ` · ${row.who}` : ""}
            </span>
          </button>
          {pending === row.id ? (
            <span className="flex shrink-0 items-center gap-1 pr-2">
              <button
                type="button"
                disabled={busy === row.id}
                onClick={() => setPending(null)}
                className="h-10 px-2 text-xs font-semibold text-muted"
              >
                Keep
              </button>
              <button
                type="button"
                disabled={busy === row.id}
                onClick={() => void remove(row.id)}
                className="h-10 px-2 text-xs font-semibold text-ember"
              >
                {busy === row.id ? "…" : "Delete"}
              </button>
            </span>
          ) : (
            <span className="flex shrink-0 items-center gap-1 pr-2">
              <button
                type="button"
                onClick={() => onOpen(row.id)}
                className="h-10 px-2 text-xs font-semibold text-navy"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => setPending(row.id)}
                className="h-10 px-2 text-xs font-semibold text-ember"
              >
                Delete
              </button>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
