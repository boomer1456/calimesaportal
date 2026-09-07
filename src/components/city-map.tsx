import { useEffect, useRef } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MAP_CENTER,
  MAP_PLACES,
  PARKS,
  SCHOOLS,
  STATION,
  type MapKind,
  type MapPlace,
} from "@/lib/city-map";
import {
  HOSPITALS,
  REMSA_8101,
  SPECIALTY_LABEL,
  chipsFor,
  telHref,
  type Hospital,
} from "@/lib/hospitals";

type LeafletNS = typeof import("leaflet");

const STAR = `<svg class="cfd-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.4 14.7 8.6l6.8.7-5.1 4.6 1.5 6.7L12 17.3 6.1 20.6l1.5-6.7-5.1-4.6 6.8-.7Z"/></svg>`;

const HOUSE = `<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" aria-hidden="true"><path d="M3 11 12 3l9 8"/><path d="M5 10.5V21h14V10.5"/><path d="M10 21v-6h4v6"/></svg>`;

const CAP = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10 12 4 2 10l10 6 10-6Z"/><path d="M6 12v5c2.2 1.7 9.8 1.7 12 0v-5"/><path d="M22 10v6"/></svg>`;

const H_PIN = `<span class="cfd-pin cfd-pin-hospital">H</span>`;

const ICON_HTML: Record<MapKind, string> = {
  station: STAR,
  park: `<span class="cfd-pin cfd-pin-park">${HOUSE}</span>`,
  school: `<span class="cfd-pin cfd-pin-school">${CAP}</span>`,
};

function esc(value: string) {
  const amp = "&" + "amp;";
  const lt = "&" + "lt;";
  const gt = "&" + "gt;";
  const quot = "&" + "quot;";
  return value
    .replace(/&/g, amp)
    .replace(/</g, lt)
    .replace(/>/g, gt)
    .replace(/"/g, quot)
    .replace(/'/g, "&#39;");
}

function leafletNS(mod: LeafletNS | { default: LeafletNS }): LeafletNS {
  if (mod && typeof (mod as LeafletNS).map === "function") return mod as LeafletNS;
  return (mod as { default: LeafletNS }).default;
}

function markerIcon(L: LeafletNS, place: MapPlace) {
  const side = place.labelSide === "left" ? "left" : "right";
  const pin = ICON_HTML[place.kind];
  const label = `<span class="cfd-mark-label">${esc(place.name)}</span>`;
  const inner = side === "left" ? `${label}${pin}` : `${pin}${label}`;
  return L.divIcon({
    className: "cfd-mark-wrap",
    html: `<div class="cfd-mark cfd-mark-${place.kind} cfd-mark-${side}">${inner}</div>`,
    iconSize: [190, 32],
    iconAnchor: side === "left" ? [176, 16] : [14, 16],
  });
}

function hospitalIcon(L: LeafletNS, hospital: Hospital) {
  const side = hospital.labelSide === "left" ? "left" : "right";
  const text =
    hospital.code === hospital.short
      ? hospital.short
      : `${hospital.code} ${hospital.short}`;
  const label = `<span class="cfd-mark-label">${esc(text)}</span>`;
  const inner = side === "left" ? `${label}${H_PIN}` : `${H_PIN}${label}`;
  return L.divIcon({
    className: "cfd-mark-wrap",
    html: `<div class="cfd-mark cfd-mark-hospital cfd-mark-${side}">${inner}</div>`,
    iconSize: [190, 32],
    iconAnchor: side === "left" ? [176, 16] : [14, 16],
  });
}

function hospitalPopup(hospital: Hospital) {
  const specs = chipsFor(hospital)
    .map((s) => SPECIALTY_LABEL[s])
    .join(" · ");
  const radio = hospital.radioRoom
    ? `Radio room DTMF ${esc(hospital.radioRoom)}`
    : esc(hospital.radioNote ?? "Radio room not listed");
  const rec = hospital.recordedLine
    ? `<a href="${telHref(hospital.recordedLine)}">${esc(hospital.recordedLine)}</a>`
    : "ICEMA — recorded line not on 8101";
  return `<strong>${esc(hospital.name)}</strong> · ${esc(hospital.code)}<br/>${esc(hospital.address)}<br/>Recorded ${rec}<br/>${radio}<br/>${esc(specs)}`;
}

const LEGEND_HTML = `
  <p class="cfd-legend-title">Legend</p>
  <p>${STAR}<span>Fire station</span></p>
  <p>${H_PIN}<span>Hospital</span></p>
  <p><span class="cfd-pin cfd-pin-park">${HOUSE}</span><span>Mobile home park</span></p>
  <p><span class="cfd-pin cfd-pin-school">${CAP}</span><span>School</span></p>
`;

export function CityMap() {
  const el = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markers = useRef<Record<string, LeafletMarker>>({});

  useEffect(() => {
    const node = el.current;
    if (!node) return;
    let cancelled = false;
    let map: LeafletMap | null = null;
    let ro: ResizeObserver | null = null;
    const timers: number[] = [];

    void import("leaflet").then((mod) => {
      if (cancelled || !el.current) return;
      const L = leafletNS(mod);

      map = L.map(el.current, {
        zoomControl: true,
        attributionControl: false,
      }).setView(MAP_CENTER, 13);

      L.control.attribution({ position: "bottomleft", prefix: false }).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      const cityGroup = L.featureGroup();
      for (const place of MAP_PLACES) {
        const z = place.kind === "station" ? 800 : place.kind === "school" ? 400 : 200;
        const extra = place.aka ? `<br/><em>${esc(place.aka)}</em>` : "";
        const marker = L.marker([place.lat, place.lng], {
          icon: markerIcon(L, place),
          zIndexOffset: z,
          title: place.name,
          alt: place.name,
        })
          .bindPopup(
            `<strong>${esc(place.name)}</strong>${extra}<br/>${esc(place.address)}`,
          )
          .addTo(map);
        markers.current[place.id] = marker;
        cityGroup.addLayer(marker);
      }

      for (const hospital of HOSPITALS) {
        const marker = L.marker([hospital.lat, hospital.lng], {
          icon: hospitalIcon(L, hospital),
          zIndexOffset: 600,
          title: `${hospital.code} ${hospital.name}`,
          alt: hospital.name,
        })
          .bindPopup(hospitalPopup(hospital))
          .addTo(map);
        markers.current[hospital.id] = marker;
      }

      if (cityGroup.getLayers().length) {
        map.fitBounds(cityGroup.getBounds().pad(0.22));
      }

      const Legend = L.Control.extend({
        onAdd() {
          const box = L.DomUtil.create("div", "cfd-legend");
          box.innerHTML = LEGEND_HTML;
          L.DomEvent.disableClickPropagation(box);
          return box;
        },
      });
      new Legend({ position: "bottomright" }).addTo(map);

      mapRef.current = map;

      const sync = () => map?.invalidateSize();
      timers.push(window.setTimeout(sync, 80), window.setTimeout(sync, 400));
      ro = new ResizeObserver(sync);
      ro.observe(el.current);
      map.whenReady(sync);
    });

    return () => {
      cancelled = true;
      for (const t of timers) window.clearTimeout(t);
      ro?.disconnect();
      map?.remove();
      mapRef.current = null;
      markers.current = {};
    };
  }, []);

  function flyTo(id: string, lat: number, lng: number, zoom = 16) {
    const map = mapRef.current;
    if (!map) return;
    map.setView([lat, lng], zoom, { animate: true });
    markers.current[id]?.openPopup();
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm leading-relaxed text-muted">
        City of Calimesa. Red star is the station. Navy H is a hospital — most
        sit just outside the city. Tap a name to jump.
      </p>
      <div
        ref={el}
        className="h-[28rem] w-full overflow-hidden rounded-lg border border-line shadow-panel"
      />
      <PlaceList title="Station" places={[STATION]} onJump={(p) => flyTo(p.id, p.lat, p.lng)} />
      <HospitalList onJump={(h) => flyTo(h.id, h.lat, h.lng, 14)} />
      <PlaceList title="Mobile home parks" places={PARKS} onJump={(p) => flyTo(p.id, p.lat, p.lng)} />
      <PlaceList title="Schools" places={SCHOOLS} onJump={(p) => flyTo(p.id, p.lat, p.lng)} />
      <p className="text-xs leading-relaxed text-muted">
        Eight parks — the city’s rent-stabilization list. Calimesa Elementary is
        in Yucaipa. Hospitals from REMSA 8101 (Aug 25, 2026): Pass destinations
        plus all six base hospitals (DTMF 150, 170, 180, 210, 220, 250).
        Out-of-county recorded lines are ICEMA, not listed. If two more parks
        belong on this map, send the names.
      </p>
    </div>
  );
}

function HospitalList({ onJump }: { onJump: (hospital: Hospital) => void }) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
        Hospitals
      </p>
      <ul className="flex flex-col gap-2">
        {HOSPITALS.map((hospital) => (
          <li key={hospital.id}>
            <article className="rounded-sm border border-line bg-surface-2 px-3 py-3">
              <button
                type="button"
                onClick={() => onJump(hospital)}
                className="flex min-h-11 w-full items-start gap-2 text-left"
              >
                <span className="cfd-pin cfd-pin-hospital mt-0.5" aria-hidden>
                  H
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display text-lg font-bold text-navy">
                      {hospital.code}
                    </span>
                    <span className="text-sm font-semibold text-navy">{hospital.name}</span>
                  </span>
                  <span className="mt-0.5 block text-xs text-muted">{hospital.address}</span>
                </span>
              </button>
              <dl className="mt-2 space-y-1 pl-8 text-xs">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-semibold text-navy">Recorded line</dt>
                  <dd>
                    {hospital.recordedLine ? (
                      <a
                        href={telHref(hospital.recordedLine)}
                        className="font-semibold text-ember underline-offset-2 hover:underline"
                      >
                        {hospital.recordedLine}
                      </a>
                    ) : (
                      <span className="text-muted">ICEMA — not on REMSA 8101</span>
                    )}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="font-semibold text-navy">Radio room</dt>
                  <dd className="text-ink">
                    {hospital.radioRoom
                      ? `DTMF ${hospital.radioRoom}`
                      : hospital.radioNote}
                  </dd>
                </div>
                {hospital.bh ? (
                  <p className="font-semibold text-navy">Base hospital</p>
                ) : null}
              </dl>
              <div className="mt-2 flex flex-wrap gap-1 pl-8">
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
              </div>
              {hospital.note ? (
                <p className="mt-1.5 pl-8 text-xs leading-relaxed text-muted">{hospital.note}</p>
              ) : null}
            </article>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted">
        Confirm against{" "}
        <a
          href={REMSA_8101}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-navy underline-offset-2 hover:underline"
        >
          REMSA 8101
        </a>
        . Diversion and officer win.
      </p>
    </div>
  );
}

function PlaceList({
  title,
  places,
  onJump,
}: {
  title: string;
  places: MapPlace[];
  onJump: (place: MapPlace) => void;
}) {
  return (
    <div>
      <p className="mb-1 text-[10px] font-medium tracking-[0.18em] text-muted uppercase">
        {title}
      </p>
      <ul className="flex flex-col">
        {places.map((place) => (
          <li key={place.id}>
            <button
              type="button"
              onClick={() => onJump(place)}
              className="flex min-h-11 w-full items-start gap-2 rounded-sm px-2 py-2 text-left hover:bg-surface-2"
            >
              <KindGlyph kind={place.kind} />
              <span>
                <span className="block text-sm font-semibold text-navy">{place.name}</span>
                {place.aka ? (
                  <span className="block text-xs text-ember">{place.aka}</span>
                ) : null}
                <span className="text-xs text-muted">{place.address}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function KindGlyph({ kind }: { kind: MapKind }) {
  if (kind === "station") {
    return (
      <span className="mt-0.5 inline-flex size-6 shrink-0 items-center justify-center text-ember" aria-hidden>
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path
            fill="currentColor"
            d="M12 2.4 14.7 8.6l6.8.7-5.1 4.6 1.5 6.7L12 17.3 6.1 20.6l1.5-6.7-5.1-4.6 6.8-.7Z"
          />
        </svg>
      </span>
    );
  }
  if (kind === "park") {
    return (
      <span className="cfd-pin cfd-pin-park mt-0.5" aria-hidden>
        <svg
          viewBox="0 0 24 24"
          width="13"
          height="13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        >
          <path d="M3 11 12 3l9 8" />
          <path d="M5 10.5V21h14V10.5" />
          <path d="M10 21v-6h4v6" />
        </svg>
      </span>
    );
  }
  return (
    <span className="cfd-pin cfd-pin-school mt-0.5" aria-hidden>
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 10 12 4 2 10l10 6 10-6Z" />
        <path d="M6 12v5c2.2 1.7 9.8 1.7 12 0v-5" />
        <path d="M22 10v6" />
      </svg>
    </span>
  );
}


