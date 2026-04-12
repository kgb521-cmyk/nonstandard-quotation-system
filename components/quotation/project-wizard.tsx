import { Card } from "../ui/card";
import { ManualAdjustmentPanel } from "./manual-adjustment-panel";
import { ModuleTable } from "./module-table";
import { PriceSummary } from "./price-summary";
import type { ModuleLine, QuotationInputPayload } from "../../src/types/quotation";

export function ProjectWizard({
  project,
  modules,
  input,
  totals
}: {
  project: {
    id: string;
    title: string;
    projectCode: string;
    operatorUserId: string;
    equipmentCategory: string;
    applicationScenario: string;
    customerName: string;
    paymentTerms: string;
    deliveryTerms: string;
    warrantyTerms: string;
  };
  modules: Array<ModuleLine & { id: string }>;
  input: QuotationInputPayload;
  totals: {
    equipmentSubtotal: number;
    shippingFee: number;
    commissioningFee: number;
    subtotalBeforeTax: number;
    totalWithTax: number;
  };
}) {
  return (
    <main style={{ padding: 32, display: "grid", gap: 20 }}>
      <Card>
        <h2>1. 客户与项目基本信息</h2>
        <p>项目名称：{project.title}</p>
        <p>项目编号：{project.projectCode}</p>
        <p>客户：{project.customerName}</p>
        <p>设备类型：{project.equipmentCategory}</p>
        <p>应用场景：{project.applicationScenario}</p>
      </Card>
      <Card>
        <h2>2. 技术参数录入</h2>
        <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{JSON.stringify(input, null, 2)}</pre>
      </Card>
      <Card>
        <h2>3. 自动匹配模块与人工校正</h2>
        <p>当前 MVP 支持直接校正模块数量、单价和备注，保存后会写入数据库并记录调整日志。</p>
        <ModuleTable modules={modules} />
        <ManualAdjustmentPanel
          projectId={project.id}
          operatorUserId={project.operatorUserId}
          modules={modules}
        />
      </Card>
      <Card>
        <h2>4. 报价结果与文档生成</h2>
        <PriceSummary totals={totals} />
        <p>付款条款：{project.paymentTerms}</p>
        <p>交付周期：{project.deliveryTerms}</p>
        <p>质保条款：{project.warrantyTerms}</p>
      </Card>
    </main>
  );
}
