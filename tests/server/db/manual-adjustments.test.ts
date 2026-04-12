import { EquipmentCategory, UserRole } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../../../src/server/db/client";
import { saveManualModuleAdjustment } from "../../../src/server/db/quotation-repository";

describe("saveManualModuleAdjustment", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("persists overridden quantity and unit price while recording an adjustment log", async () => {
    const suffix = Date.now().toString();

    const engineer = await prisma.user.create({
      data: {
        name: `工程师-${suffix}`,
        email: `engineer-${suffix}@example.com`,
        passwordHash: "hashed-password",
        role: UserRole.engineer
      }
    });

    const customer = await prisma.customer.create({
      data: {
        name: `客户-${suffix}`,
        company: `客户公司-${suffix}`,
        contactName: "测试联系人",
        contactPhone: "13900000000",
        industry: "汽车",
        region: "上海",
        address: "测试地址"
      }
    });

    const project = await prisma.quotationProject.create({
      data: {
        projectCode: `Q-TEST-${suffix}`,
        title: "人工校正测试项目",
        customerId: customer.id,
        ownerUserId: engineer.id,
        equipmentCategory: EquipmentCategory.temperature,
        applicationScenario: "测试人工校正",
        taxRate: 0.13,
        shippingFee: 500,
        commissioningFee: 800,
        paymentTerms: "预付款 50%",
        deliveryTerms: "4 周",
        warrantyTerms: "12 个月",
        notes: "manual adjustment test",
        modules: {
          create: {
            moduleCode: "TEMP-EDIT-001",
            moduleName: "可编辑模块",
            moduleCategory: "thermal",
            specSummary: "测试模块",
            quantity: 1,
            unit: "套",
            unitPrice: 1000,
            lineTotal: 1000,
            sourceRuleCode: "TEMP-BASE",
            selectionMode: "auto",
            overrideReason: "",
            sortOrder: 1
          }
        }
      },
      include: {
        modules: true
      }
    });

    const module = project.modules[0];

    const result = await saveManualModuleAdjustment({
      projectId: project.id,
      moduleId: module.id,
      operatorUserId: engineer.id,
      quantity: 3,
      unitPrice: 1800,
      reason: "客户要求提高配置"
    });

    expect(result.module.quantity).toBe(3);
    expect(result.module.unitPrice).toBe(1800);
    expect(result.module.lineTotal).toBe(5400);
    expect(result.module.selectionMode).toBe("manual");
    expect(result.module.isOverridden).toBe(true);

    const adjustment = await prisma.quotationAdjustment.findFirst({
      where: {
        projectId: project.id,
        moduleId: module.id
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    expect(adjustment?.afterValue).toContain("\"quantity\":3");
    expect(adjustment?.afterValue).toContain("\"unitPrice\":1800");

    await prisma.quotationAdjustment.deleteMany({
      where: {
        projectId: project.id
      }
    });
    await prisma.matchedModule.deleteMany({
      where: {
        projectId: project.id
      }
    });
    await prisma.quotationProject.delete({
      where: {
        id: project.id
      }
    });
    await prisma.customer.delete({
      where: {
        id: customer.id
      }
    });
    await prisma.user.delete({
      where: {
        id: engineer.id
      }
    });
  });
});
