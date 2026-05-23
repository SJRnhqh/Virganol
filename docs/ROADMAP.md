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

### 🚧 Phase 6：错误精细化与全局收尾

#### 6.1 错误精细化（交互式 CRUD）

按命令链路逐个审查：update_models → reset → connect

- [ ] 完成 CRUD 错误上抛点梳理后，统一推进错误响应泛型化升级
- [ ] 审查 connect 健康检查业务错误上抛点
- [ ] 扩展 `ProviderErrorCode`（健康检查错误：网络不可达 / 认证失败 / 超时 / 响应格式错误）
- [ ] 迁移 `ProviderError` 至 `thiserror`（修复 `source()` 空实现，错误链可追溯）
- [ ] 扩展 `HealthCheckResult` 添加 `error_code` 字段
- [ ] 区分系统错误（io/serde/keyring）与业务错误（network/auth/timeout/format）
- [ ] 统一错误响应契约（code / message / details / trace_id）
- [ ] 契约序列化命名统一 camelCase（`HealthCheckResult` / `ProviderRecord` / `ProviderStatusPayload`）
- [ ] 单元测试覆盖各命令链路错误场景

#### 6.2 错误精细化（生命周期）

审查 startup_check 和 manual_refresh 链路

- [ ] 复查现有错误处理完整性
- [ ] 补充边界场景单元测试

#### 6.3 前端错误系统

- [ ] 同步前端错误类型（镜像后端 `ProviderErrorCode`）
- [ ] 适配细粒度错误展示（按错误码差异化 UI 反馈）
- [ ] 设计错误展示组件（Toast / inline 错误消息）
- [ ] 评估 provider 级操作串行化需求（connect/reset/update 并发冲突）

#### 6.4 日志系统（错误精细化完成后）

- [ ] 设计日志持久化策略（文件轮转 / 结构化格式）
- [ ] 定义日志埋点（CRUD 入口/出口、健康检查、持久化操作、错误路径）
- [ ] 标准化日志格式（级别 / 时间戳 / 模块 / 消息 / 上下文）
- [ ] 添加结构化上下文（trace_id / operation_id / provider_id / error_code）
- [ ] 实现日志级别策略（info 成功 / warn 可重试 / error 致命）
- [ ] 前端日志策略（dev 用 console / prod 用上报）
- [ ] trace_id 生成与传播（后端 → 前端）

#### 6.5 集成测试与验证

- [ ] 5 条命令链路端到端集成测试
- [ ] 错误传播链路验证
- [ ] 错误响应契约验证
- [ ] 日志输出验证（如 Phase 6.4 完成）

#### 6.6 收尾优化

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
