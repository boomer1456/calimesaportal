/** Riverside County EMS Agency — July 2026 PUC. Confirm against the live PDF. */

export const REMSA_HOME = "https://rivcoready.org/remsa";
export const REMSA_MANUAL = "https://rivcoready.org/policy-manual";
export const REMSA_APP = "https://remsaapp.glide.page";
export const REMSA_EDU = "https://rivcoready.org/remsa/education";
export const REMSA_DRUG_INDEX =
  "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11/4105%20-%20ALS%20Drug%20Index.pdf";
export const REMSA_WEIGHT =
  "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11/4103%20-%20Weight%20Conversion%20Matrix.pdf";
export const REMSA_SKILLS_LIST =
  "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11/4104%20-%20Skills%20List.pdf";
export const REMSA_EQUIPMENT =
  "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug27/3303%20-%20Drug%20and%20Equipment%20List_Ped%20Colormetric_8.27.26.pdf";

const AUG11 = "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11";
const AUG13 = "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug13";
const SEP02 = "https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Sep02";

export type RemsaProtocol = {
  id: string;
  title: string;
  href: string;
  blurb?: string;
};

export type RemsaGroup = {
  id: string;
  label: string;
  items: RemsaProtocol[];
};

function p(folder: string, file: string): string {
  return `${folder}/${file}`;
}

export const PROTOCOL_GROUPS: RemsaGroup[] = [
  {
    id: "4100",
    label: "4100 · Key policies",
    items: [
      { id: "4100", title: "Treatment protocols", href: p(AUG11, "4100%20-%20Treatment%20Protocols.pdf") },
      { id: "4101", title: "Universal Patient Care", href: p(AUG11, "4101%20-%20Universal%20Patient%20Care.pdf"), blurb: "Start here on every patient." },
      { id: "4102", title: "Alternative medications / dosages", href: p(AUG11, "4102%20-%20Alternative%20Medications%20Dosages.pdf") },
      { id: "4103", title: "Weight conversion matrix", href: REMSA_WEIGHT, blurb: "Lbs ↔ kg and length-tape colors." },
      { id: "4104", title: "Skills list", href: REMSA_SKILLS_LIST, blurb: "BLS vs ALS skills." },
      { id: "4105", title: "ALS Drug Index", href: REMSA_DRUG_INDEX, blurb: "Every standing-order drug." },
      { id: "4106", title: "On-scene physician", href: p(AUG11, "4106%20-%20On%20Scene%20Physician%20Requesting%20to%20Assume%20Responsibility.pdf") },
      { id: "4107", title: "Refusal of treatment / transport", href: p(AUG11, "4107%20-%20Refusal%20of%20Treatment%20and_or%20Transport.pdf") },
      { id: "4108", title: "DNAR / discontinue resuscitation", href: p(AUG11, "4108%20Do%20Not%20Attempt%20Resuscitation%20_%20Discontinue%20Resuscitation.pdf") },
      { id: "4109", title: "Ambulance patient offload delay", href: p(AUG11, "4109%20-%20Ambulance%20Patient%20Offload%20Delay.pdf") },
      { id: "4110", title: "End of life care", href: p(AUG11, "4110%20-%20End%20of%20Life%20Care.pdf") },
    ],
  },
  {
    id: "4200",
    label: "4200 · General medical",
    items: [
      { id: "4201", title: "Adult symptomatic hypoglycemia", href: p(AUG11, "4201%20-%20Adult%20Symptomatic%20Hypoglycemia.pdf") },
      { id: "4202", title: "Adult shock unrelated to trauma", href: p(AUG11, "4202%20-%20Adult%20Shock%20Unrelated%20to%20Trauma.pdf") },
      { id: "4203", title: "Adult nausea and/or vomiting", href: p(AUG11, "4203%20-%20Adult%20Nausea%20and%20or%20Vomiting.pdf") },
      { id: "4204", title: "Adult pain management", href: p(AUG11, "4204%20-%20Adult%20Pain%20Management.pdf") },
    ],
  },
  {
    id: "4300",
    label: "4300 · Trauma",
    items: [
      {
        id: "4301",
        title: "Adult traumatic shock / injury / arrest",
        href: p(AUG11, "4301%20-%20Adult%20Traumatic%20Shock_Injury_Arrest.pdf"),
      },
    ],
  },
  {
    id: "4400",
    label: "4400 · Cardiovascular / pulmonary",
    items: [
      { id: "4401", title: "Suspected ACS", href: p(AUG11, "4401%20-%20Suspected%20Acute%20Coronary%20Syndrome%20ACS.pdf") },
      { id: "4402", title: "Mechanical circulatory support devices", href: p(AUG11, "4402%20-%20Mechanical%20Circulatory%20Support%20Devices.pdf") },
      { id: "4403", title: "Symptomatic tachycardia with pulses", href: p(AUG11, "4403%20Symptomatic%20Tachycardia%20with%20Pulses.pdf") },
      { id: "4404", title: "Symptomatic bradycardia with pulses", href: p(AUG11, "4404%20Symptomatic%20Bradycardia%20with%20Pulses.pdf") },
      { id: "4405", title: "Adult medical cardiac arrest", href: p(AUG11, "4405%20-%20Adult%20Medical%20Cardiac%20Arrest.pdf"), blurb: "RHeart adult card." },
      { id: "4406", title: "Adult respiratory distress", href: p(AUG11, "4406%20-%20Adult%20Respiratory%20Distress.pdf") },
    ],
  },
  {
    id: "4500",
    label: "4500 · Neurological",
    items: [
      { id: "4501", title: "Adult seizures", href: p(AUG11, "4501%20-%20Adult%20Seizures.pdf") },
      { id: "4502", title: "Suspected stroke", href: p(SEP02, "4502%20-%20Suspected%20Stroke.pdf") },
    ],
  },
  {
    id: "4600",
    label: "4600 · Toxicological",
    items: [
      { id: "4601", title: "Overdose / adverse reaction", href: p(AUG11, "4601%20-%20Overdose%20Adverse%20Reaction.pdf") },
      { id: "4602", title: "Behavioral emergencies", href: p(AUG11, "4602%20-%20Behavioral%20Emergencies.pdf") },
      { id: "4603", title: "Toxic exposure, inhalation, or ingestion", href: p(AUG11, "4603%20-%20Toxic%20Exposure%20Inhalation%20or%20Ingestion.pdf") },
      { id: "4604", title: "Nerve agents / organophosphates / carbamates", href: p(AUG11, "4604%20-%20Exposure%20to%20Nerve%20Agents%20Organophosphates%20or%20Carbamates.pdf") },
      { id: "4605", title: "Mass nerve-agent exposure", href: p(AUG11, "4605%20-%20Mass%20Exposure%20to%20Nerve%20Agents%20Organophosphates%20or%20Carbamates.pdf") },
    ],
  },
  {
    id: "4700",
    label: "4700 · Environmental",
    items: [
      { id: "4701", title: "Adult burns", href: p(AUG11, "4701%20-%20Adult%20Burns.pdf") },
      { id: "4702", title: "Heat illness / hyperthermia", href: p(AUG11, "4702%20-%20Heat%20Illness%20Hyperthermia.pdf") },
      { id: "4703", title: "Frostbite / hypothermia", href: p(AUG11, "4703%20-%20Frostbite%20Hypothermia.pdf") },
      { id: "4704", title: "Adult allergy / anaphylaxis", href: p(AUG11, "4704%20-%20Adult%20Allergy%20and%20or%20Anaphylaxis.pdf") },
      { id: "4705", title: "Snakebite", href: p(AUG11, "4705%20-%20Snakebite.pdf") },
    ],
  },
  {
    id: "4800",
    label: "4800 · Pregnancy / newborn",
    items: [
      {
        id: "4801",
        title: "Obstetrical emergencies / newborn deliveries",
        href: p(AUG11, "4801%20-%20Obstetrical%20Emergencies_Newborn%20Deliveries.pdf"),
        blurb: "Newly delivered neonate lives here, not 4903.",
      },
    ],
  },
  {
    id: "4900",
    label: "4900 · Pediatric",
    items: [
      { id: "4901", title: "Pediatric general medical", href: p(AUG13, "4901%20-%20Pediatric%20General%20Medical.pdf"), blurb: "Through 14 years." },
      { id: "4902", title: "Pediatric traumatic shock / injury / arrest", href: p(AUG11, "4902%20-%20Pediatric%20Traumatic%20Shock_Injury_Arrest.pdf") },
      { id: "4903", title: "Pediatric medical cardiac arrest", href: p(AUG11, "4903%20-%20Pediatric%20Medical%20Cardiac%20Arrest.pdf"), blurb: "RHeart peds card." },
      { id: "4904", title: "Pediatric respiratory distress", href: p(AUG11, "4904%20-%20Pediatric%20Respiratory%20Distress.pdf") },
      { id: "4905", title: "Pediatric seizures", href: p(AUG11, "4905%20-%20Pediatric%20Seizures.pdf") },
      { id: "4906", title: "Pediatric burns", href: p(AUG11, "4906%20-%20Pediatric%20Burns.pdf") },
      { id: "4907", title: "Pediatric allergy / anaphylaxis", href: p(AUG11, "4907%20-%20Pediatric%20Allergy%20and%20or%20Anaphylaxis.pdf") },
    ],
  },
];

export const ALL_PROTOCOLS = PROTOCOL_GROUPS.flatMap((g) => g.items);

export const DRUG_INDEX = [
  "Acetaminophen",
  "Adenosine",
  "Albuterol",
  "Amiodarone",
  "Aspirin",
  "Atropine",
  "Calcium chloride",
  "Dextrose",
  "Diphenhydramine",
  "Epinephrine",
  "Fentanyl",
  "Glucagon",
  "Glucose (oral)",
  "Ipratropium",
  "Ketamine",
  "Ketorolac",
  "Lidocaine",
  "Magnesium sulfate",
  "Midazolam",
  "Naloxone",
  "Nitroglycerin",
  "Normal saline",
  "Ondansetron",
  "Sodium bicarbonate",
  "Tranexamic acid (TXA)",
] as const;

export const ASSESS_STEPS = [
  "BSI / scene. Then 4101 — not a textbook ABC from memory.",
  "Primary survey: airway, breathing, circulation. If massive bleed, C-A-B.",
  "No pulse → 4405 adult medical arrest or 4903 peds. Trauma arrest is 4301 / 4902.",
  "Age: pediatric if appearing or known ≤ 14 years. Unknown age + < 36 kg / on the length tape = pediatric.",
  "Weight: parent, record, length tape, or estimate. Convert lbs → kg (÷ 2.2).",
  "Chief complaint → the 4000 sheet that matches. Do not mix stroke, ACS, trauma, and arrest from memory.",
  "EMT standing orders vs medic / base hospital. If it says BHO, call.",
  "Adult and pediatric are different books. 4901 is peds general medical; newborn < 48 hr is 4801.",
];

export type ColorBand = {
  id: string;
  name: string;
  hex: string;
  ink: string;
  kgMin: number;
  kgMax: number;
  lbLabel: string;
};

/** REMSA 4103 length-tape colors, July 2026 matrix. */
export const COLOR_BANDS: ColorBand[] = [
  { id: "grey", name: "Grey", hex: "#8a8f96", ink: "#1a1f2b", kgMin: 4, kgMax: 5, lbLabel: "9–11 lb" },
  { id: "pink", name: "Pink", hex: "#e7a0b4", ink: "#1a1f2b", kgMin: 5, kgMax: 7, lbLabel: "11–15 lb" },
  { id: "red", name: "Red", hex: "#c4453c", ink: "#f3ede4", kgMin: 8, kgMax: 9, lbLabel: "18–20 lb" },
  { id: "purple", name: "Purple", hex: "#6b4c9a", ink: "#f3ede4", kgMin: 10, kgMax: 12, lbLabel: "22–26 lb" },
  { id: "yellow", name: "Yellow", hex: "#e3c35a", ink: "#1a1f2b", kgMin: 12, kgMax: 14, lbLabel: "26–31 lb" },
  { id: "white", name: "White", hex: "#f4efe4", ink: "#1a1f2b", kgMin: 15, kgMax: 16, lbLabel: "33–35 lb" },
  { id: "blue", name: "Blue", hex: "#3d6ea8", ink: "#f3ede4", kgMin: 17, kgMax: 21, lbLabel: "37–46 lb" },
  { id: "orange", name: "Orange", hex: "#d9822b", ink: "#1a1f2b", kgMin: 23, kgMax: 29, lbLabel: "50–64 lb" },
  { id: "green", name: "Green", hex: "#3f7a55", ink: "#f3ede4", kgMin: 32, kgMax: 37, lbLabel: "70–81 lb" },
  { id: "coal", name: "Coal", hex: "#3a3f46", ink: "#f3ede4", kgMin: 40, kgMax: 42, lbLabel: "88–93 lb" },
  { id: "magenta", name: "Magenta", hex: "#a63d7a", ink: "#f3ede4", kgMin: 42, kgMax: 46, lbLabel: "93–101 lb" },
  { id: "maroon", name: "Maroon", hex: "#7a2430", ink: "#f3ede4", kgMin: 46, kgMax: 49, lbLabel: "101–108 lb" },
];

export type ArrestRhythm = "vf" | "pea" | "rosc";

export type DoseRow = {
  label: string;
  value: string;
  note?: string;
  caution?: boolean;
};

export type ArrestCard = {
  id: ArrestRhythm;
  title: string;
  kicker: string;
  adult: DoseRow[];
  peds: DoseRow[];
};

/** RHeart-style rhythm card. Numbers are REMSA 4405 / 4903, July 2026. */
export const ARREST_CARDS: ArrestCard[] = [
  {
    id: "vf",
    title: "VF / pulseless VT",
    kicker: "Shockable",
    adult: [
      { label: "Shock", value: "Manufacturer joules", note: "Resume CPR immediately. Reanalyze q2 min. Stacked shocks if monitored/witnessed." },
      { label: "Epi", value: "1 mg IV/IO", note: "0.1 mg/mL (10 mL). q5 min to a max of 5 mg (50 mL). More = BHO." },
      { label: "Amio", value: "300 mg IV/IO", note: "Then 150 mg after 5 min. Max 450 mg. More = BHO." },
      { label: "Lido (no amio)", value: "1 mg/kg then 0.5 mg/kg", note: "BHO both doses. Second dose 8–10 min later. Max 3 mg/kg." },
      { label: "Mag (Torsades)", value: "2 g slow IV/IO", note: "BHO. Polymorphic VT / Torsades only." },
      { label: "Bicarb", value: "50 mEq IV/IO", note: "Only if suspected acidosis, hyperK, or TCA OD. May repeat once. More = BHO." },
    ],
    peds: [
      { label: "Shock", value: "2 J/kg then 4 J/kg", note: "All subsequent shocks 4 J/kg. Pediatric attenuator if < 8 years." },
      { label: "Epi", value: "0.01 mg/kg IV/IO", note: "0.1 mg/mL = 0.1 mL/kg. q5 min, max 5 doses. Neonate: every dose is BHO." },
      { label: "Amio", value: "5 mg/kg IV/IO", note: "Max single 150 mg. BHO first and repeat." },
      { label: "Lido (no amio)", value: "1 mg/kg then 1 mg/kg", note: "BHO. Second dose 8–10 min later." },
      { label: "Mag (Torsades)", value: "50 mg/kg slow IV/IO", note: "BHO." },
      { label: "Bicarb", value: "1 mEq/kg IV/IO", note: "BHO neonate and peds. Acidosis / hyperK / TCA only." },
    ],
  },
  {
    id: "pea",
    title: "Asystole / PEA",
    kicker: "Not shockable",
    adult: [
      { label: "Shock", value: "Do not shock", note: "No defibrillation for asystole or PEA. Treat the H’s and T’s." },
      { label: "Epi", value: "1 mg IV/IO", note: "0.1 mg/mL. q5 min to a max of 5 mg. More = BHO. Give early." },
      { label: "Atropine", value: "1 mg IV/IO", note: "BHO — not a standing order in 4405." },
      { label: "Bicarb", value: "50 mEq IV/IO", note: "Only if suspected acidosis, hyperK, or TCA OD. May repeat once. More = BHO." },
      { label: "Calcium", value: "1 g IV/IO", note: "HyperK / hypocalcemia / CCB OD = BHO. Dialysis patient is standing order; more = BHO." },
      { label: "Amio", value: "Not indicated", note: "Antiarrhythmics are for VF/VT, not PEA." },
    ],
    peds: [
      { label: "Shock", value: "Do not shock", note: "No defibrillation for asystole or PEA." },
      { label: "Epi", value: "0.01 mg/kg IV/IO", note: "0.1 mL/kg of 0.1 mg/mL. q5 min, max 5 doses. Neonate: BHO every dose." },
      { label: "Bicarb", value: "1 mEq/kg IV/IO", note: "BHO. Acidosis / hyperK / TCA only." },
      { label: "Calcium", value: "20 mg/kg IV/IO", note: "BHO. HyperK / hypocalcemia / CCB OD, or dialysis." },
      { label: "Naloxone", value: "0.1 mg/kg", note: "If suspected narcotic. Max 1 mg/dose. Neonate extra doses = BHO." },
      { label: "Amio", value: "Not indicated", note: "VF/VT only, and that is BHO in peds." },
    ],
  },
  {
    id: "rosc",
    title: "ROSC",
    kicker: "Pulse is back",
    adult: [
      { label: "Airway / EtCO₂", value: "SpO₂ ≥ 94%, no hypervent", note: "EtCO₂ jump to 35–40 is a ROSC sign. 12-lead and transmit if STEMI / odd rhythm." },
      { label: "Fluids", value: "NS 250 mL", note: "Shock after ROSC. Repeat to max 2 L." },
      { label: "Push-dose epi", value: "0.01 mg (1 mL)", note: "0.01 mg/mL mix. q1–5 min to keep SBP > 90." },
      { label: "Epi drip", value: "1 → 10 mcg/min", note: "0.4 mg in 100 mL NS (or 0.2 mg in 50). Dial-a-flow 15 → 150 mL/hr. SBP ≥ 90." },
      { label: "Destination", value: "Closest STEMI center", note: "Unknown or suspected cardiac OHCA with ROSC. If SRC > 30 min and no aircraft, closest ED." },
    ],
    peds: [
      { label: "Airway / EtCO₂", value: "SpO₂ ≥ 94%, no hypervent", note: "Peds < 1 year: think respiratory cause first." },
      { label: "Fluids", value: "20 mL/kg (neonate 10)", note: "Volume-control set. Repeat as indicated." },
      { label: "Push-dose epi", value: "0.01 mg (1 mL of 0.01 mg/mL)", note: "Repeat to keep SBP > 70 + (age × 2)." },
      { label: "Epi drip", value: "Not permitted", note: "REMSA does not allow epi infusion in peds. Push-dose only." },
      { label: "Destination", value: "Closest receiving center", note: "Peds ROSC is not the adult SRC rule. Stop resuscitation of a neonate/peds = BHPO." },
    ],
  },
];

export type MathDrug = {
  id: string;
  name: string;
  conc: string;
  adultFixed?: string;
  calc: (kg: number) => { dose: string; volume: string; note: string };
};

function n(value: number, digits = 2) {
  const f = Number(value.toFixed(digits));
  return String(f);
}

export function kgFrom(value: number, unit: "kg" | "lb") {
  if (!Number.isFinite(value) || value <= 0) return 0;
  return unit === "lb" ? value * 0.454 : value;
}

export function lbFromKg(kg: number) {
  return kg / 0.454;
}

export function bandForKg(kg: number): ColorBand | null {
  if (kg <= 0) return null;
  return COLOR_BANDS.find((b) => kg >= b.kgMin && kg <= b.kgMax) ?? null;
}

/** Common field math. Volumes assume standard REMSA concentrations. */
export const MATH_DRUGS: MathDrug[] = [
  {
    id: "epi-arrest",
    name: "Epi — arrest",
    conc: "0.1 mg/mL (1 mg/10 mL)",
    adultFixed: "1 mg = 10 mL · q5 min · max 5 mg",
    calc: (kg) => {
      const mg = Math.min(kg * 0.01, 1);
      const ml = mg / 0.1;
      return {
        dose: `${n(mg, 2)} mg`,
        volume: `${n(ml, 1)} mL`,
        note: "0.01 mg/kg = 0.1 mL/kg. Max 1 mg/dose. Peds max 5 doses. Neonate = BHO.",
      };
    },
  },
  {
    id: "epi-im",
    name: "Epi — IM anaphylaxis",
    conc: "1 mg/mL",
    adultFixed: "0.3 mg = 0.3 mL IM",
    calc: (kg) => {
      const mg = Math.min(kg * 0.01, 0.3);
      return {
        dose: `${n(mg, 2)} mg`,
        volume: `${n(mg, 2)} mL`,
        note: "0.01 mg/kg IM. Max single 0.3 mg. Extra doses often BHO.",
      };
    },
  },
  {
    id: "pde",
    name: "Push-dose epi",
    conc: "0.01 mg/mL (mix 1+9)",
    adultFixed: "1 mL (0.01 mg) q1–5 min · SBP > 90",
    calc: (kg) => {
      const ml = Math.min(kg * 0.1, 1);
      return {
        dose: `${n(ml * 0.01, 3)} mg`,
        volume: `${n(ml, 1)} mL`,
        note: "Mix 1 mL of 0.1 mg/mL + 9 mL NS. Label 0.01 mg/mL. Peds ~0.1 mL/kg.",
      };
    },
  },
  {
    id: "bicarb",
    name: "Sodium bicarbonate",
    conc: "1 mEq/mL (50 mEq/50 mL)",
    adultFixed: "50 mEq = 50 mL · may repeat once · indicated only",
    calc: (kg) => {
      const meq = kg * 1;
      return {
        dose: `${n(meq, 0)} mEq`,
        volume: `${n(meq, 0)} mL`,
        note: "1 mEq/kg. Peds/neonate arrest = BHO. Acidosis, hyperK, TCA — not routine.",
      };
    },
  },
  {
    id: "amio",
    name: "Amiodarone — VF/VT arrest",
    conc: "50 mg/mL (150 mg/3 mL)",
    adultFixed: "300 mg, then 150 mg in 5 min · max 450 mg",
    calc: (kg) => {
      const mg = Math.min(kg * 5, 150);
      const ml = mg / 50;
      return {
        dose: `${n(mg, 0)} mg`,
        volume: `${n(ml, 1)} mL`,
        note: "5 mg/kg. Max 150 mg peds. BHO in 4903.",
      };
    },
  },
  {
    id: "defib",
    name: "Defibrillation",
    conc: "Manual / AED",
    adultFixed: "Manufacturer setting (often 120–200 J biphasic)",
    calc: (kg) => ({
      dose: `First ${n(kg * 2, 0)} J`,
      volume: `Then ${n(kg * 4, 0)} J`,
      note: "Peds: 2 J/kg then 4 J/kg. Attenuator if < 8 yr.",
    }),
  },
  {
    id: "cardiovert",
    name: "Synchronized cardioversion",
    conc: "Manual",
    adultFixed: "Manufacturer joules",
    calc: (kg) => ({
      dose: `First ${n(kg * 1, 0)} J`,
      volume: `Then ${n(kg * 2, 0)} J`,
      note: "Peds 4403: 1 J/kg then 2 J/kg.",
    }),
  },
  {
    id: "ns",
    name: "Normal saline bolus",
    conc: "0.9% NS",
    adultFixed: "250 mL · repeat to 2 L (shock / ROSC)",
    calc: (kg) => {
      const ml = kg * 20;
      return {
        dose: `${n(ml, 0)} mL`,
        volume: `${n(kg * 10, 0)} mL neonate`,
        note: "Peds 20 mL/kg. Neonate 10 mL/kg. Volume-control set.",
      };
    },
  },
  {
    id: "calcium",
    name: "Calcium chloride",
    conc: "100 mg/mL (1 g/10 mL)",
    adultFixed: "1 g = 10 mL · dialysis standing; other arrest uses BHO",
    calc: (kg) => {
      const mg = kg * 20;
      return {
        dose: `${n(mg, 0)} mg`,
        volume: `${n(mg / 100, 1)} mL`,
        note: "20 mg/kg. Peds arrest = BHO. Flush apart from bicarb.",
      };
    },
  },
  {
    id: "fentanyl",
    name: "Fentanyl",
    conc: "50 mcg/mL (100 mcg/2 mL)",
    adultFixed: "Per 4204 / pain scale · SBP ≥ 90 after ROSC is BHO",
    calc: (kg) => {
      const mcg = kg * 1;
      return {
        dose: `${n(mcg, 0)} mcg`,
        volume: `${n(mcg / 50, 1)} mL`,
        note: "1 mcg/kg typical peds. Confirm 4204 / 4901. ROSC pain = BHO.",
      };
    },
  },
  {
    id: "midaz",
    name: "Midazolam",
    conc: "5 mg/mL",
    adultFixed: "Per seizure / 4501 · ROSC anxiety 1 mg is BHO",
    calc: (kg) => {
      const mg = kg * 0.1;
      return {
        dose: `${n(mg, 2)} mg IV`,
        volume: `${n(mg / 5, 2)} mL`,
        note: "0.1 mg/kg IV typical. IN often 0.2 mg/kg. Confirm 4501 / 4905.",
      };
    },
  },
  {
    id: "naloxone",
    name: "Naloxone",
    conc: "1 mg/mL",
    adultFixed: "Per 4601 · titrate to breathing, not pupils",
    calc: (kg) => {
      const mg = Math.min(kg * 0.1, 1);
      return {
        dose: `${n(mg, 2)} mg`,
        volume: `${n(mg, 2)} mL`,
        note: "0.1 mg/kg. Max 1 mg/dose. Titrate to respirations.",
      };
    },
  },
];

export function searchProtocols(query: string): RemsaGroup[] {
  const q = query.trim().toLowerCase();
  if (!q) return PROTOCOL_GROUPS;
  return PROTOCOL_GROUPS.map((g) => ({
    ...g,
    items: g.items.filter(
      (item) =>
        item.id.includes(q) ||
        item.title.toLowerCase().includes(q) ||
        (item.blurb ?? "").toLowerCase().includes(q),
    ),
  })).filter((g) => g.items.length > 0);
}
