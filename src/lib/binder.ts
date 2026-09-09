export type BinderKind = "policy" | "form" | "radio";

export type BinderDoc = {
  id: string;
  code: string;
  title: string;
  volume: string;
  href?: string;
  /** 1-indexed page in the volume PDF where this policy starts. */
  page?: number;
  fillable?: boolean;
  missing?: boolean;
  note?: string;
};

export type BinderFolder = {
  id: string;
  title: string;
  kicker: string;
  href?: string;
  missing?: boolean;
  items: BinderDoc[];
};

const VOL = {
  toc: "/docs/cfd-toc.pdf",
  v1: "/docs/cfd-vol1-admin.pdf",
  v2: "/docs/cfd-vol2-employee.pdf",
  v4: "/docs/cfd-vol4-forms.pdf",
  v5: "/docs/cfd-vol5-ems.pdf",
  v6: "/docs/cfd-vol6-sog.pdf",
  city: "/docs/city-personnel-rules-2024.pdf",
  amend: "/docs/city-resolution-2024-03-amendments.docx",
  radioPdf: "/docs/calfire-radio-v24a6.pdf",
  tk790: "/docs/rru-tk790-v24a6.xlsx",
  gph: "/docs/rru-gph-dph-v24a6.xls",
};

export function policySlug(id: string) {
  return id.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
}

/** Volume PDF opened on this policy's start page. */
export function volumePageHref(doc: BinderDoc): string | undefined {
  if (!doc.href || doc.missing) return undefined;
  if (doc.page && !doc.href.includes("#")) return `${doc.href}#page=${doc.page}`;
  return doc.href;
}

/** Small PDF that contains only this policy, starting on page 1. */
export function policySliceHref(doc: BinderDoc): string | undefined {
  if (doc.missing) return undefined;
  if (doc.page) return `/docs/policies/${policySlug(doc.id)}.pdf`;
  return volumePageHref(doc);
}

/** First-page preview of the sliced policy PDF. */
export function policyPreviewHref(doc: BinderDoc): string | undefined {
  if (doc.missing || !doc.page) return undefined;
  return `/docs/policies/${policySlug(doc.id)}.jpg`;
}


function items(
  volume: string,
  href: string | undefined,
  rows: Array<[string, string] | [string, string, Partial<BinderDoc>]>,
): BinderDoc[] {
  return rows.map(([code, title, extra]) => {
    const doc: BinderDoc = {
      id: code,
      code,
      title,
      volume,
      href,
      ...extra,
    };
    return doc;
  });
}

export const POLICY_FOLDERS: BinderFolder[] = [
  {
    id: "vol6",
    title: "Volume 6 — SOGs",
    kicker: "How we run calls",
    href: VOL.v6,
    items: items("Volume 6", VOL.v6, [
      ["600.00", "Operational standards / best practices", { page: 3 }],
      ["600.04", "Incident command for all hazards", { page: 11 }],
      ["600.05", "Fireground accountability", { page: 13 }],
      ["600.06", "IDLH 2-in / 2-out", { page: 17 }],
      ["600.07", "Confined space", { page: 36 }],
      ["600.08", "Trench rescue", { page: 51 }],
      ["600.09", "Water rescue", { page: 54 }],
      ["600.10", "Structural firefighting", { page: 59 }],
      ["600.11", "Wildland firefighting", { page: 72 }],
      ["600.12", "Vehicle firefighting", { page: 75 }],
      ["600.13", "Traffic collisions", { page: 82 }],
      ["600.14", "MCI", { page: 90 }],
      ["600.16", "Violent incidents", { page: 100 }],
      ["600.17", "Hazardous materials", { page: 119 }],
      ["600.22", "Lines down / energized equipment", { page: 125 }],
      ["600.24", "Rehab", { page: 127 }],
      ["601.00", "Station operations", { page: 128 }],
      ["604.00", "Apparatus operations / Code 3 / backing", { page: 232 }],
      ["606.00", "Training manual", { page: 328 }],
      ["607.02", "Portable radios", { page: 353 }],
      ["607.03", "Operating power saws", { page: 361 }],
      ["608.00", "Unusual occurrence guidelines", { page: 394 }],
      ["611.00", "Emergency operations", { page: 500 }],
    ]),
  },
  {
    id: "vol1",
    title: "Volume 1 — Administration",
    kicker: "Mission, records, liability",
    href: VOL.v1,
    items: items("Volume 1", VOL.v1, [
      ["101.00", "Mission, org chart, chain of command", { page: 3 }],
      ["102.00", "Hiring, overtime, FMLA, evaluations", { page: 23 }],
      ["103.00", "Records, HIPAA, training records, logbook", { page: 37 }],
      ["104.00", "Liability claims", { page: 42 }],
      ["105.00", "PIO, media, ride-alongs, explorers", { page: 43 }],
    ]),
  },
  {
    id: "vol2",
    title: "Volume 2 — Employee manual",
    kicker: "Conduct, uniform, discipline",
    href: VOL.v2,
    items: items("Volume 2", VOL.v2, [
      ["202.00", "Rules of conduct, ethics, social media", { page: 7 }],
      ["202.10", "Maximum consecutive 24-hour shifts", { page: 17 }],
      ["202.11", "Shift exchange", { page: 18 }],
      ["203.00", "Appearance, uniform, and grooming", { page: 26 }],
      ["204.00", "Vehicles, inspections, accidents", { page: 36 }],
      ["205.00", "Discrimination, discipline, appeals", { page: 46 }],
    ]),
  },
  {
    id: "vol3",
    title: "Volume 3 — Health and safety",
    kicker: "IIPP, PPE, respiratory, heat",
    missing: true,
    items: items("Volume 3", undefined, [
      [
        "301.00",
        "Cal/OSHA safety management, PPE, respiratory, heat",
        { missing: true, note: "PDF was not in this upload (file was too large). Re-send Volume 3 to attach it." },
      ],
      ["303.00", "Illness and Injury Prevention Program", { missing: true }],
      ["305.01", "Return to work from injury or illness", { missing: true }],
    ]),
  },
  {
    id: "vol5",
    title: "Volume 5 — EMS",
    kicker: "ePCR, restock, AED, abuse reporting",
    href: VOL.v5,
    items: items("Volume 5", VOL.v5, [
      ["501.00", "EMS procedures, ePCR, response, equipment", { page: 3 }],
      ["501.06", "Suspected adult / elder / child abuse reporting", { page: 6 }],
      ["502.00", "Restocking medical supplies", { page: 10 }],
      ["503.00", "Blood-borne pathogens and HIPAA", { page: 14 }],
      ["504.00", "AED program", { page: 25 }],
    ]),
  },
  {
    id: "city",
    title: "City personnel rules",
    kicker: "HR — probation, overtime, leave",
    href: VOL.city,
    items: items("City HR", VOL.city, [
      ["Rule 12", "Dress and grooming / $600 uniform allowance", { page: 50 }],
      ["Rule 20", "Fire probation — 12 months new hire, 6 months promotional", { page: 62 }],
      ["Rule 27", "PARS retirement (fire) vs CalPERS (city)", { page: 71 }],
      ["Rule 31", "FLSA 7(k) — 53-hour fire workweek", { page: 77 }],
      ["Rule 32", "City holidays / 12-hour in-lieu for suppression", { page: 80 }],
      ["Rule 34", "Vacation — 96 / 144 / 192 hours on 24-hour shifts", { page: 81 }],
      ["Rule 35", "Sick leave — 12 hours/month fire, 960 hour cap", { page: 83 }],
      ["Rule 45", "Drug and alcohol / cannabis on duty prohibited", { page: 120 }],
    ]),
  },
];

export const FORM_FOLDERS: BinderFolder[] = [
  {
    id: "payroll",
    title: "Payroll",
    kicker: "Biweekly time card",
    items: items("Payroll", undefined, [
      [
        "Time-card",
        "C.F.D. time card",
        {
          fillable: true,
          code: "TC",
          note: "Saturday start, 14 days. Fill on this phone, then download, share, or print.",
        },
      ],
    ]),
  },
  {
    id: "401",
    title: "401 Administration",
    kicker: "Shift, ride-along, receipt",
    href: VOL.v4,
    items: items("Vol. 4", VOL.v4, [
      ["401.05", "Policy manual receipt", { fillable: true, page: 7 }],
      ["401.06", "Civilian ride-along application", { page: 8 }],
      ["401.07", "Shift exchange", { fillable: true, page: 9 }],
      ["401.08", "Report of interview", { page: 10 }],
      ["401.10", "Separation / retirement checklist", { page: 12 }],
    ]),
  },
  {
    id: "402",
    title: "402 Apparatus and equipment",
    kicker: "Daily checks, SCBA, hose, rope",
    href: VOL.v4,
    items: items("Vol. 4", VOL.v4, [
      ["402.01", "Apparatus inspection — interior daily", { page: 13 }],
      ["402.02", "Apparatus inspection — exterior daily", { page: 14 }],
      ["402.07", "SCBA inspection", { page: 19 }],
      ["402.08", "Hose test log", { page: 20 }],
      ["402.10", "Rope log", { page: 22 }],
      ["402.11", "Apparatus / equipment repair order", { page: 23 }],
      ["402.15", "Protective clothing inspection — quarterly", { page: 27 }],
    ]),
  },
  {
    id: "403",
    title: "403 Health and safety",
    kicker: "IIPP, injury, inspections",
    href: VOL.v4,
    items: items("Vol. 4", VOL.v4, [
      ["403.01", "New employee safety orientation", { page: 28 }],
      ["403.02", "Record of training", { page: 29 }],
      ["403.07", "Employee report of work-related injury or illness", { page: 35 }],
      ["403.09", "IIPP investigation report", { page: 38 }],
    ]),
  },
  {
    id: "406",
    title: "406 Training",
    kicker: "Drill reports and evaluations",
    href: VOL.v4,
    items: items("Vol. 4", VOL.v4, [
      ["406.02", "Training log", { page: 56 }],
      ["406.04", "New hire probationary period", { page: 59 }],
      ["406.05", "Training and drill report", { fillable: true, page: 61 }],
      ["406.06", "Performance evaluation", { page: 63 }],
    ]),
  },
  {
    id: "407",
    title: "407 Discipline",
    kicker: "Counseling and reprimands",
    href: VOL.v4,
    items: items("Vol. 4", VOL.v4, [
      ["407.01", "Counseling interview memorandum", { page: 67 }],
      ["407.02", "Letter confirming oral reprimand", { page: 68 }],
      ["407.03", "Written reprimand", { page: 69 }],
      ["407.04", "Release during probation", { page: 70 }],
    ]),
  },
  {
    id: "408",
    title: "408 Incident and emergency",
    kicker: "Accident, exposure, field report",
    href: VOL.v4,
    items: items("Vol. 4", VOL.v4, [
      ["408.01", "CFD accident reporting kit", { page: 73 }],
      ["408.02", "Earthquake station status", { page: 119 }],
      ["408.03", "Field incident report", { fillable: true, page: 120 }],
      ["408.04", "Exposure incident report", { fillable: true, page: 122 }],
      ["408.05", "Communicable disease exposure", { page: 124 }],
    ]),
  },
];

export const BINDER_FILES = VOL;

export function searchBinder(query: string, folders: BinderFolder[]): BinderFolder[] {
  const q = query.trim().toLowerCase();
  if (!q) return folders;
  return folders
    .map((folder) => {
      const folderHit =
        folder.title.toLowerCase().includes(q) || folder.kicker.toLowerCase().includes(q);
      const itemsHit = folder.items.filter(
        (item) =>
          item.code.toLowerCase().includes(q) ||
          item.title.toLowerCase().includes(q) ||
          (item.note ?? "").toLowerCase().includes(q),
      );
      if (folderHit) return folder;
      if (itemsHit.length) return { ...folder, items: itemsHit };
      return null;
    })
    .filter((f): f is BinderFolder => f !== null);
}
