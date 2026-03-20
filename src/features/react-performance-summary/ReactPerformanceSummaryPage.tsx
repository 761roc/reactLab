import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { reactInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Performance', value: 'User Cost', detail: 'React 性能题的本质是减少不必要的工作，而不是无脑套一堆优化 API。' },
  { label: 'Focus', value: 'Less Work', detail: '少渲染、少计算、少传输、少阻塞，比“更快渲染”更接近真实解法。' },
  { label: 'Tools', value: 'memo / split / virtualize', detail: 'memo、组件拆分、列表虚拟化是高频三件套，但各有边界。' },
] as const;

const definitions = [
  { title: 'React 性能优化不是只看 useMemo', detail: '父组件边界、状态作用域、列表节点数、请求时机、重组件懒加载都很关键。' },
  { title: 'React.memo 用来跳过 props 没变时的子组件重渲染', detail: '但前提是 props 本身稳定，且这个跳过真的有收益。' },
  { title: '组件拆分可以缩小更新影响范围', detail: '把高频更新区域和低频区域拆开，常常比单纯加 memo 更有效。' },
  { title: '虚拟列表适合节点数量非常大的场景', detail: '核心是只渲染可见区域，而不是让单个节点变快。' },
  { title: '性能优化要先定位瓶颈', detail: 'React Profiler、Performance 面板、网络瀑布图和实际交互指标都很重要。' },
  { title: '中高级 React 面试更看取舍', detail: '什么时候用 memo，什么时候拆状态，什么时候上虚拟列表，才是真正的重点。' },
] as const;

const relations = [
  { title: 'State Scope', detail: '状态离谁近，决定更新影响面。', signal: 'Update Radius' },
  { title: 'React.memo', detail: '跳过 props 未变的子组件渲染。', signal: 'Skip Work' },
  { title: 'Split Components', detail: '把高频变化区和低频稳定区切开。', signal: 'Boundary' },
  { title: 'Virtual List', detail: '只渲染视口附近节点。', signal: 'Reduce Nodes' },
] as const;

const relationCode = `性能问题
-> 先量瓶颈
-> 缩小状态影响范围
-> 稳定 props 引用
-> 需要时再上 memo
-> 大列表再上虚拟化`;

const basics = [
  {
    title: '问题 1：React 性能优化第一步是什么？',
    answer: '第一步不是加 memo，而是先定位瓶颈：到底是频繁重渲染、列表节点过多、计算太重、还是网络与资源加载拖慢了体验。',
    explanation: '这类题最忌讳“工具先行”。',
    code: `// 先看 React Profiler
// 再看 Performance 面板
// 再看网络与资源加载`,
    codeTitle: 'Measure First',
  },
  {
    title: '问题 2：React.memo 什么时候有价值？',
    answer: '当子组件本身渲染代价不小，而且它经常收到相同 props 时，React.memo 才更有价值。',
    explanation: '如果 props 每次都变，或者子组件本来很轻，收益可能很有限。',
    code: `const UserCard = memo(function UserCard({ user, onOpen }: Props) {
  return <article>{user.name}</article>;
});`,
    codeTitle: 'Memoized Child',
  },
  {
    title: '问题 3：为什么很多时候“拆组件”比“加 memo”更有用？',
    answer: '因为拆组件能直接缩小状态更新的影响范围，让高频变化只波及局部，而不是整块 UI 都跟着重跑。',
    explanation: '这是中高级 React 性能题里很常见的答案方向。',
    code: `function Dashboard() {
  return (
    <>
      <RealtimeCounter />
      <StaticSummary />
      <HeavyChartPanel />
    </>
  );
}`,
    codeTitle: 'Shrink Update Radius',
  },
  {
    title: '问题 4：虚拟列表解决什么问题？',
    answer: '它解决的是大列表 DOM 节点过多导致的渲染、布局和滚动成本问题，通过只渲染可见区域附近的节点来减负。',
    explanation: '这题最好顺手补一句：它不自动解决搜索重算和单行过重问题。',
    code: `const visibleRows = rows.slice(startIndex, endIndex);

return visibleRows.map((row) => <Row key={row.id} row={row} />);`,
    codeTitle: 'Render Only Visible Rows',
  },
] as const;

const practical = [
  {
    title: '问题 5：为什么 React.memo 常常配合 useCallback / useMemo？',
    answer: '因为子组件即使 memo 了，如果传进去的对象、数组、函数每次都是新引用，它仍然可能重渲染。',
    explanation: '这是 React 性能优化题里很经典的一组组合关系。',
    code: `const columns = useMemo(() => buildColumns(locale), [locale]);
const handleOpen = useCallback((id: string) => setOpenId(id), []);`,
    codeTitle: 'Stabilize Props for Memo',
  },
  {
    title: '问题 6：什么时候不建议先上 memo？',
    answer: '当瓶颈不在渲染、子组件很轻、props 本来就频繁变化，或者真正问题是状态作用域过大时，先加 memo 往往不是最优解。',
    explanation: '这题最能体现取舍意识。',
    code: `// 如果父组件每次都传新对象
<List filters={{ status, keyword }} />

// 先处理 props 稳定性和状态边界，可能比直接 memo 更值。`,
    codeTitle: 'Memo Is Not First Reflex',
  },
  {
    title: '问题 7：大页面的 React 性能优化还会补哪些点？',
    answer: '常见还会做路由级拆包、重组件懒加载、搜索防抖、deferred value、请求缓存和骨架屏，把渲染优化和工程优化结合起来。',
    explanation: '这能体现你知道 React 性能不是只在组件层解决。',
    code: `const RichEditor = lazy(() => import('./RichEditor'));
const deferredKeyword = useDeferredValue(keyword);`,
    codeTitle: 'Combine UI and Loading Optimization',
  },
  {
    title: '问题 8：面试里怎么总结 React 性能优化？',
    answer: '先量瓶颈，再缩小状态影响面，再稳定 props，再按收益使用 memo，最后在大列表场景用虚拟化和工程优化补齐。',
    explanation: '这是一条很完整也很实用的主线。',
    code: `measure -> split state -> stabilize props -> memo -> virtualize`,
    codeTitle: 'Performance Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先量瓶颈位置', detail: '确认是渲染、计算、节点数还是资源加载。' },
  { title: '第二步：缩小状态影响范围', detail: '从架构上减少无关组件更新。' },
  { title: '第三步：稳定 props 引用', detail: '给 memo 创造真正生效的条件。' },
  { title: '第四步：大列表再用虚拟化和懒加载', detail: '按收益选手段。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：一上来全加 memo', detail: '没有定位瓶颈时，这很可能只是增加理解成本。', points: ['先量瓶颈', '先看状态边界', '再看缓存手段'] },
  { title: '高频误区 2：memo 了但 props 每次都是新引用', detail: '这样 memo 很可能并没有真正跳过多少工作。', points: ['对象', '数组', '函数引用'] },
  { title: '高频误区 3：把所有性能问题都归到 React 渲染', detail: '资源加载、请求时机和工程拆包也可能是根因。', points: ['网络', '资源', '构建优化'] },
  { title: '高频误区 4：虚拟列表被当万能答案', detail: '它主要解决节点数量问题，不会自动修好重计算和请求抖动。', points: ['减节点', '不减算法成本', '仍需配合其他手段'] },
] as const;

const rules = [
  { title: '先量后优，不先套工具', detail: '这是最稳的性能优化习惯。' },
  { title: '优先缩小更新边界', detail: '很多时候比 memo 更有效。' },
  { title: 'memo 要配稳定 props', detail: '不然收益会很差。' },
  { title: '大列表优先考虑虚拟化', detail: '节点数过大时很常见。' },
] as const;

export default function ReactPerformanceSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="React Interview / Performance"
      title="性能优化：memo、拆分、虚拟列表"
      lead="React 性能优化在面试里很容易被答成一串 API 名字，但真正有价值的是取舍顺序。什么时候该拆状态边界，什么时候该用 memo，什么时候该上虚拟列表，什么时候要回到工程和网络层，这些才像真实项目经验。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把性能问题分层）"
      definitionsNote="用意：先知道 React 性能优化不只是 memo。"
      definitions={definitions}
      relationsTitle="块 2：优化主线速览"
      relationsNote="用意：把测量、拆分、memo 和虚拟化串起来。"
      relations={relations}
      relationCodeTitle="React Performance Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 memo、拆分和虚拟列表基本盘答稳。', label: 'Performance Basics', questions: basics },
        { title: '块 4：中高级取舍问题', note: '用意：再把 props 稳定、工程联动和优化顺序补全。', label: 'Performance Tradeoff', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 React 性能题时，按瓶颈、边界、引用、节点数顺序拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把性能优化答成死模板。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆优化顺序。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={reactInterviewTheme}
    />
  );
}
