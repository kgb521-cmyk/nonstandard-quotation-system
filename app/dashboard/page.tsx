import Link from "next/link";
import { cookies } from "next/headers";
import { Card } from "../../components/ui/card";
import { listQuotationProjects } from "../../src/server/db/quotation-repository";

const roleLabels: Record<string, string> = {
  sales: "销售",
  engineer: "工程师",
  admin: "管理员"
};

export default async function DashboardPage() {
  const roleCookie = (await cookies()).get("quotation_role")?.value ?? "sales";
  const projects = await listQuotationProjects();

  return (
    <main style={{ padding: 32, display: "grid", gap: 24 }}>
      <Card>
        <p>当前角色：{roleLabels[roleCookie] ?? "销售"}</p>
        <h1>非标检测设备报价系统</h1>
        <p>覆盖温控、流量、压力、流体、老化测试设备的模块匹配、报价计算与方案输出。</p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/login">切换角色</Link>
          <Link href="/customers">客户管理</Link>
          <Link href="/rules">规则查看</Link>
          <Link href="/quotations/new">新建报价项目</Link>
        </div>
      </Card>
      <Card>
        <h2>报价项目列表</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.id}>
              <Link href={`/quotations/${project.id}`}>
                {project.projectCode} - {project.title}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </main>
  );
}
