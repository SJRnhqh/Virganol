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
- [ ] `connect_and_save` 业务逻辑深度审查：
  - [x] 密钥解析中间变量简化（消灭 `key_for_check`）
  - [x] 无条件快照逻辑落位（`previous_persisted_key`）
  - [ ] 密钥回退逻辑（env -> keyring）与 `lifecycle/resolver.rs` 的重复性评估
    - [ ] TODO: 考察 `secrets` 层函数重构，以消灭 `resolved_key_guard` 的显式 `None` 分支
  - [ ] 健康检查失败时的错误处理
  - [ ] Store 持久化失败后的 Keyring 回滚路径验证
  - [ ] `ProviderRecord` 状态合并逻辑（`compute_enabled_models`）
- [ ] store 读写：`save_provider` / `load_provider_record` 行为

## 3. connect 前端审查

- [ ] `useProviderConnection.onConnect`：调用链与前置状态变更
- [ ] `useProviderCollectionStore`：成功/失败路径状态回写对称性
- [ ] 组件 / 类型 / 常量 / 图标配套完整性
