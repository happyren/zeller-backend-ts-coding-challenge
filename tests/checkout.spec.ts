import { Checkout } from "../src/services/checkout";
import { Product } from "../src/types/Product";

describe("Checkout service", () => {
  let product: Product;
  beforeEach(() => {
    product = {
      sku: "ipd",
      name: "Super iPad",
      price: 549.99
    };
  });

  it('should be able to scan a product', () => {
    const co = Checkout();
    co.scan(product);
    const scannedProducts = co.getScannedProducts();

    expect(scannedProducts.length).toBe(1);
    expect(scannedProducts[0]).toEqual(product);
  });

  it('should be able to calculate the total price', () => {
    const co = Checkout();
    co.scan(product);
    expect(co.total()).toBe(549.99);
  });



});