/** Local receiving hospitals for Calimesa. Numbers from REMSA 8101 (Aug 25, 2026). */

export const REMSA_8101 =
  "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug25/8101%20-%20EMS%20System%20Resource%20List_PedRC_8.25.26.pdf";

export type SpecialtyKey =
  | "general"
  | "stroke"
  | "stroke-thromb"
  | "stroke-comp"
  | "stemi"
  | "trauma-i"
  | "trauma-ii"
  | "trauma-iv"
  | "burn"
  | "ob";

export const SPECIALTY_LABEL: Record<SpecialtyKey, string> = {
  general: "General",
  stroke: "Stroke",
  "stroke-thromb": "Stroke (thrombectomy)",
  "stroke-comp": "Stroke (comprehensive)",
  stemi: "STEMI",
  "trauma-i": "Trauma I",
  "trauma-ii": "Trauma II",
  "trauma-iv": "Trauma IV",
  burn: "Burn",
  ob: "OB",
};

export type Hospital = {
  id: string;
  name: string;
  short: string;
  /** Radio-room DTMF or out-of-county short code — the pin identifier. */
  code: string;
  address: string;
  lat: number;
  lng: number;
  phone: string;
  edPhone?: string;
  recordedLine?: string;
  radioRoom?: string;
  radioNote?: string;
  bh?: boolean;
  specialties: SpecialtyKey[];
  county: "riverside" | "san-bernardino";
  note?: string;
  labelSide?: "left" | "right";
};

export const HOSPITALS: Hospital[] = [
  {
    id: "sgmh",
    name: "San Gorgonio Memorial",
    short: "SGMH",
    code: "230",
    address: "600 N Highland Springs Ave, Banning, CA 92220",
    lat: 33.9321577,
    lng: -116.9456732,
    phone: "(951) 845-1121",
    edPhone: "(951) 769-2121",
    recordedLine: "(951) 769-2175",
    radioRoom: "230",
    specialties: ["stroke", "ob"],
    county: "riverside",
    labelSide: "left",
  },
  {
    id: "desert",
    name: "Desert Regional Medical Center",
    short: "DRMC",
    code: "210",
    address: "1150 N Indian Canyon Dr, Palm Springs, CA 92262",
    lat: 33.839248,
    lng: -116.5424408,
    phone: "(760) 323-6511",
    edPhone: "(760) 323-6521",
    recordedLine: "(760) 323-4723",
    radioRoom: "210",
    bh: true,
    specialties: ["trauma-i", "stemi", "stroke-comp", "ob"],
    county: "riverside",
    note: "PedRC. NICU. Coachella Valley Level I.",
    labelSide: "left",
  },
  {
    id: "eisenhower",
    name: "Eisenhower Health",
    short: "EIS",
    code: "250",
    address: "39000 Bob Hope Dr, Rancho Mirage, CA 92270",
    lat: 33.7623783,
    lng: -116.4033854,
    phone: "(760) 340-3911",
    edPhone: "(760) 837-8016",
    recordedLine: "(760) 568-4197",
    radioRoom: "250",
    bh: true,
    specialties: ["trauma-iv", "stemi", "stroke", "ob"],
    county: "riverside",
    note: "NICU.",
    labelSide: "left",
  },
  {
    id: "jfk",
    name: "JFK Memorial",
    short: "JFK",
    code: "220",
    address: "47111 Monroe St, Indio, CA 92201",
    lat: 33.7061251,
    lng: -116.2361276,
    phone: "(760) 347-6191",
    edPhone: "(760) 775-8111",
    recordedLine: "(760) 342-3011",
    radioRoom: "220",
    bh: true,
    specialties: ["trauma-iv", "stemi", "stroke", "ob"],
    county: "riverside",
    labelSide: "left",
  },
  {
    id: "redlands",
    name: "Redlands Community",
    short: "RED",
    code: "RED",
    address: "350 Terracina Blvd, Redlands, CA 92373",
    lat: 34.0375422,
    lng: -117.2065069,
    phone: "(909) 335-5500",
    radioNote: "ICEMA — not on REMSA 8101",
    specialties: ["stroke-thromb", "ob"],
    county: "san-bernardino",
    note: "Out of county. Thrombectomy-capable stroke only.",
    labelSide: "left",
  },
  {
    id: "llu",
    name: "Loma Linda University Medical Center",
    short: "LLU",
    code: "LLU",
    address: "11234 Anderson St, Loma Linda, CA 92354",
    lat: 34.0491119,
    lng: -117.2634355,
    phone: "(909) 558-4444",
    radioNote: "ICEMA — not on REMSA 8101",
    specialties: ["trauma-i", "stemi", "stroke-comp", "ob"],
    county: "san-bernardino",
    note: "Adult and pediatric trauma on the same campus. Children's is PedRC Comprehensive.",
  },
  {
    id: "ruhs",
    name: "RUHS Medical Center",
    short: "RUHS",
    code: "180",
    address: "26520 Cactus Ave, Moreno Valley, CA 92555",
    lat: 33.9119259,
    lng: -117.1963788,
    phone: "(951) 486-4000",
    edPhone: "(951) 486-5650",
    recordedLine: "(951) 486-4137",
    radioRoom: "180",
    bh: true,
    specialties: ["trauma-i", "stemi", "ob"],
    county: "riverside",
    note: "PedRC Advanced. NICU / PICU.",
    labelSide: "left",
  },
  {
    id: "kaiser-mv",
    name: "Kaiser Moreno Valley",
    short: "KMV",
    code: "340",
    address: "27300 Iris Ave, Moreno Valley, CA 92555",
    lat: 33.8971537,
    lng: -117.1867461,
    phone: "(951) 243-0811",
    edPhone: "(951) 251-6565",
    recordedLine: "(951) 251-6055",
    radioRoom: "340",
    specialties: ["stroke", "ob"],
    county: "riverside",
  },
  {
    id: "armc",
    name: "Arrowhead Regional",
    short: "ARMC",
    code: "ARMC",
    address: "400 N Pepper Ave, Colton, CA 92324",
    lat: 34.0737033,
    lng: -117.3506708,
    phone: "(909) 580-1000",
    radioNote: "ICEMA — not on REMSA 8101",
    specialties: ["trauma-i", "stroke-comp", "burn", "ob"],
    county: "san-bernardino",
    note: "Edward G. Hirschman Regional Burn Center.",
    labelSide: "left",
  },
  {
    id: "rch",
    name: "Riverside Community Hospital",
    short: "RCH",
    code: "170",
    address: "4445 Magnolia Ave, Riverside, CA 92501",
    lat: 33.9765196,
    lng: -117.3825962,
    phone: "(951) 788-3000",
    edPhone: "(951) 788-3200",
    recordedLine: "(951) 683-8671",
    radioRoom: "170",
    bh: true,
    specialties: ["trauma-i", "stemi", "stroke", "ob"],
    county: "riverside",
    labelSide: "left",
  },
  {
    id: "kaiser-fontana",
    name: "Kaiser Fontana",
    short: "KFON",
    code: "KFON",
    address: "9961 Sierra Ave, Fontana, CA 92335",
    lat: 34.073086,
    lng: -117.4322961,
    phone: "(909) 427-5000",
    radioNote: "ICEMA — not on REMSA 8101",
    specialties: ["stroke", "ob"],
    county: "san-bernardino",
    note: "NICU / PICU. Out of county.",
    labelSide: "left",
  },
  {
    id: "inland-valley",
    name: "Inland Valley Medical Center",
    short: "IVMC",
    code: "150",
    address: "36485 Inland Valley Dr, Wildomar, CA 92595",
    lat: 33.5909563,
    lng: -117.2382549,
    phone: "(951) 677-1111",
    edPhone: "(951) 677-9773",
    recordedLine: "(951) 677-0833",
    radioRoom: "150",
    bh: true,
    specialties: ["trauma-ii", "stemi"],
    county: "riverside",
  },
];

export function telHref(phone: string) {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

export function chipsFor(hospital: Hospital): SpecialtyKey[] {
  const major = hospital.specialties.some(
    (s) =>
      s === "stemi" ||
      s === "burn" ||
      s.startsWith("stroke") ||
      s.startsWith("trauma"),
  );
  return major ? hospital.specialties : ["general", ...hospital.specialties];
}
