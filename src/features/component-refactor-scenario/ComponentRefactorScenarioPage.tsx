import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { scenarioTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Scenario', value: 'Hard To Maintain', detail: '一个页面组件几百上千行，状态、请求、样式、权限判断和弹窗逻辑全混在一起。' },
  { label: 'Focus', value: 'Split By Change', detail: '重构的核心不是“拆文件”，而是按变化点和职责边界重新组织。' },
  { label: 'Goal', value: 'Readable + Safe', detail: '既要可读，也要能平滑迁移，不能一把梭推翻重写。' },
] as const;

const definitions = [
  { title: '难维护通常是职责混在一起', detail: '数据获取、展示、表单、弹窗、副作用、权限判断、埋点都塞进一个组件时，任何改动都容易牵一发动全身。' },
  { title: '重构不等于重写', detail: '更稳妥的做法通常是边拆边保留行为一致，先建立边界，再逐步迁移。' },
  { title: '最先拆的不是文件名，而是变化频率和职责', detail: '哪些逻辑经常一起改，哪些状态天然属于一组，哪些 UI 可以独立复用，这些比行数更重要。' },
  { title: '容器与展示分层依然很实用', detail: '尤其当一个组件同时承担请求、状态编排和展示时，先把数据层和 UI 层拆开收益很高。' },
  { title: '自定义 Hook 很适合抽离副作用和状态编排', detail: '请求、订阅、表单草稿、分页筛选这些逻辑都很适合抽成 Hook。' },
  { title: '重构要配合回归保护', detail: '没有测试、截图对比或关键路径验证，重构很容易把旧行为悄悄改坏。' },
] as const;

const relations = [
  { title: '职责识别', detail: '先识别数据、交互、展示和副作用边界。', signal: 'Boundary' },
  { title: '状态抽离', detail: '把强耦合状态组放进 hook 或局部 store。', signal: 'State Model' },
  { title: 'UI 拆分', detail: '按展示块拆成更小组件，而不是只按文件长度切。', signal: 'Composition' },
  { title: '渐进迁移', detail: '一步步挪，保证行为可回归。', signal: 'Safe Migration' },
] as const;

const relationCode = `难维护组件
-> 识别职责和变化点
-> 抽离数据/副作用
-> 拆展示块
-> 收敛 props 和状态
-> 用测试或关键路径验证迁移`;

const basics = [
  {
    title: '问题 1：怎么判断一个组件该重构了？',
    answer: '常见信号是文件过大、状态太多、props 过长、改一处容易影响别处、很难测试、很难复用，以及新同学很难快速看懂。',
    explanation: '这题最好回答成一组“维护成本信号”，而不是只说“代码太长”。',
    code: `type DashboardProps = {
  user: User;
  teams: Team[];
  filters: Filters;
  permissions: PermissionMap;
  onExport: () => void;
  onShare: () => void;
  onRefresh: () => void;
  // ... 继续往下堆
};`,
    codeTitle: 'Props Explosion Signal',
  },
  {
    title: '问题 2：第一步应该拆什么？',
    answer: '先拆高频变化点和明显混杂的职责，比如把请求与数据编排从展示层拿出来，把弹窗状态、筛选逻辑和副作用抽成 hook。',
    explanation: '不要一上来先改 CSS 或随便拆几个子组件，先处理最混乱的边界。',
    code: `function OrdersPageContainer() {
  const orders = useOrdersQuery();
  const filters = useOrderFilters();

  return (
    <OrdersPageView
      rows={orders.data ?? []}
      filters={filters.state}
      onFilterChange={filters.setState}
    />
  );
}`,
    codeTitle: 'Container First',
  },
  {
    title: '问题 3：自定义 Hook 什么时候最适合抽？',
    answer: '当某组状态和副作用总是一起出现，比如分页 + 搜索 + 排序、弹窗开关 + 表单草稿、订阅 + 清理逻辑，这时抽 Hook 很合适。',
    explanation: 'Hook 的重点不是省代码，而是把状态模型收拢。',
    code: `function useOrderFilters() {
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState<'all' | 'pending' | 'done'>('all');
  const deferredKeyword = useDeferredValue(keyword);

  return {
    state: { keyword, status, deferredKeyword },
    setKeyword,
    setStatus,
  };
}`,
    codeTitle: 'Extract State Model',
  },
  {
    title: '问题 4：UI 拆分时怎么避免“拆得更乱”？',
    answer: '按语义块和数据依赖拆，比如 header、filter bar、table、detail panel，而不是机械地把一个 JSX 段落就单独拆一个文件。',
    explanation: '组件拆分不是越多越好，关键是让职责更清晰、依赖更稳定。',
    code: `return (
  <>
    <OrdersHeader />
    <OrdersFilterBar />
    <OrdersTable />
    <OrderDetailPanel />
  </>
);`,
    codeTitle: 'Semantic Slice',
  },
] as const;

const practical = [
  {
    title: '问题 5：什么时候要引入状态机、reducer 或局部 store？',
    answer: '当状态切换规则明显、动作较多、多个区域要共享同一组状态时，`useReducer` 或局部 store 会比一堆散落的 `useState` 更稳。',
    explanation: '不是状态一多就上 store，而是看状态关系是否复杂。',
    code: `type Action =
  | { type: 'open-editor'; payload: Order }
  | { type: 'close-editor' }
  | { type: 'save-start' }
  | { type: 'save-success' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'open-editor':
      return { ...state, current: action.payload, editorOpen: true };
    case 'close-editor':
      return { ...state, editorOpen: false };
    default:
      return state;
  }
}`,
    codeTitle: 'Reducer For State Transitions',
  },
  {
    title: '问题 6：重构时怎样避免一次性风险太大？',
    answer: '保留旧入口，先把一部分逻辑迁到新 hook 或新 view，再逐块切换；配合测试、截图对比和埋点观察回归。',
    explanation: '这题要体现“渐进式迁移”意识，而不是推倒重写。',
    code: `function OrdersPage() {
  const useNewFlow = useFeatureFlag('orders-page-refactor');

  return useNewFlow ? <OrdersPageRefactored /> : <OrdersPageLegacy />;
}`,
    codeTitle: 'Gradual Migration',
  },
  {
    title: '问题 7：如何向团队解释这次重构是值得的？',
    answer: '用具体痛点说服，比如迭代成本高、缺陷率高、代码评审困难、重复逻辑多、很难测试，而不是笼统说“代码看着不舒服”。',
    explanation: '重构要能对齐业务价值和维护价值。',
    code: `重构目标
-> 降低改动牵连范围
-> 提升测试覆盖能力
-> 减少重复逻辑
-> 让新增需求更容易落地`,
    codeTitle: 'Refactor Goals',
  },
  {
    title: '问题 8：面试里怎么总结？',
    answer: '先识别职责和变化点，再抽状态与副作用，再按语义拆 UI，最后用渐进迁移和测试保证安全。',
    explanation: '这句很适合收尾，也能体现你不是只会“拆组件”三个字。',
    code: `职责识别 -> 状态抽离 -> UI 组合 -> 渐进迁移 -> 回归验证`,
    codeTitle: 'Refactor Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：找最痛的变化点', detail: '哪些逻辑经常一起改、最容易出错。' },
  { title: '第二步：拆数据、副作用和展示边界', detail: '先把职责拆清，而不是先拆文件。' },
  { title: '第三步：收敛状态模型', detail: '把散落状态合并成 hook、reducer 或局部 store。' },
  { title: '第四步：渐进迁移并做回归保护', detail: '确保重构不会把旧行为静悄悄改坏。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把重构理解成重写', detail: '全量重写风险太高，也不利于平滑上线。', points: ['渐进迁移', '保留旧行为', '逐步验证'] },
  { title: '高频误区 2：只拆 UI，不拆状态和副作用', detail: '这样只是把复杂度切成多份，并没有真正降低。', points: ['状态模型', '副作用边界', '容器与展示分层'] },
  { title: '高频误区 3：机械按行数拆文件', detail: '没有语义和职责边界的拆分，后续会更难找逻辑。', points: ['按职责拆', '按变化点拆', '按依赖拆'] },
  { title: '高频误区 4：重构后不做回归保护', detail: '没有测试和观察，风险会非常高。', points: ['测试', 'feature flag', '截图或埋点对比'] },
] as const;

const rules = [
  { title: '先拆职责，再拆文件', detail: '文件拆分只是结果，不是目标。' },
  { title: '状态和副作用优先抽离', detail: '这通常是复杂度最高的部分。' },
  { title: 'UI 按语义块组合', detail: '避免拆成一堆没有边界的小碎片。' },
  { title: '重构要可回归、可灰度', detail: '安全比速度更重要。' },
] as const;

export default function ComponentRefactorScenarioPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Scenario / Refactor"
      title="一个组件越来越难维护，怎么重构"
      lead="这类题真正考的是结构化重构能力。你要能说清楚组件为什么难维护、该先拆哪一层、怎么避免拆得更乱，以及怎样在不推翻现网行为的前提下逐步迁移。"
      heroCards={heroCards}
      definitionsTitle="块 1：场景定义（先看组件为什么会失控）"
      definitionsNote="用意：先把职责混杂、状态散落和迁移风险分开看。"
      definitions={definitions}
      relationsTitle="块 2：重构主线速览"
      relationsNote="用意：把职责识别、状态抽离、UI 拆分和渐进迁移串成流程。"
      relations={relations}
      relationCodeTitle="Refactor Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础判断问题', note: '用意：先把该不该重构、先拆什么讲清。', label: 'Refactor Diagnosis', questions: basics },
        { title: '块 4：实战迁移问题', note: '用意：再把 reducer、迁移策略和说服方式补全。', label: 'Migration Strategy', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：场景题和真实重构都能按这条线展开。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把重构题答成“拆组件”口号。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆重构的稳定主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={scenarioTheme}
    />
  );
}
