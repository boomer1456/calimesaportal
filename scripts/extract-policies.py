#!/usr/bin/env python3
"""Slice house-binder PDFs into one file per listed policy."""

from __future__ import annotations

import os
import re
import sys

import pymupdf

OUT_DIR = "public/docs/policies"

# Start pages (1-indexed). Keys starting with "_" are sentinels used only to
# end the previous listed policy — they are not written as files.
BOUNDS: dict[str, dict[str, int]] = {
    "public/docs/cfd-vol6-sog.pdf": {
        "600.00": 3,
        "600.01": 5,
        "600.04": 11,
        "600.05": 13,
        "600.06": 17,
        "600.07": 36,
        "600.08": 51,
        "600.09": 54,
        "600.10": 59,
        "600.11": 72,
        "600.12": 75,
        "600.13": 82,
        "600.14": 90,
        "600.16": 100,
        "600.17": 119,
        "600.18": 121,
        "600.22": 125,
        "600.23": 126,
        "600.24": 127,
        "601.00": 128,
        "_602": 148,
        "604.00": 232,
        "_605": 280,
        "606.00": 328,
        "607.00": 350,
        "607.02": 353,
        "607.03": 361,
        "607.04": 365,
        "608.00": 394,
        "_610": 448,
        "611.00": 500,
        "_611end": 544,
    },
    "public/docs/cfd-vol1-admin.pdf": {
        "101.00": 3,
        "102.00": 23,
        "103.00": 37,
        "104.00": 42,
        "105.00": 43,
        "_106": 55,
    },
    "public/docs/cfd-vol2-employee.pdf": {
        "202.00": 7,
        "202.10": 17,
        "202.11": 18,
        "203.00": 26,
        "204.00": 36,
        "205.00": 46,
    },
    "public/docs/cfd-vol5-ems.pdf": {
        "501.00": 3,
        "501.06": 6,
        "502.00": 10,
        "503.00": 14,
        "504.00": 25,
    },
    "public/docs/city-personnel-rules-2024.pdf": {
        "rule-12": 50,
        "_rule-13": 52,
        "rule-20": 62,
        "_rule-21": 64,
        "rule-27": 71,
        "_rule-28": 72,
        "rule-31": 77,
        "rule-32": 80,
        "rule-34": 81,
        "rule-35": 83,
        "_rule-36": 85,
        "rule-45": 120,
        "_rule-46": 122,
    },
    "public/docs/cfd-vol4-forms.pdf": {
        "401.05": 7,
        "401.06": 8,
        "401.07": 9,
        "401.08": 10,
        "_401.09": 11,
        "401.10": 12,
        "402.01": 13,
        "402.02": 14,
        "_402.03": 15,
        "402.07": 19,
        "402.08": 20,
        "_402.09": 21,
        "402.10": 22,
        "402.11": 23,
        "_402.12": 24,
        "402.15": 27,
        "403.01": 28,
        "403.02": 29,
        "_403.03": 30,
        "403.07": 35,
        "_403.08": 37,
        "403.09": 38,
        "_403.10": 40,
        "406.02": 56,
        "_406.03": 57,
        "406.04": 59,
        "406.05": 61,
        "406.06": 63,
        "_406.07": 65,
        "407.01": 67,
        "407.02": 68,
        "407.03": 69,
        "407.04": 70,
        "_407.05": 71,
        "408.01": 73,
        "408.02": 119,
        "408.03": 120,
        "408.04": 122,
        "408.05": 124,
        "_408.06": 126,
    },
}

EMIT = {
    "600.00",
    "600.04",
    "600.05",
    "600.06",
    "600.07",
    "600.08",
    "600.09",
    "600.10",
    "600.11",
    "600.12",
    "600.13",
    "600.14",
    "600.16",
    "600.17",
    "600.22",
    "600.24",
    "601.00",
    "604.00",
    "606.00",
    "607.02",
    "607.03",
    "608.00",
    "611.00",
    "101.00",
    "102.00",
    "103.00",
    "104.00",
    "105.00",
    "202.00",
    "202.10",
    "202.11",
    "203.00",
    "204.00",
    "205.00",
    "501.00",
    "501.06",
    "502.00",
    "503.00",
    "504.00",
    "rule-12",
    "rule-20",
    "rule-27",
    "rule-31",
    "rule-32",
    "rule-34",
    "rule-35",
    "rule-45",
    "401.05",
    "401.06",
    "401.07",
    "401.08",
    "401.10",
    "402.01",
    "402.02",
    "402.07",
    "402.08",
    "402.10",
    "402.11",
    "402.15",
    "403.01",
    "403.02",
    "403.07",
    "403.09",
    "406.02",
    "406.04",
    "406.05",
    "406.06",
    "407.01",
    "407.02",
    "407.03",
    "407.04",
    "408.01",
    "408.02",
    "408.03",
    "408.04",
    "408.05",
}


def slug(code: str) -> str:
    return re.sub(r"[^a-z0-9.]+", "-", code.lower()).strip("-")


def ends_for(starts: dict[str, int], page_count: int) -> dict[str, tuple[int, int]]:
    ordered = sorted(starts.items(), key=lambda kv: (kv[1], kv[0]))
    out: dict[str, tuple[int, int]] = {}
    for i, (code, start) in enumerate(ordered):
        nxt = ordered[i + 1][1] if i + 1 < len(ordered) else page_count + 1
        end = max(start, nxt - 1)
        out[code] = (start, end)
    return out


def main() -> int:
    os.makedirs(OUT_DIR, exist_ok=True)
    written = 0
    for path, starts in BOUNDS.items():
        if not os.path.exists(path):
            print("missing", path, file=sys.stderr)
            return 1
        src = pymupdf.open(path)
        ranges = ends_for(starts, src.page_count)
        for code, (start, end) in ranges.items():
            if code.startswith("_"):
                continue
            key = slug(code)
            if key not in EMIT:
                continue
            out_path = os.path.join(OUT_DIR, f"{key}.pdf")
            dst = pymupdf.open()
            dst.insert_pdf(src, from_page=start - 1, to_page=end - 1)
            dst.save(out_path, deflate=True, garbage=3)
            # First-page preview so the app can show the policy without a PDF plugin.
            pix = dst[0].get_pixmap(matrix=pymupdf.Matrix(1.35, 1.35), colorspace=pymupdf.csRGB)
            pix.save(os.path.join(OUT_DIR, f"{key}.jpg"), jpg_quality=72)
            dst.close()
            written += 1
            print(f"{key:12} {path.split('/')[-1]:28} p{start}-{end} ({end-start+1}p)")
        src.close()
    print(f"wrote {written} slices")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
