import {
  bumpParMin,
  bumpParQty,
  listParHouse,
  resetFacilityMins,
  resetFacilityQty,
  resetParMins,
  resetParQty,
  seedParHouse,
} from "@/lib/par-api";
import type { ParLevel } from "@/lib/par-3303";
import { useParStore, type ParHouse } from "@/lib/par-store";
import { requireIsaAdmin, type AdminCreds } from "@/lib/isa-house";

const MIGRATED_KEY = "cfd-ems-par-migrated";

let inflight: Promise<ParHouse | null> | null = null;
let writeChain = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeChain.then(fn, fn);
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function leftoverLocalPar(): ParHouse | null {
  if (typeof window === "undefined") return null;
  try {
    if (localStorage.getItem(MIGRATED_KEY)) return null;
    const raw = localStorage.getItem("cfd-ems-par-v1");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { qty?: Record<string, number>; min?: Record<string, number> } };
    const qty = parsed.state?.qty ?? {};
    const min = parsed.state?.min ?? {};
    if (!Object.keys(qty).length && !Object.keys(min).length) return null;
    return { qty, min };
  } catch {
    return null;
  }
}

function markMigrated() {
  try {
    localStorage.setItem(MIGRATED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function applyParHouse(house: ParHouse) {
  useParStore.getState().applyHouse(house);
}

export async function loadParHouse(): Promise<ParHouse | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    useParStore.getState().setStatus("loading");
    try {
      let house = await listParHouse();
      const leftover = leftoverLocalPar();
      if (!Object.keys(house.qty).length && leftover) {
        house = await seedParHouse({ data: leftover });
      }
      markMigrated();
      applyParHouse(house);
      useParStore.getState().setStatus("ready");
      return house;
    } catch (err) {
      useParStore.getState().setStatus("error", err instanceof Error ? err.message : "Could not load house PAR.");
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export async function changeHouseQty(id: string, delta: number) {
  useParStore.getState().bumpQty(id, delta);
  return enqueue(async () => {
    const house = await bumpParQty({ data: { id, delta } });
    applyParHouse(house);
    useParStore.getState().setStatus("ready");
    return house;
  }).catch(async (err) => {
    useParStore.getState().setStatus("error", err instanceof Error ? err.message : "Could not save on-hand.");
    await loadParHouse();
    return null;
  });
}

export function changeHouseMin(id: string, delta: number) {
  requireIsaAdmin(async (creds: AdminCreds) => {
    useParStore.getState().bumpMin(id, delta);
    await enqueue(async () => {
      const result = await bumpParMin({ data: { ...creds, id, delta } });
      if (!result.ok) throw new Error(result.error);
      applyParHouse(result.house);
      useParStore.getState().setStatus("ready");
    }).catch(async (err) => {
      useParStore.getState().setStatus("error", err instanceof Error ? err.message : "Could not save min.");
      await loadParHouse();
    });
  });
}

export function resetHouseQty(level: ParLevel) {
  requireIsaAdmin(async (creds: AdminCreds) => {
    await enqueue(async () => {
      const result = await resetParQty({ data: { ...creds, level } });
      if (!result.ok) throw new Error(result.error);
      applyParHouse(result.house);
      useParStore.getState().setStatus("ready");
    }).catch(async (err) => {
      useParStore.getState().setStatus("error", err instanceof Error ? err.message : "Could not reset on-hand.");
      await loadParHouse();
    });
  });
}

export function resetHouseMins(level: ParLevel) {
  requireIsaAdmin(async (creds: AdminCreds) => {
    await enqueue(async () => {
      const result = await resetParMins({ data: { ...creds, level } });
      if (!result.ok) throw new Error(result.error);
      applyParHouse(result.house);
      useParStore.getState().setStatus("ready");
    }).catch(async (err) => {
      useParStore.getState().setStatus("error", err instanceof Error ? err.message : "Could not reset mins.");
      await loadParHouse();
    });
  });
}

export function resetHouseFacilityQty() {
  requireIsaAdmin(async (creds: AdminCreds) => {
    await enqueue(async () => {
      const result = await resetFacilityQty({ data: creds });
      if (!result.ok) throw new Error(result.error);
      applyParHouse(result.house);
      useParStore.getState().setStatus("ready");
    }).catch(async (err) => {
      useParStore.getState().setStatus("error", err instanceof Error ? err.message : "Could not reset on-hand.");
      await loadParHouse();
    });
  });
}

export function resetHouseFacilityMins() {
  requireIsaAdmin(async (creds: AdminCreds) => {
    await enqueue(async () => {
      const result = await resetFacilityMins({ data: creds });
      if (!result.ok) throw new Error(result.error);
      applyParHouse(result.house);
      useParStore.getState().setStatus("ready");
    }).catch(async (err) => {
      useParStore.getState().setStatus("error", err instanceof Error ? err.message : "Could not reset mins.");
      await loadParHouse();
    });
  });
}

