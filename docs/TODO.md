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

## 审查进度

| 区域 | 文件 | 状态 |
|------|------|------|
| App 入口 | `App.tsx` | ✅ 已审查 |
| 启动钩子 | `useProviderStartup.ts` | ✅ 已审查，TODO-1 记录 |
| API 触发层 | `check.ts` | ✅ 已审查，TODO-2 记录 |
