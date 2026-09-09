/** Minimal uncompressed .xlsx writer (Excel / Numbers / Google Sheets). */

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[i] = c >>> 0;
  }
  return table;
})();

function crc32(data: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u16(n: number): Uint8Array {
  const b = new Uint8Array(2);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  return b;
}

function u32(n: number): Uint8Array {
  const b = new Uint8Array(4);
  b[0] = n & 0xff;
  b[1] = (n >>> 8) & 0xff;
  b[2] = (n >>> 16) & 0xff;
  b[3] = (n >>> 24) & 0xff;
  return b;
}

function concat(parts: Uint8Array[]): Uint8Array {
  const len = parts.reduce((n, p) => n + p.length, 0);
  const out = new Uint8Array(len);
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function strBytes(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

function zipStore(files: Array<{ name: string; data: Uint8Array }>): Uint8Array {
  const locals: Uint8Array[] = [];
  const centrals: Uint8Array[] = [];
  let offset = 0;
  for (const file of files) {
    const name = strBytes(file.name);
    const crc = crc32(file.data);
    const local = concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(file.data.length),
      u32(file.data.length),
      u16(name.length),
      u16(0),
      name,
      file.data,
    ]);
    const central = concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(file.data.length),
      u32(file.data.length),
      u16(name.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      name,
    ]);
    locals.push(local);
    centrals.push(central);
    offset += local.length;
  }
  const centralDir = concat(centrals);
  const eocd = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralDir.length),
    u32(offset),
    u16(0),
  ]);
  return concat([...locals, centralDir, eocd]);
}

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function colLetter(index: number): string {
  let n = index + 1;
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

export type CellValue = string | number | null | undefined;

export function workbookBlob(rows: CellValue[][], sheetName = "ISA Hours"): Blob {
  const name = sheetName.replace(/[\\/?*[\]]/g, " ").slice(0, 31) || "Sheet1";
  const maxCols = rows.reduce((m, r) => Math.max(m, r.length), 0);
  const sheetRows: string[] = [];
  rows.forEach((row, ri) => {
    const r = ri + 1;
    const cells: string[] = [];
    for (let ci = 0; ci < row.length; ci++) {
      const v = row[ci];
      if (v === null || v === undefined || v === "") continue;
      const ref = `${colLetter(ci)}${r}`;
      if (typeof v === "number" && Number.isFinite(v)) {
        cells.push(`<c r="${ref}" t="n"><v>${v}</v></c>`);
      } else {
        cells.push(
          `<c r="${ref}" t="inlineStr"><is><t>${xmlEscape(String(v))}</t></is></c>`,
        );
      }
    }
    if (cells.length) sheetRows.push(`<row r="${r}">${cells.join("")}</row>`);
  });
  const cols =
    maxCols > 0
      ? `<cols>${Array.from({ length: maxCols }, (_, i) => {
          const width = i === 4 ? 42 : i === 3 ? 22 : i === 9 ? 36 : 18;
          return `<col min="${i + 1}" max="${i + 1}" width="${width}" customWidth="1"/>`;
        }).join("")}</cols>`
      : "";
  const sheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${cols}<sheetData>${sheetRows.join("")}</sheetData></worksheet>`;
  const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="${xmlEscape(name)}" sheetId="1" r:id="rId1"/></sheets></workbook>`;
  const types = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>`;
  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`;
  const wbRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>`;
  const bytes = zipStore([
    { name: "[Content_Types].xml", data: strBytes(types) },
    { name: "_rels/.rels", data: strBytes(rels) },
    { name: "xl/workbook.xml", data: strBytes(workbook) },
    { name: "xl/_rels/workbook.xml.rels", data: strBytes(wbRels) },
    { name: "xl/worksheets/sheet1.xml", data: strBytes(sheet) },
  ]);
  const packed = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(packed).set(bytes);
  return new Blob([packed], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

export function zipBlob(
  files: Array<{ name: string; data: Uint8Array }>,
  mime: string,
): Blob {
  const bytes = zipStore(files);
  const packed = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(packed).set(bytes);
  return new Blob([packed], { type: mime });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}
