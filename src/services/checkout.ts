import { PricingRule } from "../types/PricingRule";
import { Product } from "../types/Product";
import { PricingRuleCompiler } from "./pricingRuleCompiler";

export const Checkout = ((pricingRules: PricingRule[] = []) => {

  const scannedProducts: Product[] = [];

  const clearCart = () => {
    scannedProducts.splice(0, scannedProducts.length);
  }

  const scan = (product: Product) => {
    scannedProducts.push(product);
  }

  const total = () => {
    const pricingRuleCompiler = PricingRuleCompiler(pricingRules);
    return pricingRuleCompiler.calculateByPricingRules(scannedProducts);
  }

  const getScannedProducts = () => {
    return JSON.parse(JSON.stringify(scannedProducts));
  }

  return {
    scan,
    total,
    getScannedProducts,
    clearCart
  }
});