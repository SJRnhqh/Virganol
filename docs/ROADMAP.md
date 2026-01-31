# Virganol 落地路线图（MVP）

> 目标：做一款"能用、稳定、可扩展"的电子实验记录本，从"打通竖切"到"可用产品"。

---

## 已完成

### 基础架构

- Tauri 2.x + React 前端框架
- Go Agent Sidecar + gRPC 服务
- 动态端口握手机制（Go 输出 `VIRGANOL_PORT=<port>`，Rust 解析连接）
- Rust ↔ Go 生命周期管理与优雅关闭

### 前端 UI

- Settings Panel 基础布局（牛皮缝线风格）
- LLM Provider 设置组件（Ollama、DeepSeek）
- BaseProvider 通用组件 + 字段注册机制
- 样式语义化（CSS 变量主题系统）

### 后端服务

- BaseService：Ping / Shutdown
- ConfigService：SetLLMConfig / GetLLMConfig / VerifyLLMConfig
- LLM 配置验证（OpenAI 兼容 API，使用 ListModels 轻量验证）

### Tauri Commands（已定义，待前端调用）

- `verify_llm_config` - 验证 LLM 配置
- `set_llm_config` - 保存配置
- `get_llm_config` - 读取配置

---

## 里程碑一：竖切打通

**目标**：跑通 UI → Tauri → gRPC → Go 的完整链路，实现最小可用的设置与连接验证。

### 待完成

#### 前端

- [ ] 前端调用 Tauri invoke（`verify_llm_config`）
- [ ] Connect 按钮 + 状态反馈（loading、success、error）
- [ ] 视觉反馈：呼吸灯 / 对勾 / 错误提示

#### Proto 扩展

- [ ] `LLMConfig` 增加 `api_url` 字段（支持 Ollama 自定义地址）

#### Go 适配

- [ ] `VerifyLLMConfig` 根据 `provider` 字段分发验证逻辑
- [ ] Ollama 验证：调用 `/api/tags` 或类似轻量接口
- [ ] DeepSeek 验证：使用 OpenAI 兼容方式

#### 可选

- [ ] 健康检查指示（基于 Ping 或 grpc.health.v1）

### 完成标准

- 用户填写 LLM 配置 → 点击 Connect → 得到明确的成功/失败提示
- 支持 Ollama（本地）和 DeepSeek（云端）两种 Provider

---

## 里程碑二：最小聊天

**目标**：在连接验证通过后，实现最简单的问答功能。

### 待完成

#### 后端

- [ ] ChatService：`SendMessage` RPC
- [ ] 基于验证通过的配置初始化 LLM 客户端
- [ ] 流式响应支持（server streaming）

#### 前端

- [ ] 聊天面板 UI
- [ ] 消息输入与展示
- [ ] 流式响应渲染

### 完成标准

- 用户可以发送消息并收到 LLM 回复
- 支持流式输出

---

## 里程碑三：数据层（SQLite）

**目标**：笔记数据持久化，MVP 基本可用。

### 数据模型

- Entries（id、title、content、created_at、updated_at、tags）
- Tags（可选独立表或 JSON 字段）

### 技术决策

- 方案 A：Rust/Tauri 直接管理 SQLite
- 方案 B：Go 暴露 NotesService，经 gRPC 操作

### 完成标准

- Entries CRUD 可持久化
- 重启后数据保留
- 基本搜索可用

---

## 里程碑四：设置持久化与安全

**目标**：LLM 配置安全落盘，改善用户体验。

### 路径规范

| 平台 | 配置 | 数据 | 日志 |
| ------ | ------ | ------ | ------ |
| Windows | `%AppData%\Virganol` | `%LocalAppData%\Virganol\data` | `%LocalAppData%\Virganol\logs` |
| macOS | `~/Library/Application Support/Virganol` | 同左 | `~/Library/Logs/Virganol` |
| Linux | `~/.config/virganol` | `~/.local/share/virganol` | `~/.cache/virganol/logs` |

### 安全存储

- 生产：Keychain / Credential Locker / libsecret
- 开发：环境变量或文件 mock

### 完成标准

- 重启后保留 LLM 配置
- API Key 仅存于系统凭据库，不出现在日志/配置文件

---

## 里程碑五：AI 智能增强

**目标**：让 AI 在产品内"有用"。

- 对当前条目生成摘要
- 基于条目内容问答
- 自动打标签
- 相关条目推荐

---

## 里程碑六：可靠性

**目标**：复杂环境下稳定运行。

- Sidecar 崩溃自动拉起
- 网络抖动后 gRPC 自动恢复
- 健康检查语义化（liveness / readiness）
- 日志可诊断且不泄露敏感信息

---

## 里程碑七：打磨

- 快捷键、深色/浅色主题
- 数据备份/恢复、导出（Markdown/PDF）
- 崩溃恢复（草稿自动保存）
- 性能优化

---

## 工程约定

### gRPC 包命名

- `virganol.v1`（当前）
- 后续可拆分：`virganol.config.v1`、`virganol.chat.v1`、`virganol.notes.v1`

### 横切关注点

- 日志脱敏（api_key、token）
- 请求 ID 追踪
- 统一超时与错误码

### 测试策略

- 单测：配置读写、服务方法
- 集成：UI → gRPC → LLM 闭环
- E2E：设置 → 连接 → 聊天 → 保存条目
