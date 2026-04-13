import type { EquipmentCategory } from "../../types/quotation";
import { loadRuleSet } from "./load-rule-set";

const categoryLabels: Record<EquipmentCategory, string> = {
  temperature: "温控设备",
  flow: "流量设备",
  pressure: "压力设备",
  fluid: "流体设备",
  aging: "老化测试设备"
};

function formatAction(action: {
  moduleCode: string;
  quantity: number;
  quantityFormula?: string;
}) {
  if (action.quantityFormula === "ceilWorkstationsDiv8") {
    return `追加 ${action.moduleCode}，数量公式：ceil(workstations / 8)`;
  }

  return `追加 ${action.moduleCode}`;
}

export async function listRuleGroups() {
  const categories: EquipmentCategory[] = ["temperature", "flow", "pressure", "fluid", "aging"];

  return Promise.all(
    categories.map(async (category) => {
      const rules = await loadRuleSet(category);
      return {
        category,
        label: categoryLabels[category],
        rules: rules.map((rule) => ({
          code: rule.code,
          name: rule.name,
          description: rule.description,
          conditions:
            rule.conditions.length === 0
              ? ["默认命中"]
              : rule.conditions.map(
                  (condition) => `${String(condition.field)} ${condition.operator} ${String(condition.value)}`
                ),
          actions: rule.actions.map((action) => formatAction(action))
        }))
      };
    })
  );
}
