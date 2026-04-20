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

### ✅ Phase 5：CRUD 链路审查与重构

**已完成**：

- connect 链路：主流程审查、健康检查子系统、前端调用链优化、组件完整性验证
- reset 链路：原子性删除、API 迁移、前端钩子重构、组件层美化
- update_models 链路：持久化层重构、日志优化、Hooks 层重构、语义对齐
- 查漏补缺：并发控制、原子写入、回滚逻辑、契约升级

**遗留项**（已迁移至 Phase 6.3）：

- Provider 级别锁优化（per-provider 串行化 connect，提高并发性能）

### 🚧 Phase 6：全局优化与收尾

#### 6.1 契约语义与错误精细化

- [ ] 健康检查错误细分（网络不可达 / 认证失败 / 超时 / 响应格式错误）
- [ ] 扩展 `HealthCheckResponse` 添加 `error_code` 字段
- [ ] 前端适配细粒度错误展示
- [ ] 区分系统错误（io/serde）与业务错误
- [ ] 契约序列化命名统一 camelCase（`HealthCheckResponse` / `ProviderRecord` / `ProviderStatusPayload` 补齐 serde rename，前端 types 同步）
- [ ] `ProviderError` 错误链可追溯化（改用 `thiserror` 派生 `Display` / `Error` / `From`，修复 `source()` 空实现导致的 `serde_json::Error` 底层信息无法透出，为 Phase 6.2 日志链完整打印打基础）

#### 6.2 日志与中间件统一化

- [ ] 后端日志格式标准化（级别 / 结构 / 上下文）
- [ ] 前端错误边界与中间件设计
- [ ] 日志采集与监控接入点规划
- [ ] 前端 CRUD 操作日志优化（仅记录超过阈值的慢操作，减少日志噪音）

#### 6.3 收尾与验证

- [ ] `useProviderCollectionStore` - 添加状态转换验证（updateProviderBatch 防御性编程）
- [ ] 表单输入验证（`ProviderForm` 添加实时验证：URL 格式检查 / 必填字段提示 / 错误状态视觉反馈，提升用户输入体验）
- [ ] 请求取消机制（添加 AbortController 在组件卸载时取消飞行中的 API 请求，防止内存泄漏警告）
- [ ] 安全审计（`secret_meta` 前端消费 / Provider 支持范围收敛 / invoke 暴露面审计）
- [ ] 生命周期收口（orphan failed 认领 / 事件名契约自动化）
- [ ] 前端并发锁架构对齐：`useToggleModels` 从 hook 实例级 `useRef` 迁至 store 层 `isPending`（对齐 `useProviderConnect` 模式，消除架构不对称）
- [ ] 后端异步执行架构对齐：Tauri commands 中的同步持久化调用（`reset_provider` / `update_enabled_models` 等）用 `tokio::task::spawn_blocking` 包裹，避免阻塞 tokio worker 线程（当前低频场景不会触发，为后台任务 / WebSocket 等 async 入口引入后预防 runtime 饥饿）
- [ ] 后端锁实现升级：`store/lock.rs` 从 `std::sync::Mutex` 迁至 `parking_lot::Mutex` 或 Tauri `State<Mutex<T>>` 管理（消除 poisoning 风险 + 提速 + 提升可测试性）
- [ ] 后端锁粒度细化：全局 `PROVIDERS_STORE_LOCK` 替换为 per-provider 锁（跨 provider 的 CRUD 可真并行，提高并发吞吐）
- [ ] 集成测试补充
- [ ] 功能开发完结
