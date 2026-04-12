import * as React from "react";

export function PriceSummary({
  totals
}: {
  totals: {
    equipmentSubtotal: number;
    shippingFee: number;
    commissioningFee: number;
    subtotalBeforeTax: number;
    totalWithTax: number;
  };
}) {
  return (
    <div
      style={{
        display: "grid",
        gap: 12,
        background: "#fff7ec",
        border: "1px solid var(--line)",
        borderRadius: 20,
        padding: 20
      }}
    >
      <p>设备小计：{totals.equipmentSubtotal}</p>
      <p>运费/包装：{totals.shippingFee}</p>
      <p>安装调试费：{totals.commissioningFee}</p>
      <p>税前总价：{totals.subtotalBeforeTax}</p>
      <p>含税总价：{totals.totalWithTax}</p>
    </div>
  );
}
