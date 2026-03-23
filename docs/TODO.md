# 当前冲刺：feat/spirit-hooks-cleanup

> 目标：收口 Phase 4.4 hooks 审查项，快速合并。

## Hooks 审查（Phase 4.4 收尾）

- [x] `useProvider` — 改用 `useShallow` 细粒度订阅，避免 models 变更触发整卡片重渲染
- [x] `useProvider` / `useProviderConnection` 职责边界 —
  `onReset` 完整内聚至 `useProviderConnection`，`onDisconnect` 已消除，
  `useProvider` 聚合层无业务逻辑片段
- [x] `useProviderModelList` — 改用 `useShallow` 合并订阅，`every` 简化全选派生；
  `pendingRef` 互斥锁防并发，两个 action 共享同一飞行状态标记
- [x] `useProviderStartup` 失败路径可见性 — `failed` phase 已映射 `CloudOff` 图标；
  结构性错误无具体 provider 归属，message 展示待 `errorCode` 统一后一并处理

## 已跳过（延后至 Phase 6）

以下项已在 ROADMAP Phase 6 记录，不在本分支处理：

- `reset` 一致性、`errorCode` 收敛、`secret_meta` 消费闭环、
  `ProviderCardActions` loading 状态、事件名常量化（已完成）
