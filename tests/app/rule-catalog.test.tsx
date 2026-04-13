// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RuleCatalog } from "../../components/rules/rule-catalog";

describe("RuleCatalog", () => {
  it("renders grouped equipment rules with conditions and actions", () => {
    render(
      React.createElement(RuleCatalog, {
        groups: [
          {
            category: "temperature",
            label: "温控设备",
            rules: [
              {
                code: "TEMP-LOW-REFRIG",
                name: "低温制冷扩展",
                description: "最低温度低于 -20℃ 时追加制冷模块",
                conditions: ["minTemperature lt -20"],
                actions: ["追加 TEMP-REFRIG-LOW"]
              }
            ]
          }
        ]
      })
    );

    expect(screen.getByText("规则查看")).toBeInTheDocument();
    expect(screen.getByText("温控设备")).toBeInTheDocument();
    expect(screen.getByText("低温制冷扩展")).toBeInTheDocument();
    expect(screen.getByText("minTemperature lt -20")).toBeInTheDocument();
    expect(screen.getByText("追加 TEMP-REFRIG-LOW")).toBeInTheDocument();
  });
});
