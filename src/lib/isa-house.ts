import {
  addIsaHouseEntries,
  importIsaLocal,
  listIsaHouse,
  removeIsaFirefighter,
  removeIsaHouseBatch,
  removeIsaHouseEntry,
  saveIsaFirefighter,
  saveIsaMeta,
  verifyIsaAdmin,
} from "@/lib/isa-api";
import type { IsaEntry, IsaFirefighter, IsaMeta } from "@/lib/isa";
import { useTrainingStore } from "@/lib/store";

const ADMIN_KEY = "cfd-isa-admin";
const MIGRATED_KEY = "cfd-isa-migrated";

export type AdminCreds = { username: string; password: string };
export type IsaHouse = {
  roster: IsaFirefighter[];
  entries: IsaEntry[];
  meta: IsaMeta;
};

let inflight: Promise<IsaHouse | null> | null = null;
let pendingAdmin: ((creds: AdminCreds) => void | Promise<void>) | null = null;

export function getAdminCreds(): AdminCreds | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminCreds;
    if (!parsed.username || !parsed.password) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function setAdminCreds(creds: AdminCreds | null) {
  if (typeof window === "undefined") return;
  try {
    if (creds) sessionStorage.setItem(ADMIN_KEY, JSON.stringify(creds));
    else sessionStorage.removeItem(ADMIN_KEY);
  } catch {
    /* ignore */
  }
  useTrainingStore.getState().setIsaAdminUnlocked(Boolean(creds));
}

export function applyHouse(house: IsaHouse) {
  useTrainingStore.getState().applyHouse(house);
}

function leftoverLocalIsa(): { entries: IsaEntry[]; roster: IsaFirefighter[] } | null {
  if (typeof window === "undefined") return null;
  try {
    if (localStorage.getItem(MIGRATED_KEY)) return null;
    const raw = localStorage.getItem("cfd-training-v2");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { isaEntries?: IsaEntry[]; roster?: IsaFirefighter[] } };
    const state = parsed.state ?? (parsed as { isaEntries?: IsaEntry[]; roster?: IsaFirefighter[] });
    if (!state.isaEntries?.length) return null;
    return { entries: state.isaEntries, roster: state.roster ?? [] };
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

export function messageFrom(err: unknown): string {
  if (err instanceof Error && err.message) return err.message;
  return "Could not reach the house log. Try again.";
}

export async function loadIsaHouse(): Promise<IsaHouse | null> {
  if (inflight) return inflight;
  inflight = (async () => {
    useTrainingStore.getState().setHouseStatus("loading");
    try {
      let house = await listIsaHouse();
      const leftover = leftoverLocalIsa();
      if (!house.entries.length && leftover?.entries.length) {
        house = await importIsaLocal({
          data: { entries: leftover.entries, roster: leftover.roster },
        });
        markMigrated();
      } else {
        markMigrated();
      }
      applyHouse(house);
      useTrainingStore.getState().setHouseStatus("ready");
      return house;
    } catch (err) {
      useTrainingStore.getState().setHouseStatus("error", messageFrom(err));
      return null;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}

export function requireIsaAdmin(action: (creds: AdminCreds) => void | Promise<void>) {
  const creds = getAdminCreds();
  if (creds) {
    void action(creds);
    return;
  }
  pendingAdmin = action;
  useTrainingStore.getState().setAdminPrompt(true);
}

export async function completeAdminUnlock(creds: AdminCreds) {
  const result = await verifyIsaAdmin({ data: creds });
  if (!result.ok) return result;
  setAdminCreds(creds);
  useTrainingStore.getState().setAdminPrompt(false);
  const fn = pendingAdmin;
  pendingAdmin = null;
  if (fn) await fn(creds);
  return result;
}

export function cancelAdminUnlock() {
  pendingAdmin = null;
  useTrainingStore.getState().setAdminPrompt(false);
}

export function lockIsaAdmin() {
  pendingAdmin = null;
  setAdminCreds(null);
  useTrainingStore.getState().setAdminPrompt(false);
}

export async function submitIsaHours(input: {
  eventId?: string;
  iorPresent: boolean;
  drafts: Array<{
    firefighterId: string;
    date: string;
    time: string;
    hours: number;
    assignmentId: string;
    description: string;
  }>;
}) {
  const result = await addIsaHouseEntries({ data: input });
  if (result.house) applyHouse(result.house);
  return result;
}

async function runAdmin<T extends { ok: boolean; house?: IsaHouse; error?: string }>(
  creds: AdminCreds,
  call: (creds: AdminCreds) => Promise<T>,
): Promise<T> {
  const result = await call(creds);
  if (result.house) applyHouse(result.house);
  if (!result.ok && result.error === "Wrong username or password.") {
    lockIsaAdmin();
  }
  return result;
}

export async function saveHouseFirefighter(ff: IsaFirefighter, creds: AdminCreds) {
  return runAdmin(creds, (c) =>
    saveIsaFirefighter({ data: { ...c, firefighter: ff } }),
  );
}

export async function deleteHouseFirefighter(id: string, creds: AdminCreds) {
  return runAdmin(creds, (c) => removeIsaFirefighter({ data: { ...c, id } }));
}

export async function deleteHouseEntry(id: string, creds: AdminCreds) {
  return runAdmin(creds, (c) => removeIsaHouseEntry({ data: { ...c, id } }));
}

export async function deleteHouseBatch(batchId: string, creds: AdminCreds) {
  return runAdmin(creds, (c) => removeIsaHouseBatch({ data: { ...c, batchId } }));
}

export async function saveHouseMeta(meta: IsaMeta, creds: AdminCreds) {
  return runAdmin(creds, (c) => saveIsaMeta({ data: { ...c, meta } }));
}
