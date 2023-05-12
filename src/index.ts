import { Checkout } from "./services/checkout";
import { Product } from "./types/Product";
import fs from "fs";

const products: Product[] = JSON.parse(
  fs.readFileSync("./public/product-catalogue.json", "utf8")
);

const co = Checkout();

co.scan(products[0]);
co.scan(products[1]);

console.log(co.total());