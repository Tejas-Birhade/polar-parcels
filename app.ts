import readline from "readline";
import { loadDay } from "./io/loader";
import { printManifest, exportSummary } from "./io/printer";

import { BasePricingEngine } from "./domain/pricing/BasePricingEngine";
import { BaseFeeRule } from "./domain/pricing/rules/BaseFeeRule";
import { PerKmByVehicleRule } from "./domain/pricing/rules/PerKmByVehicleRule";
import { WeatherSurchargeRule } from "./domain/pricing/rules/WeatherSurchargeRule";
import { PriorityRule } from "./domain/pricing/rules/PriorityRule";
import { LakeEffectAlertRule } from "./domain/pricing/rules/LakeEffectAlertRule";

import { GreedyAssignment } from "./domain/assign/GreedyAssignment";
import { DayData, Job, Vehicle } from "./domain/models";

let day: DayData | null = null;

const pricing = new BasePricingEngine([
  new BaseFeeRule(5.0),
  new PerKmByVehicleRule(),
  new WeatherSurchargeRule(),
  new LakeEffectAlertRule(), // extension proof
  new PriorityRule()
]);
const assigner = new GreedyAssignment();

function quoteFor(job: Job, v: Vehicle): number {
  if (!day) return 0;
  const q = pricing.quote({ job, vehicle: v, vehicleId: v.id, weather: day.weather, baseFee: 5.0 });
  return q.price;
}

function runCommand(cmd: string){
  const [c, ...rest] = cmd.trim().split(/\s+/);
  const arg = rest.join(" ");

  switch(c){
    case "help":
      console.log('Commands: import <dataDir>, price all, assign all, print manifest, export summary, quit');
      break;

    case "import":
      try {
        day = loadDay(arg || "data");
        (globalThis as any).assignments = [];
        const d = day!;
        console.log(`Day loaded: ${d.jobs.length} jobs, ${d.drivers.length} drivers, ${d.vehicles.length} vehicles`);
      } catch(e){ console.error("Failed to load. Check /data files.", e); }
      break;

    case "price":
      if(!day) return console.log("Import first.");
      if(arg !== "all") return console.log("Usage: price all");
      for(const v of day.vehicles){
        for(const j of day.jobs){
          console.log(`Quote ${j.id} with ${v.id}: $${quoteFor(j, v).toFixed(2)}`);
        }
      }
      break;

    case "assign":
      if(!day) return console.log("Import first.");
      if(arg !== "all") return console.log("Usage: assign all");
      {
        const asn = assigner.assign(day.jobs, day.drivers, day.vehicles, day.weather, quoteFor);
        (globalThis as any).assignments = asn;
        console.log(`Assigned ${asn.length}/${day.jobs.length} jobs.`);
      }
      break;

    case "print":
      if(!day) return console.log("Import first.");
      if(arg !== "manifest") return console.log("Usage: print manifest");
      {
        const a1 = (globalThis as any).assignments || [];
        console.log(printManifest(a1, "out"));
      }
      break;

    case "export":
      if(!day) return console.log("Import first.");
      if(arg !== "summary") return console.log("Usage: export summary");
      {
        const a2 = (globalThis as any).assignments || [];
        exportSummary(a2, "out");
        console.log("summary.json written to /out");
      }
      break;

    case "quit": process.exit(0);
    default: console.log('Unknown. Type "help".');
  }
}

(async function main(){
  console.log('POLAR PARCELS CLI — type "help"');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: "> " });
  rl.prompt();
  rl.on("line", line => { runCommand(line); rl.prompt(); });
})();
