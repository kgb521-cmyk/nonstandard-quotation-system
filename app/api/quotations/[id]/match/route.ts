import { NextResponse } from "next/server";
import { ProjectStatus } from "@prisma/client";
import { prisma } from "../../../../../src/server/db/client";
import { getQuotationProjectById } from "../../../../../src/server/db/quotation-repository";
import { matchModules } from "../../../../../src/server/rules/match-modules";
import type { QuotationInputPayload } from "../../../../../src/types/quotation";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const project = await getQuotationProjectById(id);

  if (!project || !project.inputs) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const result = await matchModules(
    project.equipmentCategory,
    project.inputs.inputJson as unknown as QuotationInputPayload
  );

  await prisma.$transaction([
    prisma.matchedModule.deleteMany({
      where: { projectId: id }
    }),
    prisma.ruleAuditLog.deleteMany({
      where: { projectId: id }
    }),
    prisma.quotationProject.update({
      where: { id },
      data: {
        status: ProjectStatus.matched,
        modules: {
          create: result.modules.map((module, index) => ({
            moduleCode: module.moduleCode,
            moduleName: module.moduleName,
            moduleCategory: module.moduleCategory ?? "general",
            specSummary: module.specSummary ?? "",
            quantity: module.quantity,
            unit: module.unit ?? "套",
            unitPrice: module.unitPrice,
            lineTotal: module.quantity * module.unitPrice,
            sourceRuleCode: module.sourceRuleCode ?? "",
            selectionMode: module.selectionMode ?? "auto",
            isOverridden: Boolean(module.isOverridden),
            overrideReason: "",
            sortOrder: index + 1
          }))
        },
        auditLogs: {
          create: result.auditLogs.map((log) => ({
            ruleCode: log.ruleCode,
            matched: log.matched,
            message: log.message,
            payloadJson: project.inputs?.inputJson ?? {}
          }))
        }
      }
    })
  ]);

  return NextResponse.json(result);
}
