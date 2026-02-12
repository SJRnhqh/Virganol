# Virganol 落地路线图（MVP）

> 目标：做一款"能用、稳定、可扩展"的电子实验记录本，从"打通竖切"到"可用产品"。

---

## 已完成

### 基础架构

- Tauri 2.x + React 前端框架
- Go Agent Sidecar + gRPC 服务
- 动态端口握手机制（`VIRGANOL_PORT=<port>`）
- Rust ↔ Go 生命周期管理与优雅关闭
- **房东-租户模型**（Rust 控制持久化与安全，Go 在 scoped `dataDir` 内操作）

### 前端

- Settings Panel UI（牛皮缝线风格）
- LLM Provider 设置（Ollama、DeepSeek）
- Provider 连接流程（连接按钮、状态反馈、错误处理）
- 基于功能的架构（`features/bot/` 包含 types、store、hooks、components）
- 代码标准化（文件头注释、导入分区、桶导出）

### 后端

- **Rust**：Provider 连接与验证（直接 HTTP 调用 Ollama/DeepSeek）
- **Go**：BaseService（Ping/Shutdown）、ConfigService（Set/Get LLMConfig，scoped 存储）

---

## 里程碑一：CI/CD 设置

**目标**：自动化代码质量检查与构建验证。

### 任务

- [ ] GitHub Actions 工作流
  - [ ] `cargo check` + `cargo clippy`（Rust）
  - [ ] `pnpm lint` + `pnpm build`（UI）
  - [ ] `go build`（Go sidecar）
- [ ] 跨平台 CI（macOS、Windows、Linux）

### 完成标准

- 每个 PR 自动运行 lint 和构建检查
- 所有检查通过后才能合并

---

## 里程碑二：Provider 配置持久化

**目标**：安全持久化 LLM Provider 配置，应用重启后保留。

### 架构

- **存储**：`tauri-plugin-store`（基于 JSON 的 KV 存储）
- **位置**：`app_data_dir()`（平台特定，由 Tauri 管理）
- **数据分离**：
  - `config.json` ← Provider 设置（API URL、模型偏好、明文）
  - `secrets` ← API 密钥（独立安全存储，未来：keyring 集成）

### 任务

- [ ] 集成 `tauri-plugin-store` 插件
- [ ] 在 Rust 中实现 provider 配置持久化层
- [ ] 应用启动时加载已保存的配置
- [ ] 连接成功后自动保存

### 完成标准

- Provider 配置在应用重启后保留
- API 密钥安全存储（与明文配置分离）
- 用户无需重新输入凭证即可重连

---

## 里程碑三：最小聊天

**目标**：Provider 连接后的基础问答功能。

### 任务

#### 后端

- [ ] ChatService：`SendMessage` RPC
- [ ] 从持久化配置初始化 LLM 客户端
- [ ] 流式响应支持（server streaming）

#### 前端

- [ ] 聊天面板 UI
- [ ] 消息输入与展示
- [ ] 流式响应渲染

### 完成标准

- 用户可以发送消息并收到 LLM 回复
- 流式输出流畅工作

---

## 里程碑四：数据层（SQLite）

**目标**：笔记条目的持久化，MVP 基本可用。

### 数据模型

- Entries（id、title、content、created_at、updated_at、tags）
- Tags（JSON 字段或独立表）

### 技术决策

- **Rust/Tauri**：直接管理 SQLite（推荐）
- **备选**：通过 gRPC 的 Go NotesService（如需复杂查询）

### 任务

- [ ] SQLite  schema 设计
- [ ] CRUD 操作
- [ ] 基础搜索功能

### 完成标准

- Entries CRUD 正常工作并持久化
- 数据在应用重启后保留
- 基础搜索可用

---

## 里程碑五：AI 智能增强

**目标**：让 AI 在产品内"有用"。

- [ ] 为条目生成摘要
- [ ] 基于条目内容的问答
- [ ] 自动打标签
- [ ] 相关条目推荐

---

## 里程碑六：可靠性

**目标**：在复杂环境下稳定运行。

- [ ] Sidecar 崩溃自动重启
- [ ] 网络问题后 gRPC 重连
- [ ] 健康检查（liveness / readiness）
- [ ] 日志脱敏（日志中不出现 API 密钥）

---

## 里程碑七：打磨

- [ ] 键盘快捷键
- [ ] 深色/浅色主题切换
- [ ] 数据备份/恢复、导出（Markdown/PDF）
- [ ] 崩溃恢复（自动保存草稿）
- [ ] 性能优化

---

## 工程约定

### gRPC 包命名

- `virganol.v1`（当前）
- 未来拆分：`virganol.chat.v1`、`virganol.notes.v1`

### 横切关注点

- 日志脱敏（api_key、tokens）
- 请求 ID 追踪
- 统一超时与错误码

### 测试策略

- 单测：配置 I/O、服务方法
- 集成：UI → gRPC → LLM 流程
- E2E：设置 → 连接 → 聊天 → 保存条目
