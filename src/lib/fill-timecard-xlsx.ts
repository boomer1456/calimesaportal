import { zipBlob } from "@/lib/xlsx-simple";
import { cardTotals, type TimeCard } from "@/lib/timecard";

const NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main";
const TEMPLATE = "/cfd-time-card.xlsx";

function u16(b: Uint8Array, o: number) {
  return b[o] | (b[o + 1] << 8);
}
function u32(b: Uint8Array, o: number) {
  return (b[o] | (b[o + 1] << 8) | (b[o + 2] << 16) | (b[o + 3] << 24)) >>> 0;
}

async function inflateRaw(data: Uint8Array): Promise<Uint8Array> {
  const copy = new ArrayBuffer(data.byteLength);
  new Uint8Array(copy).set(data);
  const stream = new Blob([copy]).stream().pipeThrough(new DecompressionStream("deflate-raw"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unzip(buf: Uint8Array): Promise<Map<string, Uint8Array>> {
  const out = new Map<string, Uint8Array>();
  let i = 0;
  while (i + 30 <= buf.length) {
    if (u32(buf, i) !== 0x04034b50) break;
    const method = u16(buf, i + 8);
    const comp = u32(buf, i + 18);
    const nlen = u16(buf, i + 26);
    const elen = u16(buf, i + 28);
    const name = new TextDecoder().decode(buf.slice(i + 30, i + 30 + nlen));
    const start = i + 30 + nlen + elen;
    const packed = new Uint8Array(buf.slice(start, start + comp));
    let file: Uint8Array = packed;
    if (method === 8) file = await inflateRaw(packed);
    else if (method !== 0) throw new Error("Could not read the time card spreadsheet.");
    out.set(name, file);
    i = start + comp;
  }
  if (!out.size) throw new Error("Could not read the time card spreadsheet.");
  return out;
}

function excelSerial(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(1899, 11, 30)) / 86400000);
}

function num(s: string): number | null {
  if (!s.trim()) return null;
  const n = Number.parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function getRow(sheet: Element, r: number): Element {
  const rows = [...sheet.getElementsByTagNameNS(NS, "row")];
  let row = rows.find((el) => el.getAttribute("r") === String(r));
  if (row) return row;
  const doc = sheet.ownerDocument;
  row = doc.createElementNS(NS, "row");
  row.setAttribute("r", String(r));
  const data = sheet.getElementsByTagNameNS(NS, "sheetData")[0];
  data.appendChild(row);
  return row;
}

function getCell(row: Element, ref: string): Element {
  const cells = [...row.getElementsByTagNameNS(NS, "c")];
  let cell = cells.find((el) => el.getAttribute("r") === ref);
  if (cell) return cell;
  const doc = row.ownerDocument;
  cell = doc.createElementNS(NS, "c");
  cell.setAttribute("r", ref);
  row.appendChild(cell);
  return cell;
}

function clearCell(cell: Element) {
  while (cell.firstChild) cell.removeChild(cell.firstChild);
  cell.removeAttribute("t");
}

function setNumber(cell: Element, value: number) {
  clearCell(cell);
  const v = cell.ownerDocument.createElementNS(NS, "v");
  v.textContent = String(value);
  cell.appendChild(v);
}

function setBool(cell: Element, value: boolean) {
  clearCell(cell);
  cell.setAttribute("t", "b");
  const v = cell.ownerDocument.createElementNS(NS, "v");
  v.textContent = value ? "1" : "0";
  cell.appendChild(v);
}

function setText(cell: Element, value: string) {
  clearCell(cell);
  cell.setAttribute("t", "inlineStr");
  const isEl = cell.ownerDocument.createElementNS(NS, "is");
  const t = cell.ownerDocument.createElementNS(NS, "t");
  t.textContent = value;
  isEl.appendChild(t);
  cell.appendChild(isEl);
}

function setCached(cell: Element, value: number) {
  let v = cell.getElementsByTagNameNS(NS, "v")[0];
  if (!v) {
    v = cell.ownerDocument.createElementNS(NS, "v");
    cell.appendChild(v);
  }
  v.textContent = String(value);
}

export async function fillTimeCardXlsx(card: TimeCard): Promise<{ blob: Blob; name: string }> {
  const res = await fetch(TEMPLATE);
  if (!res.ok) throw new Error("Could not open the C.F.D. time card.");
  const files = await unzip(new Uint8Array(await res.arrayBuffer()));
  const sheetXml = files.get("xl/worksheets/sheet1.xml");
  if (!sheetXml) throw new Error("Time card sheet is missing.");

  const xml = new TextDecoder().decode(sheetXml);
  const doc = new DOMParser().parseFromString(xml, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("Time card sheet could not be read.");
  const sheet = doc.documentElement;
  const startSerial = excelSerial(card.periodStart);

  setText(getCell(getRow(sheet, 2), "D2"), card.name.trim() || " ");
  setNumber(getCell(getRow(sheet, 2), "R2"), startSerial);

  card.days.forEach((day, i) => {
    const r = 8 + i;
    const row = getRow(sheet, r);
    setNumber(getCell(row, `B${r}`), startSerial + i);
    const hours = num(day.hours);
    if (hours != null) setNumber(getCell(row, `C${r}`), hours);
    setBool(getCell(row, `E${r}`), day.ptl);
    const vac = num(day.vacation);
    if (vac != null) setNumber(getCell(row, `G${r}`), vac);
    const sick = num(day.sick);
    if (sick != null) setNumber(getCell(row, `H${r}`), sick);
    if (day.description.trim()) setText(getCell(row, `K${r}`), day.description.trim());
  });

  if (card.name.trim()) setText(getCell(getRow(sheet, 28), "C28"), card.name.trim());
  if (card.supervisor.trim()) setText(getCell(getRow(sheet, 28), "H28"), card.supervisor.trim());
  if (card.cityManager.trim()) setText(getCell(getRow(sheet, 28), "N28"), card.cityManager.trim());

  const totals = cardTotals(card);
  setCached(getCell(getRow(sheet, 22), "C22"), totals.hours);
  setCached(getCell(getRow(sheet, 20), "R20"), totals.reg);
  setCached(getCell(getRow(sheet, 21), "R21"), totals.ot);
  setCached(getCell(getRow(sheet, 22), "G22"), totals.vacation);
  setCached(getCell(getRow(sheet, 22), "H22"), totals.sick);
  setCached(getCell(getRow(sheet, 22), "E22"), totals.ptl);
  setCached(getCell(getRow(sheet, 24), "R24"), totals.ptl);

  const out = new XMLSerializer().serializeToString(doc);
  const payload = out.startsWith("<?xml") ? out : `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n${out}`;
  files.set("xl/worksheets/sheet1.xml", new TextEncoder().encode(payload));

  const blob = zipBlob(
    [...files.entries()].map(([name, data]) => ({ name, data })),
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  );
  const last = (card.name.trim().split(/\s+/).pop() || "timecard").replace(/[^\w.-]+/g, "_");
  const name = `CFD-Time-Card-${card.periodEnd}-${last}.xlsx`;
  return { blob, name };
}

export async function shareBlob(blob: Blob, name: string, title: string) {
  const file = new File([blob], name, { type: blob.type });
  const nav = navigator as Navigator & {
    canShare?: (data: { files: File[] }) => boolean;
    share?: (data: { files: File[]; title: string }) => Promise<void>;
  };
  if (typeof nav.canShare === "function" && nav.canShare({ files: [file] }) && nav.share) {
    await nav.share({ files: [file], title });
    return "shared" as const;
  }
  return "download" as const;
}
