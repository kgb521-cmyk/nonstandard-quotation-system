import { NextResponse } from "next/server";
import { getQuotationProjectById } from "../../../../../src/server/db/quotation-repository";
import { generateProposalHtml } from "../../../../../src/server/documents/generate-proposal-html";
import { generateSummaryHtml } from "../../../../../src/server/documents/generate-summary-html";
import { buildQuotationView } from "../../../../../src/server/quotation/build-quotation-view";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await getQuotationProjectById(id);

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
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

  return NextResponse.json({
    summaryHtml: generateSummaryHtml(view),
    proposalHtml: generateProposalHtml(view)
  });
}
