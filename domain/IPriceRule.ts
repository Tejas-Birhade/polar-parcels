import { PriceEffect, PricingContext } from "./models";
export interface IPriceRule { apply(ctx: PricingContext): PriceEffect }
