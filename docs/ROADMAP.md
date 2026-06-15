# LLM Provider 配置接入路线图

## 架构概览

LLM Provider 接入分为两条主线：

1. **生命周期链路**：启动/手动触发 → 持久化读取 → 并发健康检查 → 事件推送前端
2. **CRUD 链路**：Provider 配置的增删改查（connect / reset / update_models）

两条链路共享 `ProviderError` 错误体系和 `store` 持久化层。

---

## 开发阶段

### ✅ Phase 1-4：生命周期链路 + 前端基础设施

**已完成**：

- 后端错误体系（`ProviderError` / `ProviderErrorCode`）
- 前端状态管理（store / events / hooks）
- 生命周期 phase 建模（idle / checking / done / degraded / failed）
- UI 组件层（per-provider 卡片 + 交互逻辑）

### ✅ Phase 5：CRUD 链路审查与重构

**已完成**：

- connect 链路：主流程审查、健康检查子系统、前端调用链优化、组件完整性验证
- reset 链路：原子性删除、API 迁移、前端钩子重构、组件层美化
- update_models 链路：持久化层重构、日志优化、Hooks 层重构、语义对齐
- 查漏补缺：并发控制、原子写入、回滚逻辑、契约升级

### ✅ Phase 6：错误精细化与全局收尾

#### 6.1 错误精细化（交互式 CRUD）

**已完成**：

- [x] CRUD 链路错误上抛点全部分类（update_models / reset / connect）
- [x] 健康检查业务失败点审查，`HealthCheckResult.error` 升级为 `ProviderError`
- [x] 统一错误响应契约：`ProviderAppError`（code + message），全链 `From<&ProviderError>`
- [x] 扩展 `ProviderErrorCode`：manager / lifecycle / health check / store 四层边界码
- [x] 健康检查错误分类：`HealthCheckMissingConfig` / `HealthCheckNetwork` / `HealthCheckHttp` / `HealthCheckResponseFormat`
- [x] 区分领域错误（`ProviderError` 变体）与边界错误（`ProviderErrorCode` 粗粒化）
- [x] 删除 `ProviderErrorKind` 旧分类系统，清理 `kind()` 方法
- [x] `ProviderIssue` 字段收紧：`code + message` → `error: ProviderAppError`
- [x] `ProviderCheckFailedPayload` 字段收紧：`code + message` → `error: ProviderAppError`
- [x] `Downgrade` trait 优化为引用实现
- [x] 删除死变体：`Serde`、`Io`、`LifecycleEventEmit`、`LifecycleConcurrentCheck`
- [x] lifecycle payload 迁入 `contract/lifecycle/` 统一管理

**待后续**：

- [ ] 迁移 `ProviderError` 至 `thiserror`（修复 `source()` 空实现，错误链可追溯）
- [ ] 契约序列化命名统一 camelCase
- [ ] 单元测试覆盖各命令链路错误场景

#### 6.2 错误精细化（生命周期）

**已完成**：

- [x] 生命周期链路错误上抛点全部审查并分类
- [x] 收紧 provider services 模块可见性
- [x] 4 个 lifecycle 事件变体（`CheckStartedEmit` / `CheckStatusEmit` / `CheckCompletedEmit` / `CheckFailedEmit`）
- [x] `CheckConcurrentFailed` 替换 `LifecycleConcurrentCheck`
- [x] 失败事件降级日志优化（`Downgrade` + `issues_count`）
- [x] `SkippedProviderDetail` 删除，简化 snapshot 为 `Vec<String>`
- [x] `load_provider_check_snapshot` 降级模式（unsupported provider → `downgrade()`）
- [x] `finalize.rs` 删除冗余 `error!` 日志

#### 6.3 前端错误系统

- [ ] 同步前端错误类型（镜像后端 `ProviderErrorCode`）
- [ ] 适配细粒度错误展示（按错误码差异化 UI 反馈）
- [ ] 设计错误展示组件（Toast / inline 错误消息）
- [ ] 评估 provider 级操作串行化需求（connect/reset/update 并发冲突）

#### 6.4 错误系统深入（details / thiserror / trace_id）

- [ ] 实现 `ProviderErrorDetails`（trace_id / operation_id / 嵌套错误源）
- [ ] 评估并迁移 `ProviderError` 至 `thiserror`
- [ ] `ProviderIssue` 并入 `ProviderAppError`（通过 details）
- [ ] 移除 `ProviderError::message()`
- [ ] trace_id 生成与传播（后端 → 前端）

#### 6.5 日志系统

- [ ] 设计日志持久化策略（文件轮转 / 结构化格式）
- [ ] 定义日志埋点（CRUD 入口/出口、健康检查、持久化操作、错误路径）
- [ ] 标准化日志格式（级别 / 时间戳 / 模块 / 消息 / 上下文）
- [ ] 添加结构化上下文（trace_id / operation_id / provider_id / error_code）
- [ ] 实现日志级别策略（info 成功 / warn 可重试 / error 致命）
- [ ] 前端日志策略（dev 用 console / prod 用上报）

#### 6.6 集成测试与验证

- [ ] 5 条命令链路端到端集成测试
- [ ] 错误传播链路验证
- [ ] 错误响应契约验证
- [ ] 日志输出验证（如 Phase 6.5 完成）

#### 6.7 收尾优化

- [ ] 前端状态转换验证（`useProviderCollectionStore` 防御性编程）
- [ ] 表单输入验证（URL 格式检查 / 必填字段提示 / 错误状态视觉反馈）
- [ ] 请求取消机制（AbortController 防止内存泄漏）
- [ ] 安全审计（`secret_meta` 前端消费 / Provider 支持范围收敛 / invoke 暴露面审计）
- [ ] 生命周期收口（orphan failed 认领 / 事件名契约自动化）
- [ ] 前端并发锁架构对齐（`useToggleModels` 迁至 store 层 `isPending`）
- [ ] 后端异步执行架构对齐（同步持久化调用用 `tokio::task::spawn_blocking` 包裹）
- [ ] 后端锁实现升级（`std::sync::Mutex` → `parking_lot::Mutex`）
- [ ] 后端锁粒度细化（全局锁 → per-provider 锁）
- [ ] 功能开发完结
