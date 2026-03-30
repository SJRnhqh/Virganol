# TODO — feat/spirit-lifecycle-check

当前分支：Provider 生命周期链路审查与细节修缮。

---

| 区域 | 文件 | 状态 |
| ------ | ------ | ------ |
| App 入口 | `App.tsx` | ✅ 已审查 |
| 启动钩子 | `useProviderStartup.ts` | ✅ 已审查，TODO-1 / TODO-13 记录 |
| 模型钩子 | `useProviderModelList.ts` | ✅ 已审查，TODO-35 / TODO-36 记录 |
| 连接钩子 | `useProviderConnection.ts` | ✅ 已审查，TODO-37 / TODO-38 / TODO-39 / TODO-40 记录 |
| 聚合钩子 | `useProvider.ts` | ✅ 已审查 |
| API 触发层 | `check.ts` | ✅ 已审查，TODO-2 / TODO-34 记录 |
| 命令层 | `commands/settings.rs` | ✅ 已审查 |
| 生命周期入口 | `lifecycle/flow.rs` | ✅ 已审查，TODO-14 / TODO-15 记录 |
| 事件推送 | `lifecycle/events.rs` | ✅ 已审查，TODO-17 记录 |
| 异常兜底 | `lifecycle/failure.rs` | ✅ 已审查 |
| 并发检查 | `lifecycle/runner.rs` | ✅ 已审查，TODO-3 / TODO-16 记录 |
| 持久化读写 | `providers/store.rs` | ✅ 已审查，TODO-4 / TODO-19 记录 |
| 密钥解析 | `lifecycle/resolver.rs` | ✅ 已审查，TODO-5 / TODO-18 记录 |
| 检查结果处理 | `lifecycle/processor.rs` | ✅ 已审查，TODO-6 记录 |
| run_id 生成 | `lifecycle/rid.rs` | ✅ 已审查 |
| CRUD 服务层 | `providers/service.rs` | ✅ 已审查，TODO-23 记录 |
| 健康检查入口 | `connections/health.rs` | ✅ 已审查 |
| DeepSeek 连接 | `connections/deepseek.rs` | ✅ 已审查，TODO-20 记录 |
| Ollama 连接 | `connections/ollama.rs` | ✅ 已审查，TODO-20 记录 |
| 驱动抽象 | `providers/driver.rs` | ✅ 已审查 |
| 驱动注册表 | `providers/registry.rs` | ✅ 已审查 |
| 工具函数 | `providers/utils.rs` | ✅ 已审查 |
| Provider ID | `models/provider/id.rs` | ✅ 已审查 |
| 检查 payload | `models/provider/check.rs` | ✅ 已审查 |
| 快照模型 | `models/provider/snapshot.rs` | ✅ 已审查 |
| 错误基础类型 | `models/provider/error/base.rs` | ✅ 已审查，TODO-22 记录 |
| 错误码 | `models/provider/error/code.rs` | ✅ 已审查 |
| Provider 问题 | `models/provider/error/issue.rs` | ✅ 已审查 |
| 跳过明细 | `models/provider/error/skip.rs` | ✅ 已审查，TODO-21 记录 |
| 监听注册层 | `services/events/provider/listen.ts` | ✅ 已审查，TODO-32 记录 |
| 事件处理层 | `services/events/provider/handlers/check.ts` | ✅ 已审查，TODO-7 / TODO-33 记录 |
| 适配层 | `handlers/adapters/status.ts` | ✅ 已审查，TODO-8 / TODO-28 记录 |
| 调度层 | `handlers/schedulers/checkPhaseScheduler.ts` | ✅ 已审查，TODO-10 记录 |
| 分发层 | `handlers/dispatchers/checkPhase.ts` | ✅ 已审查，TODO-9 记录 |
| 校验层 | `handlers/validators/runGuard.ts` | ✅ 已审查，TODO-26 / TODO-27 记录 |
| 校验层 | `handlers/validators/activeProviderGuard.ts` | ✅ 已审查，TODO-29 记录 |
| check store | `store/provider/useProviderCheckStore.ts` | ✅ 已审查，TODO-11 / TODO-31 记录 |
| collection store | `store/provider/useProviderCollectionStore.ts` | ✅ 已审查，TODO-30 记录 |
| Provider ID 类型 | `types/provider/common/id.ts` | ✅ 已审查，TODO-24 记录 |
| 状态类型 | `types/provider/state/phase.ts` | ✅ 已审查，TODO-25 记录 |
| 状态类型 | `types/provider/state/` | ✅ 已审查，TODO-12 记录 |
| 常量层 | `constants/provider/lifecycle/` | ✅ 已审查 |
| 常量层 | `constants/provider/contract/` | ✅ 已审查 |
| 连接钩子 | `hooks/provider/useProviderConnection.ts` | ✅ 已审查，TODO-37~40 记录 |
| 模型钩子 | `hooks/provider/useProviderModelList.ts` | ✅ 已审查，TODO-35 / TODO-36 记录 |
| 封装钩子 | `hooks/provider/useProvider.ts` | ✅ 已审查 |
| 组件层 | `components/settings/provider/LLMProviders.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/ProviderTitle.tsx` | ✅ 已审查，TODO-34 联动 |
| 组件层 | `components/settings/provider/content/ProviderList.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/cards/ProviderItem.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/cards/ProviderCard.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/cards/ProviderCardHeader.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/cards/ProviderCardBody.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/cards/ProviderCardContent.tsx` | ✅ 已审查，TODO-43 记录 |
| 组件层 | `components/settings/provider/content/cards/ProviderCardActions.tsx` | ✅ 已审查，TODO-43 记录 |
| 组件层 | `components/settings/provider/content/cards/ProviderConnectionButton.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/cards/ProviderResetButton.tsx` | ✅ 已审查，TODO-42 记录 |
| 组件层 | `components/settings/provider/content/cards/ProviderConnectedPanel.tsx` | ✅ 已审查，TODO-41 记录 |
| 组件层 | `components/settings/provider/content/cards/ProviderForm.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/cards/ProviderErrorPanel.tsx` | ✅ 已审查 |
| 组件层 | `components/settings/provider/content/cards/ProviderModelToggleButton.tsx` | ✅ 已审查 |

---

## ✅ 已完成

**[TODO-1] bootstrap 错误来源无法区分** ✅

- 拆分 `registerCheckListeners` / `triggerProviderStartupCheck` 各自 try/catch，分别上报 `startup_listener_failed` / `startup_trigger_failed`。
- 补竞态保护注释，`cleanup!()` 修正类型，`bootstrap().catch` 兜底。

**[TODO-2] manual refresh 在 startup 期间的静默丢弃行为** ✅

- 确认语义为「只要检查在跑就算」，复用 startup promise 属预期行为，补注释说明设计决策。
- 补隐性契约注释（`checkInFlight` 单例前提）及 invoke 不可取消的预期行为注释。

**[TODO-3] AtomicBool 可简化为普通 bool** ✅

- `has_join_error` 改为普通 `mut bool`，移除 `AtomicBool` / `Ordering` import。

**[TODO-4] 写操作内部使用软读，store 损坏时静默覆盖丢失** ✅

- `save_provider` / `remove_provider` / `update_models` 改用 `load_all_providers_strict`，读取失败时上抛错误，不再静默覆盖写回。

**[TODO-5] keyring 密钥每个 provider 被读取两次** ✅

- 两函数合并为 `health_check_with_secret_meta`，一次解析同时返回 `HealthCheckResponse` + `ProviderSecretMeta`，keyring 系统调用从两次降为一次。

**[TODO-6] reconcile_error 升级为 lifecycle_failed 语义待确认** ✅

- 确认当前归入 `provider_issues` 触发 `lifecycle_failed` 在现有错误设计框架下自洽（写盘失败属结构性错误）。后续统一错误处理精细化阶段再引入 `infra_warnings` 分层上报，代码注释已更新说明设计意图。

**[TODO-7] handleStarted 重复触发无防护，依赖跨层隐性去重** ✅

- 确认设计决策：重复触发防护由上层 `checkInFlight` 保证，属已知跨层依赖，注释已更新说明。

**[TODO-8] `||` 应改为 `??`，避免空字符串被误转为 null** ✅

- `health.error || null` 改为 `health.error ?? null`，语义更精确，不对空字符串做额外假设。

**[TODO-9] `dispatchProviderIssue` 分两次 store 更新，与批量更新风格不一致** ✅

- 改用 `updateProviderBatch` 一次性批量更新，与 `dispatchProviderBatch` 风格统一。

**[TODO-10] scheduler 单例隐含跨层假设，无自身防护** ✅

- 确认设计合理：单例依赖上层 `checkInFlight` 保证互斥，职责分层清晰，注释已更新说明。

**[TODO-11] `setFailed` 中 `message` 为 undefined 时写入 undefined，与类型声明不符** ✅

- `message` 参数改为必填 `string`（从源头消除 undefined 可能），同步更新类型定义 `check.ts`。
- `runId` 的 conditional spread 改为 `runId: runId ?? null`，字段风格与 `errorCode`/`errorMessage` 统一。

**[TODO-12] `ProviderBatchUpdates.errorMessage` 的 undefined/null 语义区分属于隐性契约** ✅

- `errorMessage` 字段 JSDoc 补全三值语义说明（`undefined` 不更新 / `null` 清空 / `string` 写入），并注明未来可替换为结构化错误体而无需改动 store 实现。

**[TODO-13] bootstrap 失败后监听器未主动拆除** ✅

- `triggerProviderStartupCheck` 失败时在 catch 块内立即调用 `cleanup()`，拆除已注册的监听器，防止残留事件覆盖 failed 状态。

**[TODO-14] `duration_ms` 仅打日志未入 completed payload** ✅

- 确认 `duration_ms` 作为后端监控日志用途，前端暂无展示需求，现有实现自洽，无需改动。

**[TODO-15] Step 5 `join_error` 与 `provider_issues` 合并时优先级未注释** ✅

- 更新 Step 5 注释，明确 `join_error`（任务 panic）优先于 `provider_issues`（provider 级失败）的合并语义；删除已解决的 inline TODO。

**[TODO-16] `join_error` 发生后继续消费剩余任务，设计意图未注释** ✅

- 在 `Some(Err)` 分支补注释说明不提前退出循环是有意为之，确保其余 in-flight 任务结果仍可推送前端。

**[TODO-17] 事件名字符串硬编码，缺少常量模块** ✅

- 在 `events.rs` 文件顶部抽取四个 `const` 常量（`EVT_CHECK_STARTED` / `EVT_PROVIDER_STATUS` / `EVT_CHECK_COMPLETED` / `EVT_CHECK_FAILED`），函数体内字面量全部替换为常量引用。

**[TODO-18] 无密钥时静默传入空字符串，设计意图未注释** ✅

- `resolver.rs` 空字符串 fallback 处补注释，说明无密钥时传空字符串由各 provider 的 `health_check` 内部处理。

**[TODO-19] `PROVIDERS_STORE_LOCK` 静态 Mutex 待评估迁移，缺少追踪编号** ✅

- `store.rs` 锁声明处补注释，说明后续可评估迁移至 Tauri `State<Mutex<T>>` 统一管理（见 ROADMAP Phase 6.2）。

**[TODO-20] 健康检查每次创建新 `reqwest::Client`，无连接复用** ✅

- 两处 `Client::new()` 上方补注释，说明当前实现自洽，规模扩展后可提升为 `OnceLock<Client>` 复用连接池。

**[TODO-21] `SkippedProviderDetail` 缺少 `::new()` 构造函数** ✅

- 补 `impl SkippedProviderDetail { fn new(...) }`，与 `ProviderIssue::new()` 风格统一；`store.rs` 调用方同步更新。

**[TODO-22] `ProviderError` 无 `source()` 错误链** ✅

- 属错误精细化处理阶段（Phase 5.2）工作，在 `base.rs` 补 inline TODO 标记，留待统一处理时覆写 `source()` 或引入 `thiserror`。

**[TODO-23] `connect_and_save` 内联密钥回退逻辑，与 `resolver.rs` 重复** ✅

- 属 CRUD 链路优化，不在本阶段生命周期查漏补缺范围内；在 `service.rs` 密钥回退处补 inline TODO，说明后续可提取到 `secrets` 层统一管理。

**[TODO-24] `ProviderId` 类型宽度与运行时激活集合长期不一致** ✅

- 在 `id.ts` 补注释说明类型集合为完整枚举，运行时激活集合由 `constants/PROVIDER_IDS` 另行控制。

**[TODO-25] `degraded` 语义未注释，phase 状态机转换路径无类型约束** ✅

- `CheckTerminalPhase` JSDoc 补全 `degraded` 精确语义：流程正常结束但存在部分 provider 连接失败（业务性失败，非结构性错误）。

**[TODO-26] `RunDisposition` 类型定义在 validator 内部，消费方未显式依赖** ✅

- 三值设计动机注释已在 `runGuard.ts` 函数 JSDoc 中完整说明（current / orphan / stale 语义及兜底场景）。
- 类型提升至统一 types 目录暂缓，待服务层类型边界稳定后统一处理（代码内 TODO 注释已保留追踪）。

**[TODO-27] 空字符串 `runId` 未做防御，`"orphan"` 消费者行为不一致** ✅

- 空字符串场景不存在：store 初始值为 `null`，后端 `run_id` 为 UUID，防御无必要。
- orphan 策略差异已有注释覆盖：`runGuard.ts` JSDoc 说明「仅部分事件允许兜底」，`handleFailed` 的 warn 日志说明 orphan accepted 语义，设计意图可读。

**[TODO-28] `success: true` 但 `available_models: []` 时与检查失败状态无法区分** ✅

- 后端已在源头消除：Ollama 无模型时直接返回 `success: false`（`"No models available"`），不存在 `success: true` + `available_models: []` 的组合，语义混淆场景不会发生。
- `config.url` 空字符串静默忽略：后端只将持久化配置原样推回，不会主动下发空字符串清空 URL，`formPatch: undefined` 保持不动是正确行为。

**[TODO-29] `isActiveProviderId` 线性扫描，未来扩展时可改为 Set 查找** ✅

- 线性扫描：`PROVIDER_IDS` 当前只有 2 个元素，非热路径，无性能问题，等规模增长再优化。
- `satisfies` 约束：`constants/provider/common/id.ts` 已有 `as const satisfies readonly ProviderId[]`，新增 `ProviderId` 时若 `PROVIDER_IDS` 未同步更新，TypeScript 编译期即报错，类型安全已覆盖。

**[TODO-30] 初始化时 `models` 字段跨 provider 共享同一对象引用** ✅

- `createInitialById` 中补显式 `models: { available: [], enabled: {} }`，每个 provider 初始化时获得独立对象引用；同步从 `COMMON_INITIAL_STATE` 中移除 `models` 字段，消除死代码。

**[TODO-31] `setDone` / `setDegraded` 未显式清除 error 字段，隐性依赖 `setChecking` 先行** ✅

- 生命周期 action 不应孤立调用，`setChecking` 先行是状态机正常链路的固有约束，非隐性依赖。测试应覆盖完整链路而非单个 action，不修。

**[TODO-32] 注册失败回滚时无意义地调用 `disposeCheckPhaseScheduler`** ✅

- 无论注册成功或失败，`cleanupRegisteredListeners` 彻底清理所有资源是正确语义，scheduler dispose 对未启动的实例是 no-op，无害。两路复用同一清理函数比拆分更优雅。
- 同步删除 `listen.ts` 顶部遗留的阶段性 TODO 注释，链路审查已完成。

**[TODO-33] `handleFailed` orphan 路径双重日志，级别语义混乱** ✅

- 合并为按 disposition 区分的单条日志：orphan 路径输出 `console.warn`，current 路径输出 `console.error`，消除语义矛盾。

---

## 前端 · services/api/provider/check.ts

**[TODO-34] `triggerProviderManualRefresh` 调用方无 catch，invoke 失败时产生 unhandled rejection**

- 文件：`apps/ui/src/features/bot/services/api/provider/check.ts`
- 描述：`triggerCheckLifecycle` 在 `.catch` 中 re-throw 错误。startup 路径由 `useProviderStartup` 的 `.catch` 承接；但 `triggerProviderManualRefresh` 的调用方（`ProviderTitle` 组件）以 `onClick={() => triggerProviderManualRefresh()}` 调用，未附加 `.catch`，invoke 失败时产生 unhandled promise rejection，用户无任何错误反馈。
- 建议：在 `ProviderTitle` 调用处补 `.catch` 处理，或在 `triggerProviderManualRefresh` 内部消化错误并通过 store 写入失败状态。
- 优先级：低，手动刷新失败时用户无感知。

---

## 前端 · hooks/provider/useProviderModelList.ts

**[TODO-35] `allSelected` 在模型列表为空时返回 `true`，语义误导**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderModelList.ts`
- 描述：`available.every((model) => enabled[model])` 在 `available` 为空数组时因 vacuous truth 始终返回 `true`，导致无模型时全选按钮呈现为「已全选」（Minus 图标），语义误导用户。
- 建议：改为 `available.length > 0 && available.every((model) => enabled[model])`。
- 优先级：中，存在误导性 UI 状态。

**[TODO-36] 全量回滚逐条调用 `setModelEnabled`，触发 N 次 store 更新**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderModelList.ts`
- 描述：`handleToggleAllModels` 失败回滚时对 `current.available` 每个 model 单独调用 `setModelEnabled`，触发 N 次 immer set 和 N 次订阅通知。应一次性还原整个 models 对象，减少不必要的渲染触发。
- 建议：改为调用 `setProviderModels(providerId, { available: current.available, enabled: previousMap })`，一次批量还原。
- 优先级：低，功能正确，性能小优化。

---

## 前端 · hooks/provider/useProviderConnection.ts

**[TODO-37] `handleConnect` 未捕获异常，invoke 抛出时卡片永远卡在 PENDING**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderConnection.ts`
- 描述：`connectAndSaveProvider(...)` 若直接抛出（非返回 `{success: false}`），外层无 try/catch，卡片状态停在 `PENDING` 无法自动恢复，用户无法感知失败也无法重试。`handleRetry` 先清空错误再调 `handleConnect`，同样走此路径，错误已清空但新错误不会写入。
- 建议：在 `handleConnect` 的 await 外包 try/catch，catch 时写入 `FAILED` 状态与错误信息。
- 优先级：中，真实可触路径。

**[TODO-38] `handleReset` 表单先清空，后端失败时无回退**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderConnection.ts`
- 描述：`setProviderForm(PROVIDER_INITIAL_FORMS[...])` 在 `await resetProvider(...)` 之前执行，若后端抛出，表单已被清空但 `cardState` 未回退，用户丢失输入且界面无错误提示。
- 建议：将表单清空移至 `resetProvider` 成功后执行，或在 catch 中还原表单并写入错误状态。
- 优先级：中，数据丢失场景。

**[TODO-39] `handleConnect` 成功时总将所有模型重置为启用，覆盖用户已有偏好**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderConnection.ts`
- 描述：`enabled` 初始化为 `Object.fromEntries(available_models.map(m => [m, true]))`。在 CONNECTED 状态下重新连接（更新配置），用户之前手动禁用的模型会被静默全部重新启用，用户无感知。
- 需确认语义：重新连接是否应视为「重新初始化」而全量覆盖，还是应与旧 enabled 状态做 merge 保留用户偏好？
- 优先级：低，语义未收口。

**[TODO-40] `response.error || "Connection failed"` 应改为 `??`**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderConnection.ts`
- 描述：`response.error || "Connection failed"` 在 `response.error` 为空字符串时会错误地回退到默认文案，与 TODO-8 中 adapters 层同类问题一致，应改为 `response.error ?? "Connection failed"` 以准确区分 null/undefined 与空字符串。
- 优先级：低，潜在语义错误，与 TODO-8 同类。

---

## 前端 · components/settings/provider（组件层）

**[TODO-41] `ProviderConnectedPanel` 模型列表为空时无空态 UI**

- 文件：`apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderConnectedPanel.tsx`
- 描述：`modelItems` 为空时渲染空白的 `divide-y` 容器，无任何占位提示，用户无法判断是加载中还是 provider 确实没有可用模型。
- 建议：在列表区域补「No models available」空态占位，与 `allSelected` 空数组语义修复（TODO-35）配合。
- 优先级：低，UX 缺口。

---

**[TODO-42] `ProviderResetButton` 缺少 `disabled` prop，重置进行中可重复触发**

- 文件：`apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderResetButton.tsx`
- 描述：`ProviderResetButton` 无 `disabled` 状态，`handleReset`（TODO-38）进行中用户可再次点击，导致并发发起两次 reset 请求；第二次执行时表单已被第一次清空，状态不一致风险升高。
- 建议：向 `ProviderResetButton` 传入 `disabled` prop，并在 `ProviderCardActions` 的 CONNECTED/FAILED 分支中，于 reset 进行中将其禁用；或在 `handleReset` 入口加 in-flight 互斥锁。
- 优先级：中，与 TODO-38 联动，并发重置风险。

---

**[TODO-43] `ProviderCardContent` / `ProviderCardActions` switch 无 default 分支**

- 文件：`apps/ui/src/features/bot/components/settings/provider/content/cards/ProviderCardContent.tsx`、`ProviderCardActions.tsx`
- 描述：两处 switch 均无 `default` 分支，若 `cardState` 出现枚举外的意外值（如后端新增状态、类型断言失误），React 会静默渲染 `undefined`，页面空白且无任何日志提示，调试困难。
- 建议：各补一个 `default` 分支，返回 `null` 并附 `console.warn`，或用 TypeScript `exhaustive check`（`cardState satisfies never`）在编译期捕获遗漏。
- 优先级：低，防御性收口。
