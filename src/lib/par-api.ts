import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const adminFields = {
  username: z.string(),
  password: z.string(),
};

const levelField = z.enum(["bls", "als"]);

export const listParHouse = createServerFn({ method: "GET" }).handler(async () => {
  const { readParHouse } = await import("@/lib/par.server");
  return readParHouse();
});

export const seedParHouse = createServerFn({ method: "POST" })
  .validator(
    z.object({
      qty: z.record(z.string(), z.number()),
      min: z.record(z.string(), z.number()),
    }),
  )
  .handler(async ({ data }) => {
    const { seedParIfEmpty } = await import("@/lib/par.server");
    return seedParIfEmpty(data);
  });

export const bumpParQty = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().min(1), delta: z.number().int().min(-20).max(20) }))
  .handler(async ({ data }) => {
    const { bumpParQty: bump } = await import("@/lib/par.server");
    return bump(data.id, data.delta);
  });

export const bumpParMin = createServerFn({ method: "POST" })
  .validator(z.object({ ...adminFields, id: z.string().min(1), delta: z.number().int().min(-20).max(20) }))
  .handler(async ({ data }) => {
    try {
      const { bumpParMin: bump } = await import("@/lib/par.server");
      return { ok: true as const, house: await bump(data.username, data.password, data.id, data.delta) };
    } catch (err) {
      const { IsaAdminError } = await import("@/lib/isa.server");
      if (err instanceof IsaAdminError) return { ok: false as const, error: err.message };
      throw err;
    }
  });

export const resetParQty = createServerFn({ method: "POST" })
  .validator(z.object({ ...adminFields, level: levelField }))
  .handler(async ({ data }) => {
    try {
      const { resetParQty: reset } = await import("@/lib/par.server");
      return { ok: true as const, house: await reset(data.username, data.password, data.level) };
    } catch (err) {
      const { IsaAdminError } = await import("@/lib/isa.server");
      if (err instanceof IsaAdminError) return { ok: false as const, error: err.message };
      throw err;
    }
  });

export const resetParMins = createServerFn({ method: "POST" })
  .validator(z.object({ ...adminFields, level: levelField }))
  .handler(async ({ data }) => {
    try {
      const { resetParMins: reset } = await import("@/lib/par.server");
      return { ok: true as const, house: await reset(data.username, data.password, data.level) };
    } catch (err) {
      const { IsaAdminError } = await import("@/lib/isa.server");
      if (err instanceof IsaAdminError) return { ok: false as const, error: err.message };
      throw err;
    }
  });

export const resetFacilityQty = createServerFn({ method: "POST" })
  .validator(z.object(adminFields))
  .handler(async ({ data }) => {
    try {
      const { resetFacilityQty: reset } = await import("@/lib/par.server");
      return { ok: true as const, house: await reset(data.username, data.password) };
    } catch (err) {
      const { IsaAdminError } = await import("@/lib/isa.server");
      if (err instanceof IsaAdminError) return { ok: false as const, error: err.message };
      throw err;
    }
  });

export const resetFacilityMins = createServerFn({ method: "POST" })
  .validator(z.object(adminFields))
  .handler(async ({ data }) => {
    try {
      const { resetFacilityMins: reset } = await import("@/lib/par.server");
      return { ok: true as const, house: await reset(data.username, data.password) };
    } catch (err) {
      const { IsaAdminError } = await import("@/lib/isa.server");
      if (err instanceof IsaAdminError) return { ok: false as const, error: err.message };
      throw err;
    }
  });
