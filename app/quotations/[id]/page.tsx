import { notFound } from "next/navigation";
import { ProjectWizard } from "../../../components/quotation/project-wizard";
import { buildQuotationView } from "../../../src/server/quotation/build-quotation-view";
import { getQuotationProjectById } from "../../../src/server/db/quotation-repository";
import type { ModuleLine, QuotationInputPayload } from "../../../src/types/quotation";

export default async function QuotationDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getQuotationProjectById(id);

  if (!project || !project.inputs) {
    notFound();
  }

  const view = buildQuotationView({
    projectCode: project.projectCode,
    title: project.title,
    customer: { company: project.customer.company },
    equipmentCategory: project.equipmentCategory,
    applicationScenario: project.applicationScenario,
    paymentTerms: project.paymentTerms,
    deliveryTerms: project.deliveryTerms,
    warrantyTerms: project.warrantyTerms,
    shippingFee: project.shippingFee,
    commissioningFee: project.commissioningFee,
    taxRate: project.taxRate,
    modules: project.modules.map((module) => ({
      moduleCode: module.moduleCode,
      moduleName: module.moduleName,
      quantity: module.quantity,
      unitPrice: module.unitPrice
    }))
  });

  const modules: Array<ModuleLine & { id: string }> = project.modules.map((module) => ({
    id: module.id,
    moduleCode: module.moduleCode,
    moduleName: module.moduleName,
    moduleCategory: module.moduleCategory,
    specSummary: module.specSummary,
    quantity: module.quantity,
    unit: module.unit,
    unitPrice: module.unitPrice,
    lineTotal: module.lineTotal,
    sourceRuleCode: module.sourceRuleCode,
    calculationNote: "",
    selectionMode: module.selectionMode === "manual" ? "manual" : "auto",
    isOverridden: module.isOverridden
  }));

  return (
    <ProjectWizard
      project={{
        id: project.id,
        title: project.title,
        projectCode: project.projectCode,
        operatorUserId: project.ownerUserId,
        equipmentCategory: project.equipmentCategory,
        applicationScenario: project.applicationScenario,
        customerName: project.customer.company,
        paymentTerms: project.paymentTerms,
        deliveryTerms: project.deliveryTerms,
        warrantyTerms: project.warrantyTerms
      }}
      modules={modules}
      input={project.inputs.inputJson as unknown as QuotationInputPayload}
      totals={view.totals}
    />
  );
}
