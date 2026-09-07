import { getSql } from "@/lib/db";
import {
  DEFAULT_ISA_META,
  SEED_ROSTER,
  issuesForBatch,
  type IsaEntry,
  type IsaFirefighter,
  type IsaMeta,
} from "@/lib/isa";

const META_ID = "house";

export class IsaAdminError extends Error {
  constructor(message = "Wrong username or password.") {
    super(message);
    this.name = "IsaAdminError";
  }
}

export function checkAdmin(username: string, password: string): boolean {
  return username.trim() === "admin" && password === "admin";
}

export function assertAdmin(username: string, password: string) {
  if (!checkAdmin(username, password)) {
    throw new IsaAdminError();
  }
}

type RosterRow = {
  id: string;
  first_name: string;
  last_name: string;
  student_id: string;
  shift: string | null;
  active: boolean;
};

type EntryRow = {
  id: string;
  batch_id: string;
  event_id: string | null;
  firefighter_id: string;
  work_date: string;
  start_time: string;
  hours: number | string;
  assignment_id: string;
  description: string;
  ior_present: boolean;
};

type MetaRow = {
  college: string;
  agency: string;
  course: string;
  syn: string;
  instructor: string;
  term: string;
  reimbursement_status: string;
};

function mapRoster(row: RosterRow): IsaFirefighter {
  const shift = row.shift === "A" || row.shift === "B" || row.shift === "C" ? row.shift : undefined;
  return {
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    studentId: row.student_id,
    shift,
    active: Boolean(row.active),
  };
}

function mapEntry(row: EntryRow): IsaEntry {
  return {
    id: row.id,
    batchId: row.batch_id,
    eventId: row.event_id ?? undefined,
    firefighterId: row.firefighter_id,
    date: String(row.work_date).slice(0, 10),
    time: row.start_time,
    hours: Number(row.hours),
    assignmentId: row.assignment_id,
    description: row.description,
    iorPresent: Boolean(row.ior_present),
  };
}

function mapMeta(row: MetaRow): IsaMeta {
  return {
    college: row.college,
    agency: row.agency,
    course: row.course,
    syn: row.syn,
    instructor: row.instructor,
    term: row.term,
    reimbursementStatus: row.reimbursement_status,
  };
}

async function seedIfEmpty() {
  const sql = await getSql();
  const existing = await sql<{ n: number }>`select count(*)::int as n from isa_roster`;
  if (!existing[0]?.n) {
    for (const ff of SEED_ROSTER) {
      await sql`
        insert into isa_roster (id, first_name, last_name, student_id, shift, active)
        values (${ff.id}, ${ff.firstName}, ${ff.lastName}, ${ff.studentId}, ${ff.shift ?? null}, ${ff.active})
      `;
    }
  }
  const meta = await sql<{ n: number }>`select count(*)::int as n from isa_meta`;
  if (!meta[0]?.n) {
    const m = DEFAULT_ISA_META;
    await sql`
      insert into isa_meta (id, college, agency, course, syn, instructor, term, reimbursement_status)
      values (${META_ID}, ${m.college}, ${m.agency}, ${m.course}, ${m.syn}, ${m.instructor}, ${m.term}, ${m.reimbursementStatus})
    `;
  }
}

export async function readIsaHouse(): Promise<{
  roster: IsaFirefighter[];
  entries: IsaEntry[];
  meta: IsaMeta;
}> {
  await seedIfEmpty();
  const sql = await getSql();
  const rosterRows = await sql<RosterRow>`
    select id, first_name, last_name, student_id, shift, active
    from isa_roster
    order by last_name, first_name
  `;
  const entryRows = await sql<EntryRow>`
    select id, batch_id, event_id, firefighter_id, work_date, start_time, hours, assignment_id, description, ior_present
    from isa_entries
    order by work_date, start_time
  `;
  const metaRows = await sql<MetaRow>`
    select college, agency, course, syn, instructor, term, reimbursement_status
    from isa_meta
    where id = ${META_ID}
  `;
  return {
    roster: rosterRows.map(mapRoster),
    entries: entryRows.map(mapEntry),
    meta: metaRows[0] ? mapMeta(metaRows[0]) : DEFAULT_ISA_META,
  };
}

export async function insertIsaEntries(input: {
  eventId?: string;
  iorPresent: boolean;
  drafts: Array<{
    firefighterId: string;
    date: string;
    time: string;
    hours: number;
    assignmentId: string;
    description: string;
  }>;
}) {
  const house = await readIsaHouse();
  const issues = issuesForBatch(input.drafts, house.entries, house.roster, input.iorPresent);
  const block = issues.find((i) => i.level === "block");
  if (block) {
    return { ok: false as const, error: block.message, house };
  }
  const sql = await getSql();
  const batchId = crypto.randomUUID();
  for (const d of input.drafts) {
    const id = crypto.randomUUID();
    await sql`
      insert into isa_entries (
        id, batch_id, event_id, firefighter_id, work_date, start_time, hours, assignment_id, description, ior_present
      ) values (
        ${id}, ${batchId}, ${input.eventId ?? null}, ${d.firefighterId}, ${d.date}::date, ${d.time}, ${d.hours},
        ${d.assignmentId}, ${d.description.trim()}, ${input.iorPresent}
      )
    `;
  }
  return { ok: true as const, batchId, house: await readIsaHouse() };
}

export async function importLocalEntries(entries: IsaEntry[], extraRoster: IsaFirefighter[]) {
  const house = await readIsaHouse();
  if (house.entries.length) return house;
  const sql = await getSql();
  const have = new Set(house.roster.map((f) => f.id));
  for (const ff of extraRoster) {
    if (have.has(ff.id)) continue;
    await sql`
      insert into isa_roster (id, first_name, last_name, student_id, shift, active)
      values (${ff.id}, ${ff.firstName}, ${ff.lastName}, ${ff.studentId}, ${ff.shift ?? null}, ${ff.active})
      on conflict (id) do nothing
    `;
    have.add(ff.id);
  }
  for (const e of entries) {
    if (!have.has(e.firefighterId)) continue;
    await sql`
      insert into isa_entries (
        id, batch_id, event_id, firefighter_id, work_date, start_time, hours, assignment_id, description, ior_present
      ) values (
        ${e.id}, ${e.batchId}, ${e.eventId ?? null}, ${e.firefighterId}, ${e.date}::date, ${e.time}, ${e.hours},
        ${e.assignmentId}, ${e.description}, ${e.iorPresent}
      )
      on conflict (id) do nothing
    `;
  }
  return readIsaHouse();
}

export async function deleteIsaEntry(id: string) {
  const sql = await getSql();
  await sql`delete from isa_entries where id = ${id}`;
  return readIsaHouse();
}

export async function deleteIsaBatch(batchId: string) {
  const sql = await getSql();
  await sql`delete from isa_entries where batch_id = ${batchId}`;
  return readIsaHouse();
}

export async function writeFirefighter(ff: IsaFirefighter) {
  const sql = await getSql();
  await sql`
    insert into isa_roster (id, first_name, last_name, student_id, shift, active)
    values (${ff.id}, ${ff.firstName.trim()}, ${ff.lastName.trim()}, ${ff.studentId.trim()}, ${ff.shift ?? null}, ${ff.active})
    on conflict (id) do update set
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      student_id = excluded.student_id,
      shift = excluded.shift,
      active = excluded.active
  `;
  return readIsaHouse();
}

export async function deleteFirefighter(id: string) {
  const sql = await getSql();
  const used = await sql<{ n: number }>`
    select count(*)::int as n from isa_entries where firefighter_id = ${id}
  `;
  if (used[0]?.n) {
    throw new Error("That member already has ISA hours. Hide them instead of deleting.");
  }
  await sql`delete from isa_roster where id = ${id}`;
  return readIsaHouse();
}

export async function writeMeta(meta: IsaMeta) {
  const sql = await getSql();
  await sql`
    update isa_meta set
      college = ${meta.college},
      agency = ${meta.agency},
      course = ${meta.course},
      syn = ${meta.syn},
      instructor = ${meta.instructor},
      term = ${meta.term},
      reimbursement_status = ${meta.reimbursementStatus}
    where id = ${META_ID}
  `;
  return readIsaHouse();
}
