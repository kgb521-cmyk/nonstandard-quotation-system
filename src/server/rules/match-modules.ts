import type { EquipmentCategory, ModuleLine, QuotationInputPayload } from "../../types/quotation";
import { evaluateCondition } from "./evaluate-condition";
import { loadRuleSet } from "./load-rule-set";
import type { MatchModulesResult, RuleAction } from "./types";

function resolveQuantity(action: RuleAction, input: QuotationInputPayload): number {
  if (action.quantityFormula === "ceilWorkstationsDiv8") {
    return Math.max(1, Math.ceil((input.workstationCount ?? 1) / 8));
  }

  return action.quantity;
}

export async function matchModules(
  category: EquipmentCategory,
  input: QuotationInputPayload
): Promise<MatchModulesResult> {
  const rules = (await loadRuleSet(category)).sort((left, right) => left.priority - right.priority);
  const modules: ModuleLine[] = [];
  const auditLogs: MatchModulesResult["auditLogs"] = [];

  for (const rule of rules) {
    const matched =
      rule.conditions.length === 0 || rule.conditions.every((condition) => evaluateCondition(input, condition));

    auditLogs.push({
      ruleCode: rule.code,
      matched,
      message: matched ? `命中规则 ${rule.name}` : `未命中规则 ${rule.name}`
    });

    if (!matched) {
      continue;
    }

    for (const action of rule.actions) {
      modules.push({
        moduleCode: action.moduleCode,
        moduleName: action.moduleName,
        moduleCategory: action.moduleCategory,
        specSummary: action.specSummary,
        quantity: resolveQuantity(action, input),
        unit: action.unit,
        unitPrice: action.unitPrice,
        sourceRuleCode: rule.code,
        calculationNote: action.calculationNote,
        selectionMode: "auto",
        isOverridden: false
      });
    }
  }

  return { modules, auditLogs };
}
