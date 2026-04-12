"use client";

import { useRouter } from "next/navigation";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";

const roles = [
  { key: "sales", label: "销售" },
  { key: "engineer", label: "工程师" },
  { key: "admin", label: "管理员" }
] as const;

export default function LoginPage() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24
      }}
    >
      <Card>
        <h1>非标检测设备报价系统</h1>
        <p>选择一个示例角色进入系统。</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {roles.map((role) => (
            <Button
              key={role.key}
              onClick={() => {
                document.cookie = `quotation_role=${role.key}; path=/; max-age=86400`;
                router.push("/dashboard");
              }}
            >
              以{role.label}身份进入
            </Button>
          ))}
        </div>
      </Card>
    </main>
  );
}
