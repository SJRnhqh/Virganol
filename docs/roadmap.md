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

- [x] `ProviderCheckStats::record` — 全部成功、全部失败、混合场景的计数正确性
- [x] `ProviderErrorCode::as_str` / `Display` — 每个 variant 的字符串映射与序列化一致性

### 🚧 Phase 4：前端生命周期适配

#### ✅ 4.1 前端状态管理框架

- [x] `useProviderCheckStore` — 生命周期全局状态（idle / checking / done / failed）
- [x] `useProviderStore` — per-provider 状态（config / status / models）
- [x] `constants/events.ts` — 事件名统一管理（`PROVIDER_CHECK_EVENTS`）
- [x] `hooks/provider/handlers.ts` — 4 种事件 handler，纯逻辑，不依赖 Tauri
- [x] `hooks/provider/listen.ts` — 注册 4 种事件监听，返回统一 cleanup
- [x] `hooks/provider/useProviderStartup.ts` — App 启动时注册监听 + 触发 startup check
- [x] `api/provider/check.ts` — `triggerProviderStartupCheck` / `triggerProviderManualRefresh`，共享去重逻辑

#### 🚧 4.2 Settings 面板渲染与交互

- [ ] 全局检查状态展示（checking 时的 loading 指示、done/failed 的结果反馈）
- [ ] per-provider 卡片：基于 `isConnected` / `isError` / `isLoading` 的状态渲染
- [ ] 手动刷新按钮：调用 `triggerProviderManualRefresh`

#### 🚧 4.3 差异化错误展示

- [ ] 基于 `errorCode` 区分全局生命周期错误类型（io / unsupported / partial_failure 等）
- [ ] per-provider 的 `errorMessage` 展示（来自 `issues` 下沉）

### Phase 5：健康检查错误精细化

- [ ] 将各 provider connection 内部的网络/认证/超时等错误纳入 `ProviderError` 体系
- [ ] reqwest 超时配置、网络不可达与业务"不在线"的区分
- [ ] 前端适配健康检查细粒度错误展示

### Phase 6：收尾与补充测试

- [ ] 根据前端适配过程中暴露的问题补充后端处理
- [ ] 视需要补充集成测试
- [ ] `failure.rs` — `issues.clone()` 改为 move 语义，避免不必要的堆分配
- [ ] `SkippedProviderDetail` 补 `::new()` 构造函数，与 `ProviderIssue` 风格统一
- [ ] `resolver.rs` — 密钥解析合并为单次，同时返回 key + meta，消除重复 I/O
- [ ] `rid.rs` — run_id 可选加 `AtomicU64` 计数器，防止同毫秒重复
- [ ] 生命周期功能开发完结

---

## 备注

- [ ] CRUD 链路的错误统一（含 `secrets.rs` keyring 交互）不在本路线图范围内，后续单独规划
- [ ] 各 Phase 之间非严格串行，前端适配过程中可能回头调整后端细节
