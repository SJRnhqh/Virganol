# TODO — feat/spirit-crud-buildup

CRUD 链路从用户手势出发，沿请求链向后穿透，再沿响应链向前检查状态回写。
三条操作（connect / reset / update_models）各自独立走完三段，按顺序推进。

---

## connect

- [ ] 手势层：`ProviderConnectionButton` → `useProviderConnection.onConnect` props 传递与前置状态变更
- [ ] 请求链：`connectAndSaveProvider` invoke 序列化 → `connect_and_save_provider` 命令入参 → `connect_and_save` 业务逻辑（健康检查 / 密钥处理 / 回滚）→ store 读写
- [ ] 响应链：response 字段消费完整性 → 成功/失败路径状态回写对称性 → `useProviderCollectionStore` 更新正确性

## reset

- [ ] 手势层：`ProviderResetButton` → `useProviderConnection.onReset` 调用时序与前置状态
- [ ] 请求链：`resetProvider` invoke → `reset_provider` 命令 → `reset_provider_config` 业务逻辑（config + key 原子性 / 回滚）→ store 读写
- [ ] 响应链：失败时前端状态回滚一致性

## update_models

- [ ] 手势层：模型 toggle → `useProviderModelList` 并发互斥与 `pendingRef` 锁逻辑
- [ ] 请求链：`updateEnabledModels` invoke → `update_enabled_models` 命令 → `update_provider_enabled_models` → store 读写
- [ ] 响应链：结果反馈缺失（当前仅 console）→ UI 状态同步
