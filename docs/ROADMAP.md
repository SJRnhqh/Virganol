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

#### 6.2 Provider 可靠性与可观测性

Rust/Tauri 可观测性 v1 已于 2026-09-08 合入 `feat/spirit`（#39），合入前通过 `pnpm test`。后续阶段验证完整的日志消费、持久化和跨进程关联。

**已完成**：

- [x] 完成 Provider 和 Settings 的上下文传播、错误归因与 `ProviderAppError` 边界投影，并建立 `LogEntry`、`AppLogger` 和 `ProviderLogEntry` 日志契约
- [x] 接入 Provider manager、lifecycle 和 `Downgrade` 日志，关联业务 span、`run_id`、`trigger` 与并发健康检查子 span，覆盖起止、成败和补偿事件
- [x] 通过 `tracing-subscriber` 装配 Console 和每日轮转 JSONL。Console 已实机验证 `RUST_LOG` 过滤并输出启动 banner，枚举日志令牌收敛为 strum derive
- [x] JSONL 采用有界、非阻塞的尽力写入，托管 `WorkerGuard`，在启动时清理超过十四天的文件并报告首个写入错误。日志初始化失败时阻止应用继续启动

**已知边界**：正常退出可能丢失尚未写出的 JSONL 尾部日志。Tauri 退出路径的有界冲刷和实机验证留待持久化阶段完成。

**后续路线**：

- [ ] 观测契约落档：统一沉淀 facade、Event、Span、Subscriber、Layer、sink、过滤、字段稳定性与生命周期边界
- [ ] 前端日志消费对齐后，验证成功、失败、并发、过滤、轮转、写入失败和退出路径的日志关联与持久化行为，补充自动回归测试
- [ ] 完成退出冲刷、诊断数据容量上限和运行期清理，评估 SQLite 演进并明确写入、保留和退出契约
- [ ] 评估 Provider 失败事件是否需要显式携带 `run_id`、`trigger` 或独立过滤策略
- [ ] 独立集成 Go Sidecar stdout/stderr，统一日志来源字段与跨进程关联
- [ ] 定义前端日志策略（开发环境 console / 生产环境上报）

#### 6.3 前端错误系统

- [ ] 先明确前后端边界错误的映射，再同步 `ProviderErrorCode` 并按错误码选择 Toast 或行内反馈
- [ ] 继续使用 Rsbuild，出现构建回归时再评估构建方案
- [ ] 评估 provider 级操作串行化需求（connect/reset/update 并发冲突）

#### 6.4 集成测试与验证

- [ ] 补齐 Provider 五条命令链路的端到端回归，覆盖 connect/reset/update、启动与生命周期的成功和错误场景。现有 mocked browser 和真实 WebView 检查仅覆盖冒烟场景
- [ ] 验证命令和事件的错误传播、响应结构与序列化字段命名

#### 6.5 收尾优化

- [ ] 以 `MainLayout` 为入口，按 WindowHeader → Sidebar → MainStage → SettingsModal 检查 JSX、状态与样式边界。Sidebar 重点检查 settings `toggle` 和 `useSidebarStyles` 订阅，MainStage 对齐 `NavId` 与 `types/props/` 的类型派生
- [x] 完成 WindowHeader 收尾。平台适配、`trafficLightInset`、根样式和配色分层已完成（#44、#45），Windows 自绘控件的 StyleX 迁移及图标、布局、悬停反馈已验证。`Breadcrumb` 与 `ModuleMenu` 已整体移除（含面包屑专属 token），0.0.1 的模块定位由侧栏承担，后续聊天界面落地时再评估顶栏信息区设计。三个应用按钮及壳层 store/state 契约已完成订阅与规范化审查，设置按钮默认打开 General
- [ ] 按平台裁剪窗口状态查询（暂缓）。目前 `WindowHeader` 通过一份尺寸变化监听查询全屏和最大化状态。后续评估 macOS 只查全屏、Windows 只查最大化的方案。
- [ ] macOS 全屏切换补验：红绿灯让位进出全屏是否正确，退出全屏时原生红绿灯与顶栏内容的短暂重叠是否需修（根治需 Rust 侧 `willExitFullScreen` 提前通知前端）
- [x] StyleX 升级 0.19.2 并切回 `.rspack()`（#45）：开发期保留 `runtimeInjection`；色板值可热更新，`defineVars` 映射改动仍需 reload
- [ ] 暗色主题（Pine 调色）与主题切换并入未来设置「外观」，届时评估 roles 契约 + `createTheme` 方案
- [ ] `components` 已可依赖 `styles`。样式文件增多后再评估 `moduleDirs` 配置和索引入口规则
- [ ] 回看侧栏/模块 CSS scoping（`@scope`、`@layer`、BEM），待组件边界清晰与 StyleX 试点评估后
- [ ] 前端壳层的单向依赖门禁已落地。收编 `features/` 时扩展 `eslint-plugin-boundaries` 检查，并复核相对路径和 `@/` 别名的使用范围
- [ ] 清理 bot 域内别名和跨目录深层导入，按 TypeScript 导入规则收口，并明确 feature 启动 Hook 的挂载位置
- [x] 清理壳层 store 中闲置的 `setOpen`、`setSide`，将 `toggleSide` 简化为同步状态更新，并复用 disclosure 辅助逻辑
- [ ] 随 MainStage 收窄 `activeId` 的类型，并收紧 `handleKeyDown` 的依赖参数
- [ ] 深度规范化剩余样式文件：`canvas.css`、`tokens.css`、`scrollbars.css`、`themes/_palette.css` 与 `themes/light.css`（当前仅 `index.css`、`themes/index.css` 与 `base.css` 完成）；收编 `_palette.css` 时消除与 `styles/palettes/` 的色值重复
- [ ] 决策 feature 专属 base 组件的去向：归入所属 feature 或未来的共享 UI 层
- [ ] 完善 [TypeScript 代码规范](rules/typescript-code-style.md) 的 JSDoc、路径头和扫描范围。补齐行内注释约定，明确 config 文件纳入扫描、HTML/JSON 排除；正式发布品牌图标落地前清理占位 favicon/title
- [ ] 首次正式发布前明确应用 identifier 与 keyring namespace 变更后的配置、密钥迁移或重置策略（`com.virganol.app` → `com.virganol`，`com.virganol.app.provider` → `com.virganol.provider`）；当前不要求已有开发安装自动迁移
- [ ] 首次正式发布前明确支持的 OS/WebView 版本范围，并验证 Windows/Linux、较旧 WebView 与签名发布打包；当前原生打包检查仅覆盖 macOS arm64 debug
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
- [x] Rust Comments 工程代码规范化：完成 `core`、`cli` 与 `node` crate 的人工校验，并将其纳入仓库注释门禁覆盖
- [ ] 后端锁实现升级（`std::sync::Mutex` → `parking_lot::Mutex`）
- [ ] 后端锁粒度细化（全局锁 → per-provider 锁）

#### 6.6 测试覆盖与质量门禁

- [ ] 依赖更新分批推进（ESLint 家族与 `feat/spirit-pnpm-deps-update` 的兼容更新已完成；CI 已补 Rust 构建缓存）。剩余范围内：React 及类型、framer-motion、@xyflow/react；跨大版本逐项评估（eslint 10、stylelint 18、typescript 7、framer-motion 14、@xyflow/react 13、@lobehub/icons 6、commitlint 21 等）。每批单独提交并跑 `pnpm test` 与 `pnpm diff:budget`
- [ ] 在 `dev/scripts/ts/comments/` 建立基于 comment-parser 的 TS 注释检查器并接入 `dev/scripts/ts/test.mjs`。现有仅中文文档注释先报告，再随规范扫描切换为强制门禁
- [ ] 前端行为测试出现时评估 Rstest；Rslib、Rspress、Rsdoctor 与 Rslint 继续延后到明确需求出现
- [ ] 补齐 0.0.1 单元测试与缺口覆盖
- [ ] 结合测试体系评估 `pnpm test` 与 `pnpm verify` 的职责和入口
- [ ] Core 规范化：继续人工校验剩余 Core 的 item docs、实现顺序与可见范围
- [x] Rust Comments 质量门禁与工程实验基线：完成规则实现、CLI/NAPI 正确性对齐、配置注入、仓库 audit 与 benchmark 基础设施
- [ ] Rust Comments 工程实验收尾：补齐 fixture，完成 fixture/仓库 audit 代表性 benchmark 与跨平台验证，确定生产 adapter
- [ ] Comments 规则收口：完成 Outer Line Doc、Inner Doc 与 Explanatory Comments 的源码审计、规则实现和文档定稿
- [x] Re-export visibility contract 基线：完成配置、链路校验与测试入口
- [ ] Visibility 质量门禁扩展：在现有 re-export contract 基础上覆盖模块项与关联项，补齐 `syn` 结构检查、测试、仓库 audit 和文档定稿

## 首版发布后

- 在 Windows 11 上评估自绘最大化按钮是否值得接入系统贴靠布局（Snap Layouts）。
