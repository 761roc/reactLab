import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { reactInterviewTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Version', value: 'React 18', detail: '并发特性不是“多线程 React”，而是更灵活的调度和更好的交互优先级控制。' },
  { label: 'Focus', value: 'Urgent vs Non-urgent', detail: '核心心智是把紧急更新和可延后更新区分开。' },
  { label: 'APIs', value: 'Transition / Deferred', detail: 'startTransition、useTransition、useDeferredValue 是最常被问到的三个点。' },
] as const;

const definitions = [
  { title: '并发渲染不是指 React 在浏览器里开多个线程渲染 UI', detail: '它更准确地说是 React 能更灵活地中断、恢复和安排渲染工作，从而让高优先级交互先响应。' },
  { title: 'startTransition 用来标记非紧急更新', detail: '比如筛选结果面板、搜索结果列表、重计算视图，可以延后一点，不必抢占输入响应。' },
  { title: 'useTransition 提供 pending 状态', detail: '可以让你知道某个 transition 还在进行中，从而显示加载中提示。' },
  { title: 'useDeferredValue 用于延迟消费某个值', detail: '输入值先立刻更新，重计算逻辑稍晚跟上，很适合搜索和过滤。' },
  { title: '并发特性的目标是改善用户感知流畅度', detail: '不是让所有代码 magically 更快，而是让更重要的更新先完成。' },
  { title: '中高级面试会看你是否理解“优先级”而非 API 名字', detail: '真正关键的是你能否识别哪些更新是 urgent，哪些不是。' },
] as const;

const relations = [
  { title: 'Urgent Update', detail: '输入框光标、点击反馈、开关变化要尽快响应。', signal: 'High Priority' },
  { title: 'Transition Update', detail: '搜索结果、复杂图表、低优先视图可延后。', signal: 'Interruptible' },
  { title: 'Deferred Value', detail: '值先更新一份快的，再让慢的消费稍后跟上。', signal: 'Lagged Consumption' },
  { title: 'Pending State', detail: '帮助 UI 告知用户：次级更新还在进行。', signal: 'Progressive Feedback' },
] as const;

const relationCode = `用户输入
-> 立刻更新输入框值
-> 将重列表计算标记为 transition
-> 保证交互先响应
-> 非紧急更新随后完成`;

const basics = [
  {
    title: '问题 1：React 18 并发特性一句话怎么解释？',
    answer: '最稳的答法是：React 18 让渲染调度更灵活，能把紧急更新和非紧急更新分开处理，从而提升交互响应体验。',
    explanation: '这句避免了“多线程”这种容易误导的说法。',
    code: `startTransition(() => {
  setFilteredRows(expensiveFilter(rows, keyword));
});`,
    codeTitle: 'Mark Non-urgent Update',
  },
  {
    title: '问题 2：startTransition 适合什么场景？',
    answer: '适合用户输入已经要马上反馈，但与之相关的大计算、大列表刷新、复杂图表更新可以稍后完成的场景。',
    explanation: '这题的关键是“输入和结果区分优先级”。',
    code: `function handleChange(nextKeyword: string) {
  setKeyword(nextKeyword);

  startTransition(() => {
    setFilteredRows(filterRows(allRows, nextKeyword));
  });
}`,
    codeTitle: 'Input vs Heavy Result',
  },
  {
    title: '问题 3：useDeferredValue 和防抖有什么区别？',
    answer: '防抖是你主动延后触发，useDeferredValue 是 React 帮你以较低优先级延后消费某个值，它们解决的问题相关但不完全一样。',
    explanation: '这是 React 18 面试里很高频的对比题。',
    code: `const deferredKeyword = useDeferredValue(keyword);
const visibleRows = useMemo(
  () => filterRows(allRows, deferredKeyword),
  [allRows, deferredKeyword]
);`,
    codeTitle: 'Deferred Consumption',
  },
  {
    title: '问题 4：useTransition 的 pending 有什么价值？',
    answer: '它能让你区分“输入已经更新”但“次级视图还在更新”的状态，从而显示更友好的过渡反馈。',
    explanation: '这也是并发特性里用户体验的一环。',
    code: `const [isPending, startTransition] = useTransition();

return (
  <>
    <input value={keyword} onChange={onChange} />
    {isPending ? <span>更新结果中...</span> : null}
  </>
);`,
    codeTitle: 'Show Transition Feedback',
  },
] as const;

const practical = [
  {
    title: '问题 5：并发特性是不是所有更新都该用？',
    answer: '不是。像输入框值、按钮反馈、对话框开关这种需要立刻反应的更新就不该被降级。',
    explanation: '这题最想听到的是你知道如何区分优先级。',
    code: `setKeyword(nextKeyword); // urgent
startTransition(() => {
  setRows(filterRows(allRows, nextKeyword)); // non-urgent
});`,
    codeTitle: 'Split Priorities',
  },
  {
    title: '问题 6：并发特性和性能优化是什么关系？',
    answer: '它更像调度优化和体验优化，不会让重计算凭空消失；重逻辑本身仍然应该靠拆分、缓存、虚拟列表等手段减负。',
    explanation: '这句能防止把 transition 误解成万能性能开关。',
    code: `// transition 只是调度手段
// 真正的重计算还应优化算法或减少渲染范围`,
    codeTitle: 'Scheduling != Eliminate Cost',
  },
  {
    title: '问题 7：什么时候你更倾向 useDeferredValue？',
    answer: '当我想让原始输入值立刻保持同步，但某个派生消费逻辑可以稍后跟上，比如搜索结果、过滤列表、复杂排序视图。',
    explanation: '它很适合“快值”和“慢视图”并存的场景。',
    code: `const deferredQuery = useDeferredValue(query);
const charts = useMemo(() => buildCharts(data, deferredQuery), [data, deferredQuery]);`,
    codeTitle: 'Fast Input, Slow View',
  },
  {
    title: '问题 8：面试里怎么总结 React 18 并发特性？',
    answer: '重点讲优先级：紧急更新先保证交互响应，非紧急更新交给 transition 或 deferred value 去延后处理，同时别忘了真正的重逻辑仍然要优化。',
    explanation: '这句能把并发 API 和性能思路一起收住。',
    code: `交互优先 -> 非紧急视图延后 -> 重逻辑继续优化`,
    codeTitle: 'Concurrency Summary',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：先区分 urgent 和 non-urgent 更新', detail: '这是使用并发特性的前提。' },
  { title: '第二步：输入与重视图分离', detail: '不要让大列表刷新拖住输入反馈。' },
  { title: '第三步：再决定用 transition 还是 deferred value', detail: '一个标记更新，一个延迟消费值。' },
  { title: '第四步：别忘了优化重逻辑本身', detail: '调度优化不替代算法和渲染优化。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：把并发渲染理解成多线程', detail: '浏览器主线程模型没变，变化的是 React 的调度能力。', points: ['不是多线程', '是更灵活调度', '优先级控制'] },
  { title: '高频误区 2：什么都放到 transition', detail: '真正需要立刻反馈的更新不能降级。', points: ['输入', '点击反馈', '开关状态'] },
  { title: '高频误区 3：觉得用了 transition 就不用做性能优化', detail: '重计算和大列表本身仍然要减负。', points: ['拆分', '缓存', '虚拟列表'] },
  { title: '高频误区 4：混淆 useDeferredValue 和 debounce', detail: '一个是 React 调度语义，一个是业务层触发控制。', points: ['调度', '触发', '侧重点不同'] },
] as const;

const rules = [
  { title: '并发特性先讲优先级，不先讲 API 名字', detail: 'React 18 题的核心心智在这里。' },
  { title: '输入和结果视图分开处理', detail: '这是最常见的收益场景。' },
  { title: 'transition 是调度，不是性能魔法', detail: '成本仍然在那里。' },
  { title: 'deferred value 适合“快输入 + 慢消费”', detail: '这是它最典型的使用方式。' },
] as const;

export default function ReactConcurrencySummaryPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="React Interview / Concurrency"
      title="React 18 并发特性"
      lead="React 18 并发特性是中高级 React 面试里越来越常见的一组题。真正重要的不是 API 名字本身，而是你能否从用户体验和更新优先级的角度解释，为什么有些更新必须立刻完成，有些可以稍后再跟上。"
      heroCards={heroCards}
      definitionsTitle="块 1：基础定义（先把并发放回调度问题）"
      definitionsNote="用意：先理解它解决的是优先级和交互响应，而不是多线程。"
      definitions={definitions}
      relationsTitle="块 2：并发调度速览"
      relationsNote="用意：把 urgent、transition 和 deferred value 串起来。"
      relations={relations}
      relationCodeTitle="Concurrent Scheduling"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础高频问题', note: '用意：先把 transition 和 deferred value 的定位答稳。', label: 'Concurrency Basics', questions: basics },
        { title: '块 4：中高级取舍问题', note: '用意：再把优先级、调度和性能边界讲清。', label: 'Concurrency Tradeoff', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：遇到 React 18 并发题时，按优先级和成本来拆。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：避免把并发特性说成万能性能答案。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆并发特性的主线。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={reactInterviewTheme}
    />
  );
}
