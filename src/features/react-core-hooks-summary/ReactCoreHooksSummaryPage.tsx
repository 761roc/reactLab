import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { reactInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Hooks', value: '4', detail: 'useState、useRef、useMemo、useCallback 是 React 面试里出现频率最高的一组基础 Hook。' },
  { label: 'Focus', value: 'Semantics First', detail: '这组题重点不是 API 形式，而是各自解决哪类问题。' },
  { label: 'Warning', value: 'No Blind Memo', detail: '中高级面试经常会反问：为什么这里需要 memo / callback？' },
] as const;

const definitions = [
  { title: 'useState 用于组件内可触发重渲染的状态', detail: '值变化后组件会重新渲染，是最基础也是最常用的状态 Hook。' },
  { title: 'useRef 用于跨渲染保存可变值，但更新它不会触发重渲染', detail: '常用于拿 DOM、保存定时器、保存上一次值或在途请求控制器。' },
  { title: 'useMemo 用于缓存计算结果', detail: '适合昂贵计算或需要稳定引用的派生值，但不是所有计算都值得缓存。' },
  { title: 'useCallback 用于缓存函数引用', detail: '主要是为了配合 memo 子组件、依赖数组或稳定回调引用，不是为了“函数更快”。' },
  { title: 'Hook 选型更看语义而不是背定义', detail: '状态、引用、派生值、稳定回调，这四类语义不要混。' },
  { title: '中高级 React 面试很看“是否过度优化”', detail: '无脑上 useMemo/useCallback 往往不是加分项。' },
] as const;

const relations = [
  { title: 'useState', detail: '组件状态，更新会触发渲染。', signal: 'State' },
  { title: 'useRef', detail: '可变盒子，跨渲染保存值但不触发渲染。', signal: 'Mutable Ref' },
  { title: 'useMemo', detail: '缓存某个结果值。', signal: 'Memoized Value' },
  { title: 'useCallback', detail: '缓存函数引用。', signal: 'Stable Callback' },
] as const;

const relationCode = `要驱动 UI -> useState
要跨渲染保存值但不刷新 UI -> useRef
要缓存昂贵派生结果 -> useMemo
要稳定函数引用 -> useCallback`;

const basics = [
  {
    title: '问题 1：useState 和 useRef 最容易混在哪？',
    answer: '最容易混在“都能存值”这件事上，但核心区别是 useState 会驱动渲染，useRef 不会。',
    explanation: '只要回到“这次更新需不需要刷新 UI”，通常就能选对。',
    code: `function Counter() {
  const [count, setCount] = useState(0);
  const clickCountRef = useRef(0);

  function handleClick() {
    clickCountRef.current += 1;
    setCount((value) => value + 1);
  }
}`,
    codeTitle: 'State vs Ref',
  },
  {
    title: '问题 2：useRef 常见真实用途有哪些？',
    answer: '拿 DOM、保存定时器 id、保存上一次 props、保存 AbortController 或在途请求信息都很常见。',
    explanation: '这题回答越贴真实场景越好，不要只说“获取 DOM”。',
    code: `const abortRef = useRef<AbortController | null>(null);

function load() {
  abortRef.current?.abort();
  abortRef.current = new AbortController();
}`,
    codeTitle: 'Ref for Mutable Lifecycle Data',
  },
  {
    title: '问题 3：useMemo 是不是用得越多越好？',
    answer: '不是。它本身也有维护和比较成本，只有昂贵计算、稳定引用确有收益时才值得用。',
    explanation: '这是中高级 React 面试里非常典型的反问点。',
    code: `const visibleRows = useMemo(
  () => rows.filter((row) => row.visible).sort(sortByPriority),
  [rows]
);`,
    codeTitle: 'Memoize Expensive Derivation',
  },
  {
    title: '问题 4：useCallback 什么时候才真的有意义？',
    answer: '当回调需要作为依赖项，或者要传给 memo 子组件避免无意义引用变化时，才更有意义。',
    explanation: '如果子组件不关心函数引用，单纯包一层 useCallback 可能没有实际收益。',
    code: `const handleSelect = useCallback((id: string) => {
  setSelectedId(id);
}, []);

return <MemoizedList onSelect={handleSelect} />;`,
    codeTitle: 'Stable Function Reference',
  },
] as const;

const practical = [
  {
    title: '问题 5：为什么说 useMemo / useCallback 是性能工具，不是语义工具？',
    answer: '因为它们的主要价值在于缓存和稳定引用，而不是改变业务逻辑含义；业务语义仍然应该由状态、props 和数据流表达。',
    explanation: '这句会让你的回答比纯 API 背诵更成熟。',
    code: `语义 -> state / props / data flow
优化 -> memo / useMemo / useCallback`,
    codeTitle: 'Semantics vs Optimization',
  },
  {
    title: '问题 6：为什么 stale closure 问题常和这些 Hook 一起出现？',
    answer: '因为缓存函数或值后，闭包捕获的依赖如果没写对，就可能一直拿到旧值。',
    explanation: '这题和依赖数组、effect、回调缓存会经常串在一起问。',
    code: `const handleSubmit = useCallback(() => {
  submit(formState);
}, [formState]);`,
    codeTitle: 'Keep Dependencies Accurate',
  },
  {
    title: '问题 7：useRef 和 useMemo 都能“保留”东西，它们怎么选？',
    answer: 'useRef 适合保存可变对象或命令式句柄，useMemo 适合保存由依赖计算出来的派生结果。',
    explanation: '一个偏“盒子”，一个偏“结果”，不要混。', 
    code: `const previousIdRef = useRef<string | null>(null);
const groupedRows = useMemo(() => groupRows(rows), [rows]);`,
    codeTitle: 'Mutable Box vs Derived Value',
  },
  {
    title: '问题 8：面试里怎么总结这组 Hook？',
    answer: '先按语义分类：驱动渲染的 state、不驱动渲染的 ref、缓存结果的 memo、缓存函数引用的 callback，再补一句不要过度优化。',
    explanation: '这句是很适合口头收尾的总结。',
    code: `state -> rerender
ref -> mutable no rerender
memo -> cache value
callback -> cache function`,
    codeTitle: 'Hooks Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先问这个值变了是否要刷新 UI', detail: '决定用 state 还是 ref。' },
  { title: '第二步：再问这是原始状态还是派生结果', detail: '决定是否需要 useMemo。' },
  { title: '第三步：只有引用稳定真的重要时才上 useCallback', detail: '避免为了“规范”而缓存。' },
  { title: '第四步：检查依赖数组是否准确', detail: '防止闭包拿旧值。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把 useRef 当成不渲染版 state', detail: '它更适合保存命令式或生命周期数据，而不是绕开正常数据流。', points: ['DOM', '定时器', '控制器', 'previous value'] },
  { title: '高频误区 2：无脑 useMemo / useCallback', detail: '缓存不是零成本，很多场景没有明显收益。', points: ['先量收益', '看依赖复杂度', '看子组件是否 memo'] },
  { title: '高频误区 3：依赖数组写错导致闭包旧值', detail: '这是 useCallback 和 useMemo 最常见的真实问题。', points: ['依赖完整', '避免侥幸省略', '理解闭包'] },
  { title: '高频误区 4：把优化 Hook 当成语义必需品', detail: 'React 代码先求清晰正确，再谈缓存优化。', points: ['语义优先', '优化其次', '保持可读'] },
] as const;

const rules = [
  { title: '需要驱动 UI 就用 state', detail: '这是选 Hook 的第一判断。' },
  { title: '需要可变持久引用就用 ref', detail: '尤其是命令式对象和跨渲染句柄。' },
  { title: 'memo / callback 只在有收益时再上', detail: '别做习惯性包装。' },
  { title: '依赖数组和闭包一起理解', detail: '很多 Hook 题的坑都在这里。' },
] as const;

export default function ReactCoreHooksSummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="React Interview / Hooks"
      title="Hooks 基础：useState、useRef、useMemo、useCallback"
      lead="这组 Hook 是 React 面试里最常见的一组，但真正拉开区分度的不是谁会背 API，而是谁能说清每个 Hook 的语义边界，以及什么时候该用、什么时候不该滥用。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先按语义给 Hook 分类）"
      definitionsNote="用意：先把 state、ref、memo、callback 放回各自解决的问题里。"
      definitions={definitions}
      relationsTitle="块 2：Hook 选择速览"
      relationsNote="用意：把几个最容易混的 Hook 拉开。"
      relations={relations}
      relationCodeTitle="Hook Selection"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 state/ref/memo/callback 的基本盘答稳。', label: 'Hooks Basics', questions: basics },
        { title: '块 4：中高级取舍问题', note: '用意：再把缓存收益、闭包和滥用问题说清。', label: 'Hooks Tradeoff', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 Hook 选型题时按语义和收益来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把优化 Hook 当默认模板。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆几个 Hook 的边界。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={reactInterviewTheme}
    />
  );
}
