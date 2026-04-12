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
