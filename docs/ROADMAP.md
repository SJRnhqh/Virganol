# Virganol 落地路线图 🗺️（MVP）

> 目标：做一款“能用、稳定、可扩展”的电子实验记录本，从“打通竖切”到“可用产品”。

## 已完成 ✅
- 前端：Tauri + React 基础布局
- 后端：Go sidecar + gRPC 服务
- 连接：动态端口握手 + Ping/Pong 连通验证
- 可靠性：Rust↔Go 生命周期管理与优雅关闭

---

## 总体策略 🎯
先打通“设置→连接→最小聊天”的竖切，让产品尽快呈现效果；随后补齐数据持久化与可靠性；再上智能能力。  
持久化（尤其是 LLM 供应商设置）在竖切阶段可暂缓，等到链路稳定后再接入安全落盘。

---

## 里程碑一：竖切打通（设置→连接校验→健康检查→最小聊天）🚦

目标：不做设置持久化，先在会话内跑通 UI→gRPC→Eino 的最短路径。

- 后端（Go）
  - 接入标准健康检查：`grpc.health.v1`（liveness）与可选 readiness
  - SettingsService：
    - `TestConnection`：基于 Eino 做最小真实调用校验（轻量、可限速）
    - `SaveSettings`（预留，但竖切阶段不落盘，先用内存 Store）
  - ChatService：
    - `SendMessage`（最简问答链路，使用会话内 Provider 实例）
  - 横切拦截：日志脱敏（不打印 API Key）、请求 ID、超时
- 前端（React/Tauri）
  - “LLM 供应商设置”面板（仅会话保存，刷新丢失可接受）
  - “连接测试”按钮调用 `TestConnection`，通过后开启“最小聊天”
  - “健康状态”指示（后端 gRPC 健康为主）
- 定义完成（DoD）
  - 本地启动后，用户可：
    1. 填写 LLM 配置→点击“连接测试”→得到明确通过/失败提示
    2. 打开简易聊天面板，完成一次最简问答
  - `grpc.health.v1 Check` 返回 `SERVING`
  - 日志中无敏感信息泄漏
- 风险与回滚
  - 若 Eino 或外部 LLM 不稳定，`TestConnection` 应限制为轻量、可快速失败并缓存结果；UI 有重试与清晰错误提示。

---

## 里程碑二：数据层（SQLite）与基础 CRUD 📚

目标：笔记数据持久化上线，MVP 基本可用。

- 数据模型（初稿）
  - Notebooks（可选）
  - Entries（id、title、content、created_at、updated_at、tags）
  - Tags（名称索引）或 Entries.tags 做简单分隔
- 后端（可选两种方案）
  1. 由 Rust/Tauri 直接管理 SQLite（前端调用本地命令/插件）  
  2. 由 Go 服务暴露 NotesService，经 gRPC 操作数据（更一致）
- 基本能力
  - 创建/编辑/删除条目（Entry CRUD）
  - 简单搜索（标题/标签 LIKE）
- 前端
  - 列表页 + 编辑器页（富文本可暂用轻量编辑器，后续可替换）
  - 删除前确认、保存进度提示
- DoD
  - Entries 的增删改查可持久化存盘
  - 打开应用后能看到上次保存的条目
  - 基本搜索可用（标题/标签）

---

## 里程碑三：AI 接入与最小智能问答 🤖

目标：让 AI 在产品内“有用”。

- 后端
  - Eino Provider 工厂封装（OpenAI/Azure/本地）
  - 使用 `TestConnection` 通过的配置来初始化对话
- 前端
  - 聊天侧栏：选中条目→一键生成摘要/问答（上下文为当前条目）
  - 费用/长度保护（限制最大 token/超时）
- DoD
  - 对当前条目执行“摘要生成”和“问答”，返回稳定
  - 失败路径有清晰提示（鉴权失败、超时、配额等）

---

## 里程碑四：设置持久化与安全 🔐

目标：把“会话内设置”升级为“安全落盘设置”，改善用户体验。

- 路径规范（跨平台）
  - Windows：`%AppData%\Virganol`（配置），`%LocalAppData%\Virganol\{data|logs}`
  - macOS：`~/Library/Application Support/Virganol`（配置/数据），`~/Library/Logs/Virganol`
  - Linux（XDG）：`~/.config|~/.local/share|~/.cache/Virganol`
- 可覆写：`VIRGANOL_DATA_DIR` / `--data-dir`；`VIRGANOL_PROFILE=dev/test/prod`
- 安全存储
  - 生产：Keychain/Credential Locker/libsecret
  - 开发/CI：环境变量或文件后端 mock
- SettingsService
  - `SaveSettings` 落盘（密钥走安全存储），`GetSettings` 返回脱敏配置
- DoD
  - 重启后保留 LLM 配置
  - 密钥不出现在日志/配置文件中（仅在系统凭据库）

---

## 里程碑五：可靠性与可观测性 🛡️

目标：让产品在复杂环境下也稳定运行。

- Sidecar 生命周期完善：启动/停止/重启、崩溃拉起、指数退避重连
- 健康检查语义化
  - Liveness：进程与 gRPC 正常
  - Readiness：必要配置加载成功、数据库可用、最近一次连接测试通过（可缓存）
- 拦截器：统一错误码映射、超时/重试、Panic Recovery
- 日志与追踪：请求 ID、关键操作埋点、可诊断错误日志
- DoD
  - 后端崩溃后可自动拉起
  - 网络抖动后 gRPC 能自动恢复连接
  - 常见错误具备可诊断日志

---

## 里程碑六：智能增强 🧠

目标：把 AI 用在“更有用”的场景。

- 自动打标签（基于摘要/关键词）
- 相关条目推荐（按 Embedding 或关键词）
- 实验方案助手（基于模板 + LLM 草拟）
- DoD
  - 单条目自动标签准确率基本可接受
  - 推荐列表与实际内容相关性可感知

---

## 里程碑七：打磨 ✨

- 快捷键、深色/浅色主题、可定制模板
- 数据备份/恢复、一键导出（Markdown/PDF）
- 崩溃恢复（草稿自动保存）
- 性能优化（大文本渲染与搜索）

---

## 工程约定与附录 📎

- gRPC 包命名
  - `virganol.settings.v1`、`virganol.chat.v1`、`virganol.notes.v1`
- 健康检查
  - 实现 `grpc.health.v1` 标准；必要时提供 `BuildInfo/Version` 辅助接口
- 横切策略
  - 日志脱敏（api_key、token）、请求 ID、统一超时与错误码
- 测试策略
  - 单测：配置读写/原子写入/并发安全；服务方法业务校验
  - 集成：UI→gRPC→Eino 闭环；SQLite CRUD 与迁移
  - E2E：竖切流程（设置→测试→聊天→保存条目→摘要）

---

## 快速检查清单 ✅

- [ ] 用户能在一次会话内：填写设置→连接测试→最小聊天（无持久化）
- [ ] SQLite CRUD 可用，条目能保存/重启后仍在
- [ ] 设置安全落盘，密钥仅存于系统凭据库
- [ ] 健康检查分清 liveness/readiness，工具可探测
- [ ] 日志可诊断且不泄露敏感信息
