# TODO - Provider 生命周期前端审查与优化

> **创建时间**: 2025-03-07
> **预计完成**: 待更新
> **状态**: 进行中

## 目标

完成 Provider 生命周期管理的前端审查与优化（后端已完成）。

默认审查顺序：**store → handlers → hooks → components**（自底向上）；本轮已按事件主链路交叉推进，当前重点转向 `CollectionStore`。

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

---

## 待办

### 1. store/ 审查

- [ ] `useProviderCheckStore` — 基本完成
  - [x] `setDone()` / `setDegraded()` / `setFailed()`
  - [ ] `reset()`
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

### 3. hooks/ 审查

- [x] `useProviderStartup.ts` — 监听注册 + 启动触发 + cleanup（已确认先监听、后触发）
- [ ] `useProviderConnection.ts` — connect / disconnect / errorReset
- [ ] `useProvider.ts` — 状态聚合
- [ ] `useProviderModelActions.ts` — 模型开关

### 4. components/ 审查

- [ ] `ProviderHeader.tsx` — phase 图标 + 刷新按钮
- [ ] `BaseProvider.tsx` — 展开/收起 + 数据传递
- [ ] `ProviderForm.tsx` — cardState 分发
- [ ] `ProviderList.tsx` — 列表渲染

### 5. 修补与收尾

- [x] 修复 `started` 丢失时 `failed` 事件可能被前端误判 stale 的问题
- [x] 修复 `handleProviderStatus` 模型更新逻辑（失败时清空模型；成功时空模型也同步）
- [ ] 生命周期延迟编排重新设计（scheduler 已从 handler 移除，需在 store 层或独立模块重新实现）
- [ ] `handleProviderStatus` — 收敛多次零散 `set` 为单次批量更新，减少重渲染
- [ ] 前端 `errorCode` 收敛为联合类型（替代宽泛 `string`），与后端 `ProviderErrorCode` 对齐
- [ ] `useProviderStartup` — 启动失败时写入 `checkStore.setFailed()`，避免 UI 无感知
- [ ] 其他审查中发现的问题
- [ ] 提交 PR

---

## 已知问题

### Issue #1: 生命周期延迟编排待重建

**背景**: 原 `lifecycleScheduler.ts` 负责 checking→终态补足延迟 + 终态→idle 回归，已从 handler 中移除以净化职责。

**待决**: scheduler 归属位置（store 内部 subscribe / 独立模块），全部审查完成后再设计。

---

## 备注

- 本文档用于短期任务跟踪，完成后归档并删除
- 配合 `roadmap.md` 使用（中长期规划）
