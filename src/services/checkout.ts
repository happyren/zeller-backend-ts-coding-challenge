import { PricingRule } from "../types/PricingRule";
import { Product } from "../types/Product";

export const Checkout = ((pricingRules?: PricingRule[]) => {

  const scannedProducts: Product[] = [];

  const scan = (product: Product) => {
    throw new Error("Not implemented");
  }

  const total = () => {
    throw new Error("Not implemented");
  }

  const getScannedProducts = () => {
    return JSON.parse(JSON.stringify(scannedProducts));
  }

  return {
    scan,
    total,
    getScannedProducts
  }
});