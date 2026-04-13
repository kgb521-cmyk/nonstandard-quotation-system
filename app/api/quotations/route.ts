import { NextResponse } from "next/server";
import { EquipmentCategory } from "@prisma/client";
import { listQuotationProjects } from "../../../src/server/db/quotation-repository";
import { prisma } from "../../../src/server/db/client";

export async function GET() {
  const projects = await listQuotationProjects();
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const customer = await prisma.customer.findFirst();
  const owner = await prisma.user.findFirst({
    where: {
      role: "sales"
    }
  });

  if (!customer || !owner) {
    return NextResponse.json({ error: "Missing seed data" }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    customerName?: string;
    projectTitle?: string;
    equipmentCategory?: keyof typeof EquipmentCategory;
    applicationScenario?: string;
    paymentTerms?: string;
    deliveryTerms?: string;
    warrantyTerms?: string;
  };

  const category = (() => {
    switch (body.equipmentCategory) {
      case "flow":
        return EquipmentCategory.flow;
      case "pressure":
        return EquipmentCategory.pressure;
      case "fluid":
        return EquipmentCategory.fluid;
      case "aging":
        return EquipmentCategory.aging;
      default:
        return EquipmentCategory.temperature;
    }
  })();

  const created = await prisma.quotationProject.create({
    data: {
      projectCode: `Q-${Date.now()}`,
      title: body.projectTitle?.trim() || "新建非标报价项目",
      customerId: customer.id,
      ownerUserId: owner.id,
      equipmentCategory: category,
      applicationScenario: body.applicationScenario?.trim() || "用于 MVP 新建项目示例",
      taxRate: 0.13,
      shippingFee: 500,
      commissioningFee: 1000,
      paymentTerms: body.paymentTerms?.trim() || "预付款 50%，验收后 50%",
      deliveryTerms: body.deliveryTerms?.trim() || "确认需求后 5 周",
      warrantyTerms: body.warrantyTerms?.trim() || "整机质保 12 个月",
      notes: body.customerName?.trim() ? `客户备注：${body.customerName.trim()}` : "通过 API 新建",
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
