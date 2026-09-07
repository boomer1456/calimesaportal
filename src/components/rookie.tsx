import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { CityMap } from "@/components/city-map";
import { Fireground } from "@/components/fireground";
import { ROOKIE_RECIPES, ROOKIE_SECTIONS } from "@/lib/rookie";
import { useTrainingStore } from "@/lib/store";
import { cn } from "@/lib/utils";


const PANES = [
  ["map", "Map"],
  ["life", "House"],
  ["ops", "Fireground"],
] as const;

export function Rookie() {
  const pane = useTrainingStore((s) => s.rookiePane);
  const setPane = useTrainingStore((s) => s.setRookiePane);
  const [opsDetail, setOpsDetail] = useState(false);
  const hideChrome = pane === "ops" && opsDetail;

  return (
    <section className="flex flex-col gap-5 pb-6">
      {hideChrome ? null : (
        <>
          <p className="text-sm leading-relaxed text-muted">
            City map, house life, and Volume 6 fireground cards. CFD SOGs win over this
            phone.
          </p>

          <div className="flex gap-1">
            {PANES.map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setPane(id);
                  setOpsDetail(false);
                }}
                className={cn(
                  "h-10 flex-1 rounded-sm text-sm font-semibold",
                  pane === id ? "bg-navy text-cream" : "bg-surface-2 text-muted",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}

      {pane === "map" ? (
        <CityMap />
      ) : pane === "ops" ? (
        <Fireground onDetail={setOpsDetail} />
      ) : (
        <StationLife />
      )}
    </section>
  );
}

function teaser(intro: string) {
  const sentence = intro.split(/(?<=\.)\s/)[0] ?? intro;
  return sentence;
}

function StationLife() {
  return (
    <div className="flex flex-col gap-2">
      {ROOKIE_SECTIONS.map((section) => (
        <details
          key={section.id}
          id={section.id}
          className="rounded-lg border border-line bg-surface-2"
        >
          <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-3 px-3 py-3 [&::-webkit-details-marker]:hidden">
            <span className="min-w-0 flex-1">
              <span className="block text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
                {section.kicker}
              </span>
              <span className="mt-0.5 block font-display text-lg font-semibold leading-tight text-navy">
                {section.title}
              </span>
              <span className="mt-1 block text-xs leading-snug text-muted">
                {teaser(section.intro)}
              </span>
            </span>
            <span className="mt-1 shrink-0 text-xs font-medium text-muted">
              {section.steps.length} {section.steps.length === 1 ? "step" : "steps"}
            </span>
          </summary>
          <div className="border-t border-line px-3 py-3">
            <p className="text-sm leading-relaxed text-muted">{section.intro}</p>
            <ol className="mt-3 space-y-2">
              {section.steps.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-relaxed text-ink">
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-cream">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            {section.notes?.length ? (
              <ul className="mt-3 space-y-1.5 border-t border-line pt-3 text-sm leading-relaxed text-muted">
                {section.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            ) : null}
            {section.links.length ? (
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <LinkRow href={link.href} label={link.label} />
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </details>
      ))}

      <details id="recipes" className="rounded-lg border border-line bg-surface-2">
        <summary className="flex min-h-12 cursor-pointer list-none items-start justify-between gap-3 px-3 py-3 [&::-webkit-details-marker]:hidden">
          <span className="min-w-0 flex-1">
            <span className="block text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
              Kitchen
            </span>
            <span className="mt-0.5 block font-display text-lg font-semibold leading-tight text-navy">
              Recipes that feed 5–6
            </span>
            <span className="mt-1 block text-xs leading-snug text-muted">
              One-pan meals that can sit on warm or reheat after a run.
            </span>
          </span>
          <span className="mt-1 shrink-0 text-xs font-medium text-muted">
            {ROOKIE_RECIPES.length} recipes
          </span>
        </summary>
        <div className="border-t border-line px-3 py-3">
          <p className="text-sm leading-relaxed text-muted">
            Open the recipe, shop for six (or the larger yield and freeze extra). Taste spice
            before you dump the whole chili packet. Ask about allergies first.
          </p>
          <ul className="mt-3 divide-y divide-line">
            {ROOKIE_RECIPES.map((recipe) => (
              <li key={recipe.href} className="py-3 first:pt-0 last:pb-0">
                <a
                  href={recipe.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-navy">{recipe.title}</p>
                    <p className="text-xs font-medium text-ember">Serves {recipe.serves}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{recipe.why}</p>
                  </div>
                  <ExternalLink className="mt-1 size-4 shrink-0 text-muted" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </details>
    </div>
  );
}

function LinkRow({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 items-center gap-2 rounded-sm border border-line bg-surface px-3 py-2 text-sm font-medium text-navy"
    >
      <span className="flex-1 leading-snug">{label}</span>
      <ExternalLink className="size-4 shrink-0 text-muted" />
    </a>
  );
}



