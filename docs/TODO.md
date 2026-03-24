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
