import { useEffect, useId, useRef, useState } from "react";
import { Lock } from "lucide-react";
import { useBackLayer } from "@/components/back-stack";
import { Button } from "@/components/ui/button";
import {
  cancelAdminUnlock,
  completeAdminUnlock,
  getAdminCreds,
} from "@/lib/isa-house";
import { useTrainingStore } from "@/lib/store";

export function IsaAdminDialog() {
  const open = useTrainingStore((s) => s.adminPrompt);
  const titleId = useId();
  const userRef = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  useBackLayer(open, () => cancelAdminUnlock());

  useEffect(() => {
    if (!open) return;
    const existing = getAdminCreds();
    setUsername(existing?.username ?? "");
    setPassword("");
    setError(null);
    const t = window.setTimeout(() => userRef.current?.focus(), 40);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") cancelAdminUnlock();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  async function unlock() {
    setBusy(true);
    setError(null);
    try {
      const result = await completeAdminUnlock({ username, password });
      if (!result.ok) {
        setError(result.error);
        setPassword("");
      }
    } catch {
      setError("Could not unlock. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="no-print fixed inset-0 z-50 flex items-end justify-center bg-navy/70 p-4 sm:items-center"
      role="presentation"
      onClick={cancelAdminUnlock}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-sm rounded-lg border border-line bg-surface-2 p-4 shadow-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-navy text-cream">
            <Lock className="size-5" />
          </span>
          <div>
            <h2 id={titleId} className="font-display text-2xl font-bold text-navy">
              House admin
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              Username and password to change the ISA roster or station PAR mins.
            </p>
          </div>
        </div>
        <form
          className="mt-4 flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void unlock();
          }}
        >
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">
              Username
            </span>
            <input
              ref={userRef}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            />
          </label>
          {error ? <p className="text-sm text-ember">{error}</p> : null}
          <div className="mt-1 grid grid-cols-2 gap-2">
            <Button type="button" variant="outline" onClick={cancelAdminUnlock}>
              Cancel
            </Button>
            <Button type="submit" variant="navy" disabled={busy || !username || !password}>
              {busy ? "Checking…" : "Unlock"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
