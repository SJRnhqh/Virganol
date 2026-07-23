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

### 🚧 Phase 6：可靠性架构与全局收尾

#### 6.1 后端错误系统基础

**已完成**：

- `ProviderError` / `ProviderErrorCode` / `ProviderAppError` 分层与边界契约成型
- CRUD、健康检查、生命周期事件与并发检查错误路径完成分类
- lifecycle payload、snapshot 与 skipped provider 契约完成收口
- 旧错误分类、过渡 API、服务可见性与冗余日志完成清理

#### 6.2 Provider 可靠性架构（context / failure / error / boundary）

**当前状态**：Provider 上下文传播、内部错误与应用边界投影已经闭环；Settings 过程适配与架构文档转入后续路线。

**已完成**：

- [x] `ProviderContext<T>`、阶段视图与执行上下文贯通 manager、lifecycle、connection、config store 与 secret store
- [x] `ProviderSubject` 区分具体供应商、原始候选与已配置供应商集合，错误细节仅投影准确的 `providerId`
- [x] `ProviderFailure` 管理封闭失败事实与底层错误源，`ProviderError` 作为上下文加失败事实的薄层归因契约
- [x] `ProviderAppError` 从成功响应中拆出，并以 `code`、安全 `message`、`scope`、可选主体与 `suppressedErrors` 完成边界投影
- [x] 生命周期 emit、join、aggregate 与降级路径接入统一错误归因和边界适配

**后续路线**：

- [ ] Settings 错误架构：以业务过程为边界渐进引入失败事实、错误上下文与内部错误，不提前抽取跨实在泛型契约
- [ ] RDD 可靠性架构文档：在 Provider 参考实现与 Settings 过程适配后，沉淀上下文传播、错误投影、source chain、聚合错误与责任边界

#### 6.3 日志系统

- [ ] 上下文日志接力：复用 Provider context 字段，trace/correlation 策略留到日志系统设计
- [ ] ProviderCheckSnapshot 归入 Span attribute：生命周期日志 Span 携带快照分类结果（supported/skipped/total），不折入上下文字段
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
- [ ] Core 规范化：继续人工校验剩余 Core 的 item docs、实现顺序与可见范围
- [x] Rust 注释规范实验基础：完成 NAPI addon 构建脚本、配置驱动的默认测试接入、共享适配器环境与 CLI/NAPI release 基线 benchmark
- [ ] Rust 注释规范实验：验证跨平台构建，统一共享语料、工作负载、结果语义与正确性前置校验
- [ ] Outer Doc Comments：扩展 fixtures 与 `syn` 结构识别，并将选定适配器接入规则测试、仓库检查和源码审计
- [ ] 适配器选型：完成 CLI/NAPI 正确性对齐与代表性 benchmark，以性能和维护成本确定生产方案
- [ ] Comments 规则收口：完成 Outer、Inner 与 Explanatory Comments 的源码审计和文档定稿
- [ ] Visibility 规则升级：覆盖模块项、关联项与 re-export 链，补齐 `syn` 结构检查、测试和文档定稿
- [ ] 后端锁实现升级（`std::sync::Mutex` → `parking_lot::Mutex`）
- [ ] 后端锁粒度细化（全局锁 → per-provider 锁）
- [ ] 功能开发完结
