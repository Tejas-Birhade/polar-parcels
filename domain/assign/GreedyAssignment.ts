import { Assignment, Job, Vehicle, Weather, Driver } from "../models";
import { IAssignmentStrategy } from "../IAssignmentStrategy";

const SPEED_KPH: Record<string, number> = { car: 50, snowmobile: 35, "cargo-bike": 18 };

export class GreedyAssignment implements IAssignmentStrategy {
  assign(jobs: Job[], drivers: Driver[], vehicles: Vehicle[], weather: Weather, quoteFor: (job: Job, v: Vehicle) => number): Assignment[] {
    const takenDrivers = new Set<string>();
    const takenVehicles = new Set<string>();
    const out: Assignment[] = [];
    for (const job of jobs) {
      const candidates = vehicles
        .filter(v => !takenVehicles.has(v.id))
        .filter(v => this.fits(job, v))
        .map(v => ({ v, price: quoteFor(job, v) }))
        .sort((a,b)=>a.price-b.price);
      if (candidates.length === 0) continue;
      const chosen = candidates[0].v;
      const driver = drivers.find(d => !takenDrivers.has(d.id) && d.licenses.includes(chosen.type));
      if (!driver) continue;
      takenVehicles.add(chosen.id);
      takenDrivers.add(driver.id);
      const eta = this.computeEta(job, chosen);
      const price = quoteFor(job, chosen);
      out.push({ jobId: job.id, driverId: driver.id, vehicleId: chosen.id, etaMinutes: eta, price });
    }
    return out;
  }
  private fits(job: Job, v: Vehicle): boolean {
    if (v.capacityKg < job.kg) return false;
    const required = job.distanceKm * 2 * 1.2; if (v.rangeKm < required) return false;
    if (job.terrain === "backcountry"){ if (v.type === "car") return false; if (v.type === "cargo-bike") return false; }
    return true;
  }
  private computeEta(job: Job, v: Vehicle): number {
    const kph = SPEED_KPH[v.type] ?? 30;
    const hours = job.distanceKm / kph; // one-way
    return Math.round(hours*60);
  }
}
