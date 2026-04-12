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
