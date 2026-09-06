# Virganol 0.0.1 开发路线图

## 版本主线

0.0.1 的 LLM Provider 配置接入分为三条主线：

1. **生命周期链路**：启动/手动触发 → 持久化读取 → 并发健康检查 → 事件推送前端
2. **CRUD 链路**：Provider 配置的增删改查（connect / reset / update_models）
3. **可靠性与可观测性**：RDD 错误体系、结构化日志门面、日志后端与执行追踪

三条主线共享 `ProviderError` 错误体系和 `store` 持久化层。

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

**已完成**：

- `ProviderError` / `ProviderErrorCode` / `ProviderAppError` 分层与边界契约成型
- CRUD、健康检查、生命周期事件与并发检查错误路径完成分类
- lifecycle payload、snapshot 与 skipped provider 契约完成收口
- 旧错误分类、过渡 API、服务可见性与冗余日志完成清理

#### 6.2 Provider 可靠性架构与可观测性（context / failure / error / boundary / logging / tracing）

**当前状态**：Provider 与 Settings 的上下文传播、内部错误、边界投影和结构化日志门面已经闭环；Provider manager 与 lifecycle span、`run_id`、`trigger`、并发健康检查子 span 和生命周期起止事件均已完成。Rust/Tauri 日志后端已完成 `tracing-subscriber` 注册、独立 Console Layer 与每日轮转 JSONL Layer 的 best-effort 诊断链路（非阻塞、有界且允许丢失；非严格 durable persistence；初始化失败当前 fail-closed；含退出冲刷、保留清理、首错报警和默认级别常量统一），Console 已通过 `RUST_LOG` 降级实机验证，启动 banner 以 console-only 形态落地；可观测性代码已通过系统性审查并将枚举令牌 Display 收敛为 strum derive。观测契约落档仍是下一步，完成后可转入前端工作；持久化行为验证已决策推迟至前端日志消费对齐后进行，移出后端 v1 完成门槛。

**本阶段边界**：完成 Rust/Tauri 后端可观测性 v1 后即可转入前端工作；Go Sidecar stdout/stderr 归一化与跨进程关联作为后续独立集成，不阻塞本阶段完成。

**已完成**：

- [x] 完成 Provider 与 Settings 的 RDD 上下文、失败事实和归因边界建模
- [x] 完成 Provider 内部错误、生命周期聚合与 `ProviderAppError` 安全边界投影
- [x] 建立 `LogEntry`、`AppLogger` 与 `ProviderLogEntry` 的结构化日志契约和领域投影
- [x] 完成 Provider manager、lifecycle 与 `Downgrade` 的应用层结构化日志接入及调用点审计
- [x] 完成 Provider manager 与 lifecycle 业务 span、`run_id` / `trigger` 关联，以及并发健康检查任务的子 span 传播
- [x] 完成生命周期稳定起止事件与交互式成功、失败、补偿事件的应用层埋点
- [x] 以 `tracing-subscriber` 完成日志后端注册，并将 Console Layer 独立装配
- [x] 以 Tauri 应用日志目录接入每日轮转 JSONL Layer，打通结构化日志持久化最小链路
- [x] 完成 JSONL 成熟化：非阻塞写入、worker guard 托管与退出冲刷、十四天保留清理、首写失败报警与命名常量集中
- [x] 完成 Console 收口：紧凑彩色格式、字段染色策略与 `RUST_LOG` 降级实机过滤验证
- [x] 以 console-only 直写形态落地启动 banner：双层立体框、绿色品牌艺术字与分级事实行，默认级别收敛为单一类型化常量，并按决策放弃 JSONL run 分隔符
- [x] 完成可观测性代码系统性审查，并将枚举令牌 Display 收敛为 strum derive（snake_case / transparent / to_string 插值），手写仅保留 struct 归因与单令牌源供应商标识两处闭合例外

**后续路线**：

- [ ] 观测契约落档：统一沉淀 facade、Event、Span、Subscriber、Layer、sink、过滤、字段稳定性与生命周期边界
- [ ] 前端日志消费对齐后补验 Rust/Tauri 日志与追踪在成功、失败、并发、轮转和退出路径下的关联与持久化行为（已决策移出后端 v1 完成门槛）
- [ ] 后续评估 Provider Span 关联增强（例如失败事件显式携带 `run_id` / `trigger` 或采用独立过滤策略）；不作为 0.0.1-dev 后端 v1 完成门槛
- [ ] 后续将 best-effort JSONL 诊断 sink 演进为 SQLite 持久化层；不作为当前 0.0.1-dev 后端 v1 完成门槛
- [ ] 后续独立集成 Go Sidecar stdout/stderr、source target 与跨进程 correlation，不作为 Rust/Tauri 后端 v1 完成门槛
- [ ] 定义前端日志策略（开发环境 console / 生产环境上报）

#### 6.3 前端错误系统

- [ ] 同步前端错误类型（镜像后端 `ProviderErrorCode`）
- [ ] 适配细粒度错误展示（按错误码差异化 UI 反馈）
- [ ] 设计错误展示组件（Toast / inline 错误消息）
- [ ] 评估 provider 级操作串行化需求（connect/reset/update 并发冲突）

#### 6.4 集成测试与验证

- [ ] 5 条命令链路端到端集成测试
- [ ] 错误传播链路验证（含命令链路错误场景）
- [ ] 错误响应契约验证（含序列化字段命名）
- [ ] 前端日志消费对齐后的日志输出与持久化补验（不作为后端 v1 完成门槛）

#### 6.5 收尾优化

- [ ] 前端状态转换验证（`useProviderCollectionStore` 防御性编程）
- [ ] 表单输入验证（URL 格式检查 / 必填字段提示 / 错误状态视觉反馈）
- [ ] 请求取消机制（AbortController 防止内存泄漏）
- [ ] 安全审计（`secret_meta` 前端消费 / Provider 支持范围收敛 / invoke 暴露面审计）
- [ ] Console 输出控制字符转义硬化（低优先级，不阻塞 MVP）
- [ ] 生命周期收口（orphan failed 认领 / 事件名契约自动化）
- [ ] 契约序列化命名收口（lifecycle payload camelCase）
- [ ] 前端并发锁架构对齐（`useToggleModels` 迁至 store 层 `isPending`）
- [ ] 后端异步执行架构对齐（同步持久化调用用 `tokio::task::spawn_blocking` 包裹）
- [ ] Provider HTTP client 初始化错误收口（避免 `reqwest::Client` 构建失败通过 `expect` panic，纳入 health-check 错误路径）
- [ ] Provider 持久化边界收口（将 `ProviderKeyTransaction` 隐藏为 store 层实现细节，由组合持久化服务统一处理 config + secret 写入与补偿回滚）
- [x] 后端 Rust 业务代码规范化：完成 `commands`、`core/shared` 与 `core/bot` 的人工校验，统一注释、实现顺序、导入约定与最小可见范围
- [x] Rust Comments 质量门禁与工程实验基线：完成规则实现、CLI/NAPI 正确性对齐、配置注入、仓库 audit 与 benchmark 基础设施
- [x] Rust Comments 工程代码规范化：完成 `core`、`cli` 与 `node` crate 的人工校验，并将其纳入仓库注释门禁覆盖
- [ ] Rust Comments 工程实验收尾：补齐 fixture，完成 fixture/仓库 audit 代表性 benchmark 与跨平台验证，确定生产 adapter
- [ ] Comments 规则收口：完成 Outer Line Doc、Inner Doc 与 Explanatory Comments 的源码审计和文档定稿
- [ ] Visibility 质量门禁子系统：覆盖模块项、关联项与 re-export 链，补齐 `syn` 结构检查、测试、仓库 audit 和文档定稿
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
