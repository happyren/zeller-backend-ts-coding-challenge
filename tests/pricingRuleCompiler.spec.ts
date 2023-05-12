import { PricingRuleCompiler, PricingRuleCompilerItem } from "../src/services/pricingRuleCompiler";
import { Action, Condition, PricingRule } from "../src/types/PricingRule";

describe("Pricing rule compiler", () => {
  const scannedProducts = [{
    sku: "ipd",
    name: "Super iPad",
    price: 549.99
  },
  {
    sku: "ipd",
    name: "Super iPad",
    price: 549.99
  },
  {
    sku: "ipd",
    name: "Super iPad",
    price: 549.99
  }];

  const originalItemList = scannedProducts.map((product) => {
    return {
      sku: product.sku,
      price: product.price
    } as PricingRuleCompilerItem;
  });

  describe('evaluateConditionAgainstItemList', () => {
    const condition1 = {
      product: "ipd",
      operator: "eq",
      value: 3
    } as Condition;

    const condition2 = {...condition1,
      value: 4
    } as Condition;

    const condition3 = {
      product: 'subtotal',
      operator: 'gte',
      value: 100
    } as Condition;

    const condition4 = {
      product: 'totalQuantity',
      operator: 'gte',
      value: 2
    } as Condition;

    it.each([[condition1, true], [condition2, false], [condition3, true], [condition4, true]])
      ('should be able to evaluate condition against products', (condition: Condition, expected: boolean) => {
        const pricingRuleCompiler = PricingRuleCompiler();

        const result = pricingRuleCompiler.evaluateConditionAgainstItemList(condition, originalItemList);

        expect(result).toBe(expected);
      });
  });

  describe('generateNewItemListByAction', () => {
    const action1 = {
      product: 'ipd',
      type: 'fixedPrice',
      value: 499.99
    } as Action;

    const itemList1 = originalItemList.map((item) => {
      return {
        sku: item.sku,
        price: 499.99
        } as PricingRuleCompilerItem;
    });

    const action2 = {
      product: 'ipd',
      type: 'discount',
      value: 10
    } as Action;

    const itemList2 = originalItemList.map((item) => {
      return {
        sku: item.sku,
        price: 494.99
        } as PricingRuleCompilerItem;
    });

    it.each([[action1, itemList1], [action2, itemList2]])
    ('should be able to calculate by action', (action: Action, expectedItemList: PricingRuleCompilerItem[]) => {
      const pricingRuleCompiler = PricingRuleCompiler();
      const result = pricingRuleCompiler.generateNewItemListByAction(action, originalItemList);
      expect(result).toStrictEqual(expectedItemList);
    });
  });

  describe('setSkuItemsActionAppliedCounter', () => {
    it.each([['atv', 2, 3, 0], ['atv', 3, 3, 1], ['atv', 7, 3, 2]])
    ('should set counters to apply action several times if quantity condition met more than once', 
    (product: string, conditionMeasuredQuantity: number, value: number, expected: number) => {
      const pricingRuleCompiler = PricingRuleCompiler();
      const result = pricingRuleCompiler.setSkuItemsActionAppliedCounter(product, conditionMeasuredQuantity, value);
      expect(result).toBe(expected);
    });
  });

  describe('generateNewItemListBySinglePricingRule', () => {
    const pricingRule = {
      conditions: [{
        product: "ipd",
        operator: "eq",
        value: 3
      }],
      action: {
        product: 'ipd',
        type: 'fixedPrice',
        value: 499.99
      }
    } as PricingRule;

    const expectedItemList = [{
      sku: "ipd",
      price: 499.99
    }, {
      sku: "ipd",
      price: 499.99
    }, {
      sku: "ipd",
      price: 499.99
    }] as PricingRuleCompilerItem[];

    it('should be able to calculate by single pricing rule', () => {
      const pricingRuleCompiler = PricingRuleCompiler([pricingRule]);
      const result = pricingRuleCompiler.generateNewItemListBySinglePricingRule(originalItemList, pricingRule);

      expect(result).toStrictEqual(expectedItemList);
    });
  });

  describe('calculateByPricingRules', () => {
    const pricingRule1 = {
      conditions: [{
        product: "ipd",
        operator: "eq",
        value: 3
      }],
      action: {
        product: 'ipd',
        type: 'fixedPrice',
        value: 499.99
      }
    } as PricingRule;

    const pricingRule2 = {
      conditions: [{
        product: "atv",
        operator: "eq",
        value: 2
      }],
      action: {
        product: 'atv',
        type: 'free',
        value: 1
      }
    } as PricingRule;

    const extendedScannedProducts = [...scannedProducts, {
      sku: "atv",
      name: "Apple TV",
      price: 109.50
    },
    {
      sku: "atv",
      name: "Apple TV",
      price: 109.50
    },
    {
      sku: "atv",
      name: "Apple TV",
      price: 109.50
    },
    {
      sku: "atv",
      name: "Apple TV",
      price: 109.50
    }];

    it('should handle pricingRule stacking', () => {
      const pricingRuleCompiler = PricingRuleCompiler([pricingRule1, pricingRule2]);
      const result = pricingRuleCompiler.calculateByPricingRules(extendedScannedProducts);

      expect(result).toBe(1718.97);
    })
  })
});