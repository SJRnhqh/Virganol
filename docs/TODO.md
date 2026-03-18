# TODO - Provider 生命周期前端审查与优化

> **创建时间**: 2025-03-07
> **预计完成**: 待更新
> **状态**: 进行中

## 目标

完成 Provider 生命周期管理的前端审查与优化（后端已完成）。

默认审查顺序：**store → handlers → hooks → components**（自底向上）；本轮已按事件主链路交叉推进，当前重点转向
旧 `connection` 接口的最终审查与收口，以及 `ProviderConnectedPanel` 相关局部 hooks 的审查与完善。

---

## 已完成

- [x] 后端 Rust：Workspace 重构、可见性收紧、生命周期逻辑优化、错误处理
- [x] 前端 types/：契约类型 + 状态类型 + 分组导出
- [x] 前端 constants/：事件名、阶段、延迟常量，前后端对齐
- [x] 前端 api/：启动检查、手动刷新、Provider CRUD
- [x] 前端 events/listen.ts：4 种事件串行注册 + 失败回滚 + 统一 cleanup
- [x] 前端 events/runGuard.ts：run_id 防串扰
- [x] 前端 handlers 职责净化：移除 scheduler 调用，handler 只做 payload → store action
- [x] 前端 handlers：`handleCompleted()` / `handleFailed()` 主链路已审清，`handleProviderStatus()`
成功/失败分支已收敛
- [x] 类型系统架构统一：`ProviderId`、`ProviderCardState`、
`ProviderCheckPhase`、`ProviderCheckEvent` 迁移至 types 底层
，constants 使用 `satisfies` 约束
- [x] `useProviderCollectionStore` 引入 `immer` 中间件，优化所有 action 嵌套更新
- [x] 前端架构重构：icons 视觉资源层独立，消除循环依赖（-199 行代码）
- [x] settings/provider 目录重构：消除 registry 概念，统一 provider 组件管理
- [x] `ProviderHeader` 优化：通过 `PHASE_CLOUD_ICONS` 映射统一管理生命周期图标（106→58 行，-45%）
- [x] **渲染层组件架构优化**（2025-03-11）
  - [x] 动画文件重组：拆分 `lib/animations/common.ts`（通用）和 `lib/animations/providerLifecycle.ts`（专用）
  - [x] `ProviderHeader` className 可读性：引入 `cn()` 多行格式 + 语义注释
  - [x] icon 管理收拢：从调用侧手动映射迁移到 `useProvider` Hook 内部自动关联
  - [x] Props 类型复用：创建 `types/provider/props/id.ts` 定义 `WithProviderId` 可组合类型
  - [x] 组件分层清晰化：LLMProviders（页面）→ ProviderHeader/ProviderList（功能区）→ ProviderItem
  （适配层）→ ProviderCard（卡片层）
  - [x] Props 传递最小化：只传必需的 `id`，其他数据由 Hook 派生
- [x] **ProviderConnectionButton 配置驱动重构**（2025-03-13）
  - [x] 创建 `types/provider/custom/button.ts`
    定义 `DualIconButton` / `ButtonAnimation` 核心类型
  - [x] 创建 `icons/provider/connection.tsx`
    定义 `CONNECTION_BUTTON_ICONS` 映射
  - [x] 创建 `constants/provider/connection/{labels,animations}.ts` 定义状态映射
  - [x] 重构 `ProviderConnectionButton` 为单一配置驱动组件，删除 4 个独立按钮组件
  - [x] 创建 `types/provider/props/state.ts` 定义 `WithCardState` 可组合片段
  - [x] 创建 `types/provider/props/button.ts` 定义 `ProviderConnectionButtonProps`
  - [x] 优化 `ProviderCardHeaderProps` 结构：`extends WithCardState` + `provider` 独立字段
  - [x] 统一参数顺序：组件解构顺序与接口定义顺序一致（extends 字段优先）
- [x] **ProviderConnectedPanel 接口收紧与局部 Hook 收口**
  - [x] 移除 `fields` 冗余传递，connected 面板直接使用 `form.formData.apiURL`
  - [x] 类型定义重命名并归位到 `connected.ts`（`ProviderConnectedPanelProps`）
  - [x] 移除 `ProviderField` 中的 `isUrl` 字段
  - [x] 创建 `PROVIDER_NAMES` 常量（`constants/provider/common/name.ts`）
  - [x] `meta.ts` → `info.ts`，`ProviderInfo` 统一承载 `id` / `name` / `icon`
  - [x] `WithProviderId` 字段统一为 `id`
  - [x] `useProvider` 收紧为 card-level shell：不再聚合 `models`
  - [x] `ProviderConnectedPanel` 模型消费局部化：不再通过 `ProviderCard` / `ProviderCardBody`
  逐层透传
  - [x] 新增 `useProviderConnectedPanel`，最终收口为
  `modelItems` / `allSelected` / `onToggleModel` / `onToggleAllModels`
  - [x] 删除公共 props 契约 `WithProviderModels`
  - [x] 优化 `ProviderCardContent` 统一展开传参风格，移除冗余 `default` 分支
  - [x] `ProviderCardContent` connected / failed 分支改为显式传参，统一内容路由风格

---

## 待办

### 1. store/ 审查

- [x] `useProviderCheckStore` — 基本完成 ✅
  - [x] `setDone()` / `setDegraded()` / `setFailed()`
  - [x] `reset()`
- [x] `useProviderCollectionStore` — 已完成 ✅
  - [x] 初始化逻辑优化（提取 `COMMON_INITIAL_STATE`，使用 `reduce` 函数式风格）
  - [x] 类型系统重构（`ProviderId`、`ProviderCardState`、`ProviderCheckPhase` 迁移至 types 底层）
  - [x] 职责分离（`PROVIDER_IDS` / `PROVIDER_INITIAL_FORMS` / `PROVIDER_DEFINITIONS`）
  - [x] 卡片状态、表单、模型、错误相关 action 审查
  - [x] 引入 `immer` 中间件优化嵌套更新（代码行数 146→89，-39%）

### 2. handlers 审查（依赖 store 审查完成）

- [x] `handleProviderStatus()` — 成功/失败分支已收敛；与 `CollectionStore` 的写入边界待继续复核
- [x] `handleCompleted()` — failed 数量路由
- [x] `handleFailed()` — 全局 failed 已收敛；issue 下沉与结构性错误兜底语义已审清

### 3. hooks/ 审查（当前主线）

- [x] `useProviderStartup.ts` — 监听注册 + 启动触发 + cleanup（已确认先监听、后触发）
- [ ] `useProviderConnection.ts` — connect / disconnect / errorReset（旧 `connection`
接口主审查对象）
- [ ] `useProvider.ts` — 状态聚合（已收紧为 card-level shell，待继续优化 selector 性能）
- [x] `useProviderConnectedPanel.ts` — connected 面板视图派生已从组件抽离，接口已收口为双态全选 ViewModel
- [ ] `useProviderModelActions.ts` — 模型开关（`ProviderConnectedPanel` 相关局部 hook 主审查对象）

### 4. components/ 审查（渲染层）

当前审查结论：`ProviderConnectedPanel` 组件层已基本稳定；后续组件侧仅保留按需微调。下一步重点不
再是 card 渲染结构，而是旧 `connection` 接口和 `ProviderConnectedPanel` 相关局部 hooks。

- [x] `settings/provider/content/ProviderHeader.tsx` — phase 图标 + 刷新按钮，`cn()`
多行格式优化 ✅
- [x] `settings/provider/content/ProviderList.tsx` — 列表渲染，PROVIDER_IDS 迭代 ✅
- [x] `settings/provider/content/ProviderItem.tsx` — Hook 调用容器，`WithProviderId`
Props 类型复用 ✅
- [x] **渲染层架构优化** ✅
  - [x] icon 管理收拢到 `useProvider` Hook（消除调用侧手动映射）
  - [x] 创建 `types/provider/props/id.ts` 定义 `WithProviderId` 可复用 Props 类型
  - [x] 组件分层清晰：LLMProviders（页面）→ ProviderHeader/ProviderList（功能区）→ ProviderItem
  （适配层）→ BaseProvider（展示层）
  - [x] Props 传递最小化：只传必需的 `id`，其他数据由 Hook 派生
- [x] **卡片组件命名优化**（2025-03-11）✅
  - [x] `ProviderHeader` → `ProviderCardHeader`（消除与全局 Header 命名冲突）
  - [x] `ProviderBody` → `ProviderCardBody`（语义更清晰）
  - [x] 创建 `types/provider/props/card.ts` 定义 `ProviderCardProps` 框架
  - [x] 创建 `types/provider/props/info.ts` 定义 `ProviderInfo`（id + name + icon）
  - [x] 创建 `types/provider/props/form.ts` 定义 `WithProviderForm`（待完善）
- [x] `ProviderCardHeader` 收口 ✅
  - [x] `ProviderCardHeader` className 改用 `cn()` 统一管理
  - [x] 创建 `types/provider/props/header.ts` 定义 `ProviderCardHeaderProps`
  - [x] `ProviderCardHeader` Props 收紧为 `provider` / `cardState` / `open`
  - [x] 新增 `icons/provider/card.tsx` 统一管理 `cardState → icon` 映射
- [x] **ProviderConnectionButton 配置驱动重构**（2025-03-13）✅
  - [x] 创建 `types/provider/custom/button.ts` 定义按钮核心类型
  - [x] 创建 `icons/provider/connection.tsx` / `constants/provider/connection/` 配置映射
  - [x] 重构为单一配置驱动组件，删除 5 个冗余组件
  - [x] 创建 `types/provider/props/state.ts` 定义 `WithCardState`
  - [x] 创建 `types/provider/props/button.ts` 定义 `ProviderConnectionButtonProps`
- [x] **ProviderCardBody 内容层接口收紧**（2025-03-17 完成）✅
  - [x] 创建 `types/provider/props/content.ts` 定义 `cardState → cardContent` 映射约束
  - [x] 创建 `ProviderCardContent` 统一内容路由层
  - [x] 合并 `UnsetProviderForm` / `PendingProviderForm` /
    `BaseProviderForm` 为单一 `ProviderForm`
  - [x] `ProviderForm` 契约归位：
    `ProviderFormContent` / `ProviderFormProps` /
    `ProviderEditableState` / `ProviderFormVariantConfig`
    与 `PROVIDER_FORM_VARIANTS`
    已分别归位到 `types` / `constants`
  - [x] `FailedProviderForm` → `ProviderErrorPanel`
  - [x] `ProviderErrorPanel` 契约归位：
    `ProviderFailedContent` / `ProviderErrorPanelProps` /
    `ProviderFailedState` 已收口
  - [x] `ProviderErrorPanel` 图标改为复用
    `PROVIDER_CARD_STATE_ICONS.failed`
  - [x] `forms/` 内容层拍平（移除 `provider/connection/` 嵌套）
  - [x] `BaseProvider` → `ProviderCard`
  - [x] 收紧 editable 内容层接口
    （移除 `ProviderEditableContent` / `BaseProviderForm`）
  - [x] 收紧 failed 内容层接口
    （由 content 路由承载 `errorMessage`，组件层补 `cardState`）
  - [x] 收紧 connected 内容层接口（移除 `fields` 冗余，直接使用 `form.formData.apiURL`）
  - [x] 移除 `ProviderField.isUrl` 字段
  - [x] 创建 `PROVIDER_NAMES` 常量并导出
  - [x] 合并 `id` / `icon` / `name` 为 `ProviderInfo` 对象（`provider`）
  - [x] `ProviderCardContent` 统一展开传参风格，移除冗余 `default` 分支
  - [x] **表单接口收紧**（2025-03-16）
    - [x] 合并 `fields` 到 `WithProviderForm` 接口（与 `formData` 内聚）
    - [x] `ProviderFormProps` 保留 `form` 嵌套层（为未来扩展预留空间）
    - [x] `ProviderCardContent` 修正传参：`form={cardContent}` 而非展开
  - [x] **卡片层接口收紧**（2025-03-17）
    - [x] `cardState` 从 `ProviderConnectionProps` 独立到 `ProviderCardProps` 顶层
    - [x] `errorMessage` 从 `ProviderConnectionProps` 独立到 `ProviderCardProps` 顶层
    - [x] `ProviderConnectionProps` 纯操作化：移除状态字段
    - [x] `ProviderCardProps` / `ProviderCardBodyProps` 移到 `types/provider/props/`
    统一管理
    - [x] 保持 `ProviderCardContent` 路由层职责，架构一致性
  - [x] 审查 `useProvider` 钩子返回值与组件 Props 对齐关系
  - [x] **表单操作整合与接口简化**（2025-03-17）
    - [x] 整合 `handleReset` 逻辑到 `form.onReset`（Hook 层业务逻辑收拢）
    - [x] 移除 `ProviderCardBodyProps.onReset` 冗余参数
    - [x] 移除 `ProviderCard` 中 `onReset={form.onReset}` 冗余传参
    - [x] `ProviderConnectedPanelProps` 保留 `provider` + `form` 两个稳定语义块
    - [x] `ProviderConnectedPanel` 当前直接使用 `provider.id` 与 `form.formData.apiURL`
    - [x] 更新 `ProviderCardBodyProps` TODO 注释（移除已完成的 onReset 收紧项）
  - [x] **连接操作接口简化**（2025-03-17）
    - [x] 移除 `ProviderConnectionProps.onDisconnect`（仅作为 Hook 内部实现）
    - [x] `onDisconnect` 保留在 `useProviderConnection` 中供 `form.onReset` 调用
    - [x] 更新 `ProviderConnectionProps` 注释：明确只暴露组件层需要的操作
  - [x] **模型管理接口收紧**
    - [x] `models` 不再作为公共 props 契约经 `ProviderCard` 链路逐层传递
    - [x] 删除 `types/provider/props/models.ts` 与 `WithProviderModels`
    - [x] 模型状态和操作局部化到 `ProviderConnectedPanel` + `useProviderConnectedPanel`
    - [x] 组件内仅保留模型列表渲染所需的最小数据（`modelItems` / `allSelected` / `onToggle*`）
- [x] **组件目录重构**（2025-03-17）
  - [x] 合并 `base/provider/`、`forms/`、`buttons/provider/` 到 `settings/provider/content/cards/`
  - [x] 统一卡片层组件管理（9 个组件集中在 `cards/` 目录）
  - [x] 更新所有导入路径（相对路径改为同目录引用）
  - [x] 清理类型导出（移除不存在的 `ProviderFormContent`）
  - [x] `cards/index.ts` 只导出 `ProviderItem`（其他组件内部使用）
  - [x] 保留 `ProviderItem` 适配层（便于未来针对特定 provider 扩展）
  - [x] 重命名 `ProviderHeader` → `ProviderTitle`（避免与 `ProviderCardHeader` 混淆）
- [x] **ProviderConnectedPanel 渲染优化**（2025-03-18）✅
  - [x] 移除 Reset 按钮（将在 Body 层独立实现 ProviderCardActions）
  - [x] 移除表头（"Model" / "Enabled" 冗余标签）
  - [x] 移除空模型分支：connected 面板不再渲染空态 UI（当前契约下 connected 必有模型）
  - [x] 连接信息图标化：有 URL 显示 Link 图标 + URL，无 URL 显示 Zap 图标 + "Active"
  - [x] 工具栏移至顶部：连接信息 + 全选操作整合在顶部工具栏
  - [x] 全部 className 改用 `cn()` + 注释分组，提升可读性
  - [x] 布局优化：模型列表优先，辅助信息在顶部工具栏
  - [x] Hook 接口收紧：移除冗余的 `hasUrl` 和 `connectionUrl` 参数，组件直接使用 `form.formData.apiURL`
  - [x] 交互方式优化：从胶囊开关改为加减符号
    - [x] 移除复选框边框和背景，改为纯符号交互
    - [x] 单个模型：`-` 表示已启用（点击禁用），`+` 表示未启用（点击启用）
    - [x] 全选操作：`-` 表示全选（点击全不选），`+` 表示未全选（点击全选）
    - [x] 全选状态收口为双态：仅保留 `allSelected`，非全选统一显示 `+`
    - [x] 移除所有动画效果，保持极简风格
    - [x] 符号移至左侧，模型名称在右侧
    - [x] 代码继续精简：空态分支与三态选择逻辑已移除

- [ ] `ProviderConnectedPanel.tsx` — 如有需要再做纯渲染微调（图标映射 / 行容器职责），不作为当前主线

### 5. 修补与收尾

- [x] 修复 `started` 丢失时 `failed` 事件可能被前端误判 stale 的问题
- [x] 修复 `handleProviderStatus` 模型更新逻辑（失败时清空模型；成功时空模型也同步）
- [ ] 生命周期延迟编排重新设计（scheduler 已从 handler 移除，需在 store 层或独立模块重新实现）
- [x] `handleProviderStatus` — 收敛多次零散 `set` 为单次批量更新，减少重渲染
- [ ] 前端 `errorCode` 收敛为联合类型（替代宽泛 `string`），与后端 `ProviderErrorCode` 对齐
- [x] `useProviderStartup` — 启动失败时写入 `checkStore.setFailed()`，避免 UI 无感知
- [ ] **🚨 紧急：实现 ProviderCardActions（Reset 功能）** — Reset 按钮已从 ConnectedPanel 移除
需尽快在 Body 层实现独立的 Actions 区域，否则用户无法重置连接
- [ ] 其他审查中发现的问题
- [ ] 提交 PR

## 下一步主线

- [ ] 旧 `connection` 接口审查与收口：聚焦 `ProviderConnectionProps`、
`useProviderConnection.ts` 与 `ProviderCardBody` 中的连接动作编排
- [ ] `ProviderConnectedPanel` 相关局部 hooks 审查与完善：聚焦 `useProviderModelActions.ts`
与 `useProviderConnectedPanel.ts`

---

## 已知问题

### Issue #1: 生命周期延迟编排待重建

**背景**: 原 `lifecycleScheduler.ts` 负责 checking→终态补足延迟 + 终态→idle 回归，已从 handler 中移除以净化职责。

**待决**: scheduler 归属位置（store 内部 subscribe / 独立模块），全部审查完成后再设计。

---

## 备注

- 本文档用于短期任务跟踪，完成后归档并删除
- 配合 `roadmap.md` 使用（中长期规划）
