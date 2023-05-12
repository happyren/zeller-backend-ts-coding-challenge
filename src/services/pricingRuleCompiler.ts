import { Action, Condition, PricingRule } from "../types/PricingRule";
import { Product } from "../types/Product";

export type PricingRuleCompilerItem = {
  sku: string;
  price: number;
}

export const PricingRuleCompiler = ((pricingRules: PricingRule[] = []) => {
  let itemList: PricingRuleCompilerItem[] = [];
  let applyCounter = 0;

  const calculateSubtotal = (items: PricingRuleCompilerItem[]): number => {
    return items.reduce((total, item) => {
      return total + item.price;
    }, 0);
  }

  const discountPriceUpdate = (appliedItemList: PricingRuleCompilerItem[], value: number): PricingRuleCompilerItem[] => {
    if (value > 100) {
      console.log('Discount cannot be more than 100%');
      return appliedItemList;
    } else if (value < 0) {
      console.log('Discount cannot be less than 0%');
      return appliedItemList;
    } else {
      return appliedItemList.map(item => {
        return {
          ...item,
          price: Number((item.price - (item.price * value / 100)).toFixed(2))
        };
      });
    }
  };

  const fixedPriceUpdate = (appliedItemList: PricingRuleCompilerItem[], value: number): PricingRuleCompilerItem[] => {
    if (value < 0) {
      console.log('Fixed price cannot be less than 0');
      return appliedItemList;
    } else {
      return appliedItemList.map(item => {
        return {
          ...item,
          price: value
        };
      });
    }
  };

  const freePriceUpdate = (appliedItemList: PricingRuleCompilerItem[], value: number): PricingRuleCompilerItem[] => {
    if (value > appliedItemList.length) {
      console.log('Not enough items to apply free item');
      return appliedItemList;
    } else if (value < 0) {
      console.log('Free item cannot be less than 0');
      return appliedItemList;
    } else {
      return appliedItemList.map((item, index) => {
        if (index < value * applyCounter) {
          return {
            ...item,
            price: 0
          };
        }
        return item;
      });
    }
  };

  const generatePriceUpdateAppliedItemList = (type: string, value: number, appliedItemList: PricingRuleCompilerItem[]): PricingRuleCompilerItem[] => {
    if (type === 'discount') {
      return discountPriceUpdate(appliedItemList, value);
    }
    
    if (type === 'fixedPrice') {
      return fixedPriceUpdate(appliedItemList, value);
    }

    return freePriceUpdate(appliedItemList, value);
  }

  const setSkuItemsActionAppliedCounter = (product: string, conditionMeasuredQuantity: number, value: number): number => {
    const result = Math.floor((conditionMeasuredQuantity - (conditionMeasuredQuantity % value)) / value);
    if (result > 0 && product === 'totalQuantity' || product === 'subtotal') {
      return 1;
    }
    return result;
  }

  const evaluateConditionAgainstItemList = (condition: Condition, oldItemList: PricingRuleCompilerItem[]): boolean => {
    const { product, operator, value } = condition;

    let conditionMeasuredQuantity = 0;
    if (product === 'subtotal') {
      conditionMeasuredQuantity = calculateSubtotal(oldItemList);
    } else if (product === 'totalQuantity') {
      conditionMeasuredQuantity = oldItemList.length;
    } else {
      conditionMeasuredQuantity = oldItemList.filter(i => i.sku === product).length;
    }

    if (operator === 'eq') {
      applyCounter = setSkuItemsActionAppliedCounter(product, conditionMeasuredQuantity, value);
      return applyCounter > 0 || conditionMeasuredQuantity === value;
    } else if (operator === 'gte') {
      return conditionMeasuredQuantity >= value;
    } else {
      return false;
    }
  }

  const generateNewItemListByAction = (action: Action, oldItemList: PricingRuleCompilerItem[]): PricingRuleCompilerItem[] => {
    const { product, type, value } = action;
    const appliedItems = oldItemList.filter(i => i.sku === product);
    const unappliedItems = oldItemList.filter(i => i.sku !== product);

    let newItemList = [...unappliedItems];

    if (appliedItems.length === 0) {
      return newItemList;
    }

    newItemList = [...generatePriceUpdateAppliedItemList(type, value, appliedItems), ...newItemList];

    return newItemList;
  }

  const generateNewItemListBySinglePricingRule = (oldItemList: PricingRuleCompilerItem[], pricingRule: PricingRule): PricingRuleCompilerItem[] => {
    const { conditions, action } = pricingRule;
    const conditionsMet = conditions.every(condition => evaluateConditionAgainstItemList(condition, oldItemList));

    let newItemList: PricingRuleCompilerItem[] = [];

    if (conditionsMet) {
      newItemList = generateNewItemListByAction(action, oldItemList);
    } else {
      newItemList = oldItemList;
    }

    return newItemList;
  }

  const calculateByPricingRules = (scannedProducts: Product[]): number => {
    if (!pricingRules) {
      return calculateSubtotal(scannedProducts);
    }

    itemList = scannedProducts.map(scannedProduct => {
      return {
        sku: scannedProduct.sku,
        price: scannedProduct.price
      }
    });

    pricingRules.forEach(pricingRule => {
      itemList = generateNewItemListBySinglePricingRule(getItemList(), pricingRule);
    });

    return calculateSubtotal(itemList);
  };

  const getItemList = () => {
    return JSON.parse(JSON.stringify(itemList));
  }

  return {
    generateNewItemListBySinglePricingRule,
    setSkuItemsActionAppliedCounter,
    calculateByPricingRules,
    generateNewItemListByAction,
    evaluateConditionAgainstItemList,
    getItemList
  }
});
