/** Pull vendor, date, and total from noisy receipt text. */

const BRANDS: Array<[RegExp, string]> = [
  [/olive\s*g/i, "Olive Garden"],
  [/\bshell\b/i, "Shell"],
  [/courtyard/i, "Courtyard by Marriott"],
  [/hawthorn/i, "Hawthorn Suites"],
  [/wyndham/i, "Wyndham"],
  [/molly\s*brown/i, "Molly Brown's Country Cafe"],
  [/home\s*depot/i, "Home Depot"],
  [/\bchevron\b/i, "Chevron"],
  [/\barco\b/i, "ARCO"],
  [/\bwalmart\b/i, "Walmart"],
  [/\bstaples\b/i, "Staples"],
  [/office\s*depot/i, "Office Depot"],
  [/auto\s*zone/i, "AutoZone"],
  [/o'?reilly/i, "O'Reilly Auto Parts"],
  [/in-?n-?out/i, "In-N-Out"],
  [/starbucks/i, "Starbucks"],
  [/marriott/i, "Marriott"],
  [/\b76\b.*\b(station|fuel|gas)/i, "76"],
  [/circle\s*k/i, "Circle K"],
  [/costco/i, "Costco"],
  [/target\b/i, "Target"],
  [/lowe'?s/i, "Lowe's"],
  [/mcdonald/i, "McDonald's"],
  [/chipotle/i, "Chipotle"],
  [/panda\s*express/i, "Panda Express"],
];

const SKIP_VENDOR =
  /thank|welcome|http|www\.|receipt|store\s*#|tel\.?|phone|cashier|copy|customer|invoice|auth|approved|chip|visa|mastercard|amex|discover|debit|credit|change|terminal|privacy|reserved|copyright|guest|address\b|company|display date|your hotel stay|\b[A-Z]{2}\s*\d{5}\b/i;

const MONEY_SRC = String.raw`(?<![\d.])\$?\s*(\d{1,5}(?:[.,]\d{2}))\b`;
const TOTAL_LINE = /\b(grand\s*)?total\b|\bfuel\s*total\b|\bamount\b(?!\s*due)|\bcharges\s*:/i;
const SKIP_AMOUNT = /sub\s*total|payment|payments|balance|change|amount due|gratuity|tip/i;

const MONTHS: Record<string, number> = {
  jan: 1, january: 1, feb: 2, february: 2, mar: 3, march: 3,
  apr: 4, april: 4, may: 5, jun: 6, june: 6, jul: 7, july: 7,
  aug: 8, august: 8, sep: 9, sept: 9, september: 9, oct: 10,
  october: 10, nov: 11, november: 11, dec: 12, december: 12,
};

export type ReceiptGuess = {
  vendor?: string;
  date?: string;
  amount?: string;
  raw?: string;
};

function moneyMatches(s: string): string[] {
  return [...s.matchAll(new RegExp(MONEY_SRC, "g"))].map((m) => m[1]);
}

function moneyValue(raw: string): number | undefined {
  const n = Number(raw.replace(",", "."));
  if (Number.isFinite(n) && n >= 1 && n <= 99999) return n;
  return undefined;
}

function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`;
}

function fixYear(y: number): number {
  if (y < 100) return 2000 + y;
  // Tesseract often reads 2026 as 2826 / 2O26
  if (y >= 2400 && y <= 2999) return 2000 + (y % 100);
  return y;
}

function isoDate(year: number, month: number, day: number): string | undefined {
  year = fixYear(year);
  if (month > 12 && day <= 12) [month, day] = [day, month];
  if (year < 2020 || year > 2035 || month < 1 || month > 12 || day < 1 || day > 31) return undefined;
  const dt = new Date(year, month - 1, day);
  if (dt.getFullYear() !== year || dt.getMonth() !== month - 1 || dt.getDate() !== day) return undefined;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function pickDate(blob: string): string | undefined {
  const numeric = blob.matchAll(/(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{2,4})/g);
  for (const m of numeric) {
    const iso = isoDate(Number(m[3]), Number(m[1]), Number(m[2]));
    if (iso) return iso;
  }
  const ymd = blob.match(/(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})/);
  if (ymd) {
    const iso = isoDate(Number(ymd[1]), Number(ymd[2]), Number(ymd[3]));
    if (iso) return iso;
  }
  const named = blob.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:t(?:ember)?)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2}),?\s+(\d{4})\b/i,
  );
  if (named) {
    const month = MONTHS[named[1].toLowerCase().slice(0, 3)];
    const iso = isoDate(Number(named[3]), month, Number(named[2]));
    if (iso) return iso;
  }
  return undefined;
}

function pickAmount(lines: string[], blob: string): string | undefined {
  const labeled: number[] = [];
  for (const line of lines) {
    if (SKIP_AMOUNT.test(line)) continue;
    if (!TOTAL_LINE.test(line) && !/total\s*=/i.test(line)) continue;
    const found = moneyMatches(line).map((x) => moneyValue(x)).filter((n): n is number => n != null);
    labeled.push(...found);
  }
  if (labeled.length) return formatMoney(labeled[labeled.length - 1]);
  const all = moneyMatches(blob).map((x) => moneyValue(x)).filter((n): n is number => n != null && n >= 1);
  if (!all.length) return undefined;
  const max = Math.max(...all);
  return formatMoney(max < 5000 ? max : all[all.length - 1]);
}

function pickVendor(lines: string[], blob: string): string | undefined {
  for (const [pat, name] of BRANDS) {
    if (pat.test(blob)) return name;
  }
  const welcome = blob.match(/welcome to\s+([A-Za-z][A-Za-z0-9'&. -]{2,40})/i);
  if (welcome) return welcome[1].trim().slice(0, 80);
  for (const line of lines.slice(0, 18)) {
    const cleaned = line.replace(/(?<=[A-Za-z])0(?=[A-Za-z])/g, "O").replace(/^[-•*\s]+|[-•*\s]+$/g, "");
    const letters = cleaned.replace(/[^A-Za-z]/g, "");
    if (letters.length < 4) continue;
    if (/^(fuel|lunch|dinner|hotel|breakfast|snack|lodging)$/i.test(cleaned)) continue;
    if (SKIP_VENDOR.test(cleaned)) continue;
    if (/\$?\s*\d{1,5}(?:[.,]\d{2})\b/.test(cleaned) && cleaned.length < 22) continue;
    if (/^[\d:./\s-]+$/.test(cleaned)) continue;
    return cleaned.slice(0, 80);
  }
  return undefined;
}

export function parseReceiptText(text: string): ReceiptGuess {
  const blob = text
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[|[\]]/g, " ")
    .replace(/[Oo](?=\d{3,})/g, "0");
  const lines = blob
    .split(/\n+/)
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean);
  const out: ReceiptGuess = { raw: lines.slice(0, 80).join("\n") };
  const amount = pickAmount(lines, blob);
  if (amount) out.amount = amount;
  const date = pickDate(blob);
  if (date) out.date = date;
  const vendor = pickVendor(lines, blob);
  if (vendor) out.vendor = vendor;
  return out;
}
