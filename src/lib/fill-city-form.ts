export type CityFormFields = {
  date: string;
  who: string;
  card: string;
  vendor: string;
  description: string;
  description2?: string;
  coding: string;
  amount: string;
  supervisor: string;
};

function loadEsm<T>(url: string): Promise<T> {
  return (new Function("u", "return import(u)") as (u: string) => Promise<T>)(url);
}

function dataUrlToBytes(url: string): Uint8Array {
  const comma = url.indexOf(",");
  const b64 = comma >= 0 ? url.slice(comma + 1) : url;
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function winAnsi(s: string): string {
  return s
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");
}

let templateBuf: ArrayBuffer | null = null;

async function cityTemplate(): Promise<ArrayBuffer> {
  if (templateBuf) return templateBuf.slice(0);
  const urls = ["/procurement-card.pdf", "/docs/procurement-card.pdf"];
  let last = "Could not open the City form.";
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        last = `Could not open the City form (${res.status}).`;
        continue;
      }
      templateBuf = await res.arrayBuffer();
      return templateBuf.slice(0);
    } catch {
      last = "Could not open the City form.";
    }
  }
  throw new Error(last);
}

async function toJpegBytes(image: string): Promise<Uint8Array> {
  if (/^data:image\/jpe?g/i.test(image)) return dataUrlToBytes(image);
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("Could not read the receipt photo."));
    el.src = image;
  });
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, img.naturalWidth || img.width);
  canvas.height = Math.max(1, img.naturalHeight || img.height);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read the receipt photo.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0);
  return dataUrlToBytes(canvas.toDataURL("image/jpeg", 0.72));
}

type PdfLib = {
  PDFDocument: {
    load: (data: ArrayBuffer) => Promise<PdfDoc>;
    create: () => Promise<PdfDoc>;
  };
  StandardFonts: { Helvetica: unknown };
  rgb: (r: number, g: number, b: number) => unknown;
};

type PdfDoc = {
  getForm: () => {
    getTextField: (name: string) => { setText: (value: string) => void };
    updateFieldAppearances: (font: unknown) => void;
    flatten: () => void;
  };
  embedFont: (name: unknown) => Promise<unknown>;
  embedJpg: (bytes: Uint8Array) => Promise<{
    scaleToFit: (w: number, h: number) => { width: number; height: number };
  }>;
  addPage: (size?: [number, number]) => {
    getSize: () => { width: number; height: number };
    drawRectangle: (opts: Record<string, unknown>) => void;
    drawImage: (img: unknown, opts: Record<string, unknown>) => void;
    drawText: (value: string, opts: Record<string, unknown>) => void;
  };
  getPages: () => Array<{
    getSize: () => { width: number; height: number };
    drawRectangle: (opts: Record<string, unknown>) => void;
    drawImage: (img: unknown, opts: Record<string, unknown>) => void;
    drawText: (value: string, opts: Record<string, unknown>) => void;
  }>;
  save: () => Promise<Uint8Array>;
};

export async function fillCityForm(
  fields: CityFormFields,
  image?: string | null,
): Promise<{ blob: Blob; bytes: Uint8Array; name: string }> {
  try {
    return await fillOfficialForm(fields, image);
  } catch {
    return await fillPlainForm(fields, image);
  }
}

async function fillOfficialForm(
  fields: CityFormFields,
  image?: string | null,
): Promise<{ blob: Blob; bytes: Uint8Array; name: string }> {
  const { PDFDocument, StandardFonts, rgb } = await loadEsm<PdfLib>(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm",
  );
  const pdf = await PDFDocument.load(await cityTemplate());
  const form = pdf.getForm();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const put = (name: string, value: string) => {
    const text = winAnsi(value).trim().slice(0, 140);
    if (!text) return;
    try {
      form.getTextField(name).setText(text);
    } catch {
      /* field missing on this PDF */
    }
  };
  put("Date of Purchase", fields.date);
  put("Who Made The Purchase", fields.who);
  put("Card Name", fields.card);
  put("undefined", fields.vendor);
  put("Description Of Purchase 1", fields.description);
  put("Description Of Purchase 2", fields.description2 ?? "");
  put("Account Coding", fields.coding);
  put("Amount Of Purchase", fields.amount);
  put("Supervisor Approval", fields.supervisor);
  try {
    form.getTextField("Attach Receipt Here").setText("");
  } catch {
    /* ok */
  }
  form.updateFieldAppearances(font);
  form.flatten();

  const page = pdf.getPages()[0];
  const pageH = page.getSize().height;
  if (image) {
    try {
      const jpg = await pdf.embedJpg(await toJpegBytes(image));
      const box = { x: 378, y: pageH - 748, w: 194, h: 572 };
      const scaled = jpg.scaleToFit(box.w - 10, box.h - 10);
      page.drawRectangle({
        x: box.x,
        y: box.y,
        width: box.w,
        height: box.h,
        color: rgb(1, 1, 1),
      });
      page.drawImage(jpg, {
        x: box.x + (box.w - scaled.width) / 2,
        y: box.y + (box.h - scaled.height) / 2,
        width: scaled.width,
        height: scaled.height,
      });
      page.drawRectangle({
        x: 374.18,
        y: pageH - 755.5,
        width: 201.32,
        height: 585.04,
        borderColor: rgb(0.14, 0.12, 0.13),
        borderWidth: 1,
      });
    } catch {
      /* receipt stamp is extra — fields still print */
    }
  }

  const raw = await pdf.save();
  const u8 = new Uint8Array(raw);
  const copy = new ArrayBuffer(u8.byteLength);
  new Uint8Array(copy).set(u8);
  const stamp = (fields.date || "form").replace(/[^\d]+/g, "");
  return {
    blob: new Blob([copy], { type: "application/pdf" }),
    bytes: new Uint8Array(copy),
    name: `CFD-procurement-card-${stamp || "form"}.pdf`,
  };
}

async function fillPlainForm(
  fields: CityFormFields,
  image?: string | null,
): Promise<{ blob: Blob; bytes: Uint8Array; name: string }> {
  const { PDFDocument, StandardFonts, rgb } = await loadEsm<PdfLib>(
    "https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/+esm",
  );
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const navy = rgb(0.106, 0.212, 0.365);
  const ink = rgb(0.1, 0.12, 0.17);
  const muted = rgb(0.36, 0.4, 0.44);
  const text = (value: string, x: number, y: number, size: number, color = ink) => {
    page.drawText(winAnsi(value), { x, y, size, font, color });
  };
  page.drawRectangle({ x: 0, y: 748, width: 612, height: 44, color: navy });
  text("CITY OF CALIMESA FIRE DEPARTMENT", 36, 776, 9, rgb(0.95, 0.93, 0.89));
  text("Procurement card", 36, 758, 16, rgb(0.95, 0.93, 0.89));
  const rows: Array<[string, string]> = [
    ["Date of purchase", fields.date],
    ["Who", fields.who],
    ["Card", fields.card],
    ["Vendor", fields.vendor],
    ["Description", [fields.description, fields.description2].filter(Boolean).join(" — ")],
    ["Account coding", fields.coding],
    ["Amount", fields.amount],
    ["Supervisor", fields.supervisor],
  ];
  rows.forEach((row, i) => {
    const y = 710 - i * 28;
    text(row[0].toUpperCase(), 36, y + 12, 7, muted);
    page.drawRectangle({ x: 36, y: y - 6, width: 300, height: 18, borderColor: rgb(0.78, 0.75, 0.7), borderWidth: 0.7 });
    text(row[1] || " ", 40, y - 1, 10);
  });
  if (image) {
    try {
      const jpg = await pdf.embedJpg(await toJpegBytes(image));
      const scaled = jpg.scaleToFit(220, 420);
      page.drawImage(jpg, { x: 356, y: 280, width: scaled.width, height: scaled.height });
    } catch {
      /* photo is extra */
    }
  }
  const raw = await pdf.save();
  const u8 = new Uint8Array(raw);
  const copy = new ArrayBuffer(u8.byteLength);
  new Uint8Array(copy).set(u8);
  const stamp = (fields.date || "form").replace(/[^\d]+/g, "");
  return {
    blob: new Blob([copy], { type: "application/pdf" }),
    bytes: new Uint8Array(copy),
    name: `CFD-procurement-card-${stamp || "form"}.pdf`,
  };
}

export async function pdfPreviewJpeg(bytes: Uint8Array): Promise<string | null> {
  try {
    const pdfjs = (await loadEsm<{
      GlobalWorkerOptions: { workerSrc: string };
      getDocument: (opts: { data: Uint8Array }) => { promise: Promise<{ getPage: (n: number) => Promise<{
        getViewport: (o: { scale: number }) => { width: number; height: number };
        render: (o: { canvasContext: CanvasRenderingContext2D; viewport: { width: number; height: number } }) => { promise: Promise<void> };
      }>; destroy?: () => Promise<void> }> };
    }>("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.min.mjs"));
    pdfjs.GlobalWorkerOptions.workerSrc =
      "https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.mjs";
    const copy = bytes.slice();
    const doc = await pdfjs.getDocument({ data: copy }).promise;
    const page = await doc.getPage(1);
    const viewport = page.getViewport({ scale: 1.35 });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    await page.render({ canvasContext: ctx, viewport }).promise;
    await doc.destroy?.();
    return canvas.toDataURL("image/jpeg", 0.7);
  } catch {
    return null;
  }
}
