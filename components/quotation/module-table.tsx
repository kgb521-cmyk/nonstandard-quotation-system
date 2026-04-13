import * as React from "react";

import type { ModuleLine } from "../../src/types/quotation";

export function ModuleTable({ modules }: { modules: ModuleLine[] }) {
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th align="left">模块编码</th>
          <th align="left">模块名称</th>
          <th align="left">数量</th>
          <th align="left">单价</th>
          <th align="left">金额</th>
          <th align="left">来源规则</th>
          <th align="left">人工校正</th>
        </tr>
      </thead>
      <tbody>
        {modules.map((module) => (
          <tr key={`${module.moduleCode}-${module.sourceRuleCode ?? "manual"}`}>
            <td>{module.moduleCode}</td>
            <td>{module.moduleName}</td>
            <td>{module.quantity}</td>
            <td>{module.unitPrice}</td>
            <td>{Number((module.lineTotal ?? module.quantity * module.unitPrice).toFixed(2))}</td>
            <td>{module.sourceRuleCode ?? "人工新增"}</td>
            <td>{module.isOverridden ? "已校正" : "自动"}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
