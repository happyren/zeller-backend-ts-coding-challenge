import { PricingRule } from "../types/PricingRule";
import { Product } from "../types/Product";

export const Checkout = ((pricingRules?: PricingRule[]) => {

  const scannedProducts: Product[] = [];

  const scan = (product: Product) => {
    scannedProducts.push(product);
  }

  const total = () => {
    return scannedProducts.reduce((total, product) => {
      return total + product.price;
    }, 0);
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