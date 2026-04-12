import { prisma } from "./client";

export async function listQuotationProjects() {
  return prisma.quotationProject.findMany({
    include: {
      customer: true,
      owner: true,
      modules: true,
      inputs: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}

export async function getQuotationProjectById(projectId: string) {
  return prisma.quotationProject.findUnique({
    where: { id: projectId },
    include: {
      customer: true,
      owner: true,
      modules: {
        orderBy: {
          sortOrder: "asc"
        }
      },
      inputs: true,
      auditLogs: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });
}

export async function saveManualModuleAdjustment(input: {
  projectId: string;
  moduleId: string;
  operatorUserId: string;
  quantity: number;
  unitPrice: number;
  reason: string;
}) {
  return prisma.$transaction(async (tx) => {
    const existingModule = await tx.matchedModule.findUnique({
      where: {
        id: input.moduleId
      }
    });

    if (!existingModule || existingModule.projectId !== input.projectId) {
      throw new Error("Module not found for project");
    }

    const beforeValue = JSON.stringify({
      quantity: existingModule.quantity,
      unitPrice: existingModule.unitPrice,
      lineTotal: existingModule.lineTotal,
      selectionMode: existingModule.selectionMode
    });

    const updatedModule = await tx.matchedModule.update({
      where: {
        id: input.moduleId
      },
      data: {
        quantity: input.quantity,
        unitPrice: input.unitPrice,
        lineTotal: Number((input.quantity * input.unitPrice).toFixed(2)),
        selectionMode: "manual",
        isOverridden: true,
        overrideReason: input.reason
      }
    });

    const adjustment = await tx.quotationAdjustment.create({
      data: {
        projectId: input.projectId,
        moduleId: input.moduleId,
        adjustmentType: "manual_module_override",
        beforeValue,
        afterValue: JSON.stringify({
          quantity: updatedModule.quantity,
          unitPrice: updatedModule.unitPrice,
          lineTotal: updatedModule.lineTotal,
          selectionMode: updatedModule.selectionMode
        }),
        reason: input.reason,
        operatorUserId: input.operatorUserId
      }
    });

    return {
      module: updatedModule,
      adjustment
    };
  });
}
