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
- [x] `LifecycleConcurrentCheck` — 并发检查阶段异常（含 panic/cancel）
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
- [x] `useProviderCollectionStore` — per-provider 状态（config / status / models）
- [x] `constants/provider/lifecycle/*.ts` — 事件名、阶段、延迟常量统一管理
- [x] `events/provider/handlers.ts` — 4 种事件 handler（含当前 run 事件过滤）
- [x] `hooks/provider/lifecycleScheduler.ts` — 生命周期阶段转换调度
（checking→终态补足、终态→idle 回归）
- [x] `events/provider/runGuard.ts` — run_id 守卫函数复用（避免多处重复定义）
- [x] 双层 run_id 防串扰 — 事件入口过滤 + 调度回调二次校验
- [x] `rid.rs` — run_id 增加 `AtomicU64` 计数器后缀，规避同毫秒重复
- [x] `events/provider/listen.ts` — 串行注册 4 种事件监听，失败回滚已成功监听并返回统一 cleanup
- [x] `hooks/provider/useProviderStartup.ts` — App 启动时注册监听 + 触发 startup check
- [x] `api/provider/check.ts` — `triggerProviderStartupCheck` / `triggerProviderManualRefresh`，共享去重逻辑

#### ✅ 4.2 全局生命周期渲染与交互

- [x] `ProviderHeader` — 基于 `phase` 的动画图标切换
（Cloud / CloudCog / CloudCheck / CloudAlert / CloudOff）
- [x] 手动刷新按钮：checking 阶段禁用，done/idle 可用
- [x] checking 补足延迟（800ms）— 保证图标切换有感知
- [x] done→idle 回归（1200ms）、degraded→idle 回归（2200ms）、failed→idle 回归（3500ms）
- [x] `handleCompleted` 按 `failed > 0` 路由到 degraded 阶段（业务性错误）
- [x] `handleFailed` 保持结构性失败语义（failed 阶段），全局仅保留 `code/message`，`issues` 仅用于 provider
下沉
- [x] `handleProviderStatus` 已按成功/失败双分支收敛，修复失败时模型残留与空模型不更新问题
- [x] 前端渲染语义分层：业务性错误（degraded/CloudAlert）与结构性错误（failed/CloudOff）分离
- [x] 前后端 payload 精简：只推送前端消费的字段，移除冗余统计信息
- [x] 后端 `ProviderCheckStats` 退化为 `failed_count` 计数器
- [x] 后端生命周期步骤重排：started 先于 snapshot 加载，前端尽早进入 checking
- [x] 终态语义收敛：`completed` 承载业务失败（failed_count），`failed` 承载结构性错误（code/message/issues），前后端契约已对齐
- [x] `failure.rs` — 已移除 `issues.clone()`，改为借用传递（`issues.as_deref()` + `Option<&[ProviderIssue]>`），避免不必要的堆分配
- [x] `handleFailed` 已补 `runId === null` 兜底，避免 `started` 丢失时前端误判 `failed` 为 stale
- [x] `degraded` 语义已收敛为全局 phase；业务失败数量改走日志，不再长期占用全局错误文案

#### 🚧 4.3 per-provider 卡片渲染

##### ✅ 4.3.1 ProviderHeader 渲染重构

- [x] 移除布尔标志映射（`isConnected` / `isLoading` / `isError`），直接传递 `cardState`
- [x] 基于 `cardState` 的状态图标渲染：
  - `unset` — 无状态图标
  - `pending` — 旋转的 Loader2（复用 `rotatingIconVariants` 动画）
  - `connected` — 绿色 Check 对勾
  - `failed` — 赭石色 CircleAlert 警告图标
- [x] 极简参数设计：`icon` / `name` / `cardState` / `open`（4 个必需参数，无冗余）

##### ✅ 4.3.2 ProviderBody 渲染重构

- [x] 设计 4 种 `cardState` 的渲染逻辑：
  - `unset` — 显示表单 + Connect 按钮
  - `pending` — 显示 "Connecting..." 提示 + Connecting 按钮（loading 状态）
  - `connected` — 显示模型列表面板 + Reconnect 按钮
  - `failed` — 显示 ProviderButton（Retry 按钮）+ TODO 错误信息展示
- [x] 精简 `ProviderBodyProps` 接口，移除冗余的布尔标志
- [x] 直接基于 `cardState` 做条件渲染分支
- [x] 按需传递表单数据（只有 `unset` 状态需要表单交互）

##### ✅ 4.3.3 钩子逻辑完善

- [x] `useProvider` 钩子适配新的渲染需求
- [x] 确保钩子返回的数据结构与 Body 渲染需求对齐
- [x] 移除 `BaseProvider` 中的布尔标志映射逻辑

##### ✅ 4.3.4 Provider Button 架构重构

- [x] 创建 `BaseProviderButton` 基础组件，统一按钮样式与动画
- [x] 实现 4 种状态按钮：
  - `ConnectButton` — unset 状态，Play 图标 + 跳跃动画
  - `ConnectingButton` — pending 状态，旋转 Loader2 图标
  - `ReconnectButton` — connected 状态，Check + RotateCcw 图标 + 悬停旋转
  - `RetryButton` — failed 状态，RotateCcw 图标 + 悬停旋转
- [x] 创建 `ProviderButton` 统一入口，基于 `cardState` 自动切换
- [x] 动画系统优化：
  - 移除 Framer Motion 中的颜色定义（避免与 Tailwind 冲突）
  - 移除 hover scale 动画（避免"扭动"效果）
  - 新增 `retryIconVariants` 图标旋转动画
- [x] 目录结构优化：connection 相关按钮统一到 `buttons/provider/connection/` 子目录
- [x] 导出管理：只导出 `ProviderButton`，内部实现细节封装

##### 🚧 4.3.5 ProviderBody 表单架构重构

- [ ] 表单组件解耦：将 `ProviderBody` 中的表单逻辑提取为独立组件
- [ ] 基于 `cardState` 的表单渲染优化：
  - `unset` — 显示完整表单 + Connect 按钮
  - `pending` / `connected` / `failed` — 隐藏表单，只显示状态相关内容
- [ ] 表单状态管理优化：精简 props 传递，避免冗余数据流
- [ ] 错误信息展示设计：failed 状态下的错误信息渲染方案（目前为 TODO）
- [ ] 表单验证与交互优化：统一表单字段验证逻辑

### Phase 5：健康检查错误精细化

- [ ] 将各 provider connection 内部的网络/认证/超时等错误纳入 `ProviderError` 体系
- [ ] reqwest 超时配置、网络不可达与业务"不在线"的区分
- [ ] 前端适配健康检查细粒度错误展示

### Phase 6：收尾与补充测试

- [ ] 根据前端适配过程中暴露的问题补充后端处理
- [ ] 补齐 `secret_meta` 前端消费闭环：展示 `has_key` / `key_source`，并为 `last4` 等脱敏元信息预留接入位
- [ ] 补齐前端安全闭环：`connect` 成功后清空内存态 `apiKey`，避免明文密钥在前端长期驻留
- [ ] 补齐 `reset` 一致性：仅在 `reset_provider=true` 时清理本地状态，失败时保留现状并提示
- [ ] 收敛前后端 Provider 支持范围：当前阶段统一到 `deepseek` / `ollama`，避免 `ProviderId` 与注册表漂移
- [ ] 审计 invoke / event 暴露面，并增加前端约束，防止 Provider 直连 `fetch/axios`
- [ ] 补充 `update_models` / `reset` / `retry` 异常一致性回归，覆盖快速切换、持久化失败与重复点击场景
- [ ] 视需要补充集成测试
- [ ] `SkippedProviderDetail` 补 `::new()` 构造函数，与 `ProviderIssue` 风格统一
- [ ] `resolver.rs` — 密钥解析合并为单次，同时返回 key + meta，消除重复 I/O
- [ ] `handleProviderStatus` — 收敛多次零散 `set` 为单次批量更新，减少不必要的状态引用变更与重渲染
- [ ] 前端 `errorCode` 收敛为共享联合类型（`ProviderErrorCode`），替代宽泛 `string`，支持消费侧穷举匹配
- [ ] `store.rs` — 全量读-改-写优化：评估按 provider 独立 key 存储或脏标记机制，降低 I/O 开销
- [ ] 事件名前后端契约自动化：Rust 侧事件名抽为常量模块，或引入 codegen 消除人工对齐风险
- [ ] `ProviderError` — 补 `source()` 错误链实现或引入 `thiserror`，提升调试时错误溯源能力
- [ ] `reconcile_enabled_models` — 无变更路径避免 `record.clone()`，改用 owned 传递或 `Cow` 减少堆分配
- [ ] `useProviderStartup` — 启动失败时写入 `checkStore.setFailed()`，避免监听注册全部失败后 UI 无感知
- [ ] `PROVIDERS_STORE_LOCK` — 评估迁移至 Tauri `State<Mutex<T>>` 管理模式，为多窗口场景预留空间
- [ ] 生命周期功能开发完结

---

## 备注

- [ ] CRUD 链路的错误统一（含 `secrets.rs` keyring 交互）不在本路线图范围内，后续单独规划
- [ ] 各 Phase 之间非严格串行，前端适配过程中可能回头调整后端细节
