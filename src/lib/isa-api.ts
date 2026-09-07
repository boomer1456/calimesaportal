import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { IsaEntry, IsaFirefighter, IsaMeta } from "@/lib/isa";

const adminFields = {
  username: z.string(),
  password: z.string(),
};

const firefighterSchema = z.object({
  id: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  studentId: z.string().min(1),
  shift: z.enum(["A", "B", "C"]).nullish(),
  active: z.boolean(),
});

const draftSchema = z.object({
  firefighterId: z.string().min(1),
  date: z.string().min(8),
  time: z.string().min(4),
  hours: z.number(),
  assignmentId: z.string().min(1),
  description: z.string().min(1),
});

const entrySchema = z.object({
  id: z.string().min(1),
  batchId: z.string().min(1),
  eventId: z.string().optional(),
  firefighterId: z.string().min(1),
  date: z.string().min(8),
  time: z.string().min(4),
  hours: z.number(),
  assignmentId: z.string().min(1),
  description: z.string(),
  iorPresent: z.boolean(),
});

type House = {
  roster: IsaFirefighter[];
  entries: IsaEntry[];
  meta: IsaMeta;
};

async function gated<T>(
  username: string,
  password: string,
  run: () => Promise<T>,
): Promise<{ ok: true; value: T } | { ok: false; error: string }> {
  const { checkAdmin } = await import("@/lib/isa.server");
  if (!checkAdmin(username, password)) {
    return { ok: false, error: "Wrong username or password." };
  }
  try {
    return { ok: true, value: await run() };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not save.",
    };
  }
}

export const listIsaHouse = createServerFn({ method: "GET" }).handler(async () => {
  const { readIsaHouse } = await import("@/lib/isa.server");
  return readIsaHouse();
});

export const addIsaHouseEntries = createServerFn({ method: "POST" })
  .validator(
    z.object({
      eventId: z.string().optional(),
      iorPresent: z.boolean(),
      drafts: z.array(draftSchema).min(1),
    }),
  )
  .handler(async ({ data }) => {
    const { insertIsaEntries } = await import("@/lib/isa.server");
    return insertIsaEntries(data);
  });

export const importIsaLocal = createServerFn({ method: "POST" })
  .validator(
    z.object({
      entries: z.array(entrySchema),
      roster: z.array(firefighterSchema),
    }),
  )
  .handler(async ({ data }) => {
    const { importLocalEntries } = await import("@/lib/isa.server");
    return importLocalEntries(data.entries as IsaEntry[], data.roster as IsaFirefighter[]);
  });

export const verifyIsaAdmin = createServerFn({ method: "POST" })
  .validator(z.object(adminFields))
  .handler(async ({ data }) => {
    const { checkAdmin } = await import("@/lib/isa.server");
    if (!checkAdmin(data.username, data.password)) {
      return { ok: false as const, error: "Wrong username or password." };
    }
    return { ok: true as const };
  });

export const saveIsaFirefighter = createServerFn({ method: "POST" })
  .validator(z.object({ ...adminFields, firefighter: firefighterSchema }))
  .handler(async ({ data }) => {
    const result = await gated(data.username, data.password, async () => {
      const { writeFirefighter } = await import("@/lib/isa.server");
      return writeFirefighter(data.firefighter as IsaFirefighter);
    });
    if (!result.ok) return result;
    return { ok: true as const, house: result.value };
  });

export const removeIsaFirefighter = createServerFn({ method: "POST" })
  .validator(z.object({ ...adminFields, id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const result = await gated(data.username, data.password, async () => {
      const { deleteFirefighter } = await import("@/lib/isa.server");
      return deleteFirefighter(data.id);
    });
    if (!result.ok) return result;
    return { ok: true as const, house: result.value };
  });

export const removeIsaHouseEntry = createServerFn({ method: "POST" })
  .validator(z.object({ ...adminFields, id: z.string().min(1) }))
  .handler(async ({ data }) => {
    const result = await gated(data.username, data.password, async () => {
      const { deleteIsaEntry } = await import("@/lib/isa.server");
      return deleteIsaEntry(data.id);
    });
    if (!result.ok) return result;
    return { ok: true as const, house: result.value };
  });

export const removeIsaHouseBatch = createServerFn({ method: "POST" })
  .validator(z.object({ ...adminFields, batchId: z.string().min(1) }))
  .handler(async ({ data }) => {
    const result = await gated(data.username, data.password, async () => {
      const { deleteIsaBatch } = await import("@/lib/isa.server");
      return deleteIsaBatch(data.batchId);
    });
    if (!result.ok) return result;
    return { ok: true as const, house: result.value };
  });

export const saveIsaMeta = createServerFn({ method: "POST" })
  .validator(
    z.object({
      ...adminFields,
      meta: z.object({
        college: z.string().min(1),
        agency: z.string().min(1),
        course: z.string().min(1),
        syn: z.string().min(1),
        instructor: z.string().min(1),
        term: z.string().min(1),
        reimbursementStatus: z.string().min(1),
      }),
    }),
  )
  .handler(async ({ data }) => {
    const result = await gated(data.username, data.password, async () => {
      const { writeMeta } = await import("@/lib/isa.server");
      return writeMeta(data.meta as IsaMeta);
    });
    if (!result.ok) return result;
    return { ok: true as const, house: result.value };
  });

export type { House as IsaHouse };
