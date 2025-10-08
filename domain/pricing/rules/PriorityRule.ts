import { IPriceRule } from "../../IPriceRule";
import { PricingContext } from "../../models";
export class PriorityRule implements IPriceRule {
  apply(ctx: PricingContext){ return ctx.job.priority === "express" ? { multiply: 1.25 } : { multiply: 1.0 }; }
}
