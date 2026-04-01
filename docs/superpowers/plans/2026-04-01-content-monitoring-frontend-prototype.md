# Content Monitoring Frontend Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a lightweight Next.js prototype for a content monitoring dashboard with category switching, overview summary, content browsing, AI report exploration, and monitoring settings powered by realistic mock data.

**Architecture:** Use a single-page Next.js App Router application with one top-level dashboard container coordinating local UI state. Keep mock data, domain types, and tab components separated so the prototype stays easy to evolve into a real product. Use plain React state plus focused presentational components instead of introducing backend calls or global state tooling.

**Tech Stack:** Next.js, React, TypeScript, CSS Modules or `app/globals.css`, npm, ESLint, optional Vitest + Testing Library for targeted UI/data tests

---

## File Structure

Planned file layout and responsibilities:

- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `lib/types.ts`
- Create: `lib/mock-data.ts`
- Create: `components/monitoring-dashboard.tsx`
- Create: `components/sidebar.tsx`
- Create: `components/overview-header.tsx`
- Create: `components/content-tab.tsx`
- Create: `components/reports-tab.tsx`
- Create: `components/settings-tab.tsx`
- Create: `components/ui/metric-card.tsx`
- Create: `components/ui/section-card.tsx`
- Create: `components/ui/tag.tsx`
- Create: `tests/lib/mock-data.test.ts`
- Create: `tests/components/monitoring-dashboard.test.tsx`

### Task 1: Bootstrap the Next.js prototype workspace

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.ts`
- Create: `.gitignore`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`

- [ ] **Step 1: Write the failing configuration check**

Create `package.json` with scripts that reference files not yet present so the first install-and-check step fails until the app shell exists:

```json
{
  "name": "content-monitoring-prototype",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "lint": "next lint",
    "test": "vitest run"
  },
  "dependencies": {
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
    "eslint": "9.24.0",
    "eslint-config-next": "15.3.0",
    "jsdom": "26.0.0",
    "typescript": "5.8.3",
    "vitest": "3.1.1"
  }
}
```

- [ ] **Step 2: Run dependency install and verify the workspace is incomplete**

Run: `npm install`

Expected: install succeeds, but `npm run build` fails because `app/page.tsx` and `app/layout.tsx` are not implemented yet or return placeholder errors.

- [ ] **Step 3: Add the minimal app shell**

Create `app/layout.tsx`:

```tsx
import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Content Monitoring Console",
  description: "Prototype dashboard for category-based content monitoring."
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
export default function HomePage() {
  return <main>Loading content monitoring dashboard...</main>;
}
```

Create `app/globals.css`:

```css
:root {
  color-scheme: light;
  font-family: "SF Pro Display", "PingFang SC", "Helvetica Neue", sans-serif;
}

* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  min-height: 100%;
  background: #f4f7fb;
  color: #10233f;
}
```

Create `.gitignore`:

```gitignore
.next
node_modules
coverage
dist
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

- [ ] **Step 4: Run the build check**

Run: `npm run build`

Expected: PASS with a minimal Next.js app production build.

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json next.config.ts .gitignore app/layout.tsx app/page.tsx app/globals.css
git commit -m "chore: bootstrap next prototype workspace"
```

### Task 2: Define domain types and realistic mock data

**Files:**
- Create: `lib/types.ts`
- Create: `lib/mock-data.ts`
- Test: `tests/lib/mock-data.test.ts`

- [ ] **Step 1: Write the failing mock data test**

Create `tests/lib/mock-data.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { monitoringCategories } from "../../lib/mock-data";

describe("monitoringCategories", () => {
  it("provides at least three categories with content, reports, and settings", () => {
    expect(monitoringCategories.length).toBeGreaterThanOrEqual(3);

    for (const category of monitoringCategories) {
      expect(category.contents.length).toBeGreaterThan(0);
      expect(category.reports.length).toBeGreaterThanOrEqual(5);
      expect(category.settings.platforms.length).toBeGreaterThan(0);
      expect(category.settings.keywords.length).toBeGreaterThan(0);
      expect(category.settings.accounts.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/lib/mock-data.test.ts`

Expected: FAIL with `Cannot find module '../../lib/mock-data'` or missing exported data.

- [ ] **Step 3: Define the minimal shared types and mock data**

Create `lib/types.ts`:

```ts
export type Platform =
  | "全部"
  | "抖音"
  | "小红书"
  | "微博"
  | "B站"
  | "公众号";

export type TabKey = "content" | "reports" | "settings";
export type ReportView = "daily" | "topics";
export type TopicRange = "7d" | "14d" | "30d";

export interface ContentItem {
  id: string;
  date: string;
  time: string;
  platform: Exclude<Platform, "全部">;
  title: string;
  author: string;
  heatScore: number;
  engagementSummary: string;
  matchedTarget: string;
  summary: string;
  tags: string[];
  url: string;
}

export interface TopicIdea {
  id: string;
  title: string;
  brief: string;
  whyNow: string;
  growthAngle: string;
  sourcePlatforms: Exclude<Platform, "全部">[];
  reportDate: string;
}

export interface DailyReport {
  id: string;
  date: string;
  summary: string;
  hotPlatforms: Exclude<Platform, "全部">[];
  topSignals: string[];
  recommendations: string[];
  topicIdeas: TopicIdea[];
}

export interface KeywordSetting {
  id: string;
  label: string;
  hitCount: number;
}

export interface AccountSetting {
  id: string;
  name: string;
  platform: Exclude<Platform, "全部">;
  description: string;
  lastActive: string;
}

export interface PlatformSetting {
  id: string;
  platform: Exclude<Platform, "全部">;
  enabled: boolean;
  frequency: string;
}

export interface CategorySettings {
  platforms: PlatformSetting[];
  keywords: KeywordSetting[];
  accounts: AccountSetting[];
}

export interface MonitoringCategory {
  id: string;
  name: string;
  subtitle: string;
  scheduleTime: string;
  lastRunStatus: string;
  nextRunAt: string;
  headlineInsight: string;
  contents: ContentItem[];
  reports: DailyReport[];
  settings: CategorySettings;
}
```

Create `lib/mock-data.ts` with a typed `monitoringCategories` export containing:

```ts
import type { MonitoringCategory } from "./types";

export const monitoringCategories: MonitoringCategory[] = [
  {
    id: "claude-code",
    name: "Claude Code 选题监控",
    subtitle: "聚焦 agent coding、开发工作流与实战内容表现",
    scheduleTime: "每天 08:30",
    lastRunStatus: "今日已完成",
    nextRunAt: "2026-04-02 08:30",
    headlineInsight: "教程拆解型内容在 B 站和公众号同时升温，说明深度实操仍是核心增长入口。",
    contents: [
      {
        id: "cc-2026-03-31-01",
        date: "2026-03-31",
        time: "09:10",
        platform: "B站",
        title: "Claude Code 实战：用代理模式重构一个老项目",
        author: "阿周的开发实验室",
        heatScore: 93,
        engagementSummary: "播放 12.8 万，收藏率 8.1%",
        matchedTarget: "claude code",
        summary: "内容重点展示代理式编码流程、上下文拆分与重构前后对比。",
        tags: ["爆款", "教程", "适合拆解"],
        url: "#"
      }
    ],
    reports: [
      {
        id: "cc-report-2026-03-31",
        date: "2026-03-31",
        summary: "Agent coding 教程继续走强，长内容明显优于纯观点短帖。",
        hotPlatforms: ["B站", "公众号"],
        topSignals: ["实战案例点击率高", "工作流模版内容转化高"],
        recommendations: ["优先做案例拆解型选题", "搭配 prompt 模版与项目复盘"],
        topicIdeas: [
          {
            id: "cc-topic-1",
            title: "从 0 到 1 搭一个 Claude Code 工作流模板",
            brief: "解释团队如何搭建稳定的 agent coding 工作流。",
            whyNow: "用户正从尝鲜走向复用，模板型内容需求上升。",
            growthAngle: "附可复制 SOP 和实际产出截图更容易带来收藏。",
            sourcePlatforms: ["B站", "公众号"],
            reportDate: "2026-03-31"
          }
        ]
      }
    ],
    settings: {
      platforms: [
        { id: "p1", platform: "抖音", enabled: true, frequency: "每日 1 次" },
        { id: "p2", platform: "小红书", enabled: true, frequency: "每日 1 次" },
        { id: "p3", platform: "微博", enabled: true, frequency: "每日 1 次" },
        { id: "p4", platform: "B站", enabled: true, frequency: "每日 1 次" },
        { id: "p5", platform: "公众号", enabled: true, frequency: "每日 1 次" }
      ],
      keywords: [
        { id: "k1", label: "claude code", hitCount: 42 },
        { id: "k2", label: "agent coding", hitCount: 31 }
      ],
      accounts: [
        {
          id: "a1",
          name: "阿周的开发实验室",
          platform: "B站",
          description: "专注 AI 编程工作流拆解",
          lastActive: "今天更新"
        }
      ]
    }
  }
];
```

Extend that seed so it includes:

- 3 categories total
- around 7 days of `contents` per category
- 5 to 7 reports per category
- topic ideas linked to reports
- platform, keyword, and account settings for each category

- [ ] **Step 4: Run the mock data test**

Run: `npm run test -- tests/lib/mock-data.test.ts`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add lib/types.ts lib/mock-data.ts tests/lib/mock-data.test.ts
git commit -m "feat: add typed monitoring mock data"
```

### Task 3: Build the dashboard state container and sidebar

**Files:**
- Create: `components/monitoring-dashboard.tsx`
- Create: `components/sidebar.tsx`
- Modify: `app/page.tsx`
- Test: `tests/components/monitoring-dashboard.test.tsx`

- [ ] **Step 1: Write the failing interaction test**

Create `tests/components/monitoring-dashboard.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MonitoringDashboard } from "../../components/monitoring-dashboard";

describe("MonitoringDashboard", () => {
  it("switches category context from the sidebar", async () => {
    const user = userEvent.setup();

    render(<MonitoringDashboard />);

    expect(screen.getByRole("heading", { name: "Claude Code 选题监控" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Vibe Coding 选题监控/i }));

    expect(screen.getByRole("heading", { name: "Vibe Coding 选题监控" })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the interaction test to verify it fails**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: FAIL because `MonitoringDashboard` does not exist yet.

- [ ] **Step 3: Implement the dashboard container and sidebar**

Create `components/sidebar.tsx`:

```tsx
import type { MonitoringCategory } from "../lib/types";

interface SidebarProps {
  categories: MonitoringCategory[];
  activeCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export function Sidebar({ categories, activeCategoryId, onSelectCategory }: SidebarProps) {
  return (
    <aside>
      <p>Content Radar</p>
      <h1>内容监控台</h1>
      <div>
        {categories.map((category) => (
          <button
            key={category.id}
            type="button"
            aria-pressed={category.id === activeCategoryId}
            onClick={() => onSelectCategory(category.id)}
          >
            <strong>{category.name}</strong>
            <span>{category.contents.filter((item) => item.date === "2026-03-31").length} 条新增</span>
            <span>{category.lastRunStatus}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
```

Create `components/monitoring-dashboard.tsx`:

```tsx
"use client";

import { useState } from "react";
import { monitoringCategories } from "../lib/mock-data";
import { Sidebar } from "./sidebar";

export function MonitoringDashboard() {
  const [activeCategoryId, setActiveCategoryId] = useState(monitoringCategories[0].id);

  const activeCategory =
    monitoringCategories.find((category) => category.id === activeCategoryId) ?? monitoringCategories[0];

  return (
    <div>
      <Sidebar
        categories={monitoringCategories}
        activeCategoryId={activeCategory.id}
        onSelectCategory={setActiveCategoryId}
      />
      <main>
        <h2>{activeCategory.name}</h2>
        <p>{activeCategory.subtitle}</p>
      </main>
    </div>
  );
}
```

Update `app/page.tsx`:

```tsx
import { MonitoringDashboard } from "../components/monitoring-dashboard";

export default function HomePage() {
  return <MonitoringDashboard />;
}
```

- [ ] **Step 4: Run the interaction test**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/sidebar.tsx components/monitoring-dashboard.tsx app/page.tsx tests/components/monitoring-dashboard.test.tsx
git commit -m "feat: add dashboard shell and category switching"
```

### Task 4: Implement the overview summary and shared UI primitives

**Files:**
- Create: `components/overview-header.tsx`
- Create: `components/ui/metric-card.tsx`
- Create: `components/ui/section-card.tsx`
- Create: `components/ui/tag.tsx`
- Modify: `components/monitoring-dashboard.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing overview assertion**

Append to `tests/components/monitoring-dashboard.test.tsx`:

```tsx
it("shows overview metrics and the headline insight for the active category", () => {
  render(<MonitoringDashboard />);

  expect(screen.getByText("今日重点洞察")).toBeInTheDocument();
  expect(screen.getByText(/教程拆解型内容/i)).toBeInTheDocument();
  expect(screen.getByText("今日新增内容")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: FAIL because the overview section is not rendered.

- [ ] **Step 3: Add overview components and styles**

Create `components/ui/metric-card.tsx`:

```tsx
interface MetricCardProps {
  label: string;
  value: string;
  hint: string;
}

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <article className="metric-card">
      <p className="metric-label">{label}</p>
      <strong className="metric-value">{value}</strong>
      <span className="metric-hint">{hint}</span>
    </article>
  );
}
```

Create `components/ui/section-card.tsx`:

```tsx
import type { ReactNode } from "react";

export function SectionCard({ children }: { children: ReactNode }) {
  return <section className="section-card">{children}</section>;
}
```

Create `components/ui/tag.tsx`:

```tsx
import type { ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}
```

Create `components/overview-header.tsx`:

```tsx
import type { MonitoringCategory } from "../lib/types";
import { MetricCard } from "./ui/metric-card";
import { SectionCard } from "./ui/section-card";

export function OverviewHeader({ category }: { category: MonitoringCategory }) {
  const today = "2026-03-31";
  const todayContents = category.contents.filter((item) => item.date === today);
  const todayHotCount = todayContents.filter((item) => item.heatScore >= 85).length;
  const latestReport = category.reports[0];
  const weeklyIdeas = category.reports.flatMap((report) => report.topicIdeas).length;

  return (
    <div className="overview-stack">
      <SectionCard>
        <div className="overview-hero">
          <div>
            <p className="eyebrow">当前分类</p>
            <h2>{category.name}</h2>
            <p>{category.subtitle}</p>
          </div>
          <div className="run-status-card">
            <p>每日运行时间：{category.scheduleTime}</p>
            <p>最近运行：{category.lastRunStatus}</p>
            <p>下次运行：{category.nextRunAt}</p>
          </div>
        </div>
      </SectionCard>

      <div className="metrics-grid">
        <MetricCard label="今日新增内容" value={String(todayContents.length)} hint="按最新监控日统计" />
        <MetricCard label="今日爆款内容" value={String(todayHotCount)} hint="热度分 85+" />
        <MetricCard label="覆盖平台数" value={String(category.settings.platforms.filter((item) => item.enabled).length)} hint="当前开启监控" />
        <MetricCard label="最新 AI 报告" value={latestReport.date} hint={latestReport.summary} />
        <MetricCard label="近 7 天新增选题" value={String(weeklyIdeas)} hint="来自日报沉淀" />
      </div>

      <SectionCard>
        <p className="eyebrow">今日重点洞察</p>
        <h3>{category.headlineInsight}</h3>
      </SectionCard>
    </div>
  );
}
```

Update `components/monitoring-dashboard.tsx` to render `OverviewHeader` above tab content.

Add the required CSS classes in `app/globals.css` for a desktop two-column dashboard, metrics grid, cards, tags, and status panels.

- [ ] **Step 4: Run the overview test**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/overview-header.tsx components/ui/metric-card.tsx components/ui/section-card.tsx components/ui/tag.tsx components/monitoring-dashboard.tsx app/globals.css tests/components/monitoring-dashboard.test.tsx
git commit -m "feat: add overview metrics and shared dashboard cards"
```

### Task 5: Implement the Content tab with platform chips and date timeline

**Files:**
- Create: `components/content-tab.tsx`
- Modify: `components/monitoring-dashboard.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing content tab assertion**

Append to `tests/components/monitoring-dashboard.test.tsx`:

```tsx
it("filters the content timeline by platform", async () => {
  const user = userEvent.setup();

  render(<MonitoringDashboard />);

  await user.click(screen.getByRole("tab", { name: "内容" }));
  await user.click(screen.getByRole("button", { name: "B站" }));

  expect(screen.getAllByText("B站").length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: FAIL because the tabstrip and content filtering do not exist.

- [ ] **Step 3: Implement content tab state and timeline UI**

Create `components/content-tab.tsx` with:

```tsx
import type { MonitoringCategory, Platform } from "../lib/types";
import { SectionCard } from "./ui/section-card";
import { Tag } from "./ui/tag";

const platforms: Platform[] = ["全部", "抖音", "小红书", "微博", "B站", "公众号"];

interface ContentTabProps {
  category: MonitoringCategory;
  activePlatform: Platform;
  onPlatformChange: (platform: Platform) => void;
  activeDate: string;
  onDateChange: (date: string) => void;
}

export function ContentTab({
  category,
  activePlatform,
  onPlatformChange,
  activeDate,
  onDateChange
}: ContentTabProps) {
  const dates = [...new Set(category.contents.map((item) => item.date))].sort().reverse();
  const visibleItems = category.contents.filter((item) => {
    const platformMatches = activePlatform === "全部" || item.platform === activePlatform;
    return item.date === activeDate && platformMatches;
  });

  return (
    <div className="tab-stack">
      <SectionCard>
        <div className="chip-row">
          {platforms.map((platform) => (
            <button
              key={platform}
              type="button"
              className={platform === activePlatform ? "chip active" : "chip"}
              onClick={() => onPlatformChange(platform)}
            >
              {platform}
            </button>
          ))}
        </div>
        <div className="date-rail">
          {dates.map((date) => {
            const count = category.contents.filter((item) => item.date === date).length;
            const hotCount = category.contents.filter((item) => item.date === date && item.heatScore >= 85).length;

            return (
              <button
                key={date}
                type="button"
                className={date === activeDate ? "date-card active" : "date-card"}
                onClick={() => onDateChange(date)}
              >
                <strong>{date}</strong>
                <span>{count} 条内容</span>
                <span>{hotCount} 条爆款</span>
              </button>
            );
          })}
        </div>
      </SectionCard>

      <div className="timeline-list">
        {visibleItems.map((item) => (
          <SectionCard key={item.id}>
            <div className="timeline-card">
              <div className="timeline-meta">
                <strong>{item.time}</strong>
                <span>{item.platform}</span>
                <span>热度 {item.heatScore}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.author} · {item.engagementSummary}</p>
              <p>{item.summary}</p>
              <div className="tag-row">
                <Tag>{item.matchedTarget}</Tag>
                {item.tags.map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
```

Update `components/monitoring-dashboard.tsx` to:

- track `activeTab`, `activePlatform`, and `activeContentDate`
- reset platform/date when switching categories
- render a tablist with buttons for `内容`, `选题分析与报告`, `监控设置`
- show `ContentTab` when `activeTab === "content"`

Add CSS for tabs, chip rows, horizontal date cards, and timeline cards.

- [ ] **Step 4: Run the content tab test**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/content-tab.tsx components/monitoring-dashboard.tsx app/globals.css tests/components/monitoring-dashboard.test.tsx
git commit -m "feat: add content tab timeline and platform filters"
```

### Task 6: Implement the Reports tab with daily and topic summary views

**Files:**
- Create: `components/reports-tab.tsx`
- Modify: `components/monitoring-dashboard.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing report view assertion**

Append to `tests/components/monitoring-dashboard.test.tsx`:

```tsx
it("switches from daily reports to topic summary view", async () => {
  const user = userEvent.setup();

  render(<MonitoringDashboard />);

  await user.click(screen.getByRole("tab", { name: "选题分析与报告" }));
  expect(screen.getByText("昨日热点总结")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "选题汇总" }));

  expect(screen.getByText("当前周期累计选题数")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: FAIL because the reports tab UI does not exist.

- [ ] **Step 3: Implement the reports tab**

Create `components/reports-tab.tsx` that:

- accepts `category`, `activeReportDate`, `onReportDateChange`, `reportView`, `onReportViewChange`, `topicRange`, `onTopicRangeChange`
- renders:
  - left-side daily summary cards for recent reports
  - right-side daily report details with `昨日热点总结`, `热门内容共性分析`, `选题建议`, `行动建议`
  - segmented toggle between `日报视图` and `选题汇总`
  - range chips for `最近 7 天`, `最近 14 天`, `最近 30 天`
  - topic grid cards showing title, brief, whyNow, growthAngle, sourcePlatforms, reportDate

Use this rendering skeleton:

```tsx
const rangeMap = {
  "7d": 7,
  "14d": 14,
  "30d": 30
} as const;
```

and compute topic cards by flattening `category.reports`.

Update `components/monitoring-dashboard.tsx` to manage `activeReportDate`, `reportView`, and `topicRange`, then render `ReportsTab` when `activeTab === "reports"`.

Add CSS for report split layout, daily summary cards, report content sections, and topic card grid.

- [ ] **Step 4: Run the report test**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/reports-tab.tsx components/monitoring-dashboard.tsx app/globals.css tests/components/monitoring-dashboard.test.tsx
git commit -m "feat: add report and topic analysis views"
```

### Task 7: Implement the Settings tab

**Files:**
- Create: `components/settings-tab.tsx`
- Modify: `components/monitoring-dashboard.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Write the failing settings assertion**

Append to `tests/components/monitoring-dashboard.test.tsx`:

```tsx
it("renders monitoring settings blocks", async () => {
  const user = userEvent.setup();

  render(<MonitoringDashboard />);

  await user.click(screen.getByRole("tab", { name: "监控设置" }));

  expect(screen.getByText("监控平台")).toBeInTheDocument();
  expect(screen.getByText("对标关键词")).toBeInTheDocument();
  expect(screen.getByText("对标博主/账号")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: FAIL because the settings tab UI does not exist.

- [ ] **Step 3: Implement the settings tab**

Create `components/settings-tab.tsx`:

```tsx
import type { MonitoringCategory } from "../lib/types";
import { SectionCard } from "./ui/section-card";
import { Tag } from "./ui/tag";

export function SettingsTab({ category }: { category: MonitoringCategory }) {
  return (
    <div className="tab-stack">
      <SectionCard>
        <h3>监控平台</h3>
        <div className="platform-settings-grid">
          {category.settings.platforms.map((item) => (
            <article key={item.id} className={item.enabled ? "setting-card enabled" : "setting-card"}>
              <strong>{item.platform}</strong>
              <p>{item.enabled ? "已启用" : "未启用"}</p>
              <span>{item.frequency}</span>
            </article>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <h3>对标关键词</h3>
        <div className="tag-row">
          {category.settings.keywords.map((keyword) => (
            <Tag key={keyword.id}>
              {keyword.label} · {keyword.hitCount}
            </Tag>
          ))}
        </div>
      </SectionCard>

      <SectionCard>
        <h3>对标博主/账号</h3>
        <div className="account-grid">
          {category.settings.accounts.map((account) => (
            <article key={account.id} className="account-card">
              <div className="avatar-placeholder">{account.name.slice(0, 1)}</div>
              <div>
                <strong>{account.name}</strong>
                <p>{account.platform} · {account.description}</p>
                <span>{account.lastActive}</span>
              </div>
            </article>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
```

Update `components/monitoring-dashboard.tsx` to render `SettingsTab` when `activeTab === "settings"`.

Add CSS for platform settings cards, account cards, and placeholder input treatment if lightweight add-new rows are included.

- [ ] **Step 4: Run the settings test**

Run: `npm run test -- tests/components/monitoring-dashboard.test.tsx`

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/settings-tab.tsx components/monitoring-dashboard.tsx app/globals.css tests/components/monitoring-dashboard.test.tsx
git commit -m "feat: add monitoring settings tab"
```

### Task 8: Polish responsive layout and verify the prototype end-to-end

**Files:**
- Modify: `app/globals.css`
- Modify: `components/monitoring-dashboard.tsx`
- Modify: `components/content-tab.tsx`
- Modify: `components/reports-tab.tsx`
- Modify: `components/settings-tab.tsx`

- [ ] **Step 1: Write the failing visual regression guard**

Append to `tests/components/monitoring-dashboard.test.tsx`:

```tsx
it("keeps all three primary tabs visible", () => {
  render(<MonitoringDashboard />);

  expect(screen.getByRole("tab", { name: "内容" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "选题分析与报告" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "监控设置" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the full test suite**

Run: `npm run test`

Expected: PASS for all component and mock data tests before final polish.

- [ ] **Step 3: Add responsive and visual polish**

Update CSS and any small component markup so the prototype includes:

- fixed desktop sidebar that collapses above tablet widths
- stacked metric cards on narrower screens
- horizontally scrollable chip rows and date rails on smaller screens
- clearly differentiated active states for category, tab, date, and report cards
- polished card spacing, subtle borders, and background gradients appropriate for an operator dashboard

For the main layout, ensure these selectors exist with responsive breakpoints:

```css
@media (max-width: 1180px) {
  .dashboard-shell {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .metrics-grid,
  .account-grid,
  .platform-settings-grid,
  .topic-grid {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 4: Run final verification**

Run:

```bash
npm run test
npm run build
```

Expected:

- `npm run test`: PASS
- `npm run build`: PASS

- [ ] **Step 5: Commit**

```bash
git add app/globals.css components/monitoring-dashboard.tsx components/content-tab.tsx components/reports-tab.tsx components/settings-tab.tsx tests/components/monitoring-dashboard.test.tsx
git commit -m "style: polish responsive monitoring dashboard prototype"
```

## Self-Review

Spec coverage check:

- category navigation: covered in Task 3
- overview summary: covered in Task 4
- content tab with platform chips and date timeline: covered in Task 5
- reports tab with daily and topic views: covered in Task 6
- settings tab with platforms, keywords, accounts: covered in Task 7
- responsive dashboard behavior and final verification: covered in Task 8
- realistic typed mock data: covered in Task 2
- Next.js workspace bootstrap: covered in Task 1

Placeholder scan:

- no `TBD` or `TODO` placeholders remain
- each task has file paths, commands, expected results, and concrete code skeletons

Type consistency check:

- shared domain types are introduced in `lib/types.ts` before component tasks use them
- `MonitoringDashboard`, `ContentTab`, `ReportsTab`, and `SettingsTab` all depend on the same tab/report/platform type names
- topic summary logic consistently uses `topicIdeas`
