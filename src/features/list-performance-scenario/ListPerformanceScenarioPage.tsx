import { KnowledgeSummaryPage } from '../../common/ui/KnowledgeSummaryPage';
import { scenarioTheme } from '../../common/ui/knowledge-page-themes';

const heroCards = [
  { label: 'Scenario', value: 'List Jank', detail: '上千条数据、复杂单元格、筛选搜索和滚动交互经常一起出现。' },
  { label: 'Focus', value: 'Render Less', detail: '大列表优化最稳的主线不是“更快渲染”，而是“少渲染、不重复渲染”。' },
  { label: 'Checkpoints', value: '6', detail: '数据量、渲染成本、更新频率、请求策略、布局抖动、测量验证。' },
] as const;

const definitions = [
  { title: '列表卡顿通常不是只有一个原因', detail: '可能是 DOM 太多、行组件太重、搜索时重算太频繁、图片和图表太多，甚至是滚动联动逻辑写得太重。' },
  { title: '首要目标通常是减少首屏和滚动时需要处理的节点数', detail: '因为渲染 10000 行和只渲染可视区域几十行，压力完全不是一个量级。' },
  { title: '虚拟列表是最常见的大招，但不是唯一手段', detail: '如果每一行本身很重、每次搜索都重算、或者滚动时频繁测量布局，照样会卡。' },
  { title: '优化一定要配合测量', detail: 'React Profiler、Performance 面板、FPS 和 Web Vitals 能帮你判断瓶颈到底在哪。' },
  { title: '列表优化要把“渲染”和“数据更新”分开看', detail: '有时不是滚动本身卡，而是输入筛选时每个字符都触发整表重算。' },
  { title: '别只盯着组件', detail: '图片懒加载、分页、服务端筛选、缓存命中也都可能明显影响体感。' },
] as const;

const relations = [
  { title: 'DOM 数量', detail: '可见节点越多，布局、绘制和更新成本越高。', signal: 'Render Cost' },
  { title: '行组件复杂度', detail: '图标、图表、富文本、测量逻辑都会让单行变重。', signal: 'Row Weight' },
  { title: '更新频率', detail: '搜索、筛选、排序越频繁，越要避免整表反复重算。', signal: 'Recompute' },
  { title: '可观测性', detail: '先量瓶颈再做手段，避免误优化。', signal: 'Measure First' },
] as const;

const relationCode = `列表卡顿
-> 先看渲染了多少行
-> 再看单行有多重
-> 再看输入/筛选是否频繁触发整表更新
-> 决定用虚拟列表、拆分、缓存还是服务端分页`;

const basics = [
  {
    title: '问题 1：大列表卡顿，第一步排查什么？',
    answer: '先看是不是一次性渲染了太多 DOM 节点，再看卡在首屏渲染、滚动中，还是搜索筛选时。',
    explanation: '这题最怕一上来就喊“上虚拟列表”。先分场景，后选手段，才像真实排查。',
    code: `function OrdersTable({ rows }: { rows: Order[] }) {
  return (
    <div>
      {rows.map((row) => (
        <OrderRow key={row.id} row={row} />
      ))}
    </div>
  );
}

// 如果 rows 一次有几千上万条，先怀疑节点数。`,
    codeTitle: 'Render Count First',
  },
  {
    title: '问题 2：虚拟列表到底在解决什么？',
    answer: '它解决的是“只渲染当前可见区附近的那一小部分行”，而不是让每一行 magically 更快。',
    explanation: '这句非常关键。很多人把虚拟列表理解成性能万能药，实际上它主要在降节点数量。',
    code: `function VirtualizedList({ rows }: { rows: Order[] }) {
  const visibleRows = rows.slice(startIndex, endIndex);

  return (
    <div style={{ height: totalHeight }}>
      <div style={{ transform: \`translateY(\${offsetTop}px)\` }}>
        {visibleRows.map((row) => (
          <OrderRow key={row.id} row={row} />
        ))}
      </div>
    </div>
  );
}`,
    codeTitle: 'Virtual Windowing Idea',
  },
  {
    title: '问题 3：搜索输入一敲就卡，常见原因是什么？',
    answer: '通常是每次输入都触发全量过滤、排序、分组甚至高亮计算，导致主线程连续重算。',
    explanation: '这种时候光优化列表渲染不够，还要控制更新频率和计算范围。',
    code: `const [keyword, setKeyword] = useState('');

const filteredRows = rows
  .filter((row) => row.name.includes(keyword))
  .sort(sortByPriority)
  .map(attachHighlightMeta);

// 每输入一个字符都跑整条链，数据量大时会明显卡顿。`,
    codeTitle: 'Expensive Search Pipeline',
  },
  {
    title: '问题 4：这类场景常见的稳妥优化组合是什么？',
    answer: '先做分页或虚拟列表降节点数，再对搜索做防抖或延后更新，再拆轻单行组件，最后配合缓存和测量验证。',
    explanation: '这是更像实战的组合拳，不是单点技巧背诵。',
    code: `const deferredKeyword = useDeferredValue(keyword);
const filteredRows = useMemo(
  () => filterRows(rows, deferredKeyword),
  [rows, deferredKeyword]
);`,
    codeTitle: 'Defer Heavy Recompute',
  },
] as const;

const practical = [
  {
    title: '问题 5：行组件本身很重时怎么拆？',
    answer: '把低频区域和高频变化区域拆开，重内容按需显示，图片和图表懒加载，避免每次列表更新都把整行重渲染一遍。',
    explanation: '大列表里单行如果很重，虚拟列表只能救一部分，行结构本身也要减负。',
    code: `function OrderRow({ row }: { row: Order }) {
  return (
    <article className="row">
      <OrderSummary row={row} />
      {row.expanded ? <LazyMetricsPanel orderId={row.id} /> : null}
    </article>
  );
}

const LazyMetricsPanel = lazy(() => import('./OrderMetricsPanel'));`,
    codeTitle: 'Split Heavy Row Content',
  },
  {
    title: '问题 6：服务端和前端分别能帮什么忙？',
    answer: '前端负责减少渲染和重复计算，服务端负责分页、筛选、排序、聚合，别把所有数据都先拉到浏览器再硬算。',
    explanation: '真正的大数据列表，前端优化通常需要后端接口设计配合。',
    code: `const query = useQuery({
  queryKey: ['orders', page, keyword, sortBy],
  queryFn: () => fetchOrders({ page, keyword, sortBy }),
});

// 把分页和筛选前移到接口层，比浏览器本地全量处理更稳。`,
    codeTitle: 'Server-side Filtering',
  },
  {
    title: '问题 7：如何验证优化到底有没有效果？',
    answer: '看首屏渲染时长、滚动时 FPS、搜索输入延迟、React Profiler 的 commit 时间，以及产物里有没有明显重依赖被提前加载。',
    explanation: '优化题一定要收在“怎么验证”上，不然容易变成拍脑袋。',
    code: `performance.mark('list-filter-start');
const nextRows = filterRows(rows, keyword);
performance.mark('list-filter-end');
performance.measure('list-filter', 'list-filter-start', 'list-filter-end');`,
    codeTitle: 'Measure Before and After',
  },
  {
    title: '问题 8：如果只能给一个面试式总结，怎么说？',
    answer: '先减节点数，再降单行成本，再控更新频率，最后用服务端分页和指标验证兜底。',
    explanation: '这是很适合口头表达的一句总结，结构清晰也足够实战。',
    code: `节点数 -> 单行重量 -> 更新频率 -> 服务端协作 -> 指标验证`,
    codeTitle: 'Answer Outline',
  },
] as const;

const diagnosticSteps = [
  { title: '第一步：确认卡的是首屏、滚动还是搜索', detail: '不同阶段的瓶颈通常不同。' },
  { title: '第二步：检查 DOM 数量和单行重量', detail: '这决定要不要优先上分页、虚拟列表和按需显示。' },
  { title: '第三步：检查筛选排序是否每次都全量重算', detail: '输入卡顿很多都出在这里。' },
  { title: '第四步：用服务端分页、缓存和测量闭环', detail: '把收益验证出来，避免“感觉好像快了”。' },
] as const;

const pitfalls = [
  { title: '高频误区 1：只会说虚拟列表', detail: '虚拟列表很重要，但它主要是减节点数，不会自动修好重计算和重依赖。', points: ['减节点数', '不解决所有瓶颈', '仍需测量'] },
  { title: '高频误区 2：每次输入都做整表重算', detail: '搜索、排序、分组、高亮链条叠在一起时很容易卡。', points: ['防抖', '延后更新', '缓存结果'] },
  { title: '高频误区 3：把所有数据都先拉到前端', detail: '当数据量很大时，前后端要一起做分页和筛选。', points: ['服务端分页', '服务端筛选', '减本地压力'] },
  { title: '高频误区 4：优化后不验证', detail: '没有 profiler 和指标，很难判断收益到底来自哪里。', points: ['React Profiler', 'Performance 面板', '真实交互指标'] },
] as const;

const rules = [
  { title: '大列表先减节点，再谈别的', detail: '可见区渲染是最常见的一步大优化。' },
  { title: '搜索卡顿先看计算链，而不只看 DOM', detail: '很多列表卡不是滚动卡，而是输入卡。' },
  { title: '重行内容按需显示', detail: '图表、图片、富内容不要默认全展开。' },
  { title: '优化一定要配合测量', detail: '否则很容易做成错方向。' },
] as const;

export default function ListPerformanceScenarioPage() {
  return (
    <KnowledgeSummaryPage
      eyebrow="Scenario / Performance"
      title="大列表卡顿怎么优化"
      lead="大列表优化最容易被答成“上虚拟列表就好了”，但真实场景通常更复杂。你既要看一次渲染了多少节点，也要看单行有多重、输入筛选是不是反复全量重算，还要考虑接口层能不能帮忙减压。"
      heroCards={heroCards}
      definitionsTitle="块 1：场景定义（先把卡顿拆成几类问题）"
      definitionsNote="用意：先明确卡在哪个阶段、什么因素最常见。"
      definitions={definitions}
      relationsTitle="块 2：优化主线速览"
      relationsNote="用意：把节点数、单行成本、更新频率和服务端协作串起来。"
      relations={relations}
      relationCodeTitle="List Optimization Flow"
      relationCode={relationCode}
      questionGroups={[
        { title: '块 3：基础排查问题', note: '用意：先把排查顺序说稳。', label: 'Diagnosis', questions: basics },
        { title: '块 4：实战优化问题', note: '用意：再把拆分、服务端协作和验证方式落地。', label: 'Optimization', questions: practical },
      ]}
      diagnosticTitle="块 5：四步拆题法"
      diagnosticNote="用意：面试或排查时按这个顺序讲，比较像真实工作流。"
      diagnosticSteps={diagnosticSteps}
      pitfallsTitle="块 6：常见误区"
      pitfallsNote="用意：把列表优化里最容易讲得过满或过窄的点提前拆开。"
      pitfalls={pitfalls}
      rulesTitle="块 7：记忆规则"
      rulesNote="用意：复盘时快速回忆稳定答法。"
      rules={rules}
      overviewTitle="块 8：问题总览"
      overviewNote="用意：快速回顾这页覆盖的问题。"
      themeStyle={scenarioTheme}
    />
  );
}
