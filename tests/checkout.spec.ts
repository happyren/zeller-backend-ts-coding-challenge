import { Checkout } from "../src/services/checkout";
import { Product } from "../src/types/Product";

describe("Checkout service", () => {
  let products: Product[];
  beforeEach(() => {
    products = [{
      sku: "ipd",
      name: "Super iPad",
      price: 549.99
    }, {
      sku: "mbp",
      name: "MacBook Pro",
      price: 1399.99
    }];
  });

  it('should be able to scan a product', () => {
    const co = Checkout();
    co.scan(products[0]);
    const scannedProducts = co.getScannedProducts();

    expect(scannedProducts.length).toBe(1);
    expect(scannedProducts[0]).toEqual(products[0]);
  });

  it('should be able to calculate the total price', () => {
    const co = Checkout();
    co.scan(products[0]);
    co.scan(products[1]);
    expect(co.total()).toBe(1949.98);
  });



});