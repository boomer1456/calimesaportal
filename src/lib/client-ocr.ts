import { parseReceiptText, type ReceiptGuess } from "./parse-receipt";

type TessWorker = {
  recognize: (image: string) => Promise<{ data?: { text?: string } }>;
  setParameters?: (p: Record<string, string>) => Promise<void>;
};

let workerPromise: Promise<TessWorker> | null = null;

async function getWorker(): Promise<TessWorker> {
  if (!workerPromise) {
    workerPromise = (async () => {
      const load = new Function("u", "return import(u)") as (u: string) => Promise<{
        createWorker: (lang: string, oem?: number) => Promise<TessWorker>;
      }>;
      const mod = await load("https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/+esm");
      const worker = await mod.createWorker("eng", 1);
      await worker.setParameters?.({ tessedit_pageseg_mode: "6" });
      return worker;
    })().catch((err) => {
      workerPromise = null;
      throw err;
    });
  }
  return workerPromise;
}

export async function ocrReceiptImage(dataUrl: string): Promise<ReceiptGuess> {
  const worker = await getWorker();
  const rec = await worker.recognize(dataUrl);
  const text = rec.data?.text ?? "";
  return parseReceiptText(text);
}
