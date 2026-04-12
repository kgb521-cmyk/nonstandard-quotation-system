type SummaryView = {
  projectCode: string;
  title: string;
  customerName: string;
  equipmentCategoryLabel: string;
  applicationScenario: string;
  modules: Array<{ moduleName: string; quantity: number; unitPrice: number; lineTotal: number }>;
  totals: {
    equipmentSubtotal: number;
    shippingFee: number;
    commissioningFee: number;
    subtotalBeforeTax: number;
    totalWithTax: number;
  };
  terms: { paymentTerms: string; deliveryTerms: string; warrantyTerms: string };
};

export function generateSummaryHtml(view: SummaryView) {
  const rows = view.modules
    .map(
      (module) =>
        `<tr><td>${module.moduleName}</td><td>${module.quantity}</td><td>${module.unitPrice}</td><td>${module.lineTotal}</td></tr>`
    )
    .join("");

  return `
    <html lang="zh-CN">
      <body>
        <h1>非标检测设备报价单</h1>
        <p>项目编号：${view.projectCode}</p>
        <p>客户名称：${view.customerName}</p>
        <p>设备类型：${view.equipmentCategoryLabel}</p>
        <p>应用场景：${view.applicationScenario}</p>
        <table>${rows}</table>
        <p>设备小计：${view.totals.equipmentSubtotal}</p>
        <p>税前总价：${view.totals.subtotalBeforeTax}</p>
        <p>含税总价：${view.totals.totalWithTax}</p>
        <p>付款条款：${view.terms.paymentTerms}</p>
        <p>交付周期：${view.terms.deliveryTerms}</p>
        <p>质保条款：${view.terms.warrantyTerms}</p>
      </body>
    </html>
  `;
}
