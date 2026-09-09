import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  DEFAULT_ISA_META,
  SEED_ROSTER,
  type IsaEntry,
  type IsaFirefighter,
  type IsaMeta,
} from "./isa";
import type { AppYear, EventStatus, Shift } from "./training-data";
import { stationYmd } from "./training-data";

export type Tab =
  | "home"
  | "calendar"
  | "skills"
  | "remsa"
  | "ems"
  | "rookie"
  | "map"
  | "policy"
  | "isa"
  | "weather"
  | "strike";
export type ShiftFilter = "all" | Shift;
export type CalendarView = "month" | "list";
export type PolicyPane = "policies" | "forms" | "radio" | "contacts";
export type RookiePane = "map" | "life" | "ops";
export type IsaPane = "log" | "sheet" | "roster" | "course";
export type HouseStatus = "idle" | "loading" | "ready" | "error";

function defaultYear(): AppYear {
  const y = stationYmd().year;
  if (y === 2027) return 2027;
  return 2026;
}

function defaultMonth() {
  const now = stationYmd();
  const y = defaultYear();
  if (now.year === y) return now.month;
  return y === 2026 ? now.month : 1;
}

type TrainingState = {
  tab: Tab;
  year: AppYear;
  month: number;
  calendarView: CalendarView;
  shiftFilter: ShiftFilter;
  selectedEventId: string | null;
  policyPane: PolicyPane;
  rookiePane: RookiePane;
  isaPane: IsaPane;
  isaEventId: string | null;
  formFillId: string | null;
  status: Record<string, Exclude<EventStatus, "open">>;
  notes: Record<string, string>;
  installHintDismissed: boolean;
  roster: IsaFirefighter[];
  isaEntries: IsaEntry[];
  isaMeta: IsaMeta;
  houseStatus: HouseStatus;
  houseError: string | null;
  isaAdminUnlocked: boolean;
  adminPrompt: boolean;
  setTab: (tab: Tab) => void;
  goHome: () => void;
  setYear: (year: AppYear) => void;
  setMonth: (month: number) => void;
  setCalendarView: (view: CalendarView) => void;
  setShiftFilter: (shift: ShiftFilter) => void;
  setPolicyPane: (pane: PolicyPane) => void;
  setRookiePane: (pane: RookiePane) => void;
  setIsaPane: (pane: IsaPane) => void;
  openEvent: (id: string | null) => void;
  openDrill: (ev: { id: string; year: AppYear; month: number }) => void;
  openIsa: (open: boolean, eventId?: string) => void;
  openPcard: () => void;
  openTimecard: () => void;
  setStatus: (id: string, status: EventStatus) => void;
  setNote: (id: string, note: string) => void;
  dismissInstallHint: () => void;
  applyHouse: (house: {
    roster: IsaFirefighter[];
    entries: IsaEntry[];
    meta: IsaMeta;
  }) => void;
  setHouseStatus: (status: HouseStatus, error?: string | null) => void;
  setIsaAdminUnlocked: (unlocked: boolean) => void;
  setAdminPrompt: (open: boolean) => void;
};

export const useTrainingStore = create<TrainingState>()(
  persist(
    (set) => ({
      tab: "home",
      year: defaultYear(),
      month: defaultMonth(),
      calendarView: "list",
      shiftFilter: "all",
      selectedEventId: null,
      policyPane: "policies",
      rookiePane: "life",
      isaPane: "log",
      isaEventId: null,
      formFillId: null,
      status: {},
      notes: {},
      installHintDismissed: false,
      roster: SEED_ROSTER,
      isaEntries: [],
      isaMeta: DEFAULT_ISA_META,
      houseStatus: "idle",
      houseError: null,
      isaAdminUnlocked: false,
      adminPrompt: false,
      setTab: (tab) =>
        set({
          tab,
          selectedEventId: null,
          formFillId: null,
        }),
      goHome: () => set({ tab: "home", selectedEventId: null, formFillId: null }),
      setYear: (year) =>
        set((s) => ({
          year,
          selectedEventId: null,
          month: s.month,
        })),
      setMonth: (month) => set({ month, selectedEventId: null }),
      setCalendarView: (calendarView) => set({ calendarView }),
      setShiftFilter: (shiftFilter) => set({ shiftFilter }),
      setPolicyPane: (policyPane) => set({ policyPane }),
      setRookiePane: (rookiePane) => set({ rookiePane }),
      setIsaPane: (isaPane) => set({ isaPane }),
      openEvent: (selectedEventId) => set({ selectedEventId }),
      openDrill: (ev) =>
        set({
          tab: "calendar",
          selectedEventId: ev.id,
          year: ev.year,
          month: ev.month,
        }),
      openIsa: (open, eventId) =>
        set(
          open
            ? { tab: "isa", selectedEventId: null, isaPane: "log", isaEventId: eventId ?? null, formFillId: null }
            : { tab: "home", selectedEventId: null, isaEventId: null },
        ),
      openPcard: () =>
        set({
          tab: "policy",
          policyPane: "forms",
          formFillId: "P-Card",
          selectedEventId: null,
        }),
      openTimecard: () =>
        set({
          tab: "policy",
          policyPane: "forms",
          formFillId: "Time-card",
          selectedEventId: null,
        }),
      setStatus: (id, status) =>
        set((s) => {
          const next = { ...s.status };
          if (status === "open") delete next[id];
          else next[id] = status;
          return { status: next };
        }),
      setNote: (id, note) =>
        set((s) => ({
          notes: { ...s.notes, [id]: note },
        })),
      dismissInstallHint: () => set({ installHintDismissed: true }),
      applyHouse: (house) =>
        set({
          roster: house.roster.length ? house.roster : SEED_ROSTER,
          isaEntries: house.entries,
          isaMeta: house.meta,
          houseStatus: "ready",
          houseError: null,
        }),
      setHouseStatus: (houseStatus, houseError = null) =>
        set({ houseStatus, houseError: houseError ?? null }),
      setIsaAdminUnlocked: (isaAdminUnlocked) => set({ isaAdminUnlocked }),
      setAdminPrompt: (adminPrompt) => set({ adminPrompt }),
    }),
    {
      name: "cfd-training-v2",
      skipHydration: true,
      partialize: (s) => ({
        year: s.year,
        shiftFilter: s.shiftFilter,
        status: s.status,
        notes: s.notes,
        installHintDismissed: s.installHintDismissed,
        month: s.month,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<TrainingState>;
        return {
          ...current,
          year: p.year ?? current.year,
          shiftFilter: p.shiftFilter ?? current.shiftFilter,
          status: p.status ?? current.status,
          notes: p.notes ?? current.notes,
          installHintDismissed: p.installHintDismissed ?? current.installHintDismissed,
          month: p.month ?? current.month,
        };
      },
    },
  ),
);
