import { IPriceRule } from "../IPriceRule";
import { PricingContext, Quote } from "../models";

export class BasePricingEngine {
  constructor(private readonly rules: IPriceRule[]){}
  quote(ctx: PricingContext & { vehicleId: string }): Quote {
    let base = 0, distance = 0, weatherM = 1, priorityM = 1;
    let price = 0;
    for (const r of this.rules) {
      const eff = r.apply(ctx);
      if (eff.add !== undefined) {
        if (base === 0) { base += eff.add; price += eff.add; }
        else { distance += eff.add; price += eff.add; }
      }
      if (eff.multiply !== undefined) {
        if (weatherM === 1) weatherM = eff.multiply; else priorityM = eff.multiply;
        price *= eff.multiply;
      }
    }
    return { jobId: ctx.job.id, vehicleId: ctx.vehicleId, price: round2(price),
      breakdown: { base: round2(base), distance: round2(distance), weather: round2(weatherM), priority: round2(priorityM) } };
  }
}
const round2 = (n:number)=>Math.round(n*100)/100;
