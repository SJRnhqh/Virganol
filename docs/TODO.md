# 当前冲刺：feat/spirit-hooks-cleanup

> 目标：收口 Phase 4 剩余 hooks 审查项 + Phase 6 前端轻量清理项，快速合并。

## Hooks 审查（Phase 4.4 收尾）

- [ ] `useProvider` — 优化 store selector 性能，避免整对象订阅触发不必要重渲染
- [ ] `useProviderModelList` — 评估乐观更新并发安全性
  （快速连续点击 / `allSelected` 时序问题）

## 前端轻量清理（Phase 6 子集）

- [ ] `reset` 一致性：仅在 `reset_provider=true` 时清理本地状态，
  失败时保留现状并提示
- [ ] `errorCode` 收敛：前端 `errorCode` 统一为联合类型 `ProviderErrorCode`，
  替代宽泛 `string`，支持消费侧穷举匹配
- [ ] `secret_meta` 前端消费闭环：展示 `has_key` / `key_source`，
  为 `last4` 等脱敏元信息预留接入位

## 审查顺序

`useProvider` → `useProviderModelList` → reset → errorCode → secret_meta
