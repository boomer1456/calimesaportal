import { FileText, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { useBackLayer, useBackStack } from "@/components/back-stack";
import { BINDER_FILES } from "@/lib/binder";
import {
  SOG_CARD_BY_ID,
  sogCardsByGroup,
  sogPdfHref,
  type SogCard,
} from "@/lib/sog-cards";

export function Fireground({ onDetail }: { onDetail?: (open: boolean) => void }) {
  const [cardId, setCardId] = useState<string | null>(null);
  const card = cardId ? SOG_CARD_BY_ID[cardId] : null;
  const { go } = useBackStack();

  useBackLayer(Boolean(card), () => setCardId(null));

  useEffect(() => {
    onDetail?.(Boolean(card));
    return () => onDetail?.(false);
  }, [card, onDetail]);

  if (card) return <SogCardView card={card} onBack={() => go()} />;

  const groups = sogCardsByGroup();

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm leading-relaxed text-muted">
        Volume 6 field cards. Why we do it, the fireground order, and the words this
        county uses. The PDF is still the SOG.
      </p>

      {groups.map((group) => (
        <section key={group.id} className="rounded-lg border border-line bg-surface-2 p-3">
          <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">
            {group.kicker}
          </p>
          <h2 className="font-display text-xl font-semibold leading-tight text-navy">
            {group.title}
          </h2>
          <ul className="mt-2 divide-y divide-line">
            {group.cards.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setCardId(item.id)}
                  className="flex min-h-11 w-full items-center gap-2 py-2 text-left"
                >
                  <span className="w-16 shrink-0 text-[11px] font-bold text-ember tabular-nums">
                    {item.code}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold leading-tight text-navy">
                      {item.title}
                    </span>
                    <span className="block text-xs text-muted">{item.kicker}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <a
        href={BINDER_FILES.v6}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 items-center justify-center gap-2 rounded-md bg-navy text-sm font-semibold text-cream"
      >
        <FileText className="size-4" />
        Open Volume 6 PDF
      </a>
      <p className="text-xs leading-relaxed text-muted">
        Field cards only. If this phone and the binder disagree, the binder is the
        SOG.
      </p>
    </div>
  );
}

function SogCardView({ card }: { card: SogCard; onBack: () => void }) {
  return (
    <div className="flex flex-col gap-4">
      <header className="rounded-lg bg-navy p-4 text-cream shadow-panel">
        <p className="text-xs font-medium tracking-[0.16em] text-cream/70 uppercase">
          Volume 6 · {card.sog}
        </p>
        <h2 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight">
          {card.title}
        </h2>
        <p className="mt-2 text-sm text-cream/85">{card.kicker}</p>
      </header>

      <section>
        <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">Why</h3>
        <p className="mt-1 text-sm leading-relaxed text-ink">{card.why}</p>
      </section>

      <section>
        <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
          On the fireground
        </h3>
        <ol className="mt-2 space-y-2">
          {card.lines.map((line, i) => (
            <li key={line} className="flex gap-3 text-sm leading-relaxed text-ink">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-semibold text-cream">
                {i + 1}
              </span>
              {line}
            </li>
          ))}
        </ol>
      </section>

      <section className="rounded-lg border border-line bg-surface-2 p-3">
        <h3 className="text-[11px] font-medium tracking-wide text-muted uppercase">
          How we say it
        </h3>
        <dl className="mt-1">
          {card.terms.map((item) => (
            <div key={item.term} className="border-t border-line py-2 first:border-t-0 first:pt-2">
              <dt className="text-sm font-semibold text-navy">{item.term}</dt>
              <dd className="mt-0.5 text-sm leading-relaxed text-muted">{item.meaning}</dd>
            </div>
          ))}
        </dl>
      </section>

      {card.video ? (
        <a
          href={card.video.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-2 rounded-md border border-line bg-surface-2 px-3 py-2 text-sm font-semibold text-navy"
        >
          <Play className="size-4 shrink-0 text-ember" />
          <span className="min-w-0 flex-1 leading-snug">{card.video.label}</span>
        </a>
      ) : null}

      <a
        href={sogPdfHref(card)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 items-center justify-center gap-2 rounded-md bg-navy text-sm font-semibold text-cream"
      >
        <FileText className="size-4" />
        Open {card.code} in Volume 6 PDF
      </a>
    </div>
  );
}


