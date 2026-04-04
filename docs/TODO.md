# TODO — feat/spirit-crud-buildup

聚焦 connect 链路的全栈审查与重构。
以 API 层为轴心：向后穿透后端契约，向前审查前端垂直链路。
审查过程中发现的问题直接补入对应任务项。

---

## 1. API 层重组

- [x] `services/api/providers.ts` → `services/api/provider/crud.ts`
- [x] 更新所有 import 引用

## 2. connect 后端审查

- [x] 目录结构重构：核心逻辑向 `core/bot/{models, services}` 迁移内聚
- [x] invoke 参数序列化 → `connect_and_save_provider` command 入参契约（url 简化完成）
- [x] `ProviderError` 迁移重构：从旧位置迁移至 `core/bot/models/provider/error/` 目录
- [x] `ProviderRecord` 迁移重构：从 `core/models/settings.rs` 迁移至 `core/bot/models/provider/record.rs`
- [x] `ProviderKey` 迁移重构：从 `core/security/provider.rs` 迁移至 `core/bot/models/provider/key.rs`
- [x] Keyring 命名空间常量上提：统一收口到 `core/bot/constants/keyring.rs`
- [x] `compute_enabled_models` 迁移重构：收口到 `core/bot/services/settings/provider/selection.rs` 并统一调用入口
- [x] health 模块迁移重构：`health_check` 收口到 `core/bot/services/settings/provider/connection/health.rs`
- [x] `connect_and_save` 业务逻辑深度审查：
  - [x] 密钥解析中间变量简化（消灭 `key_for_check`）
  - [x] 快照改为有条件（仅用户显式输入 key 时记录，与回滚条件对称）
  - [x] 输入归一化对称（key / url 统一在函数入口 trim）
  - [x] key 持久化 / 跳过逻辑、日志措辞修正
  - [x] `ProviderRecord` 状态合并逻辑（`compute_enabled_models` 调用点确认）
  - [x] Store 持久化失败后的 Keyring 回滚路径验证
  - [ ] 密钥回退逻辑（env -> keyring）与 `lifecycle/resolver.rs` 的重复性评估
    - [ ] TODO: 考察 `secrets` 层函数重构，以消灭 `resolved_key_guard` 的显式 `None` 分支
- [x] common 层持久化迁移重构：
  - [x] 通用 JSON I/O 函数迁移：`core/settings/store.rs` → `core/bot/services/settings/common/persistence.rs`
  - [x] 常量迁移：`SETTINGS_STORE_FILE` → `SETTINGS_FILE`，收口到 `core/bot/constants/settings.rs`
  - [x] 模块导出链路优化：`persistence.rs → common/mod.rs → settings/mod.rs → services/mod.rs`
  - [x] 命名语义优化：`store` → `persistence`，避免前端状态管理混淆
- [x] provider 专用持久化迁移重构：
  - [x] 函数迁移：`core/settings/bot/providers/store.rs` → `core/bot/services/settings/provider/persistence.rs`
  - [x] 常量迁移：`STORE_KEY_SPIRIT_PROVIDERS` → `SPIRIT_PROVIDERS_KEY`，收口到 `core/bot/constants/settings.rs`
  - [x] 模块导出链路：`persistence.rs → provider/mod.rs → settings/mod.rs → services/mod.rs`
  - [x] 所有调用方引用路径更新（crud.rs / service.rs / lifecycle/*）
- [x] 密钥管理迁移重构：
  - [x] 函数迁移：`core/settings/secrets.rs` → `core/bot/services/settings/provider/key.rs`
  - [x] 命名优化：`secrets` → `key`，与 `persistence` 形成对称结构
  - [x] 模块导出链路：`key.rs → provider/mod.rs → settings/mod.rs → services/mod.rs`
  - [x] 所有调用方引用路径更新，旧路径 `core::settings::secrets` 完全清除
  - [x] 可见性统一：所有函数 `pub(crate)`，通过 mod re-export 有限暴露
- [x] `SupportedProvidersSnapshot` 迁移重构：
  - [x] 类型迁移：`core/models/provider/snapshot.rs` → `core/bot/models/provider/snapshot.rs`
  - [x] 导入路径更新：`persistence.rs` 改为从 `core::bot::models` 导入
  - [x] 旧文件清理：删除 `core/models/provider/snapshot.rs`
- [ ] 密钥解析逻辑优化（待评估）：
  - [ ] 密钥回退逻辑（env -> keyring）与 `lifecycle/resolver.rs` 的重复性评估
  - [ ] 考察 `key` 层函数重构，以消灭 `resolved_key_guard` 的显式 `None` 分支
- [ ] provider 级别锁优化：
  - [ ] 实现 provider 级别锁，串行化同一 provider 的 connect 流程，避免高并发下状态互相覆盖

## 3. connect 前端审查

- [ ] `useProviderConnection.onConnect`：调用链与前置状态变更
- [ ] `useProviderCollectionStore`：成功/失败路径状态回写对称性
- [ ] 组件 / 类型 / 常量 / 图标配套完整性
