# LLM Provider 配置接入路线图

## 架构概览

LLM Provider 接入分为两条主线：

1. **生命周期链路**：启动/手动触发 → 持久化读取 → 并发健康检查 → 事件推送前端
2. **CRUD 链路**：Provider 配置的增删改查（connect / reset / update_models）

两条链路共享 `ProviderError` 错误体系和 `store` 持久化层。

---

## 开发阶段

### ✅ Phase 1-4：生命周期链路 + 前端基础设施

**已完成**：

- 后端错误体系（`ProviderError` / `ProviderErrorCode`）
- 前端状态管理（store / events / hooks）
- 生命周期 phase 建模（idle / checking / done / degraded / failed）
- UI 组件层（per-provider 卡片 + 交互逻辑）

### 🚧 Phase 5：CRUD 链路审查与重构

#### 5.1 connect 链路

- [x] `connect_and_save` 主流程审查（密钥解析 / 健康检查 / 持久化事务 / enabled_models 计算）
- [x] 健康检查子系统审查（registry / driver / deepseek / ollama 实现）
- [x] 代码质量优化（删除冗余 trim / 简化错误提示）
- [x] 前端调用链审查（hooks 层冗余清理 / payload 简化 / 状态回写对称性）
- [x] 组件审查完整性（ProviderCardHeader / ProviderForm / ProviderCardContent / ProviderConnectionButton / ProviderCardActions）
- [x] 常量驱动设计验证（CONNECTION_STATE_LABELS / CONNECTION_BUTTON_ICONS / CONNECTION_BUTTON_ANIMATIONS）
- [x] 类型安全检查（ConnectAndSaveProviderPayload / HealthCheckResponse 契约）
- [x] 图标语义完整（connect/connecting/retry/reset 各状态icon映射）

#### 5.2 reset 链路

- [x] `reset_provider_config` 审查（config + key 原子性删除 / 回滚逻辑）
- [x] API迁移：resetProvider 迁至 crud.ts（目前保持boolean返回）
- [x] 前端钩子层审查（success检查 + batch状态更新 + 错误日志占位）
- [x] 前端钩子重构：useProviderReset 提取至 hooks/provider/manager/ 目录
- [x] 前端store/types/constants完整性验证（无需优化）
- [x] 前端组件层重构与美化：
  - [x] ProviderResetButton 独立组件（文字 + Eraser 图标，类型约束）
  - [x] ProviderConnectedPanel 配置管理区域集成 Reset 按钮
  - [x] ProviderCardActions CONNECTED 状态移除 Reset（职责分离）

#### 5.3 update_models 链路

- [x] `update_provider_enabled_models` 审查（invoke 契约 / store 读写）
- [x] API迁移：updateEnabledModels 迁至 crud.ts（目前保持boolean返回）
- [x] 后端持久化层重构：persistence.rs 迁移至 store/ 目录（load/save/remove/update/lock 模块化管理）
- [x] 后端日志优化：persistence 层 warn + service 层 info/error 分层记录
- [x] 前端 Hooks 层重构：useToggleModels 提取至 hooks/provider/manager/ 目录
- [x] 前端数据与动作分离：data/（响应式订阅）vs manager/（执行时快照）
- [x] 目录结构优化：useProviderModels 迁移至 hooks/provider/data/ 目录
- [x] Toggle 语义统一：toggleSingle / toggleAll 命名与实现对齐
- [x] Store 层审查：setModelEnabled / setAllModelsEnabled 方法验证完成
- [x] Types 层审查：ProviderModelState 类型完整且清晰
- [x] 命名语义对齐：toggle（前端交互）vs update（后端数据）职责分离

#### 5.4 CRUD 链路查漏补缺

**功能正确性**：

- [ ] `useToggleModels` - 添加 pendingRef 锁超时机制（防止 API 卡住导致界面永久锁定）
- [x] `useProviderConnect` - 添加 pending state guard（防止并发操作）

**代码质量优化**：

- [ ] `useProvider` - 补全 onUpdate callback 依赖数组（避免闭包过期）
- [ ] `useProviderCollectionStore` - 添加状态转换验证（updateProviderBatch 防御性编程）
- [ ] Check service - 添加运行时检查防止多次启动调用（资源优化）

**后端优化**：

- [x] 提取 key rollback 逻辑为独立函数（提高可测试性）
- [ ] reset 链路添加重试机制和详细状态（提高可靠性）
- [ ] 持久化层添加缓存（减少 I/O 读写放大）
- [ ] 健康检查超时配置化（5s 硬编码改为可配置）

**契约升级**：

- [x] `connect_and_save` 返回专用 `ConnectAndSaveProviderResponse`（含 enabled_models）
- [x] `HealthCheckResponse` 职责收窄至健康检查结果（仅内部使用）
- [x] 后端契约结构重构：创建 `contract/connect.rs` 管理前后端契约
- [x] 前端契约结构重构：创建 `contract/connect.ts` 镜像后端结构
- [x] 前端启用模型状态：使用后端 `enabledModels` 替代硬编码 false
- [x] `resetProvider` 返回结构化响应（{ success, error? }），对齐 connectAndSaveProvider 契约
- [ ] `updateEnabledModels` 返回结构化响应（{ success, error? }），对齐 connectAndSaveProvider 契约

### 🚧 Phase 6：全局优化与收尾

#### 6.1 契约语义与错误精细化

- [ ] 健康检查错误细分（网络不可达 / 认证失败 / 超时 / 响应格式错误）
- [ ] 扩展 `HealthCheckResponse` 添加 `error_code` 字段
- [ ] 前端适配细粒度错误展示
- [ ] 区分系统错误（io/serde）与业务错误

#### 6.2 日志与中间件统一化

- [ ] 后端日志格式标准化（级别 / 结构 / 上下文）
- [ ] 前端错误边界与中间件设计
- [ ] 日志采集与监控接入点规划

#### 6.3 性能优化

- [ ] HTTP 客户端连接池复用（`OnceLock<Client>`）
- [ ] Provider 级别锁优化（per-provider 串行化 connect）
- [ ] 持久化层缓存优化（`ProvidersStore` cache）

#### 6.4 收尾与验证

- [ ] 表单输入验证（`ProviderForm` 添加实时验证：URL 格式检查 / 必填字段提示 / 错误状态视觉反馈，提升用户输入体验）
- [ ] 请求取消机制（添加 AbortController 在组件卸载时取消飞行中的 API 请求，防止内存泄漏警告）
- [ ] 安全审计（`secret_meta` 前端消费 / Provider 支持范围收敛 / invoke 暴露面审计）
- [ ] 生命周期收口（orphan failed 认领 / 事件名契约自动化）
- [ ] 集成测试补充
- [ ] 功能开发完结
