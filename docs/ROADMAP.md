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

- 后端错误体系与生命周期 phase 建模
- 前端状态、事件、hooks 与供应商卡片交互

### ✅ Phase 5：CRUD 链路审查与重构

**已完成**：

- connect/reset/update_models 主链路、前端调用与组件交互完成审查
- 持久化、并发、回滚、契约与日志细节完成收口

### ✅ Phase 6：后端错误系统设计与全局收尾

#### 6.1 后端错误系统基础

**已完成**：

- `ProviderError` / `ProviderErrorCode` / `ProviderAppError` 分层与边界契约成型
- CRUD、健康检查、生命周期事件与并发检查错误路径完成分类
- lifecycle payload、snapshot 与 skipped provider 契约完成收口
- 旧错误分类、过渡 API、服务可见性与冗余日志完成清理

#### 6.2 后端错误系统深入（details / source chain / issue aggregation / context propagation）

**当前状态**：交互式 settings 链路已闭合；生命周期归因、集合主体语义与架构文档转入后续路线。

**已完成**：

- [x] `ProviderError` 迁入 `thiserror`，typed source、source chain 与边界 details 投影完成主体升级
- [x] `ProviderIssue` 并入 `ProviderAppError.details`，reset 恢复失败并入 `suppressedErrors`
- [x] `ProviderContext<T>` / `ProviderStage` / execution contexts 落地，承载阶段、操作、生命周期触发/运行信息与主体归因
- [x] Settings common 保持 Provider-agnostic，Provider store 负责上下文与领域错误适配
- [x] connect/reset/update 以 staged context 串联 manager、connection、config store、secret store，并完成错误投影闭环

**后续路线**：

- [ ] 生命周期错误归因收尾：将 status emit、join、aggregate 错误升级为生命周期上下文归因与边界投影
- [ ] 供应商集合主体归因：保留 `load_provider_check_snapshot` 中 `ProviderId::try_from(raw_id)` 的降级分类逻辑；待 `ProviderSubject` / `ProviderErrorContext` 支持完整主体语义后，统一原始供应商 ID、已配置供应商集合与快照分类错误的归因规则
- [ ] 错误归因模型升级：以 typed subject 区分单供应商、生命周期运行、供应商集合与子系统级失败，并保持边界 details 稳定
- [ ] 生命周期快照上下文收口：在集合主体归因定型后，决定 `ProviderCheckSnapshot` 保持独立分类配置快照，还是折入供应商生命周期上下文模型
- [ ] 生命周期并发模型复核：在上下文归因稳定后，评估 `JoinSet` / `FuturesUnordered` 对所有权、取消、panic 隔离与错误归因的影响
- [ ] 核心 fallback 日志规则：基于已携带上下文记录 fallback failure，命令边界不重新解释 core business errors
- [ ] 可靠性架构文档：将上下文字段、传播边界、Provider/Settings 责任边界、错误投影、source chain 与 issue aggregation 写入 `ARCHITECTURE.md`

#### 6.3 日志系统

- [ ] 上下文日志接力：复用 Provider context 字段，trace/correlation 策略留到日志系统设计
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
- [ ] Rust 可见性纪律检查（可选 MJS lint，约束函数、结构体、impl 方法与 re-export 暴露范围）
- [ ] 后端锁实现升级（`std::sync::Mutex` → `parking_lot::Mutex`）
- [ ] 后端锁粒度细化（全局锁 → per-provider 锁）
- [ ] 功能开发完结
