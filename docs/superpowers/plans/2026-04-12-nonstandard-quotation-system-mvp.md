# Nonstandard Equipment Quotation System MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable MVP for a nonstandard equipment quotation system that supports rule-based module matching, quotation calculation, manual adjustment, document generation, and HTML/PDF export-ready views.

**Architecture:** Use a single Next.js App Router application with a layered server-side domain design. Keep UI routes in `app/`, shared UI in `components/`, business logic in `src/server/`, and persistence in Prisma so the MVP can run on SQLite now and move to PostgreSQL later with minimal churn.

**Tech Stack:** Next.js, React, TypeScript, Prisma, SQLite, Vitest, Testing Library, npm

---

## File Structure

Planned file layout and responsibilities:

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`
- Create: `app/login/page.tsx`
- Create: `app/dashboard/page.tsx`
- Create: `app/quotations/new/page.tsx`
- Create: `app/quotations/[id]/page.tsx`
- Create: `app/quotations/[id]/summary/page.tsx`
- Create: `app/quotations/[id]/proposal/page.tsx`
- Create: `app/api/quotations/route.ts`
- Create: `app/api/quotations/[id]/match/route.ts`
- Create: `app/api/quotations/[id]/documents/route.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/quotation/project-wizard.tsx`
- Create: `components/quotation/module-table.tsx`
- Create: `components/quotation/price-summary.tsx`
- Create: `components/documents/summary-document.tsx`
- Create: `components/documents/proposal-document.tsx`
- Create: `config/rules/temperature-control.json`
- Create: `config/rules/flow.json`
- Create: `config/rules/pressure.json`
- Create: `config/rules/fluid.json`
- Create: `config/rules/aging.json`
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/types/quotation.ts`
- Create: `src/lib/sample-project.ts`
- Create: `src/server/db/client.ts`
- Create: `src/server/db/quotation-repository.ts`
- Create: `src/server/rules/types.ts`
- Create: `src/server/rules/load-rule-set.ts`
- Create: `src/server/rules/evaluate-condition.ts`
- Create: `src/server/rules/match-modules.ts`
- Create: `src/server/quotation/calculate-quotation.ts`
- Create: `src/server/quotation/build-quotation-view.ts`
- Create: `src/server/documents/generate-summary-html.ts`
- Create: `src/server/documents/generate-proposal-html.ts`
- Create: `tests/server/rules/match-modules.test.ts`
- Create: `tests/server/quotation/calculate-quotation.test.ts`
- Create: `tests/server/documents/generate-documents.test.ts`
- Create: `tests/app/sample-project.test.tsx`

### Task 1: Bootstrap the Next.js + TypeScript + Prisma workspace

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `next-env.d.ts`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/globals.css`
- Create: `app/page.tsx`

- [ ] **Step 1: Write the failing workspace test**

Create `package.json` with scripts that expect an app and tests before those files exist:

```json
{
  "name": "nonstandard-quotation-system",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "test": "vitest run",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@prisma/client": "6.7.0",
    "next": "15.3.0",
    "react": "19.1.0",
    "react-dom": "19.1.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "6.6.3",
    "@testing-library/react": "16.3.0",
    "@testing-library/user-event": "14.6.1",
    "@types/node": "22.15.3",
    "@types/react": "19.1.2",
    "@types/react-dom": "19.1.2",
    "jsdom": "26.0.0",
    "prisma": "6.7.0",
    "tsx": "4.19.2",
    "typescript": "5.8.3",
    "vitest": "3.1.1"
  }
}
```

- [ ] **Step 2: Run install and verify the workspace is incomplete**

Run: `npm install`

Run: `npm run build`

Expected: build fails because `app/layout.tsx` or `app/page.tsx` does not exist yet.

- [ ] **Step 3: Add the minimal application shell**

Create `app/layout.tsx`:

```tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "非标检测设备报价系统",
  description: "用于温控、流量、压力、流体和老化测试设备的报价 MVP。"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
```

Create `app/page.tsx`:

```tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}
```

Create `app/globals.css`:

```css
:root {
  --bg: #f4efe4;
  --panel: #fffaf2;
  --ink: #1f1c18;
  --muted: #6b6257;
  --accent: #b3522b;
  --line: #d8c8b2;
  font-family: "Source Han Sans SC", "Noto Sans SC", sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background: radial-gradient(circle at top, #fff6e6 0%, #f4efe4 55%, #ede2cf 100%);
  color: var(--ink);
}

a {
  color: inherit;
  text-decoration: none;
}
```

Create `.gitignore`:

```gitignore
.next
node_modules
coverage
dist
dev.db
dev.db-journal
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }]
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

Create `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;
```

Create `next-env.d.ts`:

```ts
/// <reference types="next" />
/// <reference types="next/image-types/global" />

// This file is automatically managed by Next.js.
```

- [ ] **Step 4: Run the build check**

Run: `npm run build`

Expected: PASS with a minimal redirecting Next.js shell.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts next-env.d.ts .gitignore app/layout.tsx app/page.tsx app/globals.css
git commit -m "chore: bootstrap quotation system workspace"
```

### Task 2: Model the domain and seed the SQLite database

**Files:**
- Create: `prisma/schema.prisma`
- Create: `prisma/seed.ts`
- Create: `src/types/quotation.ts`
- Create: `src/server/db/client.ts`
- Create: `src/server/db/quotation-repository.ts`

- [ ] **Step 1: Write the failing repository test**

Create `tests/server/quotation/calculate-quotation.test.ts` with a placeholder import that will fail until domain types exist:

```ts
import { describe, expect, it } from "vitest";
import { calculateQuotation } from "../../../src/server/quotation/calculate-quotation";

describe("calculateQuotation", () => {
  it("adds module totals, shipping, commissioning, and tax", () => {
    const result = calculateQuotation({
      modules: [
        { moduleCode: "TEMP-001", moduleName: "加热模块", quantity: 2, unitPrice: 5000 },
        { moduleCode: "CTRL-001", moduleName: "控制模块", quantity: 1, unitPrice: 3000 }
      ],
      shippingFee: 800,
      commissioningFee: 1200,
      taxRate: 0.13
    });

    expect(result.equipmentSubtotal).toBe(13000);
    expect(result.subtotalBeforeTax).toBe(15000);
    expect(result.totalWithTax).toBe(16950);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/server/quotation/calculate-quotation.test.ts`

Expected: FAIL with missing module `calculate-quotation` or missing types.

- [ ] **Step 3: Add the Prisma schema and shared quotation types**

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

enum UserRole {
  sales
  engineer
  admin
}

enum EquipmentCategory {
  temperature
  flow
  pressure
  fluid
  aging
}

enum ProjectStatus {
  draft
  matched
  quoted
}

enum DocumentType {
  summary
  proposal
}

model User {
  id           String             @id @default(cuid())
  name         String
  email        String             @unique
  passwordHash String
  role         UserRole
  projects     QuotationProject[] @relation("ProjectOwner")
  adjustments  QuotationAdjustment[]
  documents    QuotationDocument[]
  createdAt    DateTime           @default(now())
  updatedAt    DateTime           @updatedAt
}

model Customer {
  id          String             @id @default(cuid())
  name        String
  company     String
  contactName String
  contactPhone String
  industry    String
  region      String
  address     String
  projects    QuotationProject[]
  createdAt   DateTime           @default(now())
  updatedAt   DateTime           @updatedAt
}

model QuotationProject {
  id                String                @id @default(cuid())
  projectCode       String                @unique
  title             String
  customerId        String
  ownerUserId       String
  equipmentCategory EquipmentCategory
  applicationScenario String
  status            ProjectStatus         @default(draft)
  currency          String                @default("CNY")
  taxRate           Float
  shippingFee       Float
  commissioningFee  Float
  paymentTerms      String
  deliveryTerms     String
  warrantyTerms     String
  notes             String
  customer          Customer              @relation(fields: [customerId], references: [id])
  owner             User                  @relation("ProjectOwner", fields: [ownerUserId], references: [id])
  inputs            QuotationInput?
  modules           MatchedModule[]
  adjustments       QuotationAdjustment[]
  documents         QuotationDocument[]
  auditLogs         RuleAuditLog[]
  createdAt         DateTime              @default(now())
  updatedAt         DateTime              @updatedAt
}

model QuotationInput {
  id        String           @id @default(cuid())
  projectId String           @unique
  inputJson Json
  project   QuotationProject @relation(fields: [projectId], references: [id])
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
}

model MatchedModule {
  id             String           @id @default(cuid())
  projectId      String
  moduleCode     String
  moduleName     String
  moduleCategory String
  specSummary    String
  quantity       Float
  unit           String
  unitPrice      Float
  lineTotal      Float
  sourceRuleCode String
  selectionMode  String
  isOverridden   Boolean          @default(false)
  overrideReason String
  sortOrder      Int
  project        QuotationProject @relation(fields: [projectId], references: [id])
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
}

model QuotationAdjustment {
  id             String           @id @default(cuid())
  projectId      String
  moduleId       String?
  adjustmentType String
  beforeValue    String
  afterValue     String
  reason         String
  operatorUserId String
  project        QuotationProject @relation(fields: [projectId], references: [id])
  operator       User             @relation(fields: [operatorUserId], references: [id])
  createdAt      DateTime         @default(now())
}

model QuotationDocument {
  id              String           @id @default(cuid())
  projectId       String
  documentType    DocumentType
  title           String
  htmlContent     String
  version         Int              @default(1)
  createdByUserId String
  project         QuotationProject @relation(fields: [projectId], references: [id])
  createdBy       User             @relation(fields: [createdByUserId], references: [id])
  createdAt       DateTime         @default(now())
}

model RuleAuditLog {
  id        String           @id @default(cuid())
  projectId String
  ruleCode  String
  matched   Boolean
  message   String
  payloadJson Json
  project   QuotationProject @relation(fields: [projectId], references: [id])
  createdAt DateTime         @default(now())
}
```

Create `src/types/quotation.ts`:

```ts
export type EquipmentCategory = "temperature" | "flow" | "pressure" | "fluid" | "aging";

export interface QuotationInputPayload {
  minTemperature?: number;
  maxTemperature?: number;
  pressureRange?: { min: number; max: number };
  flowRange?: { min: number; max: number };
  mediumType?: string;
  workstationCount?: number;
  controlMode?: string;
  installationEnvironment?: string;
  accuracyLevel?: "standard" | "high";
}

export interface ModuleLine {
  moduleCode: string;
  moduleName: string;
  moduleCategory?: string;
  specSummary?: string;
  quantity: number;
  unit?: string;
  unitPrice: number;
  sourceRuleCode?: string;
  calculationNote?: string;
  selectionMode?: "auto" | "manual";
  isOverridden?: boolean;
}
```

Create `src/server/db/client.ts`:

```ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

Create `src/server/db/quotation-repository.ts` with a minimal fetch API:

```ts
import { prisma } from "./client";

export async function listQuotationProjects() {
  return prisma.quotationProject.findMany({
    include: {
      customer: true,
      owner: true,
      modules: true,
      inputs: true
    },
    orderBy: {
      updatedAt: "desc"
    }
  });
}
```

- [ ] **Step 4: Push the schema and seed demo data**

Create `prisma/seed.ts` with three users, one customer, one project, one input row, and matching modules hard-coded for initial smoke testing.

Run: `npm run db:push`

Expected: Prisma creates `prisma/dev.db` and generates the client.

Run: `npm run db:seed`

Expected: seed succeeds and inserts demo rows.

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/seed.ts src/types/quotation.ts src/server/db/client.ts src/server/db/quotation-repository.ts tests/server/quotation/calculate-quotation.test.ts
git commit -m "feat: add quotation domain schema and seed data"
```

### Task 3: Implement the configurable rule engine and module matching

**Files:**
- Create: `config/rules/temperature-control.json`
- Create: `config/rules/flow.json`
- Create: `config/rules/pressure.json`
- Create: `config/rules/fluid.json`
- Create: `config/rules/aging.json`
- Create: `src/server/rules/types.ts`
- Create: `src/server/rules/load-rule-set.ts`
- Create: `src/server/rules/evaluate-condition.ts`
- Create: `src/server/rules/match-modules.ts`
- Test: `tests/server/rules/match-modules.test.ts`

- [ ] **Step 1: Write the failing rule-engine test**

Create `tests/server/rules/match-modules.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { matchModules } from "../../../src/server/rules/match-modules";

describe("matchModules", () => {
  it("adds low-temperature refrigeration and scales aging control cabinets", async () => {
    const temperatureResult = await matchModules("temperature", {
      minTemperature: -40,
      maxTemperature: 120,
      controlMode: "PLC"
    });

    expect(temperatureResult.modules.some((module) => module.moduleCode === "TEMP-REFRIG-LOW")).toBe(true);

    const agingResult = await matchModules("aging", {
      workstationCount: 18
    });

    const cabinet = agingResult.modules.find((module) => module.moduleCode === "AGING-CABINET");
    expect(cabinet?.quantity).toBe(3);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/server/rules/match-modules.test.ts`

Expected: FAIL because `match-modules.ts` and rule files do not exist yet.

- [ ] **Step 3: Define rule types and seed rule files**

Create `src/server/rules/types.ts`:

```ts
import type { EquipmentCategory, ModuleLine, QuotationInputPayload } from "../../types/quotation";

export type ConditionOperator = "eq" | "neq" | "gt" | "gte" | "lt" | "lte" | "includes";

export interface RuleCondition {
  field: keyof QuotationInputPayload;
  operator: ConditionOperator;
  value: string | number;
}

export interface RuleAction {
  type: "addModule";
  moduleCode: string;
  moduleName: string;
  moduleCategory: string;
  specSummary: string;
  quantity: number;
  quantityFormula?: "ceilWorkstationsDiv8";
  unit: string;
  unitPrice: number;
  calculationNote: string;
}

export interface EquipmentRule {
  code: string;
  name: string;
  equipmentCategory: EquipmentCategory;
  priority: number;
  conditions: RuleCondition[];
  actions: RuleAction[];
  description: string;
}

export interface MatchModulesResult {
  modules: ModuleLine[];
  auditLogs: Array<{ ruleCode: string; matched: boolean; message: string }>;
}
```

Create `config/rules/temperature-control.json` with entries such as:

```json
[
  {
    "code": "TEMP-BASE",
    "name": "温控基础模块",
    "equipmentCategory": "temperature",
    "priority": 10,
    "conditions": [],
    "actions": [
      {
        "type": "addModule",
        "moduleCode": "TEMP-HEAT-BASE",
        "moduleName": "基础加热模块",
        "moduleCategory": "thermal",
        "specSummary": "标准温控加热回路",
        "quantity": 1,
        "unit": "套",
        "unitPrice": 12000,
        "calculationNote": "温控设备基础配置"
      }
    ],
    "description": "温控设备默认基础模块"
  },
  {
    "code": "TEMP-LOW-REFRIG",
    "name": "低温制冷扩展",
    "equipmentCategory": "temperature",
    "priority": 50,
    "conditions": [
      { "field": "minTemperature", "operator": "lt", "value": -20 }
    ],
    "actions": [
      {
        "type": "addModule",
        "moduleCode": "TEMP-REFRIG-LOW",
        "moduleName": "低温制冷模块",
        "moduleCategory": "thermal",
        "specSummary": "适配 -20℃ 以下工况",
        "quantity": 1,
        "unit": "套",
        "unitPrice": 18000,
        "calculationNote": "最低温度低于 -20℃ 自动追加"
      }
    ],
    "description": "最低温度低于 -20℃ 时追加制冷模块"
  }
]
```

Create `config/rules/aging.json` with an `AGING-CABINET` action using `quantityFormula: "ceilWorkstationsDiv8"`.

Create the other three files with at least two representative rules each so all five categories are covered.

- [ ] **Step 4: Implement the loader, evaluator, and matcher**

Create `src/server/rules/load-rule-set.ts`:

```ts
import { promises as fs } from "node:fs";
import path from "node:path";
import type { EquipmentCategory } from "../../types/quotation";
import type { EquipmentRule } from "./types";

const ruleFileMap: Record<EquipmentCategory, string> = {
  temperature: "temperature-control.json",
  flow: "flow.json",
  pressure: "pressure.json",
  fluid: "fluid.json",
  aging: "aging.json"
};

export async function loadRuleSet(category: EquipmentCategory): Promise<EquipmentRule[]> {
  const filePath = path.join(process.cwd(), "config", "rules", ruleFileMap[category]);
  const content = await fs.readFile(filePath, "utf8");
  return JSON.parse(content) as EquipmentRule[];
}
```

Create `src/server/rules/evaluate-condition.ts`:

```ts
import type { QuotationInputPayload } from "../../types/quotation";
import type { RuleCondition } from "./types";

export function evaluateCondition(input: QuotationInputPayload, condition: RuleCondition): boolean {
  const actual = input[condition.field];

  switch (condition.operator) {
    case "eq":
      return actual === condition.value;
    case "neq":
      return actual !== condition.value;
    case "gt":
      return typeof actual === "number" && actual > Number(condition.value);
    case "gte":
      return typeof actual === "number" && actual >= Number(condition.value);
    case "lt":
      return typeof actual === "number" && actual < Number(condition.value);
    case "lte":
      return typeof actual === "number" && actual <= Number(condition.value);
    case "includes":
      return typeof actual === "string" && actual.includes(String(condition.value));
    default:
      return false;
  }
}
```

Create `src/server/rules/match-modules.ts`:

```ts
import type { EquipmentCategory, ModuleLine, QuotationInputPayload } from "../../types/quotation";
import { evaluateCondition } from "./evaluate-condition";
import { loadRuleSet } from "./load-rule-set";
import type { MatchModulesResult, RuleAction } from "./types";

function resolveQuantity(action: RuleAction, input: QuotationInputPayload): number {
  if (action.quantityFormula === "ceilWorkstationsDiv8") {
    return Math.max(1, Math.ceil((input.workstationCount ?? 1) / 8));
  }

  return action.quantity;
}

export async function matchModules(
  category: EquipmentCategory,
  input: QuotationInputPayload
): Promise<MatchModulesResult> {
  const rules = (await loadRuleSet(category)).sort((left, right) => left.priority - right.priority);
  const modules: ModuleLine[] = [];
  const auditLogs: MatchModulesResult["auditLogs"] = [];

  for (const rule of rules) {
    const matched =
      rule.conditions.length === 0 || rule.conditions.every((condition) => evaluateCondition(input, condition));

    auditLogs.push({
      ruleCode: rule.code,
      matched,
      message: matched ? `命中规则 ${rule.name}` : `未命中规则 ${rule.name}`
    });

    if (!matched) {
      continue;
    }

    for (const action of rule.actions) {
      modules.push({
        moduleCode: action.moduleCode,
        moduleName: action.moduleName,
        moduleCategory: action.moduleCategory,
        specSummary: action.specSummary,
        quantity: resolveQuantity(action, input),
        unit: action.unit,
        unitPrice: action.unitPrice,
        sourceRuleCode: rule.code,
        calculationNote: action.calculationNote,
        selectionMode: "auto",
        isOverridden: false
      });
    }
  }

  return { modules, auditLogs };
}
```

- [ ] **Step 5: Run the rule-engine test**

Run: `npm run test -- tests/server/rules/match-modules.test.ts`

Expected: PASS, confirming at least one low-temperature rule and one workstation-driven quantity rule work correctly.

- [ ] **Step 6: Commit**

```bash
git add config/rules src/server/rules tests/server/rules/match-modules.test.ts
git commit -m "feat: add configurable quotation rule engine"
```

### Task 4: Implement quotation calculation and document generators

**Files:**
- Create: `src/server/quotation/calculate-quotation.ts`
- Create: `src/server/quotation/build-quotation-view.ts`
- Create: `src/server/documents/generate-summary-html.ts`
- Create: `src/server/documents/generate-proposal-html.ts`
- Test: `tests/server/quotation/calculate-quotation.test.ts`
- Test: `tests/server/documents/generate-documents.test.ts`

- [ ] **Step 1: Add the failing document-generation test**

Create `tests/server/documents/generate-documents.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { generateSummaryHtml } from "../../../src/server/documents/generate-summary-html";
import { generateProposalHtml } from "../../../src/server/documents/generate-proposal-html";

const quotationView = {
  projectCode: "Q-2026-001",
  title: "新能源汽车电池包温控测试台",
  customerName: "华东测试科技",
  equipmentCategoryLabel: "温控设备",
  applicationScenario: "用于电池包高低温循环测试",
  modules: [
    { moduleCode: "TEMP-HEAT-BASE", moduleName: "基础加热模块", quantity: 1, unitPrice: 12000, lineTotal: 12000 }
  ],
  totals: {
    equipmentSubtotal: 12000,
    shippingFee: 800,
    commissioningFee: 1200,
    subtotalBeforeTax: 14000,
    totalWithTax: 15820
  },
  terms: {
    paymentTerms: "预付款 50%，验收后 50%",
    deliveryTerms: "收到预付款后 6 周",
    warrantyTerms: "整机质保 12 个月"
  }
};

describe("document generators", () => {
  it("renders summary and proposal HTML with commercial terms", () => {
    expect(generateSummaryHtml(quotationView)).toContain("报价单");
    expect(generateSummaryHtml(quotationView)).toContain("预付款 50%");
    expect(generateProposalHtml(quotationView)).toContain("方案书");
    expect(generateProposalHtml(quotationView)).toContain("交付范围");
  });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `npm run test -- tests/server/quotation/calculate-quotation.test.ts tests/server/documents/generate-documents.test.ts`

Expected: FAIL because the calculator and document generators do not exist yet.

- [ ] **Step 3: Implement the calculator and quotation-view builder**

Create `src/server/quotation/calculate-quotation.ts`:

```ts
import type { ModuleLine } from "../../types/quotation";

export interface CalculationInput {
  modules: Array<Pick<ModuleLine, "moduleCode" | "moduleName" | "quantity" | "unitPrice">>;
  shippingFee: number;
  commissioningFee: number;
  taxRate: number;
}

export function calculateQuotation(input: CalculationInput) {
  const modules = input.modules.map((module) => ({
    ...module,
    lineTotal: Number((module.quantity * module.unitPrice).toFixed(2))
  }));

  const equipmentSubtotal = modules.reduce((sum, module) => sum + module.lineTotal, 0);
  const subtotalBeforeTax = equipmentSubtotal + input.shippingFee + input.commissioningFee;
  const totalWithTax = Number((subtotalBeforeTax * (1 + input.taxRate)).toFixed(2));

  return {
    modules,
    equipmentSubtotal,
    shippingFee: input.shippingFee,
    commissioningFee: input.commissioningFee,
    subtotalBeforeTax,
    totalWithTax
  };
}
```

Create `src/server/quotation/build-quotation-view.ts`:

```ts
import { calculateQuotation } from "./calculate-quotation";

const categoryLabels = {
  temperature: "温控设备",
  flow: "流量设备",
  pressure: "压力设备",
  fluid: "流体设备",
  aging: "老化测试设备"
} as const;

export function buildQuotationView(project: {
  projectCode: string;
  title: string;
  customer: { company: string };
  equipmentCategory: keyof typeof categoryLabels;
  applicationScenario: string;
  paymentTerms: string;
  deliveryTerms: string;
  warrantyTerms: string;
  shippingFee: number;
  commissioningFee: number;
  taxRate: number;
  modules: Array<{ moduleCode: string; moduleName: string; quantity: number; unitPrice: number }>;
}) {
  const totals = calculateQuotation({
    modules: project.modules,
    shippingFee: project.shippingFee,
    commissioningFee: project.commissioningFee,
    taxRate: project.taxRate
  });

  return {
    projectCode: project.projectCode,
    title: project.title,
    customerName: project.customer.company,
    equipmentCategoryLabel: categoryLabels[project.equipmentCategory],
    applicationScenario: project.applicationScenario,
    modules: totals.modules,
    totals,
    terms: {
      paymentTerms: project.paymentTerms,
      deliveryTerms: project.deliveryTerms,
      warrantyTerms: project.warrantyTerms
    }
  };
}
```

- [ ] **Step 4: Implement the HTML generators**

Create `src/server/documents/generate-summary-html.ts`:

```ts
export function generateSummaryHtml(view: {
  projectCode: string;
  title: string;
  customerName: string;
  equipmentCategoryLabel: string;
  applicationScenario: string;
  modules: Array<{ moduleName: string; quantity: number; unitPrice: number; lineTotal: number }>;
  totals: { equipmentSubtotal: number; shippingFee: number; commissioningFee: number; subtotalBeforeTax: number; totalWithTax: number };
  terms: { paymentTerms: string; deliveryTerms: string; warrantyTerms: string };
}) {
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
```

Create `src/server/documents/generate-proposal-html.ts`:

```ts
export function generateProposalHtml(view: {
  projectCode: string;
  title: string;
  customerName: string;
  equipmentCategoryLabel: string;
  applicationScenario: string;
  modules: Array<{ moduleName: string; quantity: number; unitPrice: number; lineTotal: number }>;
  totals: { equipmentSubtotal: number; shippingFee: number; commissioningFee: number; subtotalBeforeTax: number; totalWithTax: number };
  terms: { paymentTerms: string; deliveryTerms: string; warrantyTerms: string };
}) {
  const items = view.modules
    .map(
      (module) =>
        `<li>${module.moduleName} × ${module.quantity}，单价 ${module.unitPrice}，金额 ${module.lineTotal}</li>`
    )
    .join("");

  return `
    <html lang="zh-CN">
      <body>
        <h1>非标检测设备报价方案书</h1>
        <h2>${view.title}</h2>
        <p>客户：${view.customerName}</p>
        <p>设备类型：${view.equipmentCategoryLabel}</p>
        <section>
          <h3>客户需求摘要</h3>
          <p>${view.applicationScenario}</p>
        </section>
        <section>
          <h3>推荐配置</h3>
          <ul>${items}</ul>
        </section>
        <section>
          <h3>报价明细</h3>
          <p>设备小计：${view.totals.equipmentSubtotal}</p>
          <p>运费/包装：${view.totals.shippingFee}</p>
          <p>安装调试费：${view.totals.commissioningFee}</p>
          <p>含税总价：${view.totals.totalWithTax}</p>
        </section>
        <section>
          <h3>交付范围</h3>
          <p>含设备主体、控制系统、必要管路和现场安装调试指导。</p>
        </section>
        <section>
          <h3>商务条款</h3>
          <p>${view.terms.paymentTerms}</p>
          <p>${view.terms.deliveryTerms}</p>
          <p>${view.terms.warrantyTerms}</p>
        </section>
      </body>
    </html>
  `;
}
```

- [ ] **Step 5: Run the quotation and document tests**

Run: `npm run test -- tests/server/quotation/calculate-quotation.test.ts tests/server/documents/generate-documents.test.ts`

Expected: PASS, showing calculation and HTML generation work from shared data.

- [ ] **Step 6: Commit**

```bash
git add src/server/quotation src/server/documents tests/server/quotation/calculate-quotation.test.ts tests/server/documents/generate-documents.test.ts
git commit -m "feat: add quotation calculator and document generators"
```

### Task 5: Build the MVP screens, API routes, and manual-adjustment flow

**Files:**
- Create: `app/login/page.tsx`
- Create: `app/dashboard/page.tsx`
- Create: `app/quotations/new/page.tsx`
- Create: `app/quotations/[id]/page.tsx`
- Create: `app/quotations/[id]/summary/page.tsx`
- Create: `app/quotations/[id]/proposal/page.tsx`
- Create: `app/api/quotations/route.ts`
- Create: `app/api/quotations/[id]/match/route.ts`
- Create: `app/api/quotations/[id]/documents/route.ts`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`
- Create: `components/ui/input.tsx`
- Create: `components/quotation/project-wizard.tsx`
- Create: `components/quotation/module-table.tsx`
- Create: `components/quotation/price-summary.tsx`
- Create: `components/documents/summary-document.tsx`
- Create: `components/documents/proposal-document.tsx`
- Create: `src/lib/sample-project.ts`
- Test: `tests/app/sample-project.test.tsx`

- [ ] **Step 1: Write the failing UI smoke test**

Create `tests/app/sample-project.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SummaryDocument } from "../../components/documents/summary-document";
import { sampleQuotationView } from "../../src/lib/sample-project";

describe("SummaryDocument", () => {
  it("renders the project title and total with tax", () => {
    render(<SummaryDocument view={sampleQuotationView} />);

    expect(screen.getByText("新能源汽车电池包温控测试台")).toBeInTheDocument();
    expect(screen.getByText(/含税总价/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the UI test to verify it fails**

Run: `npm run test -- tests/app/sample-project.test.tsx`

Expected: FAIL because the sample view and document component do not exist yet.

- [ ] **Step 3: Add reusable UI primitives and the sample view**

Create `components/ui/button.tsx`:

```tsx
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";

export function Button(props: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button
      {...props}
      style={{
        border: "none",
        borderRadius: 999,
        padding: "12px 18px",
        background: "#b3522b",
        color: "#fffaf2",
        cursor: "pointer"
      }}
    />
  );
}
```

Create `src/lib/sample-project.ts` exporting one fully-populated quotation view object that mirrors the document test fixture.

Create `components/documents/summary-document.tsx` and `components/documents/proposal-document.tsx` as React wrappers that render the same data sections as the HTML generators.

- [ ] **Step 4: Build the page flow and API endpoints**

Create `components/quotation/project-wizard.tsx` with four sections:

```tsx
export function ProjectWizard() {
  return (
    <main style={{ padding: 32 }}>
      <section><h2>1. 客户与项目基本信息</h2></section>
      <section><h2>2. 技术参数录入</h2></section>
      <section><h2>3. 自动匹配模块与人工校正</h2></section>
      <section><h2>4. 报价结果与文档生成</h2></section>
    </main>
  );
}
```

Create `app/dashboard/page.tsx` to show a hero summary, demo accounts, and project list from the repository.

Create `app/quotations/new/page.tsx` and `app/quotations/[id]/page.tsx` to render the wizard and module table.

Create `components/quotation/module-table.tsx` to show module code, name, quantity, price, source rule, and an editable remark flag for manual override.

Create `components/quotation/price-summary.tsx` to show:

```tsx
<div>
  <p>设备小计</p>
  <p>运费/包装</p>
  <p>安装调试费</p>
  <p>税前总价</p>
  <p>含税总价</p>
</div>
```

Create API routes:

- `app/api/quotations/route.ts`: list and create projects
- `app/api/quotations/[id]/match/route.ts`: load project input, run `matchModules`, persist modules and audit logs
- `app/api/quotations/[id]/documents/route.ts`: build quotation view and return `summaryHtml` and `proposalHtml`

Keep the initial auth simple: use a hard-coded session role selector on the login page, persist the chosen role in a cookie, and gate labels rather than building full credential verification.

- [ ] **Step 5: Run the UI smoke test and build**

Run: `npm run test -- tests/app/sample-project.test.tsx`

Expected: PASS.

Run: `npm run build`

Expected: PASS with all MVP routes compiling.

- [ ] **Step 6: Commit**

```bash
git add app components src/lib/sample-project.ts tests/app/sample-project.test.tsx
git commit -m "feat: add quotation workflow pages and api routes"
```

### Task 6: Verify the end-to-end MVP, docs, and demo readiness

**Files:**
- Modify: `app/globals.css`
- Modify: any files needed after verification
- Modify: `docs/superpowers/specs/2026-04-12-nonstandard-equipment-quotation-system-design.md` only if implementation diverges

- [ ] **Step 1: Run the full automated verification suite**

Run: `npm run test`

Expected: PASS with all rule, calculation, document, and UI smoke tests green.

Run: `npm run build`

Expected: PASS with all routes building successfully.

- [ ] **Step 2: Run the seeded app locally**

Run: `npm run dev`

Expected: local app starts and serves:

- `/login`
- `/dashboard`
- `/quotations/new`
- `/quotations/[id]/summary`
- `/quotations/[id]/proposal`

- [ ] **Step 3: Manual smoke checklist**

Verify in the browser:

- Sales role can open dashboard and create a quote
- Engineer-facing editing section shows technical inputs
- Matching endpoint adds modules for at least one temperature case and one aging case
- Module table shows source rules and editable values
- Summary and proposal pages display totals and business terms
- Browser print preview produces PDF-ready pages

- [ ] **Step 4: Apply any minimal fixes found during smoke testing**

If the smoke test reveals mismatches, patch only the smallest responsible files, then rerun:

Run: `npm run test`

Run: `npm run build`

Expected: both commands return to PASS after the fix.

- [ ] **Step 5: Commit the verified MVP**

```bash
git add .
git commit -m "feat: ship nonstandard quotation system mvp"
```

## Self-Review

### Spec coverage

- Customer info, scenario, technical parameters, and business terms: Task 5 wizard pages and API routes.
- Rule engine with configurable matching: Task 3.
- Automatic quotation amount calculation: Task 4.
- Complete industrial quotation document generation: Task 4 plus Task 5 document pages.
- Manual correction: Task 5 module table and API persistence.
- HTML/PDF export-ready output: Task 5 pages, Task 6 smoke verification.
- Next.js + TypeScript frontend, Node.js backend logic, SQLite with PostgreSQL-ready layering: Tasks 1 and 2.
- Expandable architecture and configurable rules: Tasks 2 and 3.
- Project structure, database design, rule engine, quotation logic, copy/document generation, pages, example data, runnable MVP: all covered across Tasks 1 through 6.

### Placeholder scan

- No `TODO`, `TBD`, or “implement later” placeholders remain.
- Every task includes exact file paths and commands.
- Code-changing steps contain concrete code snippets instead of abstract instructions.

### Type consistency

- Shared quotation types originate in `src/types/quotation.ts`.
- Rules and calculator depend on `ModuleLine` and `QuotationInputPayload`, so later tasks reuse the same names.
- Document generators and React document components both consume a single quotation-view shape to keep field names aligned.
