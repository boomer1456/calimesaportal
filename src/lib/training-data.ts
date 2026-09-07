import { RAW_2026 } from "./events-2026";

export type AppYear = 2026 | 2027;
export type Shift = "A" | "B" | "C";
export type EvalKind = "skill" | "drill" | "multi" | "night";
export type EventStatus = "open" | "done" | "missed" | "makeup";

export type Topic = {
  key: string;
  short: string;
  title: string;
  objective: string;
  hours: number;
  evalKind: EvalKind;
  location: string;
  equipment: string;
  doThis: string[];
};

export type TrainingEvent = {
  id: string;
  year: AppYear;
  date: string;
  month: number;
  day: number;
  shift?: Shift;
  topicKey: string;
  night?: boolean;
  extra?: string;
  label?: string;
};

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

export const MONTH_FOCUS: Record<
  number,
  { primary: string; secondary: string; night?: Shift }
> = {
  1: {
    primary: "PPE / SCBA and emergency procedures",
    secondary: "Mayday / RIT and firefighter survival",
  },
  2: {
    primary: "Hose deployment and coordinated fire attack",
    secondary: "Radio, ICS, accountability, and command transfer",
  },
  3: {
    primary: "Wildland LCES, shelters, and entrapment avoidance",
    secondary: "WUI triage, structure defense, and progressive hose lays",
    night: "A",
  },
  4: {
    primary: "Water supply, hydrants, drafting, and relay",
    secondary: "Pump operations and apparatus troubleshooting",
  },
  5: {
    primary: "Ground ladders, aerial placement, and operations",
    secondary: "Ventilation coordinated with fire attack",
  },
  6: {
    primary: "Search, victim removal, and firefighter rescue",
    secondary: "EMS airway / cardiac arrest CQI and MCI",
    night: "B",
  },
  7: {
    primary: "Forcible entry and commercial occupancy access",
    secondary: "High-risk commercial fire / sprinkler-standpipe",
  },
  8: {
    primary: "HazMat recognition, isolation, lithium-ion, and decon",
    secondary: "Transportation, fuel storage, and unknown substance",
  },
  9: {
    primary: "Emergency vehicle operations and cone course",
    secondary: "Apparatus placement, backing / spotting",
    night: "C",
  },
  10: {
    primary: "Residential multi-company first five minutes",
    secondary: "Technical rescue within capability; electrical / gas",
  },
  11: {
    primary: "Target hazards, pre-plans, and water-supply limits",
    secondary: "Major transportation / active threat / evacuation",
  },
  12: {
    primary: "Annual company competency consolidation",
    secondary: "AAR, lessons learned, and qualification closure",
    night: "A",
  },
};

const STATION = "Station / target hazard / approved training site";
const WUI = "CFD WUI / approved field site";
const COURSE = "Approved apparatus course / district";
const DISTRICT = "District / approved training site";

export const TOPICS: Record<string, Topic> = {
  scba: {
    key: "scba",
    short: "PPE & SCBA",
    title: "PPE / SCBA and emergency procedures",
    objective:
      "Inspect, don, operate, and manage SCBA emergencies using controlled skill sheets.",
    hours: 3,
    evalKind: "skill",
    location: STATION,
    equipment: "PPE, SCBA, RIT equipment, radios, rescue mannequin",
    doThis: [
      "Review current SCBA policy and the emergency-procedure skill sheet.",
      "Every member inspects, dons, and operates their assigned pack.",
      "Practice low air, regulator failure, entanglement, and air-sharing.",
    ],
  },
  mayday: {
    key: "mayday",
    short: "Mayday & RIT",
    title: "Mayday / RIT and firefighter survival",
    objective:
      "Transmit and manage a Mayday, deploy RIT, supply air, package, and remove a downed member.",
    hours: 3,
    evalKind: "skill",
    location: STATION,
    equipment: "PPE, SCBA, RIT equipment, radios, rescue mannequin",
    doThis: [
      "Call a Mayday with location, unit, name, assignment, resources, and air.",
      "Deploy RIT, supply air, package, and remove a downed firefighter.",
    ],
  },
  hose: {
    key: "hose",
    short: "Hose & Attack",
    title: "Hose deployment and coordinated fire attack",
    objective:
      "Deploy, charge, flow, advance, and coordinate attack with water supply and ventilation.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Engine, hose, appliances, hydrant/drafting props, radios",
    doThis: [
      "Deploy, charge, flow, and advance attack lines.",
      "Coordinate water supply and ventilation with the attack.",
    ],
  },
  ics: {
    key: "ics",
    short: "Radio & ICS",
    title: "Radio, ICS, accountability, and command transfer",
    objective:
      "Establish command, communicate assignments, maintain accountability/PAR, and transfer command.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Establish command and assign companies on the radio.",
      "Run a PAR and transfer command cleanly.",
    ],
  },
  lces: {
    key: "lces",
    short: "Wildland LCES",
    title: "Wildland LCES, shelters, and entrapment avoidance",
    objective:
      "Apply LCES, trigger points, fire shelter deployment, and entrapment-avoidance actions.",
    hours: 3,
    evalKind: "drill",
    location: WUI,
    equipment: "Type 3/patrol, shelters, wildland hose/tools, maps, radios",
    doThis: [
      "Apply Lookouts, Communications, Escape routes, and Safety zones.",
      "Deploy fire shelters and rehearse entrapment-avoidance trigger points.",
    ],
  },
  wui: {
    key: "wui",
    short: "WUI Defense",
    title: "WUI triage, structure defense, and progressive hose lays",
    objective:
      "Triage structures, select tactics, position apparatus, and complete progressive hose lays.",
    hours: 3,
    evalKind: "drill",
    location: WUI,
    equipment: "Type 3/patrol, shelters, wildland hose/tools, maps, radios",
    doThis: [
      "Triage structures and position apparatus for defense.",
      "Complete progressive hose lays.",
    ],
  },
  water: {
    key: "water",
    short: "Water Supply",
    title: "Water supply, hydrants, drafting, and relay",
    objective: "Establish and sustain the required fire flow from appropriate sources.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Engine, hose, appliances, hydrant/drafting props, radios",
    doThis: ["Establish and sustain required fire flow from the correct source."],
  },
  pump: {
    key: "pump",
    short: "Pump Ops",
    title: "Pump operations and apparatus troubleshooting",
    objective:
      "Set correct pressure/flow and manage transitions, governor/relief systems, and faults.",
    hours: 3,
    evalKind: "skill",
    location: STATION,
    equipment: "Engine, hose, appliances, hydrant/drafting props, radios",
    doThis: [
      "Set pressure and flow.",
      "Manage transitions, governor or relief systems, and common faults.",
    ],
  },
  ladders: {
    key: "ladders",
    short: "Ladders & Aerials",
    title: "Ground ladders, aerial placement, and operations",
    objective:
      "Select, position, raise, stabilize, operate, and emergency-lower applicable ladders/aerial.",
    hours: 3,
    evalKind: "skill",
    location: STATION,
    equipment: "Ground ladders/aerial, cones, fall controls, radios",
    doThis: [
      "Select, raise, stabilize, and work from ground ladders and aerials as assigned.",
      "Practice an emergency lower.",
    ],
  },
  vent: {
    key: "vent",
    short: "Ventilation",
    title: "Ventilation coordinated with fire attack",
    objective:
      "Select and time ventilation to support fire attack while controlling flow paths.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Choose and time ventilation to support fire attack.",
      "Control flow paths instead of feeding the fire.",
    ],
  },
  search: {
    key: "search",
    short: "Search & Rescue",
    title: "Search, victim removal, and firefighter rescue",
    objective:
      "Conduct oriented search, communicate findings, manage air, and remove victims/firefighters.",
    hours: 3,
    evalKind: "skill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Run oriented search with air management and radio reports.",
      "Remove a victim or downed firefighter.",
    ],
  },
  ems: {
    key: "ems",
    short: "EMS & MCI",
    title: "EMS airway / cardiac arrest CQI and MCI",
    objective:
      "Apply current protocols, high-performance resuscitation, documentation, and MCI roles.",
    hours: 4,
    evalKind: "multi",
    location: STATION,
    equipment: "EMS equipment, manikins, monitor, MCI tags",
    doThis: [
      "Apply current REMSA protocols and high-performance resuscitation.",
      "Practice documentation and MCI roles.",
    ],
  },
  forcible: {
    key: "forcible",
    short: "Forcible Entry",
    title: "Forcible entry and commercial occupancy access",
    objective:
      "Size up and force selected residential/commercial barriers while controlling tools/doors.",
    hours: 4,
    evalKind: "skill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Size up the barrier before you force it.",
      "Control the door and the tools the whole time.",
    ],
  },
  commercial: {
    key: "commercial",
    short: "Commercial Fire",
    title: "High-risk commercial fire / sprinkler-standpipe operations",
    objective:
      "Develop command strategy and coordinated company operations for a commercial target hazard.",
    hours: 4,
    evalKind: "multi",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Set command strategy for a commercial occupancy.",
      "Coordinate companies on standpipe or sprinkler operations.",
    ],
  },
  hazmat: {
    key: "hazmat",
    short: "HazMat & Li-ion",
    title: "HazMat recognition, isolation, lithium-ion, and decon",
    objective:
      "Recognize hazards, isolate, identify, select PPE, and operate defensively within capability.",
    hours: 4,
    evalKind: "multi",
    location: STATION,
    equipment: "Detection/reference tools, PPE, ERG/SDS, decon props",
    doThis: [
      "Recognize, isolate, and identify. Stay defensive.",
      "Do not freelance into technician-level work.",
    ],
  },
  hazmat2: {
    key: "hazmat2",
    short: "HazMat Scenario",
    title: "Transportation, fuel storage, and unknown-substance scenario",
    objective:
      "Manage a complex HazMat incident with zones, communications, protective actions, and decon.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Detection/reference tools, PPE, ERG/SDS, decon props",
    doThis: [
      "Set zones, communications, and protective actions.",
      "Run decon within CFD capability.",
    ],
  },
  evoc: {
    key: "evoc",
    short: "EVOC",
    title: "Emergency vehicle operations and cone course",
    objective:
      "Safely complete inspection, road course, alley dock, serpentine, diminishing clearance, and backing.",
    hours: 3,
    evalKind: "skill",
    location: COURSE,
    equipment: "Assigned apparatus, cones, spotters, radios",
    doThis: [
      "Inspect the apparatus, then run the cone course.",
      "Alley dock, serpentine, diminishing clearance, and backing with a spotter.",
    ],
  },
  placement: {
    key: "placement",
    short: "Placement & Backing",
    title: "Apparatus placement, backing / spotting, and night operations",
    objective:
      "Position apparatus for tactical function and complete safe low-visibility backing/spotting.",
    hours: 3,
    evalKind: "drill",
    location: COURSE,
    equipment: "Assigned apparatus, cones, spotters, radios",
    doThis: [
      "Place apparatus so the company can work.",
      "Back only with a spotter, including low visibility.",
    ],
  },
  first5: {
    key: "first5",
    short: "First 5 Minutes",
    title: "Residential multi-company first five minutes",
    objective:
      "Coordinate size-up, command, water supply, attack, search, ventilation, and accountability.",
    hours: 4,
    evalKind: "multi",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "The first five minutes set the next five hours.",
      "Coordinate size-up, water, attack, search, vent, and PAR.",
    ],
  },
  tech: {
    key: "tech",
    short: "Tech Rescue",
    title: "Technical rescue within capability; electrical / gas emergency",
    objective:
      "Identify hazards, isolate, request resources, and perform only actions within CFD capability.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Identify and isolate energy.",
      "Request the right resources. Stay inside CFD capability.",
    ],
  },
  preplan: {
    key: "preplan",
    short: "Target Hazards",
    title: "Target hazards, pre-plans, and water-supply limitations",
    objective:
      "Use actual occupancies to identify access, construction, fire protection, evacuation, and tactical needs.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Walk a real occupancy, not a whiteboard.",
      "Capture access, construction, protection, water, and evacuation.",
    ],
  },
  threat: {
    key: "threat",
    short: "Transport & Threat",
    title: "Major transportation incident / active threat / evacuation",
    objective:
      "Establish unified command, zones, triage, protective actions, and interoperable communications.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Establish unified command and zones.",
      "Triage, protective actions, and interoperable radio traffic.",
    ],
  },
  competency: {
    key: "competency",
    short: "Company Skills",
    title: "Annual company competency consolidation",
    objective:
      "Close assigned annual competency gaps using controlled evaluations and remediation.",
    hours: 3,
    evalKind: "skill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Close assigned competency gaps with controlled evaluations.",
      "Do not carry overdue items into next year.",
    ],
  },
  aar: {
    key: "aar",
    short: "AAR & Quals",
    title: "AAR, lessons learned, and qualification closure",
    objective:
      "Review performance data, close overdue requirements, and assign next-year improvements.",
    hours: 3,
    evalKind: "drill",
    location: STATION,
    equipment: "Assigned apparatus, PPE, radios, target-hazard props",
    doThis: [
      "Review the year's performance data.",
      "Close overdue qualifications and assign next-year work.",
    ],
  },
  night: {
    key: "night",
    short: "Night Ops",
    title: "Quarterly night operations",
    objective:
      "Apply the quarter's fireground/operator objectives in low-light conditions.",
    hours: 3,
    evalKind: "night",
    location: DISTRICT,
    equipment: "Assigned apparatus, PPE, scene lighting, radios, applicable props",
    doThis: [
      "Run this quarter's fireground and operator objectives after dark.",
      "Complete an AAR before you leave the drill.",
    ],
  },
  sizeup: {
    key: "sizeup",
    short: "Size-Up",
    title: "Size-up, 360, and district familiarization",
    objective:
      "Read the occupancy, give a radio size-up, and capture water, access, and construction that will matter on the next fire.",
    hours: 2,
    evalKind: "drill",
    location: DISTRICT,
    equipment: "Assigned apparatus, radios, district map / pre-plan",
    doThis: [
      "Stand in front of a real occupancy and give a first-due size-up.",
      "Walk hydrants, rear access, construction, and life hazard.",
    ],
  },
  nfpa1410: {
    key: "nfpa1410",
    short: "NFPA 1410",
    title: "NFPA 1410 company evolution",
    objective:
      "Prove the company can supply water, stretch and flow an attack line, and put a ladder or search in service as one evolution.",
    hours: 3,
    evalKind: "multi",
    location: STATION,
    equipment: "Engine, hydrant, attack lines, ladders, radios, search victim",
    doThis: [
      "Run a full company evolution: water, stretch, flow, ladder or search.",
      "Time a clean run after a technique run. AAR before you leave.",
    ],
  },
  pack: {
    key: "pack",
    short: "PACK Test",
    title: "PACK / work-capacity and heat plan",
    objective: "Complete the assigned work-capacity test with a heat and medical plan in place.",
    hours: 3,
    evalKind: "skill",
    location: DISTRICT,
    equipment: "Pack, water, cooling, medical bag",
    doThis: [
      "Brief the course and stop rules.",
      "Complete only if medically cleared. Document make-ups.",
    ],
  },
  auto: {
    key: "auto",
    short: "Auto Extrication",
    title: "Vehicle extrication",
    objective: "Stabilize, create a patient path, and operate tools within CFD capability.",
    hours: 3,
    evalKind: "skill",
    location: STATION,
    equipment: "Cribbing, irons, hydraulic tools, glass kit, PPE",
    doThis: [
      "Stabilize and crib first.",
      "Cut only on a planned path with a patient-removal plan.",
    ],
  },
  officer: {
    key: "officer",
    short: "Step-Up",
    title: "Acting officer / engineer step-up",
    objective: "Run command, radio, water, and accountability from the next seat up.",
    hours: 2,
    evalKind: "drill",
    location: STATION,
    equipment: "Radios, apparatus, FOGs",
    doThis: [
      "The acting officer gives the size-up, IAP, and PAR.",
      "Transfer command when the next officer arrives.",
    ],
  },
};

type Wave = [number, number, Shift, string, boolean?];

const WAVES: Wave[] = [
  [1, 6, "B", "scba"],
  [1, 8, "C", "scba"],
  [1, 10, "A", "scba"],
  [1, 20, "C", "mayday"],
  [1, 22, "A", "mayday"],
  [1, 24, "B", "mayday"],
  [2, 6, "B", "hose"],
  [2, 7, "C", "hose"],
  [2, 9, "A", "hose"],
  [2, 20, "C", "ics"],
  [2, 21, "A", "ics"],
  [2, 23, "B", "ics"],
  [3, 6, "A", "lces"],
  [3, 7, "B", "lces"],
  [3, 9, "C", "lces"],
  [3, 20, "B", "wui"],
  [3, 21, "C", "wui"],
  [3, 23, "A", "wui"],
  [3, 29, "A", "night", true],
  [4, 6, "B", "water"],
  [4, 8, "C", "water"],
  [4, 10, "A", "water"],
  [4, 20, "C", "pump"],
  [4, 22, "A", "pump"],
  [4, 24, "B", "pump"],
  [5, 6, "B", "ladders"],
  [5, 8, "C", "ladders"],
  [5, 10, "A", "ladders"],
  [5, 20, "C", "vent"],
  [5, 22, "A", "vent"],
  [5, 24, "B", "vent"],
  [6, 6, "B", "search"],
  [6, 7, "C", "search"],
  [6, 9, "A", "search"],
  [6, 20, "C", "ems"],
  [6, 21, "A", "ems"],
  [6, 23, "B", "ems"],
  [6, 29, "B", "night", true],
  [7, 6, "B", "forcible"],
  [7, 7, "C", "forcible"],
  [7, 9, "A", "forcible"],
  [7, 20, "C", "commercial"],
  [7, 21, "A", "commercial"],
  [7, 23, "B", "commercial"],
  [8, 6, "C", "hazmat"],
  [8, 8, "A", "hazmat"],
  [8, 10, "B", "hazmat"],
  [8, 20, "A", "hazmat2"],
  [8, 22, "B", "hazmat2"],
  [8, 24, "C", "hazmat2"],
  [9, 6, "C", "evoc"],
  [9, 7, "A", "evoc"],
  [9, 9, "B", "evoc"],
  [9, 20, "A", "placement"],
  [9, 21, "B", "placement"],
  [9, 23, "C", "placement"],
  [9, 29, "C", "night", true],
  [10, 6, "C", "first5"],
  [10, 7, "A", "first5"],
  [10, 9, "B", "first5"],
  [10, 20, "A", "tech"],
  [10, 21, "B", "tech"],
  [10, 23, "C", "tech"],
  [11, 6, "A", "preplan"],
  [11, 8, "B", "preplan"],
  [11, 10, "C", "preplan"],
  [11, 20, "B", "threat"],
  [11, 22, "C", "threat"],
  [11, 24, "A", "threat"],
  [12, 6, "A", "competency"],
  [12, 8, "B", "competency"],
  [12, 10, "C", "competency"],
  [12, 20, "B", "aar"],
  [12, 22, "C", "aar"],
  [12, 24, "A", "aar"],
  [12, 25, "A", "night", true],
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** 48/96 keyed to the 2027 master calendar (Jan 6 2027 = B-Shift). */
export function shiftOn(iso: string): Shift {
  const [y, m, d] = iso.split("-").map(Number);
  const days = Math.round(
    (Date.UTC(y, m - 1, d) - Date.UTC(2027, 0, 6)) / 86_400_000,
  );
  const n = ((days % 6) + 6) % 6;
  if (n < 2) return "B";
  if (n < 4) return "C";
  return "A";
}

export const MONTH_FOCUS_2026: Record<number, { primary: string; secondary: string }> = {
  1: {
    primary: "Basics every day — size-up, mask-up, tactics, water, ladders, force, search",
    secondary: "MAYDAY and NFPA 1410 company drills stacked on the weekday skills",
  },
  2: {
    primary: "PPE donning, vertical ventilation, and handlines",
    secondary: "District familiarization and Saturday 1410 company drills",
  },
  3: {
    primary: "Building construction, Auto X, RIC / radios",
    secondary: "Aerials, MAYDAY, and NFPA 1410",
  },
  4: {
    primary: "WUI size-up, attack lines, aerials",
    secondary: "LODD / close-call reports and heat emergencies",
  },
  5: {
    primary: "PACK test, EVOC, wildland hose lays, water-tender ops",
    secondary: "MAYDAY / firefighter rescue, aerial vent, RT-130",
  },
  6: {
    primary: "Progressive hose lays and engineer mental math",
    secondary: "WUI review, aerial vent, timed 1410 and MAYDAY",
  },
  7: {
    primary: "District surveys and progressive hose lays",
    secondary: "Aerial vent, stretch-force-mask-up, RIC / 1410 Saturdays",
  },
  8: {
    primary: "Perishable skills: mask-up, stretch, ladders, search",
    secondary: "Night drills, drafting, and acting officer step-up",
  },
  9: {
    primary: "First five minutes, hotels, and MCI / earthquake tabletop",
    secondary: "EVOC, night ops, and driver / apparatus placement",
  },
  10: {
    primary: "Big 5, ropes / special rescue, burn-prop fire behavior",
    secondary: "Aerial rescue scenarios and acting officer step-up",
  },
  11: {
    primary: "NFPA 1410 evolutions 8–10, elevated streams, night",
    secondary: "MCI / HazMat, aerial VES, acting officer step-up",
  },
  12: {
    primary: "Hazardous materials: ERG, 4-gas, PPE, gross decon",
    secondary: "Keep weekday perishable skills alive through the holidays",
  },
};

export const EVENTS: TrainingEvent[] = WAVES.map(([month, day, shift, topicKey, night]) => {
  const date = `2027-${pad(month)}-${pad(day)}`;
  return {
    id: `${date}-${shift}`,
    year: 2027,
    date,
    month,
    day,
    shift,
    topicKey,
    night: night || undefined,
  };
});

export const EVENTS_2026: TrainingEvent[] = RAW_2026.map(
  ([date, topicKey, extra, night, label]) => {
    const [, m, d] = date.split("-").map(Number);
    return {
      id: date,
      year: 2026 as const,
      date,
      month: m,
      day: d,
      shift: shiftOn(date),
      topicKey,
      extra: extra || undefined,
      label,
      night: night ? true : undefined,
    };
  },
);

export function eventsForYear(year: AppYear): TrainingEvent[] {
  return year === 2026 ? EVENTS_2026 : EVENTS;
}

export const ALL_EVENTS: TrainingEvent[] = [...EVENTS_2026, ...EVENTS];

export const EVENTS_BY_DATE = ALL_EVENTS.reduce<Record<string, TrainingEvent[]>>((acc, ev) => {
  (acc[ev.date] ??= []).push(ev);
  return acc;
}, {});

export const EVENTS_BY_ID = Object.fromEntries(ALL_EVENTS.map((ev) => [ev.id, ev]));

export const HOLIDAYS: Record<string, string> = {
  "2026-01-01": "New Year's Day",
  "2026-01-19": "MLK Day",
  "2026-02-16": "Presidents Day",
  "2026-05-25": "Memorial Day",
  "2026-07-04": "Independence Day",
  "2026-09-07": "Labor Day",
  "2026-11-11": "Veterans Day",
  "2026-11-26": "Thanksgiving",
  "2026-12-25": "Christmas",
  "2027-01-01": "New Year's Day",
  "2027-01-18": "MLK Day",
  "2027-02-15": "Presidents Day",
  "2027-05-31": "Memorial Day",
  "2027-07-04": "Independence Day",
  "2027-09-06": "Labor Day",
  "2027-11-11": "Veterans Day",
  "2027-11-25": "Thanksgiving",
  "2027-12-25": "Christmas",
};

export const YEAR = 2027;

export function topicFor(ev: TrainingEvent): Topic {
  return TOPICS[ev.topicKey] ?? TOPICS.sizeup;
}

/** Short skill-sheet name shown on Today, the calendar, and the drill card. */
export function headlineFor(ev: TrainingEvent): string {
  return topicFor(ev).short;
}

const TOPIC_PREFIX =
  /^(force(\s+entry)?|forcible|ladders?|ladder\s*throws?|ladder throw|waterflow|hose|mask\s*up|maskup|size\s*up|sizeup|search|tactics|ppe|scba)\b[:.\s-]*/i;
const WEEKDAY =
  /\b(mon|tue|tues|wed|thu|thurs|fri|sat|sun|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi;

/** Day's real work from the master calendar — not the generic skill-sheet title. */
export function assignmentFor(ev: TrainingEvent): string {
  const topic = topicFor(ev);
  let s = (ev.extra ?? "").trim();
  if (!s) return ev.label || topic.title;
  for (let i = 0; i < 3; i++) {
    const next = s.replace(TOPIC_PREFIX, "").trim();
    if (next === s) break;
    s = next;
  }
  s = s
    .replace(WEEKDAY, " ")
    .replace(/\s*[/|]+\s*/g, " · ")
    .replace(/\s+/g, " ")
    .replace(/^[:.\-–]+\s*/, "")
    .replace(/\s+[:.\-–]+$/, "")
    .trim();
  if (s.length < 3) return ev.label || topic.title;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function monthFocus(
  year: AppYear,
  month: number,
): { primary: string; secondary: string; night?: Shift } {
  if (year === 2026) return MONTH_FOCUS_2026[month];
  return MONTH_FOCUS[month];
}

export function evalLabel(kind: EvalKind) {
  switch (kind) {
    case "skill":
      return "Skill sheet";
    case "multi":
      return "Multi-company";
    case "night":
      return "Night / AAR";
    default:
      return "Company drill";
  }
}

export function monthGrid(year: number, month: number) {
  const first = new Date(year, month - 1, 1);
  const startDow = first.getDay();
  const daysInMonth = new Date(year, month, 0).getDate();
  const cells: Array<number | null> = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: Array<Array<number | null>> = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function isoDate(year: number, month: number, day: number) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

const STATION_TZ = "America/Los_Angeles";

/** Calimesa wall clock — not the server’s UTC date. */
export function stationYmd(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: STATION_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return {
    year: Number(get("year")),
    month: Number(get("month")),
    day: Number(get("day")),
    weekday: get("weekday"),
  };
}

export function todayIso(now = new Date()): string {
  const { year, month, day } = stationYmd(now);
  return isoDate(year, month, day);
}

export function eventsOn(iso: string): TrainingEvent[] {
  return EVENTS_BY_DATE[iso] ?? [];
}

export function nextEventAfter(iso: string): TrainingEvent | undefined {
  return ALL_EVENTS.find((e) => e.date > iso);
}


export const BIG_FIVE = [
  { title: "Hose", body: "Select, deploy, charge, flow, and advance the right line." },
  { title: "Ladders", body: "Select, raise, stabilize, and work from the ladder." },
  { title: "Search", body: "Oriented search, communication, air, victim and firefighter removal." },
  { title: "PPE / SCBA / radio", body: "Inspect, don, operate, and manage emergencies in the pack." },
  { title: "Survival and rescue", body: "Mayday, RIT, air supply, packaging, and removal." },
];

export const METHOD_STEPS = [
  "Review the objective, policy, hazard controls, and standard.",
  "Demonstrate the correct task or decision process.",
  "Practice in manageable components.",
  "Repeat with coaching until it is consistent.",
  "Apply the skill in a realistic scenario.",
  "Evaluate when the competency matrix requires it.",
  "Give immediate feedback and document results.",
  "Remediate deficiencies and re-evaluate.",
];
