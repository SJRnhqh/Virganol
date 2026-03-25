# TODO — feat/spirit-lifecycle-check

当前分支：Provider 生命周期链路审查与细节修缮。

---

## 前端 · useProviderStartup

**[TODO-1] bootstrap 错误来源无法区分**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderStartup.ts`
- 描述：`bootstrap().catch` 统一用 `startup_bootstrap_failed`，无法区分是 `registerCheckListeners` 失败还是 `triggerProviderStartupCheck` 失败。
- 建议：拆分 try/catch，分别捕获并上报不同错误码，便于排查。

---

**[TODO-13] bootstrap 失败后监听器未主动拆除**

- 文件：`apps/ui/src/features/bot/hooks/provider/useProviderStartup.ts`
- 描述：`triggerProviderStartupCheck` 失败时，`cleanup` 已赋值（4 个监听器已注册成功），但 `.catch` 分支未调用 `cleanup()`，监听器持续活跃直到组件卸载。store 已处于 failed 状态，但后端若此时推来残留事件，handlers 仍会处理并可能覆盖 failed 状态，导致状态机出现非预期回退。
- 需确认语义：bootstrap 失败后是否应立即拆除监听器，还是保留以等待后端自行恢复？
- 优先级：低，当前场景概率低，但语义未收口。

---

## 前端 · check.ts

**[TODO-2] manual refresh 在 startup 期间的静默丢弃行为**

- 文件：`apps/ui/src/features/bot/services/api/provider/check.ts`
- 描述：`startup` 与 `manual` 共享同一 in-flight 锁。startup 进行中触发 manual refresh，会静默复用 startup 的 promise，调用方无从感知自己的请求是否被真正执行。
- 需确认语义：manual refresh 是「确保一次新检查」还是「只要检查在跑就算」。
- 补充①：`checkInFlight` 是模块级单例，隐含「`useProviderStartup` 只在 App 顶层调用一次」的前提，与 TODO-7/TODO-10 同属跨层隐性契约，建议补注释说明。
- 补充②：组件卸载时 in-flight 的 `invoke` 不会被取消（后端检查仍会执行），事件推回来时监听器已不存在，属于有意设计，建议补注释说明这是预期行为。

---

## 后端 · store.rs

**[TODO-4] 写操作内部使用软读，store 损坏时静默覆盖丢失**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/store.rs`
- 描述：`save_provider` / `remove_provider` / `update_models` 内部调用 `load_all_providers`（软读，失败时静默返回空 HashMap），store 文件损坏时会用空 Map 覆盖写回，导致其他 provider 配置静默丢失。
- 建议：改用 `load_all_providers_strict`，读取失败时上抛错误。
- 优先级：中，数据安全问题。

**[TODO-19] `PROVIDERS_STORE_LOCK` 静态 Mutex 待评估迁移，缺少追踪编号**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/store.rs`
- 描述：`PROVIDERS_STORE_LOCK` 以模块级 `static Mutex<()>` 管理写操作互斥，ROADMAP Phase 6.2 已提「评估迁移至 Tauri `State<Mutex<T>>` 管理模式」，但原文无 TODO 编号，无法追踪进度，此处补编号。
- 优先级：低，现有实现功能正确，属架构演进方向。

---

## 后端 · resolver.rs

**[TODO-5] keyring 密钥每个 provider 被读取两次**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/resolver.rs`
- 描述：`health_check_with_resolved_key` 与 `resolve_provider_secret_meta` 各自独立读取密钥，keyring 属于系统调用，每个 provider 会被调用两次。
- 建议：合并为一次解析，将 key 与 key_source 一并返回复用。
- 优先级：低，性能小优化。

**[TODO-18] 无密钥时静默传入空字符串，设计意图未注释**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/resolver.rs`
- 描述：`health_check_with_resolved_key` 在 env 和 keyring 均无密钥时，以空字符串 `""` 调用 `health::health_check`。对于 ollama 等无需密钥的 provider 这是正确行为，但代码无注释说明，在安全敏感区域容易被误读为遗漏了错误处理。
- 建议：补一行注释说明「无密钥时传空字符串，由 health_check 内部处理无需 key 的 provider」。
- 优先级：低，功能正确，可读性问题。

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

## 后端 · flow.rs

**[TODO-14] `duration_ms` 仅打日志未入 completed payload**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/flow.rs`
- 描述：`started_at.elapsed()` 计算出检查耗时后只用于 `info!` 日志，未写入 `emit_check_completed` 的 payload，前端无法获取本轮检查耗时。若后续需要展示检查耗时则需同步修改 payload 结构与前端类型。
- 需确认：耗时是否属于前端需要的信息，还是纯后端监控用途？
- 优先级：低，功能正确，设计意图未注释。

---

**[TODO-15] Step 5 `join_error` 与 `provider_issues` 合并时优先级未注释**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/flow.rs`
- 描述：`join_error.or_else(|| (!provider_issues.is_empty()).then(...))` 在 `join_error` 存在时短路，`provider_issues` 被传入 `report_lifecycle_failure` 但合并错误 message 来自 `join_error`；仅 issues 非空时才构造合成错误。优先级合理但属隐性设计，建议补注释说明两路错误的优先级关系，与已有 inline TODO 对应。
- 优先级：低，逻辑正确，可读性问题。

---

## 后端 · runner.rs

**[TODO-16] `join_error` 发生后继续消费剩余任务，设计意图未注释**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/runner.rs`
- 描述：并发任务 panic（`join_error`）发生后，循环不提前退出，继续 `join_next()` 消费所有 in-flight 任务并推送 `provider_status`。这保证了所有 provider 状态都能推出去，是有意设计，但代码中无注释说明，读代码时容易误判为遗漏了早退路径。
- 建议：补一行注释说明「join_error 后不早退，确保其余 provider 状态仍可推送」。
- 优先级：低，不影响正确性，可读性问题。

---

## 后端 · deepseek.rs / ollama.rs

**[TODO-20] 健康检查每次创建新 `reqwest::Client`，无连接复用**

- 文件：`apps/desktop/src-tauri/src/core/providers/connections/deepseek.rs` / `ollama.rs`
- 描述：`deepseek_check` 与 `ollama_check` 每次调用均执行 `reqwest::Client::new()`，不复用连接池。在 runner 并发检查多个 provider 时，会建立多条独立 TCP 连接，增加延迟与系统开销。
- 建议：将 `reqwest::Client` 提升为模块级 `OnceLock<Client>` 或通过 Tauri `State` 注入共享实例。
- 优先级：低，当前 provider 数量少影响有限，规模扩展后明显。

---

## 后端 · error/skip.rs

**[TODO-21] `SkippedProviderDetail` 缺少 `::new()` 构造函数**

- 文件：`apps/desktop/src-tauri/src/core/models/provider/error/skip.rs`
- 描述：`SkippedProviderDetail` 直接用字段初始化构造，而 `ProviderIssue` 已有 `::new()` 风格，两者不统一。ROADMAP Phase 6.2 已提此项，此处补编号便于追踪。
- 优先级：低，风格一致性问题。

---

## 后端 · error/base.rs

**[TODO-22] `ProviderError` 无 `source()` 错误链**

- 文件：`apps/desktop/src-tauri/src/core/models/provider/error/base.rs`
- 描述：`ProviderError` 实现了 `std::error::Error` 但未覆写 `source()`，`Serde` variant 包裹的原始错误无法通过错误链追溯。ROADMAP Phase 5.2 已提「补 `source()` 或引入 `thiserror`」，此处补编号。
- 优先级：低，影响错误溯源能力，不影响功能正确性。

---

## 后端 · service.rs

**[TODO-23] `connect_and_save` 内联密钥回退逻辑，与 `resolver.rs` 重复**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/service.rs`
- 描述：`connect_and_save` 内部实现了 `env → keyring` 密钥回退优先级，与 `resolver.rs` 中 `health_check_with_resolved_key` 各自独立维护同一套规则。若优先级逻辑需要调整，须同步修改两处，存在遗漏风险。
- 建议：将密钥解析逻辑统一收口到 `resolver.rs` 或新建 `secrets` 层统一管理，`service.rs` 调用即可。
- 优先级：中，可维护性问题，与 TODO-5 关联。

---

## 后端 · events.rs

**[TODO-17] 事件名字符串硬编码，缺少常量模块**

- 文件：`apps/desktop/src-tauri/src/core/settings/bot/providers/lifecycle/events.rs`
- 描述：`providers-check-lifecycle-started` / `provider-status` / `providers-check-lifecycle-completed` / `providers-check-lifecycle-failed` 四个事件名以字符串字面量散落在函数体中，前端 `PROVIDER_CHECK_EVENTS` 常量与之对应但无自动化契约校验。ROADMAP Phase 6.3 已提「Rust 侧事件名抽为常量模块」，此处补编号便于追踪。
- 建议：在 `lifecycle/` 下新建 `event_names.rs` 或 `constants.rs`，统一管理事件名常量，消除前后端契约的手动对齐负担。
- 优先级：中，可维护性问题，前后端事件名不一致时难以排查。

---

| 区域 | 文件 | 状态 |
| ------ | ------ | ------ |
| App 入口 | `App.tsx` | ✅ 已审查 |
| 启动钩子 | `useProviderStartup.ts` | ✅ 已审查，TODO-1 / TODO-13 记录 |
| API 触发层 | `check.ts` | ✅ 已审查，TODO-2 记录 |
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
