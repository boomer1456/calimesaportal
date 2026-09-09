import { getSql } from "@/lib/db";
import { PAR_ITEMS, defaultQty, protocolMin, stationMin, type ParItem, type ParLevel } from "@/lib/par-3303";
import { FACILITY_ITEMS } from "@/lib/par-facilities";
import { assertAdmin } from "@/lib/isa.server";

export type ParHouse = {
  qty: Record<string, number>;
  min: Record<string, number>;
};

type Row = {
  item_id: string;
  qty: number;
  min_qty: number | null;
};

function clamp(n: number) {
  return Math.max(0, Math.min(999, Math.round(n)));
}

function itemById(id: string): ParItem | null {
  return PAR_ITEMS.find((x) => x.id === id) ?? FACILITY_ITEMS.find((x) => x.id === id) ?? null;
}

function mapHouse(rows: Row[]): ParHouse {
  const qty: Record<string, number> = {};
  const min: Record<string, number> = {};
  for (const row of rows) {
    qty[row.item_id] = Number(row.qty);
    if (row.min_qty != null) min[row.item_id] = Number(row.min_qty);
  }
  return { qty, min };
}

export async function readParHouse(): Promise<ParHouse> {
  const sql = await getSql();
  const rows = await sql<Row>`select item_id, qty, min_qty from ems_par_counts`;
  return mapHouse(rows);
}

export async function seedParIfEmpty(input: ParHouse): Promise<ParHouse> {
  const sql = await getSql();
  const count = await sql<{ n: number }>`select count(*)::int as n from ems_par_counts`;
  if ((count[0]?.n ?? 0) > 0) return readParHouse();
  const ids = new Set([...Object.keys(input.qty), ...Object.keys(input.min)]);
  for (const id of ids) {
    if (!itemById(id)) continue;
    const qty = clamp(input.qty[id] ?? defaultQty(itemById(id)!));
    const minQty = input.min[id] != null ? clamp(input.min[id]) : null;
    await sql`
      insert into ems_par_counts (item_id, qty, min_qty)
      values (${id}, ${qty}, ${minQty})
      on conflict (item_id) do nothing
    `;
  }
  return readParHouse();
}

export async function bumpParQty(id: string, delta: number): Promise<ParHouse> {
  const item = itemById(id);
  if (!item) throw new Error("Unknown PAR item.");
  const sql = await getSql();
  const d = Math.round(delta);
  const start = clamp(defaultQty(item) + d);
  await sql`
    insert into ems_par_counts (item_id, qty, min_qty, updated_at)
    values (${id}, ${start}, null, now())
    on conflict (item_id) do update set
      qty = greatest(0, least(999, ems_par_counts.qty + ${d})),
      updated_at = now()
  `;
  return readParHouse();
}

export async function bumpParMin(
  username: string,
  password: string,
  id: string,
  delta: number,
): Promise<ParHouse> {
  assertAdmin(username, password);
  const item = itemById(id);
  if (!item) throw new Error("Unknown PAR item.");
  const sql = await getSql();
  const rows = await sql<Row>`select item_id, qty, min_qty from ems_par_counts where item_id = ${id}`;
  const fallback = stationMin(item, "als") ?? stationMin(item, "bls") ?? 0;
  const current = rows[0]?.min_qty != null ? Number(rows[0].min_qty) : fallback;
  const next = clamp(current + delta);
  const qty = rows[0] ? Number(rows[0].qty) : defaultQty(item);
  await sql`
    insert into ems_par_counts (item_id, qty, min_qty, updated_at)
    values (${id}, ${qty}, ${next}, now())
    on conflict (item_id) do update set min_qty = excluded.min_qty, updated_at = now()
  `;
  return readParHouse();
}

export async function resetParQty(
  username: string,
  password: string,
  level: ParLevel,
): Promise<ParHouse> {
  assertAdmin(username, password);
  const sql = await getSql();
  for (const item of PAR_ITEMS) {
    if (protocolMin(item, level) == null) continue;
    const rows = await sql<Row>`select item_id, qty, min_qty from ems_par_counts where item_id = ${item.id}`;
    const minQty = rows[0]?.min_qty ?? null;
    const next = defaultQty(item);
    await sql`
      insert into ems_par_counts (item_id, qty, min_qty, updated_at)
      values (${item.id}, ${next}, ${minQty}, now())
      on conflict (item_id) do update set qty = excluded.qty, updated_at = now()
    `;
  }
  return readParHouse();
}

export async function resetParMins(
  username: string,
  password: string,
  level: ParLevel,
): Promise<ParHouse> {
  assertAdmin(username, password);
  const sql = await getSql();
  for (const item of PAR_ITEMS) {
    if (protocolMin(item, level) == null) continue;
    await sql`
      update ems_par_counts set min_qty = null, updated_at = now() where item_id = ${item.id}
    `;
  }
  return readParHouse();
}

export async function resetFacilityQty(username: string, password: string): Promise<ParHouse> {
  assertAdmin(username, password);
  const sql = await getSql();
  for (const item of FACILITY_ITEMS) {
    const rows = await sql<Row>`select item_id, qty, min_qty from ems_par_counts where item_id = ${item.id}`;
    const minQty = rows[0]?.min_qty ?? null;
    await sql`
      insert into ems_par_counts (item_id, qty, min_qty, updated_at)
      values (${item.id}, 0, ${minQty}, now())
      on conflict (item_id) do update set qty = 0, updated_at = now()
    `;
  }
  return readParHouse();
}

export async function resetFacilityMins(username: string, password: string): Promise<ParHouse> {
  assertAdmin(username, password);
  const sql = await getSql();
  for (const item of FACILITY_ITEMS) {
    await sql`
      update ems_par_counts set min_qty = null, updated_at = now() where item_id = ${item.id}
    `;
  }
  return readParHouse();
}
