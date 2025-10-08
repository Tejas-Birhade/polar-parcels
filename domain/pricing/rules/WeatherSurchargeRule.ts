import { IPriceRule } from "../../IPriceRule";
import { PricingContext } from "../../models";
export class WeatherSurchargeRule implements IPriceRule {
  apply(ctx: PricingContext){ return (ctx.weather.conditions === "snow" || ctx.weather.tempC < -10) ? { multiply: 1.10 } : { multiply: 1.0 }; }
}
