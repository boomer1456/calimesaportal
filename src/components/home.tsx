import type { ComponentType, SVGProps } from "react";
import {
  BriefcaseMedical,
  CalendarDays,
  CloudSun,
  CreditCard,
  FileText,
  GraduationCap,
  HeartPulse,
  Radio,
  Wrench,
  X,
} from "lucide-react";
import { HomeToday } from "@/components/home-today";
import { useTrainingStore, type PolicyPane, type Tab } from "@/lib/store";
import { cn } from "@/lib/utils";

type Tile = {
  label: string;
  hint: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  tone: "navy" | "ember" | "blue" | "green";
  tab: Tab;
  policyPane?: PolicyPane;
  rookiePane?: "map" | "life" | "ops";
  pcard?: boolean;
};

const ON_SHIFT: Tile[] = [
  {
    label: "Calendar",
    hint: "Drills + hours",
    icon: CalendarDays,
    tone: "navy",
    tab: "calendar",
  },
  {
    label: "Weather",
    hint: "Station fire wx",
    icon: CloudSun,
    tone: "blue",
    tab: "weather",
  },
  {
    label: "Station PAR",
    hint: "Cabinet check",
    icon: BriefcaseMedical,
    tone: "ember",
    tab: "ems",
  },
  {
    label: "Radio",
    hint: "RRU Zone 31",
    icon: Radio,
    tone: "green",
    tab: "policy",
    policyPane: "radio",
  },
];

const HOUSE: Tile[] = [
  {
    label: "P-card",
    hint: "Photo / archive",
    icon: CreditCard,
    tone: "ember",
    tab: "policy",
    pcard: true,
  },
  {
    label: "REMSA",
    hint: "Protocols / RHeart",
    icon: HeartPulse,
    tone: "ember",
    tab: "remsa",
  },
  {
    label: "Skills",
    hint: "SFT / tools",
    icon: Wrench,
    tone: "ember",
    tab: "skills",
  },
  {
    label: "Station",
    hint: "House / fireground / map",
    icon: GraduationCap,
    tone: "navy",
    tab: "rookie",
    rookiePane: "life",
  },
  {
    label: "Binder",
    hint: "Policies / forms",
    icon: FileText,
    tone: "navy",
    tab: "policy",
    policyPane: "policies",
  },
];

const TONE: Record<Tile["tone"], string> = {
  navy: "text-navy",
  ember: "text-ember",
  blue: "text-shift-b",
  green: "text-shift-c",
};

export function Home() {
  const setTab = useTrainingStore((s) => s.setTab);
  const setPolicyPane = useTrainingStore((s) => s.setPolicyPane);
  const setRookiePane = useTrainingStore((s) => s.setRookiePane);
  const openPcard = useTrainingStore((s) => s.openPcard);
  const hint = useTrainingStore((s) => s.installHintDismissed);
  const dismiss = useTrainingStore((s) => s.dismissInstallHint);

  function open(tile: Tile) {
    if (tile.pcard) {
      openPcard();
      return;
    }
    if (tile.policyPane) setPolicyPane(tile.policyPane);
    if (tile.rookiePane) setRookiePane(tile.rookiePane);
    setTab(tile.tab);
  }

  return (
    <div className="flex min-h-full flex-col bg-navy pb-[max(2rem,env(safe-area-inset-bottom))] text-cream">
      <header className="px-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <div className="flex flex-col items-center text-center">
          <img
            src="/calimesa-logo.png"
            alt="Calimesa Fire Department"
            className="h-24 w-auto"
          />
          <p className="mt-3 text-[10px] font-medium tracking-[0.22em] text-cream/65 uppercase">
            Calimesa Fire Department
          </p>
          <h1 className="mt-1 font-display text-4xl font-extrabold leading-none tracking-tight">
            Calimesa Portal
          </h1>
          <span className="mt-3 block h-px w-10 bg-ember" aria-hidden />
        </div>
      </header>

      <HomeToday />

      {!hint ? (
        <div className="mx-5 mt-4 flex items-start gap-3 rounded-md border border-cream/15 bg-navy-2 p-3">
          <p className="flex-1 text-sm leading-relaxed text-cream/85">
            On iPhone, open in Safari, tap Share, then Add to Home Screen.
          </p>
          <button
            type="button"
            aria-label="Dismiss"
            onClick={dismiss}
            className="flex size-9 items-center justify-center rounded-sm text-cream/70"
          >
            <X className="size-4" />
          </button>
        </div>
      ) : null}

      <nav className="flex flex-col gap-6 px-4 pt-6 pb-8" aria-label="Home">
        <TileRow title="On shift" tiles={ON_SHIFT} onOpen={open} />
        <TileRow title="House" tiles={HOUSE} onOpen={open} />
      </nav>
    </div>
  );
}

function TileRow({
  title,
  tiles,
  onOpen,
}: {
  title: string;
  tiles: Tile[];
  onOpen: (tile: Tile) => void;
}) {
  return (
    <div>
      <p className="mb-3 text-[10px] font-medium tracking-[0.18em] text-cream/60 uppercase">{title}</p>
      <div className="grid grid-cols-4 gap-x-3 gap-y-4">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <button
              key={tile.label}
              type="button"
              onClick={() => onOpen(tile)}
              aria-label={`${tile.label}. ${tile.hint}`}
              className="flex min-h-11 flex-col items-center gap-2"
            >
              <span
                className={cn(
                  "flex size-16 items-center justify-center rounded-xl bg-cream shadow-panel transition-transform duration-150 ease-out active:scale-95",
                  TONE[tile.tone],
                )}
              >
                <Icon className="size-8" strokeWidth={1.75} />
              </span>
              <span className="text-center text-xs font-semibold leading-tight text-cream">
                {tile.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
