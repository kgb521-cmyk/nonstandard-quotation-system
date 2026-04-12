import { PrismaClient, DocumentType, EquipmentCategory, ProjectStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.quotationAdjustment.deleteMany();
  await prisma.quotationDocument.deleteMany();
  await prisma.ruleAuditLog.deleteMany();
  await prisma.matchedModule.deleteMany();
  await prisma.quotationInput.deleteMany();
  await prisma.quotationProject.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.user.deleteMany();

  const sales = await prisma.user.create({
    data: {
      name: "张晨",
      email: "sales@example.com",
      passwordHash: "hashed-sales-password",
      role: UserRole.sales
    }
  });

  const engineer = await prisma.user.create({
    data: {
      name: "李工",
      email: "engineer@example.com",
      passwordHash: "hashed-engineer-password",
      role: UserRole.engineer
    }
  });

  const admin = await prisma.user.create({
    data: {
      name: "王管理员",
      email: "admin@example.com",
      passwordHash: "hashed-admin-password",
      role: UserRole.admin
    }
  });

  const customer = await prisma.customer.create({
    data: {
      name: "华东实验室",
      company: "华东实验室科技有限公司",
      contactName: "陈敏",
      contactPhone: "13800001111",
      industry: "新能源",
      region: "上海",
      address: "上海市浦东新区张江路88号"
    }
  });

  const project = await prisma.quotationProject.create({
    data: {
      projectCode: "Q-20260412-001",
      title: "温控与控制系统报价示例",
      customerId: customer.id,
      ownerUserId: sales.id,
      equipmentCategory: EquipmentCategory.temperature,
      applicationScenario: "用于温控测试台架的示例报价项目",
      status: ProjectStatus.matched,
      currency: "CNY",
      taxRate: 0.13,
      shippingFee: 800,
      commissioningFee: 1200,
      paymentTerms: "合同签订后 30% 预付款，验收后 70%",
      deliveryTerms: "工厂交付，含基础安装指导",
      warrantyTerms: "整机质保 12 个月",
      notes: "用于 Task 2 的数据库与仓储烟雾测试",
      inputs: {
        create: {
          inputJson: {
            minTemperature: -20,
            maxTemperature: 120,
            controlMode: "PID",
            installationEnvironment: "indoor"
          }
        }
      },
      modules: {
        create: [
          {
            moduleCode: "TEMP-001",
            moduleName: "加热模块",
            moduleCategory: "temperature",
            specSummary: "双回路加热单元",
            quantity: 2,
            unit: "set",
            unitPrice: 5000,
            lineTotal: 10000,
            sourceRuleCode: "TEMP-BASE-HEAT",
            selectionMode: "auto",
            isOverridden: false,
            overrideReason: "",
            sortOrder: 1
          },
          {
            moduleCode: "CTRL-001",
            moduleName: "控制模块",
            moduleCategory: "control",
            specSummary: "PLC 控制与触摸屏",
            quantity: 1,
            unit: "set",
            unitPrice: 3000,
            lineTotal: 3000,
            sourceRuleCode: "CTRL-BASE",
            selectionMode: "auto",
            isOverridden: false,
            overrideReason: "",
            sortOrder: 2
          }
        ]
      },
      auditLogs: {
        create: [
          {
            ruleCode: "TEMP-BASE-HEAT",
            matched: true,
            message: "最低温度要求触发加热模块",
            payloadJson: {
              minTemperature: -20,
              maxTemperature: 120
            }
          },
          {
            ruleCode: "CTRL-BASE",
            matched: true,
            message: "控制模式触发标准控制模块",
            payloadJson: {
              controlMode: "PID"
            }
          }
        ]
      }
    }
  });

  await prisma.quotationDocument.create({
    data: {
      projectId: project.id,
      documentType: DocumentType.summary,
      title: "温控与控制系统精简报价单",
      htmlContent: "<h1>温控与控制系统精简报价单</h1>",
      createdByUserId: admin.id
    }
  });

  await prisma.quotationAdjustment.create({
    data: {
      projectId: project.id,
      moduleId: null,
      adjustmentType: "note",
      beforeValue: "initial",
      afterValue: "seeded",
      reason: "Smoke test record",
      operatorUserId: engineer.id
    }
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
