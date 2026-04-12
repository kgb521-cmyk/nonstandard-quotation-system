export const sampleQuotationView = {
  projectCode: "Q-2026-001",
  title: "新能源汽车电池包温控测试台",
  customerName: "华东测试科技",
  equipmentCategoryLabel: "温控设备",
  applicationScenario: "用于电池包高低温循环测试",
  modules: [
    {
      moduleCode: "TEMP-HEAT-BASE",
      moduleName: "基础加热模块",
      quantity: 1,
      unitPrice: 12000,
      lineTotal: 12000
    },
    {
      moduleCode: "TEMP-REFRIG-LOW",
      moduleName: "低温制冷模块",
      quantity: 1,
      unitPrice: 18000,
      lineTotal: 18000
    }
  ],
  totals: {
    equipmentSubtotal: 30000,
    shippingFee: 800,
    commissioningFee: 1200,
    subtotalBeforeTax: 32000,
    totalWithTax: 36160
  },
  terms: {
    paymentTerms: "预付款 50%，验收后 50%",
    deliveryTerms: "收到预付款后 6 周",
    warrantyTerms: "整机质保 12 个月"
  }
};
