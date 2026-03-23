# 当前冲刺：feat/spirit-hooks-cleanup

> 目标：收口 Phase 4 剩余 hooks 审查项 + Phase 6 前端轻量清理项，快速合并。

## Hooks 审查（Phase 4.4 收尾）

- [x] `useProvider` — 改用 `useShallow` 细粒度订阅，避免 models 变更触发整卡片重渲染
- [x] `useProvider` / `useProviderConnection` 职责边界 —
  `onReset` 完整内聚至 `useProviderConnection`，`onDisconnect` 已消除，
  `useProvider` 聚合层无业务逻辑片段
- [x] `useProviderModelList` — 改用 `useShallow` 合并订阅，`every` 简化全选派生；
  `pendingRef` 互斥锁防并发，两个 action 共享同一飞行状态标记
- [x] `useProviderStartup` 失败路径可见性 — `failed` phase 已映射 `CloudOff` 图标；
  结构性错误无具体 provider 归属，message 展示待 `errorCode` 统一后一并处理

## 前端轻量清理（Phase 6 子集）

- [ ] `reset` 一致性：仅在 `reset_provider=true` 时清理本地状态，
  失败时保留现状并提示
- [ ] `errorCode` 收敛：前端 `errorCode` 统一为联合类型 `ProviderErrorCode`，
  替代宽泛 `string`，支持消费侧穷举匹配
- [ ] `secret_meta` 前端消费闭环：展示 `has_key` / `key_source`，
  为 `last4` 等脱敏元信息预留接入位
- [ ] `ProviderCardActions` 按钮缺少 loading 状态 — reset / connect 操作期间补 pending UI 保护，防止重复触发
- [x] 前端事件名常量化 — `PROVIDER_CHECK_EVENTS` 常量已覆盖全部 listen 调用，硬编码已消除

## 审查顺序

1. `useProvider`（selector 性能 + 职责边界）
2. `useProviderStartup` 失败路径可见性
3. `useProviderModelList`（并发安全）
4. `reset` 一致性
5. `errorCode` 收敛
6. `secret_meta` 消费闭环
7. `ProviderCardActions` loading 状态
