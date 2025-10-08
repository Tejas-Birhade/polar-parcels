import { IPriceRule } from "../../IPriceRule";
import { PricingContext } from "../../models";
export class LakeEffectAlertRule implements IPriceRule {
  apply(ctx: PricingContext){
    const hit = (ctx.weather.alerts || []).some(a => a.toLowerCase().includes("lake-effect-snow"));
    return hit ? { multiply: 1.08 } : { multiply: 1.0 };
  }
}
