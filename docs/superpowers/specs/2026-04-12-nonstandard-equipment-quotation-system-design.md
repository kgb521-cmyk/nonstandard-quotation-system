# 非标检测设备报价系统设计文档

日期：2026-04-12

## 1. 项目目标

构建一个适用于温控、流量、压力、流体、老化测试设备的“非标检测设备报价系统”MVP，用于支持销售和工程师协同完成设备选型、报价测算和方案输出。

系统需要支持：

- 录入客户信息、应用场景、技术参数、商务条款
- 通过规则引擎自动匹配设备模块
- 自动计算报价金额
- 自动生成完整工业设备报价方案
- 支持人工校正
- 支持导出 HTML 和打印为 PDF

本次交付采用“折中版”路线：MVP 使用 SQLite 跑通完整业务闭环，但代码结构需为未来切换 PostgreSQL 和扩展复杂流程预留空间。

## 2. MVP 范围

### 2.1 在范围内

- 基础账号登录
- 角色区分：销售、工程师、管理员
- 报价项目新建、查看、编辑、复制
- 五类设备场景的示例规则：
  - 温控
  - 流量
  - 压力
  - 流体
  - 老化测试
- 技术参数结构化录入
- 规则引擎自动匹配模块
- 自动生成模块清单和报价明细
- 人工校正模块、数量、单价、备注
- 生成两类文档：
  - 精简报价单
  - 完整方案书
- HTML 预览与导出
- 浏览器打印为 PDF
- SQLite 持久化
- 示例数据与种子数据

### 2.2 不在范围内

- 复杂审批流
- 多版本报价对比
- Excel 导入导出
- 服务端 PDF 渲染引擎
- 规则可视化编辑器
- 多组织、多租户

## 3. 总体架构

系统采用分层单体架构，在一个 Next.js + TypeScript 仓库中实现前后端协同，但在代码组织上保持清晰分层。

### 3.1 技术选型

- 前端：Next.js + TypeScript
- 后端：Node.js + TypeScript
- 数据库：SQLite（MVP），通过 Prisma 建模，未来可切 PostgreSQL
- 文档导出：HTML 模板生成 + 浏览器打印为 PDF

### 3.2 分层结构

- `app/`
  - 页面、布局、路由、API 路由
- `src/features/quotation/`
  - 报价录入、编辑、预览、校正的应用层逻辑
- `src/server/rules/`
  - 规则配置加载、规则判断、模块匹配执行器
- `src/server/quotation/`
  - 报价计算、项目聚合、调整合并
- `src/server/documents/`
  - 报价单和方案书 HTML 生成器
- `src/server/db/`
  - Prisma client 和仓储访问抽象
- `config/rules/`
  - 可配置规则文件
- `prisma/`
  - schema 和种子数据

### 3.3 架构目标

- MVP 快速可运行
- 规则配置化
- 未来数据库可切换
- 报价逻辑与页面解耦
- 文档模板和业务计算复用同一份报价数据

## 4. 核心业务流程

1. 销售创建报价项目
2. 录入客户信息、应用场景、商务条款
3. 工程师补充技术参数
4. 系统执行规则引擎，自动匹配设备模块
5. 系统按模块、运费、安装调试费、税率自动计算报价
6. 用户人工校正模块、数量、单价、备注
7. 系统生成精简报价单和完整方案书
8. 用户导出 HTML 或打印为 PDF

## 5. 数据模型设计

数据库围绕“报价项目”而不是固定设备型号建模，以适配非标设备场景。

### 5.1 users

字段建议：

- `id`
- `name`
- `email`
- `passwordHash`
- `role`：`sales | engineer | admin`
- `createdAt`
- `updatedAt`

### 5.2 customers

- `id`
- `name`
- `company`
- `contactName`
- `contactPhone`
- `industry`
- `region`
- `address`
- `createdAt`
- `updatedAt`

### 5.3 quotation_projects

- `id`
- `projectCode`
- `title`
- `customerId`
- `ownerUserId`
- `equipmentCategory`
- `applicationScenario`
- `status`
- `currency`
- `taxRate`
- `shippingFee`
- `commissioningFee`
- `paymentTerms`
- `deliveryTerms`
- `warrantyTerms`
- `notes`
- `createdAt`
- `updatedAt`

### 5.4 quotation_inputs

用于存结构化技术参数，MVP 以 JSON 为主，便于快速扩展不同设备类型的参数集。

- `id`
- `projectId`
- `inputJson`
- `createdAt`
- `updatedAt`

`inputJson` 示例字段：

- 温度范围
- 压力范围
- 流量范围
- 介质类型
- 工位数量
- 测试对象
- 控制方式
- 安装环境

### 5.5 matched_modules

记录规则引擎输出的模块结果和最终报价所采用的模块。

- `id`
- `projectId`
- `moduleCode`
- `moduleName`
- `moduleCategory`
- `specSummary`
- `quantity`
- `unit`
- `unitPrice`
- `lineTotal`
- `sourceRuleCode`
- `selectionMode`：`auto | manual`
- `isOverridden`
- `overrideReason`
- `sortOrder`
- `createdAt`
- `updatedAt`

### 5.6 quotation_adjustments

记录人工修正的轨迹。

- `id`
- `projectId`
- `moduleId`
- `adjustmentType`
- `beforeValue`
- `afterValue`
- `reason`
- `operatorUserId`
- `createdAt`

### 5.7 quotation_documents

- `id`
- `projectId`
- `documentType`：`summary | proposal`
- `title`
- `htmlContent`
- `version`
- `createdByUserId`
- `createdAt`

### 5.8 rule_sets

- `id`
- `name`
- `version`
- `description`
- `isActive`
- `createdAt`

### 5.9 rule_audit_logs

便于解释一次报价为何命中某些模块，也便于调试规则。

- `id`
- `projectId`
- `ruleCode`
- `matched`
- `message`
- `payloadJson`
- `createdAt`

## 6. 规则引擎设计

### 6.1 设计目标

- 规则配置化
- 支持设备类别级 + 模块级匹配
- 支持参数联动
- 支持解释命中原因
- 不引入过重 DSL

### 6.2 实现方式

MVP 采用“声明式配置 + TypeScript 执行器”的方式。

规则文件放在 `config/rules/*.json`，每类设备可单独配置。

每条规则包含：

- `code`
- `name`
- `equipmentCategory`
- `priority`
- `conditions`
- `actions`
- `description`

### 6.3 条件结构

条件支持：

- 等于 / 不等于
- 大于 / 大于等于
- 小于 / 小于等于
- 包含
- 区间判断
- AND / OR 组合

示例条件：

- 温控设备且最低温度小于 `-20`
- 流体设备且介质为腐蚀性
- 老化测试设备且工位数大于 `8`

### 6.4 动作结构

动作支持：

- 追加模块
- 替换模块
- 修改模块数量
- 修改价格系数
- 写入说明文本

示例动作：

- 追加低温制冷模块
- 将泵材质升级为不锈钢
- 控制柜数量按 `ceil(workstations / 8)` 计算

### 6.5 执行结果

规则执行后输出：

- 命中规则列表
- 模块清单
- 每个模块的数量依据
- 每个模块的价格依据
- 审计日志

## 7. 报价计算逻辑

报价计算分两层：模块层和项目层。

### 7.1 模块层

每个模块包含：

- 基础单价
- 默认数量
- 单位
- 规则调整后的数量
- 人工覆盖后的单价或数量

模块金额计算公式：

`lineTotal = quantity * unitPrice`

### 7.2 项目层

项目汇总包括：

- 设备小计
- 运费/包装
- 安装调试费
- 税前总价
- 含税总价

公式如下：

- `equipmentSubtotal = sum(lineTotal)`
- `subtotalBeforeTax = equipmentSubtotal + shippingFee + commissioningFee`
- `totalWithTax = subtotalBeforeTax * (1 + taxRate)`

### 7.3 可解释性

系统需保留以下信息用于界面展示：

- 模块来自哪条规则
- 数量如何得出
- 哪些值为人工调整
- 总价由哪些组成项构成

## 8. 文案生成模块设计

文案生成模块基于模板、结构化数据和场景片段库生成两类输出。

### 8.1 精简报价单 summary

内容包括：

- 客户信息
- 项目概述
- 核心配置清单
- 报价明细
- 商务条款

### 8.2 完整方案书 proposal

内容包括：

- 封面
- 客户需求摘要
- 应用场景理解
- 技术配置说明
- 推荐模块明细
- 报价明细
- 交付范围
- 商务条款
- 备注与免责声明

### 8.3 生成策略

- 模板 + 数据插值
- 不同设备类型使用不同说明片段
- 技术参数自动生成“配置依据说明”
- 人工可在导出前修改补充说明和商务备注

## 9. 页面结构设计

### 9.1 登录页

- 账号登录
- 按角色进入系统

### 9.2 报价项目列表页

- 查看项目
- 新建项目
- 复制项目
- 快速查看状态

### 9.3 报价编辑页

采用四步流：

1. 客户与项目基本信息
2. 技术参数录入
3. 自动匹配模块与人工校正
4. 报价结果与文档生成

### 9.4 报价单预览页

- 精简版报价单 HTML 预览
- 打印导出

### 9.5 方案书预览页

- 完整方案书 HTML 预览
- 打印导出

### 9.6 规则查看页

MVP 先做只读，用于展示当前规则集和命中逻辑说明。

## 10. 项目结构建议

```text
nonstandard-quotation-system/
├── app/
│   ├── (auth)/
│   ├── dashboard/
│   ├── quotations/
│   ├── api/
│   ├── globals.css
│   └── layout.tsx
├── components/
│   ├── quotation/
│   ├── documents/
│   └── ui/
├── config/
│   └── rules/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── features/
│   │   └── quotation/
│   ├── server/
│   │   ├── db/
│   │   ├── rules/
│   │   ├── quotation/
│   │   └── documents/
│   ├── lib/
│   └── types/
├── public/
├── docs/
│   └── superpowers/
│       └── specs/
└── package.json
```

## 11. 示例规则方向

### 11.1 温控设备

- 低温需求触发制冷模块
- 高温需求触发高温加热模块
- 温区数量影响控制回路数量

### 11.2 流量设备

- 流量范围决定流量计量程
- 高精度要求触发高精度传感器

### 11.3 压力设备

- 压力上限决定管路等级和安全阀等级
- 高压场景触发防护机柜

### 11.4 流体设备

- 介质类型决定材质
- 腐蚀性介质触发不锈钢或防腐模块

### 11.5 老化测试设备

- 工位数量决定工装数量和控制柜数量
- 长时运行需求触发散热和监控模块

## 12. 示例数据需求

MVP 需提供：

- 3 个测试账号
  - 销售
  - 工程师
  - 管理员
- 至少 5 个模块库示例
- 每类设备至少 2 至 4 条规则
- 至少 3 个报价项目样例

## 13. 实施顺序

1. 初始化 Next.js + TypeScript + Prisma + SQLite
2. 编写数据库 schema 和种子数据
3. 实现规则引擎与模块匹配
4. 实现报价计算逻辑
5. 实现报价录入与校正界面
6. 实现报价单与方案书 HTML 生成
7. 完成导出、示例数据和端到端串联

## 14. 测试策略

重点测试：

- 规则匹配是否正确
- 模块数量联动是否正确
- 报价汇总公式是否正确
- 人工校正是否覆盖自动结果
- 文档生成是否包含完整关键信息

建议测试类型：

- 单元测试：规则执行器、报价计算器、文档生成器
- 集成测试：项目保存、模块匹配、文档预览
- 冒烟测试：从新建报价到导出文档的主流程

## 15. 风险与后续扩展

### 15.1 当前风险

- 不同设备类别的参数差异较大，参数模型需要保持弹性
- 规则复杂度持续增加时，JSON 配置可能需要演进
- PDF 暂时采用浏览器打印方案，适合 MVP，但不适合批量服务端导出

### 15.2 后续扩展方向

- 切换 PostgreSQL
- 增加审批流和版本流转
- 增加备件、折扣、售后服务包
- 引入规则后台维护界面
- 支持正式 PDF 渲染和邮件发送

## 16. 成功标准

MVP 完成后，应满足以下标准：

- 用户可登录并创建报价项目
- 用户可录入一套完整技术参数
- 系统可自动匹配模块并给出可解释报价
- 用户可人工修正结果
- 系统可生成精简报价单与完整方案书
- 用户可导出 HTML，并通过浏览器打印为 PDF
- 项目可在本地一键运行并附带示例数据
