import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const imageField = z.string().min(80).max(12_000_000);
const optionalImage = z.string().max(12_000_000).optional();

export const parseReceipt = createServerFn({ method: "POST" })
  .validator(z.object({ image: imageField }))
  .handler(async ({ data }) => {
    const { parseReceiptImage } = await import("@/lib/procurement.server");
    return parseReceiptImage(data.image);
  });

export const fillProcurement = createServerFn({ method: "POST" })
  .validator(
    z.object({
      date: z.string().optional(),
      who: z.string().optional(),
      card: z.string().optional(),
      vendor: z.string().optional(),
      description: z.string().optional(),
      description2: z.string().optional(),
      coding: z.string().optional(),
      amount: z.string().optional(),
      supervisor: z.string().optional(),
      image: optionalImage,
    }),
  )
  .handler(async ({ data }) => {
    const { fillProcurementPdf } = await import("@/lib/procurement.server");
    return fillProcurementPdf(data);
  });

export const listPcards = createServerFn({ method: "GET" }).handler(async () => {
  const { listPcardReceipts } = await import("@/lib/pcard.server");
  return listPcardReceipts();
});

export const getPcard = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { getPcardReceipt } = await import("@/lib/pcard.server");
    return getPcardReceipt(data.id);
  });

export const savePcard = createServerFn({ method: "POST" })
  .validator(
    z.object({
      id: z.string().optional(),
      date: z.string().optional(),
      who: z.string().optional(),
      card: z.string().optional(),
      vendor: z.string().optional(),
      description: z.string().optional(),
      coding: z.string().optional(),
      amount: z.string().optional(),
      supervisor: z.string().optional(),
      image: optionalImage,
      thumb: z.string().max(400_000).optional(),
    }),
  )
  .handler(async ({ data }) => {
    const { savePcardReceipt } = await import("@/lib/pcard.server");
    return savePcardReceipt(data);
  });

export const deletePcard = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const { deletePcardReceipt } = await import("@/lib/pcard.server");
    return deletePcardReceipt(data.id);
  });
