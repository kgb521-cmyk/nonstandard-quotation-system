import * as React from "react";

import { Card } from "../ui/card";

type RuleGroup = {
  category: string;
  label: string;
  rules: Array<{
    code: string;
    name: string;
    description: string;
    conditions: string[];
    actions: string[];
  }>;
};

export function RuleCatalog({ groups }: { groups: RuleGroup[] }) {
  return (
    <main style={{ padding: 32, display: "grid", gap: 24 }}>
      <Card>
        <h1>规则查看</h1>
        <p>按设备类型查看当前启用的规则、命中条件和动作模块，便于销售和工程快速解释选型依据。</p>
      </Card>
      {groups.map((group) => (
        <Card key={group.category}>
          <h2>{group.label}</h2>
          <div style={{ display: "grid", gap: 16 }}>
            {group.rules.map((rule) => (
              <section
                key={rule.code}
                style={{
                  border: "1px solid var(--line)",
                  borderRadius: 18,
                  padding: 16,
                  background: "#fffdf9"
                }}
              >
                <h3 style={{ marginTop: 0 }}>{rule.name}</h3>
                <p style={{ color: "var(--muted)" }}>{rule.description}</p>
                <p style={{ marginBottom: 8 }}>条件：</p>
                <ul>
                  {rule.conditions.map((condition) => (
                    <li key={`${rule.code}-${condition}`}>{condition}</li>
                  ))}
                </ul>
                <p style={{ marginBottom: 8 }}>动作：</p>
                <ul>
                  {rule.actions.map((action) => (
                    <li key={`${rule.code}-${action}`}>{action}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </Card>
      ))}
    </main>
  );
}
