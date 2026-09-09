import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import {
  contactsBySection,
  searchContacts,
  searchVendors,
  vendorsBySection,
  type CityContact,
  type ContactPhone,
} from "@/lib/city-contacts";
import { cn } from "@/lib/utils";

export function CityContacts({ query }: { query: string }) {
  const [list, setList] = useState<"vendors" | "city">("vendors");
  const searching = Boolean(query.trim());
  const people = list === "vendors" ? searchVendors(query) : searchContacts(query);
  const grouped = list === "vendors" ? vendorsBySection(people) : contactsBySection(people);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => setList("vendors")}
          className={cn(
            "h-10 flex-1 rounded-sm text-sm font-semibold",
            list === "vendors" ? "bg-navy text-cream" : "bg-surface-2 text-muted",
          )}
        >
          Vendors
        </button>
        <button
          type="button"
          onClick={() => setList("city")}
          className={cn(
            "h-10 flex-1 rounded-sm text-sm font-semibold",
            list === "city" ? "bg-navy text-cream" : "bg-surface-2 text-muted",
          )}
        >
          City
        </button>
      </div>

      <p className="text-xs leading-relaxed text-muted">
        {list === "vendors"
          ? "Shop and station vendors. Tap a number to call."
          : "City Hall and station list, updated 3/4/2026. Not for the public. Tap a number to call."}
      </p>

      {!grouped.length ? (
        <p className="rounded-md border border-line bg-surface-2 p-3 text-sm text-muted">
          No matching names or numbers.
        </p>
      ) : (
        grouped.map((g) => (
          <details
            key={`${list}-${g.section}-${searching ? "q" : "all"}`}
            open={searching ? true : undefined}
            className="rounded-lg border border-line bg-surface-2"
          >
            <summary className="flex min-h-12 cursor-pointer items-center justify-between gap-2 px-3 py-2 text-sm font-semibold text-navy">
              <span className="font-display text-lg font-bold">{g.section}</span>
              <span className="text-xs font-medium text-muted">{g.people.length}</span>
            </summary>
            <ul className="divide-y divide-line border-t border-line">
              {g.people.map((person) => (
                <ContactRow key={`${person.section}-${person.name}`} person={person} />
              ))}
            </ul>
          </details>
        ))
      )}
    </div>
  );
}

function ContactRow({ person }: { person: CityContact }) {
  return (
    <li className="px-3 py-2.5">
      <p className="font-display text-lg font-bold leading-tight text-navy">{person.name}</p>
      <p className="text-sm text-muted">{person.title}</p>
      {person.note ? <p className="mt-0.5 text-xs leading-relaxed text-subtle">{person.note}</p> : null}
      {person.phones.length ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {person.phones.map((p) => (
            <PhoneChip key={`${p.tel}-${p.label}`} phone={p} />
          ))}
        </div>
      ) : null}
      <div className="mt-1.5 flex flex-col gap-1">
        {person.email ? <MailLink email={person.email} /> : null}
        {person.email2 ? <MailLink email={person.email2} /> : null}
      </div>
    </li>
  );
}

function PhoneChip({ phone }: { phone: ContactPhone }) {
  return (
    <a
      href={`tel:${phone.tel}`}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-sm bg-navy px-3 text-sm font-semibold text-cream"
    >
      <Phone className="size-3.5" />
      <span>
        {phone.label} {phone.display}
      </span>
    </a>
  );
}

function MailLink({ email }: { email: string }) {
  return (
    <a href={`mailto:${email}`} className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-navy">
      <Mail className="size-3.5" />
      {email}
    </a>
  );
}