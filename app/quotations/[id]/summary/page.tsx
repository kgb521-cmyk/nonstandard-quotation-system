import { notFound } from "next/navigation";
import { SummaryDocument } from "../../../../components/documents/summary-document";
import { getQuotationProjectById } from "../../../../src/server/db/quotation-repository";
import { buildQuotationView } from "../../../../src/server/quotation/build-quotation-view";

export default async function SummaryPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getQuotationProjectById(id);

  if (!project) {
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

  return <SummaryDocument view={view} />;
}
