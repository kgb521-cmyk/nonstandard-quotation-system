import { describe, expect, it } from "vitest";
import { generateProposalHtml } from "../../../src/server/documents/generate-proposal-html";
import { generateSummaryHtml } from "../../../src/server/documents/generate-summary-html";

const quotationView = {
  projectCode: "Q-2026-001",
  title: "新能源汽车电池包温控测试台",
  customerName: "华东测试科技",
  equipmentCategoryLabel: "温控设备",
  applicationScenario: "用于电池包高低温循环测试",
  modules: [
    { moduleCode: "TEMP-HEAT-BASE", moduleName: "基础加热模块", quantity: 1, unitPrice: 12000, lineTotal: 12000 }
  ],
  totals: {
    equipmentSubtotal: 12000,
    shippingFee: 800,
    commissioningFee: 1200,
    subtotalBeforeTax: 14000,
    totalWithTax: 15820
  },
  terms: {
    paymentTerms: "预付款 50%，验收后 50%",
    deliveryTerms: "收到预付款后 6 周",
    warrantyTerms: "整机质保 12 个月"
  }
};

describe("document generators", () => {
  it("renders summary and proposal HTML with commercial terms", () => {
    expect(generateSummaryHtml(quotationView)).toContain("报价单");
    expect(generateSummaryHtml(quotationView)).toContain("预付款 50%");
    expect(generateProposalHtml(quotationView)).toContain("方案书");
    expect(generateProposalHtml(quotationView)).toContain("交付范围");
  });
});
