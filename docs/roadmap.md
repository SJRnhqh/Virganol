# Provider 生命周期开发路线图

## 后端架构概览

LLM Provider 后端分为两条主线：

1. **生命周期链路**：启动/手动触发 → 持久化读取 → 并发健康检查 → 事件推送前端
2. **CRUD 链路**：Provider 配置的增删改查（connect / reset / update_models）

两条链路共享 `ProviderError` 错误体系和 `store` 持久化层。

---

## 开发阶段

### ✅ Phase 1：生命周期错误类型统一

将生命周期各环节的错误收敛到 `ProviderError` 枚举，每个 variant 对应明确的错误语义：

- [x] `Io` / `Serde` — 持久化读写
- [x] `UnsupportedProvider` — 未注册的 provider
- [x] `LifecycleEventEmit` — 事件推送失败
- [x] `LifecycleTaskJoin` — 并发任务异常（panic/cancel）
- [x] `LifecyclePartialFailure` — 生命周期终态汇总

### ✅ Phase 2：错误 code 与 message 统一管理

- [x] 将 `code()` 返回值从方法内 match 提升为独立 `ProviderErrorCode` 枚举，全链路类型安全
- [x] 简化消费侧调用模式（`report_lifecycle_failure` 直接接收 `&ProviderError`）
- [x] 统一 message 格式规范（去除类型前缀，message 只保留纯描述，与 code 职责分离）

### ✅ Phase 3：生命周期单元测试

- [x] `ProviderErrorCode::as_str` / `Display` — 每个 variant 的字符串映射与序列化一致性

### 🚧 Phase 4：前端生命周期适配

#### ✅ 4.1 前端状态管理框架

- [x] `useProviderCheckStore` — 生命周期全局状态（idle / checking / done / degraded / failed）
- [x] `useProviderStore` — per-provider 状态（config / status / models）
- [x] `constants/events.ts` — 事件名统一管理（`PROVIDER_CHECK_EVENTS`）+ 阶段转换延迟（`PROVIDER_CHECK_DELAYS`）
- [x] `hooks/provider/handlers.ts` — 4 种事件 handler（含当前 run 事件过滤）
- [x] `hooks/provider/lifecycleScheduler.ts` — 生命周期阶段转换调度
（checking→终态补足、终态→idle 回归）
- [x] `hooks/provider/runGuard.ts` — run_id 守卫函数复用（避免多处重复定义）
- [x] 双层 run_id 防串扰 — 事件入口过滤 + 调度回调二次校验
- [x] `rid.rs` — run_id 增加 `AtomicU64` 计数器后缀，规避同毫秒重复
- [x] `hooks/provider/listen.ts` — 注册 4 种事件监听，返回统一 cleanup
- [x] `hooks/provider/useProviderStartup.ts` — App 启动时注册监听 + 触发 startup check
- [x] `api/provider/check.ts` — `triggerProviderStartupCheck` / `triggerProviderManualRefresh`，共享去重逻辑

#### ✅ 4.2 全局生命周期渲染与交互

- [x] `ProviderHeader` — 基于 `phase` 的动画图标切换
（Cloud / CloudCog / CloudCheck / CloudAlert / CloudOff）
- [x] 手动刷新按钮：checking 阶段禁用，done/idle 可用
- [x] checking 补足延迟（800ms）— 保证图标切换有感知
- [x] done→idle 回归（1200ms）、degraded→idle 回归（2200ms）、failed→idle 回归（3500ms）
- [x] `handleCompleted` 按 `failed > 0` 路由到 degraded 阶段（业务性错误）
- [x] `handleFailed` 保持结构性失败语义（failed 阶段）并透传后端 code/message/issues
- [x] 前端渲染语义分层：业务性错误（degraded/CloudAlert）与结构性错误（failed/CloudOff）分离
- [x] 前后端 payload 精简：只推送前端消费的字段，移除冗余统计信息
- [x] 后端 `ProviderCheckStats` 退化为 `failed_count` 计数器
- [x] 后端生命周期步骤重排：started 先于 snapshot 加载，前端尽早进入 checking
- [x] 终态语义收敛：`completed` 承载业务失败（failed_count），`failed` 承载结构性错误（code/message/issues），前后端契约已对齐
- [ ] `failure.rs` — `issues.clone()` 改为 move 语义，避免不必要的堆分配

#### 🚧 4.3 per-provider 卡片渲染

- [ ] per-provider 卡片：基于 `isConnected` / `isError` / `isLoading` 的状态渲染
- [ ] per-provider 的 `errorMessage` 展示（来自 `handleProviderStatus` 或 `issues` 下沉）
- [ ] 基于 `errorCode` 区分全局生命周期错误类型（io / unsupported / partial_failure 等）

### Phase 5：健康检查错误精细化

- [ ] 将各 provider connection 内部的网络/认证/超时等错误纳入 `ProviderError` 体系
- [ ] reqwest 超时配置、网络不可达与业务"不在线"的区分
- [ ] 前端适配健康检查细粒度错误展示

### Phase 6：收尾与补充测试

- [ ] 根据前端适配过程中暴露的问题补充后端处理
- [ ] 视需要补充集成测试
- [ ] `SkippedProviderDetail` 补 `::new()` 构造函数，与 `ProviderIssue` 风格统一
- [ ] `resolver.rs` — 密钥解析合并为单次，同时返回 key + meta，消除重复 I/O
- [ ] 生命周期功能开发完结

---

## 备注

- [ ] CRUD 链路的错误统一（含 `secrets.rs` keyring 交互）不在本路线图范围内，后续单独规划
- [ ] 各 Phase 之间非严格串行，前端适配过程中可能回头调整后端细节
