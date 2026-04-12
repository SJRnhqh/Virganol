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
- [ ] `connect_and_save` 返回专用 `ConnectResponse`（含 `enabled_models`），不复用 `HealthCheckResponse`
- [ ] 前端form清空完整性：connect成功后清空apiKey与apiURL，确保form生命周期与store数据同步

#### 5.2 reset 链路

- [x] `reset_provider_config` 审查（config + key 原子性删除 / 回滚逻辑）
- [x] API迁移：resetProvider 迁至 crud.ts（目前保持boolean返回）
- [ ] `resetProvider` 返回结构化响应（{ success, error? }），对齐 connectAndSaveProvider 契约（待 Phase 6.2）
- [x] 前端钩子层审查（success检查 + batch状态更新 + 错误日志占位）
- [x] 前端store/types/constants完整性验证（无需优化）
- [ ] 前端组件层审查与美化（ProviderResetButton / ProviderCardActions 交互流程）

#### 5.3 update_models 链路

- [x] `update_provider_enabled_models` 审查（invoke 契约 / store 读写）
- [ ] 前端调用链审查（并发互斥 / `pendingRef` 锁 / 结果反馈）
- [ ] 组件 / 类型 / 常量配套

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
- [ ] 超时配置化（5s 硬编码改为可配置）
- [ ] Provider 级别锁优化（per-provider 串行化 connect）
- [ ] 持久化层缓存优化（`ProvidersStore` cache）
- [ ] `persistence.rs` 键生成策略统一（`save_provider` 使用 `to_string()`，`remove_provider` / `update_models` 使用 `as_str()`，存在不一致风险）

#### 6.4 收尾与验证

- [ ] 安全审计（`secret_meta` 前端消费 / Provider 支持范围收敛 / invoke 暴露面审计）
- [ ] 生命周期收口（orphan failed 认领 / 事件名契约自动化）
- [ ] 集成测试补充
- [ ] 功能开发完结

---

## 备注

- Phase 5-6 非严格串行，前端适配过程中可能回头调整后端细节
- 错误精细化与日志统一化为全局性改造，需等 CRUD 三条链路审查完成后统一推进
