import * as React from "react";

import { PrintToolbar } from "./print-toolbar";
import { PriceSummary } from "../quotation/price-summary";

type SummaryView = {
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

export function SummaryDocument({ view }: { view: SummaryView }) {
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
      <h1>非标检测设备报价单</h1>
      <h2>{view.title}</h2>
      <p>项目编号：{view.projectCode}</p>
      <p>客户名称：{view.customerName}</p>
      <p>设备类型：{view.equipmentCategoryLabel}</p>
      <p>应用场景：{view.applicationScenario}</p>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 20 }}>
        <thead>
          <tr>
            <th align="left">模块</th>
            <th align="left">数量</th>
            <th align="left">单价</th>
            <th align="left">金额</th>
          </tr>
        </thead>
        <tbody>
          {view.modules.map((module) => (
            <tr key={module.moduleCode}>
              <td>{module.moduleName}</td>
              <td>{module.quantity}</td>
              <td>{module.unitPrice}</td>
              <td>{module.lineTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 24 }}>
        <PriceSummary totals={view.totals} />
      </div>
      <p>付款条款：{view.terms.paymentTerms}</p>
      <p>交付周期：{view.terms.deliveryTerms}</p>
      <p>质保条款：{view.terms.warrantyTerms}</p>
    </main>
  );
}
