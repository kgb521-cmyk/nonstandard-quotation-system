import { promises as fs } from "node:fs";
import path from "node:path";
import type { EquipmentCategory } from "../../types/quotation";
import type { EquipmentRule } from "./types";

const ruleFileMap: Record<EquipmentCategory, string> = {
  temperature: "temperature-control.json",
  flow: "flow.json",
  pressure: "pressure.json",
  fluid: "fluid.json",
  aging: "aging.json"
};

export async function loadRuleSet(category: EquipmentCategory): Promise<EquipmentRule[]> {
  const filePath = path.join(process.cwd(), "config", "rules", ruleFileMap[category]);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as EquipmentRule[];
}
