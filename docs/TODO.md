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
- [x] `useProviderConnectedPanel` 已收口为 connected 面板局部 ViewModel
- [ ] `useProviderModelActions` 仍待完成并发与订阅优化
- [ ] `useProvider` 仍有 selector 性能优化空间

---

## PR 提交前必须项

### 1. 生命周期闭环

- [x] 生命周期延迟编排已补齐
  - `events/provider/handlers/schedulers` 已接管 checking → terminal → idle 的 phase
  时序
  - 监听清理时会统一释放 scheduler timer，避免卸载后残留写入
- [ ] 生命周期调度实现仍待专项审查
  - 重点是 listen / handlers / schedulers 的 cleanup 边界与职责收口
  - 当前剩余阻塞点已收敛到 orphan failed 的局部一致性，而不是整体结构重构
- [ ] 补齐 orphan failed 的 run 认领顺序一致性
  - 避免 scheduler 已认领 run、但 `checkStore.runId` 仍未写入的短暂语义缝隙
- [ ] 明确 orphan failed 的 `trigger` 语义
  - 当前异常失败态已可补 `runId`，但 `trigger` 仍可能为空；需明确是前端兜底接受 `null`，还是后端 failed payload 补齐

### 2. Reset 最小闭环

- [x] 设计并实现最小可用的 `reset` 入口
  - `ProviderCardBody` 已新增 `ProviderCardActions` 路由层，`connected / failed` 下提供 `Reset`
  入口
  - `reset` 语义已从 `form` 收回到 `connection`，表单层仅保留输入相关操作

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
- [x] 事件层已新增 `active provider guard`
  - 当前仅在 `services/events/provider/handlers/validators` 内部消费
  - 目标是先消除编辑器 / TS 噪音，不提前放开其它 provider，也不把临时范围收敛扩散到 hooks 主线

### 5. 安全闭环

- [x] `connect` 成功后清空前端内存态 `apiKey`
  - 成功分支已在前端 store 中清空表单态密钥，失败时仍保留输入供用户修正

---

## 可顺手完成但不必阻塞 PR

- [ ] `useProvider` selector 性能优化
- [ ] 前端 `errorCode` 收敛为共享联合类型
- [ ] `RunDisposition` 收口到统一类型管理入口
  - 当前先局部留在 `services/events/provider/handlers/validators/runGuard.ts`
  - 待服务层类型边界稳定后，再决定是否迁入共享 `types` 导出链
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

1. 补 orphan failed 的 run / trigger 语义闭环
2. 收 `useProviderModelActions`
3. 补 `reset` 返回值与本地状态一致性
4. 处理 `useProvider` selector 性能收尾
5. 评估 `errorCode` 联合类型与 `secret_meta` 消费闭环

---

## 分析结论

从当前代码状态看，如果抛开测试覆盖与更细的体验打磨，这次 PR 的主要风险已经不在组件结构本身，而在链路一致性。

更具体地说：

- 组件层：`ProviderCard` 子树接口已经足够稳定，后续只需承接 `reset`
- Hook 层：`useProviderModelActions` 仍是当前最需要继续处理的点
- CRUD 一致性：`reset` 和 `update_models` 仍需补到“行为正确”而不只是“界面能点”
- 生命周期语义：当前全局 phase 调度已补齐，剩余风险已收敛到 orphan failed 的 run / trigger 闭环，
以及 hooks 与 CRUD 一致性
- 安全边界：当前阻塞项已回到密钥持久化边界与 Provider 支持范围收敛本身，不再包含前端明文 `apiKey` 长期驻留问题

因此，这份 TODO 的重心已经重新调整为：

1. hook 层并发与一致性
2. reset 最小闭环
3. 范围与安全收尾
4. 类型与元信息收尾

---

## 备注

- 本文档只追踪当前任务重心，不再记录细碎开发日志
- 更完整的阶段演进与历史背景请查看 `docs/ROADMAP.md`
