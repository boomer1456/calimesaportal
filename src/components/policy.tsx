import { useTrainingStore } from "@/lib/store";
import { useMemo, useState } from "react";
import {
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  Printer,
  Radio as RadioIcon,
  Search,
} from "lucide-react";
import { useBackLayer, useBackStack } from "@/components/back-stack";
import {
  BINDER_FILES,
  FORM_FOLDERS,
  POLICY_FOLDERS,
  policyPreviewHref,
  policySliceHref,
  searchBinder,
  volumePageHref,
  type BinderDoc,
  type BinderFolder,
} from "@/lib/binder";
import { RADIO_GUIDES, RADIO_GUIDE_BY_ID, type RadioGuide } from "@/lib/radio-guides";
import { CALFIRE_TONES, RADIO_GROUPS, filterChannels } from "@/lib/radio";
import { ProcurementForm } from "@/components/procurement-form";
import { TimecardForm } from "@/components/timecard-form";
import { CityContacts } from "@/components/city-contacts";
import { cn } from "@/lib/utils";

const PANE_COPY = {
  policies: {
    kicker: "House binder",
    title: "Binder",
    blurb: "PDFs from the house binder. CFD policy wins over this phone.",
  },
  forms: {
    kicker: "House binder",
    title: "Forms",
    blurb: "Print, download, or fill on this phone. P-card is also on Home.",
  },
  contacts: {
    kicker: "House binder",
    title: "Contacts",
    blurb: "Vendors and City Hall. Tap a number. Not for the public.",
  },
  radio: {
    kicker: "CAL FIRE RRU",
    title: "Radio",
    blurb: "Zone 31 channel lookup. Confirm with the radio in your pocket — this is not a programming file.",
  },
} as const;

export function Policy() {
  const pane = useTrainingStore((s) => s.policyPane);
  const setPane = useTrainingStore((s) => s.setPolicyPane);
  const formFillId = useTrainingStore((s) => s.formFillId);
  const [query, setQuery] = useState("");
  const [localFill, setLocalFill] = useState<string | null>(null);
  const [openDoc, setOpenDoc] = useState<BinderDoc | null>(null);
  const { go } = useBackStack();
  const fillId = formFillId ?? localFill;

  useBackLayer(Boolean(openDoc), () => setOpenDoc(null));
  useBackLayer(Boolean(localFill), () => setLocalFill(null));

  const copy = PANE_COPY[pane];

  if (fillId === "P-Card" || fillId === "P-Card-archive" || fillId?.startsWith("P-Card:")) {
    const receiptId = fillId.startsWith("P-Card:") ? fillId.slice("P-Card:".length) : undefined;
    return (
      <ProcurementForm
        onBack={() => go()}
        receiptId={receiptId}
        startTab={fillId === "P-Card-archive" ? "archive" : "new"}
      />
    );
  }

  if (fillId === "Time-card") {
    return <TimecardForm />;
  }

  if (fillId) {
    return <FillableForm id={fillId} onBack={() => go()} />;
  }

  if (openDoc) {
    const fromForms = pane === "forms";
    return (
      <BinderReader
        item={openDoc}
        backLabel={fromForms ? "Forms" : "Policies"}
        noun={fromForms ? "form" : "policy"}
        onBack={() => go()}
        onFill={
          openDoc.fillable
            ? () => {
                setLocalFill(openDoc.id);
              }
            : undefined
        }
      />
    );
  }

  return (
    <section className="flex flex-col gap-4 pb-6">
      <p className="text-sm leading-relaxed text-muted">{copy.blurb}</p>

      {pane !== "radio" ? (
        <div className="flex gap-1">
          {(
            [
              ["policies", "Policies"],
              ["forms", "Forms"],
              ["contacts", "Contacts"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setPane(id);
                setQuery("");
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
      ) : null}

      {pane !== "radio" ? (
        <label className="flex h-11 items-center gap-2 rounded-sm border border-line bg-surface-2 px-3">
          <Search className="size-4 text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              pane === "forms" ? "Search forms" : pane === "contacts" ? "Search name, title, number" : "Search policies"
            }
            className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
          />
        </label>
      ) : null}

      {pane === "policies" ? (
        <FolderList
          folders={searchBinder(query, POLICY_FOLDERS)}
          empty="No matching policies."
          onOpen={setOpenDoc}
        />
      ) : pane === "forms" ? (
        <>
          <button
            type="button"
            onClick={() => setLocalFill("P-Card")}
            className="flex min-h-11 items-center gap-3 rounded-md bg-navy px-3 py-2.5 text-left text-cream"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-cream text-navy">
              <FileText className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">Procurement card</span>
              <span className="block text-xs text-cream/70">
                Photo, details, archive
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setLocalFill("Time-card")}
            className="flex min-h-11 items-center gap-3 rounded-md bg-navy px-3 py-2.5 text-left text-cream"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-cream text-navy">
              <FileText className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold">C.F.D. time card</span>
              <span className="block text-xs text-cream/70">
                Biweekly · fill, download, share, print
              </span>
            </span>
          </button>
          <a
            href={BINDER_FILES.v4}
            download
            className="flex min-h-11 items-center gap-2 rounded-md border border-line bg-surface-2 px-3 py-2 text-sm font-semibold text-navy"
          >
            <Download className="size-4" />
            Download Volume 4 — all forms (PDF)
          </a>
          <FolderList
            folders={searchBinder(query, FORM_FOLDERS)}
            empty="No matching forms."
            onFill={setLocalFill}
            onOpen={setOpenDoc}
          />
        </>
      ) : pane === "contacts" ? (
        <CityContacts query={query} />
      ) : (
        <RadioPanel />
      )}
    </section>
  );
}

function FolderList({
  folders,
  empty,
  onFill,
  onOpen,
}: {
  folders: BinderFolder[];
  empty: string;
  onFill?: (id: string) => void;
  onOpen?: (item: BinderDoc) => void;
}) {
  if (!folders.length) {
    return <p className="text-sm text-muted">{empty}</p>;
  }
  return (
    <ul className="flex flex-col gap-3">
      {folders.map((folder) => (
        <li key={folder.id} className="rounded-lg border border-line bg-surface-2 p-3">
          <div className="flex items-start gap-3">
            <FolderOpen className="mt-0.5 size-5 shrink-0 text-navy" />
            <div className="min-w-0 flex-1">
              <p className="font-display text-xl font-semibold leading-tight text-navy">
                {folder.title}
              </p>
              <p className="text-xs text-muted">{folder.kicker}</p>
            </div>
            {folder.href ? (
              <a
                href={folder.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex size-9 items-center justify-center rounded-sm text-muted"
                aria-label={`Open ${folder.title}`}
              >
                <ExternalLink className="size-4" />
              </a>
            ) : null}
          </div>
          {folder.missing ? (
            <p className="mt-2 text-xs leading-relaxed text-ember">
              Volume 3 PDF did not come through with this upload. Titles are listed so you
              can still search. Re-send the file to attach it.
            </p>
          ) : null}
          <ul className="mt-3 divide-y divide-line">
            {folder.items.map((item) => (
              <DocRow key={item.id} item={item} onFill={onFill} onOpen={onOpen} />
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

function DocRow({
  item,
  onFill,
  onOpen,
}: {
  item: BinderDoc;
  onFill?: (id: string) => void;
  onOpen?: (item: BinderDoc) => void;
}) {
  const inner = (
    <>
      <span className="w-16 shrink-0 text-[11px] font-bold text-ember tabular-nums">
        {item.code}
      </span>
      <span className="min-w-0 flex-1 text-sm leading-snug text-ink">{item.title}</span>
      {item.fillable ? (
        <span className="shrink-0 text-[10px] font-bold tracking-wide text-navy uppercase">
          Fill
        </span>
      ) : item.href ? (
        <FileText className="size-3.5 shrink-0 text-muted" />
      ) : null}
    </>
  );

  const slice = policySliceHref(item);
  if (slice && !item.missing && onOpen) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onOpen(item)}
          className="flex min-h-11 w-full items-center gap-2 py-2 text-left"
        >
          {inner}
        </button>
      </li>
    );
  }

  if (item.fillable && onFill) {
    return (
      <li>
        <button
          type="button"
          onClick={() => onFill(item.id)}
          className="flex min-h-11 w-full items-center gap-2 py-2 text-left"
        >
          {inner}
        </button>
      </li>
    );
  }

  if (item.href && !item.missing) {
    return (
      <li>
        <a
          href={volumePageHref(item) ?? item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-11 items-center gap-2 py-2"
        >
          {inner}
        </a>
      </li>
    );
  }

  return (
    <li className="flex min-h-11 items-center gap-2 py-2 opacity-70">
      {inner}
    </li>
  );
}

function BinderReader({
  item,
  backLabel,
  noun,
  onBack,
  onFill,
}: {
  item: BinderDoc;
  backLabel: string;
  noun: "policy" | "form";
  onBack: () => void;
  onFill?: () => void;
}) {
  const slice = policySliceHref(item);
  const preview = policyPreviewHref(item);

  if (!slice) return null;

  return (
    <section className="flex flex-col gap-3 pb-6">
      <div>
        <p className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
          {item.volume}
          {item.page ? ` · p. ${item.page}` : ""}
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight text-navy">
          {item.code} {item.title}
        </h1>
      </div>

      {onFill ? (
        <button
          type="button"
          onClick={onFill}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-sm border border-line bg-surface-2 text-sm font-semibold text-navy"
        >
          Fill on this phone
        </button>
      ) : null}

      {preview ? (
        <img
          src={preview}
          alt={`${item.code} ${item.title}`}
          className="block w-full rounded-md border border-line bg-white"
        />
      ) : null}

      <div className="overflow-hidden rounded-md border border-line bg-white">
        <iframe
          key={slice}
          src={`${slice}#view=FitH`}
          title={`${item.code} ${item.title}`}
          className="h-[80vh] w-full bg-white"
        />
      </div>
    </section>
  );
}

function RadioPanel() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<(typeof RADIO_GROUPS)[number]["id"]>("daily");
  const [guideId, setGuideId] = useState<RadioGuide["id"] | null>(null);
  const list = useMemo(() => filterChannels(query, group), [query, group]);
  const guide = guideId ? RADIO_GUIDE_BY_ID[guideId] : null;
  useBackLayer(Boolean(guide), () => setGuideId(null));

  if (guide) {
    return <RadioGuideReader guide={guide} />;
  }

  return (
    <div className="flex flex-col gap-3">
      <article className="rounded-lg border border-line bg-navy p-3 text-cream">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
          CAL FIRE RRU · V24A6 · 3/22/24
        </p>
        <p className="mt-1 text-sm leading-relaxed text-cream/90">
          Zone 31 is CAL FIRE Riverside Unit (RRU). Confirm against the radio in your pocket — this is a
          lookup, not a programming file. OST = pick the tone for the repeater you want.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={BINDER_FILES.radioPdf}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm bg-cream px-2.5 py-1.5 text-xs font-semibold text-navy"
          >
            Statewide PDF
          </a>
          <a
            href={BINDER_FILES.tk790}
            download
            className="rounded-sm bg-navy-2 px-2.5 py-1.5 text-xs font-semibold text-cream"
          >
            TK-790 spreadsheet
          </a>
          <a
            href={BINDER_FILES.gph}
            download
            className="rounded-sm bg-navy-2 px-2.5 py-1.5 text-xs font-semibold text-cream"
          >
            BK portable groups
          </a>
        </div>
      </article>

      <section className="rounded-lg border border-line bg-surface-2 p-3">
        <p className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
          BK user guides
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Pocket how-to for the BKR 5000, KNG, and KNG2. Manufacturer manuals and fire videos — CFD
          / RRU programming still wins.
        </p>
        <ul className="mt-3 flex flex-col gap-2">
          {RADIO_GUIDES.map((g) => (
            <li key={g.id}>
              <button
                type="button"
                onClick={() => setGuideId(g.id)}
                className="flex min-h-11 w-full items-center gap-3 rounded-md border border-line bg-surface px-3 py-2.5 text-left"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-sm bg-navy text-cream">
                  <BookOpen className="size-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold leading-tight text-navy">
                    {g.title}
                  </span>
                  <span className="block text-xs leading-snug text-muted">{g.teaser}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <label className="flex h-11 items-center gap-2 rounded-sm border border-line bg-surface-2 px-3">
        <RadioIcon className="size-4 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, tone, or frequency"
          className="h-full w-full bg-transparent text-sm text-ink outline-none placeholder:text-subtle"
        />
      </label>

      <div className="flex flex-wrap gap-1">
        {RADIO_GROUPS.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => setGroup(g.id)}
            className={cn(
              "h-8 rounded-sm px-2.5 text-xs font-semibold",
              group === g.id ? "bg-navy text-cream" : "bg-surface-2 text-muted",
            )}
          >
            {g.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted">{list.length} channels</p>

      <ul className="flex flex-col gap-2">
        {list.map((c) => (
          <li key={c.id} className="rounded-md border border-line bg-surface-2 p-3">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-display text-lg font-semibold leading-none text-navy">
                {c.name}
              </p>
              <span className="text-[11px] font-bold text-muted tabular-nums">
                Ch {c.ch}
              </span>
            </div>
            <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
              <p>
                <span className="text-muted">RX </span>
                <span className="font-semibold tabular-nums">{c.rx}</span>
                <span className="text-muted"> · {c.rxTone}</span>
              </p>
              <p>
                <span className="text-muted">TX </span>
                <span className="font-semibold tabular-nums">{c.tx}</span>
                <span className="text-muted"> · {c.txTone}</span>
              </p>
            </div>
            {c.notes ? (
              <p className="mt-2 text-xs leading-relaxed text-muted">{c.notes}</p>
            ) : null}
            <p className="mt-1 text-[10px] text-subtle">
              {c.pwr === "L" ? "Low power" : "High power"} · {c.bank}
            </p>
          </li>
        ))}
      </ul>

      <article className="rounded-lg border border-line bg-surface-2 p-3">
        <p className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
          Common CAL FIRE tones
        </p>
        <div className="mt-2 grid grid-cols-3 gap-1.5 text-xs">
          {CALFIRE_TONES.map((t) => (
            <p key={t.id} className="tabular-nums">
              <span className="font-semibold text-navy">{t.id}</span>
              <span className="text-muted"> {t.hz}</span>
            </p>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">OST = operator-selectable tone on transmit.</p>
      </article>
    </div>
  );
}

const GUIDE_KIND: Record<RadioGuide["links"][number]["kind"], string> = {
  manual: "Manual",
  video: "Video",
  web: "Guide",
};

function RadioGuideReader({ guide }: { guide: RadioGuide }) {
  return (
    <section className="flex flex-col gap-4 pb-6">
      <header className="rounded-lg bg-navy p-4 text-cream shadow-panel">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
          {guide.kicker}
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold leading-tight tracking-tight">
          {guide.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-cream/85">{guide.blurb}</p>
      </header>

      <article className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">Why this radio</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink">{guide.why}</p>
      </article>

      <article className="rounded-lg border border-line bg-surface-2 p-4">
        <h2 className="font-display text-xl font-semibold text-navy">On the fire</h2>
        <p className="mt-1 text-sm text-muted">
          The radio in your pocket and Zone 31 win. These are manufacturer habits, not CFD SOGs.
        </p>
        <ul className="mt-3 space-y-2">
          {guide.tips.map((tip) => (
            <li key={tip} className="flex gap-3 text-sm leading-relaxed text-ink">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-ember" />
              {tip}
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-navy p-4 text-cream">
        <p className="text-[10px] font-medium tracking-[0.18em] text-cream/70 uppercase">
          Manuals and videos
        </p>
        <p className="mt-1 text-sm text-cream/80">
          Official BK PDFs plus fire-department walkthroughs. Opens in a new tab.
        </p>
        <ul className="mt-3 space-y-2">
          {guide.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center gap-3 rounded-sm bg-navy-2 px-3 py-2"
              >
                <span className="shrink-0 rounded-xs bg-cream/15 px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-cream uppercase">
                  {GUIDE_KIND[link.kind]}
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
    </section>
  );
}

type Field = { name: string; label: string; type?: "text" | "textarea" | "date" };

const FILLABLE: Record<string, { title: string; intro: string; fields: Field[] }> = {
  "401.05": {
    title: "Policy manual receipt",
    intro:
      "Print, sign, and turn in. You are acknowledging the CFD policy manual, city personnel rules, and the IIPP.",
    fields: [
      { name: "name", label: "Printed name" },
      { name: "date", label: "Date", type: "date" },
    ],
  },
  "401.07": {
    title: "Shift exchange",
    intro: "Both members and the captain sign. Follow CFD 202.11.",
    fields: [
      { name: "date", label: "Date of request", type: "date" },
      { name: "initiator", label: "Employee initiating" },
      { name: "id1", label: "ID #" },
      { name: "partner", label: "Employee covering" },
      { name: "id2", label: "ID #" },
      { name: "from", label: "Shift given up (date / shift)" },
      { name: "to", label: "Shift taken (date / shift)" },
      { name: "reason", label: "Reason", type: "textarea" },
    ],
  },
  "406.05": {
    title: "Training and drill report",
    intro: "Company drill record. Also log hours in the official training system.",
    fields: [
      { name: "date", label: "Date", type: "date" },
      { name: "shift", label: "Shift (A / B / C)" },
      { name: "officer", label: "Company officer" },
      { name: "topic", label: "Topic / evolution" },
      { name: "hours", label: "Hours" },
      { name: "members", label: "Members present", type: "textarea" },
      { name: "notes", label: "Notes / deficiencies", type: "textarea" },
    ],
  },
  "408.03": {
    title: "Field incident report",
    intro: "Working field report. Official NFIRS / ePCR still required.",
    fields: [
      { name: "incident", label: "CMS incident #" },
      { name: "date", label: "Date", type: "date" },
      { name: "address", label: "Street / highway" },
      { name: "city", label: "City" },
      { name: "type", label: "Incident type" },
      { name: "units", label: "Units" },
      { name: "narrative", label: "Narrative", type: "textarea" },
    ],
  },
  "408.04": {
    title: "Exposure incident report",
    intro: "Turn in to the company officer the same shift. Follow Volume 3 / IIPP after.",
    fields: [
      { name: "name", label: "Full name" },
      { name: "id", label: "ID #" },
      { name: "rank", label: "Rank" },
      { name: "date", label: "Date", type: "date" },
      { name: "incident", label: "Incident #" },
      { name: "type", label: "Type of exposure" },
      { name: "details", label: "What happened", type: "textarea" },
    ],
  },
};

function FillableForm({ id, onBack }: { id: string; onBack: () => void }) {
  const spec = FILLABLE[id];
  const [values, setValues] = useState<Record<string, string>>({});
  if (!spec) return null;

  return (
    <section className="flex flex-col gap-4 pb-6 print:p-0">
      <header>
        <p className="text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
          Calimesa Fire Department · Form {id}
        </p>
        <h1 className="font-display text-3xl font-bold leading-none text-navy">{spec.title}</h1>
        <p className="mt-2 text-sm text-muted">{spec.intro}</p>
      </header>
      <form
        className="flex flex-col gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          window.print();
        }}
      >
        {spec.fields.map((field) => (
          <label key={field.name} className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-navy">{field.label}</span>
            {field.type === "textarea" ? (
              <textarea
                rows={4}
                value={values[field.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                className="rounded-sm border border-line bg-surface-2 px-3 py-2 text-sm"
              />
            ) : (
              <input
                type={field.type === "date" ? "date" : "text"}
                value={values[field.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.name]: e.target.value }))}
                className="h-11 rounded-sm border border-line bg-surface-2 px-3 text-sm"
              />
            )}
          </label>
        ))}
        <div className="mt-2 flex flex-col gap-4">
          <p className="text-sm text-ink">Signature: _______________________________ Date: ________</p>
          <p className="text-sm text-ink">Captain: ________________________________ Date: ________</p>
        </div>
        <button
          type="submit"
          className="mt-2 flex h-11 items-center justify-center gap-2 rounded-sm bg-navy text-sm font-semibold text-cream print:hidden"
        >
          <Printer className="size-4" />
          Print this form
        </button>
      </form>
    </section>
  );
}



