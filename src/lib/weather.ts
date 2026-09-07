/** Calimesa Fire Station — 906 Park Ave. */
export const STATION = {
  name: "Calimesa Fire Station",
  address: "906 Park Ave",
  lat: 34.003263,
  lng: -117.058532,
} as const;

export type LightningLevel = "none" | "possible" | "area" | "elevated";

export type Lightning = {
  level: LightningLevel;
  label: string;
  detail: string;
};

export type WxAlert = {
  id: string;
  event: string;
  headline: string;
  severity: string;
};

export type WxNow = {
  at: string;
  temp: number;
  feels: number;
  high: number;
  low: number;
  rh: number;
  rh3h: number | null;
  rhDelta3h: number | null;
  rhSpark: number[];
  dew: number;
  pressureHpa: number;
  pressureInHg: number;
  pressureDelta3h: number | null;
  rainNowIn: number;
  rainTodayIn: number;
  windMph: number;
  gustMph: number;
  windDeg: number;
  weatherCode: number;
  cape: number;
  lightning: Lightning;
};

export type WxDay = {
  date: string;
  code: number;
  high: number;
  low: number;
  rainIn: number;
  rainChance: number;
  windMph: number;
  gustMph: number;
  windDeg: number;
  rhMin: number | null;
  rhMax: number | null;
  dew: number | null;
  lightning: Lightning;
};

export type WxBundle = {
  now: WxNow;
  days: WxDay[];
  alerts: WxAlert[];
};

type Forecast = {
  current: {
    time: string;
    temperature_2m: number;
    relative_humidity_2m: number;
    dew_point_2m: number;
    apparent_temperature: number;
    precipitation: number;
    rain: number;
    weather_code: number;
    pressure_msl: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    cloud_cover: number;
    cape: number;
  };
  hourly: {
    time: string[];
    temperature_2m: (number | null)[];
    relative_humidity_2m: (number | null)[];
    dew_point_2m: (number | null)[];
    precipitation: (number | null)[];
    rain: (number | null)[];
    weather_code: (number | null)[];
    pressure_msl: (number | null)[];
    wind_speed_10m: (number | null)[];
    wind_gusts_10m: (number | null)[];
    wind_direction_10m: (number | null)[];
    cape: (number | null)[];
  };
  daily: {
    time: string[];
    weather_code: (number | null)[];
    temperature_2m_max: (number | null)[];
    temperature_2m_min: (number | null)[];
    precipitation_sum: (number | null)[];
    rain_sum: (number | null)[];
    precipitation_probability_max: (number | null)[];
    wind_speed_10m_max: (number | null)[];
    wind_gusts_10m_max: (number | null)[];
    wind_direction_10m_dominant: (number | null)[];
  };
};

const OM =
  "https://api.open-meteo.com/v1/forecast" +
  `?latitude=${STATION.lat}&longitude=${STATION.lng}` +
  "&current=temperature_2m,relative_humidity_2m,dew_point_2m,apparent_temperature,precipitation,rain,weather_code,pressure_msl,wind_speed_10m,wind_direction_10m,wind_gusts_10m,cloud_cover,cape" +
  "&hourly=temperature_2m,relative_humidity_2m,dew_point_2m,precipitation,rain,weather_code,pressure_msl,wind_speed_10m,wind_gusts_10m,wind_direction_10m,cape" +
  "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant" +
  "&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch" +
  "&timezone=America/Los_Angeles&forecast_days=6&past_days=1";

const NWS = `https://api.weather.gov/alerts/active?point=${STATION.lat},${STATION.lng}`;

function num(v: number | null | undefined, fallback = 0): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function hourIndex(times: string[], isoHour: string): number {
  const want = isoHour.slice(0, 13);
  const i = times.findIndex((t) => t.startsWith(want));
  if (i >= 0) return i;
  let best = 0;
  for (let k = 0; k < times.length; k++) {
    if (times[k] <= isoHour) best = k;
  }
  return best;
}

function hPaToInHg(hpa: number): number {
  return hpa * 0.0295299830714;
}

export function compass(deg: number): string {
  const pts = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];
  return pts[Math.round(((deg % 360) + 360) % 360 / 22.5) % 16] ?? "N";
}

export function wmoLabel(code: number): string {
  if (code === 0) return "Clear";
  if (code <= 3) return "Partly cloudy";
  if (code === 45 || code === 48) return "Fog";
  if (code <= 57) return "Drizzle";
  if (code <= 67) return "Rain";
  if (code <= 77) return "Snow";
  if (code <= 82) return "Showers";
  if (code <= 86) return "Snow showers";
  if (code === 95) return "Thunderstorms";
  if (code === 96 || code === 99) return "T-storms with hail";
  return "Cloudy";
}

function isStorm(code: number | null | undefined): boolean {
  const c = num(code, -1);
  return c === 95 || c === 96 || c === 99;
}

function lightningFrom(cape: number, codes: number[]): Lightning {
  const storms = codes.some(isStorm);
  if (storms && cape >= 1500) {
    return {
      level: "elevated",
      label: "Elevated",
      detail: "Thunderstorms and strong CAPE — treat as ignition weather.",
    };
  }
  if (storms) {
    return {
      level: "area",
      label: "In area",
      detail: "Thunderstorms in the forecast. Watch for dry strikes.",
    };
  }
  if (cape >= 1500) {
    return {
      level: "elevated",
      label: "Elevated",
      detail: `CAPE ${Math.round(cape)} J/kg — build-ups possible.`,
    };
  }
  if (cape >= 500) {
    return {
      level: "possible",
      label: "Possible",
      detail: `CAPE ${Math.round(cape)} J/kg — isolated cells not off the table.`,
    };
  }
  return { level: "none", label: "None", detail: "No thunderstorm signal in the model." };
}

function sliceHours(hourly: Forecast["hourly"], start: number, end: number) {
  const codes: number[] = [];
  let capeMax = 0;
  let rhMin: number | null = null;
  let rhMax: number | null = null;
  let dewSum = 0;
  let dewN = 0;
  for (let i = start; i < end && i < hourly.time.length; i++) {
    const code = hourly.weather_code[i];
    if (typeof code === "number") codes.push(code);
    capeMax = Math.max(capeMax, num(hourly.cape[i]));
    const rh = hourly.relative_humidity_2m[i];
    if (typeof rh === "number") {
      rhMin = rhMin == null ? rh : Math.min(rhMin, rh);
      rhMax = rhMax == null ? rh : Math.max(rhMax, rh);
    }
    const dew = hourly.dew_point_2m[i];
    if (typeof dew === "number") {
      dewSum += dew;
      dewN += 1;
    }
  }
  return {
    lightning: lightningFrom(capeMax, codes),
    rhMin,
    rhMax,
    dew: dewN ? dewSum / dewN : null,
  };
}

async function fetchAlerts(): Promise<WxAlert[]> {
  try {
    const res = await fetch(NWS, { headers: { Accept: "application/geo+json" } });
    if (!res.ok) return [];
    const json = (await res.json()) as {
      features?: Array<{
        id?: string;
        properties?: { event?: string; headline?: string; severity?: string };
      }>;
    };
    return (json.features ?? [])
      .map((f) => ({
        id: f.id ?? f.properties?.headline ?? "alert",
        event: f.properties?.event ?? "Alert",
        headline: f.properties?.headline ?? f.properties?.event ?? "NWS alert",
        severity: f.properties?.severity ?? "",
      }))
      .slice(0, 8);
  } catch {
    return [];
  }
}

export async function loadWeather(): Promise<WxBundle> {
  const [omRes, alerts] = await Promise.all([fetch(OM), fetchAlerts()]);
  if (!omRes.ok) throw new Error("Weather feed did not respond.");
  const data = (await omRes.json()) as Forecast;
  const cur = data.current;
  const hourly = data.hourly;
  const daily = data.daily;
  const idx = hourIndex(hourly.time, cur.time);
  const rhNow = num(cur.relative_humidity_2m);
  const rh3h = idx >= 3 ? hourly.relative_humidity_2m[idx - 3] : null;
  const pNow = num(cur.pressure_msl);
  const p3h = idx >= 3 ? hourly.pressure_msl[idx - 3] : null;

  const sparkStart = Math.max(0, idx - 11);
  const rhSpark: number[] = [];
  for (let i = sparkStart; i <= idx; i++) {
    const v = hourly.relative_humidity_2m[i];
    if (typeof v === "number") rhSpark.push(v);
  }

  const nearCodes: number[] = [];
  let nearCape = num(cur.cape);
  for (let i = idx; i <= idx + 6 && i < hourly.time.length; i++) {
    const c = hourly.weather_code[i];
    if (typeof c === "number") nearCodes.push(c);
    nearCape = Math.max(nearCape, num(hourly.cape[i]));
  }
  if (isStorm(cur.weather_code)) nearCodes.push(cur.weather_code);

  const now: WxNow = {
    at: cur.time,
    temp: num(cur.temperature_2m),
    feels: num(cur.apparent_temperature),
    high: num(daily.temperature_2m_max[0], num(cur.temperature_2m)),
    low: num(daily.temperature_2m_min[0], num(cur.temperature_2m)),
    rh: rhNow,
    rh3h: typeof rh3h === "number" ? rh3h : null,
    rhDelta3h: typeof rh3h === "number" ? rhNow - rh3h : null,
    rhSpark,
    dew: num(cur.dew_point_2m),
    pressureHpa: pNow,
    pressureInHg: hPaToInHg(pNow),
    pressureDelta3h: typeof p3h === "number" ? pNow - p3h : null,
    rainNowIn: Math.max(num(cur.rain), num(cur.precipitation)),
    rainTodayIn: Math.max(num(daily.rain_sum[0]), num(daily.precipitation_sum[0])),
    windMph: num(cur.wind_speed_10m),
    gustMph: num(cur.wind_gusts_10m),
    windDeg: num(cur.wind_direction_10m),
    weatherCode: num(cur.weather_code),
    cape: num(cur.cape),
    lightning: lightningFrom(nearCape, nearCodes),
  };

  const todayIso = cur.time.slice(0, 10);
  const days: WxDay[] = daily.time
    .map((date, i) => ({ date, i }))
    .filter(({ date }) => date >= todayIso)
    .slice(0, 5)
    .map(({ date, i }) => {
    const start = hourly.time.findIndex((t) => t.startsWith(date));
    const next = daily.time[i + 1];
    const end = next ? hourly.time.findIndex((t) => t.startsWith(next)) : start + 24;
    const slice = sliceHours(hourly, start < 0 ? 0 : start, end < 0 ? start + 24 : end);
    return {
      date,
      code: num(daily.weather_code[i]),
      high: num(daily.temperature_2m_max[i]),
      low: num(daily.temperature_2m_min[i]),
      rainIn: Math.max(num(daily.rain_sum[i]), num(daily.precipitation_sum[i])),
      rainChance: num(daily.precipitation_probability_max[i]),
      windMph: num(daily.wind_speed_10m_max[i]),
      gustMph: num(daily.wind_gusts_10m_max[i]),
      windDeg: num(daily.wind_direction_10m_dominant[i]),
      rhMin: slice.rhMin,
      rhMax: slice.rhMax,
      dew: slice.dew,
      lightning: slice.lightning,
    };
  });

  return { now, days, alerts };
}

export function rhTone(rh: number): "bad" | "watch" | "ok" {
  if (rh <= 15) return "bad";
  if (rh <= 25) return "watch";
  return "ok";
}

export function formatClock(iso: string): string {
  const hm = iso.slice(11, 16);
  const [hRaw, m] = hm.split(":");
  const hour24 = Number(hRaw);
  if (!Number.isFinite(hour24)) return iso;
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour = hour24 % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

export function formatDay(isoDate: string, todayIso: string): string {
  if (isoDate === todayIso) return "Today";
  const d = new Date(`${isoDate}T12:00:00-07:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "America/Los_Angeles",
  });
}

export function fmtTemp(n: number): string {
  return `${Math.round(n)}°`;
}

export function fmtIn(n: number): string {
  if (n < 0.005) return "0.00";
  return n.toFixed(2);
}

export function fmtInHg(n: number): string {
  return n.toFixed(2);
}
