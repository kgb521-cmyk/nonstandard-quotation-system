import { NextResponse } from "next/server";
import { EquipmentCategory } from "@prisma/client";
import { listQuotationProjects } from "../../../src/server/db/quotation-repository";
import { prisma } from "../../../src/server/db/client";

export async function GET() {
  const projects = await listQuotationProjects();
  return NextResponse.json(projects);
}

export async function POST() {
  const customer = await prisma.customer.findFirst();
  const owner = await prisma.user.findFirst({
    where: {
      role: "sales"
    }
  });

  if (!customer || !owner) {
    return NextResponse.json({ error: "Missing seed data" }, { status: 400 });
  }

  const created = await prisma.quotationProject.create({
    data: {
      projectCode: `Q-${Date.now()}`,
      title: "新建非标报价项目",
      customerId: customer.id,
      ownerUserId: owner.id,
      equipmentCategory: EquipmentCategory.temperature,
      applicationScenario: "用于 MVP 新建项目示例",
      taxRate: 0.13,
      shippingFee: 500,
      commissioningFee: 1000,
      paymentTerms: "预付款 50%，验收后 50%",
      deliveryTerms: "确认需求后 5 周",
      warrantyTerms: "整机质保 12 个月",
      notes: "通过 API 新建",
      inputs: {
        create: {
          inputJson: {
            minTemperature: -10,
            maxTemperature: 90,
            controlMode: "PLC"
          }
        }
      }
    }
  });

  return NextResponse.json(created, { status: 201 });
}
