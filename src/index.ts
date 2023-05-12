import { Product } from "./types/Product";
import fs from "fs";

const products: Product[] = JSON.parse(
  fs.readFileSync("./public/product-catalogue.json", "utf8")
);

console.log(products);