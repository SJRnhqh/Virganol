# Repository Guidelines

## 适用范围

- 供 AI 编码代理（如 Codex）与贡献者共同遵循。
- 作用域：仓库根目录及全部子目录。

## 当前阶段范围

- 当前阶段仅关注 **Tauri ↔ React** 的 Provider 生命周期与安全持久化，不涉及 sidecar 新功能。
- 当前范围仅限 **deepseek** 与 **ollama**。
- Provider 改动需同时保证生命周期链路与 CRUD 链路一致。

## 文档导航

- `docs/ARCHITECTURE.md`：系统分层、Landlord-Tenant 模型、跨层职责边界。
- `docs/ROADMAP.md`：Provider 生命周期中长期演进路线、已完成阶段与后续 phase。
- `docs/TODO.md`：当前短期冲刺与前端审查顺序；默认按 `store → handlers → hooks → components` 自底向上推进。
- 涉及字段、事件、命令、状态语义变更时，需同步更新对应文档。

## 项目结构

- `apps/ui/`：React + TS 前端（核心在 `src/features/`）。
- `apps/desktop/`：Tauri + Rust（`commands/`、`core/`）。
- `apps/server/`：Go gRPC sidecar（`cmd/agent/`、`internal/`、`pkg/service/`、`proto/`）。

## 开发与校验

- `pnpm dev`：启动桌面开发（含 sidecar）。
- `pnpm dev:ui`：仅启动前端。
- `bash .github/ci/ui-lint.sh`：前端 lint。
- `bash .github/ci/go-test.sh`：Go 测试。
- `bash .github/ci/rust-check.sh`：Rust 检查。

## 代码与提交流程

- TS/React：2 空格缩进，组件 `PascalCase`，Hook `useXxx`。
- Rust/Go：遵循语言默认规范（Rust `snake_case`、Go `gofmt`）。
- Commit 建议：`emoji + type + 小写开头英文描述`（示例：`🔧 fix: ...`）且不需要具体细节。
- 提交前至少通过 UI lint、Go test、Rust check。

## 安全要求

- 禁止日志输出 API Key/Token。
- 不通过前端事件或响应回传明文密钥；敏感数据优先在桌面层处理。
- 不让前端直接直连 Provider；Provider 接入优先经桌面层处理。
- Provider 改动必须验证 `connect` / `retry` / `reset` / `update_models` 一致性。
