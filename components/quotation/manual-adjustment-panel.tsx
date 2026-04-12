"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import type { ModuleLine } from "../../src/types/quotation";
import { Button } from "../ui/button";

type DraftState = Record<string, { quantity: string; unitPrice: string; reason: string }>;

export function ManualAdjustmentPanel({
  projectId,
  operatorUserId,
  modules
}: {
  projectId: string;
  operatorUserId: string;
  modules: Array<ModuleLine & { id: string }>;
}) {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [drafts, setDrafts] = useState<DraftState>(() =>
    Object.fromEntries(
      modules.map((module) => [
        module.id,
        {
          quantity: String(module.quantity),
          unitPrice: String(module.unitPrice),
          reason: module.isOverridden ? "再次校正" : "人工校正"
        }
      ])
    )
  );

  function updateDraft(moduleId: string, field: "quantity" | "unitPrice" | "reason", value: string) {
    setDrafts((current) => ({
      ...current,
      [moduleId]: {
        ...current[moduleId],
        [field]: value
      }
    }));
  }

  async function save(moduleId: string) {
    const draft = drafts[moduleId];
    setSavingId(moduleId);
    setMessage("");

    const response = await fetch(`/api/quotations/${projectId}/adjustments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        moduleId,
        operatorUserId,
        quantity: Number(draft.quantity),
        unitPrice: Number(draft.unitPrice),
        reason: draft.reason
      })
    });

    if (!response.ok) {
      setSavingId(null);
      setMessage("保存失败，请稍后重试。");
      return;
    }

    setMessage("人工校正已保存。");
    setSavingId(null);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
      {modules.map((module) => (
        <div
          key={module.id}
          style={{
            border: "1px solid var(--line)",
            borderRadius: 18,
            padding: 16,
            background: "#fffdf9"
          }}
        >
          <strong>{module.moduleName}</strong>
          <p style={{ margin: "8px 0", color: "var(--muted)" }}>
            {module.moduleCode} · 当前金额 {Number(module.quantity * module.unitPrice).toFixed(2)}
          </p>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
            <label>
              <span>数量</span>
              <input
                value={drafts[module.id]?.quantity ?? ""}
                onChange={(event) => updateDraft(module.id, "quantity", event.target.value)}
                style={{ display: "block", width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 12, border: "1px solid var(--line)" }}
              />
            </label>
            <label>
              <span>单价</span>
              <input
                value={drafts[module.id]?.unitPrice ?? ""}
                onChange={(event) => updateDraft(module.id, "unitPrice", event.target.value)}
                style={{ display: "block", width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 12, border: "1px solid var(--line)" }}
              />
            </label>
            <label>
              <span>校正原因</span>
              <input
                value={drafts[module.id]?.reason ?? ""}
                onChange={(event) => updateDraft(module.id, "reason", event.target.value)}
                style={{ display: "block", width: "100%", marginTop: 6, padding: "10px 12px", borderRadius: 12, border: "1px solid var(--line)" }}
              />
            </label>
          </div>
          <div style={{ marginTop: 12 }}>
            <Button disabled={savingId === module.id} onClick={() => void save(module.id)}>
              {savingId === module.id ? "保存中..." : "保存人工校正"}
            </Button>
          </div>
        </div>
      ))}
      {message ? <p style={{ margin: 0, color: "var(--accent)" }}>{message}</p> : null}
    </div>
  );
}
