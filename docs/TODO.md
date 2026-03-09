# TODO - Provider 生命周期前端审查与优化

> **创建时间**: 2025-03-07
> **预计完成**: 待更新
> **状态**: 进行中

## 目标

完成 Provider 生命周期管理的前端审查与优化（后端已完成）。

审查顺序：**store → handlers → hooks → components**（自底向上）。

---

## 已完成

- [x] 后端 Rust：Workspace 重构、可见性收紧、生命周期逻辑优化、错误处理
- [x] 前端 types/：契约类型 + 状态类型 + 分组导出
- [x] 前端 constants/：事件名、阶段、延迟常量，前后端对齐
- [x] 前端 api/：启动检查、手动刷新、Provider CRUD
- [x] 前端 events/listen.ts：4 种事件串行注册 + 失败回滚 + 统一 cleanup
- [x] 前端 events/runGuard.ts：run_id 防串扰
- [x] 前端 handlers 职责净化：移除 scheduler 调用，handler 只做 payload → store action

---

## 待办

### 1. store/ 审查

- [ ] `useProviderCheckStore` — 基本完成
  - [x] `setDone()` / `setDegraded()` / `setFailed()`
  - [ ] `reset()`
- [ ] `useProviderCollectionStore` — 完整审查
  - [ ] 初始化、卡片状态、表单、模型、错误相关 action

### 2. handlers 审查（依赖 store 审查完成）

- [ ] `handleProviderStatus()` — 表单/卡片/错误/模型四块写入
- [x] `handleCompleted()` — failed 数量路由
- [x] `handleFailed()` — 全局 failed 已收敛；issue 下沉与结构性错误兜底语义已审清

### 3. hooks/ 审查

- [ ] `useProviderStartup.ts` — 监听注册 + 启动触发 + cleanup（已确认先监听、后触发）
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
- [ ] 修复 `handleProviderStatus` 模型更新逻辑（Issue #1）
- [ ] 生命周期延迟编排重新设计（scheduler 已从 handler 移除，需在 store 层或独立模块重新实现）
- [ ] 其他审查中发现的问题
- [ ] 提交 PR

---

## 已知问题

### Issue #1: handleProviderStatus 模型更新逻辑

**位置**: `events/provider/handlers.ts` 模型更新分支

1. 健康检查失败时，模型列表没有清空（前端仍显示旧模型）
2. `success: true` 但 `available_models: []` 时不会更新（空数组被忽略）

**优先级**: P1

### Issue #2: 生命周期延迟编排待重建

**背景**: 原 `lifecycleScheduler.ts` 负责 checking→终态补足延迟 + 终态→idle 回归，已从 handler 中移除以净化职责。

**待决**: scheduler 归属位置（store 内部 subscribe / 独立模块），全部审查完成后再设计。

---

## 备注

- 本文档用于短期任务跟踪，完成后归档并删除
- 配合 `roadmap.md` 使用（中长期规划）
