# TODO - Provider 生命周期功能审查与优化

> **创建时间**: 2024-03-07
> **预计完成**: 2024-03-08
> **状态**: 进行中

## 🎯 目标

完成 Provider 生命周期管理功能的完整审查和优化，确保前后端逻辑正确、类型安全、代码质量高。

---

## 📊 整体进度：60%

### ✅ 已完成（60%）

#### 后端 Rust (100%)

- [x] Workspace 配置重构
  - [x] 创建根目录 `Cargo.toml` 配置 workspace
  - [x] 清理重复的 `Cargo.lock` 和 `target/` 目录
  - [x] 修复 rust-analyzer 错误
- [x] 可见性收紧（80+ 处 `pub` → `pub(crate)`）
  - [x] 22 个模块声明
  - [x] 16 个 storage/service 层函数
  - [x] 5 个 Tauri 命令函数
  - [x] 2 个 provider check 函数
  - [x] 其他内部函数、trait、type
- [x] 生命周期管理逻辑优化
  - [x] `lifecycle/runner.rs` - 生命周期执行器
  - [x] `lifecycle/events.rs` - 事件发射
  - [x] `lifecycle/processor.rs` - Provider 检查处理
  - [x] `lifecycle/flow.rs` - 流程控制
  - [x] `lifecycle/failure.rs` - 错误处理
- [x] 错误处理完善
- [x] Provider 连接状态管理优化

#### 前端 TypeScript (40%)

##### types/ - 类型定义 (100%)

- [x] `contract/` 前后端契约类型
  - [x] `events.ts` - 生命周期事件 payload
  - [x] `commands.ts` - Tauri 命令参数/返回值
  - [x] `shared.ts` - 共享数据结构
  - [x] `secret.ts` - 密钥元信息
- [x] `state/` 前端状态类型
  - [x] `entity.ts` - 单个 Provider 状态
  - [x] `collection.ts` - Provider 集合状态
  - [x] `check.ts` - 生命周期阶段状态
- [x] `types/index.ts` 分组注释优化
  - [x] 按用途分组（标识/定义/命令/事件/状态/Props）
  - [x] 添加分隔注释

##### constants/ - 常量定义 (100%)

- [x] `provider/lifecycle/events.ts` - 事件名定义
- [x] `provider/lifecycle/phases.ts` - 生命周期阶段
- [x] `provider/lifecycle/delays.ts` - 状态转换延迟
- [x] 前后端事件名对齐验证（4 种事件完全一致）

##### api/ - Tauri 命令调用层 (100%)

- [x] `provider/check.ts`
  - [x] `triggerProviderStartupCheck()` - 启动时触发检查
  - [x] `triggerProviderManualRefresh()` - 手动刷新
  - [x] `checkInFlight` 去重保护
- [x] `providers.ts`
  - [x] `connectAndSaveProvider()` - 连接并保存
  - [x] `resetProvider()` - 重置 Provider
  - [x] `updateEnabledModels()` - 更新启用的模型

##### events/ - 事件监听层 (50%)

- [x] `listen.ts` - 监听注册（完美实现）
  - [x] 4 种事件全部注册
  - [x] 使用 `Promise.all` 并行注册
  - [x] 返回统一 cleanup 函数
  - [x] 类型安全（泛型约束 payload）
- [x] `handlers.ts` - 事件处理（部分审查）
  - [x] `handleStarted()` - 生命周期开始
    - [x] `clearAllTimers()` 清除旧定时器
    - [x] `setChecking()` 更新状态
  - [ ] `handleProviderStatus()` - Provider 状态推送（待审查）
  - [ ] `handleCompleted()` - 生命周期完成（待审查）
  - [ ] `handleFailed()` - 生命周期失败（待审查）
- [x] `runGuard.ts` - run_id 防护机制
  - [x] `isCurrentRun()` 防止旧事件污染
- [x] `lifecycleScheduler.ts` - 定时器管理
  - [x] `clearAllTimers()` 清除所有定时器
  - [x] `scheduleCheckingDone()` 调度 done 状态
  - [x] `scheduleCheckingDegraded()` 调度 degraded 状态
  - [x] `scheduleCheckingFailed()` 调度 failed 状态

##### store/ - 状态管理层 (30%)

- [x] `useProviderCheckStore` - 生命周期全局状态（部分审查）
  - [x] `setChecking()` - 切换到 checking 阶段
    - [x] 原子性更新所有相关字段
    - [x] 清空旧的 issues/errorCode/errorMessage
  - [ ] `setDone()` - 切换到 done 阶段（待审查）
  - [ ] `setDegraded()` - 切换到 degraded 阶段（待审查）
  - [ ] `setFailed()` - 切换到 failed 阶段（待审查）
  - [ ] `reset()` - 重置状态（待审查）
- [ ] `useProviderCollectionStore` - Provider 集合状态（待审查）

---

## 📋 待办事项（40%）

### 1. events/handlers.ts（预计 30 分钟）

- [ ] 审查 `handleProviderStatus()`（最复杂，重点审查）
  - [ ] run_id 防护逻辑
  - [ ] Provider 合法性校验
  - [ ] 表单字段更新（url 映射）
  - [ ] 卡片状态更新
  - [ ] 错误信息更新
  - [ ] 模型状态更新逻辑（已知问题）
- [ ] 审查 `handleCompleted()`（简单）
  - [ ] run_id 防护
  - [ ] 根据 failed 数量调度状态
- [ ] 审查 `handleFailed()`（中等复杂度）
  - [ ] run_id 防护
  - [ ] 调度 failed 状态
  - [ ] issues 下沉到具体 Provider

### 2. store/（预计 40 分钟）

- [ ] `useProviderCheckStore` - 剩余 4 个 action
  - [ ] `setDone()` - 清理失败信息
  - [ ] `setDegraded()` - 设置业务失败
  - [ ] `setFailed()` - 设置结构性失败
  - [ ] `reset()` - 回到初始状态
- [ ] `useProviderCollectionStore` - 完整审查
  - [ ] `createInitialById()` 初始化逻辑
  - [ ] `setProviderCardState()` - 卡片状态
  - [ ] `setProviderForm()` - 表单字段
  - [ ] `setProviderModels()` - 模型状态
  - [ ] `setModelEnabled()` - 单个模型开关
  - [ ] `setAllModelsEnabled()` - 全部模型开关
  - [ ] `setProviderError()` - 设置错误
  - [ ] `clearProviderError()` - 清空错误

### 3. hooks/（预计 30 分钟）

- [ ] `useProviderStartup.ts` - 启动初始化
  - [ ] `registerCheckListeners()` 调用
  - [ ] `triggerProviderStartupCheck()` 调用
  - [ ] cleanup 逻辑
- [ ] `useProviderConnection.ts` - 连接/断开逻辑
  - [ ] `handleConnect()` - 连接操作
  - [ ] `handleDisconnect()` - 断开操作
  - [ ] `handleErrorReset()` - 错误重置
- [ ] `useProvider.ts` - 数据聚合
  - [ ] 从 store 读取状态
  - [ ] 组装返回数据
- [ ] `useProviderModelActions.ts` - 模型管理
  - [ ] 模型开关逻辑

### 4. components/（预计 20 分钟）

- [ ] `ProviderHeader.tsx` - 顶部状态指示器
  - [ ] 5 种 phase 图标切换
  - [ ] 刷新按钮逻辑
- [ ] `BaseProvider.tsx` - Provider 卡片
  - [ ] 展开/收起逻辑
  - [ ] 数据传递
- [ ] `ProviderForm.tsx` - 表单路由
  - [ ] 按 cardState 分发表单
- [ ] `ProviderList.tsx` - 列表组件
  - [ ] 遍历渲染 ProviderItem

### 5. 修补与测试（预计 50 分钟）

- [ ] 修复已知问题
  - [ ] `handleProviderStatus` 模型列表更新逻辑
  - [ ] 其他审查中发现的问题
- [ ] 编写前端测试
  - [ ] Store 单元测试
  - [ ] Handler 单元测试
  - [ ] Hook 集成测试
- [ ] 提交 PR

---

## 🐛 已知问题

### Issue #1: handleProviderStatus 的模型更新逻辑

**位置**: `apps/ui/src/features/bot/events/provider/handlers.ts:68-78`

**问题描述**:

1. 健康检查失败时，模型列表没有清空（前端仍显示旧模型）
2. `success: true` 但 `available_models: []` 时不会更新（空数组被忽略）

**当前代码**:

```typescript
if (health.success && health.available_models.length > 0) {
  // 只在成功且有模型时更新
  store.setProviderModels(provider, {
    available: health.available_models,
    enabled,
  });
}
// 失败时不做任何处理 ← 问题
```

**建议修复**:

```typescript
if (health.success) {
  // 允许空数组
  const enabledSet = new Set(config.enabled_models);
  const enabled: Record<string, boolean> = {};
  for (const model of health.available_models) {
    enabled[model] = enabledSet.has(model);
  }
  store.setProviderModels(provider, {
    available: health.available_models,
    enabled,
  });
} else {
  // 失败时清空模型列表
  store.setProviderModels(provider, {
    available: [],
    enabled: {},
  });
}
```

**影响范围**: 中等
**优先级**: P1（需要修复）

---

## 📝 审查笔记

### 架构亮点

- ✅ **前后端类型契约完美对齐**
  - 4 种事件 payload 结构完全一致
  - 使用 TypeScript 泛型约束类型安全
- ✅ **事件驱动架构清晰**
  - 后端 emit → 前端 listen → handler → store
  - 单向数据流，职责分明
- ✅ **状态管理设计优雅**
  - Zustand 响应式订阅
  - Store 是单一数据源
  - 原子性状态更新
- ✅ **职责分离明确**
  - `api/` - 主动调用后端
  - `events/` - 被动接收推送
  - `store/` - 状态管理
  - `hooks/` - 业务逻辑封装
  - `components/` - UI 渲染

### 学习收获

#### React Hooks 规则

- Hooks 只能在 React 组件或自定义 Hook 中调用
- 事件回调是普通函数，不能调用 Hooks
- `useStore.getState()` 用于非响应式访问（在普通函数中）

#### 架构理解

- `handlers` 是 `events/` 的子集，不与 `hooks/` 平级
- 类型分层：`contract/`（前后端契约）vs `state/`（前端状态）
- 数据流：后端 → events → store → hooks → components

#### 状态管理

- Handler 更新 Store（非响应式，只调用 action）
- 组件订阅 Store（响应式，自动重新渲染）
- Store 状态变化 → 订阅的组件自动更新

#### 防御机制

- `runGuard` - 防止旧事件污染当前状态
- `clearAllTimers` - 防止旧定时器干扰新状态
- `checkInFlight` - 防止并发触发多轮检查

---

## 🎯 下一步行动

1. 继续审查 `handlers.ts` 剩余 3 个 handler
2. 审查 `store/` 两个 Store
3. 审查 `hooks/` 四个 Hook
4. 快速过一遍 `components/`
5. 统一修补已知问题
6. 编写简单测试
7. 提交 PR

---

## ⏱️ 时间记录

- **2024-03-07 14:00-17:00**: 后端优化 + 前端审查（3 小时，完成 60%）
  - 后端 Workspace 配置
  - 后端可见性收紧
  - 前端类型系统审查
  - 前端事件监听层审查
- **2024-03-07 19:00-21:00**: 预计完成剩余 40%（2 小时）

---

## 💡 备注

- 本文档用于短期任务跟踪，完成后将内容归档到 `CHANGELOG.md` 并删除
- 新 session 可直接读取此文档快速了解进度
- 配合 `ROADMAP.md` 使用（中长期规划）
