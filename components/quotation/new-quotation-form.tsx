"use client";

import * as React from "react";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

const equipmentOptions = [
  { value: "temperature", label: "温控设备" },
  { value: "flow", label: "流量设备" },
  { value: "pressure", label: "压力设备" },
  { value: "fluid", label: "流体设备" },
  { value: "aging", label: "老化测试设备" }
] as const;

export function NewQuotationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    customerName: "",
    projectTitle: "",
    equipmentCategory: "temperature",
    applicationScenario: "",
    paymentTerms: "预付款 50%，验收后 50%",
    deliveryTerms: "确认需求后 5 周",
    warrantyTerms: "整机质保 12 个月"
  });

  function updateField(name: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/quotations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setIsSubmitting(false);
      setError("创建项目失败，请检查基础数据或稍后重试。");
      return;
    }

    const created = (await response.json()) as { id: string };
    startTransition(() => {
      router.push(`/quotations/${created.id}`);
      router.refresh();
    });
  }

  return (
    <main style={{ padding: 32 }}>
      <Card>
        <h1>新建报价项目</h1>
        <p>录入客户、项目和商务基础信息后，系统会为你创建一个新的报价项目。</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16, marginTop: 20 }}>
          <label>
            <span>客户名称</span>
            <Input
              aria-label="客户名称"
              value={form.customerName}
              onChange={(event) => updateField("customerName", event.target.value)}
              placeholder="例如：华东测试科技"
            />
          </label>
          <label>
            <span>项目名称</span>
            <Input
              aria-label="项目名称"
              value={form.projectTitle}
              onChange={(event) => updateField("projectTitle", event.target.value)}
              placeholder="例如：新能源汽车电池包温控测试台"
            />
          </label>
          <label>
            <span>设备类型</span>
            <select
              aria-label="设备类型"
              value={form.equipmentCategory}
              onChange={(event) => updateField("equipmentCategory", event.target.value)}
              style={{
                width: "100%",
                borderRadius: 14,
                border: "1px solid var(--line)",
                padding: "12px 14px",
                background: "#fffdf9"
              }}
            >
              {equipmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>应用场景</span>
            <textarea
              aria-label="应用场景"
              value={form.applicationScenario}
              onChange={(event) => updateField("applicationScenario", event.target.value)}
              placeholder="例如：用于电池包高低温循环测试"
              rows={4}
              style={{
                width: "100%",
                borderRadius: 14,
                border: "1px solid var(--line)",
                padding: "12px 14px",
                background: "#fffdf9",
                resize: "vertical"
              }}
            />
          </label>
          <label>
            <span>付款条款</span>
            <Input
              aria-label="付款条款"
              value={form.paymentTerms}
              onChange={(event) => updateField("paymentTerms", event.target.value)}
            />
          </label>
          <label>
            <span>交付周期</span>
            <Input
              aria-label="交付周期"
              value={form.deliveryTerms}
              onChange={(event) => updateField("deliveryTerms", event.target.value)}
            />
          </label>
          <label>
            <span>质保条款</span>
            <Input
              aria-label="质保条款"
              value={form.warrantyTerms}
              onChange={(event) => updateField("warrantyTerms", event.target.value)}
            />
          </label>
          {error ? <p style={{ color: "#b3522b", margin: 0 }}>{error}</p> : null}
          <div>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "创建中..." : "创建并进入项目"}
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
}
