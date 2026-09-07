#!/usr/bin/env python3
"""OCR a p-card receipt and stamp Calimesa's procurement PDF."""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime
from pathlib import Path

import pymupdf
from PIL import Image, ImageOps

TEMPLATE = Path(__file__).resolve().parents[1] / "public" / "docs" / "procurement-card.pdf"

try:
    from pillow_heif import register_heif_opener

    register_heif_opener()
except Exception:
    pass

SKIP_VENDOR = re.compile(
    r"thank|welcome|http|www\.|receipt|store\s*#|tel\.?|phone|cashier|copy|"
    r"customer|invoice|auth|approved|chip|visa|mastercard|amex|discover|"
    r"debit|credit|change|terminal|mid\b|tid\b|terms of use|privacy|"
    r"reserved|proprietary|copyright|international,?\s*inc|guest|"
    r"your hotel stay|display date|room type|reservation|company|"
    r"address\b|number of guests|charge posting|"
    r"\b[A-Z]{2}\s*\d{5}\b|,\s*[A-Z]{2}\b",
    re.I,
)
SKIP_ITEM = re.compile(
    r"sub\s*total|\btax\b|\btotal\b|change|tender|visa|mastercard|amex|"
    r"approved|auth|balance|payment|cash|debit|credit|gratuity|"
    r"amount due|duplicate|stored order|customer copy|dine in|"
    r"general manager|proudly served|welcome to|thank|"
    r"your hotel stay|terms of use|privacy statement|suites by wyndham|"
    r"termsofuse|privacystatement|all rights|international,?\s*inc|"
    r"^u?el$|^unch$|^otel$",
    re.I,
)
NOTE_LINE = re.compile(
    r"^(fuel|lunch|dinner|hotel|breakfast|snack|lodging|coffee)[\s./\d-]*$",
    re.I,
)
BRANDS = [
    (re.compile(r"olive(\s*g[ae]?r?den|\s+g)", re.I), "Olive Garden"),
    (re.compile(r"\bshell\b", re.I), "Shell"),
    (re.compile(r"courtyard", re.I), "Courtyard by Marriott"),
    (re.compile(r"hawthorn", re.I), "Hawthorn Suites"),
    (re.compile(r"wyndham", re.I), "Wyndham"),
    (re.compile(r"molly\s*brown", re.I), "Molly Brown's Country Cafe"),
    (re.compile(r"home\s*depot", re.I), "Home Depot"),
    (re.compile(r"\bchevron\b", re.I), "Chevron"),
    (re.compile(r"\barco\b", re.I), "ARCO"),
    (re.compile(r"\bwalmart\b", re.I), "Walmart"),
    (re.compile(r"\bstaples\b", re.I), "Staples"),
    (re.compile(r"office\s*depot", re.I), "Office Depot"),
    (re.compile(r"auto\s*zone", re.I), "AutoZone"),
    (re.compile(r"o'?reilly", re.I), "O'Reilly Auto Parts"),
    (re.compile(r"in-?n-?out", re.I), "In-N-Out"),
    (re.compile(r"starbucks", re.I), "Starbucks"),
    (re.compile(r"marriott", re.I), "Marriott"),
]
MONEY = re.compile(r"(?<![\d.])[\$Ss]?\s*(\d{1,5}(?:[.,]\d{2}))\b")
DATE_PATS = [
    re.compile(r"(\d{1,2})[/-](\d{1,2})[/-](\d{4}|\d{2})"),
    re.compile(r"(\d{4})[/-](\d{1,2})[/-](\d{1,2})"),
    re.compile(
        r"\b(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|"
        r"Jul(?:y)?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|"
        r"Dec(?:ember)?)\s+(\d{1,2}),?\s+(\d{4})\b",
        re.I,
    ),
]
MONTHS = {
    "jan": 1, "january": 1, "feb": 2, "february": 2, "mar": 3, "march": 3,
    "apr": 4, "april": 4, "may": 5, "jun": 6, "june": 6, "jul": 7, "july": 7,
    "aug": 8, "august": 8, "sep": 9, "sept": 9, "september": 9, "oct": 10,
    "october": 10, "nov": 11, "november": 11, "dec": 12, "december": 12,
}


def to_jpeg(src: str, dest: str, *, limit: int = 1800) -> None:
    try:
        im = Image.open(src)
    except Exception:
        subprocess.run(
            ["ffmpeg", "-y", "-i", src, "-frames:v", "1", "-update", "1", dest],
            check=True,
            capture_output=True,
        )
        im = Image.open(dest)
    im = ImageOps.exif_transpose(im).convert("RGB")
    w, h = im.size
    if max(w, h) > limit:
        scale = limit / max(w, h)
        im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.Resampling.LANCZOS)
    try:
        im = ImageOps.autocontrast(im, cutoff=1)
    except Exception:
        pass
    Path(dest).parent.mkdir(parents=True, exist_ok=True)
    im.save(dest, "JPEG", quality=85)


_OCR = None


def ocr_engine():
    global _OCR
    if _OCR is None:
        from rapidocr_onnxruntime import RapidOCR

        _OCR = RapidOCR()
    return _OCR


def ocr_lines(image_path: str) -> list[str]:
    result, _ = ocr_engine()(image_path)
    if not result:
        return []
    lines: list[str] = []
    for row in result:
        text = str(row[1]).strip()
        if text:
            lines.append(re.sub(r"\s+", " ", text))
    return lines


def ocr_best(jpeg_path: str) -> list[str]:
    best = ocr_lines(jpeg_path)
    if len(best) >= 10:
        return best
    im = Image.open(jpeg_path)
    for angle in (90, 270, 180):
        rotated = im.rotate(angle, expand=True)
        alt = str(Path(jpeg_path).with_name(f"ocr-{angle}.jpg"))
        rotated.save(alt, "JPEG", quality=85)
        cand = ocr_lines(alt)
        if len(cand) > len(best):
            best = cand
        if len(best) >= 10:
            break
    return best


def money_value(raw: str) -> float | None:
    raw = raw.replace(",", "")
    try:
        n = float(raw)
    except ValueError:
        return None
    if 0.01 <= n <= 99999:
        return n
    return None


def format_money(n: float) -> str:
    return f"${n:,.2f}"


def normalize_date(m: re.Match[str], kind: int) -> str | None:
    try:
        if kind == 0:
            a, b, y = int(m.group(1)), int(m.group(2)), int(m.group(3))
            if y < 100:
                y += 2000
            month, day = a, b
            if month > 12 and day <= 12:
                month, day = day, month
            dt = datetime(y, month, day)
        elif kind == 1:
            dt = datetime(int(m.group(1)), int(m.group(2)), int(m.group(3)))
        else:
            month = MONTHS[m.group(1).lower()[:3] if len(m.group(1)) > 3 else m.group(1).lower()]
            dt = datetime(int(m.group(3)), month, int(m.group(2)))
    except ValueError:
        return None
    return dt.strftime("%m/%d/%Y")


def pick_amount(lines: list[str], blob: str) -> float | None:
    labeled: list[float] = []
    for line in lines:
        if re.search(r"sub\s*total|payment|payments|balance|change|amount due", line, re.I):
            continue
        if re.search(r"\btotal\b|charges:", line, re.I) or re.search(r"total\s*=", line, re.I):
            found = [n for n in (money_value(x) for x in MONEY.findall(line)) if n]
            # skip refunds / payments off the account
            found = [n for n in found if n >= 1]
            labeled.extend(found)
    if labeled:
        return labeled[-1]
    all_m = [n for n in (money_value(x) for x in MONEY.findall(blob)) if n and n >= 1]
    if not all_m:
        return None
    return max(all_m) if max(all_m) < 5000 else all_m[-1]


def pick_vendor(lines: list[str], blob: str) -> str | None:
    for pat, name in BRANDS:
        if pat.search(blob):
            return name
    welcome = re.search(r"welcome to\s+([A-Za-z][A-Za-z0-9'&. -]{2,40})", blob, re.I)
    if welcome:
        return welcome.group(1).strip()[:80]
    for line in lines[:18]:
        cleaned = re.sub(r"(?<=[A-Za-z])0(?=[A-Za-z])", "O", line).strip(" -•*")
        letters = re.sub(r"[^A-Za-z]", "", cleaned)
        if len(letters) < 4:
            continue
        if NOTE_LINE.match(cleaned):
            continue
        if SKIP_VENDOR.search(cleaned):
            continue
        if MONEY.search(cleaned) and len(cleaned) < 22:
            continue
        if re.match(r"^[\d:]+$", cleaned):
            continue
        return cleaned[:80]
    return None


def parse_lines(lines: list[str]) -> dict[str, str]:
    blob = "\n".join(lines)
    out: dict[str, str] = {}

    amount = pick_amount(lines, blob)
    if amount is not None:
        out["amount"] = format_money(amount)

    for kind, pat in enumerate(DATE_PATS):
        m = pat.search(blob)
        if m:
            d = normalize_date(m, kind)
            if d:
                out["date"] = d
                break

    vendor = pick_vendor(lines, blob)
    if vendor:
        out["vendor"] = vendor

    items: list[str] = []
    for line in lines:
        if SKIP_ITEM.search(line) or NOTE_LINE.match(line):
            continue
        if vendor and re.sub(r"[0O]", "", line, flags=re.I) == re.sub(r"[0O]", "", vendor, flags=re.I):
            continue
        if DATE_PATS[0].search(line) or DATE_PATS[1].search(line):
            continue
        if re.search(r",[A-Z]{2}|[A-Z]{2}\s*\d{5}|[A-Z]{2}\d{5}|\b\d{5}(?:-\d{4})?\b", line):
            continue
        letters = re.sub(r"[^A-Za-z]", "", line)
        if len(letters) < 3:
            continue
        if re.match(r"^\d{1,5}\s", line):
            continue
        items.append(line)
        if len(items) >= 4:
            break
    if items:
        out["description"] = items[0][:160]
        extra = [x for x in items[1:4] if x != items[0]]
        if extra:
            out["description2"] = "; ".join(extra)[:160]
    elif vendor:
        out["description"] = vendor

    out["raw"] = "\n".join(lines[:80])
    return out


def stamp_pdf(fields: dict[str, str], receipt: str | None, dest: Path) -> None:
    if receipt:
        jpeg = str(dest.with_suffix(".jpg"))
        try:
            to_jpeg(receipt, jpeg, limit=1400)
            receipt = jpeg
        except Exception:
            receipt = None
    doc = pymupdf.open(TEMPLATE)
    page = doc[0]
    mapping = {
        "Date of Purchase": fields.get("date", ""),
        "Who Made The Purchase": fields.get("who", ""),
        "Card Name": fields.get("card", ""),
        "undefined": fields.get("vendor", ""),
        "Description Of Purchase 1": fields.get("description", ""),
        "Description Of Purchase 2": fields.get("description2", ""),
        "Account Coding": fields.get("coding", ""),
        "Amount Of Purchase": fields.get("amount", ""),
        "Supervisor Approval": fields.get("supervisor", ""),
    }
    for w in page.widgets() or []:
        name = w.field_name or ""
        if name in mapping:
            w.field_value = mapping[name]
            w.update()
        elif name == "Attach Receipt Here":
            w.field_value = ""
            w.update()

    attach = pymupdf.Rect(378, 176, 572, 748)
    border = pymupdf.Rect(374.18, 170.46, 575.5, 755.5)
    if receipt:
        page.draw_rect(attach, color=(1, 1, 1), fill=(1, 1, 1), width=0)
        page.insert_image(attach, filename=receipt, keep_proportion=True)
        page.draw_rect(border, color=(0.14, 0.12, 0.13), width=1)

    try:
        doc.bake()
    except Exception:
        pass

    dest.parent.mkdir(parents=True, exist_ok=True)
    doc.save(dest, deflate=True, garbage=3)
    try:
        preview = dest.with_suffix(".preview.jpg")
        pix = doc[0].get_pixmap(matrix=pymupdf.Matrix(1.2, 1.2), alpha=False)
        pix.save(str(preview), jpg_quality=65)
    except Exception:
        pass
    doc.close()


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--ocr", help="image to OCR")
    p.add_argument("--fill", help="JSON fields file")
    p.add_argument("--receipt", help="receipt image to stamp")
    p.add_argument("--out", help="output pdf")
    args = p.parse_args()

    if args.ocr:
        jpeg = str(Path(args.ocr).with_name("ocr.jpg"))
        to_jpeg(args.ocr, jpeg)
        parsed = parse_lines(ocr_best(jpeg))
        sys.stdout.write(json.dumps(parsed, ensure_ascii=False))
        return 0

    if args.fill and args.out:
        fields = json.loads(Path(args.fill).read_text())
        stamp_pdf(fields, args.receipt, Path(args.out))
        sys.stdout.write(json.dumps({"ok": True, "pdf": args.out}))
        return 0

    print("need --ocr or --fill/--out", file=sys.stderr)
    return 2


if __name__ == "__main__":
    raise SystemExit(main())
