import fs from "fs";
import path from "path";
import { Assignment } from "../domain/models";

export function printManifest(assignments: Assignment[], outDir = "out"){
  const lines = [
    "POLAR PARCELS — DAILY MANIFEST",
    "================================",
    ...assignments.map(a => `Job ${a.jobId} → Driver ${a.driverId} in ${a.vehicleId} | ETA ${a.etaMinutes} min | $${a.price.toFixed(2)}`)
  ];
  const txt = lines.join("\n");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "manifest.txt"), txt, "utf-8");
  return txt;
}

export function exportSummary(assignments: Assignment[], outDir = "out"){
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify({ assignments }, null, 2), "utf-8");
}
