import { useEffect, useState } from "react";
import {
  ChevronDown,
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  RefreshCw,
  Sun,
  Thermometer,
  Wind,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  STATION,
  compass,
  fmtIn,
  fmtInHg,
  fmtTemp,
  formatClock,
  formatDay,
  loadWeather,
  rhTone,
  wmoLabel,
  type Lightning,
  type WxAlert,
  type WxBundle,
  type WxDay,
  type WxNow,
} from "@/lib/weather";
import { cn } from "@/lib/utils";

function wmoIcon(code: number): LucideIcon {
  if (code === 0) return Sun;
  if (code <= 3) return CloudSun;
  if (code === 45 || code === 48) return CloudFog;
  if (code >= 51 && code <= 57) return CloudDrizzle;
  if (code >= 71 && code <= 77) return Cloud;
  if (code >= 85 && code <= 86) return Cloud;
  if (code >= 95) return CloudLightning;
  if (code >= 61) return CloudRain;
  return Cloud;
}

function trendWord(delta: number | null, up: string, down: string, flat: string) {
  if (delta == null || Math.abs(delta) < 1) return flat;
  return delta > 0 ? up : down;
}

function RhSpark({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const w = 120;
  const h = 28;
  const min = Math.min(...values, 0);
  const max = Math.max(...values, 100);
  const span = Math.max(1, max - min);
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - 2 - ((v - min) / span) * (h - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="h-7 w-28 text-navy"
      aria-hidden
    >
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
        points={pts}
      />
    </svg>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
  hint,
  tone = "ok",
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  tone?: "ok" | "watch" | "bad";
}) {
  return (
    <article className="rounded-md border border-line bg-surface-2 p-3">
      <div className="flex items-center gap-1.5 text-muted">
        <Icon className="size-3.5 shrink-0" aria-hidden />
        <p className="text-xs font-medium tracking-[0.14em] uppercase">{label}</p>
      </div>
      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold leading-none tabular-nums",
          tone === "bad" && "text-ember",
          tone === "watch" && "text-night",
          tone === "ok" && "text-navy",
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs leading-snug text-muted">{hint}</p> : null}
    </article>
  );
}

function AlertBanner({ alerts }: { alerts: WxAlert[] }) {
  if (!alerts.length) return null;
  return (
    <ul className="flex flex-col gap-2">
      {alerts.map((a) => (
        <li
          key={a.id}
          className="rounded-md border border-ember/30 bg-ember/5 px-3 py-2.5 text-sm leading-snug text-ember"
        >
          <p className="font-semibold">{a.event}</p>
          <p className="mt-0.5 text-ink">{a.headline}</p>
        </li>
      ))}
    </ul>
  );
}

function LightningRow({ lightning }: { lightning: Lightning }) {
  const hot = lightning.level !== "none";
  return (
    <article
      className={cn(
        "rounded-md border p-3",
        hot ? "border-ember/30 bg-ember/5" : "border-line bg-surface-2",
      )}
    >
      <div className="flex items-center gap-1.5">
        <Zap className={cn("size-3.5", hot ? "text-ember" : "text-muted")} aria-hidden />
        <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
          Lightning
        </p>
      </div>
      <p
        className={cn(
          "mt-1 font-display text-2xl font-bold leading-none",
          hot ? "text-ember" : "text-navy",
        )}
      >
        {lightning.label}
      </p>
      <p className="mt-1 text-xs leading-snug text-muted">{lightning.detail}</p>
    </article>
  );
}

function DayRow({
  day,
  todayIso,
  open,
  onToggle,
}: {
  day: WxDay;
  todayIso: string;
  open: boolean;
  onToggle: () => void;
}) {
  const Icon = wmoIcon(day.code);
  const title = formatDay(day.date, todayIso);
  return (
    <div className="border-b border-line last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3 py-3 text-left"
      >
        <Icon className="size-5 shrink-0 text-navy" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-navy">{title}</p>
          <p className="text-xs text-muted">{wmoLabel(day.code)}</p>
        </div>
        <p className="text-sm font-semibold tabular-nums text-ink">
          {fmtTemp(day.high)}{" "}
          <span className="font-medium text-muted">{fmtTemp(day.low)}</span>
        </p>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <div className="grid grid-cols-2 gap-2 px-3 pb-3">
          <p className="text-xs leading-relaxed text-ink">
            <span className="text-muted">Rain </span>
            {fmtIn(day.rainIn)} in
            {day.rainChance ? ` · ${Math.round(day.rainChance)}%` : ""}
          </p>
          <p className="text-xs leading-relaxed text-ink">
            <span className="text-muted">Wind </span>
            {compass(day.windDeg)} {Math.round(day.windMph)} g{Math.round(day.gustMph)}
          </p>
          <p className="text-xs leading-relaxed text-ink">
            <span className="text-muted">RH </span>
            {day.rhMin != null && day.rhMax != null
              ? `${Math.round(day.rhMin)}–${Math.round(day.rhMax)}%`
              : "—"}
          </p>
          <p className="text-xs leading-relaxed text-ink">
            <span className="text-muted">Dew </span>
            {day.dew != null ? fmtTemp(day.dew) : "—"}
          </p>
          <p className="col-span-2 text-xs leading-relaxed text-ink">
            <span className="text-muted">Lightning </span>
            {day.lightning.label}
            {day.lightning.level !== "none" ? ` — ${day.lightning.detail}` : ""}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function NowBoard({ now }: { now: WxNow }) {
  const Icon = wmoIcon(now.weatherCode);
  const rhHint =
    now.rhDelta3h == null
      ? "3-hour trend unavailable"
      : `${now.rhDelta3h > 0 ? "+" : ""}${Math.round(now.rhDelta3h)} pts / 3 hr · ${trendWord(
          now.rhDelta3h,
          "recovering",
          "drying",
          "steady",
        )}`;
  const pHint =
    now.pressureDelta3h == null
      ? `${Math.round(now.pressureHpa)} mb`
      : `${Math.round(now.pressureHpa)} mb · ${trendWord(
          now.pressureDelta3h,
          "rising",
          "falling",
          "steady",
        )}`;
  const rainLabel =
    now.rainNowIn < 0.005 && now.rainTodayIn < 0.005
      ? "None"
      : now.rainNowIn >= 0.005
        ? `${fmtIn(now.rainNowIn)} in now`
        : "None now";
  const rainHint =
    now.rainTodayIn < 0.005 ? "Today 0.00 in" : `Today ${fmtIn(now.rainTodayIn)} in`;
  const windHint = `Gusts ${Math.round(now.gustMph)} mph`;
  const gustHot = now.gustMph >= 25 || now.windMph >= 20;
  const rh = rhTone(now.rh);

  return (
    <>
      <header className="rounded-lg bg-navy p-4 text-cream shadow-panel">
        <p className="text-xs font-medium tracking-[0.18em] text-cream/70 uppercase">
          {STATION.address}
        </p>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-6xl font-bold leading-none tracking-tight tabular-nums">
              {fmtTemp(now.temp)}
            </p>
            <p className="mt-2 text-sm text-cream/85">
              Feels {fmtTemp(now.feels)} · H {fmtTemp(now.high)} / L {fmtTemp(now.low)}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <Icon className="size-12 text-cream" aria-hidden />
            <p className="mt-1 text-right text-sm font-semibold leading-tight">
              {wmoLabel(now.weatherCode)}
            </p>
          </div>
        </div>
        <p className="mt-3 text-xs text-cream/65">
          Updated {formatClock(now.at)} · America/Los Angeles
        </p>
      </header>

      <div className="grid grid-cols-2 gap-2">
        <Metric
          icon={Droplets}
          label="RH"
          value={`${Math.round(now.rh)}%`}
          hint={rhHint}
          tone={rh}
        />
        <Metric
          icon={Thermometer}
          label="Dew point"
          value={fmtTemp(now.dew)}
          hint="Moisture in the air"
        />
        <Metric
          icon={Wind}
          label="Wind"
          value={`${compass(now.windDeg)} ${Math.round(now.windMph)} mph`}
          hint={windHint}
          tone={gustHot ? "watch" : "ok"}
        />
        <Metric
          icon={Wind}
          label="Gusts"
          value={`${Math.round(now.gustMph)} mph`}
          hint={`Sustained ${Math.round(now.windMph)} mph`}
          tone={gustHot ? "watch" : "ok"}
        />
        <Metric icon={CloudRain} label="Rain" value={rainLabel} hint={rainHint} />
        <Metric
          icon={Gauge}
          label="Pressure"
          value={`${fmtInHg(now.pressureInHg)}"`}
          hint={pHint}
        />
      </div>

      <LightningRow lightning={now.lightning} />

      {now.rhSpark.length > 1 ? (
        <article className="rounded-md border border-line bg-surface-2 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-[0.14em] text-muted uppercase">
                RH trend
              </p>
              <p className="mt-1 text-sm text-ink">Last {now.rhSpark.length} hours</p>
            </div>
            <RhSpark values={now.rhSpark} />
          </div>
        </article>
      ) : null}
    </>
  );
}

export function Weather() {
  const [bundle, setBundle] = useState<WxBundle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);
  const [openDay, setOpenDay] = useState<string | null>(null);

  async function reload() {
    setBusy(true);
    setError(null);
    try {
      const next = await loadWeather();
      setBundle(next);
      setOpenDay(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load weather.");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    void reload();
  }, []);

  const todayIso = bundle?.now.at.slice(0, 10) ?? "";

  return (
    <section className="flex flex-col gap-4 pb-8">
      <header className="flex items-start justify-between gap-3">
        <p className="text-sm leading-relaxed text-muted">
          Fire-weather board for {STATION.name}. RH, wind, and lightning first — not a
          civilian forecast app.
        </p>
        <button
          type="button"
          onClick={() => void reload()}
          className="flex size-11 shrink-0 items-center justify-center rounded-md border border-line bg-surface-2 text-navy"
          aria-label="Refresh weather"
        >
          <RefreshCw className={cn("size-4", busy && "animate-spin")} />
        </button>
      </header>

      {error ? (
        <div className="rounded-md border border-ember/30 bg-ember/5 p-3 text-sm text-ember">
          {error}{" "}
          <button type="button" className="font-semibold underline" onClick={() => void reload()}>
            Retry
          </button>
        </div>
      ) : null}

      {bundle ? (
        <>
          <AlertBanner alerts={bundle.alerts} />
          <NowBoard now={bundle.now} />
          <section className="rounded-lg border border-line bg-surface-2">
            <h2 className="px-3 pt-3 font-display text-xl font-semibold text-navy">
              5-day forecast
            </h2>
            <p className="px-3 pb-1 text-xs text-muted">Tap a day to expand.</p>
            {bundle.days.map((day) => (
              <DayRow
                key={day.date}
                day={day}
                todayIso={todayIso}
                open={openDay === day.date}
                onToggle={() => setOpenDay((cur) => (cur === day.date ? null : day.date))}
              />
            ))}
          </section>
          <p className="text-xs text-subtle">
            Model: Open-Meteo. Alerts: NWS. Pointed at the station, not your phone.
          </p>
        </>
      ) : busy ? (
        <p className="text-sm text-muted">Loading station weather…</p>
      ) : null}
    </section>
  );
}


