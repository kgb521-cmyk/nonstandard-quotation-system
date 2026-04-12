import * as React from "react";

import { PrintToolbar } from "./print-toolbar";

type ProposalView = {
  projectCode: string;
  title: string;
  customerName: string;
  equipmentCategoryLabel: string;
  applicationScenario: string;
  modules: Array<{ moduleCode: string; moduleName: string; quantity: number; unitPrice: number; lineTotal: number }>;
  totals: {
    equipmentSubtotal: number;
    shippingFee: number;
    commissioningFee: number;
    subtotalBeforeTax: number;
    totalWithTax: number;
  };
  terms: { paymentTerms: string; deliveryTerms: string; warrantyTerms: string };
};

export function ProposalDocument({ view }: { view: ProposalView }) {
  return (
    <main style={{ background: "white", minHeight: "100vh", padding: 40 }}>
      <style>{`
        @media print {
          .print-toolbar {
            display: none !important;
          }
          body {
            background: white;
          }
          main {
            padding: 0 !important;
          }
        }
      `}</style>
      <PrintToolbar />
      <h1>非标检测设备报价方案书</h1>
      <h2>{view.title}</h2>
      <p>客户：{view.customerName}</p>
      <p>设备类型：{view.equipmentCategoryLabel}</p>
      <section>
        <h3>客户需求摘要</h3>
        <p>{view.applicationScenario}</p>
      </section>
      <section>
        <h3>推荐模块明细</h3>
        <ul>
          {view.modules.map((module) => (
            <li key={module.moduleCode}>
              {module.moduleName} × {module.quantity}，单价 {module.unitPrice}，金额 {module.lineTotal}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h3>报价明细</h3>
        <p>设备小计：{view.totals.equipmentSubtotal}</p>
        <p>运费/包装：{view.totals.shippingFee}</p>
        <p>安装调试费：{view.totals.commissioningFee}</p>
        <p>税前总价：{view.totals.subtotalBeforeTax}</p>
        <p>含税总价：{view.totals.totalWithTax}</p>
      </section>
      <section>
        <h3>交付范围</h3>
        <p>含设备主体、控制系统、必要管路及现场安装调试指导。</p>
      </section>
      <section>
        <h3>商务条款</h3>
        <p>{view.terms.paymentTerms}</p>
        <p>{view.terms.deliveryTerms}</p>
        <p>{view.terms.warrantyTerms}</p>
      </section>
    </main>
  );
}
