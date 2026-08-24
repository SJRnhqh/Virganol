# Virganol 0.0.1 开发路线图

## 版本主线

0.0.1 的 LLM Provider 配置接入分为两条主线：

1. **生命周期链路**：启动/手动触发 → 持久化读取 → 并发健康检查 → 事件推送前端
2. **CRUD 链路**：Provider 配置的增删改查（connect / reset / update_models）

两条链路共享 `ProviderError` 错误体系和 `store` 持久化层。

---

## 开发阶段

### ✅ Phase 1-4：生命周期链路 + 前端基础设施

**已完成**：

- 后端错误体系与生命周期 phase 建模
- 前端状态、事件、hooks 与供应商卡片交互

### ✅ Phase 5：CRUD 链路审查与重构

**已完成**：

- connect/reset/update_models 主链路、前端调用与组件交互完成审查
- 持久化、并发、回滚与边界契约完成阶段性审查，既有冗余日志完成清理

### 🚧 Phase 6：可靠性架构与全局收尾

#### 6.1 RDD 可靠性架构

**当前状态**：Provider 与 Settings 已形成 Contextualization 和 Attributability 的参考实现；Observability 留待日志与追踪实现后继续收敛。

**已完成**：

- [x] Provider 以 Reality Context、Failure 与 Reality Error 统一业务错误，并完成安全的应用边界投影
- [x] Settings 以 Stage、Attribution Snapshot、Failure 与 Reality Error 完成过程错误建模及跨实在 Source 交接
- [x] 生命周期与边界契约成型，旧错误 API、服务可见性和冗余日志完成清理
- [x] 架构文档完成 RDD、Contextualization 与 Attributability 的初始沉淀

**后续路线**：

- [ ] 基于日志与追踪的实际实现继续沉淀 Observability

#### 6.2 日志系统

- [ ] 设计结构化日志上下文：从 Reality Context 与 Attribution Snapshot 投影 scope、attribution、correlation 和 error_code，并厘清 trace/correlation/operation 边界
- [ ] ProviderCheckSnapshot 归入 Span attribute：生命周期日志 Span 携带快照分类结果（supported/skipped/total），不折入上下文字段
- [ ] 设计日志持久化策略（文件轮转 / 结构化格式）
- [ ] 定义日志埋点（CRUD 入口/出口、健康检查、持久化操作、错误路径）
- [ ] 标准化日志格式（级别 / 时间戳 / 模块 / 消息 / 上下文）
- [ ] Context-aware downgrade logging：Contextualization / Observability 实现后重访 `Downgrade`，让降级领域错误记录结构化上下文而不只输出字符串化 warning
- [ ] 实现日志级别策略（info 成功 / warn 可重试 / error 致命）
- [ ] 前端日志策略（dev 用 console / prod 用上报）

#### 6.3 前端错误系统

- [ ] 同步前端错误类型（镜像后端 `ProviderErrorCode`）
- [ ] 适配细粒度错误展示（按错误码差异化 UI 反馈）
- [ ] 设计错误展示组件（Toast / inline 错误消息）
- [ ] 评估 provider 级操作串行化需求（connect/reset/update 并发冲突）

#### 6.4 集成测试与验证

- [ ] 5 条命令链路端到端集成测试
- [ ] 错误传播链路验证（含命令链路错误场景）
- [ ] 错误响应契约验证（含序列化字段命名）
- [ ] 日志输出验证（如 Phase 6.2 完成）

#### 6.5 收尾优化

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

#### 6.6 测试覆盖与质量门禁

- [ ] 补齐 0.0.1 单元测试与缺口覆盖
- [ ] 结合测试体系评估 `pnpm test` 与 `pnpm verify` 的职责和入口
- [ ] Core 规范化：继续人工校验剩余 Core 的 item docs、实现顺序与可见范围
- [x] Rust Comments 质量门禁与工程实验基线：完成规则实现、CLI/NAPI 正确性对齐、配置注入、仓库 audit 与 benchmark 基础设施
- [ ] Rust Comments 工程实验收尾：补齐代表性 benchmark 与跨平台验证
- [ ] Comments 规则扩展：完成 Inner Doc 与 Explanatory Comments 的源码审计、规则实现和文档定稿
- [x] Re-export visibility contract 基线：完成配置、链路校验与测试入口
- [ ] Visibility 质量门禁扩展：在现有 re-export contract 基础上覆盖模块项与关联项，并补齐结构检查、测试、仓库 audit 和文档
