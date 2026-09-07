import { workbookBlob } from "@/lib/xlsx-simple";
import { todayIso, type Shift } from "@/lib/training-data";

export type IsaFirefighter = {
  id: string;
  firstName: string;
  lastName: string;
  studentId: string;
  shift?: Shift;
  active: boolean;
};

export type IsaAssignment = {
  id: string;
  name: string;
  type: string;
};

export type IsaEntry = {
  id: string;
  batchId: string;
  eventId?: string;
  firefighterId: string;
  date: string;
  time: string;
  hours: number;
  assignmentId: string;
  description: string;
  iorPresent: boolean;
};

export type IsaMeta = {
  college: string;
  agency: string;
  course: string;
  syn: string;
  instructor: string;
  term: string;
  reimbursementStatus: string;
};

export type IsaIssue = {
  level: "block" | "warn";
  message: string;
};

/** Quick topics for ad-hoc logs — Target Solutions style, not just the company drill. */
export const QUICK_TOPICS = [
  "Ground ladders",
  "Hose / hydrant",
  "SCBA",
  "Forcible entry",
  "Search",
  "Ventilation",
  "Driver / EVOC",
  "EMS",
  "Fitness",
  "Wildland",
  "Officer",
  "Other",
] as const;

export const ISA_ASSIGNMENTS: IsaAssignment[] = [
  {
    id: "company",
    name: "Company Training Documentation",
    type: "*Training Documentation Forms",
  },
  {
    id: "driver",
    name: "Driver Training Documentation",
    type: "*Training Documentation Forms",
  },
  {
    id: "facility",
    name: "Facility Training Documentation",
    type: "*Training Documentation Forms",
  },
  {
    id: "officer",
    name: "Officer Training Documentation",
    type: "*Training Documentation Forms",
  },
  {
    id: "fitness",
    name: "Firefighter Fitness, NFPA 1500",
    type: "Daily Activities, NFPA 1500",
  },
  {
    id: "briefing",
    name: "Daily Safety Briefing",
    type: "Safety Briefings",
  },
];

export const DEFAULT_ISA_META: IsaMeta = {
  college: "Crafton Hills College",
  agency: "Calimesa Fire Department",
  course: "FireT504-97",
  syn: "0932",
  instructor: "Matthew Vega",
  term: "Fall 2026",
  reimbursementStatus: "Crafton Hills College",
};

export const SEED_ROSTER: IsaFirefighter[] = [
  { id: "ff-abasi", firstName: "Ra'ad", lastName: "Abasi", studentId: "2356872", active: true },
  {
    id: "ff-beltran",
    firstName: "Alejandro",
    lastName: "Beltran Reyes",
    studentId: "2403242",
    active: true,
  },
  { id: "ff-bennin", firstName: "Corey", lastName: "Bennin", studentId: "2387152", active: true },
  { id: "ff-canepa", firstName: "Dominic", lastName: "Canepa", studentId: "2383156", active: true },
  { id: "ff-cortes", firstName: "Albaro", lastName: "Cortes", studentId: "2381718", active: true },
  { id: "ff-lala", firstName: "Joshua", lastName: "Lala", studentId: "2268387", active: true },
  { id: "ff-manus", firstName: "Logan", lastName: "Manus", studentId: "2385702", active: true },
  {
    id: "ff-meketarian",
    firstName: "Chad",
    lastName: "Meketarian",
    studentId: "603532",
    active: true,
  },
  { id: "ff-mills", firstName: "Jordan", lastName: "Mills", studentId: "2418329", active: true },
  {
    id: "ff-oconnell",
    firstName: "Timothy",
    lastName: "O'Connell",
    studentId: "57728",
    active: true,
  },
  { id: "ff-ortega", firstName: "Nicholas", lastName: "Ortega", studentId: "2383078", active: true },
  { id: "ff-payne", firstName: "Matt", lastName: "Payne", studentId: "551673", active: true },
  { id: "ff-pena", firstName: "Andres", lastName: "Pena", studentId: "2385710", active: true },
  { id: "ff-rapoza", firstName: "Alan", lastName: "Rapoza", studentId: "231448", active: true },
  {
    id: "ff-saavedra",
    firstName: "Jeramiee",
    lastName: "Saavedra",
    studentId: "2418306",
    active: true,
  },
  { id: "ff-shaw", firstName: "Steven", lastName: "Shaw", studentId: "49951", active: true },
  { id: "ff-vega", firstName: "Matthew", lastName: "Vega", studentId: "614112", active: true },
  { id: "ff-young", firstName: "Logan", lastName: "Young", studentId: "2354830", active: true },
];

export function assignmentById(id: string): IsaAssignment {
  return ISA_ASSIGNMENTS.find((a) => a.id === id) ?? ISA_ASSIGNMENTS[0];
}

export function parseMinutes(time: string): number | null {
  const m = /^(\d{1,2}):(\d{2})/.exec(time.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}

export function formatTimeLong(time: string): string {
  const mins = parseMinutes(time);
  if (mins === null) return time;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`;
}

export function formatDateLong(date: string): string {
  return date;
}

function roundHours(n: number): number {
  return Math.round(n * 100) / 100;
}

export function rosterName(ff: IsaFirefighter): string {
  return `${ff.lastName}, ${ff.firstName}`;
}

export function sortRoster(list: IsaFirefighter[]): IsaFirefighter[] {
  return [...list].sort(
    (a, b) =>
      a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName),
  );
}

export function sortEntries(
  entries: IsaEntry[],
  roster: IsaFirefighter[],
): IsaEntry[] {
  const byId = new Map(roster.map((f) => [f.id, f]));
  return [...entries].sort((a, b) => {
    const fa = byId.get(a.firefighterId);
    const fb = byId.get(b.firefighterId);
    const ln = (fa?.lastName ?? "").localeCompare(fb?.lastName ?? "");
    if (ln) return ln;
    const fn = (fa?.firstName ?? "").localeCompare(fb?.firstName ?? "");
    if (fn) return fn;
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.time.localeCompare(b.time);
  });
}

export function issuesForDraft(
  draft: {
    firefighterId: string;
    date: string;
    time: string;
    hours: number;
    assignmentId: string;
    description: string;
  },
  existing: IsaEntry[],
  roster: IsaFirefighter[],
): IsaIssue[] {
  const issues: IsaIssue[] = [];
  const ff = roster.find((f) => f.id === draft.firefighterId);
  if (!ff) {
    issues.push({ level: "block", message: "Pick a member from the roster." });
    return issues;
  }
  if (!ff.studentId.trim()) {
    issues.push({
      level: "block",
      message: `${rosterName(ff)} needs a Crafton reimbursement ID.`,
    });
  }
  if (!draft.description.trim()) {
    issues.push({ level: "block", message: "Add a short description of the training." });
  }
  if (!draft.date) {
    issues.push({ level: "block", message: "Date is required." });
  }
  const start = parseMinutes(draft.time);
  if (start === null) {
    issues.push({ level: "block", message: "Start time is required." });
  }
  if (!Number.isFinite(draft.hours)) {
    issues.push({ level: "block", message: "Hours are required." });
  } else {
    if (draft.hours < 0.5) {
      issues.push({
        level: "block",
        message: "Crafton flags anything under 0.5 hours.",
      });
    }
    if (draft.hours > 8) {
      issues.push({
        level: "block",
        message: "One line cannot exceed 8 hours.",
      });
    }
  }
  if (start !== null && Number.isFinite(draft.hours) && draft.hours > 0) {
    const end = start + draft.hours * 60;
    if (end > 24 * 60) {
      issues.push({
        level: "block",
        message: `${ff.firstName} ${ff.lastName}: ${draft.time} for ${draft.hours} hrs crosses midnight. Split it — 8 hrs max in one calendar day.`,
      });
    }
    const sameDay = existing.filter(
      (e) => e.firefighterId === draft.firefighterId && e.date === draft.date,
    );
    const dayTotal = roundHours(
      sameDay.reduce((n, e) => n + e.hours, 0) + draft.hours,
    );
    if (dayTotal > 8) {
      issues.push({
        level: "block",
        message: `${ff.firstName} ${ff.lastName} would have ${dayTotal} hrs on ${draft.date}. Cap is 8.`,
      });
    }
    for (const e of sameDay) {
      const es = parseMinutes(e.time);
      if (es === null) continue;
      const ee = es + e.hours * 60;
      if (start < ee && es < end) {
        const other = assignmentById(e.assignmentId).name;
        issues.push({
          level: "block",
          message: `${ff.firstName} ${ff.lastName}: overlaps ${e.time} ${e.hours} hr ${other}.`,
        });
      }
    }
  }
  return issues;
}

export function issuesForBatch(
  drafts: Array<{
    firefighterId: string;
    date: string;
    time: string;
    hours: number;
    assignmentId: string;
    description: string;
  }>,
  existing: IsaEntry[],
  roster: IsaFirefighter[],
  iorPresent: boolean,
): IsaIssue[] {
  const issues: IsaIssue[] = [];
  if (!drafts.length) {
    issues.push({ level: "block", message: "Tap the names who completed the training." });
  }
  if (!iorPresent) {
    issues.push({
      level: "block",
      message: "Instructor of Record must be present to claim college credit.",
    });
  }
  const seen = new Set<string>();
  drafts.forEach((d, i) => {
    if (seen.has(d.firefighterId)) {
      const ff = roster.find((f) => f.id === d.firefighterId);
      issues.push({
        level: "block",
        message: `${ff ? rosterName(ff) : "Member"} is listed twice.`,
      });
    }
    seen.add(d.firefighterId);
    const prior = [
      ...existing,
      ...drafts.slice(0, i).map((x, idx) => ({
        id: `tmp-${idx}`,
        batchId: "tmp",
        firefighterId: x.firefighterId,
        date: x.date,
        time: x.time,
        hours: x.hours,
        assignmentId: x.assignmentId,
        description: x.description,
        iorPresent,
      })),
    ];
    issues.push(...issuesForDraft(d, prior, roster));
  });
  return uniqueIssues(issues);
}

function uniqueIssues(issues: IsaIssue[]): IsaIssue[] {
  const seen = new Set<string>();
  const out: IsaIssue[] = [];
  for (const issue of issues) {
    const k = `${issue.level}:${issue.message}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(issue);
  }
  return out;
}

export function sheetRows(
  entries: IsaEntry[],
  roster: IsaFirefighter[],
  meta: IsaMeta,
): Array<Array<string | number>> {
  const byId = new Map(roster.map((f) => [f.id, f]));
  const sorted = sortEntries(entries, roster);
  const run = todayIso();
  const rows: Array<Array<string | number>> = [
    [
      meta.college,
      "Instructional Service Agreement (ISA)",
      `Instructor : ${meta.instructor}`,
      meta.agency,
      meta.course,
      `Ref (SYN) number ${meta.syn}`,
      meta.term,
    ],
    [],
    ["Type:", "CFD Company Training — ISA hours"],
    ["Run Date:", run],
    [],
    [
      "First Name",
      "Last Name",
      "Reimbursement Status",
      "Reimbursement Student ID",
      "Assignment Name",
      "Assignment Type",
      "Completion Date",
      "Completion Time",
      "Duration (hours)",
      "Description",
    ],
  ];
  let total = 0;
  for (const e of sorted) {
    const ff = byId.get(e.firefighterId);
    if (!ff) continue;
    const asg = assignmentById(e.assignmentId);
    total += e.hours;
    rows.push([
      ff.firstName,
      ff.lastName,
      meta.reimbursementStatus,
      ff.studentId,
      asg.name,
      asg.type,
      formatDateLong(e.date),
      formatTimeLong(e.time),
      roundHours(e.hours),
      e.description,
    ]);
  }
  rows.push([]);
  rows.push(["", "", "", "", "", "", "", "Total Hours:", roundHours(total)]);
  return rows;
}

export function isaFilename(meta: IsaMeta, date?: string): string {
  const stamp = date ?? new Date().toISOString().slice(0, 10);
  return `CFD-ISA-${meta.course}-${stamp}.xlsx`;
}

export function isaWorkbook(entries: IsaEntry[], roster: IsaFirefighter[], meta: IsaMeta): Blob {
  return workbookBlob(sheetRows(entries, roster, meta), "ISA Hours");
}

export function isaSummary(
  entries: IsaEntry[],
  roster: IsaFirefighter[],
  meta: IsaMeta,
): string {
  const byId = new Map(roster.map((f) => [f.id, f]));
  const sorted = sortEntries(entries, roster);
  const hours = roundHours(sorted.reduce((n, e) => n + e.hours, 0));
  const lines = [
    `${meta.agency} ISA hours — ${meta.course} (${meta.term})`,
    `Instructor of Record: ${meta.instructor}`,
    `SYN ${meta.syn}`,
    "",
  ];
  for (const e of sorted) {
    const ff = byId.get(e.firefighterId);
    if (!ff) continue;
    lines.push(
      `${ff.lastName}, ${ff.firstName}  ${ff.studentId}  ${e.date} ${formatTimeLong(e.time)}  ${e.hours} hr  ${e.description}`,
    );
  }
  lines.push("", `Total hours: ${hours}`);
  return lines.join("\n");
}

export function newFirefighter(partial?: Partial<IsaFirefighter>): IsaFirefighter {
  return {
    id: `ff-${crypto.randomUUID()}`,
    firstName: partial?.firstName?.trim() ?? "",
    lastName: partial?.lastName?.trim() ?? "",
    studentId: partial?.studentId?.trim() ?? "",
    shift: partial?.shift,
    active: partial?.active ?? true,
  };
}
