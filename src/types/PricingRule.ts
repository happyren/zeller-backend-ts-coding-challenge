export type PricingRule = {
  conditions: Condition[];
  action: Action;
};

/**
 * @description A condition is a set of rules that must be met in order for the action to be applied
 * @example Product A must be more than 3 in quantity => { product: 'A', operator: 'gte', value: 3 }
 * 
 * product can be a [sku, subtotal (price) or totalQuantity]
 * they can be [equal (eq) or greater than or equal (gte)]
 * to a [value]
 */
export type Condition = {
  product: string | 'subtotal' | 'totalQuantity';
  operator: 'eq' | 'gte';
  value: number;
}

/**
 * @description An action is a set of rules that will be applied to the product
 * @example Product A will be discounted by 10% => { product: 'A', type: 'discount', value: 10 }
 * @example Product A will have one free item => { product: 'A', type: 'free', value: 1 }
 * 
 * product [sku]
 * can enjoy a [discount, free or fixedPrice]
 * of [value]
 */
export type Action = {
  product: string;
  type: 'discount' | 'free' | 'fixedPrice';
  value: number;
}