import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

function pythonScript(): string {
  const names = ["scripts/procurement.py", "procurement.py"];
  for (const name of names) {
    const path = join(process.cwd(), name);
    if (existsSync(path)) return path;
  }
  return join(process.cwd(), "scripts/procurement.py");
}

function runPython(args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const child = spawn("python3", args, { cwd: process.cwd() });
    let out = "";
    let err = "";
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error("Timed out reading that receipt."));
    }, 60000);
    child.stdout.on("data", (chunk) => {
      out += String(chunk);
    });
    child.stderr.on("data", (chunk) => {
      err += String(chunk);
    });
    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) resolve(out);
      else reject(new Error(err.trim() || "Could not read that receipt."));
    });
  });
}

function decodeDataUrl(raw: string): { ext: string; bytes: Buffer } {
  const match = raw.match(/^data:([^;]+);base64,(.+)$/);
  const b64 = match ? match[2] : raw.replace(/^data:[^;]+;base64,/, "");
  const mime = (match?.[1] ?? "image/jpeg").toLowerCase();
  const bytes = Buffer.from(b64, "base64");
  const head = bytes.subarray(0, 16).toString("latin1");
  let ext = "jpg";
  if (head.includes("ftypheic") || head.includes("ftypheif") || head.includes("ftypmif1") || mime.includes("heic") || mime.includes("heif")) {
    ext = "heic";
  } else if (mime.includes("png") || head.startsWith("\x89PNG")) {
    ext = "png";
  } else if (mime.includes("webp") || head.startsWith("RIFF")) {
    ext = "webp";
  } else if (mime.includes("gif")) {
    ext = "gif";
  }
  return { ext, bytes };
}

export type ReceiptFields = {
  date?: string;
  vendor?: string;
  amount?: string;
  description?: string;
  description2?: string;
  card?: string;
  raw?: string;
  jpeg?: string;
};

export async function parseReceiptImage(image: string): Promise<ReceiptFields> {
  const dir = await mkdtemp(join(tmpdir(), "cfd-pcard-"));
  try {
    const { ext, bytes } = decodeDataUrl(image);
    if (bytes.length < 80) throw new Error("That photo is empty.");
    const imgPath = join(dir, `receipt.${ext}`);
    await writeFile(imgPath, bytes);
    const out = await runPython([pythonScript(), "--ocr", imgPath]);
    const jsonStart = out.lastIndexOf("{");
    const jsonText = jsonStart >= 0 ? out.slice(jsonStart) : out;
    return JSON.parse(jsonText) as ReceiptFields;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

export async function fillProcurementPdf(input: {
  date?: string;
  who?: string;
  card?: string;
  vendor?: string;
  description?: string;
  description2?: string;
  coding?: string;
  amount?: string;
  supervisor?: string;
  image?: string;
}): Promise<{ pdf: string; name: string; preview?: string }> {
  const dir = await mkdtemp(join(tmpdir(), "cfd-pcard-"));
  try {
    const fieldsPath = join(dir, "fields.json");
    const outPath = join(dir, "filled.pdf");
    await writeFile(
      fieldsPath,
      JSON.stringify({
        date: input.date ?? "",
        who: input.who ?? "",
        card: input.card ?? "",
        vendor: input.vendor ?? "",
        description: input.description ?? "",
        description2: input.description2 ?? "",
        coding: input.coding ?? "",
        amount: input.amount ?? "",
        supervisor: input.supervisor ?? "",
      }),
    );
    const args = [pythonScript(), "--fill", fieldsPath, "--out", outPath];
    if (input.image) {
      const { ext, bytes } = decodeDataUrl(input.image);
      const receiptPath = join(dir, `receipt.${ext}`);
      await writeFile(receiptPath, bytes);
      args.push("--receipt", receiptPath);
    }
    await runPython(args);
    const pdf = await readFile(outPath);
    const stamp = (input.date ?? "receipt").replace(/[^\d]+/g, "");
    let preview: string | undefined;
    try {
      const jpeg = await readFile(join(dir, "filled.preview.jpg"));
      preview = jpeg.toString("base64");
    } catch {
      preview = undefined;
    }
    return {
      pdf: pdf.toString("base64"),
      preview,
      name: `CFD-procurement-card-${stamp || "form"}.pdf`,
    };
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
