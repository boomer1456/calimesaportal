import { useMemo, useState } from "react";
import {
  Activity,
  ExternalLink,
  HeartPulse,
  Search,
  Syringe,
  Table2,
} from "lucide-react";
import { SKILL_BY_ID } from "@/lib/skills";
import {
  HOSPITALS,
  REMSA_8101,
  SPECIALTY_LABEL,
  chipsFor,
  telHref,
} from "@/lib/hospitals";
import {
  ARREST_CARDS,
  ASSESS_STEPS,
  COLOR_BANDS,
  DRUG_INDEX,
  MATH_DRUGS,
  REMSA_APP,
  REMSA_DRUG_INDEX,
  REMSA_EDU,
  REMSA_EQUIPMENT,
  REMSA_HOME,
  REMSA_MANUAL,
  REMSA_WEIGHT,
  bandForKg,
  kgFrom,
  lbFromKg,
  searchProtocols,
  type ArrestRhythm,
} from "@/lib/remsa";
import { cn } from "@/lib/utils";

type Pane = "assess" | "protocols" | "rheart" | "math";

const PANES: { id: Pane; label: string }[] = [
  { id: "assess", label: "Assess" },
  { id: "protocols", label: "Protocols" },
  { id: "rheart", label: "RHeart" },
  { id: "math", label: "Math" },
];

export function Remsa() {
  const [pane, setPane] = useState<Pane>("protocols");

  return (
    <section className="flex flex-col gap-4 pb-6">
      <p className="text-sm leading-relaxed text-muted">
        July 2026 protocols. CFD SOPs and the live PDF win. This phone is a lookup, not a
        standing order.
      </p>

      <div className="flex gap-1">
        {PANES.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setPane(item.id)}
            className={cn(
              "h-10 flex-1 rounded-sm px-1 text-[11px] font-semibold whitespace-nowrap",
              pane === item.id ? "bg-navy text-cream" : "bg-surface-2 text-muted",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      {pane === "assess" ? (
        <AssessPane />
      ) : pane === "protocols" ? (
        <ProtocolPane />
      ) : pane === "rheart" ? (
        <RheartPane />
      ) : (
        <MathPane />
      )}
    </section>
  );
}

function AssessPane() {
  const skill = SKILL_BY_ID.medical;
  return (
    <div className="flex flex-col gap-4">
      <article className="rounded-lg border border-line bg-navy p-4 text-cream">
        <p className="text-[10px] font-medium tracking-[0.2em] text-cream/70 uppercase">
          {skill.kicker}
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold">{skill.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-cream/85">{skill.blurb}</p>
        <p className="mt-3 text-xs leading-relaxed text-cream/70">{skill.standard}</p>
      </article>

      <article className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">4101 — every patient</h2>
        <ul className="mt-3 space-y-2">
          {ASSESS_STEPS.map((step) => (
            <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
              {step}
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">Company reminders</h2>
        <ul className="mt-3 space-y-2">
          {skill.tips.map((tip) => (
            <li key={tip} className="flex gap-3 text-sm leading-relaxed text-ink">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-navy" />
              {tip}
            </li>
          ))}
        </ul>
      </article>

      <LinkStack
        links={[
          { label: "REMSA home", href: REMSA_HOME },
          { label: "Policy & protocol manual", href: REMSA_MANUAL },
          { label: "REMSA mobile app", href: REMSA_APP },
          { label: "Education / protocol updates", href: REMSA_EDU },
          ...skill.links.map((l) => ({ label: l.label, href: l.href })),
        ]}
      />
    </div>
  );
}

function ProtocolPane() {
  const [query, setQuery] = useState("");
  const groups = useMemo(() => searchProtocols(query), [query]);

  return (
    <div className="flex flex-col gap-4">
      <HospitalQuickList />
      <div className="grid grid-cols-2 gap-2">
        <QuickLink href={REMSA_MANUAL} label="Full manual" />
        <QuickLink href={REMSA_APP} label="REMSA app" />
        <QuickLink href={REMSA_DRUG_INDEX} label="4105 Drug Index" />
        <QuickLink href={REMSA_EQUIPMENT} label="3303 Drug / tape" />
      </div>

      <label className="flex h-11 items-center gap-2 rounded-sm border border-line bg-surface-2 px-3">
        <Search className="size-4 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 4101, stroke, arrest…"
          className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-subtle focus:outline-none"
        />
      </label>

      {groups.length === 0 ? (
        <p className="rounded-lg border border-line bg-surface-2 p-4 text-sm text-muted">
          Nothing matches. Try a number (4405) or a word (stroke).
        </p>
      ) : (
        groups.map((group) => (
          <article key={group.id}>
            <p className="mb-1.5 text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
              {group.label}
            </p>
            <ul className="flex flex-col gap-1.5">
              {group.items.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex min-h-11 items-center gap-3 rounded-sm border border-line bg-surface-2 px-3 py-2"
                  >
                    <span className="w-10 shrink-0 font-display text-lg font-bold tabular-nums text-ember">
                      {item.id}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold leading-snug text-navy">
                        {item.title}
                      </span>
                      {item.blurb ? (
                        <span className="block text-xs text-muted">{item.blurb}</span>
                      ) : null}
                    </span>
                    <ExternalLink className="size-4 shrink-0 text-muted" />
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))
      )}

      <article className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">4105 ALS Drug Index</h2>
        <p className="mt-1 text-sm text-muted">Opens the live PDF. Single-dose rules live there.</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {DRUG_INDEX.map((name) => (
            <a
              key={name}
              href={REMSA_DRUG_INDEX}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm bg-navy/10 px-2 py-1 text-xs font-semibold text-navy"
            >
              {name}
            </a>
          ))}
        </div>
      </article>
    </div>
  );
}

function RheartPane() {
  const [age, setAge] = useState<"adult" | "peds">("adult");
  const [rhythm, setRhythm] = useState<ArrestRhythm>("vf");
  const card = ARREST_CARDS.find((c) => c.id === rhythm) ?? ARREST_CARDS[0];
  const rows = age === "adult" ? card.adult : card.peds;

  return (
    <div className="flex flex-col gap-4">
      <article className="rounded-lg border border-line bg-navy p-4 text-cream">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
          Station arrest card
        </p>
        <h2 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold">
          <HeartPulse className="size-6" />
          RHeart
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-cream/85">
          Numbers are REMSA 4405 / 4903 (July 2026) laid out the way the arrest card is used —
          by rhythm, then epi, bicarb, and shocks. If your laminated RHeart differs, the PDF
          and the officer win.
        </p>
      </article>

      <div className="flex gap-1">
        {(
          [
            ["adult", "Adult 4405"],
            ["peds", "Peds 4903"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setAge(id)}
            className={cn(
              "h-10 flex-1 rounded-sm text-sm font-semibold",
              age === id ? "bg-ember text-cream" : "bg-surface-2 text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex gap-1">
        {ARREST_CARDS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setRhythm(item.id)}
            className={cn(
              "h-11 flex-1 rounded-sm px-1 text-xs font-semibold leading-tight",
              rhythm === item.id ? "bg-navy text-cream" : "bg-surface-2 text-muted",
            )}
          >
            {item.title}
          </button>
        ))}
      </div>

      <article className="overflow-hidden rounded-lg border border-line bg-surface-2">
        <div className="flex items-center justify-between bg-navy px-4 py-3 text-cream">
          <div>
            <p className="text-[10px] font-medium tracking-[0.16em] text-cream/70 uppercase">
              {card.kicker} · {age === "adult" ? "Adult" : "Pediatric"}
            </p>
            <h3 className="font-display text-2xl font-bold leading-none">{card.title}</h3>
          </div>
          <Activity className="size-6 text-cream/70" />
        </div>
        <ul className="divide-y divide-line">
          {rows.map((row) => (
            <li key={row.label} className="px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-xs font-bold tracking-wide text-ember uppercase">
                  {row.label}
                </span>
                <span className="text-right font-display text-xl font-bold leading-none text-navy">
                  {row.value}
                </span>
              </div>
              {row.note ? <p className="mt-1.5 text-xs leading-relaxed text-muted">{row.note}</p> : null}
            </li>
          ))}
        </ul>
      </article>

      <p className="text-xs leading-relaxed text-muted">
        HP-CPR / pit crew, EtCO₂, and airway rules live in the PDF. Adult TOR: 20 min HP-CPR, access,
        airway, meds, asystole/agonal, never had a pulse, not refractory VF/VT. Peds TOR is a base
        hospital physician order.
      </p>

      <div className="grid grid-cols-2 gap-2">
        <QuickLink
          href="https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11/4405%20-%20Adult%20Medical%20Cardiac%20Arrest.pdf"
          label="Open 4405 PDF"
        />
        <QuickLink
          href="https://rivcoready.org/sites/g/files/aldnop181/files/PolicyManual/2026/Aug11/4903%20-%20Pediatric%20Medical%20Cardiac%20Arrest.pdf"
          label="Open 4903 PDF"
        />
      </div>
    </div>
  );
}

function MathPane() {
  const [unit, setUnit] = useState<"kg" | "lb">("kg");
  const [raw, setRaw] = useState("16");
  const [who, setWho] = useState<"adult" | "peds">("peds");
  const parsed = Number(raw);
  const kg = kgFrom(parsed, unit);
  const band = who === "peds" ? bandForKg(kg) : null;
  const ready = kg > 0;

  return (
    <div className="flex flex-col gap-4">
      <article className="rounded-lg border border-line bg-navy p-4 text-cream">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
          4103 + 4105
        </p>
        <h2 className="mt-1 flex items-center gap-2 font-display text-2xl font-semibold">
          <Syringe className="size-6" />
          Med math
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-cream/85">
          Enter a weight. Pediatric doses use the kg you typed. Adult standing doses are listed
          beside them. Confirm concentration on the vial.
        </p>
      </article>

      <div className="flex gap-1">
        {(
          [
            ["peds", "Pediatric"],
            ["adult", "Adult"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setWho(id)}
            className={cn(
              "h-10 flex-1 rounded-sm text-sm font-semibold",
              who === id ? "bg-navy text-cream" : "bg-surface-2 text-muted",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="rounded-lg border border-line bg-surface-2 p-4">
        <div className="flex gap-2">
          <label className="flex-1">
            <span className="text-xs font-semibold text-navy">Weight</span>
            <input
              inputMode="decimal"
              value={raw}
              onChange={(e) => setRaw(e.target.value.replace(/[^\d.]/g, ""))}
              className="mt-1 h-12 w-full rounded-sm border border-line bg-surface px-3 font-display text-2xl font-bold tabular-nums text-navy focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            />
          </label>
          <div className="flex w-24 flex-col">
            <span className="text-xs font-semibold text-navy">Unit</span>
            <div className="mt-1 flex flex-1 overflow-hidden rounded-sm border border-line">
              {(
                [
                  ["kg", "kg"],
                  ["lb", "lb"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setUnit(id)}
                  className={cn(
                    "flex-1 text-sm font-semibold",
                    unit === id ? "bg-navy text-cream" : "bg-surface text-muted",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {ready ? (
          <p className="mt-3 text-sm text-ink">
            <span className="font-semibold tabular-nums">{n(kg, 1)} kg</span>
            {" · "}
            <span className="tabular-nums">{n(lbFromKg(kg), 0)} lb</span>
            {who === "peds" && kg > 36 ? (
              <span className="text-ember"> · over the tape — confirm adult vs peds</span>
            ) : null}
          </p>
        ) : (
          <p className="mt-3 text-sm text-muted">Type a weight.</p>
        )}
        {band ? (
          <p
            className="mt-3 inline-flex items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm font-semibold"
            style={{ background: band.hex, color: band.ink }}
          >
            {band.name} tape · {band.kgMin}–{band.kgMax} kg · {band.lbLabel}
          </p>
        ) : who === "peds" && ready ? (
          <p className="mt-3 text-sm text-muted">No 4103 color for this kg. Use the calculated mg/kg.</p>
        ) : null}
      </div>

      <div>
        <p className="mb-1.5 text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
          Length-tape colors
        </p>
        <div className="flex flex-wrap gap-1">
          {COLOR_BANDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                setWho("peds");
                setUnit("kg");
                setRaw(String(((b.kgMin + b.kgMax) / 2).toFixed(0)));
              }}
              className="rounded-sm px-2 py-1 text-[11px] font-semibold"
              style={{ background: b.hex, color: b.ink }}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {ready ? (
        <div className="overflow-hidden rounded-lg border border-line bg-surface-2">
          <div className="flex items-center gap-2 bg-navy px-4 py-2 text-cream">
            <Table2 className="size-4" />
            <p className="font-display text-lg font-semibold">
              {who === "adult" ? "Adult standing" : `${n(kg, 1)} kg calculated`}
            </p>
          </div>
          <ul className="divide-y divide-line">
            {MATH_DRUGS.map((drug) => {
              const out = drug.calc(kg);
              return (
                <li key={drug.id} className="px-4 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-navy">{drug.name}</p>
                      <p className="text-[11px] text-muted">{drug.conc}</p>
                    </div>
                    <div className="text-right">
                      {who === "adult" && drug.adultFixed ? (
                        <p className="font-display text-lg font-bold leading-tight text-navy">
                          {drug.adultFixed}
                        </p>
                      ) : (
                        <>
                          <p className="font-display text-lg font-bold leading-none text-navy">
                            {out.dose}
                          </p>
                          <p className="mt-0.5 text-sm font-semibold tabular-nums text-ember">
                            {out.volume}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{out.note}</p>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <QuickLink href={REMSA_WEIGHT} label="4103 weight matrix" />
        <QuickLink href={REMSA_DRUG_INDEX} label="4105 drug index" />
      </div>
    </div>
  );
}

function n(value: number, digits: number) {
  return Number(value.toFixed(digits)).toString();
}

function HospitalQuickList() {
  return (
    <article className="rounded-lg border border-line bg-surface-2 p-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-xl font-semibold text-navy">Hospitals</h2>
        <a
          href={REMSA_8101}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-semibold text-muted"
        >
          8101 PDF
        </a>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted">
        Pass destinations plus every REMSA base hospital. Six bases are marked
        Base.
      </p>
      <ul className="mt-1 divide-y divide-line">
        {HOSPITALS.map((hospital) => (
          <li key={hospital.id} className="py-2">
            <div className="flex items-start gap-2">
              <span className="w-10 shrink-0 font-display text-base font-bold tabular-nums text-ember">
                {hospital.code}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold leading-snug text-navy">
                  {hospital.name}
                </span>
                <span className="mt-0.5 flex flex-wrap gap-1">
                  {chipsFor(hospital).map((spec) => (
                    <span
                      key={spec}
                      className={
                        spec === "burn" || spec.startsWith("trauma")
                          ? "rounded-sm bg-ember/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-ember uppercase"
                          : "rounded-sm bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-navy uppercase"
                      }
                    >
                      {SPECIALTY_LABEL[spec]}
                    </span>
                  ))}
                </span>
                <p className="mt-1 text-[11px] leading-relaxed text-muted">
                  {hospital.recordedLine ? (
                    <>
                      Rec{" "}
                      <a
                        href={telHref(hospital.recordedLine)}
                        className="font-semibold text-ember underline-offset-2 hover:underline"
                      >
                        {hospital.recordedLine}
                      </a>
                    </>
                  ) : (
                    "Rec ICEMA"
                  )}
                  {" · "}
                  {hospital.radioRoom ? `Radio ${hospital.radioRoom}` : hospital.radioNote}
                  {hospital.bh ? " · Base" : null}
                </p>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </article>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 items-center justify-center gap-2 rounded-sm bg-navy px-3 text-center text-sm font-semibold text-cream"
    >
      {label}
      <ExternalLink className="size-3.5 shrink-0" />
    </a>
  );
}

function LinkStack({ links }: { links: { label: string; href: string }[] }) {
  const seen = new Set<string>();
  const unique = links.filter((l) => {
    if (seen.has(l.href)) return false;
    seen.add(l.href);
    return true;
  });
  return (
    <ul className="flex flex-col gap-2">
      {unique.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-h-11 items-center gap-3 rounded-sm border border-line bg-surface-2 px-3 py-2"
          >
            <span className="flex-1 text-sm font-medium leading-snug text-navy">{link.label}</span>
            <ExternalLink className="size-4 shrink-0 text-muted" />
          </a>
        </li>
      ))}
    </ul>
  );
}


