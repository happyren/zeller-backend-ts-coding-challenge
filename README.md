Zeller is starting a computer store. You have been engaged to build the checkout system. We will start with the following products in our catalogue


| SKU     | Name        | Price    |
| --------|:-----------:| --------:|
| ipd     | Super iPad  | $549.99  |
| mbp     | MacBook Pro | $1399.99 |
| atv     | Apple TV    | $109.50  |
| vga     | VGA adapter | $30.00   |

As we're launching our new computer store, we would like to have a few opening day specials.

- we're going to have a 3 for 2 deal on Apple TVs. For example, if you buy 3 Apple TVs, you will pay the price of 2 only
- the brand new Super iPad will have a bulk discounted applied, where the price will drop to $499.99 each, if someone buys more than 4

As our Sales manager is quite indecisive, we want the pricing rules to be as flexible as possible as they can change in the future with little notice.

Our checkout system can scan items in any order.

The interface to our checkout looks like this (shown in typescript):

```typescript
  const co = new Checkout(pricingRules);
  co.scan(item1);
  co.scan(item2);
  co.total();
```

Your task is to implement a checkout system that fulfils the requirements described above.

Example scenarios
-----------------

SKUs Scanned: atv, atv, atv, vga
Total expected: $249.00

SKUs Scanned: atv, ipd, ipd, atv, ipd, ipd, ipd
Total expected: $2718.95

Notes on implementation:

- use **Typescript**
- try not to spend more than 2 hours maximum. (We don't want you to lose a weekend over this!)
- don't build guis etc, we're more interested in your approach to solving the given task, not how shiny it looks
- don't worry about making a command line interface to the application
- don't use any frameworks

When you've finished, send through the link to your github-repo.

### Usages

- Install ```pnpm i```
- Run index ```pnpm run start```
- Run tests ```pnpm run test```

[**pricing-rules.json**](./public/pricing-rules.json) will contain the pricing rules to apply to the checkout process, it's dynamic as described in the [type file](./src/types/PricingRule.ts):

- Follow format to add new pricing rules
- Pricing rules can be stacked (but will be evaluated following the pricing rule sequence)
- Basic business logic check has been applied but it's limited, it should gracefully log issue and return unprocessed price:
  - no > 100% discount 
  - no < 0% discount 
  - no free item more than existing item
  - no < $0 fixed price
  - if a product meets buy n get b free, there are kn products, there should be kb free.

[**product-catalogue**](./public/product-catalogue.json) will contain a list of products

#### Additional test case for pricing rule stacking

Scan 3 atv and 5 ipd in following sequence: atv, ipd, ipd, atv, ipd, ipd, ipd atv
Total expected: $2718.95

Because both pricing rules are applied to give buy 3 get 1 free atv.

Scan 6 atv
Total expected: $438.00

Because the buy 3 get 1 free should be applied twice.
