import { PDFDocument } from "pdf-lib";
import fs from "node:fs";

function policySlug(id) {
  return id.toLowerCase().replace(/[^a-z0-9.]+/g, "-").replace(/^-|-$/g, "");
}

const VOLUMES = [
  {
    name: "Volume 1 — Administration",
    src: "public/docs/cfd-vol1-admin.pdf",
    policies: [
      { id: "101.00", page: 3 },
      { id: "102.00", page: 23 },
      { id: "103.00", page: 37 },
      { id: "104.00", page: 42 },
      { id: "105.00", page: 43 },
    ],
  },
  {
    name: "Volume 2 — Employee manual",
    src: "public/docs/cfd-vol2-employee.pdf",
    policies: [
      { id: "202.00", page: 7 },
      { id: "202.10", page: 17 },
      { id: "202.11", page: 18 },
      { id: "203.00", page: 26 },
      { id: "204.00", page: 36 },
      { id: "205.00", page: 46 },
    ],
  },
  {
    name: "Volume 3 — Health and safety",
    src: "public/docs/cfd-vol3-health.pdf",
    policies: [
      { id: "301.01", page: 3 },
      { id: "301.02", page: 10 },
      { id: "301.03", page: 35 },
      { id: "301.04", page: 40 },
      { id: "301.06", page: 45 },
      { id: "301.10", page: 50 },
      { id: "301.13", page: 60 },
      { id: "301.14", page: 75 },
      { id: "301.16", page: 85 },
      { id: "301.17", page: 115 },
      { id: "301.18", page: 135 },
      { id: "301.20", page: 160 },
      { id: "302.01", page: 165 },
      { id: "303.01", page: 180 },
      { id: "304.01", page: 190 },
      { id: "305.01", page: 215 },
    ],
  },
  {
    name: "Volume 4 — Forms",
    src: "public/docs/cfd-vol4-forms.pdf",
    policies: [
      { id: "401.05", page: 7 },
      { id: "401.06", page: 8 },
      { id: "401.07", page: 9 },
      { id: "401.08", page: 10 },
      { id: "401.10", page: 12 },
      { id: "402.01", page: 13 },
      { id: "402.02", page: 14 },
      { id: "402.07", page: 19 },
      { id: "402.08", page: 20 },
      { id: "402.10", page: 22 },
      { id: "402.11", page: 23 },
      { id: "402.15", page: 27 },
      { id: "403.01", page: 28 },
      { id: "403.02", page: 29 },
      { id: "403.07", page: 35 },
      { id: "403.09", page: 38 },
      { id: "406.02", page: 56 },
      { id: "406.04", page: 59 },
      { id: "406.05", page: 61 },
      { id: "406.06", page: 63 },
      { id: "407.01", page: 67 },
      { id: "407.02", page: 68 },
      { id: "407.03", page: 69 },
      { id: "407.04", page: 70 },
      { id: "408.01", page: 73 },
      { id: "408.02", page: 119 },
      { id: "408.03", page: 120 },
      { id: "408.04", page: 122 },
      { id: "408.05", page: 124 },
    ],
  },
  {
    name: "Volume 5 — EMS",
    src: "public/docs/cfd-vol5-ems.pdf",
    policies: [
      { id: "501.00", page: 3 },
      { id: "501.06", page: 6 },
      { id: "502.00", page: 10 },
      { id: "503.00", page: 14 },
      { id: "504.00", page: 25 },
    ],
  },
  {
    name: "Volume 6 — SOGs",
    src: "public/docs/cfd-vol6-sog.pdf",
    policies: [
      { id: "600.00", page: 3 },
      { id: "600.04", page: 11 },
      { id: "600.05", page: 13 },
      { id: "600.06", page: 17 },
      { id: "600.07", page: 36 },
      { id: "600.08", page: 51 },
      { id: "600.09", page: 54 },
      { id: "600.10", page: 59 },
      { id: "600.11", page: 72 },
      { id: "600.12", page: 75 },
      { id: "600.13", page: 82 },
      { id: "600.14", page: 90 },
      { id: "600.16", page: 100 },
      { id: "600.17", page: 119 },
      { id: "600.22", page: 125 },
      { id: "600.24", page: 127 },
      { id: "601.00", page: 128 },
      { id: "604.00", page: 232 },
      { id: "606.00", page: 328 },
      { id: "607.02", page: 353 },
      { id: "607.03", page: 361 },
      { id: "608.00", page: 394 },
      { id: "611.00", page: 500 },
    ],
  },
  {
    name: "City personnel rules",
    src: "public/docs/city-personnel-rules-2024.pdf",
    policies: [
      { id: "Rule 12", page: 50 },
      { id: "Rule 20", page: 62 },
      { id: "Rule 27", page: 71 },
      { id: "Rule 31", page: 77 },
      { id: "Rule 32", page: 80 },
      { id: "Rule 34", page: 81 },
      { id: "Rule 35", page: 83 },
      { id: "Rule 45", page: 120 },
    ],
  },
];

let totalSlices = 0;
let totalSizeKB = 0;

for (const vol of VOLUMES) {
  if (!fs.existsSync(vol.src)) {
    console.log(`SKIP ${vol.name}: ${vol.src} not found`);
    continue;
  }
  const srcBuf = fs.readFileSync(vol.src);
  const srcDoc = await PDFDocument.load(srcBuf);
  const totalPages = srcDoc.getPageCount();
  console.log(`\n${vol.name}: ${totalPages} pages (${(srcBuf.length / 1024 / 1024).toFixed(1)} MB)`);

  for (let i = 0; i < vol.policies.length; i++) {
    const policy = vol.policies[i];
    const startPage = policy.page;
    const endPage = i + 1 < vol.policies.length ? vol.policies[i + 1].page - 1 : totalPages;
    const pageIndices = Array.from({ length: endPage - startPage + 1 }, (_, j) => startPage - 1 + j);

    const sliceDoc = await PDFDocument.create();
    const pages = await sliceDoc.copyPages(srcDoc, pageIndices);
    pages.forEach(p => sliceDoc.addPage(p));

    const outPath = `public/docs/policies/${policySlug(policy.id)}.pdf`;
    const outBuf = await sliceDoc.save();
    fs.writeFileSync(outPath, outBuf);
    const kb = Math.round(outBuf.length / 1024);
    totalSlices++;
    totalSizeKB += kb;
    console.log(`  ${policy.id}: pp ${startPage}-${endPage} → ${outPath} (${kb} KB)`);
  }
}

console.log(`\nDone! ${totalSlices} policy PDFs sliced, total ${(totalSizeKB / 1024).toFixed(1)} MB`);
