# LLM Provider 配置接入路线图

## 架构概览

LLM Provider 接入分为两条主线：

1. **生命周期链路**：启动/手动触发 → 持久化读取 → 并发健康检查 → 事件推送前端
2. **CRUD 链路**：Provider 配置的增删改查（connect / reset / update_models）

两条链路共享 `ProviderError` 错误体系和 `store` 持久化层。

---

## 开发阶段

### ✅ Phase 1：错误类型统一

后端 `ProviderError` 体系建立，覆盖持久化读写、未注册 provider、
事件推送与并发检查等核心失败场景。
`ProviderErrorCode` 落位，前后端统一按 `code + message` 消费。
生命周期单元测试补齐（`as_str` / `Display` / serde 一致性）。

### ✅ Phase 2 & 3：前端基础设施

- 状态管理：`useProviderCheckStore` / `useProviderCollectionStore` 主状态建模完成
- 事件层：`services/events/provider/` 收口为
  `listen + handlers（check / validators / adapters / dispatchers / schedulers）`
- 生命周期 phase：`idle / checking / done / degraded / failed` 稳定，
  scheduler 落位，timer 统一释放
- 类型系统：`ProviderCheckEvent` / `ProviderId` / `ProviderCardState` /
  `ProviderCheckPhase` 统一收口，`constants` 使用 `satisfies` 约束
- 前端分层收口：`types → constants → icons → store → services → hooks → components`

### ✅ Phase 4：前端 UI 与 Hooks 层

#### 4.1 per-provider 卡片

- `cardState` 驱动渲染，卡片组件结构稳定
- reset 语义收回到 `connection`，`onReset` 内聚至 `useProviderConnection`
- `connect` 成功后清空内存态 `apiKey`
- 事件名常量化（`PROVIDER_CHECK_EVENTS`），硬编码消除

**组件目录**：

```txt
settings/provider/
├── LLMProviders.tsx
└── content/
    ├── ProviderTitle.tsx
    ├── ProviderList.tsx
    └── cards/
        ├── ProviderItem.tsx
        ├── ProviderCard.tsx
        ├── ProviderCardHeader.tsx
        ├── ProviderCardBody.tsx
        ├── ProviderCardContent.tsx
        ├── ProviderCardActions.tsx
        ├── ProviderConnectionButton.tsx
        ├── ProviderResetButton.tsx
        ├── ProviderForm.tsx
        ├── ProviderErrorPanel.tsx
        └── ProviderConnectedPanel.tsx
```

#### 4.2 Hooks 层审查

- `useProvider`：`useShallow` 细粒度订阅，纯契约聚合层，无业务逻辑
- `useProviderConnection`：接口收口为 `{ onConnect, onReset, onRetry }`
- `useProviderModelList`：`useShallow` 合并订阅，`every` 简化全选派生，
  `pendingRef` 互斥锁防并发
- `useProviderStartup`：`failed` phase 映射 `CloudOff` 图标，结构性错误有视觉反馈
- `useProviderStartup`：bootstrap 失败后立即拆除监听器，防止残留事件覆盖 failed 状态

### 🚧 Phase 5：交互式 CRUD 链路完善

> connect / reset / update_models 三条交互链路的前后端健壮化。

#### 5.1 交互一致性

- [ ] `reset` 一致性：仅在后端返回成功时清理本地状态，
  失败时保留现状并提示
- [ ] `ProviderCardActions` loading 状态：
  操作期间补 pending UI 保护，防止重复触发
- [ ] `update_models` / `reset` / `retry` 异常一致性回归，
  覆盖快速切换、持久化失败与重复点击场景
- [ ] `connect` 重连语义：确认重新连接时模型 enabled 状态是全量重置还是与旧偏好 merge

#### 5.2 CRUD 链路审查

**connect 前端审查**：

- [ ] `useProviderConnection.onConnect`：调用链与前置状态变更
- [ ] `useProviderCollectionStore`：成功/失败路径状态回写对称性
- [ ] 组件 / 类型 / 常量 / 图标配套完整性

**reset / update_models**：

- [ ] reset 后端：invoke `reset_provider` 契约 → `reset_provider_config`（config + key 原子性 / 回滚）→ store 读写
- [ ] reset 前端：`useProviderConnection.onReset` 调用链 → 失败时前端状态回滚一致性 → 组件 / 类型 / 常量配套
- [ ] update_models 后端：invoke `update_enabled_models` 契约 → `update_provider_enabled_models` → store 读写
- [ ] update_models 前端：`useProviderModelList` 调用链（并发互斥 / `pendingRef` 锁）→ 结果反馈补齐 → 组件 / 类型 / 常量配套

#### 5.3 错误体系收敛

- [ ] 前端 `errorCode` 收敛为联合类型 `ProviderErrorCode`，
  替代宽泛 `string`，支持消费侧穷举匹配
- [ ] 健康检查错误精细化：网络/认证/超时纳入 `ProviderError` 体系，
  区分不可达与业务"不在线"语义
- [ ] `ProviderError` — 补 `source()` 错误链或引入 `thiserror`，提升错误溯源能力（inline TODO 已标记，留待错误精细化阶段统一处理）
- [ ] 前端适配健康检查细粒度错误展示

### 🚧 Phase 6：收尾与安全加固

#### 6.1 安全与范围收敛

- [ ] `secret_meta` 前端消费闭环：展示 `has_key` / `key_source`，预留 `last4` 接入位
- [x] `connect` 成功后清空内存态 `apiKey`，避免明文密钥在前端长期驻留
- [ ] 收敛前后端 Provider 支持范围：`ProviderId` / 注册表 / 桌面端统一到 `deepseek` / `ollama`
  - [x] 前端事件层已补运行时白名单 guard
- [ ] 审计 invoke / event 暴露面，防止 Provider 直连 `fetch/axios`

#### 6.2 后端优化

- [x] `resolver.rs` — 密钥解析合并为单次，同时返回 key + meta，消除重复 I/O
- [ ] `store.rs` — 评估按 provider 独立 key 存储或脏标记机制，降低 I/O 开销
- [ ] `persistence.rs` — 引入 `ProvidersStore` cache，避免 `load_supported_providers` / `load_provider_record` 重复 I/O + 反序列化（触发条件：providers 数量 >20 或单次请求内多次读取）
- [ ] `reconcile_enabled_models` — 无变更路径避免 `record.clone()`
- [x] `SkippedProviderDetail` 补 `::new()` 构造函数，与 `ProviderIssue` 风格统一
- [x] `PROVIDERS_STORE_LOCK` — 评估完成，现有 `static Mutex<()>` 实现自洽，迁移至 `State<Mutex<T>>` 留待架构层统一推进
- [ ] `core/bot/models` 可见性收紧 — 完成 lifecycle 链路迁移后，将领域内部类型（`ProviderKey` / `ProviderRecord` / `ProviderIssue` / `SkippedProviderDetail`）从 `pub` 收紧为 `pub(crate)`，仅保留跨层契约类型（`ConnectAndSaveProviderRequest` / `HealthCheckResponse` / `ProviderId` / `ProviderError`）为 `pub`
- [ ] 密钥解析逻辑优化 — 密钥回退逻辑（env → keyring）与 `lifecycle/resolver.rs` 的重复性评估，考察 `key` 层函数重构以消灭 `resolved_key_guard` 的显式 `None` 分支
- [ ] provider 级别锁优化 — 实现 per-provider 锁，串行化同一 provider 的 connect 流程，避免高并发下状态互相覆盖

#### 6.3 生命周期收口

- [ ] orphan failed run 认领顺序一致性，避免 scheduler / checkStore 认知短暂分裂
- [ ] orphan failed 的 `trigger` 语义：前端兜底接受 `null` 或后端 payload 补齐
- [ ] `RunDisposition` 收口到统一类型管理入口（待服务层类型边界稳定后）
- [x] 事件名前后端契约自动化：Rust 侧事件名抽为常量模块

#### 6.4 测试

- [ ] 补充集成测试
- [ ] 功能开发完结

---

## 备注

- [ ] 各 Phase 之间非严格串行，前端适配过程中可能回头调整后端细节
