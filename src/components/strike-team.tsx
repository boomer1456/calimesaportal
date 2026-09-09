import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ClipboardList,
  CreditCard,
  ExternalLink,
  FileText,
  Receipt,
  ShieldAlert,
  Siren,
  Wallet,
} from "lucide-react";
import { useBackLayer } from "@/components/back-stack";
import { useTrainingStore } from "@/lib/store";
import {
  ADMIN_RATE,
  APPARATUS_RATES,
  FUEL_NOTES,
  HOUSE_RULES,
  ICS_FORMS,
  LODGING_RATE,
  MARS_STEPS,
  MEAL_NOTES,
  MEAL_RATES,
  PCARD_STEPS,
  PERSONNEL_BASE,
  POV_MILE,
  QUICK_START,
  STRIKE_LINKS,
  STRIKE_RATES_AS_OF,
  SUPPORT_DAILY,
  type StrikeStep,
} from "@/lib/strike-team";

const SECTIONS = [
  {
    id: "start",
    label: "Before you roll",
    hint: "Order number, 96 hours, formation",
    icon: Siren,
  },
  {
    id: "rules",
    label: "Unwritten rules",
    hint: "What actually gets a crew sent home",
    icon: ShieldAlert,
  },
  {
    id: "mars",
    label: "MARS / pay",
    hint: "F-42, survey, how the invoice lives",
    icon: Receipt,
  },
  {
    id: "rates",
    label: "2026 rates",
    hint: "Meals, lodging, engines, fuel",
    icon: Wallet,
  },
  {
    id: "pcard",
    label: "P-card",
    hint: "Receipts, coding, what not to buy",
    icon: CreditCard,
  },
  {
    id: "forms",
    label: "ICS forms",
    hint: "Fillable 201–221. 214 in your pocket",
    icon: FileText,
  },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

export function StrikeTeam() {
  const [id, setId] = useState<SectionId | null>(null);
  useBackLayer(Boolean(id), () => setId(null));

  if (!id) {
    return (
      <section className="flex flex-col gap-4 pb-6">
        <p className="text-sm leading-relaxed text-muted">
          Pocket brief. STL, the radio, and CFD policy still win.
        </p>
        <ul className="grid grid-cols-1 gap-2">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setId(s.id)}
                  className="flex min-h-11 w-full items-center gap-3 rounded-md border border-line bg-surface-2 px-3 py-3 text-left"
                >
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-navy text-cream">
                    <Icon className="size-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg font-semibold leading-tight text-navy">
                      {s.label}
                    </span>
                    <span className="mt-0.5 block text-xs leading-snug text-muted">{s.hint}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 pb-6">
      {id === "start" ? (
        <StepList
          kicker="Quick start"
          title="Before you roll"
          steps={QUICK_START}
        />
      ) : null}
      {id === "rules" ? (
        <StepList
          kicker="Code of conduct"
          title="Unwritten rules"
          steps={HOUSE_RULES}
        />
      ) : null}
      {id === "mars" ? <MarsPane /> : null}
      {id === "rates" ? <RatesPane /> : null}
      {id === "pcard" ? <PcardPane /> : null}
      {id === "forms" ? <FormsPane /> : null}
    </section>
  );
}

function StepList({
  kicker,
  title,
  steps,
}: {
  kicker: string;
  title: string;
  steps: readonly StrikeStep[];
}) {
  return (
    <article className="rounded-lg border border-line bg-surface-2 p-4">
      <p className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">{kicker}</p>
      <h2 className="mt-1 font-display text-2xl font-semibold text-navy">{title}</h2>
      <ol className="mt-4 space-y-3">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm bg-navy font-display text-sm font-bold text-cream tabular-nums">
              {i + 1}
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-semibold text-navy">{step.title}</span>
              <span className="mt-0.5 block text-sm leading-relaxed text-ink">{step.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function MarsPane() {
  return (
    <div className="flex flex-col gap-3">
      <StepList kicker="CFAA" title="How MARS pays you" steps={MARS_STEPS} />
      <article className="rounded-lg bg-navy p-4 text-cream">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">Official</p>
        <ul className="mt-3 space-y-2">
          {STRIKE_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-sm bg-navy-2 px-3 py-2"
              >
                <span className="flex-1 text-sm font-medium leading-snug text-cream">{link.label}</span>
                <ExternalLink className="size-4 shrink-0 text-cream/70" />
              </a>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}

function RatesPane() {
  return (
    <div className="flex flex-col gap-3">
      <article className="rounded-lg bg-navy p-4 text-cream shadow-panel">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
          CFAA · {STRIKE_RATES_AS_OF}
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold">Meals & lodging</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          {MEAL_RATES.map((r) => (
            <p key={r.id} className="flex justify-between gap-2 rounded-sm bg-navy-2 px-2.5 py-2">
              <span className="text-cream/80">{r.label}</span>
              <span className="font-semibold tabular-nums">{r.amount}</span>
            </p>
          ))}
          <p className="flex justify-between gap-2 rounded-sm bg-navy-2 px-2.5 py-2">
            <span className="text-cream/80">Lodging / night</span>
            <span className="font-semibold tabular-nums">{LODGING_RATE.night}</span>
          </p>
          <p className="flex justify-between gap-2 rounded-sm bg-navy-2 px-2.5 py-2">
            <span className="text-cream/80">Ceiling</span>
            <span className="font-semibold tabular-nums">{LODGING_RATE.ceiling}</span>
          </p>
          <p className="flex justify-between gap-2 rounded-sm bg-navy-2 px-2.5 py-2">
            <span className="text-cream/80">POV / mile</span>
            <span className="font-semibold tabular-nums">{POV_MILE}</span>
          </p>
          <p className="flex justify-between gap-2 rounded-sm bg-navy-2 px-2.5 py-2">
            <span className="text-cream/80">Admin</span>
            <span className="font-semibold tabular-nums">{ADMIN_RATE}</span>
          </p>
        </div>
        <p className="mt-3 text-xs leading-relaxed text-cream/75">
          Full meal day $78 if you buy all three plus incidentals. Camp food = don’t also claim it.
          Lodging over $151 needs paper, up to 150%.
        </p>
      </article>

      <Fold title="Apparatus (hourly)" hint="16-hour max per 24 from dispatch. Fuel is inside this number.">
        <ul className="divide-y divide-line text-sm">
          {APPARATUS_RATES.map((r) => (
            <li key={r.type} className="flex justify-between gap-3 py-2">
              <span className="text-ink">{r.type}</span>
              <span className="font-semibold tabular-nums text-navy">{r.hourly}/hr</span>
            </li>
          ))}
        </ul>
      </Fold>

      <Fold title="Support GOV (daily)" hint="Chase / STL pickup.">
        <ul className="divide-y divide-line text-sm">
          {SUPPORT_DAILY.map((r) => (
            <li key={r.type} className="flex justify-between gap-3 py-2">
              <span className="text-ink">{r.type}</span>
              <span className="font-semibold tabular-nums text-navy">{r.daily}/day</span>
            </li>
          ))}
        </ul>
      </Fold>

      <Fold title="Personnel (no survey on file)" hint="Calimesa’s signed MARS survey wins.">
        <ul className="space-y-2 text-sm">
          {PERSONNEL_BASE.map((r) => (
            <li key={r.who} className="rounded-sm bg-surface px-3 py-2">
              <p className="text-ink">{r.who}</p>
              <p className="mt-1 tabular-nums text-navy">
                ST {r.st}/hr · OT {r.ot}/hr
              </p>
            </li>
          ))}
        </ul>
      </Fold>

      <StepList kicker="Don’t double-dip" title="Fuel" steps={FUEL_NOTES} />
      <StepList kicker="Receipts" title="Meals and rooms" steps={MEAL_NOTES} />
    </div>
  );
}

function PcardPane() {
  const openPcard = useTrainingStore((s) => s.openPcard);
  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => openPcard()}
        className="flex min-h-11 items-center gap-3 rounded-md bg-navy px-3 py-3 text-left text-cream"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-cream text-navy">
          <CreditCard className="size-5" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-semibold">Open the P-card form</span>
          <span className="block text-xs text-cream/70">Photo, details, archive — same as Home</span>
        </span>
      </button>
      <StepList kicker="City card" title="How to run it" steps={PCARD_STEPS} />
    </div>
  );
}

function FormsPane() {
  const pocket = ICS_FORMS.filter((f) => f.pack === "pocket");
  const iap = ICS_FORMS.filter((f) => f.pack === "iap");
  return (
    <div className="flex flex-col gap-4">
      <FormGroup kicker="In your pocket" title="Line forms" forms={pocket} />
      <FormGroup kicker="IAP" title="Briefing packet" forms={iap} />
    </div>
  );
}

function FormGroup({
  kicker,
  title,
  forms,
}: {
  kicker: string;
  title: string;
  forms: typeof ICS_FORMS;
}) {
  return (
    <div>
      <p className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">{kicker}</p>
      <h2 className="mt-1 font-display text-xl font-semibold text-navy">{title}</h2>
      <ul className="mt-3 flex flex-col gap-2">
        {forms.map((form) => (
          <li key={form.code}>
            <a
              href={form.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-11 items-center gap-3 rounded-md border border-line bg-surface-2 px-3 py-2.5"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-navy font-display text-sm font-bold text-cream tabular-nums">
                {form.code}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-navy">{form.title}</span>
                <span className="block text-xs leading-snug text-muted">{form.note}</span>
              </span>
              <ClipboardList className="size-4 shrink-0 text-muted" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Fold({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <details className="rounded-lg border border-line bg-surface-2 p-4">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
        <span>
          <span className="block font-display text-lg font-semibold text-navy">{title}</span>
          <span className="block text-xs text-muted">{hint}</span>
        </span>
        <ChevronDown className="size-4 shrink-0 text-muted" />
      </summary>
      <div className="mt-3">{children}</div>
    </details>
  );
}
