import { IPriceRule } from "../../IPriceRule";
import { PricingContext } from "../../models";
export class BaseFeeRule implements IPriceRule {
  constructor(private fee = 5.0) {}
  apply(ctx: PricingContext){ return { add: ctx.baseFee ?? this.fee }; }
}
