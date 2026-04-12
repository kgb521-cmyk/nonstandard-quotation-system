"use client";

"use client";

import * as React from "react";

import { Button } from "../ui/button";

export function PrintToolbar() {
  return (
    <div className="print-toolbar" style={{ display: "flex", gap: 12, marginBottom: 24 }}>
      <Button onClick={() => window.print()}>打印 / 导出 PDF</Button>
    </div>
  );
}
