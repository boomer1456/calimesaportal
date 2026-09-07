import { getSql } from "@/lib/db";
import type { PcardRecord, PcardSummary } from "@/lib/pcard";

export type { PcardRecord, PcardSummary };

type Row = {
  id: string;
  purchased_at: string | null;
  who: string;
  card: string;
  vendor: string;
  description: string;
  coding: string;
  amount: string;
  supervisor: string;
  receipt_image: string | null;
  receipt_thumb: string | null;
  updated_at: string;
};

function isoDate(raw: string | null): string {
  if (!raw) return "";
  return String(raw).slice(0, 10);
}

function mapSummary(row: Row): PcardSummary {
  return {
    id: row.id,
    date: isoDate(row.purchased_at),
    who: row.who,
    card: row.card,
    vendor: row.vendor,
    amount: row.amount,
    coding: row.coding,
    thumb: row.receipt_thumb,
    updatedAt: String(row.updated_at),
  };
}

export async function listPcardReceipts(): Promise<PcardSummary[]> {
  const sql = await getSql();
  const rows = await sql<Row>`
    select id, purchased_at, who, card, vendor, description, coding, amount, supervisor,
           null as receipt_image, receipt_thumb, updated_at
    from pcard_receipts
    order by purchased_at desc nulls last, created_at desc
  `;
  return rows.map(mapSummary);
}

export async function getPcardReceipt(id: string): Promise<PcardRecord | null> {
  const sql = await getSql();
  const rows = await sql<Row>`
    select id, purchased_at, who, card, vendor, description, coding, amount, supervisor,
           receipt_image, receipt_thumb, updated_at
    from pcard_receipts
    where id = ${id}
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    ...mapSummary(row),
    description: row.description,
    supervisor: row.supervisor,
    image: row.receipt_image,
  };
}

export async function savePcardReceipt(input: {
  id?: string;
  date?: string;
  who?: string;
  card?: string;
  vendor?: string;
  description?: string;
  coding?: string;
  amount?: string;
  supervisor?: string;
  image?: string;
  thumb?: string;
}): Promise<{ id: string }> {
  const sql = await getSql();
  const id = input.id?.trim() || crypto.randomUUID();
  const date = input.date && /^\d{4}-\d{2}-\d{2}$/.test(input.date) ? input.date : null;
  const who = (input.who ?? "").trim();
  const card = (input.card ?? "").trim();
  const vendor = (input.vendor ?? "").trim();
  const description = (input.description ?? "").trim();
  const coding = (input.coding ?? "").trim();
  const amount = (input.amount ?? "").trim();
  const supervisor = (input.supervisor ?? "").trim();
  const image = input.image && input.image.length > 80 ? input.image : null;
  const thumb = input.thumb && input.thumb.length > 40 ? input.thumb : null;

  try {
    const existing = await sql<{ id: string }>`select id from pcard_receipts where id = ${id}`;
  if (existing[0]) {
    if (image) {
      await sql`
        update pcard_receipts set
          purchased_at = ${date},
          who = ${who},
          card = ${card},
          vendor = ${vendor},
          description = ${description},
          coding = ${coding},
          amount = ${amount},
          supervisor = ${supervisor},
          receipt_image = ${image},
          receipt_thumb = ${thumb},
          updated_at = now()
        where id = ${id}
      `;
    } else {
      await sql`
        update pcard_receipts set
          purchased_at = ${date},
          who = ${who},
          card = ${card},
          vendor = ${vendor},
          description = ${description},
          coding = ${coding},
          amount = ${amount},
          supervisor = ${supervisor},
          updated_at = now()
        where id = ${id}
      `;
    }
  } else {
    await sql`
      insert into pcard_receipts (
        id, purchased_at, who, card, vendor, description, coding, amount, supervisor,
        receipt_image, receipt_thumb
      ) values (
        ${id}, ${date}, ${who}, ${card}, ${vendor}, ${description}, ${coding}, ${amount},
        ${supervisor}, ${image}, ${thumb}
      )
    `;
  }
  return { id };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not save that receipt.";
    throw new Error(message);
  }
}

export async function deletePcardReceipt(id: string): Promise<{ ok: true }> {
  const sql = await getSql();
  const trimmed = id.trim();
  if (!trimmed) throw new Error("Missing receipt.");
  await sql`delete from pcard_receipts where id = ${trimmed}`;
  return { ok: true };
}
