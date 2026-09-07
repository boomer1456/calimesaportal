import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PAR_ITEMS, defaultQty, protocolMin, stationMin, type ParLevel } from "@/lib/par-3303";

export type ParHouse = {
  qty: Record<string, number>;
  min: Record<string, number>;
};

type ParStatus = "idle" | "loading" | "ready" | "error";

type ParState = ParHouse & {
  level: ParLevel;
  status: ParStatus;
  error: string | null;
  setLevel: (level: ParLevel) => void;
  setQty: (id: string, n: number) => void;
  setMin: (id: string, n: number) => void;
  bumpQty: (id: string, delta: number) => void;
  bumpMin: (id: string, delta: number) => void;
  applyHouse: (house: ParHouse) => void;
  setStatus: (status: ParStatus, error?: string) => void;
  resetLevel: () => void;
  resetMins: () => void;
};

function clamp(n: number) {
  return Math.max(0, Math.min(999, Math.round(n)));
}

export function houseMin(id: string, level: ParLevel, override: Record<string, number>): number {
  if (override[id] != null) return override[id];
  const item = PAR_ITEMS.find((x) => x.id === id);
  return item ? stationMin(item, level) ?? 0 : 0;
}

export function onHand(id: string, qty: Record<string, number>, _level: ParLevel): number {
  if (qty[id] != null) return qty[id];
  const item = PAR_ITEMS.find((x) => x.id === id);
  return item ? defaultQty(item) : 0;
}

export const useParStore = create<ParState>()(
  persist(
    (set, get) => ({
      level: "als",
      qty: {},
      min: {},
      status: "idle",
      error: null,
      setLevel: (level) => set({ level }),
      setQty: (id, n) => set({ qty: { ...get().qty, [id]: clamp(n) } }),
      setMin: (id, n) => set({ min: { ...get().min, [id]: clamp(n) } }),
      bumpQty: (id, delta) => {
        const { qty, level } = get();
        const cur = onHand(id, qty, level);
        set({ qty: { ...qty, [id]: clamp(cur + delta) } });
      },
      bumpMin: (id, delta) => {
        const { min, level } = get();
        const cur = houseMin(id, level, min);
        set({ min: { ...min, [id]: clamp(cur + delta) } });
      },
      applyHouse: (house) => set({ qty: house.qty, min: house.min, status: "ready", error: null }),
      setStatus: (status, error) => set({ status, error: error ?? null }),
      resetLevel: () => {
        const { level, qty } = get();
        const nextQty = { ...qty };
        for (const item of PAR_ITEMS) {
          if (protocolMin(item, level) == null) continue;
          delete nextQty[item.id];
        }
        set({ qty: nextQty });
      },
      resetMins: () => {
        const { level, min } = get();
        const nextMin = { ...min };
        for (const item of PAR_ITEMS) {
          if (protocolMin(item, level) == null) continue;
          delete nextMin[item.id];
        }
        set({ min: nextMin });
      },
    }),
    {
      name: "cfd-ems-par-v1",
      partialize: (s) => ({ level: s.level, qty: s.qty, min: s.min }),
    },
  ),
);
