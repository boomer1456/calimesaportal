import type { ParItem } from "@/lib/par-3303";

export const FACILITY_SECTIONS = ["Cleaners", "Soap & paper", "Trash & kitchen", "Mops"] as const;

/** Printed station pars from the facilities sheet. On-hand starts at 0. */
export const FACILITY_ITEMS: ParItem[] = [
  { id: "fac-window-cleaner", name: "Window Cleaner 1 Gallon", section: "Cleaners", blsMin: 12, alsMin: 12 },
  {
    id: "fac-antibacterial-apc",
    name: "Antibacterial All Purpose Cleaner 128oz",
    section: "Cleaners",
    blsMin: 6,
    alsMin: 6,
  },
  {
    id: "fac-degreaser-2l",
    name: "All Purpose Cleaner / Degreaser 2L",
    section: "Cleaners",
    blsMin: 12,
    alsMin: 12,
  },
  { id: "fac-ajax", name: "AJAX", section: "Cleaners", blsMin: 12, alsMin: 12 },
  { id: "fac-pine-sol", name: "Pine Sol", section: "Cleaners", blsMin: 6, alsMin: 6 },
  { id: "fac-disinfectant-spray", name: "Disinfectant Spray", section: "Cleaners", blsMin: 8, alsMin: 8 },
  {
    id: "fac-hand-soap",
    name: "Hand Soap Antibacterial 1 Gallon",
    section: "Soap & paper",
    blsMin: 8,
    alsMin: 8,
  },
  {
    id: "fac-cascade",
    name: "Dish Washer Soap Cascade 120 oz (4 cartons #28193)",
    section: "Soap & paper",
    blsMin: 6,
    alsMin: 6,
  },
  { id: "fac-toilet-paper", name: "Toilet Paper #16880 (boxes)", section: "Soap & paper", blsMin: 4, alsMin: 4 },
  { id: "fac-multifold", name: "Multifold Towels (boxes)", section: "Soap & paper", blsMin: 4, alsMin: 4 },
  { id: "fac-laundry", name: "Laundry Detergent", section: "Soap & paper", blsMin: 5, alsMin: 5 },
  {
    id: "fac-dawn",
    name: "Dish Soap Dawn Professional",
    section: "Soap & paper",
    blsMin: 12,
    alsMin: 12,
  },
  { id: "fac-tydbol", name: "Ty-D-Bol Toilet Tablets", section: "Soap & paper", blsMin: 4, alsMin: 4 },
  {
    id: "fac-liner-24x33",
    name: "Trash Liner 24×33 CRHD 2433H",
    section: "Trash & kitchen",
    blsMin: 6,
    alsMin: 6,
  },
  {
    id: "fac-liner-55",
    name: "Trash Liner large 55 gallon",
    section: "Trash & kitchen",
    blsMin: 8,
    alsMin: 8,
  },
  {
    id: "fac-sponges",
    name: "Yellow Kitchen Sponges (boxes)",
    section: "Trash & kitchen",
    blsMin: 2,
    alsMin: 2,
  },
  { id: "fac-mop-heads", name: "Mop Heads", section: "Mops", blsMin: 4, alsMin: 4 },
  { id: "fac-mop-handles", name: "Mop Handles", section: "Mops", blsMin: 2, alsMin: 2 },
];

export function isFacilityItem(id: string) {
  return id.startsWith("fac-");
}