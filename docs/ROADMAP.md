# Provider 生命周期开发路线图

## 后端架构概览

LLM Provider 后端分为两条主线：

1. **生命周期链路**：启动/手动触发 → 持久化读取 → 并发健康检查 → 事件推送前端
2. **CRUD 链路**：Provider 配置的增删改查（connect / reset / update_models）

两条链路共享 `ProviderError` 错误体系和 `store` 持久化层。

---

## 开发阶段

### ✅ Phase 1：生命周期错误类型统一

- [x] 生命周期错误已统一收口到 `ProviderError`，覆盖持久化读写、未注册 provider、事件推送与并发检查等核心失败场景。

### ✅ Phase 2：错误 code 与 message 统一管理

- [x] `ProviderErrorCode` 已落位，前后端统一按 `code + message` 消费，错误码与展示文案职责已分离。

### ✅ Phase 3：生命周期单元测试

- [x] `ProviderErrorCode::as_str` / `Display` / serde 一致性测试已补齐。

### 🚧 Phase 4：前端生命周期适配

> 已完成部分仅保留当前结论；未完成项继续保留细节。

#### ✅ 4.1 前端状态管理框架

- [x] `useProviderCheckStore` / `useProviderCollectionStore` 已完成主状态建模。
- [x] 生命周期命令与事件边界已统一收口到 `services/`，包含 startup / manual trigger、串行监听注册与 `run_id`
守卫。
- [x] 类型系统已对齐：`ProviderCheckEvent` / `ProviderId` / `ProviderCardState` /
`ProviderCheckPhase` 已统一收口到底层 `types`，`constants` 使用 `satisfies` 约束。

#### ✅ 4.2 全局生命周期渲染与交互

- [x] 全局 phase 已稳定收口为 `idle / checking / done / degraded / failed`。
- [x] 生命周期终态语义已对齐：`completed` 承载业务失败数量，`failed` 承载结构性错误。
- [x] `handleProviderStatus` 已修复失败时模型残留、成功时空模型不同步等问题。
- [x] 前后端 payload 已精简，后端统计已收敛为 `failed_count`，`started → status → completed/failed`
时序已对齐。

#### 🚧 4.3 per-provider 卡片渲染

**已完成摘要**：

- [x] 卡片已完成 `cardState` 驱动渲染，`ProviderCardHeader` / `ProviderCardBody` / `ProviderCardContent`
/ `ProviderConnectionButton` 结构稳定。
- [x] 卡片内容契约已收紧：`ProviderInfo`、`provider + connectionInfo`、`ProviderCardProps` 等边界已统一。
- [x] `ProviderCardActions` / `ProviderResetButton` 已落位，reset 仅在 `connected / failed`
状态显示。
- [x] reset 动作区已收为右侧同行布局：主按钮 + icon-only reset，交互保持克制。
- [x] `reset` 语义已从 `form` 收回到 `connection`，表单层仅保留输入相关操作。
- [x] 组件目录已统一到 `settings/provider/content/cards/`，局部视图派生已抽离到 `useProviderConnectedPanel`。
- [x] `ProviderConnectionButton` 已完成配置驱动重构；`ProviderConnectedPanel` 已完成布局和交互简化。
- [x] `ProviderModelToggleButton` 已补基础 hover / active / focus 反馈，维持极简风格同时增强点击感知。
- [x] 前端分层已收口为 `types → constants → icons → store → services → hooks → components`。

**当前结构**：

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

**当前仍待完成**：

- [ ] `ProviderConnectedPanel` 相关局部 hooks 仍待继续审查与完善，主对象为 `useProviderModelActions.ts`
/ `useProviderConnectedPanel.ts`。

#### 🚧 4.4 Hooks 层审查与优化（2025-03-17 开始）

**目标**：优化 Hooks 层性能和并发安全性，对齐组件层接口契约

- [x] `useProviderStartup` — 已完成审查 ✅
- [x] `useProviderConnection` — 已完成审查与重构（2025-03-19）✅
  - [x] 移除 4 个重复 store 订阅，改用 `getState()` 直接调用
  - [x] useCallback 依赖数组精简为 `[providerId]`
  - [x] 批量更新改用 `updateProviderBatch`，减少重渲染
  - [x] 新增 `onRetry`（清错误 + 重连封装），移除 `onErrorReset`
  - [x] 返回值收口为 `{ onConnect, onDisconnect, onRetry }`
- [ ] `useProvider` — 待优化
  - [x] 已收紧为 card-level shell（不再聚合 models）
  - [x] `onReset` 已从 `form` 语义块迁移到 `connection` 语义块
  - [ ] 优化 store selector 性能
- [x] `useProviderConnectedPanel` — connected 面板视图派生已抽离，并收口为双态全选 ViewModel
- [ ] `useProviderModelActions` — 待优化（`ProviderConnectedPanel` 相关局部 hook 主审查对象）
  - [ ] 修复乐观更新并发风险（请求去重/版本号机制）
  - [ ] 优化 store selector 性能
  - [x] 消费范围已局部化，不再对齐公共 props 契约

**当前下一步主线**：

- [x] 旧 `connection` 接口审查与收口 ✅
- [x] `reset` 设计与 `ProviderCardActions` 落位
- [ ] `ProviderConnectedPanel` 相关局部 hooks 审查与完善

### Phase 5：健康检查错误精细化

- [ ] 将各 provider connection 内部的网络/认证/超时等错误纳入 `ProviderError` 体系
- [ ] reqwest 超时配置、网络不可达与业务"不在线"的区分
- [ ] 前端适配健康检查细粒度错误展示

### Phase 6：收尾与补充测试

- [ ] 根据前端适配过程中暴露的问题补充后端处理
- [ ] 补齐 `secret_meta` 前端消费闭环：展示 `has_key` / `key_source`，并为 `last4` 等脱敏元信息预留接入位
- [x] 补齐前端安全闭环：`connect` 成功后清空内存态 `apiKey`，避免明文密钥在前端长期驻留
- [ ] 补齐 `reset` 一致性：仅在 `reset_provider=true` 时清理本地状态，失败时保留现状并提示
- [ ] 收敛前后端 Provider 支持范围：当前阶段统一到 `deepseek` / `ollama`，避免 `ProviderId` 与注册表漂移
- [ ] 审计 invoke / event 暴露面，并增加前端约束，防止 Provider 直连 `fetch/axios`
- [ ] 补充 `update_models` / `reset` / `retry` 异常一致性回归，覆盖快速切换、持久化失败与重复点击场景
- [ ] 视需要补充集成测试
- [ ] `SkippedProviderDetail` 补 `::new()` 构造函数，与 `ProviderIssue` 风格统一
- [ ] `resolver.rs` — 密钥解析合并为单次，同时返回 key + meta，消除重复 I/O
- [x] `handleProviderStatus` — 收敛多次零散 `set` 为单次批量更新，减少不必要的状态引用变更与重渲染
- [ ] 前端 `errorCode` 收敛为共享联合类型（`ProviderErrorCode`），替代宽泛 `string`，支持消费侧穷举匹配
- [ ] `store.rs` — 全量读-改-写优化：评估按 provider 独立 key 存储或脏标记机制，降低 I/O 开销
- [ ] 事件名前后端契约自动化：Rust 侧事件名抽为常量模块，或引入 codegen 消除人工对齐风险
- [ ] `ProviderError` — 补 `source()` 错误链实现或引入 `thiserror`，提升调试时错误溯源能力
- [ ] `reconcile_enabled_models` — 无变更路径避免 `record.clone()`，改用 owned 传递或 `Cow` 减少堆分配
- [x] `useProviderStartup` — 启动失败时写入 `checkStore.setFailed()`，避免监听注册全部失败后 UI 无感知
- [ ] `PROVIDERS_STORE_LOCK` — 评估迁移至 Tauri `State<Mutex<T>>` 管理模式，为多窗口场景预留空间
- [ ] 生命周期功能开发完结

---

## 备注

- [ ] CRUD 链路的错误统一（含 `secrets.rs` keyring 交互）不在本路线图范围内，后续单独规划
- [ ] 各 Phase 之间非严格串行，前端适配过程中可能回头调整后端细节
