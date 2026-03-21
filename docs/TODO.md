# TODO - Provider 生命周期前端任务板

> 创建时间：2025-03-07
> 当前状态：进行中
> 维护方式：仅保留当前结论与待办，历史展开过程以 `ROADMAP.md` 为准

## 目标

完成当前阶段 Provider 生命周期前端收尾，并保证以下边界成立：

- 当前运行时仅启用 `deepseek` / `ollama`；其余 provider 保留占位定义，但不参与本阶段 UI / lifecycle /
CRUD 链路
- 仅聚焦 `Tauri ↔ React` 生命周期与安全持久化
- Provider 改动同时满足生命周期链路与 CRUD 链路一致性

当前前端主线已收口为：`types → constants → icons → store → services → hooks
→ components → views`

默认审查顺序调整为：`store → services → hooks → components`
其中 `services` 统一承接所有与桌面层/后端交互相关的 `api` 与 `events` 边界。

---

## 当前结论

- store / handlers 主链路已基本完成，生命周期事件消费、run_id 防串扰与状态落盘语义已对齐
- 目录结构已完成一轮收口：`api/` 与 `events/` 已统一归入 `services/`，前端分层主线更清晰
- `events/provider` 已收口为 `listen + handlers(check + validators +
adapters/status + schedulers/checkPhase)`，生命周期事件处理边界已基本清晰
- `ProviderCard` 子树组件接口已基本收口，当前不再是主要风险点
- 组件层后续主线不再是结构重构，而是 `reset` 的语义设计与最小可用落位
- 当前 PR 若要可提交，重点应放在：生命周期闭环、`reset` 一致性、`update_models` 并发安全与范围收敛

---

## 已完成摘要

### 生命周期主链路

- [x] `useProviderCheckStore` / `useProviderCollectionStore` 已完成基础形态收口
- [x] 生命周期事件监听、失败回滚、run_id 守卫、startup check 触发链路已打通
- [x] `handleStarted` / `handleCompleted` / `handleFailed` / `handleProviderStatus`
已完成主链路收敛
- [x] `handleProviderStatus` 已修复失败时模型残留、成功时空模型不同步等问题
- [x] checking → terminal → idle 的 phase scheduler 已落位，并在监听清理时统一释放 timer
- [x] 调度层专项审查已完成：`handlers/` 收口为五层
  （check / validators / adapters / dispatchers / schedulers），
  scheduler 为纯时序模块（仅依赖 constants），dispatch 独立到 `dispatchers/checkPhase`
- [x] 事件 handler 全量审查完成：四个 handler 均已收口，
  `check.ts` 无 store/constants 直接依赖，
  `run disposition` 判定已补齐 orphan/stale 区分，`failed` 可兜底承接 started 未到达场景，
  `dispatchProviderIssue` 新增收口 issues 写入
- [x] scheduler 深度重构：`scheduleTerminal` 抽取消除重复，
  timer 语义重命名为 `toTerminalTimer` / `toIdleTimer`，
  `PROVIDER_CHECK_DELAYS` 拆分为 `CHECKING_DELAY` + `PROVIDER_IDLE_DELAY`（phase 映射）
- [x] 类型层次重构：`CheckTerminalPhase → TerminalPhase → ProviderCheckPhase` 三层组合，
  `TimerHandle` 迁入 `types/shared/timer.ts`

### 类型与契约

- [x] `ProviderId` / `ProviderCardState` / `ProviderCheckPhase` / `ProviderCheckEvent`
已统一收口到底层 types
- [x] `constants` 使用 `satisfies` 对齐底层联合类型
- [x] 前后端生命周期事件与主要 payload 契约已对齐
- [x] 事件处理目录已收口为 `handlers/check + validators + adapters + dispatchers + schedulers`
- [x] `active provider guard` 已隔离“当前运行时启用范围”与“全量 Provider 定义”，避免 `ProviderId` 类型漂移噪音

### 组件层

- [x] `ProviderCard` 子树分层稳定：`ProviderItem → ProviderCard → ProviderCardBody
→ ProviderCardContent → leaf`
- [x] `ProviderCardHeader` / `ProviderConnectionButton` / `ProviderConnectedPanel`
已完成主要接口收口
- [x] `ProviderCardActions` / `ProviderResetButton` 已落位，`connected / failed` 下提供独立
reset 入口
- [x] reset 动作区已收为右侧同行布局：主按钮 + icon-only reset，交互保持克制
- [x] `ProviderConnectedPanelProps` 已收紧为 `provider + connectionInfo`
- [x] `ProviderCardBodyProps` 已收口为 `ProviderCardProps` 语义别名，避免重复定义漂移
- [x] 按钮动作类型已统一为 `ProviderButtonAction`，组件内部桥接 DOM click，编排层不再依赖事件对象类型
- [x] `ProviderModelToggleButton` 已补基础 hover / active / focus 反馈，点击感知更明确

### Hook 层

- [x] `useProviderStartup` 已完成
- [x] `useProviderConnection` 已完成旧 `connection` 接口收口
- [x] `onReset` 已从 `form` 语义块迁移到 `connection` 语义块，reset 不再作为表单动作暴露
- [x] `useProviderModelList`（原 `useProviderConnectedPanel`）已完成内联合并：
  `useProviderModelActions` 已删除，模型数据与开关动作统一收口到
  `useProviderModelList`，store 订阅拆分为独立 selector，
  callback 依赖数组精简为 `[providerId]`
- [x] `useProviderModelList` 本次 PR 内联合并已完成；
  乐观更新并发安全性（快速连续点击 / `allSelected` 时序）后移至下一阶段
- [x] `useProvider` selector 性能优化后移至下一阶段

---

## PR 提交前必须项

### 1. 生命周期闭环

- [x] 生命周期延迟编排已补齐
  - `events/provider/handlers/schedulers` 已接管
    checking → terminal → idle 的 phase 时序
  - 监听清理时会统一释放 scheduler timer，避免卸载后残留写入
- [x] 生命周期调度专项审查已完成
  - listen / handlers / schedulers 的 cleanup 边界与职责收口已确认
- [x] orphan failed 的 run 认领顺序一致性已完成
  - `claimFailedRunIfNeeded` 已在 scheduler 内处理先于 started 到达的场景
- [x] orphan failed `trigger` 语义：前端兜底接受 `null`，后移细化

### 2. Reset 最小闭环

- [x] 设计并实现最小可用的 `reset` 入口
  - `ProviderCardBody` 已新增 `ProviderCardActions` 路由层，
    `connected / failed` 下提供 `Reset` 入口
  - `reset` 语义已从 `form` 收回到 `connection`，表单层仅保留输入相关操作

### 3. 模型链路一致性

- [x] `useProviderModelActions` 已合并入 `useProviderModelList`
  - 重复订阅问题已修复（独立 selector）
  - callback 依赖数组已精简为 `[providerId]`
  - 乐观更新并发安全性后移至下一阶段

### 4. 范围收敛

- [x] 前端运行时范围已收敛到 `deepseek` / `ollama`
- [x] 事件层已新增 `active provider guard`

### 5. 安全闭环

- [x] `connect` 成功后清空前端内存态 `apiKey`

---

## 备注

- 本文档只追踪当前任务重心，不再记录细碎开发日志
- 更完整的阶段演进与历史背景请查看 `docs/ROADMAP.md`
- 后移项均已收录至 `ROADMAP.md` Phase 6
