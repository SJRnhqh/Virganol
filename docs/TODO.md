# TODO — feat/spirit-lifecycle-check

当前分支：Provider 生命周期链路审查与细节修缮。

---

## 前端 · useProviderStartup

**[TODO-1] bootstrap 错误来源无法区分**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderStartup.ts`
- 描述：`bootstrap().catch` 统一用 `startup_bootstrap_failed`，无法区分是 `registerCheckListeners` 失败还是 `triggerProviderStartupCheck` 失败。
- 建议：拆分 try/catch，分别捕获并上报不同错误码，便于排查。

---

## 前端 · check.ts

**[TODO-2] manual refresh 在 startup 期间的静默丢弃行为**

- 文件：`apps/ui/src/features/bot/services/api/provider/check.ts`
- 描述：`startup` 与 `manual` 共享同一 in-flight 锁。startup 进行中触发 manual refresh，会静默复用 startup 的 promise，调用方无从感知自己的请求是否被真正执行。
- 需确认语义：manual refresh 是「确保一次新检查」还是「只要检查在跑就算」。

---

## 后端 · store.rs

**[TODO-4] 写操作内部使用软读，store 损坏时静默覆盖丢失**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/store.rs`
- 描述：`save_provider` / `remove_provider` / `update_models` 内部调用 `load_all_providers`（软读，失败时静默返回空 HashMap），store 文件损坏时会用空 Map 覆盖写回，导致其他 provider 配置静默丢失。
- 建议：改用 `load_all_providers_strict`，读取失败时上抛错误。
- 优先级：中，数据安全问题。

---

## 后端 · resolver.rs

**[TODO-5] keyring 密钥每个 provider 被读取两次**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/resolver.rs`
- 描述：`health_check_with_resolved_key` 与 `resolve_provider_secret_meta` 各自独立读取密钥，keyring 属于系统调用，每个 provider 会被调用两次。
- 建议：合并为一次解析，将 key 与 key_source 一并返回复用。
- 优先级：低，性能小优化。

---

## 后端 · processor.rs

**[TODO-6] reconcile_error 升级为 lifecycle_failed 语义待确认**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/processor.rs`
- 描述：`reconcile_error`（模型列表写盘失败）会被上层推入 `provider_issues` 进而触发 `lifecycle_failed`，但此时 provider 本身 online，仅本地模型列表未更新成功。
- 需确认：是否应降级为 warn 日志而非终止整个生命周期。
- 优先级：中，语义设计问题。

---


**[TODO-3] AtomicBool 可简化为普通 bool**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/runner.rs`
- 描述：`has_join_error` 仅在 `join_next().await` 串行消费分支中读写，不存在并发写竞争，`AtomicBool` 的 AcqRel 保序多余，可改为普通 `bool`。
- 优先级：低，不影响正确性。

---


| 区域 | 文件 | 状态 |
|------|------|------|
| App 入口 | `App.tsx` | ✅ 已审查 |
| 启动钩子 | `useProviderStartup.ts` | ✅ 已审查，TODO-1 记录 |
| API 触发层 | `check.ts` | ✅ 已审查，TODO-2 记录 |
| 命令层 | `commands/settings.rs` | ✅ 已审查 |
| 生命周期入口 | `lifecycle/flow.rs` | ✅ 已审查 |
| 事件推送 | `lifecycle/events.rs` | ✅ 已审查 |
| 异常兜底 | `lifecycle/failure.rs` | ✅ 已审查 |
| 并发检查 | `lifecycle/runner.rs` | ✅ 已审查，TODO-3 记录 |
| 持久化读写 | `providers/store.rs` | ✅ 已审查，TODO-4 记录 |
| 密钥解析 | `lifecycle/resolver.rs` | ✅ 已审查，TODO-5 记录 |
| 检查结果处理 | `lifecycle/processor.rs` | ✅ 已审查，TODO-6 记录 |
| 监听注册层 | `services/events/provider/listen.ts` | ✅ 已审查 |
| 事件处理层 | `services/events/provider/handlers/check.ts` | ✅ 已审查，TODO-7 记录 |
| 适配层 | `handlers/adapters/status.ts` | ✅ 已审查，TODO-8 记录 |
| 调度层 | `handlers/schedulers/checkPhaseScheduler.ts` | ✅ 已审查，TODO-10 记录 |
| 分发层 | `handlers/dispatchers/checkPhase.ts` | ✅ 已审查，TODO-9 记录 |
| 校验层 | `handlers/validators/runGuard.ts` | ✅ 已审查 |
| 校验层 | `handlers/validators/activeProviderGuard.ts` | ✅ 已审查 |
| check store | `store/provider/useProviderCheckStore.ts` | ✅ 已审查，TODO-11 记录 |
| collection store | `store/provider/useProviderCollectionStore.ts` | ✅ 已审查 |
| 状态类型 | `types/provider/state/` | ✅ 已审查，TODO-12 记录 |
| 常量层 | `constants/provider/lifecycle/` | ✅ 已审查 |
| 常量层 | `constants/provider/contract/` | ✅ 已审查 |

---

## 前端 · store/provider/useProviderCheckStore.ts

**[TODO-11] `setFailed` 中 `message` 为 undefined 时写入 undefined，与类型声明不符**

- 文件：`apps/ui/src/features/bot/store/provider/useProviderCheckStore.ts`
- 描述：`setFailed(code, message, runId)` 中 `message` 可选，未传时为 `undefined`，直接赋给 `errorMessage` 导致实际写入 `undefined`，与类型声明 `string | null` 不符。应改为 `message ?? null`。
- 优先级：中，潜在类型不一致 bug。

---

## 前端 · types/provider/state/collection.ts

**[TODO-12] `ProviderBatchUpdates.errorMessage` 的 undefined/null 语义区分属于隐性契约**

- 文件：`apps/ui/src/features/bot/types/provider/state/collection.ts`
- 描述：`errorMessage` 字段 `undefined` 表示「不更新」，`null` 表示「清空」，该语义区分仅靠调用方约定，类型层面无法强制，属于隐性契约。后续可考虑显式建模。
- 优先级：低，功能正确，类型语义设计问题。

---

## 前端 · adapters/status.ts

**[TODO-8] `||` 应改为 `??`，避免空字符串被误转为 null**

- 文件：`apps/ui/src/features/bot/services/events/provider/handlers/adapters/status.ts`
- 描述：`health.error || null` 在 `health.error` 为空字符串时会错误地返回 null，语义不准确，应改为 `health.error ?? null`。
- 优先级：中，存在潜在语义错误。

---

## 前端 · dispatchers/checkPhase.ts

**[TODO-9] `dispatchProviderIssue` 分两次 store 更新，与批量更新风格不一致**

- 文件：`apps/ui/src/features/bot/services/events/provider/handlers/dispatchers/checkPhase.ts`
- 描述：`dispatchProviderIssue` 分两次调用 `setProviderCardState` + `setProviderError`，触发两次 store 更新；与 `dispatchProviderBatch` 使用 `updateProviderBatch` 一次性批量更新的风格不一致。
- 建议：统一为一次批量更新调用。
- 优先级：低，功能正确，风格一致性问题。

---

## 前端 · schedulers/checkPhaseScheduler.ts

**[TODO-10] scheduler 单例隐含跨层假设，无自身防护**

- 文件：`apps/ui/src/features/bot/services/events/provider/handlers/schedulers/checkPhaseScheduler.ts`
- 描述：scheduler 是模块级单例，隐含「同一时刻只有一轮检查」的前提，该保证由 `check.ts` 层的 `checkInFlight` 跨层提供，scheduler 本身无防护。与 TODO-7 关联。
- 优先级：低，当前链路正确，依赖关系脆弱。

---

## 前端 · handlers/check.ts

**[TODO-7] handleStarted 重复触发无防护，依赖跨层隐性去重**

- 文件：`apps/ui/src/features/bot/services/events/provider/handlers/check.ts`
- 描述：`handleStarted` 不做 `resolveRunDisposition` 校验，重复触发时第二个 started 会直接覆盖第一轮调度状态。当前安全性依赖 `check.ts` 层的 `checkInFlight` 跨层去重保证，属于隐性依赖。
- 优先级：低，当前链路正确，但依赖关系脆弱。
