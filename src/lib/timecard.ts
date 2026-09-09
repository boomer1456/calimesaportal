import { todayIso } from "@/lib/training-data";

/** Saturday 5 Sep 2026 — start of the period after the 4 Sep 2026 close. */
export const PAY_PERIOD_ANCHOR = "2026-09-05";
const PERIOD_DAYS = 14;
/** Thursday — the day before the Friday close (9/17 for the 9/5 period). */
const DUE_AFTER_START = 12;
/** 14-day FLSA 7(k) cap — same 106 regular hours payroll uses on the Bennin card. */
export const REG_HOURS = 106;

export const DAY_LABELS = [
  "SAT*",
  "SUN",
  "MON",
  "TUES",
  "WED",
  "THUR",
  "FRI",
  "SAT*",
  "SUN",
  "MON",
  "TUES",
  "WED",
  "THUR",
  "FRI",
] as const;

export type TimeDay = {
  label: string;
  iso: string;
  hours: string;
  ptl: boolean;
  vacation: string;
  sick: string;
  description: string;
};

export type TimeCard = {
  name: string;
  periodStart: string;
  periodEnd: string;
  due: string;
  days: TimeDay[];
  regHours: string;
  otHours: string;
  employeeSig: string;
  supervisor: string;
  cityManager: string;
};

function pad(n: number) {
  return n < 10 ? `0${n}` : String(n);
}

export function addDays(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function diffDays(from: string, to: string): number {
  const [ay, am, ad] = from.split("-").map(Number);
  const [by, bm, bd] = to.split("-").map(Number);
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / 86400000);
}

export function formatMd(iso: string): string {
  const [, m, d] = iso.split("-").map(Number);
  return `${m}/${d}`;
}

export function formatMdy(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${m}/${d}/${y}`;
}

export function formatLong(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${d}, ${y}`;
}

export function formatWeekday(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
    new Date(Date.UTC(y, m - 1, d)).getUTCDay()
  ];
}

function emptyDays(start: string): TimeDay[] {
  return DAY_LABELS.map((label, i) => ({
    label,
    iso: addDays(start, i),
    hours: "",
    ptl: false,
    vacation: "",
    sick: "",
    description: "",
  }));
}

export function periodFromStart(start: string) {
  return {
    start,
    end: addDays(start, PERIOD_DAYS - 1),
    due: addDays(start, DUE_AFTER_START),
  };
}

/** Pay period containing today. Card is due Thursday, the day before Friday close. */
export function currentPayPeriod(iso = todayIso()) {
  const delta = diffDays(PAY_PERIOD_ANCHOR, iso);
  const idx = Math.max(0, Math.floor(delta / PERIOD_DAYS));
  return periodFromStart(addDays(PAY_PERIOD_ANCHOR, idx * PERIOD_DAYS));
}

export function emptyCard(iso = todayIso()): TimeCard {
  const p = currentPayPeriod(iso);
  return {
    name: "",
    periodStart: p.start,
    periodEnd: p.end,
    due: p.due,
    days: emptyDays(p.start),
    regHours: "",
    otHours: "",
    employeeSig: "",
    supervisor: "",
    cityManager: "",
  };
}

export function cardTotals(card: TimeCard) {
  const num = (s: string) => {
    const n = Number.parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };
  const hours = card.days.reduce((a, d) => a + num(d.hours), 0);
  const vacation = card.days.reduce((a, d) => a + num(d.vacation), 0);
  const sick = card.days.reduce((a, d) => a + num(d.sick), 0);
  const ptl = card.days.filter((d) => d.ptl).length;
  const reg = Math.min(hours, REG_HOURS);
  const ot = Math.max(0, hours - reg);
  return { hours, vacation, sick, ptl, reg, ot };
}

export function withPayrollTotals(card: TimeCard): TimeCard {
  const t = cardTotals(card);
  return {
    ...card,
    regHours: t.hours ? fmtHours(t.reg) : "",
    otHours: t.hours ? fmtHours(t.ot) : "",
  };
}

function fmtHours(n: number) {
  if (!n) return "0";
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 100) / 100);
}

export function dueCopy(iso = todayIso()) {
  const p = currentPayPeriod(iso);
  const days = diffDays(iso, p.due);
  const when = `${formatWeekday(p.due)} ${formatLong(p.due)}`;
  if (days < 0) {
    return { days: 0, tone: "due" as const, line: "Time card is overdue", sub: `Was due ${when}` };
  }
  if (days === 0) return { days, tone: "due" as const, line: "Time card due today", sub: when };
  if (days === 1) return { days, tone: "soon" as const, line: "Time card due tomorrow", sub: when };
  if (days <= 3) {
    return { days, tone: "soon" as const, line: `Time card due in ${days} days`, sub: when };
  }
  return { days, tone: "ok" as const, line: `Time card due in ${days} days`, sub: when };
}

const STORAGE = "cfd-timecard-v1";

export function loadCardDraft(iso = todayIso()): TimeCard {
  const blank = emptyCard(iso);
  try {
    const raw = localStorage.getItem(`${STORAGE}:${blank.periodStart}`);
    if (!raw) return blank;
    const parsed = JSON.parse(raw) as TimeCard;
    if (parsed.periodStart !== blank.periodStart || !Array.isArray(parsed.days)) return blank;
    return {
      ...blank,
      ...parsed,
      days: blank.days.map((d, i) => ({ ...d, ...(parsed.days[i] ?? {}) })),
    };
  } catch {
    return blank;
  }
}

export function saveCardDraft(card: TimeCard) {
  try {
    localStorage.setItem(`${STORAGE}:${card.periodStart}`, JSON.stringify(card));
  } catch {
    /* private mode */
  }
}

function loadEsm<T>(url: string): Promise<T> {
  return (new Function("u", "return import(u)") as (u: string) => Promise<T>)(url);
}

type PdfLib = {
  PDFDocument: {
    create: () => Promise<{
      addPage: (size: [number, number]) => PdfPage;
      embedFont: (name: unknown) => Promise<PdfFont>;
      embedPng: (bytes: Uint8Array) => Promise<{
        width: number;
        height: number;
        scale: (n: number) => { width: number; height: number };
        scaleToFit: (w: number, h: number) => { width: number; height: number };
      }>;
      registerFontkit?: (fk: unknown) => void;
      save: () => Promise<Uint8Array>;
    }>;
  };
  StandardFonts: { Helvetica: unknown; HelveticaBold: unknown };
  rgb: (r: number, g: number, b: number) => unknown;
};

type PdfFont = {
  widthOfTextAtSize: (text: string, size: number) => number;
};

type PdfPage = {
  getSize: () => { width: number; height: number };
  drawText: (text: string, opts: Record<string, unknown>) => void;
  drawRectangle: (opts: Record<string, unknown>) => void;
  drawLine: (opts: Record<string, unknown>) => void;
  drawImage: (img: unknown, opts: Record<string, unknown>) => void;
};

function winAnsi(s: string): string {
  return s
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

export async function buildTimeCardPdf(card: TimeCard): Promise<{ blob: Blob; name: string }> {
  const { PDFDocument, StandardFonts, rgb } = await loadEsm<PdfLib>(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm",
  );
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([792, 612]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const black = rgb(0, 0, 0);
  const ink = rgb(0.12, 0.12, 0.12);
  const grid = rgb(0.15, 0.15, 0.15);
  const fillHead = rgb(0.93, 0.93, 0.93);
  const ember = rgb(0.706, 0.137, 0.094);

  const text = (value: string, x: number, y: number, size: number, f = font, color = ink) => {
    page.drawText(winAnsi(value), { x, y, size, font: f, color });
  };
  const box = (x: number, y: number, w: number, h: number, fill?: unknown) => {
    page.drawRectangle({
      x,
      y,
      width: w,
      height: h,
      borderColor: grid,
      borderWidth: 0.8,
      ...(fill ? { color: fill } : {}),
    });
  };

  try {
    const res = await fetch("/cfd-time-card-logo.png");
    if (res.ok) {
      const png = await pdf.embedPng(new Uint8Array(await res.arrayBuffer()));
      const sized = png.scaleToFit(92, 70);
      page.drawImage(png, { x: 36, y: 528, width: sized.width, height: sized.height });
    }
  } catch {
    /* logo is extra */
  }

  text("NAME", 140, 572, 9, bold);
  box(178, 566, 220, 18);
  text(card.name || " ", 182, 571, 11, bold);
  text("PAY PERIOD STARTS", 520, 572, 9, bold);
  box(628, 566, 128, 18);
  text(card.periodStart, 632, 571, 11, bold);

  text("C.F.D. Time Card", 300, 540, 22, bold);

  const totals = cardTotals(card);
  const tableX = 36;
  const tableW = 540;
  const cols = [
    { x: 36, w: 54 },
    { x: 90, w: 70 },
    { x: 160, w: 88 },
    { x: 248, w: 54 },
    { x: 302, w: 70 },
    { x: 372, w: 62 },
    { x: 434, w: 142 },
  ];
  const headTop = 508;
  const headH = 18;
  box(tableX, headTop - headH, tableW, headH * 2, fillHead);
  text("DATE", cols[0].x + 10, headTop - 2, 8, bold);
  text("REGULAR SHIFT", cols[2].x + 4, headTop + 5, 8, bold);
  text("SPECIAL SHIFT", cols[4].x + 4, headTop + 5, 8, bold);
  text("Description", cols[6].x + 28, headTop - 2, 8, bold);
  text("Hours Worked", cols[2].x + 8, headTop - headH + 5, 7, bold);
  text("PTL OP", cols[3].x + 8, headTop - headH + 5, 7, bold);
  text("VACATION", cols[4].x + 8, headTop - headH + 5, 7, bold);
  text("SICK", cols[5].x + 16, headTop - headH + 5, 7, bold);
  cols.forEach((c) => {
    page.drawLine({
      start: { x: c.x, y: headTop - headH },
      end: { x: c.x, y: headTop + headH },
      thickness: 0.7,
      color: grid,
    });
  });
  page.drawLine({
    start: { x: cols[2].x, y: headTop },
    end: { x: cols[6].x, y: headTop },
    thickness: 0.6,
    color: grid,
  });

  const rowH = 18;
  const firstRow = headTop - headH - rowH;
  card.days.forEach((day, i) => {
    const y = firstRow - i * rowH;
    cols.forEach((c) => box(c.x, y, c.w, rowH));
    text(day.label, cols[0].x + 6, y + 6, 8, bold);
    text(formatMdy(day.iso), cols[1].x + 4, y + 6, 8);
    text(day.hours, cols[2].x + 28, y + 5, 10, bold);
    text(day.ptl ? "YES" : "", cols[3].x + 16, y + 5, 8, bold);
    text(day.vacation, cols[4].x + 22, y + 5, 9);
    text(day.sick, cols[5].x + 20, y + 5, 9);
    text(day.description, cols[6].x + 4, y + 6, 8);
  });

  const ty = firstRow - 14 * rowH;
  cols.forEach((c) => box(c.x, ty, c.w, rowH, fillHead));
  text("TOTAL", cols[0].x + 6, ty + 5, 8, bold);
  text(String(totals.hours || "0"), cols[2].x + 28, ty + 5, 10, bold);
  text(String(totals.ptl || "0"), cols[3].x + 18, ty + 5, 10, bold);
  text(String(totals.vacation || "0"), cols[4].x + 22, ty + 5, 10, bold);
  text(String(totals.sick || "0"), cols[5].x + 20, ty + 5, 10, bold);

  const payX = 590;
  const payRows: Array<[string, string]> = [
    ["REG Hours", card.regHours || fmtHours(totals.reg)],
    ["Overtime Hours", card.otHours || fmtHours(totals.ot)],
    ["Vacation Hours", fmtHours(totals.vacation)],
    ["Sick Hours", fmtHours(totals.sick)],
    ["Ptl. Op. Shifts", String(totals.ptl)],
  ];
  payRows.forEach((row, i) => {
    const y = firstRow - (9 + i) * rowH;
    const ot = row[0] === "Overtime Hours";
    box(payX, y, 110, rowH, fillHead);
    box(payX + 110, y, 50, rowH);
    text(row[0], payX + 6, y + 5, 8, bold, ot ? ember : ink);
    text(row[1], payX + 122, y + 5, 10, bold, ot ? ember : ink);
  });

  text("Shift Detail Must be Filled Out", 160, ty - 22, 9, bold);
  text("Signatures", 36, 48, 9, bold);
  text("Employee", 110, 48, 8, bold);
  page.drawLine({ start: { x: 164, y: 46 }, end: { x: 320, y: 46 }, thickness: 0.8, color: black });
  text(card.employeeSig || card.name, 168, 50, 9);
  text("Supervisor", 336, 48, 8, bold);
  page.drawLine({ start: { x: 400, y: 46 }, end: { x: 530, y: 46 }, thickness: 0.8, color: black });
  text(card.supervisor, 404, 50, 9);
  text("City Manager", 546, 48, 8, bold);
  page.drawLine({ start: { x: 622, y: 46 }, end: { x: 756, y: 46 }, thickness: 0.8, color: black });
  text(card.cityManager, 626, 50, 9);
  text("Revised 08/18/26 PM", 36, 22, 8, font);

  const raw = await pdf.save();
  const u8 = new Uint8Array(raw);
  const copy = new ArrayBuffer(u8.byteLength);
  new Uint8Array(copy).set(u8);
  const last = card.name.trim().split(/\s+/).pop() || "timecard";
  const name = `CFD-Time-Card-${card.periodEnd}-${last}.pdf`.replace(/[^\w.-]+/g, "_");
  return { blob: new Blob([copy], { type: "application/pdf" }), name };
}

export async function downloadPdf(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export async function sharePdf(blob: Blob, name: string) {
  const file = new File([blob], name, { type: "application/pdf" });
  const nav = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
    share?: (data: { files: File[]; title: string }) => Promise<void>;
  };
  if (typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && nav.share) {
    await nav.share({ files: [file], title: name });
    return;
  }
  await downloadPdf(blob, name);
}

export function printPdf(blob: Blob) {
  const url = URL.createObjectURL(blob);
  const frame = document.createElement("iframe");
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  frame.src = url;
  document.body.appendChild(frame);
  frame.onload = () => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    window.setTimeout(() => {
      frame.remove();
      URL.revokeObjectURL(url);
    }, 60_000);
  };
}
