import { calculateQuotation } from "./calculate-quotation";

const categoryLabels = {
  temperature: "温控设备",
  flow: "流量设备",
  pressure: "压力设备",
  fluid: "流体设备",
  aging: "老化测试设备"
} as const;

export type PersistedProjectForView = {
  projectCode: string;
  title: string;
  customer: { company: string };
  equipmentCategory: keyof typeof categoryLabels;
  applicationScenario: string;
  paymentTerms: string;
  deliveryTerms: string;
  warrantyTerms: string;
  shippingFee: number;
  commissioningFee: number;
  taxRate: number;
  modules: Array<{ moduleCode: string; moduleName: string; quantity: number; unitPrice: number }>;
};

export function buildQuotationView(project: PersistedProjectForView) {
  const totals = calculateQuotation({
    modules: project.modules,
    shippingFee: project.shippingFee,
    commissioningFee: project.commissioningFee,
    taxRate: project.taxRate
  });

  return {
    projectCode: project.projectCode,
    title: project.title,
    customerName: project.customer.company,
    equipmentCategoryLabel: categoryLabels[project.equipmentCategory],
    applicationScenario: project.applicationScenario,
    modules: totals.modules,
    totals,
    terms: {
      paymentTerms: project.paymentTerms,
      deliveryTerms: project.deliveryTerms,
      warrantyTerms: project.warrantyTerms
    }
  };
}
