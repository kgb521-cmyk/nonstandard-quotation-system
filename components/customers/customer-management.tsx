"use client";

import * as React from "react";

import { startTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";

type CustomerListItem = {
  id: string;
  company: string;
  contactName: string;
  industry: string;
  region: string;
};

export function CustomerManagement({
  initialCustomers
}: {
  initialCustomers: CustomerListItem[];
}) {
  const router = useRouter();
  const [customers, setCustomers] = useState(initialCustomers);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    company: "",
    contactName: "",
    contactPhone: "",
    industry: "",
    region: "",
    address: ""
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

    const response = await fetch("/api/customers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    if (!response.ok) {
      setIsSubmitting(false);
      setError("新增客户失败，请稍后重试。");
      return;
    }

    const created = (await response.json()) as CustomerListItem;
    setCustomers((current) => [created, ...current]);
    setForm({
      company: "",
      contactName: "",
      contactPhone: "",
      industry: "",
      region: "",
      address: ""
    });
    setIsSubmitting(false);

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <main style={{ padding: 32, display: "grid", gap: 24 }}>
      <Card>
        <h1>客户管理</h1>
        <p>维护客户基础资料，后续新建报价项目时可以直接复用。</p>
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, marginTop: 20 }}>
          <label>
            <span>客户公司</span>
            <Input
              aria-label="客户公司"
              value={form.company}
              onChange={(event) => updateField("company", event.target.value)}
            />
          </label>
          <label>
            <span>联系人</span>
            <Input
              aria-label="联系人"
              value={form.contactName}
              onChange={(event) => updateField("contactName", event.target.value)}
            />
          </label>
          <label>
            <span>联系电话</span>
            <Input
              aria-label="联系电话"
              value={form.contactPhone}
              onChange={(event) => updateField("contactPhone", event.target.value)}
            />
          </label>
          <label>
            <span>行业</span>
            <Input
              aria-label="行业"
              value={form.industry}
              onChange={(event) => updateField("industry", event.target.value)}
            />
          </label>
          <label>
            <span>区域</span>
            <Input
              aria-label="区域"
              value={form.region}
              onChange={(event) => updateField("region", event.target.value)}
            />
          </label>
          <label>
            <span>地址</span>
            <Input
              aria-label="地址"
              value={form.address}
              onChange={(event) => updateField("address", event.target.value)}
            />
          </label>
          {error ? <p style={{ margin: 0, color: "var(--accent)" }}>{error}</p> : null}
          <div>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "保存中..." : "新增客户"}
            </Button>
          </div>
        </form>
      </Card>
      <Card>
        <h2>客户列表</h2>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          {customers.map((customer) => (
            <li key={customer.id} style={{ marginBottom: 10 }}>
              <strong>{customer.company}</strong>
              <div>
                联系人：{customer.contactName} · 行业：{customer.industry} · 区域：{customer.region}
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
