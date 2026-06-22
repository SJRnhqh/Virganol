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

### ✅ Phase 6：后端错误系统设计与全局收尾

#### 6.1 后端错误系统基础

**已完成**：

- CRUD 与生命周期链路错误上抛点完成分类，健康检查失败统一进入 `ProviderError`
- 建立 `ProviderError` / `ProviderErrorCode` / `ProviderAppError` 分层，区分内部领域错误与边界响应错误
- 统一错误响应契约，收紧 `ProviderIssue` 与 `ProviderCheckFailedPayload` 的错误字段
- 生命周期 payload 迁入 `contract/lifecycle/`，snapshot 与 skipped provider 表达完成收口
- 事件推送失败拆分为明确 lifecycle 变体，并发检查与 unsupported provider 路径完成降级建模
- 清理旧错误分类、死变体和过渡方法，保留 `Downgrade` 作为降级边界
- provider services 模块可见性和冗余错误日志完成清理

#### 6.2 后端错误系统深入（details / source chain / issue aggregation）

- [x] `ProviderError` 迁移至 `thiserror`
- [x] `ProviderErrorDetails` 增加 `recoveryFailure`，承载 reset 恢复失败 → 随后并入 `suppressedErrors`，移除独立字段和构造方法
- [x] 移除 `ProviderError::message()`
- [x] `ProviderError` typed source 覆盖：CRUD / store / secret / health check 的 `String` 变体替换为 typed source + `provider_id` context
- [x] Lifecycle 错误字段 typed context：emit / concurrent 的 `ProviderError` 变体分类建模
- [x] `ProviderIssue` 并入 `ProviderAppError.details`：借 `provider_id` → details 包裹层，生命周期失败事件只暴露 `error` 字段
- [x] Error 详情字段合并：reset 恢复失败并入 `suppressedErrors`，移除 `with_recovery_failure` 构造方法
- [ ] Provider 上下文抽象设计：上下文模型、工程基础规则，为日志系统铺路
- [ ] Command boundary fallback logging 设计：纳入命令层上下文使用规则，使 Tauri command 边界可记录 fallback failure，而不重新解释 core business errors
- [ ] Lifecycle trigger context integration：决定 `ProviderCheckTrigger` 保持独立生命周期值对象，还是并入 Context Propagation 携带的 provider lifecycle context
- [ ] Lifecycle snapshot context integration：决定 `ProviderCheckSnapshot` 保持独立分类配置快照，还是在 Context Propagation 设计后折入 provider lifecycle context model
- [ ] 错误系统架构文档：领域功能适配方案凝练写入 `ARCHITECTURE.md`，覆盖 domain error fields、source chains、boundary code/details projection、issue aggregation 与未来共享抽象

#### 6.3 日志系统

- [ ] Observability kickoff：在 context model 稳定后启动结构化日志上下文复用，保持 trace/correlation 标识属于 observability 而非当前 error details
- [ ] 设计日志上下文模型，并在该阶段决定 trace/correlation/operation 标识是否拆分
- [ ] 设计日志持久化策略（文件轮转 / 结构化格式）
- [ ] 定义日志埋点（CRUD 入口/出口、健康检查、持久化操作、错误路径）
- [ ] 标准化日志格式（级别 / 时间戳 / 模块 / 消息 / 上下文）
- [ ] 添加结构化上下文（correlation/operation 标识、provider_id、error_code）
- [ ] Context-aware downgrade logging：Context Propagation / Observability 设计后重访 `Downgrade`，让降级领域错误记录结构化上下文而不只输出字符串化 warning
- [ ] 实现日志级别策略（info 成功 / warn 可重试 / error 致命）
- [ ] 前端日志策略（dev 用 console / prod 用上报）

#### 6.4 前端错误系统

- [ ] 同步前端错误类型（镜像后端 `ProviderErrorCode`）
- [ ] 适配细粒度错误展示（按错误码差异化 UI 反馈）
- [ ] 设计错误展示组件（Toast / inline 错误消息）
- [ ] 评估 provider 级操作串行化需求（connect/reset/update 并发冲突）

#### 6.5 集成测试与验证

- [ ] 5 条命令链路端到端集成测试
- [ ] 错误传播链路验证（含命令链路错误场景）
- [ ] 错误响应契约验证（含序列化字段命名）
- [ ] 日志输出验证（如 Phase 6.3 完成）

#### 6.6 收尾优化

- [ ] 前端状态转换验证（`useProviderCollectionStore` 防御性编程）
- [ ] 表单输入验证（URL 格式检查 / 必填字段提示 / 错误状态视觉反馈）
- [ ] 请求取消机制（AbortController 防止内存泄漏）
- [ ] 安全审计（`secret_meta` 前端消费 / Provider 支持范围收敛 / invoke 暴露面审计）
- [ ] 生命周期收口（orphan failed 认领 / 事件名契约自动化）
- [ ] 契约序列化命名收口（lifecycle payload camelCase）
- [ ] 前端并发锁架构对齐（`useToggleModels` 迁至 store 层 `isPending`）
- [ ] 后端异步执行架构对齐（同步持久化调用用 `tokio::task::spawn_blocking` 包裹）
- [ ] Provider HTTP client 初始化错误收口（避免 `reqwest::Client` 构建失败通过 `expect` panic，纳入 health-check 错误路径）
- [ ] Provider 持久化边界收口（将 `ProviderKeyTransaction` 隐藏为 store 层实现细节，由组合持久化服务统一处理 config + secret 写入与补偿回滚）
- [ ] 后端锁实现升级（`std::sync::Mutex` → `parking_lot::Mutex`）
- [ ] 后端锁粒度细化（全局锁 → per-provider 锁）
- [ ] 功能开发完结
