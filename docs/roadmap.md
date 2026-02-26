# Provider 生命周期开发路线图

## 后端架构概览

LLM Provider 后端分为两条主线：

1. **生命周期链路**：启动/手动触发 → 持久化读取 → 并发健康检查 → 事件推送前端
2. **CRUD 链路**：Provider 配置的增删改查（connect / reset / update_models）

两条链路共享 `ProviderError` 错误体系和 `store` 持久化层。

---

## 开发阶段

### ✅ Phase 1：生命周期错误类型统一

将生命周期各环节的错误收敛到 `ProviderError` 枚举，每个 variant 对应明确的错误语义：

- [x] `Io` / `Serde` — 持久化读写
- [x] `UnsupportedProvider` — 未注册的 provider
- [x] `LifecycleEventEmit` — 事件推送失败
- [x] `LifecycleTaskJoin` — 并发任务异常（panic/cancel）
- [x] `LifecyclePartialFailure` — 生命周期终态汇总

### ✅ Phase 2：错误 code 与 message 统一管理

- [x] 将 `code()` 返回值从方法内 match 提升为独立 `ProviderErrorCode` 枚举，全链路类型安全
- [x] 简化消费侧调用模式（`report_lifecycle_failure` 直接接收 `&ProviderError`）
- [x] 统一 message 格式规范（去除类型前缀，message 只保留纯描述，与 code 职责分离）

### Phase 3：生命周期单元测试

- [ ] 覆盖 `runner` 并发调度的关键场景（全部成功、部分失败、JoinError）
- [ ] 覆盖 `flow` 编排的分支路径（空 provider、emit 失败、partial failure）
- [ ] 覆盖 `processor` 的 reconcile 逻辑

### Phase 4：前端生命周期适配

- [ ] 基于已有的事件体系（started / provider_status / completed / failed）搭建前端状态管理框架
- [ ] Settings 面板的 Provider 状态渲染与交互设计
- [ ] 基于 `code` 的差异化错误展示

### Phase 5：健康检查错误精细化

- [ ] 将各 provider connection 内部的网络/认证/超时等错误纳入 `ProviderError` 体系
- [ ] reqwest 超时配置、网络不可达与业务"不在线"的区分
- [ ] 前端适配健康检查细粒度错误展示

### Phase 6：收尾与补充测试

- [ ] 根据前端适配过程中暴露的问题补充后端处理
- [ ] 视需要补充集成测试
- [ ] 生命周期功能开发完结

---

## 备注

- [ ] CRUD 链路的错误统一（含 `secrets.rs` keyring 交互）不在本路线图范围内，后续单独规划
- [ ] 各 Phase 之间非严格串行，前端适配过程中可能回头调整后端细节
