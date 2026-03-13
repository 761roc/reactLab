# React Feature Lab - Agent Instructions

## 1) 项目目的

这是一个用于学习与调试前端生态的 **功能实验场**。  
目标是把不同类型能力（组件库 / CSS 库 / 状态库）拆成可独立访问的页面，便于逐块学习、验证和扩展。

关键诉求：
- 每个功能可单独查看、学习、调试。
- 新增功能不影响已有功能。
- 新功能接入成本低（尽量只新增，不改旧功能）。
- 通过统一导航切换功能模块。

---

## 2) 架构规则（必须遵守）

### 2.1 单根规则
- 只使用一个根节点：`#root`。
- 禁止新增 `#root1 / #root2 / ...` 多根挂载方案。

### 2.2 壳层职责
- `AppShell` 只负责：导航、路由、布局。
- 壳层禁止放业务状态 Provider（Redux/MobX/Zustand 等）。

### 2.3 Feature 隔离
- 每个功能是独立模块，路径：`src/features/<feature-name>/`。
- 功能间禁止互相 import 内部实现。
- 允许共享：`src/common/ui`、`src/common/utils`（若存在）。

### 2.4 Provider 局部化
- Provider 只能在该 feature 内注入（通过 `withProviders`）。
- 不允许把某个状态库 Provider 提升到全局包裹。

### 2.5 注册表驱动
- 所有功能统一在 `src/core/feature-registry.ts` 注册。
- 新增功能时，目标是“新增模块 + 注册一条”，避免改动旧功能代码。

### 2.6 懒加载
- 每个 feature 页面必须使用 `lazy(() => import(...))`。
- 避免功能初始化互相牵连。

---

## 3) 当前代码约定

核心接口：
- `src/core/feature-types.ts` 中 `FeatureModule`
  - `id`
  - `title`
  - `routePath`
  - `tags`
  - `description`
  - `EntryComponent`
  - `withProviders?: (node) => node`

核心流程：
- `FeatureHost` 根据路由参数读取 feature。
- 渲染 `EntryComponent`。
- 若有 `withProviders`，仅在该 feature 页面局部包裹。

---

## 4) Demo 内容规则（新增/扩展演示时）

### 4.1 分块展示规范
- 每个 demo 页面用多个 `SectionCard` 分块。
- 每块标题必须明确“此处用意”。
- 每块应具备可独立调试价值（不是纯文案）。

### 4.2 状态库 Demo 规范（Redux/MobX/...）
- 至少包含：
  1. 基础计数/基础状态块
  2. 列表与过滤块
  3. 偏好设置块
  4. 多 slice（或多 store）联合读取与联合操作块
- 联合块必须在**同一组件**中同时读取多个状态域并执行多动作流程。

### 4.3 Tailwind/CSS Demo 规范
- 演示复杂 utility 组合（响应式、状态样式、复杂布局、伪元素/任意值等）。
- 通过 CSS Modules 证明 feature 级样式隔离。

---

## 5) 新增一个 Feature 的标准步骤

1. 新建目录：`src/features/<feature-name>/`
2. 新建页面组件：`<FeatureName>Page.tsx`
3. 若需要上下文注入，新增 `<FeatureName>Providers.tsx`
4. 新建入口：`index.tsx`
   - `lazy(import(...))`
   - 导出 `FeatureModule`
   - 需要时实现 `withProviders`
5. 在 `src/core/feature-registry.ts` 注册新 feature
6. 执行 `yarn build`，必须通过

---

## 6) 验收标准（每次改动后）

- `yarn build` 通过，无 TS 报错。
- 导航可切换到目标功能页。
- 新功能不会破坏已有功能页。
- 状态库 Provider 作用域仅限目标 feature。
- 样式不污染其他 feature（优先 CSS Modules）。

---

## 7) 当前已实现功能（用于后续会话快速对齐）

- Tailwind Demo：复杂样式分块演示。
- Redux Demo：多 slice 分块演示 + 同组件多 slice 联合使用。
- MobX Demo：多 store 分块演示 + 同组件多 store 联合使用。
- Zustand Demo：多状态分区分块演示 + 同组件联合状态读取与组合操作。

后续新增功能时，遵循相同模式，保持低耦合和可扩展性。
