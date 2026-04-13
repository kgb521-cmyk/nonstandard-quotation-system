import { RuleCatalog } from "../../components/rules/rule-catalog";
import { listRuleGroups } from "../../src/server/rules/list-rule-groups";

export default async function RulesPage() {
  const groups = await listRuleGroups();
  return <RuleCatalog groups={groups} />;
}
