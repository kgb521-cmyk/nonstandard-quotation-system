import type { ModuleLine } from "../../types/quotation";

export interface CalculationInput {
  modules: Array<Pick<ModuleLine, "moduleCode" | "moduleName" | "quantity" | "unitPrice">>;
  shippingFee: number;
  commissioningFee: number;
  taxRate: number;
}

export function calculateQuotation(input: CalculationInput) {
  const modules = input.modules.map((module) => ({
    ...module,
    lineTotal: Number((module.quantity * module.unitPrice).toFixed(2))
  }));

  const equipmentSubtotal = modules.reduce((sum, module) => sum + module.lineTotal, 0);
  const subtotalBeforeTax = equipmentSubtotal + input.shippingFee + input.commissioningFee;
  const totalWithTax = Number((subtotalBeforeTax * (1 + input.taxRate)).toFixed(2));

  return {
    modules,
    equipmentSubtotal,
    shippingFee: input.shippingFee,
    commissioningFee: input.commissioningFee,
    subtotalBeforeTax,
    totalWithTax
  };
}
