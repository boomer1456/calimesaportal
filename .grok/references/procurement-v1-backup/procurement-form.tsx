import { useEffect, useRef, useState, type ReactNode } from "react";
import { Camera, ImagePlus, Loader2, Printer, Share, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fillProcurement, getPcard, parseReceipt, savePcard, deletePcard } from "@/lib/procurement-api";
import { fillCityForm, pdfPreviewJpeg } from "@/lib/fill-city-form";
import { ocrReceiptImage } from "@/lib/client-ocr";
import type { ReceiptGuess } from "@/lib/parse-receipt";
import { useTrainingStore } from "@/lib/store";
import { rosterName, sortRoster } from "@/lib/isa";
import { todayIso } from "@/lib/training-data";

type Fields = {
  date: string;
  who: string;
  card: string;
  vendor: string;
  description: string;
  coding: string;
  amount: string;
  supervisor: string;
};

const EMPTY: Fields = {
  date: todayIso(),
  who: "",
  card: "",
  vendor: "",
  description: "",
  coding: "",
  amount: "",
  supervisor: "",
};

function toInputDate(raw: string): string {
  const us = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (us) return `${us[3]}-${us[1].padStart(2, "0")}-${us[2].padStart(2, "0")}`;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
  return "";
}

function toPdfDate(iso: string): string {
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[2]}/${m[3]}/${m[1]}` : iso;
}

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T | null> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), ms);
    p.then((value) => {
      clearTimeout(timer);
      resolve(value);
    }).catch(() => {
      clearTimeout(timer);
      resolve(null);
    });
  });
}

function applyGuess(cur: Fields, guess: ReceiptGuess): Fields {
  return {
    ...cur,
    date: toInputDate(guess.date ?? "") || guess.date || cur.date,
    amount: guess.amount || cur.amount,
  };
}

async function fileToDataUrl(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") resolve(reader.result);
      else reject(new Error("Could not read that photo."));
    };
    reader.onerror = () => reject(new Error("Could not read that photo."));
    reader.readAsDataURL(file);
  });
}

function isHeic(file: File): boolean {
  const type = (file.type || "").toLowerCase();
  const name = file.name.toLowerCase();
  return type.includes("heic") || type.includes("heif") || /\.hei[cf]$/.test(name);
}

function canvasJpeg(canvas: HTMLCanvasElement, quality: number): string {
  return canvas.toDataURL("image/jpeg", quality);
}

function drawToJpeg(
  source: CanvasImageSource,
  srcW: number,
  srcH: number,
  maxEdge: number,
  quality: number,
): string {
  const scale = Math.min(1, maxEdge / Math.max(srcW, srcH));
  const w = Math.max(1, Math.round(srcW * scale));
  const h = Math.max(1, Math.round(srcH * scale));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not read that photo.");
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(source, 0, 0, w, h);
  let q = quality;
  let url = canvasJpeg(canvas, q);
  while (url.length > 380_000 && q > 0.42) {
    q -= 0.1;
    url = canvasJpeg(canvas, q);
  }
  if (url.length > 420_000 && maxEdge > 900) {
    return drawToJpeg(source, srcW, srcH, Math.round(maxEdge * 0.75), q);
  }
  return url;
}

async function decodeWithImageDecoder(file: File): Promise<string> {
  const Decoder = (window as unknown as { ImageDecoder?: new (init: { data: BufferSource; type: string }) => {
    decode: () => Promise<{ image: CanvasImageSource & { displayWidth: number; displayHeight: number; close?: () => void } }>;
  } }).ImageDecoder;
  if (!Decoder) throw new Error("no ImageDecoder");
  const type = isHeic(file) ? "image/heic" : file.type || "image/jpeg";
  const decoder = new Decoder({ data: await file.arrayBuffer(), type });
  const { image } = await decoder.decode();
  try {
    return drawToJpeg(image, image.displayWidth, image.displayHeight, 1400, 0.68);
  } finally {
    image.close?.();
  }
}

async function decodeWithBitmap(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" } as ImageBitmapOptions);
  try {
    return drawToJpeg(bitmap, bitmap.width, bitmap.height, 1400, 0.68);
  } finally {
    bitmap.close();
  }
}

async function decodeWithImgEl(file: File): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("Could not read that photo."));
      el.src = url;
    });
    return drawToJpeg(img, img.naturalWidth || img.width, img.naturalHeight || img.height, 1400, 0.68);
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function shrinkDataUrl(dataUrl: string, maxEdge: number, quality: number): Promise<string> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error("shrink"));
    el.src = dataUrl;
  });
  return drawToJpeg(img, img.naturalWidth || img.width, img.naturalHeight || img.height, maxEdge, quality);
}

async function decodeWithHeic2any(file: File): Promise<string> {
  const load = new Function(
    "u",
    "return import(u)",
  ) as (u: string) => Promise<{
    default: (opts: { blob: Blob; toType: string; quality?: number }) => Promise<Blob | Blob[]>;
  }>;
  const mod = await load("https://cdn.jsdelivr.net/npm/heic2any@0.0.4/+esm");
  const out = await mod.default({ blob: file, toType: "image/jpeg", quality: 0.7 });
  const blob = Array.isArray(out) ? out[0] : out;
  const jpeg = new File([blob], "receipt.jpg", { type: "image/jpeg" });
  return decodeWithBitmap(jpeg);
}

async function fileToJpeg(file: File): Promise<string> {
  const attempts = [decodeWithImageDecoder, decodeWithBitmap, decodeWithImgEl];
  if (isHeic(file)) attempts.push(decodeWithHeic2any);
  let last: unknown;
  for (const fn of attempts) {
    try {
      return await fn(file);
    } catch (err) {
      last = err;
    }
  }
  throw last instanceof Error ? last : new Error("Could not read that photo.");
}

function bytesFromB64(b64: string) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function jpegThumb(dataUrl: string): Promise<string | undefined> {
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error("thumb"));
      el.src = dataUrl;
    });
    const max = 240;
    const scale = Math.min(1, max / Math.max(img.width, img.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.55);
  } catch {
    return undefined;
  }
}

export function ProcurementForm({
  onBack,
  receiptId,
}: {
  onBack: () => void;
  receiptId?: string;
}) {
  const roster = useTrainingStore((s) => s.roster);
  const names = sortRoster(roster.filter((f) => f.active)).map(rosterName);
  const cameraRef = useRef<HTMLInputElement>(null);
  const rollRef = useRef<HTMLInputElement>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [photo, setPhoto] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | undefined>(receiptId);
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [loading, setLoading] = useState(Boolean(receiptId));
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pdfName, setPdfName] = useState("CFD-procurement-card.pdf");
  const previewRef = useRef<HTMLIFrameElement>(null);
  const photoDirty = useRef(false);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  function applyFilled(result: { pdf: string; name: string; preview?: string }) {
    const blob = new Blob([bytesFromB64(result.pdf)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    setPdfUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
    setPdfName(result.name);
    setPreviewUrl(result.preview ? `data:image/jpeg;base64,${result.preview}` : null);
  }

  async function buildFilled(next: Fields, image: string | null) {
    const desc = next.description.split(/\n|; /);
    try {
      const filled = await fillCityForm(
        {
          date: toPdfDate(next.date),
          who: next.who,
          card: next.card,
          vendor: next.vendor,
          description: desc[0] ?? next.description,
          description2: desc.slice(1).join("; "),
          coding: next.coding,
          amount: next.amount,
          supervisor: next.supervisor,
        },
        image,
      );
      const url = URL.createObjectURL(filled.blob);
      setPdfUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setPdfName(filled.name);
      const preview = await pdfPreviewJpeg(filled.bytes);
      setPreviewUrl(preview);
      return;
    } catch {
      /* fall through to the house server */
    }
    const result = await fillProcurement({
      data: {
        date: toPdfDate(next.date),
        who: next.who,
        card: next.card,
        vendor: next.vendor,
        description: desc[0] ?? next.description,
        description2: desc.slice(1).join("; "),
        coding: next.coding,
        amount: next.amount,
        supervisor: next.supervisor,
        image: image && image.length < 900_000 ? image : undefined,
      },
    });
    applyFilled(result);
  }

  useEffect(() => {
    if (!receiptId) return;
    let live = true;
    void (async () => {
      try {
        const row = await getPcard({ data: { id: receiptId } });
        if (!live || !row) {
          if (live) {
            setError("That receipt is not on the house log.");
            setLoading(false);
          }
          return;
        }
        setFields({
          date: row.date || todayIso(),
          who: row.who,
          card: row.card,
          vendor: row.vendor,
          description: row.description,
          coding: row.coding,
          amount: row.amount,
          supervisor: row.supervisor,
        });
        if (row.image) setPhoto(row.image);
        setSavedId(row.id);
        try {
          await buildFilled(
            {
              date: row.date || todayIso(),
              who: row.who,
              card: row.card,
              vendor: row.vendor,
              description: row.description,
              coding: row.coding,
              amount: row.amount,
              supervisor: row.supervisor,
            },
            row.image,
          );
        } catch {
          /* preview is extra */
        }
      } catch {
        if (live) setError("Could not load that receipt.");
      } finally {
        if (live) setLoading(false);
      }
    })();
    return () => {
      live = false;
    };
  }, [receiptId]);

  function set<K extends keyof Fields>(key: K, value: string) {
    setFields((cur) => ({ ...cur, [key]: value }));
  }

  async function onPick(file: File | undefined) {
    if (!file) return;
    setError(null);
    setNote(null);
    setReading(true);
    let payload: string | null = null;
    try {
      payload = await fileToJpeg(file);
    } catch {
      try {
        payload = await fileToDataUrl(file);
        if (payload.length > 3_500_000) {
          setError("That photo is too large to send. Use Take photo.");
          setReading(false);
          return;
        }
      } catch {
        setError("Could not open that photo. Use Take photo, or pick a JPEG.");
        setReading(false);
        return;
      }
    }
    setPhoto(payload);
    photoDirty.current = true;
    try {
      const [local, remote] = await Promise.all([
        ocrReceiptImage(payload).catch(() => ({}) as ReceiptGuess),
        withTimeout(parseReceipt({ data: { image: payload } }), 20000),
      ]);
      const guess: ReceiptGuess = {
        amount: remote?.amount || local.amount,
        date: toInputDate(remote?.date ?? "") || remote?.date || local.date,
      };
      setFields((cur) => applyGuess(cur, guess));
      const got = Boolean(guess.amount || guess.date);
      setNote(
        got
          ? "Filled date and total. Type the vendor, your name, and what it was for, then save."
          : "Photo attached. Fill vendor, date, and total, then save.",
      );
    } catch {
      setNote("Photo attached. Fill vendor, date, and total, then save.");
    } finally {
      setReading(false);
    }
  }

  async function savePdf() {
    setError(null);
    setSaving(true);
    try {
      await buildFilled(fields, photo);
    } catch {
      setError("Could not build the PDF. The receipt can still go on the house log.");
    }

    try {
      const saved = await savePcard({
        data: {
          id: savedId,
          date: fields.date || undefined,
          who: fields.who,
          card: fields.card,
          vendor: fields.vendor,
          description: fields.description,
          coding: fields.coding,
          amount: fields.amount,
          supervisor: fields.supervisor,
          image: photoDirty.current ? photo ?? undefined : undefined,
          thumb: photoDirty.current && photo ? await jpegThumb(photo) : undefined,
        },
      });
      setSavedId(saved.id);
      photoDirty.current = false;
      setNote("Saved to Archived receipts. Fire admin can open, edit, or delete it from Forms.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save to the house log.");
    } finally {
      setSaving(false);
    }
  }

  async function removeReceipt() {
    if (!savedId) return;
    setError(null);
    setDeleting(true);
    try {
      await deletePcard({ data: { id: savedId } });
      onBack();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete that receipt.");
      setDeleting(false);
    }
  }

  function downloadFilled() {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = pdfName;
    a.click();
  }

  function printFilled() {
    const frame = previewRef.current;
    if (frame?.contentWindow) {
      frame.contentWindow.focus();
      frame.contentWindow.print();
      return;
    }
    if (pdfUrl) window.open(pdfUrl, "_blank")?.print();
  }

  async function shareFilled() {
    if (!pdfUrl || typeof navigator.share !== "function") {
      downloadFilled();
      return;
    }
    const file = new File([await fetch(pdfUrl).then((r) => r.blob())], pdfName, {
      type: "application/pdf",
    });
    try {
      await navigator.share({ files: [file], title: "Procurement card" });
    } catch {
      /* user cancelled */
    }
  }

  return (
    <section className="flex flex-col gap-4 pb-8">
      <header>
        <p className="text-xs font-medium tracking-[0.18em] text-muted uppercase">
          City of Calimesa
        </p>
        <h1 className="font-display text-4xl font-bold leading-none tracking-tight text-navy">
          Procurement card
        </h1>
        {loading ? (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted">
            <Loader2 className="size-4 animate-spin" />
            Opening house receipt…
          </p>
        ) : (
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Snap or pick the receipt, fill the lines, then save. The City form
            shows at the bottom with your answers and the receipt on the right.
          </p>
        )}
      </header>

      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          className="flex h-11 items-center justify-center gap-2 rounded-md bg-navy text-sm font-semibold text-cream"
        >
          <Camera className="size-4" />
          Take photo
        </button>
        <button
          type="button"
          onClick={() => rollRef.current?.click()}
          className="flex h-11 items-center justify-center gap-2 rounded-md bg-ember text-sm font-semibold text-ember-fg"
        >
          <ImagePlus className="size-4" />
          Camera roll
        </button>
      </div>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*,.heic,.heif,image/heic,image/heif"
        capture="environment"
        className="hidden"
        onChange={(e) => void onPick(e.target.files?.[0])}
      />
      <input
        ref={rollRef}
        type="file"
        accept="image/*,.heic,.heif,image/heic,image/heif"
        className="hidden"
        onChange={(e) => void onPick(e.target.files?.[0])}
      />

      {photo ? (
        <div className="relative overflow-hidden rounded-md border border-line bg-surface-2">
          <img src={photo} alt="Receipt" className="mx-auto max-h-56 object-contain" />
          <button
            type="button"
            aria-label="Remove receipt"
            onClick={() => {
              setPhoto(null);
              photoDirty.current = true;
              if (cameraRef.current) cameraRef.current.value = "";
              if (rollRef.current) rollRef.current.value = "";
            }}
            className="absolute top-2 right-2 flex size-9 items-center justify-center rounded-sm bg-navy text-cream"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      {reading ? (
        <p className="flex items-center gap-2 text-sm text-navy">
          <Loader2 className="size-4 animate-spin" />
          Reading date and total…
        </p>
      ) : null}
      {note ? <p className="text-sm text-shift-c">{note}</p> : null}
      {error ? <p className="text-sm text-ember">{error}</p> : null}

      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          void savePdf();
        }}
      >
        <Field label="Date of purchase">
          <input
            type="date"
            value={fields.date}
            onChange={(e) => set("date", e.target.value)}
            className={inputClass}
          />
        </Field>
        <Field label="Who made the purchase">
          <input
            list="pcard-roster"
            value={fields.who}
            onChange={(e) => set("who", e.target.value)}
            placeholder="Last, First"
            className={inputClass}
          />
          <datalist id="pcard-roster">
            {names.map((n) => (
              <option key={n} value={n} />
            ))}
          </datalist>
        </Field>
        <Field label="Card name">
          <input
            value={fields.card}
            onChange={(e) => set("card", e.target.value)}
            placeholder="Engine / station card"
            className={inputClass}
          />
        </Field>
        <Field label="Vendor">
          <input
            value={fields.vendor}
            onChange={(e) => set("vendor", e.target.value)}
            placeholder="Store / restaurant / hotel"
            className={inputClass}
          />
        </Field>
        <Field label="Description of purchase">
          <textarea
            rows={2}
            value={fields.description}
            onChange={(e) => set("description", e.target.value)}
            className="rounded-md border border-line bg-surface-2 px-3 py-2 text-sm text-ink"
          />
        </Field>
        <Field label="Account coding">
          <input
            value={fields.coding}
            onChange={(e) => set("coding", e.target.value)}
            placeholder="Fund / dept / object"
            className={inputClass}
          />
        </Field>
        <Field label="Amount of purchase">
          <input
            value={fields.amount}
            onChange={(e) => set("amount", e.target.value)}
            inputMode="decimal"
            className={inputClass}
          />
        </Field>
        <Field label="Supervisor approval">
          <input
            value={fields.supervisor}
            onChange={(e) => set("supervisor", e.target.value)}
            placeholder="Print name — they still sign"
            className={inputClass}
          />
        </Field>

        <p className="text-xs leading-relaxed text-muted">
          Official City business only. Fill this out right after the purchase. The house
          log holds it for Accounts Payable — they still need a supervisor signature.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <Button type="submit" variant="primary" disabled={saving || reading}>
            {saving ? "Saving…" : savedId ? "Update archive" : "Save to archive"}
          </Button>
          <a
            href="/docs/procurement-card.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-2 rounded-md border border-line bg-surface-2 text-sm font-semibold text-navy"
          >
            <Printer className="size-4" />
            Blank form
          </a>
        </div>
        {savedId ? (
          confirmDelete ? (
            <div className="flex items-center gap-2">
              <p className="flex-1 text-sm text-ember">Remove this ticket from the archive?</p>
              <Button
                type="button"
                variant="outline"
                disabled={deleting}
                onClick={() => setConfirmDelete(false)}
              >
                Keep
              </Button>
              <Button type="button" variant="primary" disabled={deleting} onClick={() => void removeReceipt()}>
                {deleting ? "Removing…" : "Delete"}
              </Button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="h-11 text-sm font-semibold text-ember"
            >
              Delete from archive
            </button>
          )
        ) : null}
      </form>

      {previewUrl || pdfUrl ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-medium tracking-wide text-muted uppercase">
            Filled City form
          </p>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Filled procurement card with receipt attached"
              className="w-full rounded-md border border-line bg-surface"
            />
          ) : (
            <iframe
              ref={previewRef}
              title="Filled procurement card"
              src={pdfUrl ?? undefined}
              className="h-[28rem] w-full rounded-md border border-line bg-surface"
            />
          )}
          <div className="grid grid-cols-2 gap-2">
            <Button type="button" variant="navy" onClick={downloadFilled}>
              Download PDF
            </Button>
            <Button type="button" variant="outline" onClick={printFilled}>
              <Printer className="size-4" />
              Print
            </Button>
          </div>
          {typeof navigator !== "undefined" && "share" in navigator ? (
            <button
              type="button"
              onClick={() => void shareFilled()}
              className="flex h-11 items-center justify-center gap-2 text-sm font-semibold text-navy"
            >
              <Share className="size-4" />
              Share with Accounts Payable
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

const inputClass =
  "h-11 w-full rounded-md border border-line bg-surface-2 px-3 text-sm text-ink placeholder:text-subtle";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium tracking-wide text-muted uppercase">{label}</span>
      {children}
    </label>
  );
}
