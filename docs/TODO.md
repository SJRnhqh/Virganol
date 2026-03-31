# TODO — feat/spirit-crud-buildup

聚焦 connect 链路的全栈审查与重构。
以 API 层为轴心：向后穿透后端契约，向前审查前端垂直链路。
审查过程中发现的问题直接补入对应任务项。

---

## 1. API 层重组

- [ ] `services/api/providers.ts` → `services/api/provider/crud.ts`
- [ ] 更新所有 import 引用

## 2. connect 后端审查

- [ ] invoke 参数序列化 → `connect_and_save_provider` command 入参契约
- [ ] `connect_and_save` 业务逻辑：健康检查 / 密钥处理 / 回滚路径
- [ ] store 读写：`save_provider` / `load_provider_record` 行为

## 3. connect 前端审查

- [ ] `useProviderConnection.onConnect`：调用链与前置状态变更
- [ ] `useProviderCollectionStore`：成功/失败路径状态回写对称性
- [ ] 组件 / 类型 / 常量 / 图标配套完整性
