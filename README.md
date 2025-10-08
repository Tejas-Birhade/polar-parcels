# Polar Parcels — Lab 2 (MVP, TypeScript)

Small CLI that loads a workday (drivers, vehicles, weather, jobs), computes quotes, assigns feasible (driver, vehicle) pairs, and outputs a **Daily Manifest** and **summary.json**. Designed for change with pluggable pricing rules and a swap-able assignment strategy.

## Prerequisites
- Node.js 18+ (tested on Node 22)
- npm
- (recommended) VS Code

## Install, Build, Run
```bash
npm install
npm run build
node dist/app.js
```

## CLI Commands
At the > prompt:

help
import data
price all
assign all
print manifest
export summary
quit

## What they do
import <dir> — loads JSON from a folder (default data)
price all — prints quotes for every (job × vehicle)
assign all — greedy feasible assignment using the quotes
print manifest — writes out/manifest.txt and echoes it
export summary — writes out/summary.json

## Data Files (in /data)
drivers.json, vehicles.json, weather.json, jobs.json

## Outputs (in /out)
manifest.txt — plain-text daily manifest (printable)
summary.json — compact JSON for downstream systems

## Architecture (quick tour)
Domain models: domain/models.ts
Pricing: domain/pricing/BasePricingEngine.ts with pluggable 

## IPriceRule rules:
BaseFeeRule (flat $5/job)
PerKmByVehicleRule (car $0.80/km, snowmobile $0.60/km, cargo-bike $0.35/km)
WeatherSurchargeRule (+10% if snow or < −10°C)
LakeEffectAlertRule (extension proof) (+8% if alert contains “lake-effect-snow”)
PriorityRule (×1.25 for express)

Assignment: domain/assign/GreedyAssignment.ts (feasibility: capacity, range, terrain; chooses cheapest feasible vehicle; picks any licensed free driver)

I/O boundary: io/loader.ts (reads JSON, trims BOM) & io/printer.ts (writes manifest/summary)

Wiring/DI: app.ts injects rule instances into BasePricingEngine and the GreedyAssignment strategy

## Computation Order
Base fee ($5)
Distance cost (vehicle rate × km)
Weather surcharge (+10% if snow or < −10°C)
Lake-effect alert (+8% if present)
Priority multiplier (×1.25 if express)

## Sample Results (with provided data)
J-1001 urban, standard (12.5 km)
car: $17.82, snowmobile: $14.85, cargo-bike: $11.14
J-1002 backcountry, express (85 km)
car: $108.41 (car disallowed for backcountry)
snowmobile: $83.16
cargo-bike: $51.59 (bike disallowed for backcountry)

Greedy assignment (default data): Assigned 1/2 jobs. (J-1002 fails range: needs 204 km round-trip with buffer; snowmobile has 120 km)

To make J-1002 assignable for a demo, bump the snowmobile rangeKm to ≥ 204 in data/vehicles.json, then import data → assign all → print manifest.

## Extensibility (proof)
Add a pricing rule by creating a new class implementing IPriceRule and registering it in app.ts. Example: LakeEffectAlertRule added without editing the engine. To demonstrate, comment it out in app.ts and observe ~8% lower quotes where applicable.

## Troubleshooting
tsc not found: npm i -D typescript then npx tsc
ERR_MODULE_NOT_FOUND: Ensure "type": "commonjs" in package.json and rebuild
“not a module” TS2306: Make sure files export something (export class…, export function…)
