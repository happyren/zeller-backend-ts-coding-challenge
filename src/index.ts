import { Checkout } from "./services/checkout";
import { PricingRule } from "./types/PricingRule";
import { Product } from "./types/Product";
import fs from "fs";

const products: Product[] = JSON.parse(
  fs.readFileSync("./public/product-catalogue.json", "utf8")
);

const pricingRules: PricingRule[] = JSON.parse(
  fs.readFileSync("./public/pricing-rules.json", "utf8")
);

const co = Checkout(pricingRules);

console.log(`### 3 atv and 1 vga ###`);

co.scan(products[2]);
co.scan(products[2]);
co.scan(products[2]);
co.scan(products[3]);

console.log(`$${co.total().toFixed(2)}\n\n`);

co.clearCart();

console.log(`### 2 atv and 5 ipd ###`);

co.scan(products[2]);
co.scan(products[0]);
co.scan(products[0]);
co.scan(products[2]);
co.scan(products[0]);
co.scan(products[0]);
co.scan(products[0]);

console.log(`$${co.total().toFixed(2)}\n\n`);

co.clearCart();

console.log(`### 3 atv and 5 ipd ###`);

co.scan(products[2]);
co.scan(products[0]);
co.scan(products[0]);
co.scan(products[2]);
co.scan(products[0]);
co.scan(products[0]);
co.scan(products[0]);
// additional atv for rule stacking, should be same as price above.
co.scan(products[2]);

console.log(`$${co.total().toFixed(2)}\n\n`);

co.clearCart();

console.log(`### 6 atv ###`);

co.scan(products[2]);
co.scan(products[2]);
co.scan(products[2]);
co.scan(products[2]);
co.scan(products[2]);
co.scan(products[2]);
// pricing rule should be applied twice yielding 438

console.log(`$${co.total().toFixed(2)}\n\n`);
