import { describe, expect, it } from "vitest";
import { calculateQuotation } from "../../../src/server/quotation/calculate-quotation";

describe("calculateQuotation", () => {
  it("adds module totals, shipping, commissioning, and tax", () => {
    const result = calculateQuotation({
      modules: [
        { moduleCode: "TEMP-001", moduleName: "加热模块", quantity: 2, unitPrice: 5000 },
        { moduleCode: "CTRL-001", moduleName: "控制模块", quantity: 1, unitPrice: 3000 }
      ],
      shippingFee: 800,
      commissioningFee: 1200,
      taxRate: 0.13
    });

    expect(result.equipmentSubtotal).toBe(13000);
    expect(result.subtotalBeforeTax).toBe(15000);
    expect(result.totalWithTax).toBe(16950);
  });
});
