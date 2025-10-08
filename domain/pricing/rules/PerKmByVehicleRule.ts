import { IPriceRule } from "../../IPriceRule";
import { PricingContext } from "../../models";
const perKm: Record<string, number> = { car: 0.80, snowmobile: 0.60, "cargo-bike": 0.35 };
export class PerKmByVehicleRule implements IPriceRule {
  apply(ctx: PricingContext){ const rate = perKm[ctx.vehicle.type] ?? 0.75; return { add: rate * ctx.job.distanceKm }; }
}
