import { useState } from "react";
import {
  ArrowUp,
  Axe,
  BookOpen,
  Building2,
  Car,
  ClipboardList,
  Disc,
  DoorOpen,
  Droplets,
  ExternalLink,
  Fan,
  Flame,
  Gauge,
  GitBranch,
  HeartPulse,
  Link2,
  Shirt,
  Siren,
  Trees,
  Truck,
  Waves,
  Wind,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useBackLayer } from "@/components/back-stack";
import { SKILLS, SKILL_BY_ID, type Skill, type SkillLinkKind } from "@/lib/skills";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  ladders: Wrench,
  hose: Droplets,
  hydrant: Droplets,
  turnout: Shirt,
  scba: Wind,
  medical: HeartPulse,
  ropes: Link2,
  extrication: Car,
  chainsaw: Axe,
  rotary: Disc,
  forcible: DoorOpen,
  search: Wrench,
  vent: Fan,
  wildland: Trees,
  ics: GitBranch,
  command: BookOpen,
  behavior: Flame,
  construction: Building2,
  start: ClipboardList,
  watchouts: Trees,
  "eng-drive": Siren,
  "eng-spot": Truck,
  "eng-pump": Gauge,
  "eng-supply": Droplets,
  "eng-draft": Waves,
  "eng-aerial": ArrowUp,
};

const KIND_LABEL: Record<SkillLinkKind, string> = {
  standard: "Standard",
  protocol: "REMSA",
  web: "Guide",
  video: "Video",
  manual: "Manual",
};

export function Skills() {
  const [id, setId] = useState<string | null>(null);
  const skill = id ? SKILL_BY_ID[id] : null;
  useBackLayer(Boolean(skill), () => setId(null));

  if (skill) {
    const Icon = ICONS[skill.id] ?? Wrench;
    return (
      <section className="flex flex-col gap-4 pb-6">
        <header className="rounded-lg border border-line bg-navy p-4 text-cream">
          <p className="text-[10px] font-medium tracking-[0.2em] text-cream/70 uppercase">
            {skill.kicker}
          </p>
          <h1 className="mt-1 flex items-center gap-2 font-display text-3xl font-bold leading-none">
            <Icon className="size-7 shrink-0" />
            {skill.title}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-cream/85">{skill.blurb}</p>
          <p className="mt-3 text-xs leading-relaxed text-cream/70">{skill.standard}</p>
        </header>

        <article className="rounded-lg border border-line bg-surface-2 p-4">
          <h2 className="font-display text-xl font-semibold text-navy">
            Tips and best practice
          </h2>
          <p className="mt-1 text-sm text-muted">
            Houses do this differently. CFD SOPs and your officer win. These are reminders,
            not a full skill sheet.
          </p>
          <ul className="mt-3 space-y-2">
            {skill.tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-sm leading-relaxed text-ink">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
                {tip}
              </li>
            ))}
          </ul>
        </article>

        {skill.id === "eng-pump" ? <PumpMath /> : null}

        {skill.gear ? (
          <article className="rounded-lg border border-line bg-navy p-4 text-cream">
            <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
              House gear
            </p>
            <h2 className="mt-1 font-display text-xl font-semibold">{skill.gear.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-cream/85">{skill.gear.blurb}</p>
            <ul className="mt-3 space-y-1.5">
              {skill.gear.specs.map((spec) => (
                <li key={spec} className="flex gap-3 text-sm leading-relaxed text-cream/90">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
                  {spec}
                </li>
              ))}
            </ul>
            <ul className="mt-4 space-y-2">
              {skill.gear.links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-3 rounded-sm bg-navy-2 px-3 py-2"
                  >
                    <span className="shrink-0 rounded-xs bg-cream/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-cream uppercase">
                      {KIND_LABEL[link.kind]}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-snug text-cream">
                      {link.label}
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-cream/70" />
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ) : null}

        <article className="rounded-lg border border-dashed border-line bg-surface p-4">
          <h2 className="font-display text-xl font-semibold text-navy">CFD video</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Company video goes here later. Film this skill the way Calimesa actually does it
            and drop the link in this section.
          </p>
        </article>

        <article className="rounded-lg border border-line bg-surface-2 p-4">
          <h2 className="font-display text-xl font-semibold text-navy">References</h2>
          <ul className="mt-3 space-y-2">
            {skill.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-11 items-center gap-3 rounded-sm border border-line bg-surface px-3 py-2"
                >
                  <span
                    className={cn(
                      "shrink-0 rounded-xs px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase",
                      link.kind === "video" && "bg-ember/15 text-ember",
                      link.kind === "protocol" && "bg-shift-c-bg text-shift-c",
                      link.kind === "standard" && "bg-navy/10 text-navy",
                      link.kind === "web" && "bg-shift-b-bg text-shift-b",
                      link.kind === "manual" && "bg-ember/15 text-ember",
                    )}
                  >
                    {KIND_LABEL[link.kind]}
                  </span>
                  <span className="flex-1 text-sm font-medium leading-snug text-navy">
                    {link.label}
                  </span>
                  <ExternalLink className="size-4 shrink-0 text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </article>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-5 pb-6">
      <p className="text-sm leading-relaxed text-muted">
        Hands-on sheets, then the engineer — in California that is the driver/operator. Drive,
        spot, cache, pump, supply, draft, aerial. Knowledge last. CFD SOGs and your officer still
        win on scene.
      </p>

      <SkillGrid
        kicker="Hands-on"
        title="Manipulative"
        items={SKILLS.filter((s) => !s.group || s.group === "hands")}
        onOpen={setId}
      />
      <SkillGrid
        kicker="Driver / operator"
        title="Engineer"
        items={SKILLS.filter((s) => s.group === "eng")}
        onOpen={setId}
      />
      <SkillGrid
        kicker="Knowledge"
        title="ICS · charts · why"
        items={SKILLS.filter((s) => s.group === "know")}
        onOpen={setId}
      />
    </section>
  );
}

function SkillGrid({
  kicker,
  title,
  items,
  onOpen,
}: {
  kicker: string;
  title: string;
  items: Skill[];
  onOpen: (id: string) => void;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">{kicker}</p>
      <h2 className="font-display text-xl font-semibold text-navy">{title}</h2>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {items.map((skill) => {
          const Icon = ICONS[skill.id] ?? Wrench;
          return (
            <li key={skill.id}>
              <button
                type="button"
                onClick={() => onOpen(skill.id)}
                className="flex h-full min-h-24 w-full flex-col items-start gap-2 rounded-md border border-line bg-surface-2 p-3 text-left"
              >
                <Icon className="size-5 text-ember" />
                <span className="font-display text-lg font-semibold leading-tight text-navy">
                  {skill.title}
                </span>
                <span className="text-xs text-muted">{skill.kicker}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const HOSE = [
  { label: "1½″", c: 24 },
  { label: "1¾″", c: 15.5 },
  { label: "2″", c: 8 },
  { label: "2½″", c: 2 },
  { label: "3″", c: 0.8 },
  { label: "4″", c: 0.2 },
  { label: "5″", c: 0.08 },
] as const;

const PRESETS = [
  { name: "1¾″ 200′ 150 fog", hose: 1, gpm: 150, feet: 200, np: 100, elev: 0, al: 0 },
  { name: "1¾″ 200′ 150 SB", hose: 1, gpm: 150, feet: 200, np: 50, elev: 0, al: 0 },
  { name: "2½″ 300′ 250 SB", hose: 3, gpm: 250, feet: 300, np: 50, elev: 0, al: 0 },
  { name: "5″ 300′ 1,000", hose: 6, gpm: 1000, feet: 300, np: 0, elev: 0, al: 0 },
] as const;

const CHART_FLOWS = [150, 185, 250, 300, 500, 750, 1000];
const CHART_HOSE = [HOSE[1], HOSE[3], HOSE[4], HOSE[5], HOSE[6]];

function PumpMath() {
  const [hose, setHose] = useState(1);
  const [gpm, setGpm] = useState(150);
  const [feet, setFeet] = useState(200);
  const [np, setNp] = useState(100);
  const [elev, setElev] = useState(0);
  const [al, setAl] = useState(0);

  const C = HOSE[hose]?.c ?? 15.5;
  const Q = gpm / 100;
  const L = feet / 100;
  const fl = C * Q * Q * L;
  const ep = 0.5 * elev;
  const pdp = np + fl + al + ep;

  return (
    <>
      <article className="rounded-lg border border-line bg-surface-2 p-4">
        <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
          Coefficient formula
        </p>
        <h2 className="font-display text-xl font-semibold text-navy">Pump calculator</h2>
        <p className="mt-1 text-sm text-muted">
          FL = C × Q² × L. PDP = NP + FL + AL ± EP. CFD’s pump chart on this engine still wins.
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {PRESETS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setHose(p.hose);
                setGpm(p.gpm);
                setFeet(p.feet);
                setNp(p.np);
                setElev(p.elev);
                setAl(p.al);
              }}
              className="min-h-11 rounded-sm border border-line bg-surface px-2.5 text-xs font-medium text-navy"
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">Hose</span>
            <select
              value={hose}
              onChange={(e) => setHose(Number(e.target.value))}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            >
              {HOSE.map((h, i) => (
                <option key={h.label} value={i}>
                  {h.label} · C={h.c}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">Flow gpm</span>
            <input
              type="number"
              min={0}
              step={5}
              value={gpm}
              onChange={(e) => setGpm(Number(e.target.value) || 0)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">Length ft</span>
            <input
              type="number"
              min={0}
              step={50}
              value={feet}
              onChange={(e) => setFeet(Number(e.target.value) || 0)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">Nozzle psi</span>
            <input
              type="number"
              min={0}
              step={5}
              value={np}
              onChange={(e) => setNp(Number(e.target.value) || 0)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">
              Elevation ft
            </span>
            <input
              type="number"
              step={5}
              value={elev}
              onChange={(e) => setElev(Number(e.target.value) || 0)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium tracking-wide text-muted uppercase">
              Appliance psi
            </span>
            <input
              type="number"
              min={0}
              step={5}
              value={al}
              onChange={(e) => setAl(Number(e.target.value) || 0)}
              className="mt-1 h-11 w-full rounded-md border border-line bg-surface px-3 text-sm text-ink"
            />
          </label>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 rounded-md bg-navy p-3 text-cream">
          <div>
            <dt className="text-[10px] tracking-[0.14em] text-cream/70 uppercase">FL</dt>
            <dd className="font-display text-2xl font-bold leading-none">{fl.toFixed(0)}</dd>
            <dd className="mt-1 text-[10px] text-cream/70">psi</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-[0.14em] text-cream/70 uppercase">EP</dt>
            <dd className="font-display text-2xl font-bold leading-none">{ep.toFixed(0)}</dd>
            <dd className="mt-1 text-[10px] text-cream/70">psi</dd>
          </div>
          <div>
            <dt className="text-[10px] tracking-[0.14em] text-cream/70 uppercase">PDP</dt>
            <dd className="font-display text-2xl font-bold leading-none text-cream">{pdp.toFixed(0)}</dd>
            <dd className="mt-1 text-[10px] text-cream/70">psi</dd>
          </div>
        </dl>
        <p className="mt-3 font-mono text-xs leading-relaxed text-muted">
          Q={Q.toFixed(2)} · L={L.toFixed(2)} · C={C}
          <br />
          FL = {C} × {Q.toFixed(2)}² × {L.toFixed(2)} = {fl.toFixed(1)} psi
          <br />
          PDP = {np} + {fl.toFixed(0)} + {al} {ep >= 0 ? "+" : "−"} {Math.abs(ep).toFixed(0)} ={" "}
          {pdp.toFixed(0)} psi
        </p>
      </article>

      <article className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">Friction loss / 100 ft</h2>
        <p className="mt-1 text-sm text-muted">
          Book C values. Multiply by how many hundreds of feet you laid. Dash means that flow is
          outside the usual range for that line.
        </p>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[20rem] text-left text-xs">
            <thead>
              <tr className="border-b border-line text-[10px] tracking-wide text-muted uppercase">
                <th className="py-2 pr-2 font-medium">gpm</th>
                {CHART_HOSE.map((h) => (
                  <th key={h.label} className="px-1 py-2 font-medium">
                    {h.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CHART_FLOWS.map((flow) => (
                <tr key={flow} className="border-b border-line/70">
                  <td className="py-2 pr-2 font-medium text-navy">{flow}</td>
                  {CHART_HOSE.map((h) => {
                    const q = flow / 100;
                    const psi = h.c * q * q;
                    const odd = psi > 80;
                    return (
                      <td
                        key={h.label}
                        className={cn("px-1 py-2 tabular-nums", odd ? "text-subtle" : "text-ink")}
                      >
                        {odd ? "—" : psi < 10 ? psi.toFixed(1) : psi.toFixed(0)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </>
  );
}





