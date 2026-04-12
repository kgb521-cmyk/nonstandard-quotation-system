import type { QuotationInputPayload } from "../../types/quotation";
import type { RuleCondition } from "./types";

export function evaluateCondition(input: QuotationInputPayload, condition: RuleCondition): boolean {
  const actual = input[condition.field];

  switch (condition.operator) {
    case "eq":
      return actual === condition.value;
    case "neq":
      return actual !== condition.value;
    case "gt":
      return typeof actual === "number" && actual > Number(condition.value);
    case "gte":
      return typeof actual === "number" && actual >= Number(condition.value);
    case "lt":
      return typeof actual === "number" && actual < Number(condition.value);
    case "lte":
      return typeof actual === "number" && actual <= Number(condition.value);
    case "includes":
      return typeof actual === "string" && actual.includes(String(condition.value));
    default:
      return false;
  }
}
