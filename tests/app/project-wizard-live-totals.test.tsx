// @vitest-environment jsdom

import "@testing-library/jest-dom/vitest";
import * as React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ProjectWizard } from "../../components/quotation/project-wizard";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn()
  })
}));

describe("ProjectWizard live totals", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          module: {
            id: "module-1",
            moduleCode: "TEMP-EDIT-001",
            moduleName: "可编辑模块",
            quantity: 2,
            unitPrice: 2100,
            lineTotal: 4200,
            moduleCategory: "thermal",
            specSummary: "测试模块",
            sourceRuleCode: "TEMP-BASE",
            selectionMode: "manual",
            isOverridden: true
          }
        })
      })
    );
  });

  it("updates subtotal and total-with-tax immediately after a successful manual adjustment", async () => {
    render(
      React.createElement(ProjectWizard, {
        project: {
          id: "project-1",
          title: "人工校正测试项目",
          projectCode: "Q-TEST-001",
          operatorUserId: "user-1",
          equipmentCategory: "temperature",
          applicationScenario: "测试实时联动",
          customerName: "华东测试科技",
          paymentTerms: "预付款 50%",
          deliveryTerms: "4 周",
          warrantyTerms: "12 个月"
        },
        modules: [
          {
            id: "module-1",
            moduleCode: "TEMP-EDIT-001",
            moduleName: "可编辑模块",
            quantity: 1,
            unitPrice: 1000,
            lineTotal: 1000,
            sourceRuleCode: "TEMP-BASE",
            selectionMode: "auto",
            isOverridden: false
          }
        ],
        input: {
          minTemperature: -10
        },
        totals: {
          equipmentSubtotal: 1000,
          shippingFee: 500,
          commissioningFee: 800,
          subtotalBeforeTax: 2300,
          totalWithTax: 2599
        },
        taxRate: 0.13
      })
    );

    expect(screen.getByText("设备小计：1000")).toBeInTheDocument();
    expect(screen.getByText("含税总价：2599")).toBeInTheDocument();

    const quantityInput = screen.getByDisplayValue("1");
    const unitPriceInput = screen.getByDisplayValue("1000");
    fireEvent.change(quantityInput, { target: { value: "2" } });
    fireEvent.change(unitPriceInput, { target: { value: "2100" } });
    fireEvent.click(screen.getByRole("button", { name: "保存人工校正" }));

    await waitFor(() => {
      expect(screen.getByText("设备小计：4200")).toBeInTheDocument();
      expect(screen.getByText("含税总价：6215")).toBeInTheDocument();
    });
  });
});
