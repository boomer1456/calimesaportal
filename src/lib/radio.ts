import { RADIO_RAW } from "./radio-channels";

export type RadioGroup =
  | "rru"
  | "rvc-cmd"
  | "rvc-tac"
  | "interop"
  | "cdf-cmd"
  | "cdf-tac"
  | "air"
  | "ems"
  | "mutual"
  | "emergency"
  | "other";

export type RadioChannel = {
  id: string;
  bank: string;
  group: RadioGroup;
  ch: number;
  name: string;
  rx: string;
  rxTone: string;
  tx: string;
  txTone: string;
  pwr: string;
  notes: string;
};

export const RADIO_CHANNELS = RADIO_RAW as RadioChannel[];

export const RADIO_GROUPS: Array<{ id: "daily" | "all" | RadioGroup; label: string }> = [
  { id: "daily", label: "Daily" },
  { id: "rru", label: "RRU" },
  { id: "rvc-cmd", label: "RVC Cmd" },
  { id: "rvc-tac", label: "RVC TAC" },
  { id: "interop", label: "Interop" },
  { id: "cdf-cmd", label: "CDF Cmd" },
  { id: "cdf-tac", label: "CDF TAC" },
  { id: "air", label: "Air" },
  { id: "ems", label: "EMS" },
  { id: "mutual", label: "Mutual" },
  { id: "emergency", label: "Guard" },
  { id: "all", label: "All" },
];

const DAILY: RadioGroup[] = ["rru", "rvc-cmd", "rvc-tac", "interop", "ems", "emergency"];

export const CALFIRE_TONES: Array<{ id: string; hz: string }> = [
  { id: "T1", hz: "110.9" },
  { id: "T2", hz: "123.0" },
  { id: "T3", hz: "131.8" },
  { id: "T4", hz: "136.5" },
  { id: "T5", hz: "146.2" },
  { id: "T6", hz: "156.7" },
  { id: "T7", hz: "167.9" },
  { id: "T8", hz: "103.5" },
  { id: "T16", hz: "192.8" },
];

export function filterChannels(
  query: string,
  group: (typeof RADIO_GROUPS)[number]["id"],
): RadioChannel[] {
  const q = query.trim().toLowerCase();
  return RADIO_CHANNELS.filter((c) => {
    if (group === "daily" && !DAILY.includes(c.group)) return false;
    if (group !== "all" && group !== "daily" && c.group !== group) return false;
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.notes.toLowerCase().includes(q) ||
      c.rx.includes(q) ||
      c.tx.includes(q) ||
      String(c.ch) === q
    );
  });
}
