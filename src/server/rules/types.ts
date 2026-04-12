import type { EquipmentCategory, ModuleLine, QuotationInputPayload } from "../../types/quotation";

export type ConditionOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "includes";

export interface RuleCondition {
  field: keyof QuotationInputPayload;
  operator: ConditionOperator;
  value: string | number;
}

export interface RuleAction {
  type: "addModule";
  moduleCode: string;
  moduleName: string;
  moduleCategory: string;
  specSummary: string;
  quantity: number;
  quantityFormula?: "ceilWorkstationsDiv8";
  unit: string;
  unitPrice: number;
  calculationNote: string;
}

export interface EquipmentRule {
  code: string;
  name: string;
  equipmentCategory: EquipmentCategory;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  description: string;
}

export interface MatchModulesResult {
  modules: ModuleLine[];
  auditLogs: Array<{ ruleCode: string; matched: boolean; message: string }>;
}
