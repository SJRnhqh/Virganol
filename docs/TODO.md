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

### 类型与契约

- [x] `ProviderId` / `ProviderCardState` / `ProviderCheckPhase` / `ProviderCheckEvent`
已统一收口到底层 types
- [x] `constants` 使用 `satisfies` 对齐底层联合类型
- [x] 前后端生命周期事件与主要 payload 契约已对齐

### 组件层

- [x] `ProviderCard` 子树分层稳定：`ProviderItem → ProviderCard → ProviderCardBody
→ ProviderCardContent → leaf`
- [x] `ProviderCardHeader` / `ProviderConnectionButton` / `ProviderConnectedPanel`
已完成主要接口收口
- [x] `ProviderConnectedPanelProps` 已收紧为 `provider + connectionInfo`
- [x] `ProviderCardBodyProps` 已收口为 `ProviderCardProps` 语义别名，避免重复定义漂移
- [x] 按钮动作类型已统一为 `ProviderButtonAction`，组件内部桥接 DOM click，编排层不再依赖事件对象类型

### Hook 层

- [x] `useProviderStartup` 已完成
- [x] `useProviderConnection` 已完成旧 `connection` 接口收口
- [x] `useProviderConnectedPanel` 已收口为 connected 面板局部 ViewModel
- [ ] `useProviderModelActions` 仍待完成并发与订阅优化
- [ ] `useProvider` 仍有 selector 性能优化空间

---

## PR 提交前必须项

### 1. 生命周期闭环

- [ ] 生命周期延迟编排补齐，或在本次 PR 中明确降 scope
  - 背景：原 scheduler 已从 handler 中移除，当前 checking → 终态补足 / 终态 → idle 回归尚未重新落位
  - 要求：不能让这次“生命周期 PR”在生命周期编排上留一个悬空口子

### 2. Reset 最小闭环

- [ ] 设计并实现最小可用的 `reset` 入口
  - 目标不是复杂交互，而是保证用户有稳定的 reset 通路
  - 推荐落位：`ProviderCardBody` 的 actions 区域，或独立 `ProviderCardActions`

- [ ] 修正 `reset` 返回值一致性
  - 仅当 `reset_provider === true` 时才清理本地状态
  - `false` 时保留现状并提供最小失败反馈

### 3. 模型链路一致性

- [ ] 完成 `useProviderModelActions.ts` 收口
  - 处理重复订阅问题
  - 处理乐观更新回滚的并发风险
  - 保证 `update_models` 与当前 CRUD 语义一致

### 4. 范围收敛

- [x] 前端运行时范围已收敛到 `deepseek` / `ollama`
  - 当前要求是“仅启用”，不是“删除所有未来 provider 定义”
  - 已收敛 `PROVIDER_IDS` 与卡片渲染入口
  - 其余 provider 暂时保留类型、名称、表单等占位定义

### 5. 安全闭环

- [x] `connect` 成功后清空前端内存态 `apiKey`
  - 成功分支已在前端 store 中清空表单态密钥，失败时仍保留输入供用户修正

---

## 可顺手完成但不必阻塞 PR

- [ ] `useProvider` selector 性能优化
- [ ] 前端 `errorCode` 收敛为共享联合类型
- [ ] `ProviderConnectedPanel.tsx` 纯渲染微调
- [ ] `secret_meta` 的前端消费闭环
- [ ] `connect / retry` 成功后的模型状态一致性
  - 避免前端默认全选与后端保留 `enabled_models` 交集之间出现短时漂移
- [ ] 手动刷新触发链路的 Promise 消费
  - 避免 `triggerProviderManualRefresh()` 的 rejected promise 在 UI 侧悬空

---

## 明确后移项

以下内容不是本次 PR 的阻塞项，除非在实现过程中顺手完成，否则不强行纳入：

- [ ] 更细粒度的健康检查错误模型与前端展示
- [ ] 事件名 / payload 自动化 codegen
- [ ] `store.rs` 读改写优化
- [ ] `resolver.rs` 密钥读取去重
- [ ] 额外的组件视觉微调

---

## 下一步执行顺序

1. 先决定生命周期 scheduler 是补齐还是降 scope
2. 落 `reset` 的最小入口与返回值一致性
3. 收 `useProviderModelActions`
4. 收敛前端 Provider 范围到 `deepseek / ollama`

---

## 分析结论

从当前代码状态看，如果抛开测试覆盖与更细的体验打磨，这次 PR 的主要风险已经不在组件结构本身，而在链路一致性。

更具体地说：

- 组件层：`ProviderCard` 子树接口已经足够稳定，后续只需承接 `reset`
- Hook 层：`useProviderModelActions` 仍是当前最需要继续处理的点
- CRUD 一致性：`reset` 和 `update_models` 仍需补到“行为正确”而不只是“界面能点”
- 生命周期语义：scheduler 不能继续悬空
- 安全边界：当前阻塞项已回到密钥持久化边界与 Provider 支持范围收敛本身，不再包含前端明文 `apiKey` 长期驻留问题

因此，这份 TODO 的重心已经重新调整为：

1. 生命周期闭环
2. reset 最小闭环
3. hook 层并发与一致性
4. 范围与安全收尾

---

## 备注

- 本文档只追踪当前任务重心，不再记录细碎开发日志
- 更完整的阶段演进与历史背景请查看 `docs/ROADMAP.md`
